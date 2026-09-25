import type { DegrauAjuda } from "@/motor/tipos";
import { type EntradaTutor, LIMITES_TUTOR, type MensagemTutor } from "./tipos";

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function texto(valor: unknown, limite: number): string | null {
  return typeof valor === "string" ? valor.slice(0, limite) : null;
}

function ehDegrau(valor: unknown): valor is DegrauAjuda {
  return valor === 0 || valor === 1 || valor === 2 || valor === 3 || valor === 4;
}

/** Confere e corta o corpo recebido pela rota do tutor. */
export function validarEntradaTutor(corpo: unknown): EntradaTutor | null {
  if (!ehObjeto(corpo)) return null;
  const faseId = texto(corpo.faseId, 80);
  const objetivoId = texto(corpo.objetivoId, 80);
  const enunciado = texto(corpo.enunciado, 400);
  const htmlAtual = texto(corpo.htmlAtual, LIMITES_TUTOR.html);
  const cssAtual = texto(corpo.cssAtual, LIMITES_TUTOR.css) ?? undefined;
  const pergunta = texto(corpo.pergunta, LIMITES_TUTOR.pergunta)?.trim();
  if (!faseId || !objetivoId || enunciado === null || htmlAtual === null || !pergunta) return null;
  if (!ehDegrau(corpo.degrauAtual)) return null;

  const historico: MensagemTutor[] = [];
  if (Array.isArray(corpo.historico)) {
    for (const item of corpo.historico.slice(-LIMITES_TUTOR.historico)) {
      if (!ehObjeto(item)) continue;
      const papel = item.papel === "aluno" || item.papel === "tutor" ? item.papel : null;
      const conteudo = texto(item.texto, LIMITES_TUTOR.mensagemHistorico);
      if (papel && conteudo) historico.push({ papel, texto: conteudo });
    }
  }

  return {
    faseId,
    objetivoId,
    enunciado,
    degrauAtual: corpo.degrauAtual,
    htmlAtual,
    ...(cssAtual ? { cssAtual } : {}),
    pergunta,
    historico,
  };
}
