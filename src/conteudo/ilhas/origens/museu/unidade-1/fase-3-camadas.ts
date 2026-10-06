/* Sala 1, fase 3: da linguagem que a gente escreve até a linguagem de máquina, em camadas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U1_F3: Fase = {
  id: "origens-museu-u1-f3",
  tipo: "pratica",
  unidadeId: "origens-museu-u1",
  titulo: "Da máquina às palavras",
  conceitos: ["instrucao-de-maquina", "linguagem-de-maquina", "linguagem-de-programacao"],
  revisa: ["binario"],
  prerequisitos: ["binario"],
  usaFerramentas: ["camadas-da-maquina"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "terminal",
    placa: {
      titulo: "As camadas de um programa",
      texto: "Uma máquina de brinquedo, simplificada para caber na vitrine. As de verdade têm instruções parecidas: pegar, somar, guardar.",
    },
    falas: {
      abrir: "Programa é ordem. O processador só entende ordem pequena, em bits. Vocês escrevem ordem grande, em palavras. Alguém traduz.",
      porEtapa: {
        descer: "Desce uma camada. Veja em quantas ordens pequenas aquela linha vira.",
        "ate-a-maquina": "Mais uma camada. Lá embaixo é onde eu morava.",
        "achar-soma": "Agora sozinho. Ache, nos bits, a ordem que soma. Sem pressa. Mas sem demora.",
      },
      concluir: "Correto. Uma linha de vocês, três ordens minhas, três fileiras de bits. Agradeça ao tradutor.",
    },
    estacoes: [
      {
        id: "camadas-frete",
        tipo: "camadas",
        titulo: "O total com frete",
        camadas: [
          {
            id: "escrita",
            nome: "O que a gente escreve",
            legenda: "Uma linha que gente lê. É JavaScript, a linguagem da Ilha Lógica.",
            linhas: [{ id: "js-total", texto: "let total = preco + frete;" }],
          },
          {
            id: "instrucoes",
            nome: "Instruções",
            legenda: "O tradutor quebra a linha em ordens pequenas, que o processador sabe cumprir uma de cada vez.",
            linhas: [
              { id: "i-pega", texto: "PEGA preco", de: ["js-total"] },
              { id: "i-soma", texto: "SOMA frete", de: ["js-total"] },
              { id: "i-guarda", texto: "GUARDA em total", de: ["js-total"] },
            ],
          },
          {
            id: "maquina",
            nome: "Linguagem de máquina",
            legenda: "Cada instrução vira uma fileira de bits: o código da ordem e onde está o número. É isso que o processador lê.",
            linhas: [
              { id: "m-pega", texto: "0001 0110", de: ["i-pega"] },
              { id: "m-soma", texto: "0010 0111", de: ["i-soma"] },
              { id: "m-guarda", texto: "0011 1000", de: ["i-guarda"] },
            ],
          },
        ],
      },
    ],
  },
  introducao: [
    { texto: "Esse é o meu avô, o terminal verde. Ele fala pouco e não gosta de enfeite, mas entende de máquina como ninguém.", expressao: "apontando" },
    { texto: "Você já sabe que o computador só guarda uns e zeros. Mas a gente escreve palavras! Como uma coisa vira a outra?", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "descer",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Descer uma camada e veja em quantas instruções a linha de JavaScript vira.",
        toque: "Toque em Descer uma camada e veja em quantas instruções a linha de JavaScript vira.",
      },
      validador: { tipo: "camadaAberta", estacao: "camadas-frete", camada: "instrucoes" },
      apresentar: ["camadas-da-maquina"],
      ajudas: {
        pergunta: "O processador sabe somar e guardar, mas não sabe ler a palavra let. O que precisa acontecer com a linha?",
        dica: "Uma instrução é uma ordem pequena que o processador cumpre. O tradutor quebra cada linha nossa em várias delas.",
        linha: { alvo: "exposicao", estacao: "camadas-frete", peca: "descer", fala: "Este botão traduz para a camada de baixo." },
        solucao: { fala: "Desci uma camada: a linha virou três instruções, pegar, somar e guardar.", acoes: [{ tipo: "descerCamada", estacao: "camadas-frete" }] },
      },
      falaAoConcluir: { texto: "Uma linha nossa virou três instruções! Pegar, somar e guardar.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "descerCamada", estacao: "camadas-frete" }],
    },
    {
      id: "ate-a-maquina",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora confira: desça mais uma camada.",
        toque: "Agora confira: desça mais uma camada.",
      },
      previsao: {
        pergunta: "Descendo mais uma camada, o que você acha que vai aparecer lá embaixo?",
        opcoes: ["Uns e zeros", "A mesma linha, em inglês", "Um desenho do processador"],
        correta: 0,
        explicacao: "Lá embaixo só tem bit: cada instrução vira uma fileira de uns e zeros. É a linguagem de máquina.",
      },
      validador: { tipo: "camadaAberta", estacao: "camadas-frete", camada: "maquina" },
      ajudas: {
        pergunta: "O que o computador guarda por baixo de tudo, desde o tear?",
        dica: "A linguagem de máquina são as instruções escritas em bits, do jeito que o processador lê.",
        linha: { alvo: "exposicao", estacao: "camadas-frete", peca: "descer", fala: "O mesmo botão desce mais uma camada." },
        solucao: { fala: "Desci até a linguagem de máquina: três fileiras de bits, uma para cada instrução.", acoes: [{ tipo: "descerCamada", estacao: "camadas-frete" }] },
      },
      falaAoConcluir: { texto: "Bits de novo! Nos primeiros computadores, tinha gente que programava assim, quase bit por bit.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }, { tipo: "descerCamada", estacao: "camadas-frete" }],
    },
    {
      id: "achar-soma",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Na camada de baixo, clique na fileira de bits que manda somar.",
        toque: "Na camada de baixo, toque na fileira de bits que manda somar.",
      },
      validador: { tipo: "linhaEscolhida", estacao: "camadas-frete", linha: "m-soma" },
      ajudas: {
        pergunta: "Qual instrução soma? E em qual fileira de bits ela virou?",
        dica: "Tocar numa instrução acende a fileira de bits que ela vira, lá embaixo.",
      },
      falaAoConcluir: { texto: "Achou! 0010 0111 é o SOMA frete, do jeito que o processador lê.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "escolherLinha", estacao: "camadas-frete", linha: "m-soma" }],
    },
  ],
  conclusao: [
    { texto: "Linguagem de programação é para gente ler. Linguagem de máquina é para o processador. No meio, o tradutor.", expressao: "apontando" },
    { texto: "No JavaScript, o próprio navegador traduz enquanto a página roda. Você só escreve a camada de cima.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Abra o F12 em qualquer site, aba Fontes (Sources), e abra um arquivo .js da página. Isso é a camada de cima: texto que gente lê. A tradução para a máquina acontece escondida, dentro do navegador.",
  falaFinal: { texto: "Toda linguagem que você aprender vai ser uma camada de cima. A máquina lá embaixo é sempre a mesma.", expressao: "feliz" },
};
