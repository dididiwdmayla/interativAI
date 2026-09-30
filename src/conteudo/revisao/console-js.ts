/*
 * Revisão: o Console (Lógica U1, Fase 1). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_CONSOLE_JS: ItemRevisao[] = [
  {
    id: "console-js-1",
    conceito: "console-js",
    tipo: "acao",
    enunciado: {
      mouse: "No Console, descubra quantos minutos tem um dia: 24 * 60.",
      toque: "No Console, descubra quantos minutos tem um dia: 24 * 60.",
    },
    siteAlvo: { body: "" },
    programa: {},
    validador: { tipo: "respostaDoConsole", valor: 1440 },
    ajudas: {
      pergunta: "Onde se escreve um comando para o Console responder?",
      dica: "Na linha com o sinal de maior: escreva a conta e mande rodar.",
    },
    solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "24 * 60" }],
  },
  {
    id: "console-js-2",
    conceito: "console-js",
    tipo: "previsao",
    enunciado: { mouse: "Confira: escreva 10 - 4 no Console.", toque: "Confira: escreva 10 - 4 no Console." },
    siteAlvo: { body: "" },
    programa: {},
    previsao: {
      pergunta: "Você escreve 10 - 4 no Console e manda rodar. O que aparece embaixo?",
      opcoes: ["10 - 4", "6", "Nada: precisa apertar um botão de calcular"],
      correta: 1,
      explicacao: "O Console roda a conta e responde embaixo: 6. Escrever e mandar rodar já é o botão.",
    },
    validador: { tipo: "respostaDoConsole", valor: 6 },
    ajudas: { pergunta: "O Console mostra a conta ou o resultado dela?", dica: "Ele responde o resultado, na linha com a setinha de volta." },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 1 },
      { tipo: "executarNoConsole", codigo: "10 - 4" },
    ],
  },
];
