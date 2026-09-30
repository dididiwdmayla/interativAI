/*
 * Revisão: head e body (U6, Fase 1), no modo documento.
 *
 * Ação: uma informação sobre a página (o autor) vai no head; previsão: o que o head
 * mostra na página (nada: só a aba e o navegador).
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_HEAD_VS_BODY: ItemRevisao[] = [
  {
    id: "head-vs-body-1",
    conceito: "head-vs-body",
    tipo: "acao",
    enunciado: {
      mouse: 'Registre o autor da página no head: escreva <meta name="author" content="Bia"> dentro do head.',
      toque: 'Registre o autor da página no head: escreva <meta name="author" content="Bia"> dentro do head.',
    },
    siteAlvo: {
      url: "blogdabia.exemplo",
      titulo: "Blog da Bia",
      head: cabecaComTitulo("Blog da Bia"),
      body: `<h1>Blog da Bia</h1>
<p>Receitas e viagens.</p>`,
    },
    modoDocumento: true,
    validador: { tipo: "existe", seletor: "head meta[name=\"author\"]" },
    ajudas: {
      pergunta: "Uma informação SOBRE a página (não para mostrar na tela) vai no head ou no body?",
      dica: "No head. Escreva a meta logo depois do title, dentro do head.",
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: "<meta name=\"author\" content=\"Bia\">" }],
  },
  {
    id: "head-vs-body-2",
    conceito: "head-vs-body",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o head e o body.",
      toque: "Responda olhando o head e o body.",
    },
    siteAlvo: {
      url: "oficinadocarlao.exemplo",
      titulo: "Oficina do Carlão",
      head: cabecaComTitulo("Oficina do Carlão"),
      body: `<h1>Oficina do Carlão</h1>
<p>Revisão de freios.</p>`,
    },
    modoDocumento: true,
    previsao: {
      pergunta: "O title 'Oficina do Carlão' está no head. Ele aparece escrito dentro da página, na tela?",
      opcoes: ["Sim, no topo da página", "Sim, no rodapé", "Não, só na aba do navegador"],
      correta: 2,
      explicacao: "O head guarda informação sobre a página. O que aparece na tela mora no body.",
    },
    ajudas: {
      pergunta: "O que aparece na tela mora no head ou no body?",
      dica: "No body. O head é para informações da página, como o título da aba.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
