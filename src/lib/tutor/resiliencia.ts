import type { TipoErroTutor } from "./tipos";

/** Resultado de uma tentativa de gerar a resposta com um modelo. */
export type Tentativa = (modelo: string, tempoLimiteMs: number) => Promise<string>;

export type FalhaClassificada = { tipo: TipoErroTutor; status: number | null };

export type ResultadoResiliente =
  | { ok: true; texto: string; modelo: string; papel: "principal" | "reserva"; tentativas: number }
  | { ok: false; falha: FalhaClassificada; tentativas: number };

export type OpcoesResiliencia = {
  principal: string;
  reserva: string | null;
  tentar: Tentativa;
  /** Novas tentativas no modelo principal depois da primeira (padrão 2). */
  novasTentativas?: number;
  /** Espera base do backoff; dobra a cada nova tentativa (padrão 1000 ms). */
  esperaBaseMs?: number;
  /** Orçamento total, para ficar abaixo do maxDuration da rota. */
  orcamentoMs: number;
  /** Tempo máximo de uma tentativa isolada. */
  tempoLimiteMs: number;
  esperar?: (ms: number) => Promise<void>;
  agora?: () => number;
  sortear?: () => number;
};

const TEXTO_SOBRECARGA = /UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand/i;
const TEXTO_REDE = /fetch failed|network|ECONN|ENOTFOUND|ETIMEDOUT|socket|timed? ?out|abort/i;

function statusDe(falha: unknown): number | null {
  if (typeof falha === "object" && falha !== null && "status" in falha) {
    const { status } = falha as { status: unknown };
    if (typeof status === "number" && Number.isFinite(status)) return status;
  }
  return null;
}

/** Transforma qualquer erro do SDK num tipo que o cliente entende. */
export function classificarFalha(falha: unknown): FalhaClassificada {
  const status = statusDe(falha);
  const mensagem = falha instanceof Error ? `${falha.name} ${falha.message}` : String(falha);
  if (status === 503 || status === 429 || TEXTO_SOBRECARGA.test(mensagem)) {
    return { tipo: "sobrecarga", status };
  }
  if (status === 401 || status === 403) return { tipo: "sem_chave", status };
  if (TEXTO_REDE.test(mensagem)) return { tipo: "rede", status };
  return { tipo: "desconhecido", status };
}

const esperarPadrao = (ms: number) => new Promise<void>((resolver) => setTimeout(resolver, ms));

/**
 * Chama o modelo principal; em sobrecarga (503/429) tenta de novo com backoff
 * exponencial e jitter e, se ainda falhar, tenta uma vez o modelo reserva.
 * Nunca passa do orçamento de tempo.
 */
export async function gerarComResiliencia({
  principal,
  reserva,
  tentar,
  novasTentativas = 2,
  esperaBaseMs = 1000,
  orcamentoMs,
  tempoLimiteMs,
  esperar = esperarPadrao,
  agora = Date.now,
  sortear = Math.random,
}: OpcoesResiliencia): Promise<ResultadoResiliente> {
  const inicio = agora();
  const restante = () => orcamentoMs - (agora() - inicio);
  let tentativas = 0;
  let ultima: FalhaClassificada = { tipo: "desconhecido", status: null };

  const rodar = async (modelo: string) => {
    tentativas++;
    const limite = Math.min(tempoLimiteMs, restante());
    return tentar(modelo, Math.max(1000, limite));
  };

  for (let rodada = 0; rodada <= novasTentativas; rodada++) {
    if (rodada > 0) {
      // Backoff: ~1 s, ~2 s, com até 30% de variação para não bater todos juntos.
      const base = esperaBaseMs * 2 ** (rodada - 1);
      const espera = Math.round(base * (0.85 + sortear() * 0.3));
      if (restante() - espera < 2000) break;
      await esperar(espera);
    }
    try {
      const texto = await rodar(principal);
      return { ok: true, texto, modelo: principal, papel: "principal", tentativas };
    } catch (falha) {
      ultima = classificarFalha(falha);
      if (ultima.tipo !== "sobrecarga") return { ok: false, falha: ultima, tentativas };
    }
  }

  if (reserva && reserva !== principal && restante() > 2000) {
    try {
      const texto = await rodar(reserva);
      return { ok: true, texto, modelo: reserva, papel: "reserva", tentativas };
    } catch (falha) {
      ultima = classificarFalha(falha);
    }
  }
  return { ok: false, falha: ultima, tentativas };
}
