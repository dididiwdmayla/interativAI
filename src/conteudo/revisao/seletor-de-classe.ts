/*
 * Revisão: seletor de classe (E2, Fase 1).
 *
 * Ação: pintar só as peças marcadas com uma class; previsão: o que o ponto pega.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_SELETOR_DE_CLASSE: ItemRevisao[] = [
  {
    id: "seletor-de-classe-1",
    conceito: "seletor-de-classe",
    tipo: "acao",
    enunciado: {
      mouse: "Pinte de dourado (gold) o fundo dos itens marcados com a class 'novo', com uma regra só.",
      toque: "Pinte de dourado (gold) o fundo dos itens marcados com a class 'novo', com uma regra só.",
    },
    siteAlvo: {
      url: "docariabocaboa.exemplo",
      titulo: "Doçaria Boca Boa",
      head: HEAD_CSS,
      body: `<p id="i1" class="item novo">Pudim</p>
<p id="i2" class="item">Brigadeiro</p>
<p id="i3" class="item novo">Quindim</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.item {
  padding: 6px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: "#i1", propriedade: "background-color", valor: "gold" },
        { tipo: "valorEfetivo", seletor: "#i3", propriedade: "background-color", valor: "gold" },
        { tipo: "nao", validador: { tipo: "valorEfetivo", seletor: "#i2", propriedade: "background-color", valor: "gold" } },
      ],
    },
    ajudas: {
      pergunta: "Que seletor pega toda peça com uma class, onde ela estiver?",
      dica: "Um ponto e o nome da class: .novo. Crie a regra com background-color: gold.",
    },
    solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: ".novo", declaracoes: [{"propriedade":"background-color","valor":"gold"}] }],
  },
  {
    id: "seletor-de-classe-2",
    conceito: "seletor-de-classe",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando as classes na árvore.",
      toque: "Responda olhando as classes na árvore.",
    },
    siteAlvo: {
      url: "bazarcantodosol.exemplo",
      titulo: "Bazar Canto do Sol",
      head: HEAD_CSS,
      body: `<p class="oferta">Vela aromática</p>
<p>Cesta de palha</p>
<p class="oferta">Toalha de mesa</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.oferta {
  color: firebrick;
}
`,
    },
    previsao: {
      pergunta: "O seletor .oferta pega quais peças?",
      opcoes: ["Só a primeira", "Todos os parágrafos", "As duas que têm class oferta"],
      correta: 2,
      explicacao: "O ponto pega toda peça que tem aquela class, onde ela estiver. A do meio não tem, então fica de fora.",
    },
    ajudas: {
      pergunta: "O ponto no começo do seletor procura o quê?",
      dica: "Peças com aquela class no HTML.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
