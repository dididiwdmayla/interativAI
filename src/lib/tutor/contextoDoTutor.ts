import { faseDoId } from "@/conteudo";
import { itemDoId } from "@/conteudo/revisao";
import { PREFIXO_FASE_REVISAO } from "@/conteudo/revisao/faseDoItem";
import type { ModoTutor } from "./promptTutor";

export type ContextoDoTutor = { modo: ModoTutor; enunciado: string; siteAlvo: string };

/**
 * O que o tutor precisa saber do objetivo, tirado dos dados da fase no
 * servidor (o que o cliente manda é só reserva): o modo (guiado, sozinho,
 * desafio, projeto), o enunciado oficial e o nome do site-alvo.
 */
export function contextoDoTutor(faseId: string, objetivoId: string, enunciadoDoCliente: string): ContextoDoTutor {
  // Revisão do dia: todo item é "sozinho" (o tutor só pergunta), com o enunciado do item.
  if (faseId.startsWith(PREFIXO_FASE_REVISAO)) {
    const item = itemDoId(faseId.slice(PREFIXO_FASE_REVISAO.length));
    return {
      modo: "sozinho",
      enunciado: item ? (item.previsao?.pergunta ?? item.enunciado.mouse) : enunciadoDoCliente,
      siteAlvo: item?.siteAlvo.titulo ?? "mini-site da revisão",
    };
  }
  const fase = faseDoId(faseId);
  if (!fase) return { modo: "guiado", enunciado: enunciadoDoCliente, siteAlvo: "site fictício" };
  const siteAlvo = fase.siteAlvo.titulo;
  if (fase.tipo === "desafio" && fase.contrato) {
    // O pedido inteiro (com a mudança): o tutor não sabe se ela já chegou, então só usa o que o aluno contar.
    return {
      modo: "contrato",
      enunciado: `Contrato: ${fase.contrato.projeto}, para um cliente. Pedido: ${fase.contrato.documento.paragrafos.join(" ")} Requisitos: ${fase.partes.map((parte) => parte.descricao).join("; ")}`,
      siteAlvo: fase.contrato.projeto,
    };
  }
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
