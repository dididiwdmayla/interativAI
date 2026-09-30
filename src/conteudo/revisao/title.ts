/*
 * Revisão: title (U6, Fase 1), no modo documento.
 *
 * Ação: trocar o título da aba de um site (situação nova: um nome genérico);
 * previsão: onde o title aparece.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_TITLE: ItemRevisao[] = [
  {
    id: "title-1",
    conceito: "title",
    tipo: "acao",
    enunciado: {
      mouse: "A aba está dizendo 'Documento sem título'. Troque o title para 'Padaria Grão Dourado'.",
      toque: "A aba está dizendo 'Documento sem título'. Troque o title para 'Padaria Grão Dourado'.",
    },
    siteAlvo: {
      url: "padariagraodourado.exemplo",
      titulo: "Padaria Grão Dourado",
      head: cabecaComTitulo("Documento sem título"),
      body: `<h1>Padaria Grão Dourado</h1>
<p>Pão quentinho às 6h.</p>`,
    },
    modoDocumento: true,
    validador: { tipo: "tituloDaAba", valor: "Padaria Grão Dourado" },
    ajudas: {
      pergunta: "Qual tag do head dá o nome que aparece na aba?",
      dica: "A tag title, dentro do head. Dois cliques no texto dela, na árvore, e escreva o novo nome.",
    },
    solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: "Padaria Grão Dourado" }],
  },
  {
    id: "title-2",
    conceito: "title",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda e confira na aba.",
      toque: "Responda e confira na aba.",
    },
    siteAlvo: {
      url: "casadecha.exemplo",
      titulo: "Casa de Chá Lótus",
      head: cabecaComTitulo("Casa de Chá Lótus | Bem-vindo"),
      body: `<h1>Casa de Chá Lótus</h1>
<p>Chás do mundo todo.</p>`,
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Se você mudar o texto do title, o que muda na tela?",
      opcoes: ["O nome que aparece na aba", "O título grande da página", "A cor da página"],
      correta: 0,
      explicacao: "O title dá o nome da aba do navegador. O título grande da página é outra peça, o h1.",
    },
    ajudas: {
      pergunta: "O title é o nome da aba ou o título grande da página?",
      dica: "É o da aba. O título grande é o h1, no body.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
