/*
 * Unidade 4, Fase 2: "Imagens que todo mundo entende".
 *
 * O QUE ENSINA: o atributo alt descreve a imagem em palavras; ele não
 * aparece na tela como legenda, é lido por quem usa leitor de tela e
 * aparece se a imagem não carregar. Ataca de frente a confusão "alt é
 * legenda".
 *
 * REVISÃO ESPAÇADA: editar atributo (fase 1 desta unidade) volta na
 * segunda imagem, numa seção diferente.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, previsão: antes de escrever o alt da foto do coral, o jogador
 *    aposta quem vê esse texto. A resposta certa desmonta a ideia de
 *    legenda.
 * 2. Sozinho: a mesma habilidade no ícone da seção de ingressos, sem
 *    previsão, decidindo sozinho o que escrever.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_CORAL } from "./sites/coralVozesDaVila";

export const FASE_U4_F2: FasePratica = {
  id: "sites-elementos-u4-f2",
  tipo: "pratica",
  unidadeId: "sites-elementos-u4",
  titulo: "Imagens que todo mundo entende",
  conceitos: ["imagem-alt"],
  revisa: ["editar-atributo"],
  prerequisitos: ["tag", "selecionar-pela-arvore"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "editar-duplo-clique"],
  siteAlvo: SITE_CORAL,

  introducao: [
    { texto: "O site do coral tem duas imagens sem descrição nenhuma.", expressao: "feliz" },
    { texto: "Toda img tem um alt: um texto que descreve o que ela mostra, pra quem não consegue ver.", expressao: "pensativo" },
    { texto: "Vamos escrever descrições de verdade, e descobrir quem lê esse texto.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "prever-quem-le-alt",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: quem vê o texto do alt de uma imagem?",
        opcoes: [
          "Todo mundo, ele aparece embaixo da imagem como legenda",
          "Quem usa leitor de tela, ou quando a imagem não carrega",
          "Só o dono do site, no código",
        ],
        correta: 1,
        explicacao: "O alt não aparece na tela como legenda. Um leitor de tela lê esse texto em voz alta, e ele também aparece no lugar da imagem se ela não carregar.",
      },
      enunciado: {
        mouse: "Agora escreva um alt de verdade pra essa imagem: descreva o que ela mostra.",
        toque: "Agora escreva um alt de verdade pra essa imagem: descreva o que ela mostra.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "#foto-coral", nome: "alt" },
          { tipo: "nao", validador: { tipo: "atributo", seletor: "#foto-coral", nome: "alt", valor: "" } },
        ],
      },
      ajudas: {
        pergunta: "Se você fechasse os olhos, o que precisaria ouvir pra saber o que essa imagem mostra?",
        dica: "O alt é um texto curto que descreve a imagem, como se você a explicasse por telefone.",
        linha: { alvo: "arvore", seletor: "#foto-coral", fala: "Essa é a foto do coral. Adicione o atributo alt com uma descrição." },
        solucao: {
          fala: "Escrevi 'Coral Vozes da Vila cantando em um palco de igreja': quem não vê a imagem agora sabe o que ela mostra.",
          acoes: [{ tipo: "definirAtributo", seletor: "#foto-coral", nome: "alt", valor: "Coral Vozes da Vila cantando em um palco de igreja" }],
        },
      },
      falaAoConcluir: { texto: "Isso! Alt não é legenda: é uma descrição pra quem não vê a imagem.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirAtributo", seletor: "#foto-coral", nome: "alt", valor: "Coral Vozes da Vila cantando em um palco de igreja" },
      ],
    },
    {
      id: "alt-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O ícone da seção de ingressos também não tem alt. Escreva uma descrição pra ele.",
        toque: "O ícone da seção de ingressos também não tem alt. Escreva uma descrição pra ele.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "#icone-ingressos", nome: "alt" },
          { tipo: "nao", validador: { tipo: "atributo", seletor: "#icone-ingressos", nome: "alt", valor: "" } },
        ],
      },
      ajudas: {
        pergunta: "O que esse desenho representa? Descreva em poucas palavras.",
        dica: "Um alt curto e direto já resolve: não precisa ser um texto longo.",
      },
      falaAoConcluir: { texto: "Perfeito! Agora as duas imagens fazem sentido pra quem não consegue vê-las.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#icone-ingressos", nome: "alt", valor: "Ícone de um ingresso" }],
    },
  ],

  conclusao: [
    { texto: "Agora toda imagem que você encontrar, você vai pensar: quem não está vendo isso?", expressao: "comemorando" },
    { texto: "No F12 de verdade, um leitor de tela para de ler o alt vazio de uma imagem sem descrição.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e ache uma imagem. Veja o alt dela na árvore: ele descreve o que a imagem mostra?",

  falaFinal: {
    texto: "Dica: se a imagem é só decoração (sem informação nenhuma), o alt pode ficar vazio (alt=\"\") de propósito.",
    expressao: "curioso",
  },
};
