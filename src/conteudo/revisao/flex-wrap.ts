/*
 * Revisão: flex-wrap (L2, Fase 3).
 *
 * Ação: deixar os filhos quebrarem de linha; previsão: o que acontece sem o wrap.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_FLEX_WRAP: ItemRevisao[] = [
  {
    id: "flex-wrap-1",
    conceito: "flex-wrap",
    tipo: "acao",
    enunciado: {
      mouse: "Os cartões apertam na mesma fila. Deixe eles quebrarem para a linha de baixo: flex-wrap: wrap.",
      toque: "Os cartões apertam na mesma fila. Deixe eles quebrarem para a linha de baixo: flex-wrap: wrap.",
    },
    siteAlvo: {
      url: "cursodeculinaria.exemplo",
      titulo: "Curso de Culinária",
      head: HEAD_CSS,
      body: `<div class="cursos">
  <div>Massas</div>
  <div>Doces</div>
  <div>Pães</div>
  <div>Sopas</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cursos {
  display: flex;
}

.cursos div {
  width: 160px;
  padding: 10px;
  background-color: #ffe9c7;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".cursos", propriedade: "flex-wrap", valor: "wrap" },
    ajudas: {
      pergunta: "Que propriedade deixa os filhos quebrarem para a linha de baixo?",
      dica: "flex-wrap: wrap, na regra .cursos.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".cursos" },
      { tipo: "definirPropriedade", seletorRegra: ".cursos", propriedade: "flex-wrap", valor: "wrap" },
    ],
  },
  {
    id: "flex-wrap-2",
    conceito: "flex-wrap",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "lojadefolhas.exemplo",
      titulo: "Loja de Folhas",
      head: HEAD_CSS,
      body: '<div class="fila"><div>Um</div><div>Dois</div><div>Três</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.fila {
  display: flex;
}

.fila div {
  width: 300px;
  padding: 10px;
  background-color: #cbd5f5;
}
`,
    },
    previsao: {
      pergunta: "Sem flex-wrap, numa tela que não comporta os três de 300px, o que acontece?",
      opcoes: ["Quebram para a linha de baixo", "O último some", "Ficam na mesma fila, apertando ou estourando"],
      correta: 2,
      explicacao: "Sem flex-wrap, os filhos ficam sempre na mesma fila. Com wrap, quebram para a linha de baixo quando não cabem.",
    },
    ajudas: {
      pergunta: "Por padrão, a fila do flex quebra de linha?",
      dica: "Não: só com flex-wrap: wrap.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
