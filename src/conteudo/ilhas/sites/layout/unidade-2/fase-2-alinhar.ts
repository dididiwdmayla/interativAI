/*
 * L2, Fase 2: "Espalhar e alinhar" (Livraria Página Virada).
 *
 * O QUE ENSINA: justify-content (espalha ao longo da fila) e align-items
 * (alinha no sentido cruzado). Os cards (.livro-alto, .livro-medio,
 * .livro-baixo) têm alturas diferentes de propósito: sem align-items, o
 * flex estica todos (stretch, o padrão) do mesmo tamanho, e só depois de
 * center dá para ver a diferença de altura.
 *
 * ORDEM: primeiro flex no container de cards (revisão do conceito da
 * Fase 1, situação nova); depois justify-content com previsão (a
 * confusão: achar que ele alinha na vertical); o sozinho aplica
 * align-items numa ação direta, sem passo a passo prévio na mesma peça.
 *
 * REVISÃO ESPAÇADA: display: flex (Fase 1) revisitado num container novo;
 * display: block (L1) citado por contraste (os cards eram block, colados).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LIVRARIA_PAGINA_VIRADA } from "./sites/livrariaPaginaVirada";

export const FASE_L2_F2: FasePratica = {
  id: "sites-layout-u2-f2",
  tipo: "pratica",
  unidadeId: "sites-layout-u2",
  titulo: "Espalhar e alinhar",
  conceitos: ["justify-content", "align-items"],
  revisa: ["flexbox", "display-block"],
  prerequisitos: ["flexbox", "flex-direction"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Os cards de livro estão empilhados e colados na esquerda, como divs comuns. Bora deixar isso bonito?",
      expressao: "curioso",
    },
  ],
  siteAlvo: LIVRARIA_PAGINA_VIRADA,
  objetivos: [
    {
      id: "cards-vira-flex",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Selecione a div com class cards e dê display: flex a ela.",
        toque: "Selecione a div com class cards e dê display: flex a ela.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".cards", propriedade: "display", valor: "flex" },
      ajudas: {
        pergunta: "Qual display transforma os cards, que hoje são block empilhados, numa fila?",
        dica: "flex, na regra .cards (o pai dos três livros), como você fez com o menu na fase passada.",
        linha: { alvo: "arvore", seletor: ".cards", fala: "É esta div, .cards, que guarda os três livros." },
        solucao: {
          fala: "Dei display: flex a .cards: os três livros, que eram block, viraram uma fila.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "display", valor: "flex" }],
        },
      },
      falaAoConcluir: {
        texto: "Já eram block, colados na esquerda; agora flex, em fila. Mas ainda sem espaço entre eles.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "display", valor: "flex" }],
    },
    {
      id: "justify-content-espalha",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você der justify-content: space-between ao .cards, o que acontece com os três livros?",
        opcoes: [
          "Ficam um em cima do outro",
          "Espalham na fila: primeiro e último nas pontas, espaço igual no meio",
          "Ficam alinhados no centro da altura da caixa",
        ],
        correta: 1,
        explicacao: "justify-content espalha os filhos AO LONGO da fila (o mesmo sentido do flex-direction), não na altura.",
      },
      enunciado: {
        mouse: "Confira: dê justify-content: space-between ao .cards.",
        toque: "Confira: dê justify-content: space-between ao .cards.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".cards", propriedade: "justify-content", valor: "space-between" },
      ajudas: {
        pergunta: "Qual declaração espalha os filhos ao longo da fila de um flex container?",
        dica: "justify-content. space-between deixa o primeiro e o último nas pontas, com o espaço igual entre os do meio.",
        linha: { alvo: "estilos", seletorRegra: ".cards", fala: "Acrescente justify-content: space-between nesta regra, .cards." },
        solucao: {
          fala: "Acrescentei justify-content: space-between: os livros se espalharam, um em cada ponta.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "justify-content", valor: "space-between" }],
        },
      },
      falaAoConcluir: {
        texto: "Espalhado! justify-content cuida do sentido da fila; para a altura, tem outra declaração.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "justify-content", valor: "space-between" },
      ],
    },
    {
      id: "align-items-centraliza",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Os livros têm alturas diferentes e ficam esticados do mesmo tamanho. Centralize-os na vertical com align-items: center no .cards.",
        toque: "Os livros têm alturas diferentes e ficam esticados do mesmo tamanho. Centralize-os na vertical com align-items: center no .cards.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".cards", propriedade: "align-items", valor: "center" },
      ajudas: {
        pergunta: "Qual declaração alinha os filhos no sentido CRUZADO da fila (a altura, quando a fila é horizontal)?",
        dica: "align-items. Sem ela, o padrão é stretch: os filhos esticam para preencher a altura toda.",
      },
      falaAoConcluir: {
        texto: "Agora dá para ver as alturas diferentes de cada livro, todos centralizados na mesma linha.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "align-items", valor: "center" }],
    },
  ],
  conclusao: [
    {
      texto: "justify-content espalha ao longo da fila; align-items alinha no sentido cruzado. As duas bússolas do flex!",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, essas duas declarações resolvem a maioria dos pedidos de 'centralizar isso aqui'.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, ache uma barra com itens espalhados (como um cabeçalho com logo à esquerda e menu à direita) e veja o justify-content no Styles.",
  falaFinal: { texto: "Próxima fase: o espaço certo entre os cards, e o que fazer quando eles não cabem.", expressao: "feliz" },
};
