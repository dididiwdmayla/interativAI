/*
 * Revisão: modelo de caixa (E3, Fase 1).
 *
 * Ação: dar as camadas a uma caixa que só tem conteúdo; previsão: a ordem das
 * camadas, de dentro para fora.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_MODELO_DE_CAIXA: ItemRevisao[] = [
  {
    id: "modelo-de-caixa-1",
    conceito: "modelo-de-caixa",
    tipo: "acao",
    enunciado: {
      mouse: "O cartão só tem conteúdo. Dê a ele padding 12px, borda 2px solid gray e margin 8px.",
      toque: "O cartão só tem conteúdo. Dê a ele padding 12px, borda 2px solid gray e margin 8px.",
    },
    siteAlvo: {
      url: "aulasdeviolao.exemplo",
      titulo: "Aulas de Violão",
      head: HEAD_CSS,
      body: '<div class="cartao">Aula experimental grátis</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cartao {
  background-color: #fff3d6;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".cartao", propriedade: "padding", valor: "12px" },
        { tipo: "valorEfetivo", seletor: ".cartao", propriedade: "border", valor: "2px solid gray" },
        { tipo: "valorEfetivo", seletor: ".cartao", propriedade: "margin", valor: "8px" },
      ],
    },
    ajudas: {
      pergunta: "Quais são as camadas de uma caixa, além do conteúdo?",
      dica: "Padding, border e margin. Na regra .cartao: padding: 12px; border: 2px solid gray; margin: 8px.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".cartao" },
      { tipo: "definirPropriedade", seletorRegra: ".cartao", propriedade: "padding", valor: "12px" },
      { tipo: "definirPropriedade", seletorRegra: ".cartao", propriedade: "border", valor: "2px solid gray" },
      { tipo: "definirPropriedade", seletorRegra: ".cartao", propriedade: "margin", valor: "8px" },
    ],
  },
  {
    id: "modelo-de-caixa-2",
    conceito: "modelo-de-caixa",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando na caixa.",
      toque: "Responda pensando na caixa.",
    },
    siteAlvo: {
      url: "escolinhafutebol.exemplo",
      titulo: "Escolinha de Futebol",
      head: HEAD_CSS,
      body: '<div class="caixa">Treino às 16h</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.caixa {
  padding: 10px;
  border: 3px solid green;
  margin: 14px;
}
`,
    },
    previsao: {
      pergunta: "Da camada de dentro para a de fora, qual é a ordem certa?",
      opcoes: ["Conteúdo, margin, border, padding", "Margin, border, padding, conteúdo", "Conteúdo, padding, border, margin"],
      correta: 2,
      explicacao: "Toda peça é uma caixa: conteúdo no meio, depois padding, border e, por fora de tudo, o margin.",
    },
    ajudas: {
      pergunta: "Qual camada fica mais perto do conteúdo?",
      dica: "O padding. O margin é o mais de fora.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
