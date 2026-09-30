/*
 * Um item da Revisão do dia vira uma fase de prática de UM objetivo
 * "sozinho": o motor, a tela e as checagens das fases servem sem mudar
 * nada (o "Me ajuda" para na dica e o tutor só pergunta, como em todo
 * objetivo sozinho). A fase é montada na hora, nunca registrada em
 * UNIDADES: ela não conta no mapa nem no progresso das fases.
 */
import { conceitoDoId, ehIdConceito } from "../conceitos";
import { ferramentaDaAcao } from "../ferramentaDaAcao";
import type { IdFerramenta } from "@/ferramentas/ids";
import type { FasePratica, ItemRevisao, Objetivo, Validador } from "../tipos";

/** Prefixo dos ids das fases de revisão (o tutor e a rota reconhecem por ele). */
export const PREFIXO_FASE_REVISAO = "revisao-";

/** Unidade de mentirinha das fases de revisão. */
export const UNIDADE_REVISAO = "revisao-do-dia";

/** O que toda fase de revisão pode usar (o jogador já conhece: são da U1). */
const FERRAMENTAS_BASE: readonly IdFerramenta[] = [
  "painel",
  "previa",
  "me-ajuda",
  "tutor",
  "arvore",
  "inspecionar",
  "editar-duplo-clique",
  "editor",
  "sincronia",
];

/** Com CSS, o painel Estilos e o editor CSS (apresentados na zona Estilos). */
const FERRAMENTAS_CSS: readonly IdFerramenta[] = ["editor-css", "painel-estilos", "editar-valor-css"];

/** Item de previsão sem validador: acaba quando o jogador responde. */
const DEPOIS_DE_RESPONDER: Validador = { tipo: "evento", evento: "respondeuPrevisao" };

export function idDaFaseDoItem(itemId: string): string {
  return `${PREFIXO_FASE_REVISAO}${itemId}`;
}

export function faseDoItem(item: ItemRevisao): FasePratica {
  const nome = ehIdConceito(item.conceito) ? conceitoDoId(item.conceito).nome : item.conceito;
  const acoes = item.solucaoDeTeste.map(ferramentaDaAcao).filter((id): id is IdFerramenta => id !== null);
  const comCss = item.siteAlvo.css !== undefined;
  const usaFerramentas = [...new Set([...FERRAMENTAS_BASE, ...(comCss ? FERRAMENTAS_CSS : []), ...acoes])];
  const comum = {
    id: "item",
    enunciado: item.enunciado,
    validador: item.validador ?? DEPOIS_DE_RESPONDER,
    falaAoConcluir: { texto: "Isso! Você lembrou direitinho.", expressao: "comemorando" as const },
    solucaoDeTeste: item.solucaoDeTeste,
    modo: "sozinho" as const,
    ajudas: { pergunta: item.ajudas.pergunta, dica: item.ajudas.dica },
    conceitos: [item.conceito],
  };
  // Um item sem previsão (erro de conteúdo) vira ação: a checagem "itens-de-revisao" acusa.
  const objetivo: Objetivo =
    item.tipo === "previsao" && item.previsao ? { ...comum, tipo: "previsao", previsao: item.previsao } : { ...comum, tipo: "acao" };
  return {
    tipo: "pratica",
    id: idDaFaseDoItem(item.id),
    unidadeId: UNIDADE_REVISAO,
    titulo: `Revisão: ${nome}`.slice(0, 40),
    conceitos: [],
    pratica: [item.conceito],
    revisa: [],
    prerequisitos: [item.conceito],
    usaFerramentas,
    introducao: [{ texto: "Hora de relembrar, sem passo a passo.", expressao: "curioso" }],
    siteAlvo: {
      url: item.siteAlvo.url ?? "revisao.exemplo",
      titulo: item.siteAlvo.titulo ?? "Mini-site da revisão",
      head: item.siteAlvo.head ?? "",
      body: item.siteAlvo.body,
      ...(comCss ? { css: item.siteAlvo.css } : {}),
    },
    ...(comCss ? { paineisElementos: ["estilos" as const] } : {}),
    objetivos: [objetivo],
    conclusao: [{ texto: "Revisado!", expressao: "comemorando" }],
  };
}
