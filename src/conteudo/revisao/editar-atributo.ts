/*
 * Revisão: editar atributo (U4, Fase 1).
 *
 * Ação: trocar um valor (a class de um botão) só para ver o efeito. Previsão: a
 * confusão "editei na árvore, salvei no site".
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_EDITAR_ATRIBUTO: ItemRevisao[] = [
  {
    id: "editar-atributo-1",
    conceito: "editar-atributo",
    tipo: "acao",
    enunciado: {
      mouse: "O botão da promoção está com class 'fechado'. Troque o valor da class para 'aberto' (dois cliques no valor, na árvore).",
      toque: "O botão da promoção está com class 'fechado'. Troque o valor da class para 'aberto' (dois toques no valor, na árvore).",
    },
    siteAlvo: {
      url: "hamburgueriaduasfatias.exemplo",
      titulo: "Hamburgueria Duas Fatias",
      head: HEAD_MINI,
      body: `<h2>Promo de terça</h2>
<button id="promo" class="fechado">Pedir agora</button>`,
    },
    validador: { tipo: "atributo", seletor: "#promo", nome: "class", valor: "aberto" },
    ajudas: {
      pergunta: "Que atributo do botão guarda o nome da class?",
      dica: "É o class, na linha do botão. Dois cliques no valor 'fechado' e escreva aberto.",
    },
    solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#promo", nome: "class", valor: "aberto" }],
  },
  {
    id: "editar-atributo-2",
    conceito: "editar-atributo",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando no que você faz na árvore.",
      toque: "Responda pensando no que você faz na árvore.",
    },
    siteAlvo: {
      url: "petshopcaudaalegre.exemplo",
      titulo: "Pet Shop Cauda Alegre",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Banho e tosa</h2>
<a id="agendar" href="agenda.html">Agendar horário</a>`,
    },
    previsao: {
      pergunta: "Você troca o href do link na árvore, só para ver. O arquivo do site guardado no servidor muda?",
      opcoes: ["Sim, o site inteiro muda", "Sim, mas só para você", "Não, só a sua cópia aberta muda"],
      correta: 2,
      explicacao: "Editar na árvore mexe só na cópia que o seu navegador está mostrando. Recarregando, a página volta ao que estava.",
    },
    ajudas: {
      pergunta: "O F12 mexe no arquivo do servidor ou só na página aberta?",
      dica: "Só na página aberta: é uma cópia. É por isso que dá para testar à vontade.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
