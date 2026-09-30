/*
 * Revisão: flex-direction (L2, Fase 1).
 *
 * Ação: virar uma fila em coluna; previsão: qual valor dá coluna.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_FLEX_DIRECTION: ItemRevisao[] = [
  {
    id: "flex-direction-1",
    conceito: "flex-direction",
    tipo: "acao",
    enunciado: {
      mouse: "A fila de avisos está em linha. Ponha os itens em coluna: flex-direction: column.",
      toque: "A fila de avisos está em linha. Ponha os itens em coluna: flex-direction: column.",
    },
    siteAlvo: {
      url: "postodesaudecentro.exemplo",
      titulo: "Posto de Saúde Centro",
      head: HEAD_CSS,
      body: `<div class="avisos">
  <p>Vacinação: segunda</p>
  <p>Pediatria: terça</p>
  <p>Exames: quarta</p>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.avisos {
  display: flex;
  gap: 12px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".avisos", propriedade: "flex-direction", valor: "column" },
    ajudas: {
      pergunta: "Que propriedade escolhe o sentido da fila: linha ou coluna?",
      dica: "flex-direction: column, na caixa .avisos.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".avisos" },
      { tipo: "definirPropriedade", seletorRegra: ".avisos", propriedade: "flex-direction", valor: "column" },
    ],
  },
  {
    id: "flex-direction-2",
    conceito: "flex-direction",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "tintasecores.exemplo",
      titulo: "Tintas & Cores",
      head: HEAD_CSS,
      body: '<div class="paleta"><div class="a">A</div><div class="b">B</div><div class="c">C</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.paleta {
  display: flex;
  flex-direction: row;
}

.paleta div {
  padding: 12px;
  background-color: #ffd6a5;
}
`,
    },
    previsao: {
      pergunta: "Com flex-direction: row, as três caixas ficam como?",
      opcoes: ["Em coluna, uma embaixo da outra", "Em linha, uma ao lado da outra", "Empilhadas, sobrepostas"],
      correta: 1,
      explicacao: "row é a fila em linha (o padrão). column é em coluna.",
    },
    ajudas: {
      pergunta: "Qual valor de flex-direction põe as caixas em linha?",
      dica: "row. O column é o da coluna.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
