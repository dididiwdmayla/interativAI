/*
 * Unidade 6, Fase 2: "Acentos e mais uma peça do head".
 *
 * O QUE ENSINA: o meta charset (por que os acentos quebram sem ele) e, de
 * quebra, o "Adicionar atributo" (menu do nó) aplicado num link que já foi
 * escrito na fase anterior. O site já chega com o body pronto (h1,
 * parágrafo com acento e link) e SEM title nem meta charset: os acentos
 * aparecem quebrados desde a introdução, dando um motivo concreto pra
 * previsão do objetivo 1.
 *
 * ORDEM: 1) previsão + ação (meta charset, ataca a confusão "não faz
 * diferença ter ou não ter o meta charset" com o próprio efeito visual);
 * 2) guiado com uma ferramenta nova (Adicionar atributo), sobre o link que
 * já existe; 3) sozinho, mesma escrita no head, situação nova (viewport).
 *
 * REVISÃO ESPAÇADA: o objetivo 2 revisita target="_blank" ("link-aba-nova",
 * Unidade 4); o objetivo 3 revisita a escrita dentro do head (Fase 1).
 *
 * CONFUSÃO ATACADA: "os acentos vêm quebrados por acaso, não tem nada a
 * ver com o head" — a previsão liga o efeito visível à causa exata.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_CARTAZ_QUASE_PRONTO } from "./sites/cartazFeiraDeTalentos";

export const FASE_U6_F2: FasePratica = {
  id: "sites-elementos-u6-f2",
  tipo: "pratica",
  unidadeId: "sites-elementos-u6",
  titulo: "Acentos e mais uma peça do head",
  conceitos: ["meta-charset"],
  revisa: ["estrutura-do-documento", "head-vs-body", "link-aba-nova"],
  prerequisitos: ["estrutura-do-documento", "head-vs-body", "link-href"],
  usaFerramentas: ["editor", "adicionar-atributo"],
  modoDocumento: true,
  siteAlvo: SITE_CARTAZ_QUASE_PRONTO,

  introducao: [
    { texto: "O body do cartaz já está pronto, mas repare: o aviso de inscrição está com os acentos estranhos.", expressao: "curioso" },
    { texto: "Isso acontece quando falta uma peça no head. Vamos consertar e acrescentar mais uma coisinha nele.", expressao: "pensativo" },
  ],

  objetivos: [
    {
      id: "meta-charset",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: 'O aviso está com os acentos trocados. O que acontece se você escrever <meta charset="utf-8"> no head?',
        opcoes: ["Nada muda", "Os acentos ficam certos", "A página fica menor"],
        correta: 1,
        explicacao: "O meta charset diz ao navegador como ler as letras da página (UTF-8): os acentos voltam ao normal.",
      },
      enunciado: {
        mouse: 'Agora escreva <meta charset="utf-8"> no começo do head e veja os acentos se ajeitarem.',
        toque: 'Agora escreva <meta charset="utf-8"> no começo do head e veja os acentos se ajeitarem.',
      },
      validador: { tipo: "existe", seletor: "head > meta[charset]" },
      ajudas: {
        pergunta: "Que tag do head diz ao navegador como ler as letras da página?",
        dica: "meta charset, escrito dentro do head, resolve isso.",
        linha: { alvo: "arvore", seletor: "head", fala: "É bem no comecinho do head que essa tag entra." },
        solucao: {
          fala: 'Escrevi <meta charset="utf-8"> no início do head: os acentos voltaram certinhos.',
          acoes: [{ tipo: "inserirHTML", seletor: "head", posicao: "inicio", html: '<meta charset="utf-8">' }],
        },
      },
      falaAoConcluir: { texto: "Os acentos voltaram! Sem o meta charset, o navegador pode ler as letras erradas.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "inserirHTML", seletor: "head", posicao: "inicio", html: '<meta charset="utf-8">' },
      ],
    },
    {
      id: "link-aba-nova",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: 'Faça o link abrir numa aba nova: clique com o botão direito nele, Adicionar atributo, target="_blank".',
        toque: 'Faça o link abrir numa aba nova: toque e segure nele, Adicionar atributo, target="_blank".',
      },
      apresentar: ["adicionar-atributo"],
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "a", nome: "target", valor: "_blank" },
          { tipo: "evento", evento: "adicionouAtributo" },
        ],
      },
      ajudas: {
        pergunta: "O link tem algum atributo que diga onde ele abre?",
        dica: 'Um atributo novo se cria pelo "Adicionar atributo" do menu do nó, ou direto no código.',
        linha: { alvo: "arvore", seletor: "a", fala: "É neste link que o atributo novo entra." },
        solucao: {
          fala: 'Usei Adicionar atributo e escrevi target="_blank": o link agora abre numa aba nova.',
          acoes: [{ tipo: "adicionarAtributo", seletor: "a", nome: "target", valor: "_blank" }],
        },
      },
      falaAoConcluir: {
        texto: "Aba nova garantida! No F12 de verdade, dois cliques só editam atributo que já existe; um novo é pelo Add attribute.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: "a", nome: "target", valor: "_blank" }],
    },
    {
      id: "meta-viewport",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: 'No head, acrescente: <meta name="viewport" content="width=device-width, initial-scale=1">.',
        toque: 'No head, acrescente: <meta name="viewport" content="width=device-width, initial-scale=1">.',
      },
      validador: { tipo: "existe", seletor: 'head > meta[name="viewport"]' },
      ajudas: {
        pergunta: "Que outra tag do head avisa o tamanho da tela pros celulares?",
        dica: 'É outro meta, com name="viewport" e um content parecido com o das outras fases.',
      },
      falaAoConcluir: { texto: "Viewport no ar! Ele ajuda a página a se ajustar direitinho em telas pequenas.", expressao: "comemorando" },
      solucaoDeTeste: [
        {
          tipo: "inserirHTML",
          seletor: "head",
          posicao: "fim",
          html: '<meta name="viewport" content="width=device-width, initial-scale=1">',
        },
      ],
    },
  ],

  conclusao: [
    { texto: "O head do cartaz já tem title, meta charset e viewport: as três peças que quase toda página real usa.", expressao: "comemorando" },
    { texto: "No F12 de verdade, essas tags moram sempre no comecinho do head, antes de qualquer style.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e ache a tag meta charset dentro do head. Quase todo site tem uma logo no começo.",

  falaFinal: { texto: "Agora é o desafio: uma página inteira do zero, sem passo a passo. Você consegue!", expressao: "curioso" },
};
