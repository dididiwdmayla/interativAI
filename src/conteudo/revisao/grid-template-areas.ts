/*
 * Revisão: grid-template-areas (L3, Fase 3).
 *
 * Ação: desenhar o layout com nomes (os filhos já têm o grid-area); previsão: o que
 * cada nome é.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_GRID_TEMPLATE_AREAS: ItemRevisao[] = [
  {
    id: "grid-template-areas-1",
    conceito: "grid-template-areas",
    tipo: "acao",
    enunciado: {
      mouse: "Cada bloco já tem seu grid-area. Desenhe o layout: topo em cima, lado e conteúdo embaixo, em grid-template-areas.",
      toque: "Cada bloco já tem seu grid-area. Desenhe o layout: topo em cima, lado e conteúdo embaixo, em grid-template-areas.",
    },
    siteAlvo: {
      url: "portalbairro.exemplo",
      titulo: "Portal do Bairro",
      head: HEAD_CSS,
      body: `<div class="pagina">
  <div class="topo">Topo</div>
  <div class="lado">Lado</div>
  <div class="conteudo">Conteúdo</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.pagina {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
}

.topo { grid-area: topo; }
.lado { grid-area: lado; }
.conteudo { grid-area: conteudo; }

.pagina div {
  padding: 12px;
  background-color: #e0f2e9;
}
`,
    },
    validador: { tipo: "declaracao", seletorRegra: ".pagina", propriedade: "grid-template-areas", valor: "\"topo topo\" \"lado conteudo\"", ativa: true },
    ajudas: {
      pergunta: "Que propriedade desenha o layout com nomes, como um mapa de caixas?",
      dica: 'grid-template-areas: "topo topo" "lado conteudo", na regra .pagina.',
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".pagina" },
      { tipo: "definirPropriedade", seletorRegra: ".pagina", propriedade: "grid-template-areas", valor: "\"topo topo\" \"lado conteudo\"" },
    ],
  },
  {
    id: "grid-template-areas-2",
    conceito: "grid-template-areas",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o desenho das áreas.",
      toque: "Responda olhando o desenho das áreas.",
    },
    siteAlvo: {
      url: "radiocomunitaria.exemplo",
      titulo: "Rádio Comunitária",
      head: HEAD_CSS,
      body: '<div class="pagina"><div class="menu">Menu</div><div class="programa">Programa</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.pagina {
  display: grid;
  grid-template-areas: "menu programa";
  grid-template-columns: 1fr 2fr;
  gap: 8px;
}

.menu { grid-area: menu; }
.programa { grid-area: programa; }

.pagina div {
  padding: 12px;
  background-color: #ffd6a5;
}
`,
    },
    previsao: {
      pergunta: 'No desenho "menu programa", o que cada nome representa?',
      opcoes: ["Uma class nova do HTML", "Uma área que um filho ocupa, pelo grid-area", "Uma coluna de 1fr"],
      correta: 1,
      explicacao: "Cada nome do desenho é uma área. O filho escolhe a área com grid-area: e ocupa aquele pedaço da grade.",
    },
    ajudas: {
      pergunta: "Como o filho diz a qual área ele pertence?",
      dica: "Com grid-area, usando o mesmo nome do desenho.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
