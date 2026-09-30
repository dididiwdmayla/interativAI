/*
 * Revisão: position fixed (L4, Fase 3).
 *
 * Ação: grudar um botão no canto da janela; previsão: o que acontece na rolagem.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_POSITION_FIXED: ItemRevisao[] = [
  {
    id: "position-fixed-1",
    conceito: "position-fixed",
    tipo: "acao",
    enunciado: {
      mouse: "Grude o botão no canto de baixo à direita da janela: position: fixed, bottom: 16px e right: 16px.",
      toque: "Grude o botão no canto de baixo à direita da janela: position: fixed, bottom: 16px e right: 16px.",
    },
    siteAlvo: {
      url: "clubedaleituraazul.exemplo",
      titulo: "Clube Leitura Azul",
      head: HEAD_CSS,
      body: `<h2>Artigos</h2>
<p>Muito texto aqui.</p>
<a class="topo" href="#">Voltar ao topo</a>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.topo {
  background-color: #1d3557;
  color: white;
  padding: 8px 12px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".topo", propriedade: "position", valor: "fixed" },
        { tipo: "valorEfetivo", seletor: ".topo", propriedade: "bottom", valor: "16px" },
        { tipo: "valorEfetivo", seletor: ".topo", propriedade: "right", valor: "16px" },
      ],
    },
    ajudas: {
      pergunta: "Qual position gruda a peça na janela, mesmo com a página rolando?",
      dica: "fixed, com bottom: 16px e right: 16px, na regra .topo.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".topo" },
      { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "position", valor: "fixed" },
      { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "bottom", valor: "16px" },
      { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "right", valor: "16px" },
    ],
  },
  {
    id: "position-fixed-2",
    conceito: "position-fixed",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "farmaciadabeira.exemplo",
      titulo: "Farmácia da Beira",
      head: HEAD_CSS,
      body: `<div class="chat">Fale conosco</div>
<p>Texto longo da página.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.chat {
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 8px 12px;
  background-color: #cdeac0;
}
`,
    },
    previsao: {
      pergunta: "O .chat é position: fixed. O que acontece com ele quando a página rola?",
      opcoes: ["Rola junto com o texto", "Some da tela", "Fica no mesmo lugar da janela"],
      correta: 2,
      explicacao: "O fixed gruda a peça na janela: ela fica no lugar mesmo quando a página rola.",
    },
    ajudas: {
      pergunta: "A peça fixed anda junto com a rolagem?",
      dica: "Não: ela fica presa à janela.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
