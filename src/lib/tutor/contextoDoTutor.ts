import { faseDoId } from "@/conteudo";
import type { ModoTutor } from "./promptTutor";

export type ContextoDoTutor = { modo: ModoTutor; enunciado: string; siteAlvo: string };

/**
 * O que o tutor precisa saber do objetivo, tirado dos dados da fase no
 * servidor (o que o cliente manda é só reserva): o modo (guiado, sozinho,
 * desafio, projeto), o enunciado oficial e o nome do site-alvo.
 */
export function contextoDoTutor(faseId: string, objetivoId: string, enunciadoDoCliente: string): ContextoDoTutor {
  const fase = faseDoId(faseId);
  if (!fase) return { modo: "guiado", enunciado: enunciadoDoCliente, siteAlvo: "site fictício" };
  const siteAlvo = fase.siteAlvo.titulo;
  if (fase.tipo === "desafio") {
    return {
      modo: "desafio",
      enunciado: `Desafio, sem passo a passo. Partes: ${fase.partes.map((parte) => parte.descricao).join("; ")}`,
      siteAlvo,
    };
  }
  if (fase.tipo === "projeto-ponte") {
    return {
      modo: "projeto",
      enunciado: `Projeto-ponte: o site do próprio aluno, sem passo a passo. Requisitos: ${fase.requisitos.map((item) => item.descricao).join("; ")}`,
      siteAlvo: fase.nomeDoProjeto,
    };
  }
  const objetivo = fase.objetivos.find((item) => item.id === objetivoId);
  return { modo: objetivo?.modo ?? "guiado", enunciado: objetivo?.enunciado.mouse ?? enunciadoDoCliente, siteAlvo };
}
