/*
 * Revisão: index.html (P2, Fase 1).
 *
 * O nome da página de entrada não se testa numa ação do jogo (o .zip é montado
 * pelo Levar pro mundo, na revisão do publicar-site). Os dois itens são previsões.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_INDEX_HTML: ItemRevisao[] = [
  {
    id: "index-html-1",
    conceito: "index-html",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em quem abre o endereço do site.",
      toque: "Responda pensando em quem abre o endereço do site.",
    },
    siteAlvo: {
      url: "oficinadamadeira.exemplo",
      titulo: "Oficina da Madeira",
      head: HEAD_CSS,
      body: `<h1>Oficina da Madeira</h1>
<p>Móveis sob medida.</p>`,
    },
    previsao: {
      pergunta: "Alguém abre o endereço do site, sem escrever nome de arquivo. Que arquivo o servidor mostra?",
      opcoes: ["O style.css", "O primeiro arquivo em ordem alfabética", "O index.html, a página de entrada"],
      correta: 2,
      explicacao: "index.html é o nome da página de entrada: é o arquivo que o servidor mostra quando alguém abre o endereço.",
    },
    ajudas: {
      pergunta: "Qual é o nome padrão da página de entrada de um site?",
      dica: "index.html.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
  {
    id: "index-html-2",
    conceito: "index-html",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando na página de entrada.",
      toque: "Responda pensando na página de entrada.",
    },
    siteAlvo: {
      url: "estacaodospets.exemplo",
      titulo: "Estação dos Pets",
      head: HEAD_CSS,
      body: `<h1>Estação dos Pets</h1>
<p>Banho, tosa e hospedagem.</p>`,
    },
    previsao: {
      pergunta: "Você chamou a página principal de inicio.html. Quem abre só o endereço do site vê a sua página?",
      opcoes: ["Não: o servidor procura o index.html", "Sim, ele acha qualquer nome", "Sim, mas só no celular"],
      correta: 0,
      explicacao: "Sem um nome de arquivo no endereço, o servidor mostra o index.html. Com outro nome, a página não abre sozinha.",
    },
    ajudas: {
      pergunta: "O servidor acha a página de entrada por qual nome?",
      dica: "index.html: com outro nome, ele não a acha sozinho.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
