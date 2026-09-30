/*
 * Revisão: position (L4, Fase 1).
 *
 * Ação: mudar o modo de posicionamento de uma peça; previsão: qual é o padrão.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_POSITION_CSS: ItemRevisao[] = [
  {
    id: "position-css-1",
    conceito: "position-css",
    tipo: "acao",
    enunciado: {
      mouse: "Mude o modo de posicionamento do selo para relative, com position.",
      toque: "Mude o modo de posicionamento do selo para relative, com position.",
    },
    siteAlvo: {
      url: "estudiodetatu.exemplo",
      titulo: "Estúdio Traço Fino",
      head: HEAD_CSS,
      body: '<p>Agende sua sessão <span class="selo">novidade</span></p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  background-color: #ffe08a;
  padding: 2px 8px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".selo", propriedade: "position", valor: "relative" },
    ajudas: {
      pergunta: "Que propriedade decide como a peça se posiciona na página?",
      dica: "position: relative, na regra .selo.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".selo" },
      { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "position", valor: "relative" },
    ],
  },
  {
    id: "position-css-2",
    conceito: "position-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em peças sem regra de position.",
      toque: "Responda pensando em peças sem regra de position.",
    },
    siteAlvo: {
      url: "lojadebrinquedos.exemplo",
      titulo: "Loja de Brinquedos",
      head: HEAD_CSS,
      body: '<p class="aviso">Frete grátis</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  background-color: #cdeac0;
}
`,
    },
    previsao: {
      pergunta: "Uma peça sem nenhum position escrito, qual modo usa?",
      opcoes: ["relative", "absolute", "static, o padrão"],
      correta: 2,
      explicacao: "O padrão é static: a peça fica no fluxo normal da página, no lugar de sempre.",
    },
    ajudas: {
      pergunta: "Se ninguém escreveu position, qual modo vale?",
      dica: "static, o normal.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
