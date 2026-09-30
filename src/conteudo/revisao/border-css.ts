/*
 * Revisão: border (E3, Fase 1).
 *
 * Ação: escrever a borda com espessura, estilo e cor; previsão: o que é o solid.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_BORDER_CSS: ItemRevisao[] = [
  {
    id: "border-css-1",
    conceito: "border-css",
    tipo: "acao",
    enunciado: {
      mouse: "Dê ao cartão uma borda de 3px, tracejada (dashed) e de cor teal.",
      toque: "Dê ao cartão uma borda de 3px, tracejada (dashed) e de cor teal.",
    },
    siteAlvo: {
      url: "brechodaana.exemplo",
      titulo: "Brechó da Ana",
      head: HEAD_CSS,
      body: '<div class="cartao">Peças de verão com 50%</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cartao {
  padding: 12px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".cartao", propriedade: "border", valor: "3px dashed teal" },
    ajudas: {
      pergunta: "Uma borda precisa de quais três coisas?",
      dica: "Espessura, estilo e cor: border: 3px dashed teal.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".cartao" },
      { tipo: "definirPropriedade", seletorRegra: ".cartao", propriedade: "border", valor: "3px dashed teal" },
    ],
  },
  {
    id: "border-css-2",
    conceito: "border-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a declaração da borda.",
      toque: "Responda olhando a declaração da borda.",
    },
    siteAlvo: {
      url: "vidracariacristal.exemplo",
      titulo: "Vidraçaria Cristal",
      head: HEAD_CSS,
      body: '<div class="quadro">Orçamento em 24h</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.quadro {
  padding: 10px;
  border: 2px solid firebrick;
}
`,
    },
    previsao: {
      pergunta: "Em border: 2px solid firebrick, o que é o solid?",
      opcoes: ["A espessura da linha", "O estilo da linha: contínua", "A cor da linha"],
      correta: 1,
      explicacao: "A borda tem espessura (2px), estilo (solid, dashed...) e cor (firebrick).",
    },
    ajudas: {
      pergunta: "Das três partes da borda, qual diz se a linha é contínua ou tracejada?",
      dica: "O estilo, o do meio: solid, dashed, dotted.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
