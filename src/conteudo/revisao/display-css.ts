/*
 * Revisão: display (L1, Fase 1).
 *
 * Ação: mudar o formato da caixa para as peças ficarem na mesma linha; previsão:
 * qual propriedade decide isso.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_DISPLAY_CSS: ItemRevisao[] = [
  {
    id: "display-css-1",
    conceito: "display-css",
    tipo: "acao",
    enunciado: {
      mouse: "Os dois atalhos estão um embaixo do outro. Ponha os dois na mesma linha com display: inline-block.",
      toque: "Os dois atalhos estão um embaixo do outro. Ponha os dois na mesma linha com display: inline-block.",
    },
    siteAlvo: {
      url: "pousadamarazul.exemplo",
      titulo: "Pousada Mar Azul",
      head: HEAD_CSS,
      body: `<div class="atalho" id="a1">Quartos</div>
<div class="atalho" id="a2">Passeios</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.atalho {
  padding: 8px 12px;
  background-color: #dfe7fd;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: "#a1", propriedade: "display", valor: "inline-block" },
        { tipo: "valorEfetivo", seletor: "#a2", propriedade: "display", valor: "inline-block" },
      ],
    },
    ajudas: {
      pergunta: "Que propriedade decide o formato da caixa: em bloco, em linha...?",
      dica: "display. Na regra .atalho, acrescente display: inline-block.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".atalho" },
      { tipo: "definirPropriedade", seletorRegra: ".atalho", propriedade: "display", valor: "inline-block" },
    ],
  },
  {
    id: "display-css-2",
    conceito: "display-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "chaveirodazeze.exemplo",
      titulo: "Chaveiro da Zeze",
      head: HEAD_CSS,
      body: '<p class="selo">Abrimos 24h</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  display: inline;
  background-color: #ffe08a;
}
`,
    },
    previsao: {
      pergunta: "Que propriedade escolhe se a caixa é block, inline, inline-block ou none?",
      opcoes: ["position", "display", "overflow"],
      correta: 1,
      explicacao: "O display decide o formato da caixa de uma peça: em bloco, na linha, os dois juntos ou sumida.",
    },
    ajudas: {
      pergunta: "Block, inline e none são valores de qual propriedade?",
      dica: "Do display.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
