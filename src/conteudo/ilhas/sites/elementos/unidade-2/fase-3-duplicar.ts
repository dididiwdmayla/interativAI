/*
 * Unidade 2, Fase 3: "Copia e cola de verdade".
 *
 * O QUE ENSINA: duplicar um elemento (a cópia vem com tudo o que tem
 * dentro, logo depois do original) e a ideia de elementos irmãos (filhos
 * do mesmo pai, lado a lado).
 *
 * REVISÃO ESPAÇADA: a trilha (fase 1 desta unidade) e a edição de texto
 * (Unidade 1) entram DENTRO da tarefa: para duplicar a notícia inteira, o
 * jogador sobe do título até o article pela trilha; depois troca o título
 * da cópia com dois cliques.
 *
 * O SITE: o Jornal da Vila já sem anúncios (a faxina da fase 2 foi feita),
 * para o foco ficar só nas notícias.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado: um duplicar só, com o caminho completo (título -> trilha ->
 *    article -> duplicar -> título da cópia). O validador pede o evento da
 *    trilha, 4 notícias e um título novo: assim, duplicar só o h3 (o erro
 *    mais comum) não passa, e a pergunta socrática aponta justo para isso.
 * 2. Sozinho: outra notícia, DUAS cópias, títulos diferentes. Muda a
 *    situação (repetir o gesto, cuidar de qual cópia está selecionada) em
 *    vez de só trocar o texto. Termina com 6 notícias (3 originais + 1 do
 *    guiado + 2 agora) e pede 3 títulos novos e diferentes entre si.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_JORNAL_LIMPO } from "./sites/jornalDaVila";

export const FASE_U2_F3: FasePratica = {
  id: "sites-elementos-u2-f3",
  tipo: "pratica",
  unidadeId: "sites-elementos-u2",
  titulo: "Copia e cola de verdade",
  conceitos: ["duplicar-elemento", "elementos-irmaos"],
  revisa: ["editar-texto", "elemento-pai"],
  prerequisitos: ["elemento-pai", "selecionar-pela-arvore"],
  usaFerramentas: [
    "painel",
    "previa",
    "me-ajuda",
    "tutor",
    "arvore",
    "inspecionar",
    "editar-duplo-clique",
    "trilha",
    "desfazer",
    "duplicar",
  ],
  siteAlvo: SITE_JORNAL_LIMPO,

  introducao: [
    {
      texto: "O Jornal da Vila ficou limpinho! Agora a redação quer mais notícias na página.",
      expressao: "feliz",
    },
    {
      texto: "Escrever tudo do zero dá trabalho. Quem programa copia uma peça pronta e só muda o que precisa.",
      expressao: "pensativo",
    },
    {
      texto: "Hoje você vai duplicar elementos, igualzinho ao F12. Bora?",
      expressao: "curioso",
    },
  ],

  objetivos: [
    {
      id: "duplicar-noticia",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique no título de uma notícia, suba pela trilha até o article, duplique e mude o título da cópia.",
        toque: "Toque no título de uma notícia, suba pela trilha até o article, duplique e mude o título da cópia.",
      },
      apresentar: ["duplicar"],
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "evento", evento: "trilha" },
          { tipo: "contagem", seletor: "#noticias .noticia", op: ">=", valor: 4 },
          { tipo: "textoDiferenteDoInicial", seletor: ".noticia h3" },
        ],
      },
      ajudas: {
        // O erro comum é duplicar só o título; a pergunta faz o jogador prever isso.
        pergunta: "Se você duplicar só o título, o que acontece com o texto e o link da notícia?",
        dica: "Duplicar copia a peça com tudo o que tem dentro. Duplicando o article, a notícia inteira vem junto.",
        linha: {
          alvo: "arvore",
          seletor: "#noticia-praca h3",
          fala: "Comece por esse título piscando: selecione, suba pela trilha até o article e duplique a notícia inteira.",
        },
        solucao: {
          fala: "Subi do título até o article, dupliquei e troquei o título da cópia. A cópia nasce logo depois do original.",
          acoes: [
            { tipo: "selecionar", seletor: "#noticia-praca h3" },
            { tipo: "selecionar", seletor: "article", via: "trilha" },
            { tipo: "duplicar", seletor: "$0" },
            { tipo: "definirTexto", seletor: "$0 h3", valor: "Biblioteca da vila abre à noite" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Notícia nova no ar! A cópia é irmã da original: as duas moram dentro do mesmo pai.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: "#noticia-praca h3" },
        { tipo: "selecionar", seletor: "article", via: "trilha" },
        { tipo: "duplicar", seletor: "$0" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Biblioteca da vila abre à noite" },
      ],
    },
    {
      id: "duas-copias",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Duplique outra notícia duas vezes e dê um título diferente a cada cópia.",
        toque: "Duplique outra notícia duas vezes e dê um título diferente a cada cópia.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "#noticias .noticia", op: ">=", valor: 6 },
          { tipo: "textoDiferenteDoInicial", seletor: ".noticia h3", minimo: 3 },
        ],
      },
      ajudas: {
        pergunta: "Depois de duplicar, qual peça fica selecionada: a original ou a cópia?",
        dica: "Cada cópia é uma irmã nova dentro do mesmo pai. Troque o título de cada uma com dois cliques.",
      },
      falaAoConcluir: {
        texto: "Seis notícias, todas irmãs dentro da mesma section. A redação agradece!",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "duplicar", seletor: "#noticia-time" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Horta da escola colhe a primeira alface" },
        { tipo: "duplicar", seletor: "#noticia-time" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Padaria nova abre na rua de cima" },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Página cheia de notícias! Duplicar poupa um tempão: copia a peça pronta e muda só o texto.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade é igual: botão direito no elemento e Duplicate element.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e ache um item de uma lista (um produto, um card). Clique com o botão direito nele na aba Elements e escolha Duplicate element. Troque o texto da cópia: só você vê.",

  falaFinal: {
    texto: "Guarde essa: toda lista de produtos, posts ou notícias é um monte de irmãos iguais com textos diferentes.",
    expressao: "curioso",
  },
};
