/** Entradas e atores puros: o mesmo estado no Node, no executor e ao rebobinar. */
import { estadoBaseNoTempo, instantesDaLinhaDoTempo, mudancaVale, type AcontecimentoCena, type EstadoDispositivos, type OpcoesEstado, type RastroCena, type ValorCena } from "./modelo";

export type AlvoCena = { dispositivo: string; propriedade: string };
export type CondicaoCena = AlvoCena & { valor: ValorCena };
export type EntradaInstantanea = CondicaoCena & { tipo?: never; em: number };
export type EntradaCena = EntradaInstantanea | (AlvoCena & { tipo?: never; de: number; ate: number; valorInicial: number; valorFinal: number });
export type AcaoAtor = {
  /** Tempo de deslocamento; nomes das ações são dados, como entrar/atravessar. */
  duracaoMs: number;
  destino: { x: number; y: number };
  aoConcluir?: CondicaoCena[];
};
export type AtorCena = {
  id: string;
  desenho: "pessoa" | "carro";
  x: number;
  y: number;
  escala?: number;
  visivelQuando?: CondicaoCena;
  acoes: Record<string, AcaoAtor>;
};
export type RegraAtor = {
  quando: CondicaoCena;
  /** Condições adicionais, como haver carro à espera do portão. */
  se?: CondicaoCena[];
  entao: { ator: string; acao: string };
  /** A condição precisa permanecer verdadeira durante a espera. */
  atrasoMs?: number;
};
export type MovimentoAtor = { ator: string; acao: string; inicio: number; fim: number; de: { x: number; y: number }; para: { x: number; y: number } };

const inicio = (e: EntradaCena) => "em" in e ? e.em : e.de;

/** A entrada que começou por último prevalece; empate: ordem da lista. */
export function aplicarEntradas(estado: EstadoDispositivos, linha: readonly AcontecimentoCena[], tempo: number, antes = false): void {
  const entradas = linha.filter((e): e is EntradaCena => e.tipo === undefined).slice().sort((a, b) => inicio(a) - inicio(b));
  for (const e of entradas) {
    if (antes ? inicio(e) >= tempo : inicio(e) > tempo) continue;
    const alvo = estado[e.dispositivo];
    if (!alvo) continue;
    const t = antes ? tempo - 1e-7 : tempo;
    alvo[e.propriedade] = "em" in e ? e.valor : e.valorInicial + (e.valorFinal - e.valorInicial) * Math.max(0, Math.min(1, (t - e.de) / (e.ate - e.de)));
  }
}

/** Inclui o cruzamento exato de um valor numa rampa, sem amostragem de quadros. */
export function instantesDeValor(linha: readonly AcontecimentoCena[], alvo: CondicaoCena): number[] {
  return linha.flatMap(e => {
    if (e.tipo !== undefined || "em" in e || e.dispositivo !== alvo.dispositivo || e.propriedade !== alvo.propriedade || typeof alvo.valor !== "number" || e.valorInicial === e.valorFinal) return [];
    const p = (alvo.valor - e.valorInicial) / (e.valorFinal - e.valorInicial);
    return p >= 0 && p <= 1 ? [e.de + p * (e.ate - e.de)] : [];
  });
}

/** Reações por borda, com fila de fins/atrasos. Não usa relógio real nem muta o rastro. */
export function resolverAtores(rastro: RastroCena, tempo: number, opcoes: OpcoesEstado = {}): { movimentos: MovimentoAtor[]; efeitos: EntradaInstantanea[] } {
  const movimentos: MovimentoAtor[] = [];
  const efeitos: EntradaInstantanea[] = [];
  const regras = rastro.reacoes ?? [];
  if (!regras.length) return { movimentos, efeitos };
  const fila = new Set([0, ...instantesDaLinhaDoTempo(rastro.linhaDoTempo), ...rastro.mudancas.filter(m => mudancaVale(m, tempo, opcoes)).map(m => m.tempoMs), ...regras.flatMap(r => [r.quando, ...(r.se ?? [])].flatMap(c => instantesDeValor(rastro.linhaDoTempo, c)))]);
  const pendentes = new Map<number, number>();
  const anteriores = regras.map(() => false);
  let passos = 0;
  while (fila.size && passos++ < 4096) {
    const t = Math.min(...fila);
    fila.delete(t);
    if (opcoes.antes ? t >= tempo : t > tempo) break;
    const estado = estadoBaseNoTempo(rastro, t, { filtro: opcoes.filtro });
    aplicarEntradas(estado, [...rastro.linhaDoTempo, ...efeitos], t);
    regras.forEach((regra, indice) => {
      const casa = [regra.quando, ...(regra.se ?? [])].every(c => estado[c.dispositivo]?.[c.propriedade] === c.valor);
      if (!casa) pendentes.delete(indice);
      if (casa && !anteriores[indice]) {
        pendentes.set(indice, t + (regra.atrasoMs ?? 0));
        fila.add(t + (regra.atrasoMs ?? 0));
      }
      anteriores[indice] = casa;
      if (!casa || pendentes.get(indice) !== t) return;
      pendentes.delete(indice);
      const ator = rastro.atores?.find(a => a.id === regra.entao.ator);
      const acao = ator?.acoes[regra.entao.acao];
      if (!ator || !acao) return;
      const anterior = movimentos.filter(m => m.ator === ator.id).at(-1);
      if (anterior && anterior.fim > t) return;
      const fim = t + acao.duracaoMs;
      movimentos.push({ ator: ator.id, acao: regra.entao.acao, inicio: t, fim, de: anterior?.para ?? { x: ator.x, y: ator.y }, para: acao.destino });
      for (const efeito of acao.aoConcluir ?? []) efeitos.push({ ...efeito, em: fim });
      fila.add(fim);
    });
  }
  return { movimentos, efeitos };
}
