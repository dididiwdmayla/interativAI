/*
 * Revisão: href do link (U4, Fase 1).
 *
 * Ação: corrigir um link que aponta para lugar nenhum. Previsão: para onde ele leva
 * quando o texto e o href dizem coisas diferentes.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_LINK_HREF: ItemRevisao[] = [
  {
    id: "link-href-1",
    conceito: "link-href",
    tipo: "acao",
    enunciado: {
      mouse: "O link 'Ver o cardápio' não leva a lugar nenhum. Faça o href dele apontar para cardapio.html.",
      toque: "O link 'Ver o cardápio' não leva a lugar nenhum. Faça o href dele apontar para cardapio.html.",
    },
    siteAlvo: {
      url: "restaurantepeixefresco.exemplo",
      titulo: "Restaurante Peixe Fresco",
      head: HEAD_MINI,
      body: `<h2>Almoço de domingo</h2>
<p><a id="link-cardapio" href="#">Ver o cardápio</a></p>`,
    },
    validador: { tipo: "atributo", seletor: "#link-cardapio", nome: "href", valor: "cardapio.html" },
    ajudas: {
      pergunta: "Que atributo do link diz para onde ele leva?",
      dica: "O href. Dois cliques no valor '#' e escreva cardapio.html.",
    },
    solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#link-cardapio", nome: "href", valor: "cardapio.html" }],
  },
  {
    id: "link-href-2",
    conceito: "link-href",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a linha do link na árvore.",
      toque: "Responda olhando a linha do link na árvore.",
    },
    siteAlvo: {
      url: "oficinadaluz.exemplo",
      titulo: "Oficina da Luz",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Orçamento grátis</h2>
<p><a href="whatsapp.html">Clique aqui</a></p>`,
    },
    previsao: {
      pergunta: "O texto do link é 'Clique aqui' e o href é whatsapp.html. Para onde ele leva?",
      opcoes: ["Para whatsapp.html", "Para um lugar chamado 'Clique aqui'", "Fica na mesma página"],
      correta: 0,
      explicacao: "Quem manda é o href: ele diz o endereço. O texto é só o que a pessoa lê na tela.",
    },
    ajudas: {
      pergunta: "Qual dos dois manda no destino: o texto ou o href?",
      dica: "O href. O texto do link é só a etiqueta que aparece na tela.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
