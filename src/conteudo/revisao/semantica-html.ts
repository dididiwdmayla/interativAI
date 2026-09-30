/*
 * Revisão: HTML semântico (U5, Fase 1).
 *
 * Ação: trocar uma div por header (o significado, sem mudar o visual); previsão:
 * qual página é melhor para leitor de tela e busca.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_SEMANTICA_HTML: ItemRevisao[] = [
  {
    id: "semantica-html-1",
    conceito: "semantica-html",
    tipo: "acao",
    enunciado: {
      mouse: "A div do topo faz papel de cabeçalho. Troque a tag dela para header.",
      toque: "A div do topo faz papel de cabeçalho. Troque a tag dela para header.",
    },
    siteAlvo: {
      url: "agenciacorreio.exemplo",
      titulo: "Agência Correio Azul",
      head: HEAD_MINI,
      body: `<div id="topo">
  <h1>Agência Correio Azul</h1>
  <p>Envios para todo o país.</p>
</div>
<p>Atendemos de segunda a sábado.</p>`,
    },
    validador: { tipo: "tag", seletor: "#topo", nome: "header" },
    ajudas: {
      pergunta: "Qual tag diz que aquele bloco é o cabeçalho da página?",
      dica: "header. Dois cliques no nome da tag da div do topo, e troque.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#topo", novaTag: "header" }],
  },
  {
    id: "semantica-html-2",
    conceito: "semantica-html",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em quem usa leitor de tela.",
      toque: "Responda pensando em quem usa leitor de tela.",
    },
    siteAlvo: {
      url: "clubedoslivros.exemplo",
      titulo: "Clube dos Livros",
      head: HEAD_MINI_ESCURO,
      body: `<header><h1>Clube dos Livros</h1></header>
<main><p>Encontros mensais.</p></main>
<footer><p>Rua das Letras, 10</p></footer>`,
    },
    previsao: {
      pergunta: "Esta página usa header, main e footer. Na tela, o visual muda em relação a divs?",
      opcoes: ["Sim, ganha cores", "Não, mas leitor de tela e busca entendem melhor", "Sim, ela fica mais rápida"],
      correta: 1,
      explicacao: "As tags certas não mudam o visual, mas dizem o que cada parte é: leitor de tela, busca e quem lê o código depois agradecem.",
    },
    ajudas: {
      pergunta: "As tags semânticas mudam o visual ou o significado?",
      dica: "O significado. O visual continua vindo do CSS.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
