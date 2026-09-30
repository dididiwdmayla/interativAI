/*
 * Revisão: gap (L2, Fase 3).
 *
 * Ação: dar o espaço fixo entre os filhos; previsão: onde o gap cria espaço.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_GAP_CSS: ItemRevisao[] = [
  {
    id: "gap-css-1",
    conceito: "gap-css",
    tipo: "acao",
    enunciado: {
      mouse: "Os cartões estão colados. Dê 16px de espaço entre eles com gap, na caixa.",
      toque: "Os cartões estão colados. Dê 16px de espaço entre eles com gap, na caixa.",
    },
    siteAlvo: {
      url: "escolaverdefuturo.exemplo",
      titulo: "Escola Verde Futuro",
      head: HEAD_CSS,
      body: `<div class="turmas">
  <div>Infantil</div>
  <div>Fundamental</div>
  <div>Médio</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.turmas {
  display: flex;
}

.turmas div {
  padding: 10px;
  background-color: #e0f2e9;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".turmas", propriedade: "gap", valor: "16px" },
    ajudas: {
      pergunta: "Que propriedade cria espaço fixo ENTRE os filhos, sem margin em cada um?",
      dica: "gap: 16px, na regra .turmas.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".turmas" },
      { tipo: "definirPropriedade", seletorRegra: ".turmas", propriedade: "gap", valor: "16px" },
    ],
  },
  {
    id: "gap-css-2",
    conceito: "gap-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando na fila.",
      toque: "Responda pensando na fila.",
    },
    siteAlvo: {
      url: "docesdojoao.exemplo",
      titulo: "Doces do João",
      head: HEAD_CSS,
      body: '<div class="vitrine"><div>Pudim</div><div>Bolo</div><div>Torta</div></div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.vitrine {
  display: flex;
  gap: 20px;
}

.vitrine div {
  padding: 8px;
  background-color: #ffd6a5;
}
`,
    },
    previsao: {
      pergunta: "Com gap: 20px, onde fica o espaço de 20px?",
      opcoes: ["Também antes do primeiro e depois do último", "Só entre os itens, não nas pontas", "Só antes do primeiro"],
      correta: 1,
      explicacao: "O gap cria espaço só ENTRE os filhos. As pontas ficam sem o espaço extra.",
    },
    ajudas: {
      pergunta: "O gap põe espaço nas pontas da fila também?",
      dica: "Não, só entre os itens.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
