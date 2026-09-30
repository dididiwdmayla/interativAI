/*
 * Revisão: z-index (L4, Fase 3).
 *
 * Ação: trazer uma peça para cima de outra que se sobrepõe; previsão: quem fica por
 * cima.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_Z_INDEX_CSS: ItemRevisao[] = [
  {
    id: "z-index-css-1",
    conceito: "z-index-css",
    tipo: "acao",
    enunciado: {
      mouse: "O cartão azul está escondido atrás do amarelo. Traga ele para cima com z-index maior que o do amarelo.",
      toque: "O cartão azul está escondido atrás do amarelo. Traga ele para cima com z-index maior que o do amarelo.",
    },
    siteAlvo: {
      url: "papelariacolorida.exemplo",
      titulo: "Papelaria Colorida",
      head: HEAD_CSS,
      body: `<div class="amarelo">Amarelo</div>
<div class="azul">Azul</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.amarelo, .azul {
  position: absolute;
  width: 120px;
  height: 80px;
}

.amarelo {
  top: 40px;
  left: 40px;
  z-index: 5;
  background-color: #ffe08a;
}

.azul {
  top: 20px;
  left: 20px;
  z-index: 1;
  background-color: #9db4f0;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".azul", propriedade: "z-index", valor: "9" },
    ajudas: {
      pergunta: "Que propriedade decide qual peça fica por cima quando duas se sobrepõem?",
      dica: "z-index: o número maior vence. Ponha z-index: 9 na regra .azul.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".azul" },
      { tipo: "definirPropriedade", seletorRegra: ".azul", propriedade: "z-index", valor: "9" },
    ],
  },
  {
    id: "z-index-css-2",
    conceito: "z-index-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda comparando os z-index.",
      toque: "Responda comparando os z-index.",
    },
    siteAlvo: {
      url: "feirinhacultural.exemplo",
      titulo: "Feirinha Cultural",
      head: HEAD_CSS,
      body: `<div class="a">A</div>
<div class="b">B</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.a, .b {
  position: absolute;
  width: 100px;
  height: 70px;
  top: 30px;
  left: 30px;
}

.a {
  z-index: 3;
  background-color: #ffd6a5;
}

.b {
  z-index: 7;
  background-color: #cdeac0;
}
`,
    },
    previsao: {
      pergunta: "O .a tem z-index 3 e o .b tem z-index 7, no mesmo lugar. Qual fica por cima?",
      opcoes: ["O .a, o número menor", "O .b, o número maior", "Os dois se misturam"],
      correta: 1,
      explicacao: "z-index decide quem fica por cima quando duas peças se sobrepõem: o número maior vence.",
    },
    ajudas: {
      pergunta: "Qual número ganha no z-index: o maior ou o menor?",
      dica: "O maior.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
