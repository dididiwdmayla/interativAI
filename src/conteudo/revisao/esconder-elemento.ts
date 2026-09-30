/*
 * Revisão: esconder elemento (U2, Fase 2).
 *
 * A diferença que importa é o espaço: esconder (tecla H) guarda o lugar.
 * A previsão pergunta isso antes de fazer; a ação é num banner no topo de
 * uma loja, outro contexto da fase.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ESCONDER_ELEMENTO: ItemRevisao[] = [
  {
    id: "esconder-elemento-1",
    conceito: "esconder-elemento",
    tipo: "acao",
    enunciado: {
      mouse: "Esconda o banner de promoção, mantendo o espaço dele (tecla H ou o menu do nó).",
      toque: "Esconda o banner de promoção, mantendo o espaço dele (segure o nó e escolha Esconder).",
    },
    siteAlvo: {
      url: "lojadecalcados.exemplo",
      titulo: "Calçados Passo Certo",
      head: HEAD_MINI,
      body: '<p class="banner cartao">Promoção relâmpago: 30% em tênis!</p>\n<h1>Calçados Passo Certo</h1>\n<p>Do 33 ao 44.</p>',
    },
    validador: { tipo: "escondido", seletor: ".banner" },
    ajudas: {
      pergunta: "Qual ferramenta some com a peça mas deixa o lugar dela reservado?",
      dica: "Esconder: selecione o banner e aperte H, ou use o menu do nó. Apagar tiraria o espaço.",
    },
    solucaoDeTeste: [{ tipo: "esconder", seletor: ".banner" }],
  },
  {
    id: "esconder-elemento-2",
    conceito: "esconder-elemento",
    tipo: "previsao",
    enunciado: {
      mouse: "Agora faça: esconda o aviso e confira o que acontece embaixo dele.",
      toque: "Agora faça: esconda o aviso e confira o que acontece embaixo dele.",
    },
    siteAlvo: {
      url: "rodoviariacentral.exemplo",
      titulo: "Rodoviária Central",
      head: HEAD_MINI_ESCURO,
      body: '<h2>Partidas</h2>\n<p class="aviso">Plataforma 3 em reforma.</p>\n<p>Ônibus para a praia às 7h.</p>',
    },
    previsao: {
      pergunta: "Se você esconder o aviso com a tecla H, o texto de baixo sobe para o lugar dele?",
      opcoes: ["Não, o espaço continua ali", "Sim, sobe na hora"],
      correta: 0,
      explicacao: "Esconder deixa a peça invisível, mas o lugar dela continua reservado. Por isso o texto de baixo não sobe.",
    },
    validador: { tipo: "escondido", seletor: ".aviso" },
    ajudas: {
      pergunta: "Qual é a diferença entre esconder e apagar?",
      dica: "Esconder guarda o espaço; apagar tira a peça de vez. Selecione o aviso e aperte H.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 0 },
      { tipo: "esconder", seletor: ".aviso" },
    ],
  },
];
