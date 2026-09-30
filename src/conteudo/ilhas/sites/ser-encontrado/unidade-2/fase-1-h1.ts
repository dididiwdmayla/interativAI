/*
 * S2, Fase 1: "Um h1 que diz do que trata" (Barbearia Navalha de Ouro).
 *
 * O QUE ENSINA: o h1 da página: um só, com a etiqueta de título (não uma
 * div que só parece título), dizendo do que a página trata. A busca e o
 * leitor de tela se orientam por ele.
 *
 * REVISA: a hierarquia de títulos (U3), agora com o motivo da busca: depois
 * do h1 vem o h2, e o segundo h1 vira h2. E renomear a tag pela árvore.
 *
 * ORDEM: 1) guiado, com previsão: a confusão "o tamanho da letra faz título"
 * primeiro, depois trocar a div do nome por h1; 2) sozinho: a página
 * ficou com dois h1, e o jogador escolhe qual fica e qual desce para h2.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { BARBEARIA_NAVALHA_DE_OURO } from "./sites/barbeariaNavalhaDeOuro";

export const FASE_S2_F1: FasePratica = {
  id: "sites-ser-encontrado-u2-f1",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u2",
  titulo: "Um h1 que diz do que trata",
  conceitos: ["h1-da-pagina"],
  revisa: ["titulos-hierarquia"],
  prerequisitos: ["titulos-hierarquia", "titulo-na-busca"],
  usaFerramentas: ["arvore", "renomear-tag"],
  siteAlvo: BARBEARIA_NAVALHA_DE_OURO,
  introducao: [
    { texto: "Agora o SEO dentro da página. SEO é o nome do trabalho de deixar uma página fácil de achar e de entender.", expressao: "curioso" },
    { texto: "Não é truque: é, na maior parte, fazer a página boa para quem lê. Vamos começar pelo título principal.", expressao: "pensativo" },
    { texto: "A Barbearia Navalha de Ouro tem um nome bonito na tela. Mas a busca enxerga isso como título?", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "nome-vira-h1",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O nome da barbearia está em letra grande e dourada. Para a busca, isso já faz dele o título principal?",
        opcoes: ["Sim, a busca mede o tamanho da letra", "Não, a busca lê a etiqueta (h1), não o tamanho", "Só se a cor for escura"],
        correta: 1,
        explicacao: "Letra grande é só a aparência. Quem diz que algo é título é a etiqueta: h1 é o título principal. Sem ela, é só um texto grande.",
      },
      enunciado: {
        mouse: "O nome da barbearia é uma div. Renomeie a tag dele (dois cliques no nome da tag, na árvore) para h1.",
        toque: "O nome da barbearia é uma div. Renomeie a tag dele (toque na tag, na árvore) para h1.",
      },
      validador: { tipo: "tag", seletor: "#nome", nome: "h1" },
      ajudas: {
        pergunta: "Qual peça da página deveria ser o título, e que etiqueta ela tem hoje?",
        dica: "h1 é o título principal: um por página, dizendo do que ela trata. Dois cliques no nome da tag, na árvore, trocam ela sem perder o texto.",
        linha: { alvo: "arvore", seletor: "#nome", fala: "Este é o nome da barbearia: hoje uma div. Renomeie a tag para h1." },
        solucao: {
          fala: "Troquei a div por h1: o texto e o visual ficaram, mas agora a página diz de verdade do que ela trata.",
          acoes: [{ tipo: "renomearTag", seletor: "#nome", novaTag: "h1" }],
        },
      },
      falaAoConcluir: {
        texto: "Agora o nome é o h1. No F12 de verdade é igual: na aba Elementos, dois cliques no nome da tag e digite outra.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "renomearTag", seletor: "#nome", novaTag: "h1" },
      ],
    },
    {
      id: "um-h1-so",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "A página ficou com dois h1. Deixe o nome da barbearia como h1 e a promoção como h2, sem pular nível.",
        toque: "A página ficou com dois h1. Deixe o nome da barbearia como h1 e a promoção como h2, sem pular nível.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#nome", nome: "h1" },
          { tipo: "tag", seletor: "#promo", nome: "h2" },
          { tipo: "contagem", seletor: "h1", op: "==", valor: 1 },
        ],
      },
      ajudas: {
        pergunta: "Se a página tem dois títulos principais, qual dos dois diz do que ela trata?",
        dica: "Um h1 só por página. O outro título desce um nível: h2, logo abaixo do h1, antes do h3.",
      },
      falaAoConcluir: { texto: "Um h1 só e os títulos em ordem: h1, h2, h3. A busca e o leitor de tela entendem o mapa da página.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#promo", novaTag: "h2" }],
    },
  ],
  conclusao: [
    { texto: "O h1 diz do que a página trata, e só existe um. Os outros títulos descem em ordem, como capítulos.", expressao: "feliz" },
    { texto: "Quem lê, quem usa leitor de tela e a busca se orientam pelo mesmo mapa. Na próxima, o texto que a pessoa veio ler.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Abra um site que você usa, aperte F12 e, na aba Elementos, procure a tag h1. Tem só um? Ele diz do que a página trata? Confira também os h2 que vêm depois.",
  falaFinal: { texto: "Próxima fase: um texto que responde o que a pessoa busca.", expressao: "feliz" },
};
