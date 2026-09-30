/*
 * Revisão: conversão (S4, Fase 1).
 *
 * Uma ação (medir o envio do pedido de agendamento como conversão) e uma
 * previsão sobre qual clique é uma conversão.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_CONVERSAO: ItemRevisao[] = [
  {
    id: "conversao-1",
    conceito: "conversao",
    tipo: "acao",
    enunciado: {
      mouse: "Agendar horário é a conversão desta página. Meça o botão Agendar com o evento agendou e clique nele.",
      toque: "Agendar horário é a conversão desta página. Meça o botão Agendar com o evento agendou e toque nele.",
    },
    siteAlvo: {
      url: "barbeariatopo.exemplo",
      titulo: "Barbearia Topo",
      body: `<h1>Barbearia Topo</h1>
<p>Corte e barba com hora marcada.</p>
<button id="agendar" type="button">Agendar horário</button>`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "atributo", seletor: "#agendar", nome: "data-evento", valor: "agendou" },
        { tipo: "eventoMedido", nome: "agendou" },
      ],
    },
    ajudas: {
      pergunta: "Qual clique desta página mostra que a pessoa virou cliente?",
      dica: "O do botão Agendar horário. Dê a ele um data-evento e clique nele na prévia.",
    },
    solucaoDeTeste: [
      { tipo: "adicionarAtributo", seletor: "#agendar", nome: "data-evento", valor: "agendou" },
      { tipo: "clicarNaPrevia", seletor: "#agendar" },
    ],
  },
  {
    id: "conversao-2",
    conceito: "conversao",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "mercadinhoboavista.exemplo",
      titulo: "Mercadinho Boa Vista",
      body: `<h1>Mercadinho Boa Vista</h1>
<p>Entregamos em casa. Peça pelo telefone.</p>`,
    },
    previsao: {
      pergunta: "Qual destas é uma conversão para um mercadinho que entrega em casa?",
      opcoes: [
        "Rolar a página até o fim",
        "Abrir a página inicial",
        "Ligar para pedir a entrega depois de ver a página",
      ],
      correta: 2,
      explicacao: "Conversão é uma ação importante depois do clique: compra, ligação ou cadastro. Abrir ou rolar a página é só visita.",
    },
    ajudas: {
      pergunta: "Qual das três ações traz dinheiro para o negócio?",
      dica: "Conversão é a ação importante, como comprar, ligar ou se cadastrar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
