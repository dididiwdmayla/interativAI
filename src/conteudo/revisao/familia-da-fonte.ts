/*
 * Revisão: família da fonte (E1, Fase 2).
 *
 * Ação: trocar o desenho das letras com a reserva no fim; previsão: para que serve
 * a reserva.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_FAMILIA_DA_FONTE: ItemRevisao[] = [
  {
    id: "familia-da-fonte-1",
    conceito: "familia-da-fonte",
    tipo: "acao",
    enunciado: {
      mouse: "Mude a fonte da citação para Georgia, com serif de reserva: font-family: Georgia, serif.",
      toque: "Mude a fonte da citação para Georgia, com serif de reserva: font-family: Georgia, serif.",
    },
    siteAlvo: {
      url: "sebolivrofalado.exemplo",
      titulo: "Sebo Livro Falado",
      head: HEAD_CSS,
      body: '<p class="citacao">Ler é sonhar pela mão de outro.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.citacao {
  font-size: 1.4rem;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".citacao", propriedade: "font-family", valor: "Georgia, serif" },
    ajudas: {
      pergunta: "Qual propriedade escolhe o desenho das letras?",
      dica: "font-family, com uma reserva no fim. Na regra .citacao, acrescente font-family: Georgia, serif.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".citacao" },
      { tipo: "definirPropriedade", seletorRegra: ".citacao", propriedade: "font-family", valor: "Georgia, serif" },
    ],
  },
  {
    id: "familia-da-fonte-2",
    conceito: "familia-da-fonte",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o valor da font-family.",
      toque: "Responda olhando o valor da font-family.",
    },
    siteAlvo: {
      url: "grafica24h.exemplo",
      titulo: "Gráfica 24h",
      head: HEAD_CSS,
      body: '<h2 class="titulo">Cartões e folders</h2>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  font-family: Verdana, sans-serif;
}
`,
    },
    previsao: {
      pergunta: "Em font-family: Verdana, sans-serif, para que serve o sans-serif no fim?",
      opcoes: ["Deixa a letra maior", "É um erro de escrita", "De reserva, se a Verdana não existir"],
      correta: 2,
      explicacao: "A lista é uma ordem de tentativa: se a primeira fonte não existe no aparelho, o navegador usa a reserva.",
    },
    ajudas: {
      pergunta: "O que acontece se a primeira fonte da lista faltar?",
      dica: "O navegador tenta a próxima, a reserva.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
