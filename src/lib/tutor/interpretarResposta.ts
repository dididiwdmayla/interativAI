import { ehExpressao, type Expressao } from "@/motor/expressao";
import { LIMITES_TUTOR, type SaidaTutor } from "./tipos";

const PICTOGRAMAS = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

/** Tira emojis, marcações de markdown e espaços sobrando. */
function limparTexto(bruto: string): string {
  return bruto
    .replace(PICTOGRAMAS, "")
    .replace(/[*_`#]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, LIMITES_TUTOR.resposta);
}

function expressaoValida(valor: unknown): Expressao {
  return ehExpressao(valor) && valor !== "dormindo" ? valor : "feliz";
}

/**
 * Converte a resposta do modelo em { texto, expressao }. Remove cercas de
 * código, tenta o JSON e, se falhar, usa o texto puro com expressão feliz.
 */
export function interpretarRespostaTutor(bruto: string): SaidaTutor | null {
  const semCercas = bruto.replace(/```(?:json)?/gi, "").trim();
  if (!semCercas) return null;

  const inicio = semCercas.indexOf("{");
  const fim = semCercas.lastIndexOf("}");
  if (inicio >= 0 && fim > inicio) {
    try {
      const objeto: unknown = JSON.parse(semCercas.slice(inicio, fim + 1));
      if (typeof objeto === "object" && objeto !== null && "texto" in objeto) {
        const { texto, expressao } = objeto as { texto: unknown; expressao?: unknown };
        if (typeof texto === "string") {
          const limpo = limparTexto(texto);
          if (limpo) return { texto: limpo, expressao: expressaoValida(expressao) };
        }
      }
    } catch {
      // Cai no texto puro logo abaixo.
    }
  }

  // JSON cortado no meio: tenta resgatar só o campo texto.
  if (semCercas.startsWith("{")) {
    const campo = /"texto"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(semCercas);
    if (!campo) return null;
    let resgatado = campo[1];
    try {
      resgatado = JSON.parse(`"${campo[1]}"`) as string;
    } catch {
      // Mantém o texto como veio.
    }
    const limpo = limparTexto(resgatado);
    return limpo ? { texto: limpo, expressao: "feliz" } : null;
  }

  const textoPuro = limparTexto(semCercas);
  return textoPuro ? { texto: textoPuro, expressao: "feliz" } : null;
}
