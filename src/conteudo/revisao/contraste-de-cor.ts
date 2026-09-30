/*
 * Revisão: contraste de cor (E5, Fase 3).
 *
 * Ação: trocar uma cor que some no fundo por uma legível; previsão: o par ruim.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_CONTRASTE_DE_COR: ItemRevisao[] = [
  {
    id: "contraste-de-cor-1",
    conceito: "contraste-de-cor",
    tipo: "acao",
    enunciado: {
      mouse: "O texto da faixa some no fundo azul-marinho. Troque a cor das letras para white.",
      toque: "O texto da faixa some no fundo azul-marinho. Troque a cor das letras para white.",
    },
    siteAlvo: {
      url: "cursodeidiomas.exemplo",
      titulo: "Curso de Idiomas",
      head: HEAD_CSS,
      body: '<p class="faixa">Matrículas abertas até sexta.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.faixa {
  padding: 12px;
  background-color: #14213d;
  color: #2b3a67;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".faixa", propriedade: "color", valor: "white" },
    ajudas: {
      pergunta: "O que dificulta ler letras escuras sobre fundo escuro?",
      dica: "Pouco contraste. Troque o color da regra .faixa para white.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".faixa" },
      { tipo: "definirPropriedade", seletorRegra: ".faixa", propriedade: "color", valor: "white" },
    ],
  },
  {
    id: "contraste-de-cor-2",
    conceito: "contraste-de-cor",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a faixa na prévia.",
      toque: "Responda olhando a faixa na prévia.",
    },
    siteAlvo: {
      url: "empresadepaisagismo.exemplo",
      titulo: "Paisagismo Verde Casa",
      head: HEAD_CSS,
      body: '<p class="faixa">Projetos de jardim</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.faixa {
  padding: 12px;
  background-color: white;
  color: #d9d9d9;
}
`,
    },
    previsao: {
      pergunta: "Texto cinza-claro sobre fundo branco. Isso é um problema?",
      opcoes: ["Não, fica elegante para todos", "Só em telas de celular", "Sim, pouco contraste dificulta a leitura"],
      correta: 2,
      explicacao: "Contraste é a diferença entre a cor do texto e a do fundo. Pouca diferença deixa o texto difícil de ler, principalmente para quem enxerga menos.",
    },
    ajudas: {
      pergunta: "Cinza claro sobre branco se lê bem?",
      dica: "Não. Falta contraste entre o texto e o fundo.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
