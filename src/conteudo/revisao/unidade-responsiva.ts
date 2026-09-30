/*
 * Revisão: unidade responsiva (R2, Fase 2).
 *
 * Ação: trocar a largura fixa em px por porcentagem (cabe em 390); previsão: 100% versus
 * 900px numa tela estreita.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_UNIDADE_RESPONSIVA: ItemRevisao[] = [
  {
    id: "unidade-responsiva-1",
    conceito: "unidade-responsiva",
    tipo: "acao",
    enunciado: {
      mouse: "O banner tem width fixa de 900px e não cabe no celular. Troque por 100% para caber na tela.",
      toque: "O banner tem width fixa de 900px e não cabe no celular. Troque por 100% para caber na tela.",
    },
    siteAlvo: {
      url: "lojadeartesanato.exemplo",
      titulo: "Loja de Artesanato",
      head: HEAD_CSS,
      body: '<div class="banner">Feira de artesanato neste sábado</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.banner {
  width: 900px;
  padding: 16px;
  background-color: #ffd6a5;
}
`,
    },
    validador: { tipo: "cabeNaTela", largura: 390 },
    ajudas: {
      pergunta: "Que medida se adapta ao espaço disponível, em vez de um tamanho fixo?",
      dica: "Porcentagem: width: 100% no banner.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".banner" },
      { tipo: "definirPropriedade", seletorRegra: ".banner", propriedade: "width", valor: "100%" },
    ],
  },
  {
    id: "unidade-responsiva-2",
    conceito: "unidade-responsiva",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando numa tela de 390px.",
      toque: "Responda pensando numa tela de 390px.",
    },
    siteAlvo: {
      url: "consultoriodoc.exemplo",
      titulo: "Consultório Doc",
      head: HEAD_CSS,
      body: '<div class="faixa">Marque sua consulta</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.faixa {
  width: 100%;
  padding: 12px;
  background-color: #cbd5f5;
}
`,
    },
    previsao: {
      pergunta: "A faixa tem width: 100%. Numa tela de 390px, quanto ela ocupa?",
      opcoes: ["Toda a largura disponível, 390px", "900px, como um site de computador", "Metade da tela"],
      correta: 0,
      explicacao: "Uma unidade responsiva se adapta ao espaço: 100% é sempre a largura do pai, seja qual for a tela.",
    },
    ajudas: {
      pergunta: "100% é uma medida fixa ou depende do espaço?",
      dica: "Depende do espaço do pai.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
