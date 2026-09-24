import { faseDoId } from "@/conteudo";
import type { ModoTutor } from "./promptTutor";

export type ContextoDoTutor = { modo: ModoTutor; enunciado: string; siteAlvo: string };

/**
 * O que o tutor precisa saber do objetivo, tirado dos dados da fase no
 * servidor (o que o cliente manda é só reserva): o modo (guiado, sozinho,
 * desafio), o enunciado oficial e o nome do site-alvo.
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
  const objetivo = fase.objetivos.find((item) => item.id === objetivoId);
  return { modo: objetivo?.modo ?? "guiado", enunciado: objetivo?.enunciado.mouse ?? enunciadoDoCliente, siteAlvo };
}
