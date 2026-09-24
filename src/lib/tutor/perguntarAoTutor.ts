import { ehExpressao } from "@/motor/expressao";
import { ehTipoErroTutor, type EntradaTutor, type SaidaTutor, type TipoErroTutor } from "./tipos";

/** Um pouco acima do maxDuration da rota, para o servidor sempre responder antes. */
const TEMPO_LIMITE_CLIENTE_MS = 62_000;

export type RespostaTutor = { ok: true; saida: SaidaTutor } | { ok: false; tipo: TipoErroTutor };

/** Chama a rota do servidor. Nunca lança: toda falha vira um tipo. */
export async function perguntarAoTutor(entrada: EntradaTutor): Promise<RespostaTutor> {
  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), TEMPO_LIMITE_CLIENTE_MS);
  try {
    const resposta = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entrada),
      signal: controle.signal,
    });
    if (!resposta.ok) return { ok: false, tipo: resposta.status >= 500 ? "rede" : "desconhecido" };
    const dados: unknown = await resposta.json();
    if (typeof dados !== "object" || dados === null) return { ok: false, tipo: "desconhecido" };
    if ("erro" in dados) {
      const { erro } = dados;
      const tipo = typeof erro === "object" && erro !== null && "tipo" in erro ? erro.tipo : null;
      return { ok: false, tipo: ehTipoErroTutor(tipo) ? tipo : "desconhecido" };
    }
    if ("texto" in dados && typeof dados.texto === "string" && "expressao" in dados && ehExpressao(dados.expressao)) {
      return { ok: true, saida: { texto: dados.texto, expressao: dados.expressao } };
    }
    return { ok: false, tipo: "desconhecido" };
  } catch {
    return { ok: false, tipo: "rede" };
  } finally {
    clearTimeout(temporizador);
  }
}
