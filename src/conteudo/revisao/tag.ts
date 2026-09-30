/*
 * Revisão: tag (U1, Fase 1).
 *
 * A confusão de leigo é achar que a tag é enfeite. A previsão pergunta o
 * que a tag DIZ ao navegador; a ação pede achar uma peça pelo nome da tag,
 * num site em que o botão não é o primeiro elemento.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI } from "./sites/estilos";

export const ITENS_TAG: ItemRevisao[] = [
  {
    id: "tag-1",
    conceito: "tag",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda a pergunta do computadorzinho olhando a árvore.",
      toque: "Responda a pergunta do computadorzinho olhando a árvore.",
    },
    siteAlvo: {
      url: "escolademusicaacorde.exemplo",
      titulo: "Escola de Música Acorde",
      head: HEAD_MINI,
      body: "<h1>Escola de Música Acorde</h1>\n<p>Aulas de violão para iniciantes.</p>",
    },
    previsao: {
      pergunta: "Na árvore, o título aparece como <h1>. O que esse h1 diz ao navegador?",
      opcoes: ["Que tipo de peça é aquela", "A cor do texto", "O tamanho da tela"],
      correta: 0,
      explicacao: "A tag diz o tipo da peça: h1 é o título mais importante, p é parágrafo. A cor vem de outro lugar (o CSS).",
    },
    ajudas: {
      pergunta: "Se o título fosse um parágrafo, que tag ele teria?",
      dica: "A tag é a etiqueta entre < e >. Ela nomeia o tipo de peça, não o visual.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "tag-2",
    conceito: "tag",
    tipo: "acao",
    enunciado: {
      mouse: "Clique, na árvore, na peça com a tag button.",
      toque: "Toque, na árvore, na peça com a tag button.",
    },
    siteAlvo: {
      url: "bicicletariaraio.exemplo",
      titulo: "Bicicletaria Raio",
      head: HEAD_MINI,
      body:
        '<h2>Revisão completa</h2>\n<p>Freio, corrente e pneus.</p>\n<p><a href="#precos">Ver preços</a></p>\n<button>Agendar revisão</button>',
    },
    validador: { tipo: "selecionado", seletor: "button" },
    ajudas: {
      pergunta: "Qual linha da árvore começa com <button?",
      dica: "Procure pelo nome da tag, não pelo texto: a tag button é a do botão de agendar.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "button" }],
  },
];
