/*
 * Unidade 2, Fase 1: "Família de elementos".
 *
 * O QUE ENSINA: pai, filho e aninhamento (peça dentro de peça), com a
 * ferramenta nova "trilha". É a base das outras fases: para esconder,
 * apagar ou duplicar a coisa certa, o jogador precisa saber escolher o
 * "andar" certo da família (o link? a notícia inteira? a lista toda?).
 *
 * REVISÃO ESPAÇADA: selecionar pela árvore (objetivo 1) e o modo
 * inspecionar (objetivo 3), os dois da Unidade 1, entram misturados na
 * tarefa, sem aviso de "revisão".
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, ação: o jogador sobe UM andar (link -> article). É o gesto
 *    mínimo da trilha, com um resultado bem visível: a caixa azul na tela
 *    cresce e pega a notícia inteira.
 * 2. Guiado, previsão: antes de selecionar o main, ele prevê o que está
 *    dentro. A resposta certa surpreende (o anúncio do lado também está
 *    dentro do main!), e isso cria a ideia de "pai guarda tudo o que está
 *    recuado embaixo dele". Ele confere selecionando.
 * 3. Sozinho: mesma habilidade (subir pela trilha), situação diferente:
 *    começa pela setinha (e não pela árvore), outra notícia, e o alvo é o
 *    "pai de todas as notícias", que exige pensar: o main também tem as
 *    notícias, mas tem o anúncio junto; o pai delas é a section. Por isso
 *    o validador pede a section #noticias, e não o main.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_JORNAL } from "./sites/jornalDaVila";

export const FASE_U2_F1: FasePratica = {
  id: "sites-elementos-u2-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u2",
  titulo: "Família de elementos",
  conceitos: ["elemento-pai", "elemento-filho", "aninhamento"],
  revisa: ["selecionar-pela-arvore", "modo-inspecionar"],
  prerequisitos: ["elemento", "tag", "selecionar-pela-arvore"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "trilha"],
  siteAlvo: SITE_JORNAL,

  introducao: [
    {
      texto: "Bem-vindo ao Jornal da Vila! Hoje a gente descobre que as peças de um site vivem em família.",
      expressao: "feliz",
    },
    {
      texto: "Uma peça dentro da outra: quem guarda é o pai, quem está dentro é o filho. Igual caixa dentro de caixa.",
      expressao: "pensativo",
    },
    {
      texto: "Pra subir de andar nessa família tem uma ferramenta nova do F12 te esperando. Bora?",
      expressao: "curioso",
    },
  ],

  objetivos: [
    {
      id: "subir-ate-a-noticia",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique no link Leia mais de uma notícia, na árvore. Depois, pela trilha embaixo dela, suba até o article.",
        toque: "Toque no link Leia mais de uma notícia, na árvore. Depois, pela trilha embaixo dela, suba até o article.",
      },
      // A trilha é apresentada aqui, quando o jogador precisa dela pela primeira vez.
      apresentar: ["trilha"],
      validador: { tipo: "selecionado", seletor: "article.noticia", via: "trilha" },
      ajudas: {
        // Faz pensar na relação "mora dentro" sem dizer qual nome clicar.
        pergunta: "Se o link mora dentro da notícia, quem é a casa dele?",
        dica: "Na trilha, cada nome é um andar acima do selecionado. O article é a caixa que guarda a notícia inteira.",
        linha: {
          alvo: "ferramenta",
          ferramenta: "trilha",
          fala: "Olha a trilha piscando embaixo da árvore. Com o link selecionado, é só escolher o article nela.",
        },
        solucao: {
          fala: "Selecionei o link e subi pela trilha até o article: ele é o pai que guarda título, texto e link juntos.",
          acoes: [
            { tipo: "selecionar", seletor: ".noticia .leia-mais" },
            { tipo: "selecionar", seletor: "article", via: "trilha" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Isso! O article é o pai do link. Viu como a caixa na tela cresceu e pegou a notícia toda?",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: ".noticia .leia-mais" },
        { tipo: "selecionar", seletor: "article", via: "trilha" },
      ],
    },
    {
      id: "prever-o-main",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite rápido: se você selecionar o main, o que vai acender junto na tela?",
        opcoes: [
          "Só o nome do jornal, lá no topo",
          "As três notícias e o anúncio do lado",
          "A página inteira, do topo ao rodapé",
        ],
        correta: 1,
        explicacao:
          "O main guarda o miolo da página: a caixa das notícias e o anúncio do lado. O topo e o rodapé moram fora dele.",
      },
      enunciado: {
        mouse: "Agora confira: selecione o main na árvore e veja o que acende na tela.",
        toque: "Agora confira: toque no main na árvore e veja o que acende na tela.",
      },
      validador: { tipo: "selecionado", seletor: "main" },
      ajudas: {
        pergunta: "Na árvore, qual linha abre a caixa que tem as notícias dentro?",
        dica: "O main é o conteúdo principal da página. Tudo que está recuado embaixo dele é filho dele.",
        linha: {
          alvo: "arvore",
          seletor: "main",
          fala: "Esse nó piscando é o main. Selecione ele e compare a caixa na tela com o seu palpite.",
        },
        solucao: {
          fala: "Selecionei o main: a caixa pega as notícias e o anúncio, mas não o topo nem o rodapé.",
          acoes: [{ tipo: "selecionar", seletor: "main" }],
        },
      },
      falaAoConcluir: {
        texto: "Viu só? Tudo que está dentro do main acende junto. O pai leva os filhos para onde for.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "selecionar", seletor: "main" },
      ],
    },
    {
      id: "pai-das-noticias",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Com a setinha, pegue o título de outra notícia e suba pela trilha até o pai de todas as notícias.",
        toque: "Com a setinha, toque no título de outra notícia e suba pela trilha até o pai de todas as notícias.",
      },
      // Precisa usar a setinha (revisão da Unidade 1) E chegar na section pela trilha.
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "evento", evento: "inspecionou" },
          { tipo: "selecionado", seletor: "#noticias", via: "trilha" },
        ],
      },
      ajudas: {
        // No sozinho, a ajuda para no conceito: nada de apontar onde clicar.
        pergunta: "Qual caixa guarda as três notícias, uma do lado da outra, e mais nada?",
        dica: "O pai é o andar logo acima. Suba de um em um na trilha e repare no que acende na tela a cada andar.",
      },
      falaAoConcluir: {
        texto: "A section é o pai das três notícias, e elas são filhas dela. Caixa dentro de caixa se chama aninhamento.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: "#noticia-feira h3", via: "inspecionar" },
        { tipo: "selecionar", seletor: "section", via: "trilha" },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Agora você anda pela família dos elementos: pai, filho e os andares de cima.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, a trilha fica no rodapé da aba Elements. Dá pra subir de andar em qualquer site.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Abra um site de notícias de verdade, aperte F12, use a setinha num título e olhe a trilha no rodapé da aba Elements. Clique nos nomes dela e veja qual caixa acende na página.",

  falaFinal: {
    texto: "Desafio extra: num site real, quantos andares tem entre um link e o body? Conta pra mim!",
    expressao: "curioso",
  },
};
