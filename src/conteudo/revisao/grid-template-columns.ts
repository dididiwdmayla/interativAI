/*
 * Revisão: grid-template-columns (L3, Fase 1).
 *
 * Ação: definir três colunas fixas; previsão: contar colunas pelo valor.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_GRID_TEMPLATE_COLUMNS: ItemRevisao[] = [
  {
    id: "grid-template-columns-1",
    conceito: "grid-template-columns",
    tipo: "acao",
    enunciado: {
      mouse: "Faça a grade ter três colunas de 100px: grid-template-columns: 100px 100px 100px.",
      toque: "Faça a grade ter três colunas de 100px: grid-template-columns: 100px 100px 100px.",
    },
    siteAlvo: {
      url: "papelariaclip.exemplo",
      titulo: "Papelaria Clip",
      head: HEAD_CSS,
      body: `<div class="grade">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.grade {
  display: grid;
  gap: 8px;
}

.grade div {
  padding: 10px;
  background-color: #cdeac0;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".grade", propriedade: "grid-template-columns", valor: "100px 100px 100px" },
    ajudas: {
      pergunta: "Que propriedade diz quantas colunas o grid tem e a largura de cada uma?",
      dica: "grid-template-columns, na regra .grade, com três larguras.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".grade" },
      { tipo: "definirPropriedade", seletorRegra: ".grade", propriedade: "grid-template-columns", valor: "100px 100px 100px" },
    ],
  },
  {
    id: "grid-template-columns-2",
    conceito: "grid-template-columns",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o valor.",
      toque: "Responda olhando o valor.",
    },
    siteAlvo: {
      url: "estudiodefoto.exemplo",
      titulo: "Estúdio de Foto",
      head: HEAD_CSS,
      body: '<div class="grade"><div>A</div><div>B</div><div>C</div><div>D</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.grade {
  display: grid;
  grid-template-columns: 120px 120px;
}

.grade div {
  padding: 10px;
  background-color: #ffd6a5;
}
`,
    },
    previsao: {
      pergunta: "Com grid-template-columns: 120px 120px, quantas colunas a grade tem?",
      opcoes: ["Uma", "Duas", "Quatro"],
      correta: 1,
      explicacao: "Cada valor da lista é uma coluna: dois valores, duas colunas.",
    },
    ajudas: {
      pergunta: "Cada valor em grid-template-columns é uma coluna?",
      dica: "É: conte os valores.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
