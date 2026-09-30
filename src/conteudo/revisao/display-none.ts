/*
 * Revisão: display none (L1, Fase 3).
 *
 * Ação: tirar a peça do fluxo de vez; previsão: o espaço fecha (diferente do
 * Esconder da U2, que guarda o espaço).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_DISPLAY_NONE: ItemRevisao[] = [
  {
    id: "display-none-1",
    conceito: "display-none",
    tipo: "acao",
    enunciado: {
      mouse: "O aviso não deve nem ocupar espaço. Sumir de vez com display: none.",
      toque: "O aviso não deve nem ocupar espaço. Sumir de vez com display: none.",
    },
    siteAlvo: {
      url: "mecanicadobeto.exemplo",
      titulo: "Mecânica do Beto",
      head: HEAD_CSS,
      body: `<p class="aviso">Fechado para almoço.</p>
<p>Abrimos às 13h.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  background-color: #ffd6a5;
  padding: 8px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".aviso", propriedade: "display", valor: "none" },
    ajudas: {
      pergunta: "Qual valor de display faz a peça sumir sem deixar espaço?",
      dica: "none. Na regra .aviso, acrescente display: none.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".aviso" },
      { tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "display", valor: "none" },
    ],
  },
  {
    id: "display-none-2",
    conceito: "display-none",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "grafitearte.exemplo",
      titulo: "Grafite Arte",
      head: HEAD_CSS,
      body: `<h2 class="banner">Oferta</h2>
<p>Tintas com 20% de desconto.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.banner {
  display: none;
}
`,
    },
    previsao: {
      pergunta: "O banner está com display: none. O texto de baixo sobe para o lugar dele?",
      opcoes: ["Não, o espaço continua reservado", "O texto também some", "Sim, o espaço fecha"],
      correta: 2,
      explicacao: "display: none tira a peça do fluxo: ela some e o espaço fecha, como se nunca tivesse existido. O Esconder é que guarda o lugar.",
    },
    ajudas: {
      pergunta: "O display none guarda o espaço da peça?",
      dica: "Não, o espaço fecha. Quem guarda é o Esconder.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
