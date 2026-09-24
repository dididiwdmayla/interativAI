import { ehExpressao } from "@/motor/expressao";
import type { EntradaTutor, SaidaTutor } from "./tipos";

const TEMPO_LIMITE_CLIENTE_MS = 25_000;

/** Chama a rota do servidor. Qualquer problema vira exceção. */
export async function perguntarAoTutor(entrada: EntradaTutor): Promise<SaidaTutor> {
  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), TEMPO_LIMITE_CLIENTE_MS);
  try {
    const resposta = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entrada),
      signal: controle.signal,
    });
    if (!resposta.ok) throw new Error(`tutor respondeu ${resposta.status}`);
    const dados: unknown = await resposta.json();
    if (typeof dados === "object" && dados !== null && "erro" in dados) {
      throw new Error(`tutor indisponível: ${String(dados.erro)}`);
    }
    if (
      typeof dados === "object" &&
      dados !== null &&
      "texto" in dados &&
      typeof dados.texto === "string" &&
      "expressao" in dados &&
      ehExpressao(dados.expressao)
    ) {
      return { texto: dados.texto, expressao: dados.expressao };
    }
    throw new Error("resposta do tutor em formato inesperado");
  } finally {
    clearTimeout(temporizador);
  }
}
