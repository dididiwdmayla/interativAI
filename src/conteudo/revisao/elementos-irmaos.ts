/*
 * Revisão: elementos irmãos (U2, Fase 3).
 *
 * Irmãos são peças com o mesmo pai, lado a lado. A previsão nomeia a
 * relação; a ação pede o irmão que vem logo depois do título, num cartão.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ELEMENTOS_IRMAOS: ItemRevisao[] = [
  {
    id: "elementos-irmaos-1",
    conceito: "elementos-irmaos",
    tipo: "previsao",
    enunciado: {
      mouse: "Olhe a lista na árvore e responda.",
      toque: "Olhe a lista na árvore e responda.",
    },
    siteAlvo: {
      url: "hortacomunitaria.exemplo",
      titulo: "Horta Comunitária",
      head: HEAD_MINI,
      body: "<h2>Plantio de outubro</h2>\n<ul>\n  <li>Alface</li>\n  <li>Cenoura</li>\n  <li>Tomate</li>\n</ul>",
    },
    previsao: {
      pergunta: "Os três li estão lado a lado, dentro da mesma ul. O que eles são um do outro?",
      opcoes: ["Irmãos", "Pai e filho", "Nada, não têm relação"],
      correta: 0,
      explicacao: "Irmãos: têm o mesmo pai (a ul) e ficam no mesmo andar da árvore, um depois do outro.",
    },
    ajudas: {
      pergunta: "Quem é o pai de cada li?",
      dica: "Peças com o mesmo pai, no mesmo andar, são irmãs.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "elementos-irmaos-2",
    conceito: "elementos-irmaos",
    tipo: "acao",
    enunciado: {
      mouse: "Selecione o irmão do título do cartão: o parágrafo que vem logo depois dele.",
      toque: "Toque no irmão do título do cartão: o parágrafo que vem logo depois dele.",
    },
    siteAlvo: {
      url: "museudotrem.exemplo",
      titulo: "Museu do Trem",
      head: HEAD_MINI_ESCURO,
      body: '<div class="cartao">\n  <h2>Maria Fumaça</h2>\n  <p>Construída em 1920.</p>\n  <a href="#visita">Agendar visita</a>\n</div>',
    },
    validador: { tipo: "selecionado", seletor: "h2 + p" },
    ajudas: {
      pergunta: "No mesmo andar do h2, qual peça vem logo embaixo dele?",
      dica: "Irmãos ficam no mesmo recuo da árvore. O p logo depois do h2 é o irmão que falta.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "h2 + p" }],
  },
];
