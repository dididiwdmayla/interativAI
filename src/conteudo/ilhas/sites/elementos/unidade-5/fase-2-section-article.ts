/*
 * Unidade 5, Fase 2: "Section ou article?".
 *
 * O QUE ENSINA: section agrupa conteúdo por tema; article é um conteúdo
 * que se basta sozinho, algo que daria pra tirar da página e reaproveitar
 * em outro lugar sem perder o sentido.
 *
 * REVISÃO ESPAÇADA: a semântica do HTML (fase 1 desta unidade) volta
 * misturada: section e article também não mudam nada no visual sozinhas.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, ação: o agrupamento dos serviços vira section — ele reúne
 *    vários cards sobre o mesmo tema.
 * 2. Guiado, previsão: antes de renomear um card de serviço, o jogador
 *    aposta se ele pede section ou article. Cada card se basta sozinho
 *    (preço, nome, descrição): é article.
 * 3. Sozinho: o segundo card de serviço vira article, e a seção "Sobre
 *    nós" também vira section — duas trocas, sem dizer qual é qual.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_OFICINA } from "./sites/oficinaRodaLivre";

export const FASE_U5_F2: FasePratica = {
  id: "sites-elementos-u5-f2",
  tipo: "pratica",
  unidadeId: "sites-elementos-u5",
  titulo: "Section ou article?",
  conceitos: ["section-vs-article"],
  revisa: ["semantica-html"],
  prerequisitos: ["semantica-html", "elemento-pai"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "renomear-tag"],
  siteAlvo: SITE_OFICINA,

  introducao: [
    { texto: "Cabeçalho e rodapé já têm nome. Falta arrumar o miolo da página.", expressao: "feliz" },
    { texto: "section agrupa por tema; article é um pedaço que se basta sozinho, como uma notícia ou um produto.", expressao: "pensativo" },
    { texto: "Vamos descobrir qual peça é qual.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "servicos-vira-section",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "A caixa que reúne os dois serviços é uma div genérica. Troque ela para section: ela agrupa por tema.",
        toque: "A caixa que reúne os dois serviços é uma div genérica. Troque ela para section: ela agrupa por tema.",
      },
      validador: { tipo: "tag", seletor: "#servicos", nome: "section" },
      ajudas: {
        pergunta: "Essa caixa reúne vários serviços diferentes sob um mesmo assunto. Isso é um agrupamento por tema?",
        dica: "section é a tag pra um bloco que junta conteúdo sobre o mesmo assunto, como 'Nossos serviços'.",
        linha: { alvo: "arvore", seletor: "#servicos", fala: "Essa é a div que reúne os serviços. Dois cliques no nome da tag trocam ela." },
        solucao: {
          fala: "Troquei a div por section: ela agrupa os serviços, que são sobre o mesmo tema.",
          acoes: [{ tipo: "renomearTag", seletor: "#servicos", novaTag: "section" }],
        },
      },
      falaAoConcluir: { texto: "Isso! section é pra agrupar por assunto, mesmo sem mudar o visual.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#servicos", novaTag: "section" }],
    },
    {
      id: "prever-article",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: esse card de serviço (nome, descrição e preço) pede section ou article?",
        opcoes: ["section, porque agrupa por tema", "article, porque se basta sozinho e daria pra reaproveitar", "Tanto faz, as duas são iguais"],
        correta: 1,
        explicacao: "Um card assim faz sentido sozinho: dá pra tirar ele da página e colar em outro lugar (um catálogo, um anúncio) sem perder o sentido. Isso é article.",
      },
      enunciado: {
        mouse: "Agora confira: troque o card da revisão completa para article.",
        toque: "Agora confira: troque o card da revisão completa para article.",
      },
      validador: { tipo: "tag", seletor: "#servico-revisao", nome: "article" },
      ajudas: {
        pergunta: "Se você copiasse só esse card pra outro site, ele ainda faria sentido sozinho?",
        dica: "article é pra conteúdo que se basta: um produto, uma notícia, um comentário.",
        linha: { alvo: "arvore", seletor: "#servico-revisao", fala: "Esse é o card da revisão completa. Dois cliques no nome da tag trocam ele." },
        solucao: {
          fala: "Troquei a div por article: esse card se basta sozinho, então merece a tag de conteúdo independente.",
          acoes: [{ tipo: "renomearTag", seletor: "#servico-revisao", novaTag: "article" }],
        },
      },
      falaAoConcluir: { texto: "Exato! article é pra quem se vira sozinho fora da página.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "renomearTag", seletor: "#servico-revisao", novaTag: "article" },
      ],
    },
    {
      id: "secoes-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Troque o outro card de serviço e a caixa 'Sobre nós' pelas tags certas.",
        toque: "Troque o outro card de serviço e a caixa 'Sobre nós' pelas tags certas.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#servico-pintura", nome: "article" },
          { tipo: "tag", seletor: "#sobre", nome: "section" },
        ],
      },
      ajudas: {
        pergunta: "Esse card se basta sozinho? E a caixa 'Sobre nós' agrupa por tema ou é um conteúdo independente?",
        dica: "Card de produto ou serviço: article. Bloco que junta texto sobre um assunto: section.",
      },
      falaAoConcluir: { texto: "Perfeito! Você decidiu sozinho qual tag combinava com cada caixa.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "renomearTag", seletor: "#servico-pintura", novaTag: "article" },
        { tipo: "renomearTag", seletor: "#sobre", novaTag: "section" },
      ],
    },
  ],

  conclusao: [
    { texto: "section junta por tema; article se basta sozinho. Nenhuma das duas muda o visual por conta própria.", expressao: "comemorando" },
    { texto: "No F12 de verdade, um leitor de tela anuncia 'artigo' ou 'seção' ao entrar nessas peças.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de notícias de verdade, aperte F12 e veja se cada notícia é um article. Um card assim daria pra copiar pra outro lugar?",

  falaFinal: {
    texto: "Dica: se você não sabe se é section ou article, pergunte: 'isso faz sentido sozinho, fora da página?'",
    expressao: "curioso",
  },
};
