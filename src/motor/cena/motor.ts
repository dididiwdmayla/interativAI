/*
 * O motor de uma cena dentro do executor: o relógio simulado, os
 * dispositivos que o código do aluno usa e o rastro das mudanças.
 *
 * - `esperar(ms)` avança o relógio da simulação (não espera de verdade: o
 *   executor continua síncrono). Os sensores leem a linha do tempo do
 *   cenário no instante do relógio.
 * - Quando o relógio passa do fim da cena, a simulação termina: o motor
 *   lança FIM_DA_CENA e o executor encerra a execução sem erro ("a
 *   simulação terminou"). É assim que um `while (true)` com `esperar()`
 *   dentro termina. Um loop sem `esperar()` não anda no tempo e cai na
 *   proteção de sempre (passos demais).
 * - Executar (o Snippet) recomeça a cena do zero; o Console continua de
 *   onde ela está (como a memória). Depois do Snippet, o relógio vai até o
 *   fim da cena: o mundo continua mesmo que o código já tenha parado.
 *
 * Os objetos moram no reino do código (o Web Worker no jogo, o vm do Node
 * nos testes); os erros são os do reino (TypeError, RangeError).
 */
import { CATALOGO_DISPOSITIVOS, LETRAS_DO_LETREIRO, type TipoDispositivo } from "./catalogo";
import {
  type AcontecimentoCena,
  type DadosCena,
  type EstadoDispositivos,
  estadoInicialDaCena,
  estadoNoTempo,
  type FiltroPasso,
  MAXIMO_MUDANCAS,
  type MudancaCena,
  mudancaVale,
  type RastroCena,
  type ValorCena,
} from "./modelo";

/** O sinal de que o tempo da cena acabou (não é erro: a simulação terminou). */
export const FIM_DA_CENA = Symbol("fim-da-cena");

type CriarErro = (tipo: "TypeError" | "RangeError", mensagem: string) => Error;

/** O que o motor guarda para voltar depois (os testes de função não mexem na cena). */
type Marca = {
  linhaDoTempo: AcontecimentoCena[];
  relogio: number;
  mudancas: MudancaCena[];
  estado: EstadoDispositivos;
  acabou: boolean;
  esperou: boolean;
  cortado: boolean;
  execucao: number;
  inicioUltima: number;
  fimCodigo: number | null;
  terminouPorTempo: boolean;
};

export class MotorCena {
  private linhaDoTempo: AcontecimentoCena[];
  private relogio = 0;
  private mudancas: MudancaCena[] = [];
  private cortado = false;
  private estado: EstadoDispositivos = {};
  private execucao = 0;
  private inicioUltima = 0;
  private fimCodigo: number | null = null;
  private terminouPorTempo = false;
  private esperouAgora = false;
  /** O tempo acabou nesta execução: todo passo seguinte encerra (nem um try/catch do aluno segura). */
  acabou = false;
  /** O passo do rastro de agora (o executor preenche): a mudança fica ligada à linha que a fez. */
  passoAtual: () => number | null = () => null;
  /** Os objetos que o código usa, pelo nome (com `esperar`). */
  readonly globais: Record<string, unknown> = {};
  private readonly inicial: EstadoDispositivos;

  constructor(
    private readonly dados: DadosCena,
    private readonly criarErro: CriarErro,
  ) {
    this.linhaDoTempo = dados.linhaDoTempo;
    this.inicial = estadoInicialDaCena(dados);
    this.reiniciar();
    for (const dispositivo of dados.dispositivos) this.globais[dispositivo.id] = this.criarObjeto(dispositivo.id, dispositivo.tipo);
    const esperar = (ms?: unknown) => {
      this.esperar(ms);
    };
    this.globais.esperar = nomear(esperar, "esperar");
  }

  /** A cena volta ao começo (Executar), com a linha do tempo da fase ou outra (variosCenarios). */
  reiniciar(linhaDoTempo: AcontecimentoCena[] = this.dados.linhaDoTempo) {
    this.linhaDoTempo = linhaDoTempo;
    this.relogio = 0;
    this.mudancas = [];
    this.cortado = false;
    this.estado = estadoInicialDaCena(this.dados);
    this.inicioUltima = 0;
    this.fimCodigo = null;
    this.terminouPorTempo = false;
  }

  /** Uma execução começa (o Snippet depois de reiniciar, ou uma entrada do Console). */
  comecarExecucao(execucao: number) {
    this.execucao = execucao;
    this.inicioUltima = this.relogio;
    this.acabou = false;
    this.terminouPorTempo = false;
    this.esperouAgora = false;
  }

  /** A execução terminou. Depois do Snippet, o mundo continua até o fim da cena. */
  terminarExecucao(doSnippet: boolean) {
    this.fimCodigo = this.relogio;
    if (this.acabou) this.terminouPorTempo = true;
    if (doSnippet) this.relogio = this.dados.duracaoMs;
    this.acabou = false;
  }

  esperou(): boolean {
    return this.esperouAgora;
  }

  relogioMs(): number {
    return this.relogio;
  }

  /** Guarda a simulação de agora (para voltar a ela depois de um teste de função). */
  marcar(): Marca {
    return {
      linhaDoTempo: this.linhaDoTempo,
      relogio: this.relogio,
      mudancas: this.mudancas.slice(),
      estado: structuredClone(this.estado),
      acabou: this.acabou,
      esperou: this.esperouAgora,
      cortado: this.cortado,
      execucao: this.execucao,
      inicioUltima: this.inicioUltima,
      fimCodigo: this.fimCodigo,
      terminouPorTempo: this.terminouPorTempo,
    };
  }

  voltar(marca: Marca) {
    this.linhaDoTempo = marca.linhaDoTempo;
    this.relogio = marca.relogio;
    this.mudancas = marca.mudancas;
    this.estado = marca.estado;
    this.acabou = marca.acabou;
    this.esperouAgora = marca.esperou;
    this.cortado = marca.cortado;
    this.execucao = marca.execucao;
    this.inicioUltima = marca.inicioUltima;
    this.fimCodigo = marca.fimCodigo;
    this.terminouPorTempo = marca.terminouPorTempo;
  }

  /**
   * (Depurador pausado) A cena no instante de um passo da execução mais
   * recente: o relógio nele e só as mudanças feitas até ali. O Observar e o
   * Console pausado leem os dispositivos como estavam, igual ao palco.
   * Use dentro de marcar/voltar (a simulação de verdade volta depois).
   */
  posicionar(tempoMs: number, passo: number) {
    const filtro: FiltroPasso = { execucao: this.execucao, passo };
    this.mudancas = this.mudancas.filter((mudanca) => mudancaVale(mudanca, tempoMs, { filtro }));
    this.relogio = Math.max(0, Math.min(tempoMs, this.dados.duracaoMs));
    this.estado = estadoNoTempo(this.rastroLeve(), this.relogio);
    this.acabou = false;
  }

  /** O rastro da simulação de agora (uma cópia: as próximas execuções não mexem nela). */
  rastro(): RastroCena {
    const inicial = estadoInicialDaCena(this.dados);
    return {
      cenaId: this.dados.id,
      duracaoMs: this.dados.duracaoMs,
      linhaDoTempo: this.linhaDoTempo.map((item) => ({ ...item })),
      dispositivos: this.dados.dispositivos.map(({ id, tipo }) => ({ id, tipo })),
      inicial,
      mudancas: this.mudancas.map((mudanca) => ({ ...mudanca })),
      cortado: this.cortado,
      relogioMs: this.relogio,
      execucao: this.execucao,
      inicioUltimaMs: this.inicioUltima,
      fimCodigoMs: this.fimCodigo,
      terminouPorTempo: this.terminouPorTempo,
      esperou: this.esperouAgora,
    };
  }

  /* ---------------------------------------------------------------- */

  private esperar(ms: unknown) {
    if (typeof ms !== "number" || Number.isNaN(ms)) throw this.criarErro("TypeError", "esperar precisa de um número: quantos milissegundos esperar, como esperar(500).");
    if (ms < 0) throw this.criarErro("RangeError", "esperar não volta no tempo: use um número de 0 para cima.");
    this.esperouAgora = true;
    if (this.acabou) throw FIM_DA_CENA;
    const fim = this.dados.duracaoMs;
    if (this.relogio + ms >= fim) {
      this.relogio = fim;
      this.acabou = true;
      throw FIM_DA_CENA;
    }
    this.relogio += ms;
  }

  /** O valor de agora: o estado que o código controla, ou o que o mundo mostra (sensores, temperatura). */
  private ler(id: string, propriedade: string): ValorCena | undefined {
    const doMundo = CATALOGO_DISPOSITIVOS[this.tipoDe(id)].propriedades.find((p) => p.nome === propriedade)?.doMundo;
    if (!doMundo) return this.estado[id]?.[propriedade];
    return estadoNoTempo(this.rastroLeve(), this.relogio)[id]?.[propriedade];
  }

  /** Um rastro sem cópias, só para ler o mundo agora. */
  private rastroLeve(): RastroCena {
    return {
      cenaId: this.dados.id,
      duracaoMs: this.dados.duracaoMs,
      linhaDoTempo: this.linhaDoTempo,
      dispositivos: this.dados.dispositivos,
      inicial: this.inicial,
      mudancas: this.mudancas,
      cortado: this.cortado,
      relogioMs: this.relogio,
      execucao: this.execucao,
      inicioUltimaMs: this.inicioUltima,
      fimCodigoMs: this.fimCodigo,
      terminouPorTempo: this.terminouPorTempo,
      esperou: this.esperouAgora,
    };
  }

  private tipoDe(id: string): TipoDispositivo {
    return this.dados.dispositivos.find((d) => d.id === id)?.tipo ?? "lampada";
  }

  /** Muda o estado (só quando muda de verdade) e guarda no rastro. */
  private mudar(id: string, propriedade: string, valor: ValorCena, acao: string) {
    const atual = this.estado[id];
    if (!atual || atual[propriedade] === valor) return;
    atual[propriedade] = valor;
    if (this.mudancas.length >= MAXIMO_MUDANCAS) {
      this.cortado = true;
      return;
    }
    this.mudancas.push({ tempoMs: this.relogio, dispositivo: id, propriedade, valor, acao, execucao: this.execucao, passo: this.passoAtual() });
  }

  private numeroNaFaixa(valor: unknown, nome: string, minimo: number, maximo: number, inteiro: boolean): number {
    if (typeof valor !== "number" || Number.isNaN(valor)) throw this.criarErro("TypeError", `${nome} precisa ser um número, de ${minimo} a ${maximo}.`);
    if (valor < minimo || valor > maximo || (inteiro && !Number.isInteger(valor))) {
      throw this.criarErro("RangeError", `${nome} vai de ${minimo} a ${maximo}${inteiro ? ", sem vírgula" : ""}: ${valor} não vale.`);
    }
    return valor;
  }

  /**
   * O objeto de um dispositivo: as propriedades são getters (o Console
   * mostra `Lampada {ligada: false, brilho: 100}`, como um objeto do
   * Chrome) e os comandos são métodos que mudam o estado.
   */
  private criarObjeto(id: string, tipo: TipoDispositivo): object {
    const ficha = CATALOGO_DISPOSITIVOS[tipo];
    // Uma classe com o nome do tipo, para o Console mostrar "Lampada {…}".
    const Classe = { [ficha.classe]: class {} }[ficha.classe];
    const objeto = Object.create(Classe.prototype) as Record<string, unknown>;
    const metodo = (nome: string, corpo: (...args: unknown[]) => void) => {
      Object.defineProperty(objeto, nome, { value: nomear((...args: unknown[]) => corpo(...args), nome), enumerable: false, writable: false, configurable: false });
    };
    for (const propriedade of ficha.propriedades) {
      const nome = propriedade.nome;
      Object.defineProperty(objeto, nome, {
        enumerable: true,
        configurable: false,
        get: () => this.ler(id, nome),
        set: (valor: unknown) => {
          if (!propriedade.escreve) {
            throw this.criarErro("TypeError", `${nome} só dá para ler. ${ficha.comandos.length ? `Use ${ficha.comandos.map((c) => c.assinatura).join(" ou ")}.` : "Quem muda é o mundo."}`);
          }
          const [minimo, maximo] = propriedade.faixa ?? [0, 100];
          const numero = this.numeroNaFaixa(valor, nome, minimo, maximo, tipo === "ventilador");
          this.mudar(id, nome, numero, tipo === "ventilador" && numero === 0 ? "desligar" : nome);
        },
      });
    }
    switch (tipo) {
      case "lampada":
        metodo("ligar", () => this.mudar(id, "ligada", true, "ligar"));
        metodo("desligar", () => this.mudar(id, "ligada", false, "desligar"));
        break;
      case "forno":
        metodo("ligar", () => this.mudar(id, "ligado", true, "ligar"));
        metodo("desligar", () => this.mudar(id, "ligado", false, "desligar"));
        break;
      case "portao":
        metodo("abrir", () => this.mudar(id, "aberto", true, "abrir"));
        metodo("fechar", () => this.mudar(id, "aberto", false, "fechar"));
        break;
      case "letreiro":
        metodo("mostrar", (texto) => {
          if (texto === undefined) throw this.criarErro("TypeError", 'mostrar precisa do texto, como mostrar("ABERTO").');
          const limpo = String(texto).slice(0, LETRAS_DO_LETREIRO);
          this.mudar(id, "texto", limpo, limpo ? "mostrar" : "apagar");
        });
        metodo("apagar", () => this.mudar(id, "texto", "", "apagar"));
        break;
      case "ventilador":
        metodo("desligar", () => this.mudar(id, "velocidade", 0, "desligar"));
        break;
      case "campainha":
        metodo("tocar", () => this.mudar(id, "toques", Number(this.estado[id]?.toques ?? 0) + 1, "tocar"));
        break;
      case "sensor":
      case "interruptor":
      case "relogio":
        break;
    }
    return Object.preventExtensions(objeto);
  }
}

/** Uma função com o nome certo e o texto de função nativa no Console (ƒ ligar()). */
function nomear<F extends (...args: never[]) => unknown>(funcao: F, nome: string): F {
  const presa = funcao.bind(null) as F;
  Object.defineProperty(presa, "name", { value: nome });
  return presa;
}
