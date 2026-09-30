/*
 * Revisão: elemento (ensinado na U1, Fase 1).
 *
 * Por que estes itens: a fase ensinou "elemento" apontando peças na
 * Padaria. Aqui o jogador precisa RECONHECER peças num site que nunca viu:
 * uma previsão que obriga a olhar a árvore e contar (quem só decorou a
 * palavra erra) e uma ação que pede achar uma peça pelo que ela mostra.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ELEMENTO: ItemRevisao[] = [
  {
    id: "elemento-1",
    conceito: "elemento",
    tipo: "previsao",
    enunciado: {
      mouse: "Olhe a árvore e responda a pergunta do computadorzinho.",
      toque: "Olhe a árvore e responda a pergunta do computadorzinho.",
    },
    siteAlvo: {
      url: "floriculturaipe.exemplo",
      titulo: "Floricultura Ipê",
      head: HEAD_MINI,
      body: "<h1>Floricultura Ipê</h1>\n<p>Buquês feitos na hora.</p>\n<p>Entregamos no bairro todo.</p>\n<button>Pedir buquê</button>",
    },
    previsao: {
      pergunta: "Quantos elementos moram direto dentro do body desta floricultura?",
      opcoes: ["Quatro: um título, dois parágrafos e um botão", "Um só: a página inteira", "Nenhum: é só texto"],
      correta: 0,
      explicacao: "Quatro! Cada pedaço que você vê é um elemento, uma pecinha própria: o h1, os dois p e o button.",
    },
    ajudas: {
      pergunta: "Na árvore, quantas linhas aparecem logo abaixo do body?",
      dica: "Cada linha da árvore que abre e fecha uma tag é um elemento.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "elemento-2",
    conceito: "elemento",
    tipo: "acao",
    enunciado: {
      mouse: "Clique, na árvore, no elemento que mostra o telefone do pet shop.",
      toque: "Toque, na árvore, no elemento que mostra o telefone do pet shop.",
    },
    siteAlvo: {
      url: "petshopfocinho.exemplo",
      titulo: "Pet Shop Focinho",
      head: HEAD_MINI_ESCURO,
      body:
        '<h1>Pet Shop Focinho</h1>\n<div class="cartao">\n  <p>Banho e tosa com hora marcada.</p>\n  <p id="telefone">Telefone: (11) 4000-1234</p>\n</div>',
    },
    validador: { tipo: "selecionado", seletor: "#telefone" },
    ajudas: {
      pergunta: "Qual pecinha da tela tem o número de telefone?",
      dica: "Passe pela árvore e veja o que acende: o telefone é um parágrafo dentro do cartão.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "#telefone" }],
  },
];
