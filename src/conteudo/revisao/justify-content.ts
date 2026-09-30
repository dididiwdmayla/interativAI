/*
 * Revisão: justify-content (L2, Fase 2).
 *
 * Ação: centralizar os filhos ao longo da fila; previsão: onde o space-between
 * leva o primeiro e o último.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_JUSTIFY_CONTENT: ItemRevisao[] = [
  {
    id: "justify-content-1",
    conceito: "justify-content",
    tipo: "acao",
    enunciado: {
      mouse: "Centralize os botões ao longo da barra com justify-content: center.",
      toque: "Centralize os botões ao longo da barra com justify-content: center.",
    },
    siteAlvo: {
      url: "academiamovimento.exemplo",
      titulo: "Academia Movimento",
      head: HEAD_CSS,
      body: `<div class="barra">
  <button>Planos</button>
  <button>Horários</button>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.barra {
  display: flex;
  background-color: #e0f2e9;
  padding: 10px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".barra", propriedade: "justify-content", valor: "center" },
    ajudas: {
      pergunta: "Que propriedade distribui os filhos ao longo da fila?",
      dica: "justify-content: center, na regra .barra.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".barra" },
      { tipo: "definirPropriedade", seletorRegra: ".barra", propriedade: "justify-content", valor: "center" },
    ],
  },
  {
    id: "justify-content-2",
    conceito: "justify-content",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a barra na prévia.",
      toque: "Responda olhando a barra na prévia.",
    },
    siteAlvo: {
      url: "livrariaalfabeto.exemplo",
      titulo: "Livraria Alfabeto",
      head: HEAD_CSS,
      body: '<div class="barra"><span>Logo</span><span>Busca</span><span>Carrinho</span></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.barra {
  display: flex;
  justify-content: space-between;
  background-color: #eee4ff;
  padding: 10px;
}
`,
    },
    previsao: {
      pergunta: "Com justify-content: space-between, onde ficam os três itens?",
      opcoes: ["Todos juntos, no começo", "Todos juntos, no centro", "Espalhados: um em cada ponta, o outro no meio"],
      correta: 2,
      explicacao: "space-between joga o primeiro para o começo, o último para o fim e divide o espaço restante entre eles.",
    },
    ajudas: {
      pergunta: "O space-between aproxima ou afasta os itens?",
      dica: "Afasta: espalha eles ao longo da fila.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
