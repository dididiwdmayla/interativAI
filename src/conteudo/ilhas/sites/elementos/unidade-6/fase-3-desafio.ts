/*
 * Unidade 6, Desafio: "Marcos Conserta Bikes".
 *
 * O QUE PRATICA: tudo da unidade junto, sem passo a passo, num site NOVO
 * (um cartão de visita de bicicletas, não o cartaz da escola) e do ZERO
 * (head e body vazios, como a Fase 1). A meta mostra o antes (a página em
 * branco) e o depois (o cartão pronto, aplicando as soluções das partes).
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por habilidade dos micro-passos,
 * cada uma apontando (revisarEm) pra fase onde foi ensinada guiada:
 * - title da aba: Fase 1 (objetivo 2, a previsão do title);
 * - h1 no body: Fase 1 (objetivo 1, escrever no body);
 * - meta charset: Fase 2 (objetivo 1, a previsão do charset);
 * - meta viewport: Fase 2 (objetivo 3, escrever outra tag no head);
 * - parágrafo com acento: Fase 1 (objetivo 3, escrever no body).
 *
 * Todas as partes são avaliadas ao vivo (existe/textoIgual): se o jogador
 * desfizer uma peça, o checklist desmarca até ela voltar.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { CARTAO_MARCOS_CONSERTA_BIKES } from "./sites/cartaoMarcosConsertaBikes";

export const FASE_U6_F3: FaseDesafio = {
  id: "sites-elementos-u6-f3",
  tipo: "desafio",
  unidadeId: "sites-elementos-u6",
  titulo: "Marcos Conserta Bikes",
  conceitos: ["estrutura-do-documento", "head-vs-body", "title", "meta-charset"],
  revisa: [],
  prerequisitos: ["estrutura-do-documento", "head-vs-body", "title", "meta-charset"],
  usaFerramentas: ["editor"],
  modoDocumento: true,
  siteAlvo: CARTAO_MARCOS_CONSERTA_BIKES,

  introducao: [
    { texto: "Hora do desafio! O Marcos conserta bicicletas e precisa de um cartão de visita, do zero.", expressao: "feliz" },
    { texto: "A página está em branco: title, head e body são com você, sem passo a passo desta vez.", expressao: "curioso" },
    { texto: "Travou? O botão Rever te leva pra fase onde aquilo foi ensinado. Bora ajudar o Marcos?", expressao: "apontando" },
  ],

  partes: [
    {
      id: "titulo-da-aba",
      descricao: "Escrever o title da aba: Marcos Conserta Bikes",
      validador: { tipo: "tituloDaAba", valor: "Marcos Conserta Bikes" },
      revisarEm: "sites-elementos-u6-f1",
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "head", posicao: "fim", html: "<title>Marcos Conserta Bikes</title>" }],
    },
    {
      id: "titulo-da-pagina",
      descricao: "Escrever um h1 com o nome do negócio no body",
      validador: { tipo: "textoIgual", seletor: "h1", valor: "Marcos Conserta Bikes" },
      revisarEm: "sites-elementos-u6-f1",
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "body", posicao: "fim", html: "<h1>Marcos Conserta Bikes</h1>" }],
    },
    {
      id: "meta-charset-cartao",
      descricao: "Acrescentar o meta charset pra consertar os acentos",
      validador: { tipo: "existe", seletor: "head > meta[charset]" },
      revisarEm: "sites-elementos-u6-f2",
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "head", posicao: "inicio", html: '<meta charset="utf-8">' }],
    },
    {
      id: "meta-viewport-cartao",
      descricao: "Acrescentar o meta viewport",
      validador: { tipo: "existe", seletor: 'head > meta[name="viewport"]' },
      revisarEm: "sites-elementos-u6-f2",
      solucaoDeTeste: [
        {
          tipo: "inserirHTML",
          seletor: "head",
          posicao: "fim",
          html: '<meta name="viewport" content="width=device-width, initial-scale=1">',
        },
      ],
    },
    {
      id: "bio-com-acento",
      descricao: "Escrever no body: Conserto rápido de bicicletas, com revisão grátis!",
      validador: { tipo: "textoIgual", seletor: "p", valor: "Conserto rápido de bicicletas, com revisão grátis!" },
      revisarEm: "sites-elementos-u6-f1",
      solucaoDeTeste: [
        { tipo: "inserirHTML", seletor: "body", posicao: "fim", html: "<p>Conserto rápido de bicicletas, com revisão grátis!</p>" },
      ],
    },
  ],

  conclusao: [
    { texto: "Desafio vencido! O Marcos já tem cartão de visita, escrito do zero por você.", expressao: "comemorando" },
    { texto: "Doctype, head, title, meta charset, meta viewport e body: agora você escreve uma página inteira sozinho.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Escreva num editor de texto qualquer uma página bem simples (doctype, html, head com title e body com um h1) e abra o arquivo no navegador.",

  falaFinal: { texto: "Zona Elementos completa! Na próxima ilha de conteúdo: os seletores do CSS.", expressao: "feliz" },
};
