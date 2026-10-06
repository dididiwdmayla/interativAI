/* Sala 4, fase 1: a memória como caixas com endereço (a mesma ideia do palco, com o número à mostra). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U4_F1: Fase = {
  id: "origens-museu-u4-f1",
  tipo: "pratica",
  unidadeId: "origens-museu-u4",
  titulo: "Caixas com endereço",
  conceitos: ["memoria-ram", "endereco-de-memoria"],
  revisa: ["byte"],
  prerequisitos: ["byte"],
  usaFerramentas: ["caixas-da-memoria"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "pc",
    placa: {
      titulo: "A memória, aberta",
      texto: "Uma fileira de caixas numeradas, simplificada para caber na vitrine. Uma memória de verdade tem bilhões delas, cada uma com um byte.",
    },
    falas: {
      abrir: "Oiê! Abri a minha tampa! Isto aqui é a minha memória: caixinhas numeradas. Bip!",
      porEtapa: {
        "onde-mora": "Cada variável mora numa caixa. O nome é para você; o número é para mim!",
        "frete-novo": "O frete subiu! Pega o valor na bandeja e guarda na caixa certa. Rapidinho!",
      },
      concluir: "PRONTO! Nome para você, endereço para mim. A gente se entende!",
    },
    estacoes: [
      {
        id: "caixas",
        tipo: "memoria",
        titulo: "As caixas da memória",
        caixas: 8,
        programa: [
          { texto: "let preco = 12;", endereco: 2, valor: 12, nome: "preco" },
          { texto: "let frete = 8;", endereco: 3, valor: 8, nome: "frete" },
          { texto: "let total = 20;", endereco: 5, valor: 20, nome: "total" },
        ],
        bandeja: [9, 15, 30],
      },
    ],
  },
  introducao: [
    { texto: "Esse é o meu tio, o computador bege dos anos 1980! Ele abriu a tampa para a gente ver por dentro.", expressao: "apontando" },
    { texto: "No palco da Ilha Lógica, cada variável é uma caixinha. Aqui você vê que cada caixa tem um número.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "rodar-linhas",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Rodar uma linha até o programa acabar e veja em que caixa cada variável vai morar.",
        toque: "Toque em Rodar uma linha até o programa acabar e veja em que caixa cada variável vai morar.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "caixas", marco: "fim" },
      apresentar: ["caixas-da-memoria"],
      ajudas: {
        pergunta: "Quantas linhas tem o programa? Cada uma guarda um valor.",
        dica: "Cada Rodar uma linha roda uma linha: o valor entra numa caixa e ela ganha o nome da variável.",
        linha: { alvo: "exposicao", estacao: "caixas", peca: "passo", fala: "Este botão roda uma linha." },
        solucao: {
          fala: "Rodei as três linhas: preço, frete e total ganharam caixas.",
          acoes: [
            { tipo: "comandoNaEstacao", estacao: "caixas", comando: "passo" },
            { tipo: "comandoNaEstacao", estacao: "caixas", comando: "passo" },
            { tipo: "comandoNaEstacao", estacao: "caixas", comando: "passo" },
          ],
        },
      },
      falaAoConcluir: { texto: "Três variáveis, três caixas: 2, 3 e 5. O computador não lembra nomes, lembra números.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "comandoNaEstacao", estacao: "caixas", comando: "passo" },
        { tipo: "comandoNaEstacao", estacao: "caixas", comando: "passo" },
        { tipo: "comandoNaEstacao", estacao: "caixas", comando: "passo" },
      ],
    },
    {
      id: "onde-mora",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique na caixa onde mora a variável frete.",
        toque: "Toque na caixa onde mora a variável frete.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "caixas", marco: "escolhida:3" },
      ajudas: {
        pergunta: "Qual caixa ganhou a etiqueta frete?",
        dica: "O endereço é o número em cima da caixa. O nome da variável fica embaixo.",
        linha: { alvo: "exposicao", estacao: "caixas", peca: "3", fala: "Esta é a caixa do frete." },
        solucao: { fala: "O frete mora na caixa 3.", acoes: [{ tipo: "comandoNaEstacao", estacao: "caixas", comando: "escolher:3" }] },
      },
      falaAoConcluir: { texto: "Caixa 3! Esse número é o endereço. A variável frete é só um apelido para ele.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "caixas", comando: "escolher:3" }],
    },
    {
      id: "frete-novo",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: o frete subiu para 15. Pegue o 15 na bandeja e guarde na caixa do frete.",
        toque: "Agora sozinho: o frete subiu para 15. Pegue o 15 na bandeja e guarde na caixa do frete.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "caixas", marco: "caixa:3=15" },
      ajudas: {
        pergunta: "Em que endereço o frete mora? E o que acontece com o 8 que estava lá?",
        dica: "Toque no 15 da bandeja e depois na caixa 3. O valor velho some: a caixa guarda um de cada vez.",
      },
      falaAoConcluir: { texto: "O 15 entrou e o 8 sumiu. É o que acontece quando você escreve frete = 15.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "caixas", comando: "guardar:3=15" }],
    },
  ],
  conclusao: [
    { texto: "A memória é uma fileira de caixas numeradas. O número é o endereço; a variável é um nome para ele.", expressao: "apontando" },
    { texto: "Ela é rápida, mas esquece tudo quando desliga. Para guardar de vez, existem os arquivos.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Abra o Gerenciador de tarefas do computador (Ctrl + Shift + Esc no Windows) ou o do Chrome (Shift + Esc). A coluna Memória mostra quanto de caixinha cada programa está usando agora.",
  falaFinal: { texto: "Toda variável que você criar mora numa caixa dessas, com um endereço que você nunca precisa decorar.", expressao: "feliz" },
};
