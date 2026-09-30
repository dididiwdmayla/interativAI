/*
 * Revisão: remover do documento (U2, Fase 2).
 *
 * O par do esconder: apagar tira o espaço. Um anúncio no meio de uma
 * receita e um pop-up; a previsão pergunta se o de baixo sobe (sobe).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_REMOVER_DO_DOCUMENTO: ItemRevisao[] = [
  {
    id: "remover-do-documento-1",
    conceito: "remover-do-documento",
    tipo: "acao",
    enunciado: {
      mouse: "Apague de vez o anúncio que atrapalha a receita (tecla Delete ou o menu do nó).",
      toque: "Apague de vez o anúncio que atrapalha a receita (segure o nó e escolha Apagar).",
    },
    siteAlvo: {
      url: "blogdereceitas.exemplo",
      titulo: "Blog Panela Cheia",
      head: HEAD_MINI,
      body:
        '<h1>Bolo de fubá</h1>\n<p>Misture tudo no liquidificador.</p>\n<div class="anuncio cartao">COMPRE JÁ! Oferta imperdível!</div>\n<p>Asse por 40 minutos.</p>',
    },
    validador: { tipo: "naoExiste", seletor: ".anuncio" },
    ajudas: {
      pergunta: "Qual ferramenta tira a peça da página e deixa o resto subir?",
      dica: "Apagar: selecione o anúncio e aperte Delete, ou use o menu do nó.",
    },
    solucaoDeTeste: [{ tipo: "apagar", seletor: ".anuncio" }],
  },
  {
    id: "remover-do-documento-2",
    conceito: "remover-do-documento",
    tipo: "previsao",
    enunciado: {
      mouse: "Agora faça: apague o pop-up e veja o que acontece com o resto.",
      toque: "Agora faça: apague o pop-up e veja o que acontece com o resto.",
    },
    siteAlvo: {
      url: "jornaldacidade.exemplo",
      titulo: "Jornal da Cidade",
      head: HEAD_MINI_ESCURO,
      body: '<div class="popup cartao">Assine a nossa newsletter!</div>\n<h1>Ponte nova inaugurada</h1>\n<p>A obra levou dois anos.</p>',
    },
    previsao: {
      pergunta: "Se você apagar o pop-up, o título de baixo sobe para ocupar o lugar dele?",
      opcoes: ["Sim, o lugar dele some", "Não, fica um buraco"],
      correta: 0,
      explicacao: "Apagar tira a peça do documento: o espaço some junto, e o que vinha depois sobe.",
    },
    validador: { tipo: "naoExiste", seletor: ".popup" },
    ajudas: {
      pergunta: "Apagar guarda o espaço da peça ou não?",
      dica: "Não guarda. Selecione o pop-up e aperte Delete para ver o título subir.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 0 },
      { tipo: "apagar", seletor: ".popup" },
    ],
  },
];
