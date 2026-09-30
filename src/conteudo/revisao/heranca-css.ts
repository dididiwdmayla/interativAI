/*
 * Revisão: herança (E4, Fase 2).
 *
 * Ação: pintar o pai e deixar os filhos herdarem; previsão: a cor que uma peça sem
 * regra própria recebe.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_HERANCA_CSS: ItemRevisao[] = [
  {
    id: "heranca-css-1",
    conceito: "heranca-css",
    tipo: "acao",
    enunciado: {
      mouse: "Deixe todo o texto do cartão marrom (brown) mexendo numa regra só, a do próprio cartão.",
      toque: "Deixe todo o texto do cartão marrom (brown) mexendo numa regra só, a do próprio cartão.",
    },
    siteAlvo: {
      url: "empadaodaluzia.exemplo",
      titulo: "Empadão da Luzia",
      head: HEAD_CSS,
      body: `<div class="cartao">
  <h3 id="t1">Empadão de frango</h3>
  <p id="t2">Massa crocante e recheio cremoso.</p>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.cartao {
  padding: 12px;
  background-color: #fdf3e1;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: "#t1", propriedade: "color", valor: "brown" },
        { tipo: "valorEfetivo", seletor: "#t2", propriedade: "color", valor: "brown" },
      ],
    },
    ajudas: {
      pergunta: "Como pintar o texto de tudo que está dentro do cartão, mexendo em uma regra?",
      dica: "A cor é herdada. Acrescente color: brown na regra .cartao.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".cartao" },
      { tipo: "definirPropriedade", seletorRegra: ".cartao", propriedade: "color", valor: "brown" },
    ],
  },
  {
    id: "heranca-css-2",
    conceito: "heranca-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o parágrafo.",
      toque: "Responda olhando o parágrafo.",
    },
    siteAlvo: {
      url: "livrariaoscarnaval.exemplo",
      titulo: "Livraria Escada Azul",
      head: HEAD_CSS,
      body: `<section class="capa">
  <p class="sinopse">Uma aventura no mar.</p>
</section>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.capa {
  color: teal;
}
`,
    },
    previsao: {
      pergunta: "O .sinopse não tem regra de cor. Que cor têm as letras dele?",
      opcoes: ["Preta, o padrão", "Teal, herdada da .capa", "Sem cor nenhuma"],
      correta: 1,
      explicacao: "Sem regra própria, a peça herda as propriedades herdáveis (como color) do ancestral mais perto.",
    },
    ajudas: {
      pergunta: "Quem tem a cor do texto quando a peça não define uma?",
      dica: "O pai dela. A cor passa de pai para filho.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
