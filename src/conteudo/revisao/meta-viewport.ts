/*
 * Revisão: meta viewport (R1, Fase 2), no modo documento.
 *
 * Ação: acrescentar a linha que falta no head; previsão: o valor que faz o celular
 * usar a largura da tela.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI } from "./sites/estilos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_META_VIEWPORT: ItemRevisao[] = [
  {
    id: "meta-viewport-1",
    conceito: "meta-viewport",
    tipo: "acao",
    enunciado: {
      mouse: 'A página não tem meta viewport. Acrescente <meta name="viewport" content="width=device-width, initial-scale=1"> no head.',
      toque: 'A página não tem meta viewport. Acrescente <meta name="viewport" content="width=device-width, initial-scale=1"> no head.',
    },
    siteAlvo: {
      url: "padariatrigonovo.exemplo",
      titulo: "Padaria Trigo Novo",
      head: "<meta charset=\"utf-8\">\n<title>Padaria Trigo Novo</title>\n" + HEAD_MINI,
      body: `<h1>Padaria Trigo Novo</h1>
<p>Pão de fermentação natural.</p>`,
    },
    modoDocumento: true,
    validador: { tipo: "existe", seletor: "head meta[name=\"viewport\"]" },
    ajudas: {
      pergunta: "Que linha do head avisa o celular para usar a largura da tela dele?",
      dica: 'meta name="viewport", com width=device-width, initial-scale=1. Escreva depois do title.',
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" }],
  },
  {
    id: "meta-viewport-2",
    conceito: "meta-viewport",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o content da meta.",
      toque: "Responda olhando o content da meta.",
    },
    siteAlvo: {
      url: "escolasurf.exemplo",
      titulo: "Escola de Surf",
      head: cabecaComTitulo("Escola de Surf"),
      body: `<h1>Escola de Surf</h1>
<p>Aulas na praia do Meio.</p>`,
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Na meta viewport, que valor manda o celular usar a largura da própria tela?",
      opcoes: ["width=980", "width=device-width", "zoom=out"],
      correta: 1,
      explicacao: "width=device-width faz o celular desenhar a página do tamanho da tela dele, em vez de uma versão gigante encolhida.",
    },
    ajudas: {
      pergunta: "O valor pede a largura da tela do aparelho. Qual é?",
      dica: "width=device-width.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
