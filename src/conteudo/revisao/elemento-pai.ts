/*
 * Revisão: elemento pai (U2, Fase 1).
 *
 * A trilha é o caminho mais direto até o pai: a ação pede subir um andar
 * a partir de um item de lista. A previsão pede identificar o pai só
 * olhando o recuo da árvore, sem mexer (quem confunde pai com irmão
 * escolhe o parágrafo ao lado).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ELEMENTO_PAI: ItemRevisao[] = [
  {
    id: "elemento-pai-1",
    conceito: "elemento-pai",
    tipo: "acao",
    enunciado: {
      mouse: "Selecione o item Ração e depois, pela trilha lá embaixo, o elemento pai dele.",
      toque: "Toque no item Ração e depois, pela trilha lá embaixo, no elemento pai dele.",
    },
    siteAlvo: {
      url: "agropecuariacampo.exemplo",
      titulo: "Agropecuária Campo Verde",
      head: HEAD_MINI,
      body:
        '<h2>Mais vendidos</h2>\n<ul class="produtos">\n  <li id="racao">Ração</li>\n  <li>Sementes</li>\n  <li>Adubo</li>\n</ul>',
    },
    validador: { tipo: "selecionado", seletor: "ul.produtos", via: "trilha" },
    ajudas: {
      pergunta: "Na trilha, o que aparece logo antes do li selecionado?",
      dica: "A trilha mostra o caminho do body até a peça. Clique no andar de cima do li: é a ul, o pai dele.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: "#racao" },
      { tipo: "selecionar", seletor: "ul.produtos", via: "trilha" },
    ],
  },
  {
    id: "elemento-pai-2",
    conceito: "elemento-pai",
    tipo: "previsao",
    enunciado: {
      mouse: "Olhe o recuo da árvore e responda.",
      toque: "Olhe o recuo da árvore e responda.",
    },
    siteAlvo: {
      url: "escoladeidiomas.exemplo",
      titulo: "Escola de Idiomas Mundo",
      head: HEAD_MINI_ESCURO,
      body: '<div class="cartao">\n  <h2>Inglês para viagem</h2>\n  <p>Turmas aos sábados.</p>\n</div>',
    },
    previsao: {
      pergunta: "Na árvore, o h2 aparece mais para dentro, abaixo da div.cartao. Quem é o pai do h2?",
      opcoes: ["A div.cartao", "O parágrafo ao lado", "O próprio h2"],
      correta: 0,
      explicacao: "A div.cartao é o pai: ela guarda o h2 dentro dela. O parágrafo ao lado é irmão do h2, não pai.",
    },
    ajudas: {
      pergunta: "Qual peça abre antes do h2 e só fecha depois dele?",
      dica: "O pai é a peça de fora, a que contém a outra. Na árvore, ele fica um andar para a esquerda.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
