/*
 * Revisão: estrutura do documento (U6, Fase 1), no modo documento.
 *
 * Ação: o jogador põe o conteúdo dentro do body, o lugar certo; previsão: a
 * ordem do esqueleto.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_ESTRUTURA_DO_DOCUMENTO: ItemRevisao[] = [
  {
    id: "estrutura-do-documento-1",
    conceito: "estrutura-do-documento",
    tipo: "acao",
    enunciado: {
      mouse: "O body só tem um aviso. Escreva um h1 com o texto 'Feira de Adoção' dentro do body.",
      toque: "O body só tem um aviso. Escreva um h1 com o texto 'Feira de Adoção' dentro do body.",
    },
    siteAlvo: {
      url: "feiradeadocao.exemplo",
      titulo: "Feira de Adoção",
      head: cabecaComTitulo("Feira de Adoção"),
      body: "<p>Em breve.</p>",
    },
    modoDocumento: true,
    validador: { tipo: "textoIgual", seletor: "body h1", valor: "Feira de Adoção" },
    ajudas: {
      pergunta: "O que aparece na tela fica dentro de qual parte do documento?",
      dica: "Dentro do body. Escreva <h1>Feira de Adoção</h1> entre <body> e </body>.",
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "body", posicao: "inicio", html: "<h1>Feira de Adoção</h1>" }],
  },
  {
    id: "estrutura-do-documento-2",
    conceito: "estrutura-do-documento",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a árvore do documento.",
      toque: "Responda olhando a árvore do documento.",
    },
    siteAlvo: {
      url: "cinemadopovo.exemplo",
      titulo: "Cinema do Povo",
      head: cabecaComTitulo("Cinema do Povo"),
      body: `<h1>Cinema do Povo</h1>
<p>Sessões às 16h e às 20h.</p>`,
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Na árvore do documento, o que fica DENTRO do html?",
      opcoes: ["Só o body", "O head e o body", "O doctype e o head"],
      correta: 1,
      explicacao: "A raiz html guarda duas partes: o head (informações sobre a página) e o body (o que aparece). O doctype vem antes, fora dela.",
    },
    ajudas: {
      pergunta: "O esqueleto tem quantas partes principais dentro do html?",
      dica: "Duas: o head e o body.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
