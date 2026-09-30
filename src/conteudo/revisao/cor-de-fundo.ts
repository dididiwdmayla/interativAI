/*
 * Revisão: cor de fundo, background-color (E1, Fase 1).
 *
 * Ação: pintar o fundo de uma faixa; previsão: o que uma regra pinta (a caixa,
 * não as letras).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_COR_DE_FUNDO: ItemRevisao[] = [
  {
    id: "cor-de-fundo-1",
    conceito: "cor-de-fundo",
    tipo: "acao",
    enunciado: {
      mouse: "Pinte o fundo da faixa de aviso de dourado (gold).",
      toque: "Pinte o fundo da faixa de aviso de dourado (gold).",
    },
    siteAlvo: {
      url: "cinemacantoazul.exemplo",
      titulo: "Cinema Canto Azul",
      head: HEAD_CSS,
      body: '<p class="faixa">Estreia nesta sexta!</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.faixa {
  padding: 12px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".faixa", propriedade: "background-color", valor: "gold" },
    ajudas: {
      pergunta: "Qual propriedade pinta o fundo da caixa?",
      dica: "background-color. No painel Estilos, na regra .faixa, acrescente background-color: gold.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".faixa" },
      { tipo: "definirPropriedade", seletorRegra: ".faixa", propriedade: "background-color", valor: "gold" },
    ],
  },
  {
    id: "cor-de-fundo-2",
    conceito: "cor-de-fundo",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra na folha.",
      toque: "Responda olhando a regra na folha.",
    },
    siteAlvo: {
      url: "lavanderiabolhas.exemplo",
      titulo: "Lavanderia Bolhas",
      head: HEAD_CSS,
      body: '<p class="oferta">Lave 5 peças e leve 6</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.oferta {
  background-color: tomato;
  color: white;
}
`,
    },
    previsao: {
      pergunta: "Nesta regra, o que o tomato pinta?",
      opcoes: ["O fundo da caixa", "As letras", "A borda"],
      correta: 0,
      explicacao: "background-color pinta o fundo da caixa da peça; as letras são do color, que aqui está em white.",
    },
    ajudas: {
      pergunta: "background-color pinta as letras ou o fundo?",
      dica: "O fundo da caixa. As letras ficam por conta do color.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
