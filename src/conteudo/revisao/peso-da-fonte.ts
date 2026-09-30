/*
 * Revisão: peso da fonte, font-weight (E1, Fase 3).
 *
 * Ação: pôr em negrito; previsão: o que normal faz num título (que já vem em
 * negrito).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_PESO_DA_FONTE: ItemRevisao[] = [
  {
    id: "peso-da-fonte-1",
    conceito: "peso-da-fonte",
    tipo: "acao",
    enunciado: {
      mouse: "Deixe o preço em negrito, com font-weight: bold.",
      toque: "Deixe o preço em negrito, com font-weight: bold.",
    },
    siteAlvo: {
      url: "feirinhadotrigo.exemplo",
      titulo: "Feirinha do Trigo",
      head: HEAD_CSS,
      body: '<p>Pão de forma caseiro: <span class="destaque">R$ 9</span></p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.destaque {
  color: #bc4b51;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".destaque", propriedade: "font-weight", valor: "bold" },
    ajudas: {
      pergunta: "Qual propriedade deixa a letra mais grossa?",
      dica: "font-weight: bold, na regra .destaque.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".destaque" },
      { tipo: "definirPropriedade", seletorRegra: ".destaque", propriedade: "font-weight", valor: "bold" },
    ],
  },
  {
    id: "peso-da-fonte-2",
    conceito: "peso-da-fonte",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra do h1.",
      toque: "Responda olhando a regra do h1.",
    },
    siteAlvo: {
      url: "estudiofotoluz.exemplo",
      titulo: "Estúdio Foto Luz",
      head: HEAD_CSS,
      body: "<h1>Estúdio Foto Luz</h1>",
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h1 {
  font-weight: normal;
}
`,
    },
    previsao: {
      pergunta: "O h1 já vem em negrito. Com font-weight: normal, o que acontece?",
      opcoes: ["Fica mais grosso ainda", "Ele perde o negrito", "Nada, h1 sempre é negrito"],
      correta: 1,
      explicacao: "O negrito do h1 é só o estilo padrão do navegador. Com font-weight: normal, a regra do site vence e as letras voltam ao peso comum.",
    },
    ajudas: {
      pergunta: "O negrito do título é obrigatório ou é só o padrão?",
      dica: "É só o padrão do navegador: a sua regra pode mudar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
