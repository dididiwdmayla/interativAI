/*
 * Revisão: código HTML (U1, Fase 1).
 *
 * A fase mostrou que a árvore e o código são a mesma página. A previsão
 * pergunta onde fica o texto dentro de uma linha de código; a ação pede
 * clicar no código do aviso e ver a tela acender (a sincronia), num site
 * em que o aviso é o último elemento.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_CODIGO_HTML: ItemRevisao[] = [
  {
    id: "codigo-html-1",
    conceito: "codigo-html",
    tipo: "previsao",
    enunciado: {
      mouse: "Olhe o código embaixo do painel e responda.",
      toque: "Abra o Código no painel e responda.",
    },
    siteAlvo: {
      url: "feiradaspulgas.exemplo",
      titulo: "Feira das Pulgas",
      head: HEAD_MINI,
      body: "<h1>Feira das Pulgas</h1>\n<p>Aberta aos sábados.</p>",
    },
    previsao: {
      pergunta: "No código está escrito <p>Aberta aos sábados.</p>. Onde está o texto que aparece na tela?",
      opcoes: ["Entre a tag que abre e a que fecha", "Dentro do sinal de menor", "Em outro arquivo"],
      correta: 0,
      explicacao: "O texto fica entre <p> e </p>. As tags marcam onde a peça começa e termina; o que está no meio aparece na tela.",
    },
    ajudas: {
      pergunta: "Qual parte da linha é igual ao que você lê na página?",
      dica: "Compare a tela com o código: o texto da tela aparece no meio da linha, entre duas tags.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "codigo-html-2",
    conceito: "codigo-html",
    tipo: "acao",
    enunciado: {
      mouse: "No editor de código, clique na linha do aviso e veja ele acender na tela.",
      toque: "No Código, toque na linha do aviso e veja ele acender na tela.",
    },
    siteAlvo: {
      url: "academiaforte.exemplo",
      titulo: "Academia Forte",
      head: HEAD_MINI_ESCURO,
      body: '<h1>Academia Forte</h1>\n<p>Musculação e dança.</p>\n<p class="aviso">Fechado no feriado de segunda.</p>',
    },
    validador: { tipo: "selecionado", seletor: ".aviso", via: "editor" },
    ajudas: {
      pergunta: "Em que parte do painel o HTML aparece escrito?",
      dica: "No editor de código. Clique no meio da linha do aviso: a árvore e a tela acendem a mesma peça.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: ".aviso", via: "editor" }],
  },
];
