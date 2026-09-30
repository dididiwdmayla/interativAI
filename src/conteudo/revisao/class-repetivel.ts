/*
 * Revisão: class repetível (U4, Fase 3).
 *
 * Ação: dar a mesma class a uma segunda peça; previsão: repetir class é permitido
 * (o contrário do id, que a revisão anterior cobra).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_CLASS_REPETIVEL: ItemRevisao[] = [
  {
    id: "class-repetivel-1",
    conceito: "class-repetivel",
    tipo: "acao",
    enunciado: {
      mouse: "O primeiro cartão tem class 'destaque'. Dê 'cartao destaque' ao segundo também (ele já é 'cartao').",
      toque: "O primeiro cartão tem class 'destaque'. Dê 'cartao destaque' ao segundo também (ele já é 'cartao').",
    },
    siteAlvo: {
      url: "brinquedoteca.exemplo",
      titulo: "Brinquedoteca Ciranda",
      head: HEAD_MINI,
      body: `<div id="c1" class="cartao destaque">Oficina de massinha</div>
<div id="c2" class="cartao">Teatro de fantoches</div>`,
    },
    validador: { tipo: "contagem", seletor: ".destaque", op: ">=", valor: 2 },
    ajudas: {
      pergunta: "Uma class pode ser usada em mais de uma peça?",
      dica: "Pode: é para isso que ela serve. Dois cliques no valor do class do segundo cartão e escreva cartao destaque.",
    },
    solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#c2", nome: "class", valor: "cartao destaque" }],
  },
  {
    id: "class-repetivel-2",
    conceito: "class-repetivel",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a árvore.",
      toque: "Responda olhando a árvore.",
    },
    siteAlvo: {
      url: "feirinhadomar.exemplo",
      titulo: "Feirinha do Mar",
      head: HEAD_MINI_ESCURO,
      body: `<p class="preco">Camarão: R$ 40</p>
<p class="preco">Lula: R$ 32</p>
<p class="preco">Polvo: R$ 55</p>`,
    },
    previsao: {
      pergunta: "Os três preços usam class='preco'. Isso é um problema?",
      opcoes: ["Sim, class precisa ser única", "Sim, só pode repetir uma vez", "Não, uma class pode se repetir"],
      correta: 2,
      explicacao: "Uma class pode repetir em quantas peças você quiser, para tratar todas juntas. Quem não pode repetir é o id.",
    },
    ajudas: {
      pergunta: "Para tratar várias peças parecidas do mesmo jeito, id ou class?",
      dica: "Class. Ela foi feita para se repetir.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
