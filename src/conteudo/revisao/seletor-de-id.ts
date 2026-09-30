/*
 * Revisão: seletor de id (E2, Fase 2).
 *
 * Ação: pegar uma peça só pelo id, sem tocar nas parecidas; previsão: quantas peças
 * um #id pega.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_SELETOR_DE_ID: ItemRevisao[] = [
  {
    id: "seletor-de-id-1",
    conceito: "seletor-de-id",
    tipo: "acao",
    enunciado: {
      mouse: "Pinte de tomato o fundo só do cartão com id 'destaque', sem mexer nos outros.",
      toque: "Pinte de tomato o fundo só do cartão com id 'destaque', sem mexer nos outros.",
    },
    siteAlvo: {
      url: "viveiroplantasver.exemplo",
      titulo: "Viveiro Plantas Ver",
      head: HEAD_CSS,
      body: `<div class="cartao">Samambaia</div>
<div class="cartao" id="destaque">Orquídea</div>
<div class="cartao">Cacto</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cartao {
  padding: 10px;
  margin-bottom: 8px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: "#destaque", propriedade: "background-color", valor: "tomato" },
        { tipo: "nao", validador: { tipo: "valorEfetivo", seletor: ".cartao:not(#destaque)", propriedade: "background-color", valor: "tomato" } },
      ],
    },
    ajudas: {
      pergunta: "Que seletor pega UMA peça só, pelo id?",
      dica: "O sustenido e o id: #destaque. Crie a regra com background-color: tomato.",
    },
    solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: "#destaque", declaracoes: [{"propriedade":"background-color","valor":"tomato"}] }],
  },
  {
    id: "seletor-de-id-2",
    conceito: "seletor-de-id",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o id na árvore.",
      toque: "Responda olhando o id na árvore.",
    },
    siteAlvo: {
      url: "hotelrecantoazul.exemplo",
      titulo: "Hotel Recanto Azul",
      head: HEAD_CSS,
      body: `<h2 id="vip">Suíte master</h2>
<h2>Quarto simples</h2>
<h2>Quarto duplo</h2>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

#vip {
  color: goldenrod;
}
`,
    },
    previsao: {
      pergunta: "O seletor #vip pega quantas peças desta página?",
      opcoes: ["Só uma", "As três", "Todos os h2"],
      correta: 0,
      explicacao: "Um id não se repete na página, então o #vip pega UMA peça só.",
    },
    ajudas: {
      pergunta: "Um id pode aparecer em várias peças?",
      dica: "Não: por isso o #id pega uma só.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
