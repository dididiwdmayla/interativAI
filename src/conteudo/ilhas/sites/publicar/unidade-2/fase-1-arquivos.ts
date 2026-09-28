/*
 * P2, Fase 1: "Arquivos de verdade".
 *
 * O QUE ENSINA: o caminho de um site do jogo para o mundo. Antes de
 * publicar, quem faz site confere (no celular e no Lighthouse); depois,
 * o site vira ARQUIVOS: o index.html (a página de entrada que o servidor
 * mostra) e o style.css (o visual), ligados por uma linha <link> no head.
 *
 * ORDEM: 1) guiado, ferramenta nova (modo dispositivo): o Cantinho da Bia
 * no Celular 390; 2) guiado, ferramenta nova (Lighthouse): Analisar;
 * 3) previsão + ação, ferramenta nova (Levar pro mundo): o que a linha
 * <link rel="stylesheet"> faz, e baixar o .zip; 4) sozinho: mudar o
 * visual e levar de novo (o .zip é uma FOTO do site naquele momento).
 *
 * CONFUSÃO ATACADA: "o site mora dentro do jogo" e "a cor fica no HTML".
 * A previsão liga a linha do <link> ao arquivo do visual; o sozinho mostra
 * que cada Levar pro mundo leva o site como ele está agora.
 *
 * ATUALIZADO (R1 e P1 publicadas): modo dispositivo e Lighthouse já
 * foram apresentados antes (R1 e P1, respectivamente), então esta fase
 * só REVISA os dois, sem apresentar de novo: "modo-dispositivo" e
 * "auditoria-lighthouse" saíram de `conceitos` e foram para `revisa`, e
 * os `apresentar: ["modo-dispositivo"]` / `["lighthouse"]` dos objetivos
 * 1 e 2 foram removidos.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_CANTINHO_DA_BIA } from "./sites/cantinhoDaBia";

export const FASE_P2_F1: FasePratica = {
  id: "sites-publicar-u2-f1",
  tipo: "pratica",
  unidadeId: "sites-publicar-u2",
  titulo: "Arquivos de verdade",
  conceitos: ["css-externo", "index-html", "publicar-site"],
  revisa: ["estrutura-do-documento", "cor-do-texto", "modo-dispositivo", "auditoria-lighthouse"],
  prerequisitos: ["estrutura-do-documento", "head-vs-body", "o-que-e-css"],
  usaFerramentas: ["arvore", "editor", "editor-css", "painel-estilos", "editar-valor-css", "seletor-de-cor", "modo-dispositivo", "lighthouse", "levar-pro-mundo"],
  paineisElementos: ["estilos"],
  modoDocumento: true,
  siteAlvo: SITE_CANTINHO_DA_BIA,

  introducao: [
    { texto: "Esta é a Bia. Ela fez o próprio site e quer mostrar pra família inteira, na internet de verdade.", expressao: "feliz" },
    { texto: "Antes de publicar, quem faz site confere duas coisas: se fica bom no celular e o que o Lighthouse acha.", expressao: "pensativo" },
    { texto: "Depois, o site sai do jogo como arquivos de verdade. Bora levar o Cantinho da Bia pro mundo?", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "no-celular",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Primeiro, o celular: ligue o modo dispositivo e escolha o Celular 390.",
        toque: "Primeiro, o celular: ligue o modo dispositivo e escolha o Celular 390.",
      },
      validador: { tipo: "dispositivo", largura: 390 },
      ajudas: {
        pergunta: "Como ver a página do tamanho de um celular sem sair do computador?",
        dica: "O botão do celular e tablet, ao lado da setinha do inspecionar, liga a barra de dispositivo.",
        linha: { alvo: "ferramenta", ferramenta: "modo-dispositivo", fala: "É este botão: ele liga a barra de dispositivo." },
        solucao: { fala: "Liguei o modo dispositivo no Celular 390.", acoes: [{ tipo: "trocarDispositivo", modelo: "celular-390" }] },
      },
      falaAoConcluir: {
        texto: "Olha o título encolhendo! A Bia pôs uma regra @media que só vale em telas estreitas. Cabe tudo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "trocarDispositivo", modelo: "celular-390" }],
    },
    {
      id: "analisar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora a conferência: abra a aba Lighthouse, lá em cima no painel, e clique em Analisar.",
        toque: "Agora a conferência: abra a aba Lighthouse, lá em cima no painel, e toque em Analisar.",
      },
      validador: { tipo: "evento", evento: "auditou" },
      ajudas: {
        pergunta: "Qual aba do painel dá notas para a página?",
        dica: "É a aba Lighthouse, ao lado de Elementos. Lá dentro tem o botão Analisar.",
        linha: { alvo: "ferramenta", ferramenta: "lighthouse", fala: "Esta aba: clique nela e depois em Analisar." },
        solucao: { fala: "Rodei a análise: as notas apareceram.", acoes: [{ tipo: "analisarAuditoria" }] },
      },
      falaAoConcluir: { texto: "Notas altas! O site da Bia está pronto pra sair de casa.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "analisarAuditoria" }],
    },
    {
      id: "levar-pro-mundo",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: 'Fora do jogo, o index.html ganha a linha <link rel="stylesheet" href="style.css">. Pra que ela serve?',
        opcoes: ["Abre outro site", "Liga a página ao arquivo do visual", "Deixa o site mais rápido"],
        correta: 1,
        explicacao: "O visual mora no style.css, separado. Sem essa linha, a página abre sem cor nenhuma.",
      },
      enunciado: {
        mouse: "Agora clique em Levar pro mundo, em cima da prévia, e baixe o .zip.",
        toque: "Agora toque em Levar pro mundo, em cima da prévia, e baixe o .zip.",
      },
      apresentar: ["levar-pro-mundo"],
      validador: { tipo: "evento", evento: "exportouProjeto" },
      ajudas: {
        pergunta: "Qual botão transforma o site em arquivos?",
        dica: "Fica na barra do navegador, em cima da prévia: Levar pro mundo. Depois é o Baixar .zip.",
        linha: { alvo: "ferramenta", ferramenta: "levar-pro-mundo", fala: "Este botão: ele mostra os arquivos e baixa o .zip." },
        solucao: { fala: "Baixei o .zip: dentro dele, o index.html e o style.css.", acoes: [{ tipo: "levarProMundo" }] },
      },
      falaAoConcluir: {
        texto: "Baixou! Dentro do .zip: index.html, a página de entrada, e style.css, o visual. É assim que todo site mora num servidor.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }, { tipo: "levarProMundo" }],
    },
    {
      id: "mudar-e-levar-de-novo",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "A Bia quer o título de outra cor. Troque a cor do h1 no CSS e leve pro mundo de novo.",
        toque: "A Bia quer o título de outra cor. Troque a cor do h1 no CSS e leve pro mundo de novo.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "nao", validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "color", valor: "#8a3b12" } },
          { tipo: "evento", evento: "exportouProjeto" },
        ],
      },
      ajudas: {
        pergunta: "Onde mora a cor do título: no index.html ou no style.css? E o .zip de antes já sabe da cor nova?",
        dica: "Mude o color da regra h1 (no Estilos ou na aba estilo.css) e clique de novo em Levar pro mundo.",
      },
      falaAoConcluir: {
        texto: "Cor nova, .zip novo! Cada Levar pro mundo é uma foto do site naquele momento. Mudou? Leva de novo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "#1d5c8a" },
        { tipo: "levarProMundo" },
      ],
    },
  ],

  conclusao: [
    { texto: "O Cantinho da Bia virou dois arquivos de verdade. Qualquer servidor da internet sabe mostrar esse par.", expressao: "comemorando" },
    { texto: "O guia de publicação, no Levar pro mundo, mostra o passo a passo pra ter um endereço na internet.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12, abra a aba Elements e procure no head uma linha link com rel=\"stylesheet\": é o CSS do site, num arquivo separado.",

  falaFinal: { texto: "Agora é a sua vez: o seu primeiro site, do zero, com as suas ideias. Vamos?", expressao: "curioso" },
};
