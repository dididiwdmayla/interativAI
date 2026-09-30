/*
 * Revisão: display inline-block (L1, Fase 2).
 *
 * Ação: um span que ignora as medidas passa a respeitar mantendo a linha; previsão:
 * o que inline-block tem de cada um.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_DISPLAY_INLINE_BLOCK: ItemRevisao[] = [
  {
    id: "display-inline-block-1",
    conceito: "display-inline-block",
    tipo: "acao",
    enunciado: {
      mouse: "O selo tem width e height, mas o span ignora. Faça ele respeitar e continuar na linha: display: inline-block.",
      toque: "O selo tem width e height, mas o span ignora. Faça ele respeitar e continuar na linha: display: inline-block.",
    },
    siteAlvo: {
      url: "oficinadostecidos.exemplo",
      titulo: "Oficina dos Tecidos",
      head: HEAD_CSS,
      body: '<p>Peça <span class="selo">Novo</span> na vitrine.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  width: 70px;
  height: 28px;
  background-color: #cdeac0;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".selo", propriedade: "display", valor: "inline-block" },
    ajudas: {
      pergunta: "Qual valor fica na linha como inline e respeita width e height como block?",
      dica: "inline-block. Na regra .selo, acrescente display: inline-block.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".selo" },
      { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "display", valor: "inline-block" },
    ],
  },
  {
    id: "display-inline-block-2",
    conceito: "display-inline-block",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando nas duas caixas.",
      toque: "Responda pensando nas duas caixas.",
    },
    siteAlvo: {
      url: "estudiodedanca.exemplo",
      titulo: "Estúdio de Dança",
      head: HEAD_CSS,
      body: '<span class="botao">Matricular</span> <span class="botao">Ver turmas</span>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.botao {
  display: inline-block;
  width: 100px;
  padding: 8px;
  background-color: #cbd5f5;
}
`,
    },
    previsao: {
      pergunta: "Os dois botões são inline-block com width 100px. O que acontece?",
      opcoes: ["Ficam um embaixo do outro", "Ficam lado a lado, cada um com 100px", "Ignoram o width"],
      correta: 1,
      explicacao: "inline-block fica na linha como inline, mas respeita width, height e padding como block.",
    },
    ajudas: {
      pergunta: "O inline-block divide a linha e respeita o width?",
      dica: "Divide a linha e respeita o width, os dois.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
