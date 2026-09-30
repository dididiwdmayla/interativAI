/*
 * Revisão: !important (E4, Fase 2).
 *
 * Ação: tirar o !important trocando a declaração; previsão: o !important vence o
 * id.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_IMPORTANTE_CSS: ItemRevisao[] = [
  {
    id: "importante-css-1",
    conceito: "importante-css",
    tipo: "acao",
    enunciado: {
      mouse: "O #topo não fica crimson por causa do !important da .aviso. Edite a declaração da .aviso e tire o !important.",
      toque: "O #topo não fica crimson por causa do !important da .aviso. Edite a declaração da .aviso e tire o !important.",
    },
    siteAlvo: {
      url: "lojadebicicletas.exemplo",
      titulo: "Loja de Bicicletas",
      head: HEAD_CSS,
      body: '<p id="topo" class="aviso">Revisão grátis em maio.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: gray !important;
}

#topo {
  color: crimson;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: "#topo", propriedade: "color", valor: "crimson" },
    ajudas: {
      pergunta: "Como fazer a regra do id voltar a valer?",
      dica: "Edite o valor da declaração na .aviso, no painel Estilos, sem o !important.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: "#topo" },
      { tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "color", valor: "gray" },
    ],
  },
  {
    id: "importante-css-2",
    conceito: "importante-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando as duas regras.",
      toque: "Responda olhando as duas regras.",
    },
    siteAlvo: {
      url: "hortadacomunidade.exemplo",
      titulo: "Horta da Comunidade",
      head: HEAD_CSS,
      body: '<p id="topo" class="aviso">Mutirão no domingo.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: gray !important;
}

#topo {
  color: crimson;
}
`,
    },
    previsao: {
      pergunta: "A .aviso tem !important e o #topo tem id. Quem vence a cor?",
      opcoes: ["O #topo, por causa do id", "Empata, e a última vence", "A .aviso, por causa do !important"],
      correta: 2,
      explicacao: "O !important passa na frente de quase tudo, até de um id mais específico. Por isso ele é melhor evitado.",
    },
    ajudas: {
      pergunta: "O !important ganha da especificidade?",
      dica: "Ganha. Por isso ele complica: melhor evitar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
