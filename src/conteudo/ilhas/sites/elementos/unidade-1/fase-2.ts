/*
 * Unidade 1, Fase 2: "Agora sem rodinhas".
 *
 * O QUE TREINA: nada de novo (`conceitos` vazio). É a primeira vez que o
 * jogador faz as 4 habilidades da Fase 1 SOZINHO, sem os quatro degraus
 * de ajuda. Por isso elas moram em `pratica` ("já foi ensinado antes, aqui
 * é treino"), e a fase não tem objetivo guiado nem previsão guiada (regra
 * da fase só de sozinho, conferida pelo testar:conteudo).
 *
 * POR QUE UMA FASE SEPARADA: o formato padrão (Unidade 2) põe o guiado e o
 * sozinho da mesma habilidade na mesma fase. Aqui é a exceção: a Fase 1 já
 * estava publicada e congelada (src/conteudo/publicados.json), então o
 * sozinho veio numa fase nova, logo depois dela.
 *
 * REVISÃO ESPAÇADA: `elemento`, `tag` e `codigo-html` (o vocabulário da
 * Fase 1) voltam em `revisa`, sem aviso — o jogador só usa de novo.
 *
 * POR QUE ESTA ORDEM: a mesma da Fase 1 (árvore, setinha, texto, código),
 * mas cada uma numa peça e numa página diferentes (a página de encomendas
 * da mesma padaria), para o jogador decidir de novo, e não decorar o
 * caminho.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_PADARIA_ENCOMENDAS } from "./sites/padariaEncomendas";

const SABOR_NOVO = "Sonho de creme";

export const FASE_U1_F2: FasePratica = {
  id: "sites-elementos-u1-f2",
  tipo: "pratica",
  unidadeId: "sites-elementos-u1",
  titulo: "Agora sem rodinhas",
  conceitos: [],
  pratica: ["selecionar-pela-arvore", "modo-inspecionar", "editar-texto", "lista-e-itens"],
  revisa: ["elemento", "tag", "codigo-html"],
  prerequisitos: ["selecionar-pela-arvore", "modo-inspecionar", "editar-texto", "lista-e-itens"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"],
  siteAlvo: SITE_PADARIA_ENCOMENDAS,

  introducao: [
    {
      texto: "A padaria abriu uma página novinha, só de encomendas. Bora ver o que tem de diferente?",
      expressao: "feliz",
    },
    {
      texto: "Agora é sua vez de decidir sozinho: nada de eu apontar onde clicar. Confio em você!",
      expressao: "pensativo",
    },
    {
      texto: "Se travar, o Me ajuda ainda te dá uma pergunta e uma dica. Bora?",
      expressao: "curioso",
    },
  ],

  objetivos: [
    {
      id: "achar-sabores-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Pela árvore, ache o título que fala dos sabores de hoje.",
        toque: "Pela árvore, ache o título que fala dos sabores de hoje.",
      },
      validador: { tipo: "selecionado", seletor: "h2", via: "arvore" },
      ajudas: {
        pergunta: "Qual peça da árvore costuma anunciar uma lista, um andar acima dela?",
        dica: "Um título de seção geralmente vem logo antes da lista que ele apresenta.",
      },
      falaAoConcluir: {
        texto: "Achou sem ajuda! A árvore continua sendo o mapa de todas as peças.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "selecionar", seletor: "h2" }],
    },
    {
      id: "inspecionar-sabor",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Use a setinha do modo inspecionar num sabor da lista, direto na tela.",
        toque: "Use a setinha do modo inspecionar num sabor da lista, direto na tela.",
      },
      validador: { tipo: "selecionado", seletor: ".sabores li", via: "inspecionar" },
      ajudas: {
        pergunta: "Em vez de procurar na árvore, como você aponta direto pra peça na tela?",
        dica: "A ferramenta que faz o caminho da tela para o código é a mesma da Fase 1.",
      },
      falaAoConcluir: {
        texto: "Isso! A setinha funciona em qualquer peça da tela, não só no botão.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "selecionar", seletor: ".sabores li", via: "inspecionar" }],
    },
    {
      id: "trocar-sabor",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Dê dois cliques num sabor da lista e troque o nome dele por outro doce.",
        toque: "Dê dois toques num sabor da lista (ou toque em Editar) e troque por outro doce.",
      },
      validador: { tipo: "textoDiferenteDoInicial", seletor: ".sabores li" },
      ajudas: {
        pergunta: "Qual gesto na árvore deixa um texto pronto para ser trocado?",
        dica: "É o mesmo dos dois cliques na manchete: dois cliques no texto, escreve e confirma.",
      },
      falaAoConcluir: {
        texto: "Sabor novo no cardápio! Editar texto funciona em qualquer peça, não só na manchete.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: ".sabores li", valor: "Torta de limão" }],
    },
    {
      id: "novo-sabor-pelo-codigo",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora pelo código: adicione um sabor novo na lista.",
        toque: "Agora pelo código: adicione um sabor novo na lista.",
      },
      validador: { tipo: "contagem", seletor: "ul.sabores > li", op: ">", valor: 3, comTexto: true },
      ajudas: {
        pergunta: "No código, cada sabor da lista se repete com qual tag?",
        dica: "Cada sabor é um li dentro do ul, igual aos produtos da Fase 1.",
      },
      falaAoConcluir: {
        texto: "Cardápio maior! Você criou uma peça nova do zero, sem ajuda nenhuma.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "inserirHTML", seletor: "ul.sabores", posicao: "fim", html: `<li>${SABOR_NOVO}</li>` },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Fez tudo sem passo a passo! Árvore, setinha, texto e código, tudo funcionando na sua cabeça agora.",
      expressao: "comemorando",
    },
    {
      texto: "Guarda essas quatro: elas abrem qualquer site que você quiser mexer.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Escolha outro site de verdade (que não seja o de hoje), aperte F12 e repita as quatro coisas: ache uma peça pela árvore, use a setinha, edite um texto com dois cliques. Só você vê, e some ao recarregar.",

  falaFinal: {
    texto: "Agora vem o desafio: um site novo, sem passo a passo nenhum. Topa?",
    expressao: "curioso",
  },
};
