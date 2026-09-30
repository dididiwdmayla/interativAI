/*
 * Revisão: meta charset (U6, Fase 2), no modo documento.
 *
 * Ação: acrescentar o charset numa página com acentos quebrados (a direção da fase
 * foi outra: o cartão de bike); previsão: o que aparece sem ele.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_META_CHARSET: ItemRevisao[] = [
  {
    id: "meta-charset-1",
    conceito: "meta-charset",
    tipo: "acao",
    enunciado: {
      mouse: 'Os acentos aparecem quebrados. Acrescente <meta charset="utf-8"> no head para consertar.',
      toque: 'Os acentos aparecem quebrados. Acrescente <meta charset="utf-8"> no head para consertar.',
    },
    siteAlvo: {
      url: "sorveteriagelato.exemplo",
      titulo: "Sorveteria Gelato",
      head: "<title>Sorveteria Gelato</title>\n" + HEAD_MINI,
      body: `<h1>Sorveteria Gelato</h1>
<p>Sabores de açaí, coco e maracujá.</p>`,
    },
    modoDocumento: true,
    validador: { tipo: "existe", seletor: "head meta[charset]" },
    ajudas: {
      pergunta: "Que meta diz ao navegador como ler as letras da página?",
      dica: "meta charset, com utf-8, dentro do head. Escreva depois do title.",
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: "<meta charset=\"utf-8\">" }],
  },
  {
    id: "meta-charset-2",
    conceito: "meta-charset",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a prévia.",
      toque: "Responda olhando a prévia.",
    },
    siteAlvo: {
      url: "quitandadonito.exemplo",
      titulo: "Quitanda do Nito",
      head: "<title>Quitanda do Nito</title>\n" + HEAD_MINI_ESCURO,
      body: `<h1>Quitanda do Nito</h1>
<p>Mamão, maçã e açaí.</p>`,
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Esta página tem acentos e nenhum meta charset. O que a prévia mostra nos acentos?",
      opcoes: ["Os acentos normais", "Símbolos estranhos no lugar deles", "Uma página em branco"],
      correta: 1,
      explicacao: "Sem o meta charset, o navegador pode ler as letras do jeito errado, e os acentos saem quebrados.",
    },
    ajudas: {
      pergunta: "Qual tag do head cuida de como as letras são lidas?",
      dica: "O meta charset. Sem ele, os acentos podem sair errados.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
