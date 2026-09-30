/*
 * Revisão: ordem das regras (E4, Fase 1).
 *
 * Ação: uma regra nova no fim da folha vence a igual que veio antes; previsão: com
 * mesma especificidade, a última ganha.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_ORDEM_DAS_REGRAS: ItemRevisao[] = [
  {
    id: "ordem-das-regras-1",
    conceito: "ordem-das-regras",
    tipo: "acao",
    enunciado: {
      mouse: "O aviso está cinza, pela última regra. Sem apagar nada, escreva no fim da folha uma regra para deixá-lo verde (green).",
      toque: "O aviso está cinza, pela última regra. Sem apagar nada, escreva no fim da folha uma regra para deixá-lo verde (green).",
    },
    siteAlvo: {
      url: "assessoriaviva.exemplo",
      titulo: "Assessoria Viva",
      head: HEAD_CSS,
      body: '<p class="aviso">Prazo até sexta.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: green;
}

.aviso {
  color: gray;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".aviso", propriedade: "color", valor: "green" },
    ajudas: {
      pergunta: "Duas regras iguais em força: qual delas vale?",
      dica: "A que vem por último na folha. No editor CSS, escreva no fim: .aviso { color: green; }.",
    },
    solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n.aviso {\n  color: green;\n}\n" }],
  },
  {
    id: "ordem-das-regras-2",
    conceito: "ordem-das-regras",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a ordem das regras.",
      toque: "Responda olhando a ordem das regras.",
    },
    siteAlvo: {
      url: "aeroclubedovale.exemplo",
      titulo: "Aeroclube do Vale",
      head: HEAD_CSS,
      body: '<p class="selo">Voo panorâmico</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  color: red;
}

.selo {
  color: blue;
}
`,
    },
    previsao: {
      pergunta: "As duas regras têm o mesmo seletor. De que cor fica o selo?",
      opcoes: ["Vermelha, a primeira vence", "Roxa, a mistura", "Azul, a última regra vence"],
      correta: 2,
      explicacao: "Com a MESMA especificidade, a regra que vem depois no arquivo vence.",
    },
    ajudas: {
      pergunta: "Se as duas regras têm a mesma força, a ordem no arquivo desempata?",
      dica: "Sim: a que vem depois vence.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
