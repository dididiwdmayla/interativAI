/*
 * Revisão: box-sizing (E3, Fase 2).
 *
 * Ação: ligar o border-box numa caixa com padding e borda; previsão: a conta da
 * largura total.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_BOX_SIZING: ItemRevisao[] = [
  {
    id: "box-sizing-1",
    conceito: "box-sizing",
    tipo: "acao",
    enunciado: {
      mouse: "O painel estoura os 300px de largura. Ligue box-sizing: border-box nele.",
      toque: "O painel estoura os 300px de largura. Ligue box-sizing: border-box nele.",
    },
    siteAlvo: {
      url: "lojadetintas.exemplo",
      titulo: "Loja de Tintas",
      head: HEAD_CSS,
      body: '<div class="painel">Catálogo de cores</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.painel {
  width: 300px;
  padding: 20px;
  border: 5px solid #444;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".painel", propriedade: "box-sizing", valor: "border-box" },
    ajudas: {
      pergunta: "Que propriedade faz padding e borda entrarem DENTRO da largura definida?",
      dica: "box-sizing: border-box, na regra .painel.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".painel" },
      { tipo: "definirPropriedade", seletorRegra: ".painel", propriedade: "box-sizing", valor: "border-box" },
    ],
  },
  {
    id: "box-sizing-2",
    conceito: "box-sizing",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda fazendo a conta.",
      toque: "Responda fazendo a conta.",
    },
    siteAlvo: {
      url: "marcenariaportacerta.exemplo",
      titulo: "Marcenaria Porta Certa",
      head: HEAD_CSS,
      body: '<div class="tabua">Móveis sob medida</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.tabua {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid #6b4423;
}
`,
    },
    previsao: {
      pergunta: "Com border-box, width 200px, padding 20px e borda 5px, quanto a caixa ocupa de largura?",
      opcoes: ["200px", "250px", "225px"],
      correta: 0,
      explicacao: "Com border-box, o padding e a borda entram DENTRO da largura definida: a caixa ocupa os 200px.",
    },
    ajudas: {
      pergunta: "Com border-box, a largura já inclui o padding e a borda?",
      dica: "Inclui. Sem border-box, eles somariam por fora.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
