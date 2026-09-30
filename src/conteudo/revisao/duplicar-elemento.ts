/*
 * Revisão: duplicar elemento (U2, Fase 3).
 *
 * Duplicar copia a peça INTEIRA, com tudo dentro. Um item de lista e um
 * cartão com título e preço (a cópia leva os dois).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_DUPLICAR_ELEMENTO: ItemRevisao[] = [
  {
    id: "duplicar-elemento-1",
    conceito: "duplicar-elemento",
    tipo: "acao",
    enunciado: {
      mouse: "Duplique um item da lista de presentes (menu do nó ou Shift+Alt+seta para baixo).",
      toque: "Duplique um item da lista de presentes (segure o nó e escolha Duplicar).",
    },
    siteAlvo: {
      url: "listadechadecasa.exemplo",
      titulo: "Chá de Casa Nova",
      head: HEAD_MINI,
      body: "<h2>Lista de presentes</h2>\n<ul>\n  <li>Jogo de toalhas</li>\n  <li>Panela de pressão</li>\n  <li>Liquidificador</li>\n</ul>",
    },
    validador: { tipo: "contagem", seletor: "li", op: ">=", valor: 4 },
    ajudas: {
      pergunta: "Qual ferramenta faz uma cópia da peça logo depois dela?",
      dica: "Duplicar: selecione um li e use o menu do nó, ou Shift+Alt+seta para baixo.",
    },
    solucaoDeTeste: [{ tipo: "duplicar", seletor: "li" }],
  },
  {
    id: "duplicar-elemento-2",
    conceito: "duplicar-elemento",
    tipo: "acao",
    enunciado: {
      mouse: "Duplique o cartão do plano inteiro, para a página mostrar dois planos.",
      toque: "Duplique o cartão do plano inteiro, para a página mostrar dois planos.",
    },
    siteAlvo: {
      url: "internetveloz.exemplo",
      titulo: "Internet Veloz",
      head: HEAD_MINI_ESCURO,
      body: '<h1>Planos</h1>\n<div class="plano cartao">\n  <h2>Plano 300 mega</h2>\n  <p>99 reais por mês</p>\n</div>',
    },
    validador: { tipo: "contagem", seletor: ".plano", op: "==", valor: 2 },
    ajudas: {
      pergunta: "Para copiar o cartão com o título e o preço juntos, qual peça você seleciona?",
      dica: "A div.plano, a de fora: duplicar copia a peça com tudo o que mora dentro dela.",
    },
    solucaoDeTeste: [{ tipo: "duplicar", seletor: ".plano" }],
  },
];
