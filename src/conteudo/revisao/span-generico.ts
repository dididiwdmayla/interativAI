/*
 * Revisão: span genérico (U5, Fase 3).
 *
 * Ação: marcar uma palavra no meio do parágrafo com um span; previsão: div ou span
 * para uma palavra só (o que quebra a linha e o que não).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_SPAN_GENERICO: ItemRevisao[] = [
  {
    id: "span-generico-1",
    conceito: "span-generico",
    tipo: "acao",
    enunciado: {
      mouse: "No fim do parágrafo, escreva um span com class 'grifo' e a palavra 'hoje'.",
      toque: "No fim do parágrafo, escreva um span com class 'grifo' e a palavra 'hoje'.",
    },
    siteAlvo: {
      url: "lojaparaisodospets.exemplo",
      titulo: "Loja Paraíso dos Pets",
      head: HEAD_MINI,
      body: '<p id="aviso-loja">Promoção de ração, só até</p>',
    },
    validador: { tipo: "existe", seletor: "#aviso-loja .grifo" },
    ajudas: {
      pergunta: "Que tag marca um pedacinho de texto dentro da frase, sem quebrar a linha?",
      dica: 'O span. Escreva <span class="grifo">hoje</span> dentro do p, no fim.',
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "#aviso-loja", posicao: "fim", html: " <span class=\"grifo\">hoje</span>" }],
  },
  {
    id: "span-generico-2",
    conceito: "span-generico",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a frase na prévia.",
      toque: "Responda olhando a frase na prévia.",
    },
    siteAlvo: {
      url: "docariadapraca.exemplo",
      titulo: "Doceria da Praça",
      head: HEAD_MINI_ESCURO,
      body: '<p>Hoje o bolo de cenoura está <span class="destaque">com desconto</span> até as 18h.</p>',
    },
    previsao: {
      pergunta: "Só 'com desconto' está num span, no meio da frase. O que acontece com a linha?",
      opcoes: ["Continua inteira: o span fica na linha", "Quebra antes e depois do trecho", "O trecho some"],
      correta: 0,
      explicacao: "O span é a versão em linha: ele marca só um pedaço e fica dentro do texto, sem quebrar a linha, diferente da div.",
    },
    ajudas: {
      pergunta: "O span quebra a linha, como a div?",
      dica: "Não: ele fica na linha, é só um gancho de estilo.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
