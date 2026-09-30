/*
 * Revisão: a variável com let (Lógica U1, Fase 2). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_VARIAVEL_LET: ItemRevisao[] = [
  {
    id: "variavel-let-1",
    conceito: "variavel-let",
    tipo: "acao",
    enunciado: {
      mouse: "Placar do jogo: crie a caixinha pontos com let, começando em 0.",
      toque: "Placar do jogo: crie a caixinha pontos com let, começando em 0.",
    },
    siteAlvo: { body: "" },
    programa: {},
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorVariavel", nome: "pontos", valor: 0 },
        { tipo: "usouSintaxe", sintaxe: "let" },
      ],
    },
    ajudas: { pergunta: "Qual palavra cria uma caixinha que pode mudar?", dica: "let nome = valor" },
    solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "let pontos = 0" }],
  },
  {
    id: "variavel-let-2",
    conceito: "variavel-let",
    tipo: "previsao",
    enunciado: { mouse: "Confira: rode vidas = vidas - 1.", toque: "Confira: rode vidas = vidas - 1." },
    siteAlvo: { body: "" },
    programa: { preparo: "let vidas = 3" },
    previsao: {
      pergunta: "A caixinha vidas vale 3. Você roda vidas = vidas - 1. Quanto fica guardado?",
      opcoes: ["3", "-1", "2"],
      correta: 2,
      explicacao: "O lado direito é calculado primeiro, com o valor de agora (3 - 1), e o resultado volta para a caixinha: 2.",
    },
    validador: { tipo: "valorVariavel", nome: "vidas", valor: 2 },
    ajudas: {
      pergunta: "O que o JavaScript calcula primeiro: o lado direito ou o esquerdo do =?",
      dica: "Ele faz a conta do lado direito e guarda o resultado na caixinha da esquerda.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 2 },
      { tipo: "executarNoConsole", codigo: "vidas = vidas - 1" },
    ],
  },
];
