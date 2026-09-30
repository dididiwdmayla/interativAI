/*
 * Revisão: imagem responsiva (R2, Fase 2).
 *
 * Ação: max-width 100% e height auto numa foto de 700px; previsão: o que acontece com
 * uma foto grande num espaço pequeno.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_IMAGEM_RESPONSIVA: ItemRevisao[] = [
  {
    id: "imagem-responsiva-1",
    conceito: "imagem-responsiva",
    tipo: "acao",
    enunciado: {
      mouse: "A foto tem 700px e estoura a tela. Deixe ela nunca passar do espaço: max-width: 100% e height: auto.",
      toque: "A foto tem 700px e estoura a tela. Deixe ela nunca passar do espaço: max-width: 100% e height: auto.",
    },
    siteAlvo: {
      url: "estudiodeimagem.exemplo",
      titulo: "Estúdio de Imagem",
      head: HEAD_CSS,
      body: "<img class=\"foto\" src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='260'%3E%3Crect width='700' height='260' fill='%23457b9d'/%3E%3C/svg%3E\" alt=\"Praia ao entardecer\">",
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.foto {
  width: 700px;
  height: 260px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".foto", propriedade: "max-width", valor: "100%" },
        { tipo: "valorEfetivo", seletor: ".foto", propriedade: "height", valor: "auto" },
      ],
    },
    ajudas: {
      pergunta: "Que propriedade impede uma imagem de passar da largura do espaço dela?",
      dica: "max-width: 100%, com height: auto, na regra .foto.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".foto" },
      { tipo: "definirPropriedade", seletorRegra: ".foto", propriedade: "max-width", valor: "100%" },
      { tipo: "definirPropriedade", seletorRegra: ".foto", propriedade: "height", valor: "auto" },
    ],
  },
  {
    id: "imagem-responsiva-2",
    conceito: "imagem-responsiva",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra da foto.",
      toque: "Responda olhando a regra da foto.",
    },
    siteAlvo: {
      url: "albumdefamilia.exemplo",
      titulo: "Álbum de Família",
      head: HEAD_CSS,
      body: "<div class=\"quadro\"><img class=\"foto\" src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='300'%3E%3Crect width='900' height='300' fill='%23e76f51'/%3E%3C/svg%3E\" alt=\"Retrato da família\"></div>",
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.quadro {
  width: 300px;
}

.foto {
  max-width: 100%;
  height: auto;
}
`,
    },
    previsao: {
      pergunta: "A foto tem 900px de largura original e está num quadro de 300px, com max-width: 100%. O que acontece?",
      opcoes: ["Ela estoura o quadro", "Ela encolhe para caber nos 300px", "Ela some"],
      correta: 1,
      explicacao: "max-width: 100% (com height: auto) faz a imagem nunca estourar o espaço dela, em nenhuma tela.",
    },
    ajudas: {
      pergunta: "Com max-width: 100%, a foto pode passar do quadro?",
      dica: "Não: 100% é o limite do espaço dela.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
