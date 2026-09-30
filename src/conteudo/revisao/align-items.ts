/*
 * Revisão: align-items (L2, Fase 2).
 *
 * Ação: centralizar na vertical dentro de uma caixa alta; previsão: em que sentido
 * o align-items trabalha numa fila em linha.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_ALIGN_ITEMS: ItemRevisao[] = [
  {
    id: "align-items-1",
    conceito: "align-items",
    tipo: "acao",
    enunciado: {
      mouse: "O texto está colado no topo da faixa. Centralize na vertical com align-items: center.",
      toque: "O texto está colado no topo da faixa. Centralize na vertical com align-items: center.",
    },
    siteAlvo: {
      url: "hoteldolago.exemplo",
      titulo: "Hotel do Lago",
      head: HEAD_CSS,
      body: `<div class="faixa">
  <p>Café da manhã incluso</p>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.faixa {
  display: flex;
  height: 120px;
  background-color: #cdeac0;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".faixa", propriedade: "align-items", valor: "center" },
    ajudas: {
      pergunta: "Que propriedade alinha os filhos no sentido cruzado da fila?",
      dica: "align-items: center, na regra .faixa.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".faixa" },
      { tipo: "definirPropriedade", seletorRegra: ".faixa", propriedade: "align-items", valor: "center" },
    ],
  },
  {
    id: "align-items-2",
    conceito: "align-items",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando na fila em linha.",
      toque: "Responda pensando na fila em linha.",
    },
    siteAlvo: {
      url: "mercadinhoprimavera.exemplo",
      titulo: "Mercadinho Primavera",
      head: HEAD_CSS,
      body: '<div class="linha"><span class="a">Pão</span><span class="b">Leite integral do sítio</span></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.linha {
  display: flex;
  align-items: center;
  height: 100px;
  background-color: #ffe9c7;
}
`,
    },
    previsao: {
      pergunta: "Numa fila em linha, o align-items: center alinha para onde?",
      opcoes: ["Para o meio da altura, na vertical", "Para o meio da largura, na horizontal", "Não muda nada"],
      correta: 0,
      explicacao: "align-items trabalha no sentido cruzado: numa fila em linha, é a vertical.",
    },
    ajudas: {
      pergunta: "Numa fila em linha, o sentido cruzado é vertical ou horizontal?",
      dica: "Vertical. O justify-content é o do sentido da fila.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
