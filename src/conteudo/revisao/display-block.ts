/*
 * Revisão: display block (L1, Fase 1).
 *
 * Ação: um span vira bloco e ocupa a linha; previsão: duas divs, uma ao lado da
 * outra ou uma embaixo?
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_DISPLAY_BLOCK: ItemRevisao[] = [
  {
    id: "display-block-1",
    conceito: "display-block",
    tipo: "acao",
    enunciado: {
      mouse: "O selo é um span e fica na linha do texto. Faça ele ocupar a linha toda com display: block.",
      toque: "O selo é um span e fica na linha do texto. Faça ele ocupar a linha toda com display: block.",
    },
    siteAlvo: {
      url: "cinemaestrelacerta.exemplo",
      titulo: "Cinema Estrela Certa",
      head: HEAD_CSS,
      body: '<p>Sessão de hoje: <span class="selo">Dublado</span> às 19h.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  background-color: #ffd6a5;
  padding: 4px 8px;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".selo", propriedade: "display", valor: "block" },
    ajudas: {
      pergunta: "Qual valor de display faz a caixa ocupar a linha toda?",
      dica: "block. Na regra .selo, acrescente display: block.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".selo" },
      { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "display", valor: "block" },
    ],
  },
  {
    id: "display-block-2",
    conceito: "display-block",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando as duas caixas na prévia.",
      toque: "Responda olhando as duas caixas na prévia.",
    },
    siteAlvo: {
      url: "clubedodamas.exemplo",
      titulo: "Clube de Damas",
      head: HEAD_CSS,
      body: `<div class="peca">Torneio</div>
<div class="peca">Aulas</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.peca {
  width: 120px;
  background-color: #cdeac0;
  padding: 6px;
}
`,
    },
    previsao: {
      pergunta: "As duas divs têm width de 120px. Ficam lado a lado ou uma embaixo da outra?",
      opcoes: ["Lado a lado, cabem nos 120px", "Sobrepostas", "Uma embaixo da outra: block ocupa a linha"],
      correta: 2,
      explicacao: "A div é block: cada uma ocupa a linha toda (a largura do pai) e empurra a seguinte para baixo, mesmo com width menor.",
    },
    ajudas: {
      pergunta: "Uma peça block divide a linha com a vizinha?",
      dica: "Não: ela ocupa a linha toda e empurra o que vem depois.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
