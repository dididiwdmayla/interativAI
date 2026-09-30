/*
 * Revisão: cor do texto, color (E1, Fase 1).
 *
 * A confusão é misturar a cor das letras com a do fundo. Ação: pintar as letras de
 * uma peça; previsão: qual propriedade faz isso (com uma opção que não existe).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_COR_DO_TEXTO: ItemRevisao[] = [
  {
    id: "cor-do-texto-1",
    conceito: "cor-do-texto",
    tipo: "acao",
    enunciado: {
      mouse: "Pinte as letras do preço de verde-escuro (darkgreen).",
      toque: "Pinte as letras do preço de verde-escuro (darkgreen).",
    },
    siteAlvo: {
      url: "quitandadonai.exemplo",
      titulo: "Quitanda da Nai",
      head: HEAD_CSS,
      body: `<h2>Melancia</h2>
<p class="preco">R$ 12 a peça</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.preco {
  font-size: 1.5rem;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".preco", propriedade: "color", valor: "darkgreen" },
    ajudas: {
      pergunta: "Qual propriedade pinta as letras?",
      dica: "color. No painel Estilos, na regra .preco, acrescente color: darkgreen.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".preco" },
      { tipo: "definirPropriedade", seletorRegra: ".preco", propriedade: "color", valor: "darkgreen" },
    ],
  },
  {
    id: "cor-do-texto-2",
    conceito: "cor-do-texto",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando nas letras da peça.",
      toque: "Responda pensando nas letras da peça.",
    },
    siteAlvo: {
      url: "escoladenatacao.exemplo",
      titulo: "Escola de Natação",
      head: HEAD_CSS,
      body: '<p class="turma">Turma das 7h</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.turma {
  font-size: 1.2rem;
}
`,
    },
    previsao: {
      pergunta: "Para pintar as LETRAS do texto, qual propriedade se usa?",
      opcoes: ["background-color", "font-color", "color"],
      correta: 2,
      explicacao: "color pinta as letras. background-color pinta o fundo da caixa. E font-color não existe no CSS.",
    },
    ajudas: {
      pergunta: "As letras se pintam com a propriedade que se chama como?",
      dica: "Simplesmente color. O fundo é outra: background-color.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
