/*
 * Revisão: unidade rem (E1, Fase 2).
 *
 * Ação: escrever um tamanho em rem; previsão: converter rem em px sabendo que a
 * letra da página é 16px.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_UNIDADE_REM: ItemRevisao[] = [
  {
    id: "unidade-rem-1",
    conceito: "unidade-rem",
    tipo: "acao",
    enunciado: {
      mouse: "Dê ao título o tamanho de 3rem, três vezes a letra da página.",
      toque: "Dê ao título o tamanho de 3rem, três vezes a letra da página.",
    },
    siteAlvo: {
      url: "sapatariapassoleve.exemplo",
      titulo: "Sapataria Passo Leve",
      head: HEAD_CSS,
      body: `<h1>Sapataria Passo Leve</h1>
<p>Consertos em uma hora.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h1 {
  color: #6d3f2a;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "font-size", valor: "3rem" },
    ajudas: {
      pergunta: "Que unidade conta em múltiplos da letra da página?",
      dica: "rem. Na regra do h1, acrescente font-size: 3rem.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: "h1" },
      { tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "font-size", valor: "3rem" },
    ],
  },
  {
    id: "unidade-rem-2",
    conceito: "unidade-rem",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda fazendo a conta.",
      toque: "Responda fazendo a conta.",
    },
    siteAlvo: {
      url: "chocolateriaamendoa.exemplo",
      titulo: "Chocolateria Amêndoa",
      head: HEAD_CSS,
      body: '<h2 class="titulo">Barras artesanais</h2>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  font-size: 2rem;
}
`,
    },
    previsao: {
      pergunta: "A letra da página é 16px. Quantos px tem o título de 2rem?",
      opcoes: ["2px", "32px", "18px"],
      correta: 1,
      explicacao: "1rem é a letra da página inteira (16px). Então 2rem é o dobro: 32px.",
    },
    ajudas: {
      pergunta: "Quanto vale 1rem, se ninguém mudou a letra da página?",
      dica: "16px. 2rem é duas vezes isso.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
