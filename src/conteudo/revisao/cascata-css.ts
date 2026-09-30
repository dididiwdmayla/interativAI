/*
 * Revisão: cascata (E4, Fase 1).
 *
 * Ação: uma regra de classe vence a de tag que estava mandando na peça; previsão:
 * quem decide quando duas regras pegam a mesma peça.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_CASCATA_CSS: ItemRevisao[] = [
  {
    id: "cascata-css-1",
    conceito: "cascata-css",
    tipo: "acao",
    enunciado: {
      mouse: "O recado está azul por causa da regra p. Faça ele ficar vermelho (red) com uma regra dele.",
      toque: "O recado está azul por causa da regra p. Faça ele ficar vermelho (red) com uma regra dele.",
    },
    siteAlvo: {
      url: "correiodobairro.exemplo",
      titulo: "Correio do Bairro",
      head: HEAD_CSS,
      body: `<p>Coleta de lixo às terças.</p>
<p class="recado">Reunião de moradores na sexta.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

p {
  color: navy;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".recado", propriedade: "color", valor: "red" },
    ajudas: {
      pergunta: "Duas regras pegam o mesmo recado. Quem decide qual vale?",
      dica: "A cascata. Uma regra .recado é mais específica que p: crie ela com color: red.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".recado" },
      { tipo: "adicionarRegra", seletorRegra: ".recado", declaracoes: [{"propriedade":"color","valor":"red"}] },
    ],
  },
  {
    id: "cascata-css-2",
    conceito: "cascata-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando as duas regras no painel Estilos.",
      toque: "Responda olhando as duas regras no painel Estilos.",
    },
    siteAlvo: {
      url: "clubedeartes.exemplo",
      titulo: "Clube de Artes",
      head: HEAD_CSS,
      body: '<h2 class="titulo">Oficinas</h2>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h2 {
  color: gray;
}

.titulo {
  color: red;
}
`,
    },
    previsao: {
      pergunta: "As regras h2 e .titulo pegam o mesmo título. Quem decide qual cor vale?",
      opcoes: ["O primeiro que o navegador lê", "A cascata, comparando as regras", "Um sorteio"],
      correta: 1,
      explicacao: "Quando várias regras mirem a mesma peça, a cascata decide qual declaração vence, com regras bem definidas.",
    },
    ajudas: {
      pergunta: "Existe uma regra de desempate ou é sorte?",
      dica: "Existe: é a cascata, e o painel Estilos mostra o resultado.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
