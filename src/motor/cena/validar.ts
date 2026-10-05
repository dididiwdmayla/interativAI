import { instantesDeValor, resolverAtores } from "./acontecimentos";
/*
 * Os validadores das cenas programáveis (área cena), puros: olham o rastro
 * da simulação (as mudanças com o instante) e a linha do tempo do cenário.
 * O validador `variosCenarios` roda o mesmo código com outras linhas do
 * tempo (a cada Executar, no Web Worker do jogo e no vm dos testes) e confere
 * o validador de dentro em cada uma.
 */
import type { Fase, Validador } from "@/conteudo/tipos";
import { validadoresDentro } from "../programa";
import {
  type AcontecimentoCena,
  chaveLinhaDoTempo,
  instantesDaLinhaDoTempo,
  type MudancaCena,
  type RastroCena,
  textoDoTempo,
  textoDoValorCena,
  type ValorCena,
  valorNoTempo,
} from "./modelo";

/** As outras linhas do tempo que os validadores `variosCenarios` pedem, sem repetir. */
function cenariosDe(raizes: readonly Validador[]): AcontecimentoCena[][] {
  const vistas = new Map<string, AcontecimentoCena[]>();
  for (const validador of raizes.flatMap(validadoresDentro)) {
    if (validador.tipo !== "variosCenarios") continue;
    for (const linha of validador.linhasDoTempo) vistas.set(chaveLinhaDoTempo(linha), linha);
  }
  return [...vistas.values()];
}

/** As linhas do tempo de um validador (o de um objetivo, por exemplo). */
export function cenariosDoValidador(validador: Validador): AcontecimentoCena[][] {
  return cenariosDe([validador]);
}

/** As outras linhas do tempo que a fase inteira pede (o código roda com todas a cada Executar). */
export function cenariosDaFase(fase: Fase): AcontecimentoCena[][] {
  const raizes: Validador[] =
    fase.tipo === "desafio" ? fase.partes.map((p) => p.validador) : fase.tipo === "projeto-ponte" ? fase.requisitos.map((r) => r.validador) : "objetivos" in fase ? fase.objetivos.map((o) => o.validador) : [];
  return cenariosDe(raizes);
}

/** Os validadores que olham a cena (os de dentro de um variosCenarios só podem ser estes, com todos/algum/nao). */
export const VALIDADORES_DE_CENA = new Set(["estadoNaCena", "sequenciaNaCena", "reagiu", "variosCenarios"]);

export type Conferencia = { passou: boolean; detalhe: string };

/** A cena ainda não rodou (só a memória do começo): os validadores não passam. */
function semExecucao(rastro: RastroCena | null | undefined): Conferencia | null {
  if (!rastro) return { passou: false, detalhe: "a cena ainda não rodou (só numa fase com a área cena)" };
  if (rastro.fimCodigoMs === null) return { passou: false, detalhe: "a cena ainda não rodou: escreva o código e clique em Executar" };
  return null;
}

function valoresIguais(a: ValorCena | undefined, b: ValorCena): boolean {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
  return a === b;
}

export function conferirEstado(validador: Extract<Validador, { tipo: "estadoNaCena" }>, rastro: RastroCena | null | undefined): Conferencia {
  const vazio = semExecucao(rastro);
  if (vazio || !rastro) return vazio ?? { passou: false, detalhe: "" };
  const instante = validador.noTempo ?? rastro.duracaoMs;
  const valor = valorNoTempo(rastro, validador.dispositivo, validador.propriedade, instante);
  return {
    passou: valoresIguais(valor, validador.valor),
    detalhe: `${validador.dispositivo}.${validador.propriedade} em ${textoDoTempo(instante)}: ${textoDoValorCena(valor)}`,
  };
}

/** As mudanças do dispositivo com estas ações, em ordem de tempo. */
function acoesDo(rastro: RastroCena, dispositivo: string, acoes: ReadonlySet<string>): MudancaCena[] {
  return rastro.mudancas.filter((m) => m.dispositivo === dispositivo && acoes.has(m.acao));
}

function textoDasAcoes(mudancas: readonly MudancaCena[]): string {
  if (!mudancas.length) return "não fez nada disso";
  const lista = mudancas.slice(0, 10).map((m) => `${m.acao} (${textoDoTempo(m.tempoMs)})`);
  return `fez ${lista.join(", ")}${mudancas.length > 10 ? `... (${mudancas.length} ao todo)` : ""}`;
}

export function conferirSequencia(validador: Extract<Validador, { tipo: "sequenciaNaCena" }>, rastro: RastroCena | null | undefined): Conferencia {
  const vazio = semExecucao(rastro);
  if (vazio || !rastro) return vazio ?? { passou: false, detalhe: "" };
  const { eventos } = validador;
  const feitas = acoesDo(rastro, validador.dispositivo, new Set(eventos.map((e) => e.acao)));
  const casaEm = (inicio: number): boolean =>
    eventos.every((evento, j) => {
      const mudanca = feitas[inicio + j];
      if (!mudanca || mudanca.acao !== evento.acao) return false;
      if (evento.aposMs === undefined) return true;
      const anterior = j === 0 ? 0 : feitas[inicio + j - 1].tempoMs;
      return Math.abs(mudanca.tempoMs - anterior - evento.aposMs) <= (evento.toleranciaMs ?? 100);
    });
  const inicios = validador.exata ? [0] : Array.from({ length: Math.max(0, feitas.length - eventos.length + 1) }, (_, i) => i);
  const casou = inicios.some(casaEm) && (!validador.exata || feitas.length === eventos.length);
  return { passou: casou, detalhe: `${validador.dispositivo} ${textoDasAcoes(feitas)}` };
}

/**
 * Os instantes em que a propriedade passa a valer o valor (o "quando" de um
 * reagiu): onde a linha do tempo ou o código mudam algo, o valor logo antes
 * era outro e no instante é este.
 */
export function quandoAconteceu(rastro: RastroCena, quando: { dispositivo: string; propriedade: string; valor: ValorCena }): number[] {
  const candidatos = new Set([...instantesDaLinhaDoTempo(rastro.linhaDoTempo), ...instantesDeValor(rastro.linhaDoTempo, quando), ...resolverAtores(rastro, rastro.duracaoMs).efeitos.map(e => e.em), ...rastro.mudancas.map((m) => m.tempoMs)]);
  return [...candidatos]
    .filter((t) => t <= rastro.duracaoMs)
    .sort((a, b) => a - b)
    .filter((t) => {
      const agora = valorNoTempo(rastro, quando.dispositivo, quando.propriedade, t);
      const antes = valorNoTempo(rastro, quando.dispositivo, quando.propriedade, t, { antes: true });
      return valoresIguais(agora, quando.valor) && !valoresIguais(antes, quando.valor);
    });
}

export function conferirReacao(validador: Extract<Validador, { tipo: "reagiu" }>, rastro: RastroCena | null | undefined): Conferencia {
  const vazio = semExecucao(rastro);
  if (vazio || !rastro) return vazio ?? { passou: false, detalhe: "" };
  const { quando, entao, prazoMs } = validador;
  const instantes = quandoAconteceu(rastro, quando);
  if (!instantes.length) return { passou: false, detalhe: `${quando.dispositivo}.${quando.propriedade} nunca passou a ${textoDoValorCena(quando.valor)} nesta cena` };
  const respostas = acoesDo(rastro, entao.dispositivo, new Set([entao.acao]));
  const partes: string[] = [];
  let passou = true;
  for (const instante of instantes) {
    const resposta = respostas.find((m) => m.tempoMs >= instante && m.tempoMs <= instante + prazoMs);
    if (!resposta) passou = false;
    partes.push(
      resposta
        ? `em ${textoDoTempo(instante)}, ${entao.dispositivo} fez ${entao.acao} em ${textoDoTempo(resposta.tempoMs)}`
        : `em ${textoDoTempo(instante)}, ${entao.dispositivo} não fez ${entao.acao} em até ${prazoMs} ms`,
    );
  }
  return { passou, detalhe: `${quando.dispositivo}.${quando.propriedade} virou ${textoDoValorCena(quando.valor)}: ${partes.join("; ")}` };
}

/** Uma linha do tempo, em palavras curtas (detalhe do variosCenarios). */
export function textoDaLinhaDoTempo(linha: readonly AcontecimentoCena[]): string {
  if (!linha.length) return "ninguém aparece";
  return linha
    .map((item) =>
      item.tipo === "pessoa"
        ? `alguém chega em ${textoDoTempo(item.chegaMs)}${item.saiMs !== undefined ? ` e sai em ${textoDoTempo(item.saiMs)}` : ""}`
        : item.tipo === "interruptor" ? `${item.dispositivo} apertado em ${textoDoTempo(item.noMs)}`
        : "em" in item ? `${item.dispositivo}.${item.propriedade} = ${String(item.valor)} em ${textoDoTempo(item.em)}`
        : `${item.dispositivo}.${item.propriedade}: ${item.valorInicial} a ${item.valorFinal}, de ${textoDoTempo(item.de)} a ${textoDoTempo(item.ate)}`,
    )
    .join(", ");
}
