/*
 * Revisão: grid-template-rows (L3, Fase 2).
 *
 * Ação: definir a altura das linhas; previsão: o que a propriedade controla.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_GRID_TEMPLATE_ROWS: ItemRevisao[] = [
  {
    id: "grid-template-rows-1",
    conceito: "grid-template-rows",
    tipo: "acao",
    enunciado: {
      mouse: "Dê duas linhas de 80px à grade com grid-template-rows: 80px 80px.",
      toque: "Dê duas linhas de 80px à grade com grid-template-rows: 80px 80px.",
    },
    siteAlvo: {
      url: "clinicadeolhos.exemplo",
      titulo: "Clínica de Olhos",
      head: HEAD_CSS,
      body: `<div class="grade">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.grade {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.grade div {
  background-color: #eee4ff;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".grade", propriedade: "grid-template-rows", valor: "80px 80px" },
    ajudas: {
      pergunta: "Que propriedade diz a altura de cada linha do grid?",
      dica: "grid-template-rows, na regra .grade: 80px 80px.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".grade" },
      { tipo: "definirPropriedade", seletorRegra: ".grade", propriedade: "grid-template-rows", valor: "80px 80px" },
    ],
  },
  {
    id: "grid-template-rows-2",
    conceito: "grid-template-rows",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "pizzariadonono.exemplo",
      titulo: "Pizzaria do Nono",
      head: HEAD_CSS,
      body: '<div class="cardapio"><div>1</div><div>2</div><div>3</div><div>4</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cardapio {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 60px 120px;
  gap: 6px;
}

.cardapio div {
  background-color: #ffe9c7;
}
`,
    },
    previsao: {
      pergunta: "Com grid-template-rows: 60px 120px, o que acontece com as duas linhas da grade?",
      opcoes: ["A primeira tem 60px e a segunda, 120px de altura", "As duas colunas ficam com 60px e 120px de largura", "Nada, é para as colunas"],
      correta: 0,
      explicacao: "grid-template-rows faz para as linhas o que grid-template-columns faz para as colunas: define a altura de cada uma.",
    },
    ajudas: {
      pergunta: "Rows são linhas ou colunas?",
      dica: "Linhas, e a medida é a altura.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
