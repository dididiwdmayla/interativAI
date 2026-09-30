/*
 * Revisão: simulação sem viewport (R1, Fase 2), no modo documento.
 *
 * Ação: ver a página de 980px no celular e consertar com a meta; previsão: a largura
 * que o celular usa sem ela.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_SIMULACAO_SEM_VIEWPORT: ItemRevisao[] = [
  {
    id: "simulacao-sem-viewport-1",
    conceito: "simulacao-sem-viewport",
    tipo: "acao",
    enunciado: {
      mouse: "Ligue o Celular 390 (a página vem pequenininha, sem viewport) e conserte acrescentando a meta viewport.",
      toque: "Ligue o Celular 390 (a página vem pequenininha, sem viewport) e conserte acrescentando a meta viewport.",
    },
    siteAlvo: {
      url: "restaurantedalua.exemplo",
      titulo: "Restaurante da Lua",
      head: "<meta charset=\"utf-8\">\n<title>Restaurante da Lua</title>\n" + HEAD_MINI,
      body: `<h1>Restaurante da Lua</h1>
<p>Massas e risotos.</p>`,
    },
    modoDocumento: true,
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "dispositivo", largura: 390 },
        { tipo: "existe", seletor: "head meta[name=\"viewport\"]" },
      ],
    },
    ajudas: {
      pergunta: "Por que a página aparece minúscula no celular sem a meta viewport?",
      dica: "Ele desenha em 980px e encolhe. Ligue o dispositivo e escreva a meta viewport no head.",
    },
    solucaoDeTeste: [
      { tipo: "trocarDispositivo", modelo: "celular-390" },
      { tipo: "inserirHTML", seletor: "title", posicao: "depois", html: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" },
    ],
  },
  {
    id: "simulacao-sem-viewport-2",
    conceito: "simulacao-sem-viewport",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando num celular sem a meta viewport.",
      toque: "Responda pensando num celular sem a meta viewport.",
    },
    siteAlvo: {
      url: "estudiovivoarte.exemplo",
      titulo: "Estúdio Vivo Arte",
      head: "<meta charset=\"utf-8\">\n<title>Estúdio Vivo Arte</title>\n" + HEAD_MINI_ESCURO,
      body: `<h1>Estúdio Vivo Arte</h1>
<p>Oficinas de pintura.</p>`,
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Sem meta viewport, o celular desenha a página como se a tela tivesse quantos px?",
      opcoes: ["390px, o tamanho real da tela", "320px, o menor possível", "980px, e encolhe tudo para caber"],
      correta: 2,
      explicacao: "Sem o meta viewport, o navegador do celular desenha a página como se a tela tivesse 980px de largura e encolhe: fica pequeno e difícil de tocar.",
    },
    ajudas: {
      pergunta: "Sem a meta, o celular usa a largura real da tela ou uma maior?",
      dica: "Uma maior: 980px, que depois é encolhida.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
