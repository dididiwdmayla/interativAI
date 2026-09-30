/*
 * Revisão: evento de medição (S4, Fase 1).
 *
 * Uma ação (dar o data-evento a um botão e clicar nele, na aba Medição) e
 * uma previsão sobre o que um data-evento faz.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_EVENTO_DE_MEDICAO: ItemRevisao[] = [
  {
    id: "evento-de-medicao-1",
    conceito: "evento-de-medicao",
    tipo: "acao",
    enunciado: {
      mouse: "O botão Baixar cardápio não é medido. Dê a ele o data-evento baixar_cardapio e clique nele na prévia.",
      toque: "O botão Baixar cardápio não é medido. Dê a ele o data-evento baixar_cardapio e toque nele na prévia.",
    },
    siteAlvo: {
      url: "pizzariaborda.exemplo",
      titulo: "Pizzaria Borda Recheada",
      body: `<h1>Pizzaria Borda Recheada</h1>
<p>Pizza com borda recheada, no forno a lenha.</p>
<button id="baixar" type="button">Baixar cardápio</button>`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "atributo", seletor: "#baixar", nome: "data-evento", valor: "baixar_cardapio" },
        { tipo: "eventoMedido", nome: "baixar_cardapio" },
      ],
    },
    ajudas: {
      pergunta: "O que o botão precisa ter para a medição contar os cliques nele?",
      dica: "Um atributo data-evento com o nome. Depois, um clique nele na prévia.",
    },
    solucaoDeTeste: [
      { tipo: "adicionarAtributo", seletor: "#baixar", nome: "data-evento", valor: "baixar_cardapio" },
      { tipo: "clicarNaPrevia", seletor: "#baixar" },
    ],
  },
  {
    id: "evento-de-medicao-2",
    conceito: "evento-de-medicao",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "floriculturagirassol.exemplo",
      titulo: "Floricultura Girassol",
      body: `<h1>Floricultura Girassol</h1>
<button type="button" data-evento="ver_buques">Ver buquês</button>`,
    },
    previsao: {
      pergunta: "Este botão tem data-evento=\"ver_buques\". O que acontece quando alguém clica nele?",
      opcoes: ["A página muda de cor", "A medição registra um evento chamado ver_buques", "O botão desaparece"],
      correta: 1,
      explicacao: "O data-evento dá um nome ao clique: a medição registra o evento, e o dono depois conta quantos foram.",
    },
    ajudas: {
      pergunta: "Para que serve o nome dentro do data-evento?",
      dica: "É o nome que aparece no relatório de medição.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
