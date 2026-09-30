/*
 * Revisão: modo dispositivo (R1, Fase 1).
 *
 * Ação: ligar o modo dispositivo num modelo de celular; previsão: o modo mexe no
 * arquivo do site? (não: só mostra como fica).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_MODO_DISPOSITIVO: ItemRevisao[] = [
  {
    id: "modo-dispositivo-1",
    conceito: "modo-dispositivo",
    tipo: "acao",
    enunciado: {
      mouse: "Veja como a página fica num celular: ligue o modo dispositivo no Celular 390.",
      toque: "Veja como a página fica num celular: ligue o modo dispositivo no Celular 390.",
    },
    siteAlvo: {
      url: "lojadocelular.exemplo",
      titulo: "Loja do Celular",
      head: HEAD_CSS,
      body: `<h1>Loja do Celular</h1>
<p>Capas, películas e carregadores.</p>`,
    },
    validador: { tipo: "dispositivo", largura: 390 },
    ajudas: {
      pergunta: "Qual botão do F12 mostra a página do tamanho de um celular?",
      dica: "O botão de dispositivo, ao lado da setinha (ou Ctrl+Shift+M): escolha Celular 390.",
    },
    solucaoDeTeste: [{ tipo: "trocarDispositivo", modelo: "celular-390" }],
  },
  {
    id: "modo-dispositivo-2",
    conceito: "modo-dispositivo",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando no que o modo dispositivo faz.",
      toque: "Responda pensando no que o modo dispositivo faz.",
    },
    siteAlvo: {
      url: "floriculturarosaverde.exemplo",
      titulo: "Floricultura Rosa Verde",
      head: HEAD_CSS,
      body: `<h1>Floricultura Rosa Verde</h1>
<p>Entregas no mesmo dia.</p>`,
    },
    previsao: {
      pergunta: "Você liga o modo dispositivo e escolhe o Tablet. O arquivo do site muda?",
      opcoes: ["Sim, o site passa a ser de tablet", "Sim, mas só no seu computador", "Não, só mostra como a página fica nesse tamanho"],
      correta: 2,
      explicacao: "O modo dispositivo só simula a tela: mostra a página no tamanho de um celular ou tablet, sem mexer no HTML nem no CSS.",
    },
    ajudas: {
      pergunta: "O modo dispositivo muda o site ou só o jeito de olhar para ele?",
      dica: "Só o jeito de olhar: é uma simulação.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
