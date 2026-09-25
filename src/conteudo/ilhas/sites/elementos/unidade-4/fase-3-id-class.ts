/*
 * Unidade 4, Fase 3: "Id é um, class é vários".
 *
 * O QUE ENSINA: id identifica UMA peça só na página inteira; class pode se
 * repetir em várias peças parecidas. Ataca a confusão "id e class são a
 * mesma coisa" com uma previsão sobre id duplicado.
 *
 * ATENÇÃO DE MOTOR: os cards do Bruno e da Carla ainda não têm class
 * nenhuma, e a árvore só edita atributo que já existe. Por isso o
 * primeiro objetivo escreve a class pelo código, não pela árvore.
 *
 * REVISÃO ESPAÇADA: duplicar elemento (Unidade 2) volta no objetivo
 * sozinho: duplicar um integrante e ver que a class copiada continua
 * funcionando.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, previsão: antes de arrumar os cards, o jogador aposta o que
 *    aconteceria se dois deles tivessem o mesmo id. A resposta certa
 *    explica por que os cards usam CLASS (repetível), e não id, para
 *    serem tratados juntos. A ação de confirmar já é a correta: dar a
 *    mesma class aos dois cards que ainda não têm.
 * 2. Sozinho: duplica um integrante (revisão) e confere que a cópia leva
 *    a class junto, sem precisar adicionar de novo.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_CORAL } from "./sites/coralVozesDaVila";

export const FASE_U4_F3: FasePratica = {
  id: "sites-elementos-u4-f3",
  tipo: "pratica",
  unidadeId: "sites-elementos-u4",
  titulo: "Id é um, class é vários",
  conceitos: ["id-unico", "class-repetivel"],
  revisa: ["duplicar-elemento"],
  prerequisitos: ["editar-atributo", "codigo-html"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "editar-duplo-clique", "editor", "sincronia", "duplicar"],
  siteAlvo: SITE_CORAL,

  introducao: [
    { texto: "Só o card da Ana tem o estilo de integrante. Bruno e Carla ficaram de fora!", expressao: "feliz" },
    { texto: "Id e class parecem parecidos, mas são bem diferentes: um é único, o outro se repete à vontade.", expressao: "pensativo" },
    { texto: "Vamos entender a diferença e arrumar os três cards.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "prever-id-duplicado",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: e se a gente desse o MESMO id pros três cards de integrante, em vez de uma class?",
        opcoes: [
          "Nada acontece, os três funcionam normalmente",
          "O navegador só reconhece um id por vez, e quem busca por ele pode achar o errado",
          "A página para de funcionar totalmente",
        ],
        correta: 1,
        explicacao: "Id deveria ser único. Com três iguais, quem busca por aquele id (como um seletor #id) só acha o primeiro, e o resto vira bagunça.",
      },
      enunciado: {
        mouse: "Agora arrume direito: os cards do Bruno e da Carla ainda não têm class. Escreva class=\"integrante\" pelo código nos dois.",
        toque: "Agora arrume direito: os cards do Bruno e da Carla ainda não têm class. Escreva class=\"integrante\" pelo código nos dois.",
      },
      validador: { tipo: "contagem", seletor: ".integrante", op: ">=", valor: 3 },
      ajudas: {
        pergunta: "Os três cards precisam do MESMO estilo. Isso pede um id (único) ou uma class (repetível)?",
        dica: "Class é feita pra se repetir em várias peças parecidas. Como esses cards ainda não têm class, escreva ela pelo código.",
        linha: { alvo: "editor", seletor: "#integrante-bruno", fala: "Essa é a linha do card do Bruno. Escreva class=\"integrante\" dentro da tag article, antes do >." },
        solucao: {
          fala: "Escrevi class=\"integrante\" pelo código nos dois cards: agora os três têm o mesmo estilo, sem repetir id.",
          acoes: [
            { tipo: "definirAtributo", seletor: "#integrante-bruno", nome: "class", valor: "integrante" },
            { tipo: "definirAtributo", seletor: "#integrante-carla", nome: "class", valor: "integrante" },
          ],
        },
      },
      falaAoConcluir: { texto: "Isso! Class repete à vontade; id fica sozinho, um por página.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirAtributo", seletor: "#integrante-bruno", nome: "class", valor: "integrante" },
        { tipo: "definirAtributo", seletor: "#integrante-carla", nome: "class", valor: "integrante" },
      ],
    },
    {
      id: "duplicar-integrante",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Duplique um integrante e dê um nome novo à cópia.",
        toque: "Duplique um integrante e dê um nome novo à cópia.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: ".integrante", op: ">=", valor: 4 },
          { tipo: "textoDiferenteDoInicial", seletor: ".integrante h3" },
        ],
      },
      ajudas: {
        pergunta: "Se você duplicar um card que já tem a class certa, a cópia também tem?",
        dica: "Duplicar copia tudo, inclusive atributos como class. Só o texto do nome você troca.",
      },
      falaAoConcluir: { texto: "Viu? A cópia já nasceu com a class certa: duplicar copia tudo.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "duplicar", seletor: "#integrante-ana" },
        { tipo: "definirTexto", seletor: "$0 h3", valor: "Duda" },
      ],
    },
  ],

  conclusao: [
    { texto: "Id identifica uma peça só; class agrupa várias parecidas. Os dois têm seu lugar.", expressao: "comemorando" },
    { texto: "No F12 de verdade, o CSS usa #id pra um estilo único e .class pra um estilo repetido.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e compare: quais elementos têm id (únicos, como um cabeçalho) e quais têm class (repetidos, como cards de produto)?",

  falaFinal: {
    texto: "Desafio extra: um elemento pode ter id E class ao mesmo tempo. Ache um assim num site real!",
    expressao: "curioso",
  },
};
