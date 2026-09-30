/*
 * Revisão: a constante com const (Lógica U1, Fase 3). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_VARIAVEL_CONST: ItemRevisao[] = [
  {
    id: "variavel-const-1",
    conceito: "variavel-const",
    tipo: "acao",
    enunciado: {
      mouse: "Uma semana sempre tem 7 dias: guarde isso numa const diasDaSemana.",
      toque: "Uma semana sempre tem 7 dias: guarde isso numa const diasDaSemana.",
    },
    siteAlvo: { body: "" },
    programa: {},
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorVariavel", nome: "diasDaSemana", valor: 7 },
        { tipo: "usouSintaxe", sintaxe: "const" },
      ],
    },
    ajudas: { pergunta: "Qual palavra cria uma caixinha que nunca muda?", dica: "const nome = valor" },
    solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "const diasDaSemana = 7" }],
  },
  {
    id: "variavel-const-2",
    conceito: "variavel-const",
    tipo: "previsao",
    enunciado: { mouse: "Confira: rode limite = 20.", toque: "Confira: rode limite = 20." },
    siteAlvo: { body: "" },
    programa: { preparo: "const limite = 10" },
    previsao: {
      pergunta: "limite foi criada com const e vale 10. Você roda limite = 20. O que acontece?",
      opcoes: ["limite passa a valer 20", "Dá erro, e limite continua 10", "limite passa a valer 30"],
      correta: 1,
      explicacao: "Uma const não troca de valor: o Console dá TypeError, Assignment to constant variable, e o 10 fica.",
    },
    validador: { tipo: "erroDoTipo", nome: "TypeError" },
    ajudas: { pergunta: "Uma const aceita valor novo?", dica: "Não: trocar dá erro. Para mudar, a caixinha teria que ser let." },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 1 },
      { tipo: "executarNoConsole", codigo: "limite = 20" },
    ],
  },
];
