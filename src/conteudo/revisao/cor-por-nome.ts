/*
 * Revisão: cor por nome (E1, Fase 1).
 *
 * Ação: usar um nome de cor em inglês; previsão: o que o CSS entende (e o que não,
 * como o nome em português).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_COR_POR_NOME: ItemRevisao[] = [
  {
    id: "cor-por-nome-1",
    conceito: "cor-por-nome",
    tipo: "acao",
    enunciado: {
      mouse: "Pinte o alerta de crimson, a cor pelo nome em inglês.",
      toque: "Pinte o alerta de crimson, a cor pelo nome em inglês.",
    },
    siteAlvo: {
      url: "eletricistaluzcerta.exemplo",
      titulo: "Eletricista Luz Certa",
      head: HEAD_CSS,
      body: '<p class="alerta">Desligue a chave geral antes de mexer.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.alerta {
  font-weight: bold;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".alerta", propriedade: "color", valor: "crimson" },
    ajudas: {
      pergunta: "O CSS conhece cores por nome, em qual língua?",
      dica: "Em inglês. Acrescente color: crimson na regra .alerta.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".alerta" },
      { tipo: "definirPropriedade", seletorRegra: ".alerta", propriedade: "color", valor: "crimson" },
    ],
  },
  {
    id: "cor-por-nome-2",
    conceito: "cor-por-nome",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando nos nomes de cor.",
      toque: "Responda pensando nos nomes de cor.",
    },
    siteAlvo: {
      url: "artesanatolinhasol.exemplo",
      titulo: "Artesanato Linha Sol",
      head: HEAD_CSS,
      body: '<p class="titulo">Bordados à mão</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  color: gold;
}
`,
    },
    previsao: {
      pergunta: "Qual destes é um nome de cor que o CSS entende?",
      opcoes: ["dourado", "gold", "amarelinho"],
      correta: 1,
      explicacao: "O CSS conhece os nomes em inglês, como gold, crimson e white. Em português, ele não entende.",
    },
    ajudas: {
      pergunta: "O nome da cor precisa estar em português ou em inglês?",
      dica: "Em inglês. Olhe o valor que o painel Estilos mostra em color.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
