/*
 * Revisão: tamanho da letra, font-size (E1, Fase 2).
 *
 * Ação: pôr um tamanho em px; previsão: comparar dois tamanhos numa folha.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_TAMANHO_DA_LETRA: ItemRevisao[] = [
  {
    id: "tamanho-da-letra-1",
    conceito: "tamanho-da-letra",
    tipo: "acao",
    enunciado: {
      mouse: "Aumente o título da vitrine: font-size de 28px.",
      toque: "Aumente o título da vitrine: font-size de 28px.",
    },
    siteAlvo: {
      url: "oticavistaclara.exemplo",
      titulo: "Ótica Vista Clara",
      head: HEAD_CSS,
      body: `<h2 class="titulo">Armações novas</h2>
<p>Coleção de verão.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  color: #3d405b;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".titulo", propriedade: "font-size", valor: "28px" },
    ajudas: {
      pergunta: "Qual propriedade muda o tamanho do texto?",
      dica: "font-size. Na regra .titulo, acrescente font-size: 28px.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".titulo" },
      { tipo: "definirPropriedade", seletorRegra: ".titulo", propriedade: "font-size", valor: "28px" },
    ],
  },
  {
    id: "tamanho-da-letra-2",
    conceito: "tamanho-da-letra",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda comparando as duas regras.",
      toque: "Responda comparando as duas regras.",
    },
    siteAlvo: {
      url: "mercadodasflores.exemplo",
      titulo: "Mercado das Flores",
      head: HEAD_CSS,
      body: `<h2 class="titulo">Ofertas</h2>
<p class="nota">Válidas até domingo.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  font-size: 40px;
}

.nota {
  font-size: 12px;
}
`,
    },
    previsao: {
      pergunta: "Qual peça tem as letras maiores?",
      opcoes: [".titulo, com 40px", ".nota, com 12px", "As duas ficam iguais"],
      correta: 0,
      explicacao: "font-size dá o tamanho da letra: quanto maior o número, maior o texto. 40px é bem maior que 12px.",
    },
    ajudas: {
      pergunta: "Quanto maior o número do font-size, maior ou menor a letra?",
      dica: "Maior. Compare 40px com 12px.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
