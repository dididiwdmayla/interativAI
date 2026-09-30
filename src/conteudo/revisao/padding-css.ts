/*
 * Revisão: padding (E3, Fase 1).
 *
 * Ação: dar respiro dentro de um botão; previsão: o padding é dentro ou fora?
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_PADDING_CSS: ItemRevisao[] = [
  {
    id: "padding-css-1",
    conceito: "padding-css",
    tipo: "acao",
    enunciado: {
      mouse: "O botão está apertado. Dê a ele padding de 12px 24px, o espaço dentro da caixa.",
      toque: "O botão está apertado. Dê a ele padding de 12px 24px, o espaço dentro da caixa.",
    },
    siteAlvo: {
      url: "estacionamentoseguro.exemplo",
      titulo: "Estacionamento Seguro",
      head: HEAD_CSS,
      body: '<a class="botao" href="#reserva">Reservar vaga</a>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.botao {
  display: inline-block;
  background-color: #1d3557;
  color: white;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".botao", propriedade: "padding", valor: "12px 24px" },
    ajudas: {
      pergunta: "Que propriedade dá espaço DENTRO da caixa, entre o texto e a borda?",
      dica: "padding. Na regra .botao, acrescente padding: 12px 24px.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".botao" },
      { tipo: "definirPropriedade", seletorRegra: ".botao", propriedade: "padding", valor: "12px 24px" },
    ],
  },
  {
    id: "padding-css-2",
    conceito: "padding-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "clinicadosorriso.exemplo",
      titulo: "Clínica do Sorriso",
      head: HEAD_CSS,
      body: '<p class="faixa">Consultas com hora marcada</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.faixa {
  background-color: #cdeac0;
  padding: 20px;
}
`,
    },
    previsao: {
      pergunta: "O padding de 20px da faixa cria espaço em qual lugar?",
      opcoes: ["Dentro da caixa, ao redor do texto", "Fora da caixa, afastando vizinhas", "Só na borda"],
      correta: 0,
      explicacao: "O padding é o espaço DENTRO da caixa, entre o conteúdo e a borda. Por isso o fundo colorido aumenta.",
    },
    ajudas: {
      pergunta: "O fundo colorido cobre a área do padding?",
      dica: "Cobre, porque o padding é parte de dentro da caixa.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
