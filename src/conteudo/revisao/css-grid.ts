/*
 * Revisão: CSS grid (L3, Fase 1).
 *
 * Ação: ligar o grid numa galeria; previsão: a diferença de "grade" para "fila".
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_CSS_GRID: ItemRevisao[] = [
  {
    id: "css-grid-1",
    conceito: "css-grid",
    tipo: "acao",
    enunciado: {
      mouse: "Transforme a galeria em uma grade: display: grid.",
      toque: "Transforme a galeria em uma grade: display: grid.",
    },
    siteAlvo: {
      url: "galeriaolharvivo.exemplo",
      titulo: "Galeria Olhar Vivo",
      head: HEAD_CSS,
      body: `<div class="galeria">
  <div>Foto 1</div>
  <div>Foto 2</div>
  <div>Foto 3</div>
  <div>Foto 4</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.galeria div {
  padding: 16px;
  background-color: #eee4ff;
}

.galeria {
  gap: 8px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".galeria", propriedade: "display", valor: "grid" },
    ajudas: {
      pergunta: "Que valor de display cria linhas e colunas?",
      dica: "grid, na caixa do pai: display: grid na regra .galeria.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".galeria" },
      { tipo: "definirPropriedade", seletorRegra: ".galeria", propriedade: "display", valor: "grid" },
    ],
  },
  {
    id: "css-grid-2",
    conceito: "css-grid",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando no que o display: grid cria.",
      toque: "Responda pensando no que o display: grid cria.",
    },
    siteAlvo: {
      url: "editoradopovo.exemplo",
      titulo: "Editora do Povo",
      head: HEAD_CSS,
      body: '<div class="grade"><div>A</div><div>B</div><div>C</div><div>D</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.grade {
  display: grid;
  grid-template-columns: 100px 100px;
  gap: 8px;
}

.grade div {
  padding: 12px;
  background-color: #ffe08a;
}
`,
    },
    previsao: {
      pergunta: "Com display: grid, os filhos formam o quê?",
      opcoes: ["Uma grade de linhas e colunas", "Uma fila única", "Uma pilha de peças sobrepostas"],
      correta: 0,
      explicacao: "Com display: grid, a caixa vira uma grade de linhas e colunas, e os filhos se encaixam nela.",
    },
    ajudas: {
      pergunta: "O grid tem só um sentido (fila) ou dois (linhas e colunas)?",
      dica: "Dois: linhas e colunas.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
