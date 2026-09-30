/*
 * Revisão: modo inspecionar (U1, Fase 1).
 *
 * O caminho contrário da árvore: da tela para o código. A ação pede um
 * botão que fica no fim da página; a previsão pergunta o que acontece no
 * painel antes de fazer (quem só decorou "setinha" costuma achar que a
 * peça some ou que a página muda).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_MODO_INSPECIONAR: ItemRevisao[] = [
  {
    id: "modo-inspecionar-1",
    conceito: "modo-inspecionar",
    tipo: "acao",
    enunciado: {
      mouse: "Use a setinha do modo inspecionar e clique no botão Reservar, lá na tela.",
      toque: "Toque na setinha do modo inspecionar e depois no botão Reservar, lá na tela.",
    },
    siteAlvo: {
      url: "pousadamaresia.exemplo",
      titulo: "Pousada Maresia",
      head: HEAD_MINI,
      body: "<h1>Pousada Maresia</h1>\n<p>Quartos com vista para o mar.</p>\n<p>Café da manhã incluso.</p>\n<button>Reservar</button>",
    },
    validador: { tipo: "selecionado", seletor: "button", via: "inspecionar" },
    ajudas: {
      pergunta: "Tem um jeito de apontar direto na tela, em vez de procurar na árvore?",
      dica: "A setinha no topo do painel liga o modo inspecionar: depois é só clicar na peça, na tela.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "button", via: "inspecionar" }],
  },
  {
    id: "modo-inspecionar-2",
    conceito: "modo-inspecionar",
    tipo: "previsao",
    enunciado: {
      mouse: "Agora faça: use a setinha e clique na foto do bolo, na tela.",
      toque: "Agora faça: toque na setinha e depois na foto do bolo, na tela.",
    },
    siteAlvo: {
      url: "confeitariaglace.exemplo",
      titulo: "Confeitaria Glacê",
      head: HEAD_MINI_ESCURO,
      body: '<h2>Bolo do dia</h2>\n<div class="foto cartao">Foto do bolo de cenoura</div>\n<p>Fatia por 9 reais.</p>',
    },
    previsao: {
      pergunta: "Com a setinha ligada, você clica na foto do bolo. O que acontece no painel?",
      opcoes: ["A árvore pula até a peça da foto", "A foto some da página", "A página recarrega"],
      correta: 0,
      explicacao: "A setinha só aponta: a árvore pula até a peça que você clicou e ela fica selecionada. Nada some.",
    },
    validador: { tipo: "selecionado", seletor: ".foto", via: "inspecionar" },
    ajudas: {
      pergunta: "Onde fica a setinha do modo inspecionar?",
      dica: "No topo do painel. Ligue ela e clique na foto: veja a árvore pular.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 0 },
      { tipo: "selecionar", seletor: ".foto", via: "inspecionar" },
    ],
  },
];
