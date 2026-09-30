/*
 * Revisão: link de âncora (U4, Fase 1).
 *
 * Ação: clicar num link com # e ver a página rolar; previsão: um # sai da página?
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_LINK_ANCORA: ItemRevisao[] = [
  {
    id: "link-ancora-1",
    conceito: "link-ancora",
    tipo: "acao",
    enunciado: {
      mouse: "Clique no link 'Onde fica' do menu e veja a página rolar até a seção.",
      toque: "Toque no link 'Onde fica' do menu e veja a página rolar até a seção.",
    },
    siteAlvo: {
      url: "casadeshowluar.exemplo",
      titulo: "Casa de Shows Luar",
      head: HEAD_MINI,
      body: `<nav><a href="#onde">Onde fica</a></nav>
<h2>Programação</h2>
<p>Toda sexta, a partir das 21h.</p>
<p>Ingressos na portaria.</p>
<h2 id="onde">Onde fica</h2>
<p>Rua do Porto, 88.</p>`,
    },
    validador: { tipo: "evento", evento: "clicouLink", href: "#onde" },
    ajudas: {
      pergunta: "O menu tem um link para uma parte da própria página. Qual?",
      dica: "O link 'Onde fica', no menu do topo: o href dele começa com #.",
    },
    solucaoDeTeste: [{ tipo: "clicarLink", seletor: "a[href=\"#onde\"]" }],
  },
  {
    id: "link-ancora-2",
    conceito: "link-ancora",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o href do link.",
      toque: "Responda olhando o href do link.",
    },
    siteAlvo: {
      url: "papelariacantodoclipe.exemplo",
      titulo: "Papelaria Canto do Clipe",
      head: HEAD_MINI_ESCURO,
      body: `<a href="#contato">Falar com a loja</a>
<h2>Cadernos</h2>
<p>Capas duras e brochuras.</p>
<h2 id="contato">Contato</h2>
<p>loja@cantodoclipe.exemplo</p>`,
    },
    previsao: {
      pergunta: "O link tem href='#contato'. O que acontece quando alguém clica nele?",
      opcoes: ["Abre outro site", "A página rola até o elemento com id contato", "Abre uma aba em branco"],
      correta: 1,
      explicacao: "Um href com # não sai da página: ele rola até o elemento que tem aquele id.",
    },
    ajudas: {
      pergunta: "O # no começo do href leva para dentro ou para fora da página?",
      dica: "Para dentro: ele procura o elemento com o id depois do #.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
