/*
 * Revisão: display inline (L1, Fase 2).
 *
 * Ação: uma div vira inline para ficar na linha do texto; previsão: width e height
 * não valem em inline.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_DISPLAY_INLINE: ItemRevisao[] = [
  {
    id: "display-inline-1",
    conceito: "display-inline",
    tipo: "acao",
    enunciado: {
      mouse: "O rótulo (uma div) quebra a frase. Ponha ele na linha do texto com display: inline.",
      toque: "O rótulo (uma div) quebra a frase. Ponha ele na linha do texto com display: inline.",
    },
    siteAlvo: {
      url: "mercadinhoazul.exemplo",
      titulo: "Mercadinho Azul",
      head: HEAD_CSS,
      body: '<p>Hoje: <div class="rotulo">promoção</div> em todas as frutas.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.rotulo {
  background-color: #ffd6a5;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".rotulo", propriedade: "display", valor: "inline" },
    ajudas: {
      pergunta: "Qual valor de display deixa a peça na linha do texto?",
      dica: "inline. Na regra .rotulo, acrescente display: inline.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".rotulo" },
      { tipo: "definirPropriedade", seletorRegra: ".rotulo", propriedade: "display", valor: "inline" },
    ],
  },
  {
    id: "display-inline-2",
    conceito: "display-inline",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra do span.",
      toque: "Responda olhando a regra do span.",
    },
    siteAlvo: {
      url: "tapecariatecido.exemplo",
      titulo: "Tapeçaria Tecido",
      head: HEAD_CSS,
      body: '<p>Peças <span class="marca">novas</span> toda semana.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.marca {
  display: inline;
  width: 200px;
  height: 60px;
  background-color: #ffe08a;
}
`,
    },
    previsao: {
      pergunta: "O .marca é inline e tem width: 200px. O que acontece com essa largura?",
      opcoes: ["É ignorada: inline não respeita width", "A peça fica com 200px", "A peça some"],
      correta: 0,
      explicacao: "inline ignora width e height: a caixa ocupa só o que o texto ocupa.",
    },
    ajudas: {
      pergunta: "Peças em linha respeitam width e height?",
      dica: "Não. Só block e inline-block respeitam.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
