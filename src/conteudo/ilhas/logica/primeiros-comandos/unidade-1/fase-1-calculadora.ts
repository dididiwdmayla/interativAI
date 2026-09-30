/*
 * Lógica U1, Fase 1: "O Console é uma calculadora" (a conta da Padaria
 * Pão de Mel).
 *
 * UNIDADE-MODELO DA ILHA LÓGICA (ver unidade.ts). Cada fase de programa tem
 * `programa` (liga o Console e troca a tela do site pelo palco da memória)
 * e `siteAlvo: SITE_DO_PROGRAMA` (não há página).
 *
 * O QUE ENSINA: o Console (escrever, Enter, a resposta embaixo), as
 * operações de conta e a ordem delas (vezes antes de mais, parênteses
 * primeiro). Nenhuma variável ainda: a fase é só calculadora.
 *
 * ORDEM: uma conta simples guiada (apresenta o Console), a previsão da
 * ordem das operações (a confusão "o computador faz da esquerda para a
 * direita"), a conta da padaria sozinho (situação nova, com decimal) e os
 * parênteses guiados, que respondem a previsão.
 *
 * VALIDADORES: `respostaDoConsole` (a resposta que o Console escreve depois
 * de uma expressão; não é console.log). Números com vírgula no Brasil são
 * com ponto no código: 0.80, e a fala diz isso.
 *
 * REVISÃO ESPAÇADA: nenhuma (primeira fase da ilha). A ligação com a Ilha
 * Sites vem na fala: o Console é a aba do lado de Elementos.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U1_F1: FasePratica = {
  id: "logica-primeiros-comandos-u1-f1",
  tipo: "pratica",
  unidadeId: "logica-primeiros-comandos-u1",
  titulo: "O Console é uma calculadora",
  conceitos: ["console-js", "operacoes-aritmeticas", "ordem-das-operacoes"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["console", "palco-memoria"],
  apresentar: ["palco-memoria"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: {},
  introducao: [
    { texto: "Bem-vinda, bem-vindo à Ilha Lógica! Aqui a gente começa a programar de verdade, em JavaScript.", expressao: "comemorando" },
    { texto: "Lembra das abas do F12? Do lado de Elementos mora o Console: você escreve um comando e ele responde na hora.", expressao: "curioso" },
    { texto: "A tela aqui não é um site: é o palco da memória. Ele fica vazio até você guardar alguma coisa. Primeiro, contas!", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "primeira-conta",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "No Console, escreva 3 + 4 e aperte Enter.", toque: "No Console, escreva 3 + 4 e toque em Rodar." },
      apresentar: ["console"],
      validador: { tipo: "respostaDoConsole", valor: 7 },
      ajudas: {
        pergunta: "Onde a gente escreve um comando para o Console responder?",
        dica: "Na linha com o sinal de maior, embaixo de tudo. Escreva a conta e mande rodar.",
        linha: { alvo: "console", fala: "É nesta linha, com o sinal de maior. Escreva a conta aqui." },
        solucao: { fala: "Escrevi 3 + 4 e mandei rodar. O Console respondeu 7 logo embaixo.", acoes: [{ tipo: "executarNoConsole", codigo: "3 + 4" }] },
      },
      falaAoConcluir: { texto: "7! A setinha de volta marca a resposta do Console. No Chrome de verdade é igualzinho.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "3 + 4" }],
    },
    {
      id: "ordem-das-operacoes",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O que o Console responde para 2 + 3 * 4? (o asterisco é vezes)",
        opcoes: ["20", "14", "24"],
        correta: 1,
        explicacao: "Vezes vem antes de mais, como na escola: 3 * 4 = 12, e 2 + 12 = 14. Não é da esquerda para a direita.",
      },
      enunciado: { mouse: "Confira: escreva 2 + 3 * 4 no Console.", toque: "Confira: escreva 2 + 3 * 4 no Console." },
      validador: { tipo: "respostaDoConsole", valor: 14 },
      ajudas: {
        pergunta: "Qual conta o JavaScript faz primeiro: a de mais ou a de vezes?",
        dica: "Vezes (*) e dividir (/) vêm antes de mais (+) e menos (-).",
        linha: { alvo: "console", fala: "Escreva a conta inteira nesta linha." },
        solucao: { fala: "Rodei 2 + 3 * 4: primeiro 3 * 4 = 12, depois 2 + 12 = 14.", acoes: [{ tipo: "executarNoConsole", codigo: "2 + 3 * 4" }] },
      },
      falaAoConcluir: { texto: "14! O computador segue a mesma ordem da matemática da escola.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "executarNoConsole", codigo: "2 + 3 * 4" },
      ],
    },
    {
      id: "conta-da-padaria",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Na Pão de Mel: 3 pães de 0.80 e 2 cafés de 4.50. Quanto dá? Faça a conta inteira no Console.",
        toque: "Na Pão de Mel: 3 pães de 0.80 e 2 cafés de 4.50. Quanto dá? Faça a conta inteira no Console.",
      },
      validador: { tipo: "respostaDoConsole", valor: 11.4 },
      ajudas: {
        pergunta: "Quanto custam os pães juntos? E os cafés? Dá para escrever as duas contas numa linha só?",
        dica: "No código, a vírgula do preço vira ponto: 0.80. Vezes vem antes de mais.",
      },
      falaAoConcluir: { texto: "11.4, ou seja, R$ 11,40. Uma conta de padaria em uma linha, sem calculadora!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "3 * 0.80 + 2 * 4.50" }],
    },
    {
      id: "parenteses",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "A conta de R$ 30 + R$ 12 vai ser dividida entre 3 amigos. Use parênteses: (30 + 12) / 3.",
        toque: "A conta de R$ 30 + R$ 12 vai ser dividida entre 3 amigos. Use parênteses: (30 + 12) / 3.",
      },
      validador: { tipo: "respostaDoConsole", valor: 14 },
      ajudas: {
        pergunta: "Sem parênteses, 30 + 12 / 3 divide só o 12. Como fazer a soma vir primeiro?",
        dica: "O que está entre parênteses é calculado antes de tudo.",
        linha: { alvo: "console", fala: "Escreva aqui, com a soma entre parênteses." },
        solucao: { fala: "Rodei (30 + 12) / 3: primeiro a soma, 42, depois a divisão: 14 para cada um.", acoes: [{ tipo: "executarNoConsole", codigo: "(30 + 12) / 3" }] },
      },
      falaAoConcluir: { texto: "14 para cada um. Sem os parênteses daria 34: o Console só faz o que a gente escreve.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "(30 + 12) / 3" }],
    },
  ],
  conclusao: [
    { texto: "Você usou o Console como calculadora, com a ordem das contas e parênteses. Isso é programar!", expressao: "comemorando" },
    { texto: "Só que a resposta some quando a gente faz outra conta. Na próxima fase, vamos guardar valores com nome.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Abra qualquer site no Chrome, aperte F12 (ou Ctrl+Shift+J) e vá na aba Console. Faça a conta da feira: 3 * 4.5 + 2 * 7. O site nem percebe: o Console é seu.",
  falaFinal: { texto: "Missão feita? Cada site do mundo tem um Console esperando uma conta sua.", expressao: "feliz" },
};
