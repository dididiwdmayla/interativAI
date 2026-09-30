/*
 * Revisão: o undefined (Lógica U1, Fase 2). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_UNDEFINED_JS: ItemRevisao[] = [
  {
    id: "undefined-js-1",
    conceito: "undefined-js",
    tipo: "previsao",
    enunciado: { mouse: "Confira: crie let cidade = 'Recife'.", toque: "Confira: crie let cidade = 'Recife'." },
    siteAlvo: { body: "" },
    programa: {},
    previsao: {
      pergunta: "O que o Console responde depois de let cidade = 'Recife'?",
      opcoes: ["'Recife'", "undefined", "cidade"],
      correta: 1,
      explicacao: "undefined: a linha só guardou o texto na caixinha. Não tem resposta para mostrar, e não é erro.",
    },
    validador: { tipo: "valorVariavel", nome: "cidade", valor: "Recife" },
    ajudas: {
      pergunta: "Uma linha que só guarda alguma coisa tem resposta para mostrar?",
      dica: "Depois de let, o Console diz undefined: não tem valor aqui.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 1 },
      { tipo: "executarNoConsole", codigo: "let cidade = 'Recife'" },
    ],
  },
  {
    id: "undefined-js-2",
    conceito: "undefined-js",
    tipo: "previsao",
    enunciado: { mouse: "Pense antes de responder.", toque: "Pense antes de responder." },
    siteAlvo: { body: "" },
    programa: {},
    previsao: {
      pergunta: "Você cria let resposta; sem nada depois. O que fica dentro da caixinha?",
      opcoes: ["undefined", "0", "Dá erro"],
      correta: 0,
      explicacao: "A caixinha existe, mas ainda sem valor: undefined. Não é zero, e não é erro.",
    },
    ajudas: { pergunta: "Uma caixinha criada sem valor guarda o quê?", dica: "undefined quer dizer não tem valor aqui ainda." },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
