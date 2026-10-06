/*
 * O processador de brinquedo (sala 4): a mesma máquina simplificada da sala
 * 1 (PEGA, SOMA, GUARDA, com o código da ordem em 4 bits e o endereço em
 * outros 4), agora rodando de verdade, no ciclo buscar, entender, executar.
 *
 * - buscar: lê a caixa que o contador aponta e anda o contador;
 * - entender: decodifica a ordem (o que ela manda e em qual caixa);
 * - executar: faz (pega para o acumulador, soma nele, guarda numa caixa
 *   ou para).
 *
 * Declarada na placa como simplificada: os de verdade têm muitas ordens e
 * vários registradores, mas o ciclo é este.
 *
 * Comandos: "passo" (uma etapa do ciclo), "ciclo" (termina a ordem atual),
 * "rodar" (até parar), "reiniciar".
 * Marcos: "buscou", "entendeu", "executou", "ciclo:K", "acumulador=V",
 * "caixa:N=V", "fim".
 */
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export type OrdemBrinquedo = "PEGA" | "SOMA" | "GUARDA" | "PARA";

export const CODIGO_DA_ORDEM: Record<OrdemBrinquedo, string> = { PEGA: "0001", SOMA: "0010", GUARDA: "0011", PARA: "0000" };

export const SENTIDO_DA_ORDEM: Record<OrdemBrinquedo, string> = {
  PEGA: "pegue o número da caixa {e} e ponha no acumulador",
  SOMA: "some o número da caixa {e} ao acumulador",
  GUARDA: "guarde o acumulador na caixa {e}",
  PARA: "pare: o programa acabou",
};

export type CelulaProcessador = { ordem: OrdemBrinquedo; endereco: number } | { valor: number | null; nome?: string };

export type EstacaoProcessador = {
  id: string;
  tipo: "processador";
  titulo: string;
  /** As caixas da memória (de 6 a 12): as ordens primeiro (terminando em PARA), depois os dados. */
  memoria: CelulaProcessador[];
};

export type FaseDoCiclo = "buscar" | "entender" | "executar";

export type EstadoProcessador = {
  tipo: "processador";
  /** O valor das caixas de dados agora (null nas caixas de ordem e nas vazias). */
  valores: (number | null)[];
  /** O contador: a caixa da próxima ordem. */
  contador: number;
  fase: FaseDoCiclo;
  /** A caixa da ordem buscada (a que está sendo entendida ou executada). */
  instrucao: number | null;
  acumulador: number | null;
  ciclos: number;
  parado: boolean;
};

export function ehOrdem(celula: CelulaProcessador | undefined): celula is { ordem: OrdemBrinquedo; endereco: number } {
  return celula !== undefined && "ordem" in celula;
}

/** A ordem em bits: "0001 0110" (PEGA 6). */
export function bitsDaOrdem(ordem: OrdemBrinquedo, endereco: number): string {
  return `${CODIGO_DA_ORDEM[ordem]} ${endereco.toString(2).padStart(4, "0")}`;
}

function inicial(dados: EstacaoProcessador): EstadoProcessador {
  return {
    tipo: "processador",
    valores: dados.memoria.map((celula) => (ehOrdem(celula) ? null : celula.valor)),
    contador: 0,
    fase: "buscar",
    instrucao: null,
    acumulador: null,
    ciclos: 0,
    parado: false,
  };
}

function umPasso(dados: EstacaoProcessador, estado: EstadoProcessador): EstadoProcessador | null {
  if (estado.parado) return null;
  if (estado.fase === "buscar") {
    if (!ehOrdem(dados.memoria[estado.contador])) return { ...estado, parado: true };
    return { ...estado, instrucao: estado.contador, contador: estado.contador + 1, fase: "entender" };
  }
  if (estado.fase === "entender") return { ...estado, fase: "executar" };
  const celula = estado.instrucao === null ? undefined : dados.memoria[estado.instrucao];
  if (!ehOrdem(celula)) return { ...estado, parado: true };
  const valores = [...estado.valores];
  let acumulador = estado.acumulador;
  let parado = false;
  const lido = valores[celula.endereco] ?? 0;
  if (celula.ordem === "PEGA") acumulador = lido;
  else if (celula.ordem === "SOMA") acumulador = (acumulador ?? 0) + lido;
  else if (celula.ordem === "GUARDA") valores[celula.endereco] = acumulador ?? 0;
  else parado = true;
  return { ...estado, valores, acumulador, parado, fase: "buscar", ciclos: estado.ciclos + 1 };
}

export const PROCESSADOR: ModeloSimulacao<EstacaoProcessador, EstadoProcessador> = {
  inicial,
  comando(dados, estado, comando) {
    if (comando === "reiniciar") return inicial(dados);
    if (comando === "passo") return umPasso(dados, estado);
    if (comando === "ciclo" || comando === "rodar") {
      let atual = umPasso(dados, estado);
      if (!atual) return null;
      for (let guarda = 0; guarda < 200 && !atual.parado && (comando === "rodar" || atual.fase !== "buscar"); guarda += 1) {
        const proximo: EstadoProcessador | null = umPasso(dados, atual);
        if (!proximo) break;
        atual = proximo;
      }
      return atual;
    }
    return null;
  },
  marcos(_dados, estado) {
    const marcos: string[] = [];
    if (estado.ciclos > 0 || estado.fase !== "buscar") marcos.push("buscou");
    if (estado.ciclos > 0 || estado.fase === "executar") marcos.push("entendeu");
    if (estado.ciclos > 0) marcos.push("executou");
    for (let k = 1; k <= estado.ciclos; k += 1) marcos.push(`ciclo:${k}`);
    if (estado.acumulador !== null) marcos.push(`acumulador=${estado.acumulador}`);
    estado.valores.forEach((valor, n) => {
      if (valor !== null) marcos.push(`caixa:${n}=${valor}`);
    });
    if (estado.parado) marcos.push("fim");
    return marcos;
  },
  marcoPossivel(dados, marco) {
    if (["buscou", "entendeu", "executou", "fim"].includes(marco)) return true;
    const [verbo, resto] = partesDoComando(marco);
    if (verbo === "ciclo") return Number(resto) >= 1 && Number(resto) <= dados.memoria.filter(ehOrdem).length;
    if (marco.startsWith("acumulador=")) return /^acumulador=-?\d+$/.test(marco);
    if (verbo === "caixa") return /^\d+=-?\d+$/.test(resto) && Number(resto.split("=")[0]) < dados.memoria.length;
    return false;
  },
  comandoPossivel: (_dados, comando) => ["passo", "ciclo", "rodar", "reiniciar"].includes(comando),
  conferir(dados, onde) {
    const p: string[] = [];
    const { memoria } = dados;
    if (memoria.length < 6 || memoria.length > 12) p.push(`${onde}: ${memoria.length} caixas (de 6 a 12)`);
    const ultimaOrdem = memoria.map(ehOrdem).lastIndexOf(true);
    if (ultimaOrdem < 0) p.push(`${onde}: sem nenhuma ordem`);
    for (let i = 0; i < ultimaOrdem; i += 1) if (!ehOrdem(memoria[i])) p.push(`${onde}: a caixa ${i} está no meio das ordens e não é ordem`);
    const fim = memoria[ultimaOrdem];
    if (ehOrdem(fim) && fim.ordem !== "PARA") p.push(`${onde}: a última ordem precisa ser PARA`);
    memoria.forEach((celula, i) => {
      if (ehOrdem(celula) && celula.ordem !== "PARA" && (celula.endereco <= ultimaOrdem || celula.endereco >= memoria.length)) {
        p.push(`${onde}: a ordem da caixa ${i} aponta a caixa ${celula.endereco}, que não é de dado`);
      }
    });
    return p;
  },
  ler(valor) {
    if (!Array.isArray(valor.valores)) return null;
    const numero = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);
    const fase = valor.fase === "entender" || valor.fase === "executar" ? valor.fase : "buscar";
    return {
      tipo: "processador",
      valores: valor.valores.slice(0, 12).map(numero),
      contador: numero(valor.contador) ?? 0,
      fase,
      instrucao: numero(valor.instrucao),
      acumulador: numero(valor.acumulador),
      ciclos: Math.max(0, numero(valor.ciclos) ?? 0),
      parado: valor.parado === true,
    };
  },
  cabe: (dados, estado) =>
    estado.valores.length === dados.memoria.length && estado.contador >= 0 && estado.contador <= dados.memoria.length && (estado.instrucao === null || ehOrdem(dados.memoria[estado.instrucao])),
  resumo: (dados, estado) =>
    `${dados.titulo}: contador ${estado.contador}, etapa ${estado.fase}, acumulador ${estado.acumulador ?? "vazio"}, ${estado.ciclos} ordem(ns) feita(s)${estado.parado ? ", parado" : ""}`,
};
