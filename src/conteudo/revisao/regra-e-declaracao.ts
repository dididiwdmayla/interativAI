/*
 * Revisão: regra e declaração (E1, Fase 1).
 *
 * Ação: acrescentar uma declaração (propriedade e valor) numa regra que já existe;
 * previsão: nomear as partes de `color: white`.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_REGRA_E_DECLARACAO: ItemRevisao[] = [
  {
    id: "regra-e-declaracao-1",
    conceito: "regra-e-declaracao",
    tipo: "acao",
    enunciado: {
      mouse: "Na regra .tag, acrescente a declaração font-weight: bold.",
      toque: "Na regra .tag, acrescente a declaração font-weight: bold.",
    },
    siteAlvo: {
      url: "lojaminhocasa.exemplo",
      titulo: "Loja Minha Casa",
      head: HEAD_CSS,
      body: '<p><span class="tag">Novidade</span> Jogo de toalhas de banho</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.tag {
  color: white;
  background-color: teal;
}
`,
    },
    validador: { tipo: "declaracao", seletorRegra: ".tag", propriedade: "font-weight", valor: "bold", ativa: true },
    ajudas: {
      pergunta: "Uma declaração é feita de quais duas partes?",
      dica: "Uma propriedade e um valor. No painel Estilos, na regra .tag, acrescente font-weight: bold.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".tag" },
      { tipo: "definirPropriedade", seletorRegra: ".tag", propriedade: "font-weight", valor: "bold" },
    ],
  },
  {
    id: "regra-e-declaracao-2",
    conceito: "regra-e-declaracao",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra na folha.",
      toque: "Responda olhando a regra na folha.",
    },
    siteAlvo: {
      url: "estacionamentoponto.exemplo",
      titulo: "Estacionamento Ponto",
      head: HEAD_CSS,
      body: '<p class="selo">Vagas cobertas</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  color: white;
  background-color: slateblue;
}
`,
    },
    previsao: {
      pergunta: "Na declaração color: white, quem é o color?",
      opcoes: ["O valor", "A propriedade", "O seletor"],
      correta: 1,
      explicacao: "A regra junta um seletor (.selo) e declarações. Cada declaração é uma propriedade (color) e um valor (white).",
    },
    ajudas: {
      pergunta: "Numa declaração, o que vem antes dos dois pontos: a propriedade ou o valor?",
      dica: "A propriedade: é o que você quer mudar. Depois dos dois pontos vem o valor.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
