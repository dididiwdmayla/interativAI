/*
 * Bancada do formato contrato: um contrato pequeno, de LABORATÓRIO (fora do
 * currículo, só no /lab/fases?fase=lab-contrato-u1-f1; com &modo=jogo, abre
 * como no jogo, do briefing ao Levar pro mundo). Modelo enxuto do formato
 * (ver o guia, seção 31), no quarto à noite das cenas de referência:
 *
 * - o cliente: Rafa, que grava música no quarto (kit de clientes);
 * - o pedido: a luz pisca duas vezes quando a gravação começa e o ventilador
 *   fica na velocidade 1 (o mais silencioso). A ficha do ventilador é o item
 *   de processo (ler o manual antes de usar): não tem cartão, ninguém pediu;
 * - as distrações: a lâmpada roxa, o quarto à prova de som e trancar a
 *   porta (ele comentou, mas não pediu);
 * - a mudança: depois do pisca-pisca pronto, Rafa pede que a luz fique acesa
 *   fraquinha no fim (brilho 30). A parte nova toma o lugar do pisca-pisca: o
 *   código do antes (que termina apagado) não passa mais.
 *
 * O contrato da Lógica (a Padaria Pão de Mel) é o modelo completo, com plano,
 * casos de teste e vários dias de teste.
 */
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import type { FaseDesafio, Unidade, Validador } from "../tipos";
import { CENA_QUARTO } from "./cenasDeReferencia";

export const UNIDADE_BANCADA_CONTRATO: Unidade = {
  id: "lab-contrato-u1",
  ilha: "Laboratório",
  zona: "Bancada do contrato",
  numero: 1,
  titulo: "Um cliente de verdade",
  meta: { enunciado: "Um cliente contrata você: entender o pedido, separar o que ele pediu de verdade, programar, aguentar a mudança no meio e entregar.", desafioId: "lab-contrato-u1-f1" },
  fases: ["lab-contrato-u1-f1"],
};

/** O código do antes: pisca duas vezes e deixa o ventilador na 1. */
export const CODIGO_ESTUDIO_ANTES = [
  "for (let vez = 1; vez <= 2; vez++) {",
  "  lampada.ligar();",
  "  esperar(500);",
  "  lampada.desligar();",
  "  esperar(500);",
  "}",
  "ventilador.velocidade = 1;",
].join("\n");

/** O código do depois: no fim, a luz fica acesa fraquinha. */
export const CODIGO_ESTUDIO_DEPOIS = [
  "for (let vez = 1; vez <= 2; vez++) {",
  "  lampada.ligar();",
  "  esperar(500);",
  "  lampada.desligar();",
  "  esperar(500);",
  "}",
  "lampada.brilho = 30;",
  "lampada.ligar();",
  "ventilador.velocidade = 1;",
].join("\n");

const PISCA_DUAS: Validador = {
  tipo: "sequenciaNaCena",
  dispositivo: "lampada",
  exata: true,
  eventos: [{ acao: "ligar" }, { acao: "desligar", aposMs: 500 }, { acao: "ligar", aposMs: 500 }, { acao: "desligar", aposMs: 500 }],
};

const PISCA_E_FICA: Validador = {
  tipo: "todos",
  validadores: [
    {
      tipo: "sequenciaNaCena",
      dispositivo: "lampada",
      exata: true,
      eventos: [{ acao: "ligar" }, { acao: "desligar", aposMs: 500 }, { acao: "ligar", aposMs: 500 }, { acao: "desligar", aposMs: 500 }, { acao: "ligar", aposMs: 500 }],
    },
    { tipo: "estadoNaCena", dispositivo: "lampada", propriedade: "brilho", valor: 30 },
  ],
};

const rodar = (codigo: string) => [{ tipo: "definirSnippet", codigo } as const, { tipo: "executarSnippet" } as const];

export const FASE_DEMO_CONTRATO: FaseDesafio = {
  id: "lab-contrato-u1-f1",
  tipo: "desafio",
  unidadeId: "lab-contrato-u1",
  titulo: "O estúdio do Rafa",
  conceitos: [],
  revisa: [],
  prerequisitos: [],
  areas: ["cena", "snippet", "palco"],
  cena: CENA_QUARTO,
  usaFerramentas: ["cena", "ficha-dispositivo", "velocidade-simulacao", "snippet", "console", "palco-memoria", "linha-do-tempo"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { snippet: { codigoInicial: "", nome: "estudio.js" } },
  introducao: [
    { texto: "Chegou trabalho! Um cliente quer automatizar o quarto onde ele grava música.", expressao: "comemorando" },
    { texto: "Primeiro a gente escuta o que ele quer. Depois separa o que ele pediu de verdade.", expressao: "curioso" },
  ],
  contrato: {
    cliente: "rafa-estudio",
    projeto: "Quarto que avisa a gravação",
    briefing: [
      { texto: "E aí! Eu gravo música aqui no quarto, de noite. Toda hora alguém abre a porta no meio da gravação.", expressao: "preocupado" },
      { texto: "Pensei assim: quando eu começar, a luz pisca duas vezes, rapidinho. Meio segundo acesa, meio apagada.", expressao: "empolgado" },
      { texto: "Ah, e o ventilador faz um barulhão. Deixa ele no 1, que é o mais quietinho.", expressao: "pensativo" },
      { texto: "Um dia eu troco a lâmpada por uma roxa. E queria o quarto à prova de som, mas aí já é outra história.", expressao: "feliz" },
    ],
    documento: {
      titulo: "Pedido do Rafa",
      paragrafos: [
        "Quando eu começar a gravar, a luz do quarto pisca 2 vezes: meio segundo acesa, meio segundo apagada.",
        "O ventilador fica na velocidade 1 (o mais quieto).",
        "Um dia quero uma lâmpada roxa e o quarto à prova de som, mas isso fica pra depois.",
      ],
    },
    requisitos: {
      cartoes: [
        {
          id: "pisca",
          texto: "A luz pisca ___ vezes, meio segundo acesa e meio apagada",
          parte: "pisca",
          lacunas: [{ opcoes: ["2", "3", "4"], correta: 0 }],
          porque: "É o aviso da gravação: ele pediu 2 piscadas, de meio segundo.",
        },
        {
          id: "ventilador",
          texto: "O ventilador fica na velocidade ___",
          parte: "ventilador",
          lacunas: [{ opcoes: ["1", "2", "3"], correta: 0 }],
          porque: "Ele pediu o ventilador no 1, o mais quieto, pra não atrapalhar a gravação.",
        },
        { id: "roxa", texto: "Trocar a lâmpada por uma roxa", sobra: true, porque: "Ele só comentou que um dia quer trocar. Não é trabalho de programação, nem é pra agora." },
        { id: "som", texto: "Deixar o quarto à prova de som", sobra: true, porque: "Ele mesmo disse que é outra história: é obra, não código." },
        { id: "porta", texto: "Trancar a porta durante a gravação", sobra: true, porque: "Ele reclamou de quem abre a porta, mas pediu o aviso da luz, não uma tranca." },
      ],
    },
    mudanca: {
      depoisDe: ["pisca"],
      mensagem: [
        { texto: "Opa, testei aqui e ficou ótimo! Só que depois de piscar fica tudo escuro e eu não enxergo as teclas.", expressao: "preocupado" },
        { texto: "Dá pra luz ficar acesa no fim, bem fraquinha? Tipo brilho 30.", expressao: "empolgado" },
      ],
      adendo: "Mensagem do Rafa: depois de piscar 2 vezes, a luz fica acesa no brilho 30 pra eu enxergar as teclas.",
      novas: [{ parte: "pisca-e-fica", substitui: "pisca" }],
    },
    entrega: {
      reacao: [
        { texto: "Caramba, ficou exatamente como eu imaginei! E esse relatório deixa tudo claro.", expressao: "satisfeito" },
        { texto: "Hoje à noite já gravo com o quarto avisando. Valeu demais!", expressao: "feliz" },
      ],
    },
    levarProMundo: { arquivo: "estudio-do-rafa.js" },
  },
  partes: [
    {
      id: "ficha",
      descricao: "Leu a ficha do ventilador (o manual da peça) antes de usar",
      validador: { tipo: "evento", evento: "abriuFicha" },
      revisarEm: "lab-cenas-u1-f1",
      pergunta: "Antes de mexer no ventilador: você sabe que comandos ele tem? Onde dá pra ver?",
      solucaoDeTeste: [{ tipo: "abrirFicha", dispositivo: "ventilador" }],
    },
    {
      id: "pisca",
      descricao: "A luz pisca 2 vezes, meio segundo acesa e meio apagada",
      validador: PISCA_DUAS,
      revisarEm: "lab-cenas-u1-f1",
      pergunta: "Quantas vezes o seu código liga a lâmpada? Conta na barra de tempo da cena.",
      solucaoDeTeste: rodar(CODIGO_ESTUDIO_ANTES.split("\n").slice(0, 6).join("\n")),
    },
    {
      id: "ventilador",
      descricao: "O ventilador fica na velocidade 1",
      validador: { tipo: "estadoNaCena", dispositivo: "ventilador", propriedade: "velocidade", valor: 1 },
      revisarEm: "lab-cenas-u1-f1",
      pergunta: "Como você troca a velocidade? É um comando ou uma propriedade? A ficha conta.",
      solucaoDeTeste: rodar(CODIGO_ESTUDIO_ANTES),
    },
    {
      id: "pisca-e-fica",
      descricao: "A luz pisca 2 vezes e depois fica acesa, com brilho 30",
      validador: PISCA_E_FICA,
      revisarEm: "lab-cenas-u1-f1",
      pergunta: "Depois do pisca-pisca, o que a lâmpada faz no seu código? E o brilho, você troca antes ou depois?",
      solucaoDeTeste: rodar(CODIGO_ESTUDIO_DEPOIS),
    },
  ],
  conclusao: [
    { texto: "Entregue! Você ouviu o cliente, separou o pedido do papo, programou e ainda aguentou a mudança no meio.", expressao: "comemorando" },
    { texto: "É assim no trabalho de verdade: o pedido muda, e o código bem feito muda junto sem quebrar.", expressao: "feliz" },
  ],
};

export const FASES_BANCADA_CONTRATO = [FASE_DEMO_CONTRATO] as const;
