/*
 * Revisão: ênfase leve, em (U3, Fase 2).
 *
 * Ação: trocar o i (só itálico) pelo em numa frase de tom (diferente do strong da
 * revisão anterior). Previsão: o que o em comunica.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ENFASE_LEVE: ItemRevisao[] = [
  {
    id: "enfase-leve-1",
    conceito: "enfase-leve",
    tipo: "acao",
    enunciado: {
      mouse: "A palavra 'nunca' tem tom de ênfase, mas está num i. Troque a tag dela para em.",
      toque: "A palavra 'nunca' tem tom de ênfase, mas está num i. Troque a tag dela para em.",
    },
    siteAlvo: {
      url: "sorveteriapolar.exemplo",
      titulo: "Sorveteria Polar",
      head: HEAD_MINI,
      body: `<h2>Sabores da casa</h2>
<p>Tem gente que <i id="palavra">nunca</i> enjoa de doce de leite.</p>`,
    },
    validador: { tipo: "tag", seletor: "#palavra", nome: "em" },
    ajudas: {
      pergunta: "Qual tag marca um tom diferente na frase, e não só o itálico?",
      dica: "A tag em é a ênfase. O i só deixa em itálico, sem dizer que é especial.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#palavra", novaTag: "em" }],
  },
  {
    id: "enfase-leve-2",
    conceito: "enfase-leve",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a frase na página.",
      toque: "Responda olhando a frase na página.",
    },
    siteAlvo: {
      url: "livrarianuvem.exemplo",
      titulo: "Livraria Nuvem",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Dica de leitura</h2>
<p>Este livro é <em>muito</em> melhor do que o filme.</p>`,
    },
    previsao: {
      pergunta: "Na frase, o muito está num em. O que essa tag diz sobre a palavra?",
      opcoes: ["Que ela tem um tom de ênfase", "Que é um título", "Que é um link"],
      correta: 0,
      explicacao: "O em marca um tom diferente na frase, como quando você fala mais forte uma palavra. O i só deixaria em itálico, sem dizer nada.",
    },
    ajudas: {
      pergunta: "Quando você fala 'MUITO melhor', o que muda na frase?",
      dica: "O tom. É isso que o em marca; o i só copia o visual.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
