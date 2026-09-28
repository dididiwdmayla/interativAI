/*
 * P2, Fase 2: "Meu primeiro site" (projeto-ponte, o fim da Ilha Sites).
 *
 * O QUE É: o primeiro site do PRÓPRIO jogador, do zero, no modo documento,
 * com tudo o que a ilha ensinou. Não há passo a passo nem Rever: um
 * checklist de requisitos se marca sozinho, o "Me faz uma pergunta" só
 * pergunta (uma pergunta de cada requisito que falta, em rodízio) e o
 * tutor também só pergunta (modo "projeto" no prompt). O site fica salvo
 * em Meus projetos, pode ser reaberto e sai do jogo pelo Levar pro mundo.
 *
 * REQUISITOS (a ordem é a ordem do checklist, do mais simples ao que pede
 * conferir): título da aba (U6), cabeçalho, conteúdo principal e rodapé
 * (semântica, U5), conteúdo sobre o jogador (títulos e parágrafos), uma
 * @media no style.css, Acessibilidade 90 ou mais depois de rodar o
 * Lighthouse, e nada cortado no Celular 390 (modo dispositivo ligado).
 *
 * POR QUE OS DOIS ÚLTIMOS PEDEM A FERRAMENTA: sem o evento (Analisar) e
 * sem o aparelho ligado, uma página quase vazia já passaria (nota alta e
 * nada cortado). O requisito é o jogador CONFERIR, como na Fase 1.
 *
 * ESCOLHAS DE ESCRITA: as perguntas levam o jogador a pensar no próprio
 * site ("o que você quer que a pessoa leia primeiro?"), nunca dizem a
 * resposta, e cada uma cabe numa fala.
 */
import type { FaseProjetoPonte } from "@/conteudo/tipos";
import { SITE_MEU_PRIMEIRO_SITE } from "./sites/meuPrimeiroSite";

export const FASE_P2_F2: FaseProjetoPonte = {
  id: "sites-publicar-u2-f2",
  tipo: "projeto-ponte",
  unidadeId: "sites-publicar-u2",
  titulo: "Meu primeiro site",
  nomeDoProjeto: "Meu primeiro site",
  conceitos: ["title", "semantica-html", "titulos-hierarquia", "paragrafo", "css-externo", "modo-dispositivo", "auditoria-lighthouse", "index-html"],
  revisa: [],
  prerequisitos: ["estrutura-do-documento", "semantica-html", "o-que-e-css"],
  usaFerramentas: [
    "painel",
    "previa",
    "me-ajuda",
    "tutor",
    "arvore",
    "inspecionar",
    "editar-duplo-clique",
    "editor",
    "editor-css",
    "painel-estilos",
    "editar-valor-css",
    "seletor-de-cor",
    "nova-regra",
    "modo-dispositivo",
    "lighthouse",
    "levar-pro-mundo",
  ],
  paineisElementos: ["estilos"],
  modoDocumento: true,
  siteAlvo: SITE_MEU_PRIMEIRO_SITE,

  introducao: [
    { texto: "Chegou a hora do seu site. Não é da padaria nem da Bia: é seu, do jeito que você quiser.", expressao: "feliz" },
    { texto: "Sem passo a passo. O checklist marca cada requisito sozinho, e eu só faço perguntas se você pedir.", expressao: "curioso" },
    { texto: "Ele fica salvo em Meus projetos. Quando estiver pronto, é só Levar pro mundo!", expressao: "apontando" },
  ],

  requisitos: [
    {
      id: "titulo-da-aba",
      descricao: "A aba mostra um título seu (o title não fica vazio)",
      validador: { tipo: "tituloDaAba" },
      pergunta: "Se o seu site estiver numa aba entre outras vinte, que nome faz você achar ele?",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: "Site do Leo" }],
    },
    {
      id: "cabecalho-principal-rodape",
      descricao: "Tem cabeçalho (header), conteúdo principal (main) e rodapé (footer)",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "existe", seletor: "body header" },
          { tipo: "existe", seletor: "body main" },
          { tipo: "existe", seletor: "body footer" },
        ],
      },
      pergunta: "Todo site tem um topo, um miolo e um pé. Que tags dão nome a essas três partes?",
      solucaoDeTeste: [
        { tipo: "inserirHTML", seletor: "body", posicao: "inicio", html: "<header></header>" },
        { tipo: "inserirHTML", seletor: "body", posicao: "fim", html: "<main></main>" },
        { tipo: "inserirHTML", seletor: "body", posicao: "fim", html: "<footer><p>Feito por mim, com HTML e CSS.</p></footer>" },
      ],
    },
    {
      id: "sobre-voce",
      descricao: "No conteúdo principal, um título h2 e um parágrafo contando algo sobre você",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "textoNaoVazio", seletor: "main h2" },
          { tipo: "contagem", seletor: "main p", op: ">=", valor: 1, comTexto: true },
        ],
      },
      pergunta: "O que você quer que a pessoa leia primeiro sobre você? E que título combina com isso?",
      solucaoDeTeste: [
        { tipo: "inserirHTML", seletor: "main", posicao: "fim", html: "<h2>Sobre mim</h2><p>Eu gosto de desenhar e de montar robôs de sucata.</p>" },
      ],
    },
    {
      id: "uma-media-query",
      descricao: "O style.css tem pelo menos uma regra @media (o site muda em telas estreitas)",
      validador: { tipo: "temMediaQuery" },
      pergunta: "O que no seu site deveria mudar quando a tela fica estreita como a de um celular?",
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  h1 {\n    font-size: 1.6rem;\n  }\n}\n" }],
    },
    {
      id: "acessibilidade-90",
      descricao: "Rodou o Lighthouse e a Acessibilidade ficou em 90 ou mais",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "evento", evento: "auditou" },
          { tipo: "notaAuditoria", categoria: "acessibilidade", minimo: 90 },
        ],
      },
      pergunta: "Quem não enxerga bem consegue usar o seu site? Qual aba do painel confere isso pra você?",
      solucaoDeTeste: [{ tipo: "analisarAuditoria" }],
    },
    {
      id: "cabe-no-celular",
      descricao: "No modo dispositivo, Celular 390, nada fica cortado nem rola de lado",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "dispositivo", largura: 390 },
          { tipo: "cabeNaTela", largura: 390 },
        ],
      },
      pergunta: "Você já viu o seu site do tamanho de um celular? Alguma coisa ficou maior que a tela?",
      solucaoDeTeste: [{ tipo: "trocarDispositivo", modelo: "celular-390" }],
    },
  ],

  conclusao: [
    { texto: "Seu primeiro site está pronto, feito do zero por você. Isso é o que programadores de front-end fazem todo dia.", expressao: "comemorando" },
    { texto: "Ele está salvo em Meus projetos. No Levar pro mundo, o guia mostra como ganhar um endereço na internet.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Siga o guia de publicação do Levar pro mundo e ponha o seu site na internet. Depois, cole o link no guia e mande pra alguém abrir no celular.",

  falaFinal: { texto: "A Ilha Sites inteira é sua. Volte pra ilha e veja o que acontece!", expressao: "comemorando" },
};
