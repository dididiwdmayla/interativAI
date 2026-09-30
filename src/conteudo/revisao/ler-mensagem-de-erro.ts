/*
 * Revisão: ler a mensagem de erro (Lógica U1, Fase 3). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_LER_MENSAGEM_DE_ERRO: ItemRevisao[] = [
  {
    id: "ler-mensagem-de-erro-1",
    conceito: "ler-mensagem-de-erro",
    tipo: "acao",
    enunciado: {
      mouse: "A caixinha se chama total. Rode totl + 1, com o nome errado de propósito, e leia o erro.",
      toque: "A caixinha se chama total. Rode totl + 1, com o nome errado de propósito, e leia o erro.",
    },
    siteAlvo: { body: "" },
    programa: { preparo: "let total = 5" },
    validador: { tipo: "erroDoTipo", nome: "ReferenceError" },
    ajudas: { pergunta: "O que o JavaScript faz quando não conhece um nome?", dica: "Ele avisa com um ReferenceError: nome is not defined." },
    solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "totl + 1" }],
  },
  {
    id: "ler-mensagem-de-erro-2",
    conceito: "ler-mensagem-de-erro",
    tipo: "previsao",
    enunciado: { mouse: "Confira: rode precoo * 2.", toque: "Confira: rode precoo * 2." },
    siteAlvo: { body: "" },
    programa: { preparo: "let preco = 3" },
    previsao: {
      pergunta: "Só existe a caixinha preco. Você roda precoo * 2 (com dois o). O que o Console diz?",
      opcoes: ["6", "ReferenceError: precoo is not defined", "Nada"],
      correta: 1,
      explicacao: "O nome está diferente, então o JavaScript não conhece precoo. O erro diz o nome que ele não achou.",
    },
    validador: { tipo: "erroDoTipo", nome: "ReferenceError" },
    ajudas: {
      pergunta: "O JavaScript perdoa uma letra a mais no nome?",
      dica: "Não: cada letra conta. O erro mostra exatamente o nome que ele não achou.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 1 },
      { tipo: "executarNoConsole", codigo: "precoo * 2" },
    ],
  },
];
