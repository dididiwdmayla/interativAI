/*
 * Revisão: position relative (L4, Fase 1).
 *
 * Ação: deslizar a peça sem tirar o espaço dela; previsão: o espaço de origem
 * continua reservado.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_POSITION_RELATIVE: ItemRevisao[] = [
  {
    id: "position-relative-1",
    conceito: "position-relative",
    tipo: "acao",
    enunciado: {
      mouse: "Desça o selo 10px sem tirar o espaço dele: position: relative e top: 10px.",
      toque: "Desça o selo 10px sem tirar o espaço dele: position: relative e top: 10px.",
    },
    siteAlvo: {
      url: "casadeporcelana.exemplo",
      titulo: "Casa de Porcelana",
      head: HEAD_CSS,
      body: '<p>Xícaras pintadas à mão <span class="selo">Novo</span></p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  background-color: #ffe08a;
  padding: 2px 8px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".selo", propriedade: "position", valor: "relative" },
        { tipo: "valorEfetivo", seletor: ".selo", propriedade: "top", valor: "10px" },
      ],
    },
    ajudas: {
      pergunta: "Qual position desliza a peça a partir de onde ela estaria?",
      dica: "relative, com top: 10px, na regra .selo.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".selo" },
      { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "position", valor: "relative" },
      { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "top", valor: "10px" },
    ],
  },
  {
    id: "position-relative-2",
    conceito: "position-relative",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "livrariadaesquina.exemplo",
      titulo: "Livraria da Esquina",
      head: HEAD_CSS,
      body: `<p class="a">Primeiro</p>
<p class="b">Segundo</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.a {
  position: relative;
  top: 20px;
}
`,
    },
    previsao: {
      pergunta: "O .a está com position: relative e top: 20px. O que acontece com o espaço original dele?",
      opcoes: ["Continua reservado: o Segundo não sobe", "Fecha: o Segundo sobe", "Vai junto com o .a"],
      correta: 0,
      explicacao: "O relative desliza a peça sem tirar o espaço dela do fluxo. O que vem depois não muda de lugar.",
    },
    ajudas: {
      pergunta: "A peça relative libera o lugar que ocupava?",
      dica: "Não: o espaço continua reservado.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
