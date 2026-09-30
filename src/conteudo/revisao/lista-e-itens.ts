/*
 * Revisão: lista e itens (U1, Fases 1 e 2).
 *
 * A previsão ataca "a lista é cada linha": selecionar a ul acende a lista
 * inteira. A ação pede trocar o texto de um item do meio, numa lista
 * numerada nova (a fase usou uma lista comum).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_LISTA_E_ITENS: ItemRevisao[] = [
  {
    id: "lista-e-itens-1",
    conceito: "lista-e-itens",
    tipo: "previsao",
    enunciado: {
      mouse: "Agora faça: selecione a ul na árvore e veja o que acende.",
      toque: "Agora faça: toque na ul na árvore e veja o que acende.",
    },
    siteAlvo: {
      url: "festajunina.exemplo",
      titulo: "Festa Junina da Rua",
      head: HEAD_MINI,
      body: "<h2>Convidados</h2>\n<ul>\n  <li>Dona Cida</li>\n  <li>Seu Juca</li>\n  <li>Marina</li>\n</ul>",
    },
    previsao: {
      pergunta: "A lista de convidados é uma ul com três li. Se você selecionar a ul, o que acende na tela?",
      opcoes: ["A lista inteira", "Só o primeiro nome", "Nada"],
      correta: 0,
      explicacao: "A ul é a lista toda: ela guarda os li. Selecionar a ul acende todos os itens juntos.",
    },
    validador: { tipo: "selecionado", seletor: "ul" },
    ajudas: {
      pergunta: "Quem guarda os itens: a ul ou cada li?",
      dica: "A ul é a caixa da lista; cada li é um item dentro dela.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 0 },
      { tipo: "selecionar", seletor: "ul" },
    ],
  },
  {
    id: "lista-e-itens-2",
    conceito: "lista-e-itens",
    tipo: "acao",
    enunciado: {
      mouse: "Troque o texto do terceiro passo da receita por outro.",
      toque: "Troque o texto do terceiro passo da receita por outro.",
    },
    siteAlvo: {
      url: "receitadavovo.exemplo",
      titulo: "Receita da Vovó",
      head: HEAD_MINI_ESCURO,
      body:
        "<h2>Pão de queijo</h2>\n<ol>\n  <li>Ferva o leite com o óleo.</li>\n  <li>Misture no polvilho.</li>\n  <li>Junte o queijo e os ovos.</li>\n  <li>Asse por 25 minutos.</li>\n</ol>",
    },
    validador: { tipo: "textoDiferenteDoInicial", seletor: "li:nth-child(3)" },
    ajudas: {
      pergunta: "Cada passo da receita é que tipo de peça dentro da lista?",
      dica: "Um li. Conte até o terceiro li e dê dois cliques no texto dele.",
    },
    solucaoDeTeste: [{ tipo: "definirTexto", seletor: "li:nth-child(3)", valor: "Junte o queijo ralado." }],
  },
];
