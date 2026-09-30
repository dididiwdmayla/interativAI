/*
 * Revisão: ligar e desligar declaração (E1, Fase 1).
 *
 * Ação: desligar uma declaração que estragou a peça, sem apagar; previsão: a
 * confusão "desligar apaga".
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_LIGAR_DESLIGAR_DECLARACAO: ItemRevisao[] = [
  {
    id: "ligar-desligar-declaracao-1",
    conceito: "ligar-desligar-declaracao",
    tipo: "acao",
    enunciado: {
      mouse: "O aviso ficou gigante. Desligue a font-size pela caixinha, sem apagar a linha.",
      toque: "O aviso ficou gigante. Desligue a font-size pela caixinha, sem apagar a linha.",
    },
    siteAlvo: {
      url: "padariasaborcaseiro.exemplo",
      titulo: "Padaria Sabor Caseiro",
      head: HEAD_CSS,
      body: '<p class="aviso">Fechados no feriado.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: firebrick;
  font-size: 4rem;
}
`,
    },
    validador: { tipo: "declaracao", seletorRegra: ".aviso", propriedade: "font-size", ativa: false },
    ajudas: {
      pergunta: "Como testar sem uma declaração, sem perder o que você escreveu?",
      dica: "A caixinha ao lado da linha font-size, no painel Estilos: desmarque ela.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".aviso" },
      { tipo: "alternarDeclaracao", seletorRegra: ".aviso", propriedade: "font-size" },
    ],
  },
  {
    id: "ligar-desligar-declaracao-2",
    conceito: "ligar-desligar-declaracao",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando na caixinha do painel.",
      toque: "Responda pensando na caixinha do painel.",
    },
    siteAlvo: {
      url: "cabeleireirofiodeouro.exemplo",
      titulo: "Cabeleireiro Fio de Ouro",
      head: HEAD_CSS,
      body: '<p class="faixa">Agende seu horário</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.faixa {
  background-color: khaki;
  padding: 10px;
}
`,
    },
    previsao: {
      pergunta: "Você desliga a caixinha do background-color. A linha some do CSS de vez?",
      opcoes: ["Sim, é apagada", "Sim, mas volta ao recarregar", "Não, fica desligada e dá para religar"],
      correta: 2,
      explicacao: "Desligar não apaga: a declaração vira comentário na folha, e a caixinha religa quando você quiser.",
    },
    ajudas: {
      pergunta: "Desligar é o mesmo que apagar a linha?",
      dica: "Não. A linha continua lá, só desligada.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
