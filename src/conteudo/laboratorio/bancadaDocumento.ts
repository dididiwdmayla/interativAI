/*
 * Bancada do documento: uma fase de LABORATÓRIO do motor, fora do
 * currículo (só no /lab/fases, e direto por /lab/fases?fase=<id>).
 *
 * Serve para testar o modo documento (o editor com o documento inteiro, a
 * árvore começando no <html>, a aba do navegador com o <title> ao vivo e a
 * simulação dos acentos sem meta charset) e o "Adicionar atributo" do menu
 * do nó. É também o exemplo de fase com `modoDocumento` para quem for
 * escrever a U6 ("Página do zero").
 *
 * Não é conteúdo do jogo: não entra em UNIDADES nem em FASES, não conta
 * progresso e não é publicada. As checagens da fábrica rodam nela mesmo
 * assim (testes/conteudo/documento.test.ts).
 */
import type { FasePratica } from "../tipos";

export const SITE_BANCADA_DOCUMENTO = {
  url: "cartao.motor.site",
  titulo: "Bancada do documento",
  // Sem <meta charset>: a prévia começa com os acentos quebrados (simulação).
  head: `<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Meu cartão</title>
<style>
  body { font-family: Georgia, serif; margin: 24px; color: #2b2d42; }
  a { color: #d62828; }
</style>`,
  body: `<h1>Cartão de visita</h1>
<p>Olá! Eu sou a Ana, ilustradora de São Paulo.</p>
<a href="https://exemplo.site/portfolio">Veja o portfólio</a>`,
};

export const FASE_BANCADA_DOCUMENTO: FasePratica = {
  id: "lab-motor-u1-f2",
  tipo: "pratica",
  unidadeId: "lab-motor-u1",
  titulo: "Bancada do documento",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["arvore", "editor", "editar-duplo-clique", "adicionar-atributo"],
  modoDocumento: true,
  introducao: [{ texto: "Bancada do documento: aqui o editor mostra a página inteira, com o head.", expressao: "curioso" }],
  siteAlvo: SITE_BANCADA_DOCUMENTO,
  objetivos: [
    {
      id: "meta-charset",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: 'Os acentos estão quebrados. No editor, escreva <meta charset="utf-8"> no começo do head.',
        toque: 'Os acentos estão quebrados. No editor, escreva <meta charset="utf-8"> no começo do head.',
      },
      validador: { tipo: "existe", seletor: "head > meta[charset]" },
      ajudas: {
        pergunta: "Onde o navegador descobre como ler as letras da página?",
        dica: "Uma linha no head diz a codificação: meta charset.",
        linha: { alvo: "arvore", seletor: "head", fala: "É aqui dentro, no head." },
        solucao: {
          fala: 'Escrevi <meta charset="utf-8"> no começo do head: os acentos voltaram.',
          acoes: [{ tipo: "inserirHTML", seletor: "head", posicao: "inicio", html: '<meta charset="utf-8">' }],
        },
      },
      falaAoConcluir: { texto: "Acentos no lugar!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "head", posicao: "inicio", html: '<meta charset="utf-8">' }],
    },
    {
      id: "titulo-da-aba",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Troque o título da aba para Cartão da Ana.",
        toque: "Troque o título da aba para Cartão da Ana.",
      },
      validador: { tipo: "tituloDaAba", valor: "Cartão da Ana" },
      ajudas: {
        pergunta: "Qual peça do head vira o nome da aba?",
        dica: "É o texto do title, dentro do head.",
        linha: { alvo: "arvore", seletor: "title", parte: "texto", fala: "Este é o texto do title." },
        solucao: {
          fala: "Troquei o texto do title: a aba mudou junto.",
          acoes: [{ tipo: "definirTexto", seletor: "title", valor: "Cartão da Ana" }],
        },
      },
      falaAoConcluir: { texto: "Olha a aba lá em cima!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: "Cartão da Ana" }],
    },
    {
      id: "atributo-novo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: 'Faça o link abrir numa aba nova: clique com o botão direito nele, Adicionar atributo, target="_blank".',
        toque: 'Faça o link abrir numa aba nova: toque e segure nele, Adicionar atributo, target="_blank".',
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "a", nome: "target", valor: "_blank" },
          { tipo: "evento", evento: "adicionouAtributo" },
        ],
      },
      apresentar: ["adicionar-atributo"],
      ajudas: {
        pergunta: "O link tem algum atributo que diga onde ele abre?",
        dica: "Um atributo novo se escreve inteiro: nome, igual e valor entre aspas.",
        linha: { alvo: "arvore", seletor: "a", fala: "É neste link que o atributo entra." },
        solucao: {
          fala: 'Pus target="_blank" no link: ele abriria numa aba nova.',
          acoes: [{ tipo: "adicionarAtributo", seletor: "a", nome: "target", valor: "_blank" }],
        },
      },
      falaAoConcluir: { texto: "Atributo novo no link!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: "a", nome: "target", valor: "_blank" }],
    },
  ],
  conclusao: [{ texto: "Bancada do documento testada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo no documento.", expressao: "feliz" },
};
