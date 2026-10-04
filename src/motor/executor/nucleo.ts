/*
 * O núcleo do executor: instala os ganchos (`__r`) e o console no "reino"
 * onde o código do jogador roda, executa o código instrumentado e monta o
 * rastro. Não sabe onde está: o hospedeiro (Web Worker no navegador, `vm`
 * no Node) entrega o objeto global do reino e a função que avalia código
 * nele (ver sessaoNavegador.ts, executor.worker.ts e node.ts).
 *
 * No jogo, Math.random e Date são nativos. O preparo determinístico
 * (CODIGO_PREPARO) só entra quando o hospedeiro de testes pede.
 */
import { analisarCodigo, instrumentar } from "./instrumentar";
import { textoDaSaida, valorIgual } from "./formatar";
import { FIM_DA_CENA, MotorCena } from "../cena/motor";
import { type AcontecimentoCena, chaveLinhaDoTempo, type DadosCena, type RastroCena } from "../cena/modelo";
import {
  LIMITES,
  type CasoFuncao,
  type ErroExecucao,
  type EscopoMemoria,
  type FotoMemoria,
  type MedicaoPassos,
  type NivelSaida,
  type ResultadoAvaliacao,
  type ObjetoMemoria,
  type OrigemCodigo,
  type PassoRastro,
  type ResultadoExecucao,
  type ResultadoTesteFuncao,
  type SaidaConsole,
  type TipoDeclaracao,
  type ValorEsperado,
  type ValorExibido,
  type ValorMemoria,
} from "./tipos";

/** O instante fixo de `new Date()` e `Date.now()` dentro do código do jogador. */
export const AGORA_FIXO = Date.UTC(2026, 0, 5, 15, 0, 0);

/**
 * Roda UMA vez dentro do reino, antes de tudo: sorteio com semente
 * (mulberry32) e relógio parado. Texto puro (roda em outro reino).
 */
export const CODIGO_PREPARO = `(function () {
  var semente = 20260105;
  Math.random = function random() {
    semente = (semente + 0x6d2b79f5) | 0;
    var t = semente;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  var DataReal = globalThis.Date;
  var AGORA = ${AGORA_FIXO};
  function Date() {
    if (!(this instanceof Date)) return new DataReal(AGORA).toString();
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 0) return new DataReal(AGORA);
    return new (Function.prototype.bind.apply(DataReal, [null].concat(args)))();
  }
  Date.prototype = DataReal.prototype;
  Date.now = function now() { return AGORA; };
  Date.UTC = DataReal.UTC;
  Date.parse = DataReal.parse;
  globalThis.Date = Date;
})();`;

/** O que o executor precisa do lugar onde o código roda. */
export type Hospedeiro = {
  /** O objeto global do reino (no vm do Node, o objeto do contexto). */
  global: Record<string, unknown>;
  /** Avalia código no escopo global do reino (eval indireto / vm.runInContext). */
  avaliar(codigo: string): unknown;
  /** Mensagem do motor de JavaScript para um erro de sintaxe (null se compila). */
  mensagemDeSintaxe(fonte: string): string | null;
  /** Relógio real, em ms (só para o limite de tempo). */
  agora(): number;
  /** O erro que o hospedeiro lança quando o tempo reserva estoura (vm do Node), se houver. */
  ehEstouroDeTempo?(erro: unknown): boolean;
};

type Intrinsecos = {
  ReferenceError: new (mensagem: string) => Error;
  TypeError: new (mensagem: string) => Error;
  RangeError: new (mensagem: string) => Error;
  Error: new (mensagem: string) => Error;
  JSON: { parse(texto: string): unknown };
  toString: (this: unknown) => string;
  funcaoPrototipo: { toString: (this: unknown) => string };
  Array: new () => unknown[];
  Object: new () => Record<string, unknown>;
  Map: new () => Map<unknown, unknown>;
  Set: new () => Set<unknown>;
  Date: new (texto: string) => Date;
  Function: new (...partes: string[]) => (...args: unknown[]) => unknown;
};

type EscopoVivo = { id: string; tipo: "funcao" | "bloco"; decl: [string, TipoDeclaracao][]; ler: (k: number) => unknown };
type QuadroVivo = { nome: string; chamada: number; escopos: EscopoVivo[]; linha: number | null; coluna: number | null };
type Local = { linha: number | null; coluna: number | null };

const PARADA = Symbol("parada-do-jogo");
const tag = (v: unknown) => Object.prototype.toString.call(v);

function numeroTexto(n: number): string {
  return Object.is(n, -0) ? "-0" : String(n);
}

export class NucleoExecutor {
  private readonly intr: Intrinsecos;
  private readonly naoInicializadas = new Set<string>();
  private readonly globais = new Map<string, TipoDeclaracao>();
  private readonly fontes = new Map<string, string>();
  private entradas = 0;
  private chamadas = 0;
  private proximoId = 1;
  private readonly idsObjetos = new WeakMap<object, number>();

  // Estado da execução em andamento.
  private pilha: QuadroVivo[] = [];
  private passos: PassoRastro[] = [];
  private saidas: SaidaConsole[] = [];
  private gravando = true;
  private cortado = false;
  private total = 0;
  private inicio = 0;
  private parado: { tipo: "limite-passos" | "limite-tempo"; local: Local } | null = null;
  private resposta: unknown = undefined;
  private locaisDeErro = new WeakMap<object, Local>();
  private localPrimitivo: Local | null = null;
  /** Leituras de lista (lista[i]) desde o último passo: vão no passo seguinte. */
  private leituras: { id: number; indice: number }[] = [];
  private limitePassos: number = LIMITES.passos;
  private limiteTempo: number = LIMITES.tempoMs;
  /** (Cena programável) O relógio simulado e os dispositivos que o código usa. */
  private cena: MotorCena | null = null;
  /** (Cena, variosCenarios) As outras linhas do tempo do último Snippet que rodou com elas (voltam depois de recarregar). */
  private cenariosAtuais: Record<string, RastroCena> = {};

  constructor(private readonly host: Hospedeiro, opcoes: { deterministico?: boolean } = {}) {
    if (opcoes.deterministico) host.avaliar(CODIGO_PREPARO);
    this.intr = host.avaliar(
      "({ ReferenceError: ReferenceError, TypeError: TypeError, RangeError: RangeError, Error: Error, JSON: JSON, toString: Object.prototype.toString, funcaoPrototipo: Function.prototype, Array: Array, Object: Object, Map: Map, Set: Set, Date: Date, Function: Function })",
    ) as Intrinsecos;
    this.instalar();
  }

  /** Nomes globais declarados até agora (ordem de declaração). */
  listaDeGlobais(): { nome: string; declaracao: TipoDeclaracao }[] {
    return [...this.globais].map(([nome, declaracao]) => ({ nome, declaracao }));
  }

  /**
   * (Cena programável) Põe os dispositivos da cena e o `esperar` no reino
   * do código (null: tira). O Snippet recomeça a cena a cada execução; o
   * Console continua de onde ela está.
   */
  definirCena(dados: DadosCena | null) {
    if (this.cena) for (const nome of Object.keys(this.cena.globais)) delete this.host.global[nome];
    this.cena = null;
    this.cenariosAtuais = {};
    if (!dados) return;
    const cena = new MotorCena(dados, (tipo, mensagem) => new this.intr[tipo](mensagem));
    cena.passoAtual = () => (this.gravando ? this.passos.length : null);
    for (const [nome, valor] of Object.entries(cena.globais)) {
      Object.defineProperty(this.host.global, nome, { value: valor, writable: false, configurable: true, enumerable: false });
    }
    this.cena = cena;
  }

  /** (Cena programável) O rastro da simulação de agora (null: a fase não tem cena). */
  rastroDaCena(): RastroCena | null {
    return this.cena?.rastro() ?? null;
  }

  private instalar() {
    const ganchos = {
      p: (linha: number, coluna: number, depurador?: number) => {
        this.passo(linha, coluna, depurador === 1);
      },
      // f e b empilham ANTES de conferir a parada: rodam dentro do try, e o finally desempilha.
      f: (id: string, nome: string, decl: [string, TipoDeclaracao][], ler: (k: number) => unknown) => {
        this.chamadas += 1;
        this.pilha.push({ nome, chamada: this.chamadas, escopos: [{ id, tipo: "funcao", decl, ler }], linha: null, coluna: null });
        this.conferirParada();
      },
      s: () => {
        if (this.pilha.length > 1) this.pilha.pop();
      },
      b: (id: string, decl: [string, TipoDeclaracao][], ler: (k: number) => unknown) => {
        this.topo().escopos.push({ id, tipo: "bloco", decl, ler });
        this.conferirParada();
      },
      x: () => {
        const topo = this.topo();
        const minimo = this.pilha.length > 1 ? 1 : 0;
        if (topo.escopos.length > minimo) topo.escopos.pop();
      },
      ret: (valor: unknown) => {
        this.retorno(valor);
        return valor;
      },
      c: (erro: unknown) => {
        const topo = this.topo();
        const local = { linha: topo.linha, coluna: topo.coluna };
        if ((typeof erro === "object" && erro !== null) || typeof erro === "function") {
          if (!this.locaisDeErro.has(erro as object)) this.locaisDeErro.set(erro as object, local);
        } else if (!this.localPrimitivo) this.localPrimitivo = local;
      },
      t: (nomes: string[]) => {
        // O REPL do Chrome reutiliza uma ligação já inicializada: em outra
        // entrada, `let x = x + 1` pode ler o valor antigo de x.
        for (const nome of nomes) if (!this.globais.has(nome)) this.naoInicializadas.add(nome);
      },
      l: (nome: string) => {
        if (this.naoInicializadas.has(nome)) throw new this.intr.ReferenceError(`Cannot access '${nome}' before initialization`);
      },
      d: (decl: [string, TipoDeclaracao][]) => {
        for (const [nome, tipo] of decl) {
          this.naoInicializadas.delete(nome);
          this.globais.set(nome, tipo);
        }
      },
      k: (nome: string) => {
        ganchos.l(nome);
        if (this.globais.get(nome) === "const") throw new this.intr.TypeError("Assignment to constant variable.");
      },
      res: (valor: unknown) => {
        this.resposta = valor;
        return valor;
      },
      li: (objeto: unknown, chave: unknown) => {
        if (this.gravando && Array.isArray(objeto) && this.leituras.length < LIMITES.leiturasPorPasso) {
          const indice = typeof chave === "number" ? chave : Number(chave);
          if (Number.isInteger(indice) && indice >= 0) this.leituras.push({ id: this.idDe(objeto), indice });
        }
        return (objeto as Record<PropertyKey, unknown>)[chave as PropertyKey];
      },
    };
    Object.freeze(ganchos);
    Object.defineProperty(this.host.global, "__r", { value: ganchos, writable: false, configurable: false, enumerable: false });

    const registrar = (nivel: NivelSaida) =>
      (...args: unknown[]) => {
        this.registrarSaida(nivel, args);
      };
    const consoleDoJogo = {
      log: registrar("log"),
      info: registrar("info"),
      warn: registrar("warn"),
      error: registrar("error"),
      debug: registrar("debug"),
      table: registrar("log"),
      dir: registrar("log"),
      clear: () => {
        this.registrarSaida("limpar", []);
      },
    };
    Object.defineProperty(this.host.global, "console", { value: consoleDoJogo, writable: true, configurable: true, enumerable: false });

    // toString de uma função mostra o código do jogador, não o instrumentado.
    const prototipo = this.intr.funcaoPrototipo;
    const original = prototipo.toString;
    const fontes = this.fontes;
    Object.defineProperty(prototipo, "toString", {
      value: function toString(this: unknown) {
        const texto = original.call(this);
        const achado = /__r\.f\("([^"]+)"/.exec(texto);
        return achado && fontes.has(achado[1]) ? (fontes.get(achado[1]) as string) : texto;
      },
      writable: true,
      configurable: true,
    });
  }

  private topo(): QuadroVivo {
    return this.pilha[this.pilha.length - 1];
  }

  private conferirParada() {
    if (this.parado) throw PARADA;
    // O tempo da cena acabou: todo passo seguinte encerra (um try/catch do aluno não segura).
    if (this.cena?.acabou) throw FIM_DA_CENA;
  }

  private passo(linha: number, coluna: number, depurador = false) {
    this.conferirParada();
    this.total += 1;
    const topo = this.topo();
    topo.linha = linha;
    topo.coluna = coluna;
    if (this.total > this.limitePassos) {
      this.parado = { tipo: "limite-passos", local: { linha, coluna } };
      throw PARADA;
    }
    if ((this.total & 127) === 0 && this.host.agora() - this.inicio > this.limiteTempo) {
      this.parado = { tipo: "limite-tempo", local: { linha, coluna } };
      throw PARADA;
    }
    if (!this.gravando) return;
    if (this.passos.length < LIMITES.fotos) {
      const leituras = this.tirarLeituras();
      this.passos.push({ linha, coluna, tipo: "passo", memoria: this.fotografar(), saidas: this.saidas.length, ...(depurador ? { depurador: true as const } : {}), ...(leituras ? { leituras } : {}), ...this.tempoDaCena() });
    } else this.cortado = true;
  }

  /** (Cena) O instante do relógio simulado, para a linha do tempo andar junto com a cena. */
  private tempoDaCena(): { tempoMs?: number } {
    return this.cena ? { tempoMs: this.cena.relogioMs() } : {};
  }

  /** As leituras desde o último passo (e zera a lista). */
  private tirarLeituras(): { id: number; indice: number }[] | undefined {
    if (!this.leituras.length) return undefined;
    const lidas = this.leituras;
    this.leituras = [];
    return lidas;
  }

  private retorno(valor: unknown) {
    if (!this.gravando || this.parado) return;
    if (this.passos.length >= LIMITES.fotos) {
      this.cortado = true;
      return;
    }
    const topo = this.topo();
    const memoria = this.fotografar();
    this.passos.push({
      linha: topo.linha,
      coluna: topo.coluna,
      tipo: "retorno",
      memoria,
      saidas: this.saidas.length,
      retorno: { funcao: topo.nome, valor: this.paraMemoria(valor, memoria.monte, { n: 0 }) },
      ...this.tempoDaCena(),
    });
  }

  private registrarSaida(nivel: NivelSaida | "limpar", args: unknown[]) {
    if (!this.gravando) return;
    if (nivel === "limpar") {
      this.saidas.push({ nivel: "info", partes: [], formato: false, texto: "O console foi limpo", linha: this.topo().linha, limpar: true });
      return;
    }
    if (this.saidas.length >= LIMITES.saidas) return;
    const partes = args.map((arg) => this.paraExibido(arg, LIMITES.profundidade));
    const formato = typeof args[0] === "string";
    this.saidas.push({ nivel, partes, formato, texto: textoDaSaida(partes, formato), linha: this.topo().linha });
  }

  // ---------- valores ----------

  private idDe(objeto: object): number {
    let id = this.idsObjetos.get(objeto);
    if (id === undefined) {
      id = this.proximoId++;
      this.idsObjetos.set(objeto, id);
    }
    return id;
  }

  private nomeDaClasse(objeto: object): string | null {
    try {
      const proto = Object.getPrototypeOf(objeto) as { constructor?: { name?: unknown } } | null;
      if (!proto) return null;
      const nome = proto.constructor?.name;
      return typeof nome === "string" && nome ? nome : null;
    } catch {
      return null;
    }
  }

  private dadosDaFuncao(f: (...args: unknown[]) => unknown): { nome: string; texto: string; seta: boolean; classe: boolean } {
    let texto = "";
    try {
      texto = this.intr.funcaoPrototipo.toString.call(f);
    } catch {
      texto = "function () { [código nativo] }";
    }
    const classe = texto.startsWith("class");
    const seta = !classe && !texto.startsWith("function") && !texto.startsWith("async") && /^[^{]*=>/.test(texto) && !Object.prototype.hasOwnProperty.call(f, "prototype");
    const nome = typeof f.name === "string" && f.name ? f.name : "(anônima)";
    return { nome, texto: texto.length > 2000 ? `${texto.slice(0, 2000)}…` : texto, seta, classe };
  }

  private ler(objeto: object, chave: string): unknown {
    try {
      return (objeto as Record<string, unknown>)[chave];
    } catch {
      return undefined;
    }
  }

  /** Cópia de um valor para o Console (árvore com profundidade limitada). */
  paraExibido(valor: unknown, profundidade: number, vistos: object[] = []): ValorExibido {
    switch (typeof valor) {
      case "undefined":
        return { t: "undefined" };
      case "boolean":
        return { t: "boolean", v: valor };
      case "number":
        return { t: "number", v: numeroTexto(valor) };
      case "string":
        return { t: "string", v: valor };
      case "bigint":
        return { t: "bigint", v: valor.toString() };
      case "symbol":
        return { t: "symbol", v: valor.toString() };
      case "function": {
        const dados = this.dadosDaFuncao(valor as (...args: unknown[]) => unknown);
        return { t: "funcao", nome: dados.nome, texto: dados.texto, seta: dados.seta, ...(dados.classe ? { classe: true as const } : {}) };
      }
      default:
        break;
    }
    if (valor === null) return { t: "null" };
    const objeto = valor as object;
    const marca = tag(objeto);
    if (marca === "[object Error]") {
      return { t: "erro", nome: String(this.ler(objeto, "name") ?? "Error"), mensagem: String(this.ler(objeto, "message") ?? "") };
    }
    if (marca === "[object Date]") {
      let texto = "Invalid Date";
      try {
        texto = String(objeto);
      } catch {
        /* data inválida */
      }
      return { t: "data", texto };
    }
    if (vistos.includes(objeto) || profundidade <= 0) {
      if (Array.isArray(objeto)) return { t: "fundo", resumo: `Array(${objeto.length})` };
      const classe = this.nomeDaClasse(objeto);
      return { t: "fundo", resumo: classe && classe !== "Object" ? classe : "{…}" };
    }
    const dentro = [...vistos, objeto];
    if (Array.isArray(objeto)) {
      const itens: ValorExibido[] = [];
      const ate = Math.min(objeto.length, LIMITES.itens);
      for (let i = 0; i < ate; i += 1) itens.push(this.paraExibido(this.ler(objeto, String(i)), profundidade - 1, dentro));
      return { t: "array", itens, tamanho: objeto.length, ...(objeto.length > ate ? { cortado: true as const } : {}) };
    }
    if (marca === "[object Map]") {
      const mapa = objeto as Map<unknown, unknown>;
      const entradas: [ValorExibido, ValorExibido][] = [];
      for (const [chave, v] of mapa) {
        if (entradas.length >= LIMITES.itens) break;
        entradas.push([this.paraExibido(chave, profundidade - 1, dentro), this.paraExibido(v, profundidade - 1, dentro)]);
      }
      return { t: "map", entradas, tamanho: mapa.size };
    }
    if (marca === "[object Set]") {
      const conjunto = objeto as Set<unknown>;
      const itens: ValorExibido[] = [];
      for (const item of conjunto) {
        if (itens.length >= LIMITES.itens) break;
        itens.push(this.paraExibido(item, profundidade - 1, dentro));
      }
      return { t: "set", itens, tamanho: conjunto.size };
    }
    const chaves = Object.keys(objeto);
    const entradas: [string, ValorExibido][] = chaves
      .slice(0, LIMITES.itens)
      .map((chave) => [chave, this.paraExibido(this.ler(objeto, chave), profundidade - 1, dentro)]);
    return { t: "objeto", classe: this.nomeDaClasse(objeto), entradas, ...(chaves.length > entradas.length ? { cortado: true as const } : {}) };
  }

  /** Um valor na memória: objetos entram no monte (uma vez só por foto) e ficam por referência. */
  private paraMemoria(valor: unknown, monte: Record<string, ObjetoMemoria>, conta: { n: number }): ValorMemoria {
    switch (typeof valor) {
      case "undefined":
        return { t: "undefined" };
      case "boolean":
        return { t: "boolean", v: valor };
      case "number":
        return { t: "number", v: numeroTexto(valor) };
      case "string":
        return { t: "string", v: valor };
      case "bigint":
        return { t: "bigint", v: valor.toString() };
      case "symbol":
        return { t: "symbol", v: valor.toString() };
      case "function": {
        const dados = this.dadosDaFuncao(valor as (...args: unknown[]) => unknown);
        return { t: "funcao", nome: dados.nome, seta: dados.seta };
      }
      default:
        break;
    }
    if (valor === null) return { t: "null" };
    const objeto = valor as object;
    const id = this.idDe(objeto);
    const chave = String(id);
    if (chave in monte || conta.n >= 200) return { t: "ref", id };
    conta.n += 1;
    const marca = tag(objeto);
    if (marca === "[object Error]") {
      monte[chave] = { t: "erro", nome: String(this.ler(objeto, "name") ?? "Error"), mensagem: String(this.ler(objeto, "message") ?? "") };
    } else if (marca === "[object Date]") {
      monte[chave] = { t: "data", texto: String(objeto) };
    } else if (Array.isArray(objeto)) {
      const registro: ObjetoMemoria = { t: "array", itens: [], tamanho: objeto.length };
      monte[chave] = registro;
      const ate = Math.min(objeto.length, LIMITES.itens);
      for (let i = 0; i < ate; i += 1) registro.itens.push(this.paraMemoria(this.ler(objeto, String(i)), monte, conta));
    } else if (marca === "[object Map]") {
      const registro: ObjetoMemoria = { t: "map", entradas: [] };
      monte[chave] = registro;
      for (const [k, v] of objeto as Map<unknown, unknown>) {
        if (registro.entradas.length >= LIMITES.itens) break;
        registro.entradas.push([this.paraMemoria(k, monte, conta), this.paraMemoria(v, monte, conta)]);
      }
    } else if (marca === "[object Set]") {
      const registro: ObjetoMemoria = { t: "set", itens: [] };
      monte[chave] = registro;
      for (const item of objeto as Set<unknown>) {
        if (registro.itens.length >= LIMITES.itens) break;
        registro.itens.push(this.paraMemoria(item, monte, conta));
      }
    } else {
      const registro: ObjetoMemoria = { t: "objeto", classe: this.nomeDaClasse(objeto), entradas: [] };
      monte[chave] = registro;
      for (const campo of Object.keys(objeto).slice(0, LIMITES.itens)) {
        registro.entradas.push([campo, this.paraMemoria(this.ler(objeto, campo), monte, conta)]);
      }
    }
    return { t: "ref", id };
  }

  private fotografar(): FotoMemoria {
    const monte: Record<string, ObjetoMemoria> = {};
    const conta = { n: 0 };
    const quadros = this.pilha.map((quadro, indice) => {
      const escopos: EscopoMemoria[] = [];
      if (indice === 0) {
        const variaveis = [...this.globais]
          .filter(([nome]) => !this.naoInicializadas.has(nome) && nome in this.host.global)
          .map(([nome, declaracao]) => ({ nome, declaracao, valor: this.paraMemoria(this.ler(this.host.global, nome), monte, conta) }));
        escopos.push({ id: "global", tipo: "global", variaveis });
      }
      for (const escopo of quadro.escopos) {
        const variaveis = [];
        for (let k = 0; k < escopo.decl.length; k += 1) {
          let valor: unknown;
          try {
            valor = escopo.ler(k);
          } catch {
            continue; // ainda na zona morta (let/const antes da linha que cria)
          }
          const [nome, declaracao] = escopo.decl[k];
          variaveis.push({ nome, declaracao, valor: this.paraMemoria(valor, monte, conta) });
        }
        escopos.push({ id: escopo.id, tipo: escopo.tipo, variaveis });
      }
      return { nome: quadro.nome, chamada: quadro.chamada, escopos, linha: quadro.linha };
    });
    return { quadros, monte };
  }

  // ---------- execução ----------

  private comecar(gravando: boolean) {
    this.pilha = [{ nome: "Global", chamada: 0, escopos: [], linha: null, coluna: null }];
    this.passos = [];
    this.saidas = [];
    this.gravando = gravando;
    this.cortado = false;
    this.total = 0;
    this.inicio = this.host.agora();
    this.parado = null;
    this.resposta = undefined;
    this.locaisDeErro = new WeakMap();
    this.localPrimitivo = null;
    this.leituras = [];
    this.limitePassos = LIMITES.passos;
    this.limiteTempo = LIMITES.tempoMs;
  }

  private descreverErro(erro: unknown): ErroExecucao {
    if (this.parado) {
      const { tipo, local } = this.parado;
      return {
        tipo,
        nome: "Parada do jogo",
        mensagem:
          tipo === "limite-passos"
            ? `O programa passou de ${LIMITES.passos.toLocaleString("pt-BR")} passos e o jogo parou ele.`
            : `O programa rodou por mais de ${LIMITES.tempoMs / 1000} segundos e o jogo parou ele.`,
        linha: local.linha,
        coluna: local.coluna,
        ...(this.cena ? { naCena: this.cena.esperou() ? ("esperar-curto" as const) : ("sem-esperar" as const) } : {}),
      };
    }
    if (erro === FIM_DA_CENA) {
      const topo = this.topo();
      return { tipo: "execucao", nome: "", mensagem: "O tempo da cena acabou antes de a função terminar.", linha: topo.linha, coluna: topo.coluna };
    }
    if (this.host.ehEstouroDeTempo?.(erro)) {
      const topo = this.topo();
      return {
        tipo: "limite-tempo",
        nome: "Parada do jogo",
        mensagem: `O programa rodou por mais de ${LIMITES.reservaMs / 1000} segundos e o jogo parou ele.`,
        linha: topo.linha,
        coluna: topo.coluna,
      };
    }
    const ehObjeto = (typeof erro === "object" && erro !== null) || typeof erro === "function";
    const local = ehObjeto ? this.locaisDeErro.get(erro as object) : this.localPrimitivo;
    const global = this.pilha[0];
    const onde = local ?? { linha: global.linha, coluna: global.coluna };
    if (ehObjeto && tag(erro) === "[object Error]") {
      return {
        tipo: "execucao",
        nome: String(this.ler(erro as object, "name") ?? "Error"),
        mensagem: String(this.ler(erro as object, "message") ?? ""),
        linha: onde.linha,
        coluna: onde.coluna,
      };
    }
    const exibido = this.paraExibido(erro, 2);
    return { tipo: "execucao", nome: "", mensagem: exibido.t === "string" ? exibido.v : String(erro), linha: onde.linha, coluna: onde.coluna };
  }

  /** Roda uma entrada do Console ou o Snippet, na mesma sessão (as globais continuam). */
  executar(
    fonteOriginal: string,
    origem: OrigemCodigo,
    opcoes: {
      gravar?: boolean;
      /** (Cena, Snippet) Outras linhas do tempo: o código roda com cada uma antes (validador variosCenarios). */
      cenarios?: readonly AcontecimentoCena[][];
      /** (Cena, Snippet) A linha do tempo desta execução (padrão: a da cena). */
      linhaDoTempo?: AcontecimentoCena[];
    } = {},
  ): ResultadoExecucao {
    // Cena: as outras linhas do tempo rodam antes, em silêncio; a execução de verdade é a última (a memória fica a dela).
    const cenarios: Record<string, RastroCena> = {};
    if (this.cena && origem === "snippet" && opcoes.cenarios?.length && fonteOriginal.trim()) {
      for (const linha of opcoes.cenarios) {
        const variante = this.executar(fonteOriginal, origem, { gravar: false, linhaDoTempo: linha });
        if (variante.cena) cenarios[chaveLinhaDoTempo(linha)] = variante.cena;
      }
    }
    this.entradas += 1;
    const gravar = opcoes.gravar ?? true;
    this.comecar(gravar);
    const cena = this.cena;
    // Executar recomeça a cena do zero; o Console continua de onde ela está.
    if (cena && origem === "snippet" && fonteOriginal.trim()) cena.reiniciar(opcoes.linhaDoTempo);
    cena?.comecarExecucao(this.entradas);
    if (Object.keys(cenarios).length) this.cenariosAtuais = cenarios;
    const daCena = (): Pick<ResultadoExecucao, "cena" | "cenarios"> =>
      cena ? { cena: cena.rastro(), ...(Object.keys(this.cenariosAtuais).length ? { cenarios: this.cenariosAtuais } : {}) } : {};
    const vazio = (erro: ErroExecucao | null, fonte: string): ResultadoExecucao => ({
      origem,
      codigo: fonte,
      resultado: { t: "undefined" },
      saidas: [],
      erro,
      passos: [],
      rastroCortado: false,
      totalPassos: 0,
      memoriaFinal: this.fotografar(),
      globais: this.listaDeGlobais(),
      sintaxes: [],
      ...daCena(),
    });
    if (!fonteOriginal.trim()) return vazio(null, fonteOriginal);

    const inst = instrumentar(fonteOriginal, { origem, prefixo: `c${this.entradas}` });
    if (!inst.ok) {
      const nativa = inst.naoSuportado ? null : this.host.mensagemDeSintaxe(fonteOriginal);
      return vazio(
        {
          tipo: inst.naoSuportado ? "nao-suportado" : "sintaxe",
          nome: "SyntaxError",
          mensagem: nativa ?? inst.erro.mensagem,
          linha: inst.erro.linha,
          coluna: inst.erro.coluna,
        },
        fonteOriginal,
      );
    }
    for (const [id, texto] of Object.entries(inst.fontes)) this.fontes.set(id, texto);

    let erro: ErroExecucao | null = null;
    try {
      this.host.avaliar(inst.codigo);
      if (this.parado) erro = this.descreverErro(PARADA);
    } catch (e) {
      // O tempo da cena acabou: a simulação terminou, não é erro (o loop de controle para junto com ela).
      erro = !this.parado && (e === FIM_DA_CENA || cena?.acabou) ? null : this.descreverErro(e);
    }
    this.pilha.length = 1;
    this.pilha[0].escopos.length = 0;
    const memoriaFinal = this.fotografar();
    if (gravar) {
      const leituras = this.tirarLeituras();
      this.passos.push({
        linha: erro?.linha ?? null,
        coluna: erro?.coluna ?? null,
        tipo: erro ? "erro" : "fim",
        memoria: memoriaFinal,
        saidas: this.saidas.length,
        ...(leituras ? { leituras } : {}),
        ...this.tempoDaCena(),
      });
    }
    cena?.terminarExecucao(origem === "snippet");
    return {
      origem,
      codigo: inst.fonte,
      resultado: erro ? { t: "undefined" } : this.paraExibido(this.resposta, LIMITES.profundidade),
      saidas: this.saidas,
      erro,
      passos: this.passos,
      rastroCortado: this.cortado,
      totalPassos: this.total,
      memoriaFinal,
      globais: this.listaDeGlobais(),
      sintaxes: inst.sintaxes,
      ...daCena(),
    };
  }

  /**
   * Mede quantos passos a função global `nome` dá com cada chamada (o
   * gráfico passos x tamanho): sem rastro, com um limite bem maior que o
   * de uma execução. `chamadas`: os argumentos (JSON) de cada medição.
   */
  medirPassos(nome: string, chamadas: readonly { tamanho: number; args: ValorEsperado[] }[]): MedicaoPassos[] {
    return this.semMexerNaCena(() => this.medirPassosDentro(nome, chamadas));
  }

  /**
   * (Cena) Testes de função, medições e o Observar chamam o código do aluno
   * fora de uma execução: a cena volta como estava (um teste não liga a
   * lâmpada da simulação de verdade).
   */
  private semMexerNaCena<T>(rodar: () => T): T {
    const cena = this.cena;
    if (!cena) return rodar();
    const marca = cena.marcar();
    // Cada teste começa com a cena do começo (o relógio em zero).
    cena.reiniciar();
    cena.comecarExecucao(0);
    try {
      return rodar();
    } finally {
      cena.voltar(marca);
    }
  }

  private medirPassosDentro(nome: string, chamadas: readonly { tamanho: number; args: ValorEsperado[] }[]): MedicaoPassos[] {
    const funcao = this.globais.has(nome) || nome in this.host.global ? this.ler(this.host.global, nome) : undefined;
    return chamadas.map(({ tamanho, args }) => {
      if (typeof funcao !== "function") return { funcao: nome, tamanho, passos: 0, passouDoLimite: false, erro: `não existe função ${nome}` };
      this.comecar(false);
      this.limitePassos = LIMITES.passosMedicao;
      this.limiteTempo = LIMITES.tempoMedicaoMs;
      let erro: string | null = null;
      try {
        const reais = this.intr.JSON.parse(JSON.stringify(args)) as unknown[];
        (funcao as (...a: unknown[]) => unknown)(...reais);
      } catch (e) {
        if (!this.parado) {
          const descrito = this.descreverErro(e);
          erro = descrito.nome ? `${descrito.nome}: ${descrito.mensagem}` : descrito.mensagem;
        }
      }
      const passouDoLimite = this.parado !== null;
      const passos = this.total;
      this.pilha.length = 1;
      this.comecar(false);
      return { funcao: nome, tamanho, passos: Math.min(passos, LIMITES.passosMedicao), passouDoLimite, erro };
    });
  }

  /**
   * Avalia expressões numa foto da memória (o painel Observar e o Console do
   * depurador pausado): as variáveis valem o que valiam naquele passo, no
   * quadro `quadro` (0 = o global). As globais que ainda não existiam ali dão
   * ReferenceError, como no Chrome. Roda numa cópia: nada muda no programa.
   */
  avaliarNaFoto(expressoes: readonly string[], foto: FotoMemoria, quadro: number): ResultadoAvaliacao[] {
    return this.semMexerNaCena(() => this.avaliarNaFotoDentro(expressoes, foto, quadro));
  }

  private avaliarNaFotoDentro(expressoes: readonly string[], foto: FotoMemoria, quadro: number): ResultadoAvaliacao[] {
    const valores = new Map<string, unknown>();
    const feitos = new Map<number, unknown>();
    const criar = (valor: ValorMemoria): unknown => {
      switch (valor.t) {
        case "undefined":
          return undefined;
        case "null":
          return null;
        case "boolean":
          return valor.v;
        case "number":
          return Number(valor.v);
        case "string":
          return valor.v;
        case "bigint":
          return BigInt(valor.v);
        case "symbol":
          return Symbol(valor.v.replace(/^Symbol\((.*)\)$/, "$1"));
        case "funcao": {
          const viva = this.ler(this.host.global, valor.nome);
          if (typeof viva === "function") return viva;
          return new this.intr.Function(`return function ${/^[A-Za-z_$][\w$]*$/.test(valor.nome) ? valor.nome : ""}() {}`)();
        }
        case "ref":
          break;
      }
      if (feitos.has(valor.id)) return feitos.get(valor.id);
      const objeto = foto.monte[String(valor.id)];
      if (!objeto) return undefined;
      switch (objeto.t) {
        case "array": {
          const lista = new this.intr.Array();
          feitos.set(valor.id, lista);
          for (const item of objeto.itens) lista.push(criar(item));
          lista.length = objeto.tamanho;
          return lista;
        }
        case "objeto": {
          const registro = new this.intr.Object();
          feitos.set(valor.id, registro);
          for (const [chave, v] of objeto.entradas) registro[chave] = criar(v);
          return registro;
        }
        case "map": {
          const mapa = new this.intr.Map();
          feitos.set(valor.id, mapa);
          for (const [k, v] of objeto.entradas) mapa.set(criar(k), criar(v));
          return mapa;
        }
        case "set": {
          const conjunto = new this.intr.Set();
          feitos.set(valor.id, conjunto);
          for (const item of objeto.itens) conjunto.add(criar(item));
          return conjunto;
        }
        case "erro": {
          const erro = new this.intr.Error(objeto.mensagem);
          erro.name = objeto.nome;
          feitos.set(valor.id, erro);
          return erro;
        }
        case "data": {
          const data = new this.intr.Date(objeto.texto);
          feitos.set(valor.id, data);
          return data;
        }
      }
    };
    // De fora para dentro: o global, depois os escopos do quadro escolhido (a de dentro vence).
    const global = foto.quadros[0]?.escopos.find((escopo) => escopo.tipo === "global");
    const escolhido = foto.quadros[Math.max(0, Math.min(quadro, foto.quadros.length - 1))];
    const escopos = [...(global ? [global] : []), ...(escolhido?.escopos.filter((escopo) => escopo.tipo !== "global") ?? [])];
    for (const escopo of escopos) for (const variavel of escopo.variaveis) valores.set(variavel.nome, criar(variavel.valor));
    const indisponiveis = new Set([...this.globais.keys()].filter((nome) => !valores.has(nome)));
    const ReferenceErrorDoReino = this.intr.ReferenceError;
    const escopo = new Proxy(Object.create(null) as object, {
      has: (_alvo, nome) => typeof nome === "string" && (valores.has(nome) || indisponiveis.has(nome)),
      get: (_alvo, nome) => {
        if (typeof nome !== "string") return undefined;
        if (indisponiveis.has(nome)) throw new ReferenceErrorDoReino(`${nome} is not defined`);
        return valores.get(nome);
      },
      set: (_alvo, nome, valor) => {
        if (typeof nome === "string") {
          valores.set(nome, valor);
          indisponiveis.delete(nome);
        }
        return true;
      },
    });
    return expressoes.map((expressao) => {
      const lido = analisarCodigo(`(${expressao}\n)`);
      if (!expressao.trim() || !lido.ok || lido.programa.body.length !== 1 || lido.programa.body[0].type !== "ExpressionStatement") {
        return { expressao, erro: "SyntaxError: não é uma expressão" };
      }
      this.comecar(false);
      try {
        const avaliar = new this.intr.Function("__escopo", `with (__escopo) { return (${expressao}\n); }`);
        const valor = avaliar(escopo);
        if (this.parado) return { expressao, erro: this.descreverErro(PARADA).mensagem };
        return { expressao, valor: this.paraExibido(valor, LIMITES.profundidade) };
      } catch (e) {
        const erro = this.descreverErro(e);
        return { expressao, erro: erro.nome ? `${erro.nome}: ${erro.mensagem}` : erro.mensagem };
      } finally {
        this.pilha.length = 1;
      }
    });
  }

  /**
   * Chama uma função global do jogador com cada caso (validador `funcaoPassa`).
   * Os argumentos nascem dentro do reino (JSON.parse de lá). Não grava rastro.
   */
  testarFuncao(nome: string, casos: readonly CasoFuncao[]): ResultadoTesteFuncao {
    return this.semMexerNaCena(() => this.testarFuncaoDentro(nome, casos));
  }

  private testarFuncaoDentro(nome: string, casos: readonly CasoFuncao[]): ResultadoTesteFuncao {
    const funcao = this.globais.has(nome) || nome in this.host.global ? this.ler(this.host.global, nome) : undefined;
    const existe = typeof funcao === "function";
    const resultados = casos.map((caso) => {
      if (!existe) return { args: caso.args, esperado: caso.esperado, obtido: null, erro: null, passou: false };
      this.comecar(false);
      let erro: ErroExecucao | null = null;
      let obtido: ValorExibido | null = null;
      try {
        const args = this.intr.JSON.parse(JSON.stringify(caso.args)) as unknown[];
        const valor = (funcao as (...a: unknown[]) => unknown)(...args);
        if (this.parado) erro = this.descreverErro(PARADA);
        else obtido = this.paraExibido(valor, 8);
      } catch (e) {
        erro = this.descreverErro(e);
      }
      this.pilha.length = 1;
      return { args: caso.args, esperado: caso.esperado, obtido, erro, passou: !erro && valorIgual(obtido, caso.esperado) };
    });
    return { nome, existe, casos: resultados, passou: existe && resultados.every((r) => r.passou) };
  }
}
