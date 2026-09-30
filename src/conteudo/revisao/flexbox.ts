/*
 * Revisão: flexbox (L2, Fase 1).
 *
 * Ação: ligar o flex numa caixa de itens empilhados; previsão: o que os filhos
 * fazem quando o pai vira flex.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_FLEXBOX: ItemRevisao[] = [
  {
    id: "flexbox-1",
    conceito: "flexbox",
    tipo: "acao",
    enunciado: {
      mouse: "Os três atalhos estão empilhados. Ponha eles em fila: display: flex na caixa .menu.",
      toque: "Os três atalhos estão empilhados. Ponha eles em fila: display: flex na caixa .menu.",
    },
    siteAlvo: {
      url: "livrarialeitura.exemplo",
      titulo: "Livraria Leitura",
      head: HEAD_CSS,
      body: `<div class="menu">
  <span>Início</span>
  <span>Lançamentos</span>
  <span>Contato</span>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.menu {
  background-color: #eee4ff;
}

.menu span {
  display: block;
  padding: 6px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".menu", propriedade: "display", valor: "flex" },
    ajudas: {
      pergunta: "Qual valor de display põe os filhos de uma caixa numa fila?",
      dica: "flex, na caixa do pai. Na regra .menu, acrescente display: flex.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".menu" },
      { tipo: "definirPropriedade", seletorRegra: ".menu", propriedade: "display", valor: "flex" },
    ],
  },
  {
    id: "flexbox-2",
    conceito: "flexbox",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra do pai.",
      toque: "Responda olhando a regra do pai.",
    },
    siteAlvo: {
      url: "sorveteiradorei.exemplo",
      titulo: "Sorveteira do Rei",
      head: HEAD_CSS,
      body: `<div class="sabores">
  <div>Coco</div>
  <div>Manga</div>
  <div>Uva</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.sabores {
  display: flex;
}

.sabores div {
  padding: 8px 12px;
  background-color: #ffe08a;
}
`,
    },
    previsao: {
      pergunta: "A caixa .sabores é display: flex. O que acontece com as três divs filhas?",
      opcoes: ["Entram numa fila, lado a lado", "Ficam uma embaixo da outra", "Somem"],
      correta: 0,
      explicacao: "Com display: flex, os filhos da caixa entram numa fila e ganham comandos de alinhamento.",
    },
    ajudas: {
      pergunta: "O display: flex vai no pai ou nos filhos?",
      dica: "No pai: é ele que organiza a fila dos filhos.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
