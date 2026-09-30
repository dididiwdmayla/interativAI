/*
 * Revisão: editar texto (U1, Fases 1 e 2).
 *
 * Dois textos que não são manchete (a fase trocou a manchete): um preço
 * pequeno no meio de um cartão e o nome de uma banda num cartaz. Qualquer
 * texto novo vale; o que se revisa é o gesto (dois cliques no texto).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_EDITAR_TEXTO: ItemRevisao[] = [
  {
    id: "editar-texto-1",
    conceito: "editar-texto",
    tipo: "acao",
    enunciado: {
      mouse: "Troque, pela árvore, o preço do corte de cabelo por qualquer outro valor.",
      toque: "Troque, pela árvore, o preço do corte de cabelo por qualquer outro valor.",
    },
    siteAlvo: {
      url: "barbeariatesoura.exemplo",
      titulo: "Barbearia Tesoura",
      head: HEAD_MINI,
      body: '<h1>Barbearia Tesoura</h1>\n<div class="cartao">\n  <h2>Corte de cabelo</h2>\n  <p class="preco">35 reais</p>\n</div>',
    },
    validador: { tipo: "textoDiferenteDoInicial", seletor: ".preco" },
    ajudas: {
      pergunta: "Onde mora o texto do preço na árvore?",
      dica: "Dentro do p do preço. Dois cliques bem em cima do texto deixam editar; Enter confirma.",
    },
    solucaoDeTeste: [{ tipo: "definirTexto", seletor: ".preco", valor: "29 reais" }],
  },
  {
    id: "editar-texto-2",
    conceito: "editar-texto",
    tipo: "acao",
    enunciado: {
      mouse: "Mude o nome da banda no cartaz para um nome inventado por você.",
      toque: "Mude o nome da banda no cartaz para um nome inventado por você.",
    },
    siteAlvo: {
      url: "showdesabado.exemplo",
      titulo: "Show de Sábado",
      head: HEAD_MINI_ESCURO,
      body: "<p>Sábado, 20h, na praça</p>\n<h1>Os Parafusos Soltos</h1>\n<p>Entrada gratuita.</p>",
    },
    validador: { tipo: "textoDiferenteDoInicial", seletor: "h1" },
    ajudas: {
      pergunta: "Qual peça mostra o nome da banda?",
      dica: "É o h1. Dois cliques no texto dele, na árvore, e escreva o nome novo.",
    },
    solucaoDeTeste: [{ tipo: "definirTexto", seletor: "h1", valor: "Banda do Quintal" }],
  },
];
