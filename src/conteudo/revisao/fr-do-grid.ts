/*
 * Revisão: unidade fr (L3, Fase 1).
 *
 * Ação: dar o dobro do espaço para uma coluna; previsão: a conta das frações.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_FR_DO_GRID: ItemRevisao[] = [
  {
    id: "fr-do-grid-1",
    conceito: "fr-do-grid",
    tipo: "acao",
    enunciado: {
      mouse: "A coluna do conteúdo deve ter o dobro da lateral. Escreva grid-template-columns: 1fr 2fr.",
      toque: "A coluna do conteúdo deve ter o dobro da lateral. Escreva grid-template-columns: 1fr 2fr.",
    },
    siteAlvo: {
      url: "blogdaelisa.exemplo",
      titulo: "Blog da Elisa",
      head: HEAD_CSS,
      body: `<div class="pagina">
  <div class="lateral">Menu</div>
  <div class="conteudo">Texto do post</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.pagina {
  display: grid;
  gap: 10px;
}

.lateral, .conteudo {
  padding: 12px;
  background-color: #e0f2e9;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".pagina", propriedade: "grid-template-columns", valor: "1fr 2fr" },
    ajudas: {
      pergunta: "Que unidade divide o espaço que sobra em frações?",
      dica: "fr: 1fr 2fr dá o dobro para a segunda.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".pagina" },
      { tipo: "definirPropriedade", seletorRegra: ".pagina", propriedade: "grid-template-columns", valor: "1fr 2fr" },
    ],
  },
  {
    id: "fr-do-grid-2",
    conceito: "fr-do-grid",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda fazendo a conta das frações.",
      toque: "Responda fazendo a conta das frações.",
    },
    siteAlvo: {
      url: "hortaurbana.exemplo",
      titulo: "Horta Urbana",
      head: HEAD_CSS,
      body: '<div class="grade"><div>A</div><div>B</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.grade {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 8px;
}

.grade div {
  padding: 10px;
  background-color: #cdeac0;
}
`,
    },
    previsao: {
      pergunta: "Com grid-template-columns: 1fr 3fr, a segunda coluna tem quantas vezes o espaço da primeira?",
      opcoes: ["O mesmo", "Quatro vezes", "Três vezes"],
      correta: 2,
      explicacao: "O fr divide o espaço que sobra em frações: 1fr e 3fr são partes 1 e 3, então a segunda tem o triplo.",
    },
    ajudas: {
      pergunta: "Em 1fr 3fr, quantas partes tem a segunda coluna em relação à primeira?",
      dica: "Três: 3fr é três partes para 1fr de uma.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
