/*
 * Revisão: margin (E3, Fase 2).
 *
 * Ação: afastar duas caixas com margem; previsão: o margin muda o tamanho da
 * caixa?
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_MARGIN_CSS: ItemRevisao[] = [
  {
    id: "margin-css-1",
    conceito: "margin-css",
    tipo: "acao",
    enunciado: {
      mouse: "Afaste o segundo cartão do primeiro: margin-top de 24px nele.",
      toque: "Afaste o segundo cartão do primeiro: margin-top de 24px nele.",
    },
    siteAlvo: {
      url: "veterinariaamigo.exemplo",
      titulo: "Veterinária Amigo Fiel",
      head: HEAD_CSS,
      body: `<div class="cartao primeiro">Vacinas</div>
<div class="cartao segundo">Banho e tosa</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cartao {
  padding: 10px;
  background-color: #e0f2e9;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".segundo", propriedade: "margin-top", valor: "24px" },
    ajudas: {
      pergunta: "Que camada afasta uma caixa das vizinhas, por fora?",
      dica: "margin. Crie uma regra .segundo com margin-top: 24px.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".segundo" },
      { tipo: "adicionarRegra", seletorRegra: ".segundo", declaracoes: [{"propriedade":"margin-top","valor":"24px"}] },
    ],
  },
  {
    id: "margin-css-2",
    conceito: "margin-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "casadasvelas.exemplo",
      titulo: "Casa das Velas",
      head: HEAD_CSS,
      body: '<div class="caixa">Velas de soja</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.caixa {
  width: 200px;
  background-color: #fde7c8;
  margin: 20px;
}
`,
    },
    previsao: {
      pergunta: "Com margin: 20px, o tamanho da caixa (a área pintada) aumenta?",
      opcoes: ["Sim, cresce 20px de cada lado", "Sim, só para baixo", "Não, o margin afasta as vizinhas"],
      correta: 2,
      explicacao: "O margin é espaço FORA da caixa: empurra as vizinhas para longe, sem mudar o tamanho da caixa em si.",
    },
    ajudas: {
      pergunta: "O margin fica dentro ou fora da parte pintada?",
      dica: "Fora. O que o padding faz por dentro, o margin faz por fora.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
