/*
 * Revisão: aninhamento (U2, Fase 1).
 *
 * Peças dentro de peças, em andares. A previsão conta andares entre o
 * botão e o body; a ação pede a peça mais de dentro de um cartão (o
 * negrito dentro do parágrafo), para o jogador descer andar por andar.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ANINHAMENTO: ItemRevisao[] = [
  {
    id: "aninhamento-1",
    conceito: "aninhamento",
    tipo: "previsao",
    enunciado: {
      mouse: "Siga os andares da árvore e responda.",
      toque: "Siga os andares da árvore e responda.",
    },
    siteAlvo: {
      url: "oficinadobeto.exemplo",
      titulo: "Oficina do Beto",
      head: HEAD_MINI,
      body: '<div class="cartao">\n  <p>Orçamento sem compromisso. <button>Chamar</button></p>\n</div>',
    },
    previsao: {
      pergunta: "O botão mora num p, que mora numa div, que mora no body. Quantos andares acima do botão está o body?",
      opcoes: ["Três", "Um", "Nenhum"],
      correta: 0,
      explicacao: "Três: o p (1), a div (2) e o body (3). Cada peça de fora é um andar a mais, como bonecas uma dentro da outra.",
    },
    ajudas: {
      pergunta: "Quem guarda o botão? E quem guarda esse?",
      dica: "Suba de um em um: botão, depois o p, depois a div, depois o body. Conte os degraus.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "aninhamento-2",
    conceito: "aninhamento",
    tipo: "acao",
    enunciado: {
      mouse: "Selecione a peça mais de dentro do cartão: o preço em negrito.",
      toque: "Toque na peça mais de dentro do cartão: o preço em negrito.",
    },
    siteAlvo: {
      url: "sorveteriapolar.exemplo",
      titulo: "Sorveteria Polar",
      head: HEAD_MINI_ESCURO,
      body: '<div class="cartao">\n  <h2>Casquinha dupla</h2>\n  <p>Hoje por <strong>8 reais</strong></p>\n</div>',
    },
    validador: { tipo: "selecionado", seletor: ".cartao p strong" },
    ajudas: {
      pergunta: "Dentro do cartão, qual peça tem outra peça dentro dela?",
      dica: "Abra o p do preço na árvore: o strong mora dentro dele. É o andar mais fundo.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: ".cartao p strong" }],
  },
];
