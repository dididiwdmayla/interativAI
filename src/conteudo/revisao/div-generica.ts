/*
 * Revisão: div genérica (U5, Fase 1).
 *
 * Ação: agrupar peças escrevendo uma div no editor; previsão: uma div sem CSS
 * parece com o quê (nada: só agrupa).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_DIV_GENERICA: ItemRevisao[] = [
  {
    id: "div-generica-1",
    conceito: "div-generica",
    tipo: "acao",
    enunciado: {
      mouse: "No editor, escreva uma div com class 'agenda' e um p dentro, no fim do body.",
      toque: "No editor, escreva uma div com class 'agenda' e um p dentro, no fim do body.",
    },
    siteAlvo: {
      url: "academiaforcaviva.exemplo",
      titulo: "Academia Força Viva",
      head: HEAD_MINI,
      body: `<h2>Academia Força Viva</h2>
<p>Musculação e funcional.</p>`,
    },
    validador: { tipo: "existe", seletor: "div.agenda p" },
    ajudas: {
      pergunta: "Que tag agrupa peças sem dar significado nem visual a elas?",
      dica: 'A div. Escreva <div class="agenda"><p>Segunda a sexta</p></div> depois do último p.',
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "body", posicao: "fim", html: "<div class=\"agenda\"><p>Segunda a sexta, das 6h às 22h</p></div>" }],
  },
  {
    id: "div-generica-2",
    conceito: "div-generica",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a prévia.",
      toque: "Responda olhando a prévia.",
    },
    siteAlvo: {
      url: "confeitariadoceteto.exemplo",
      titulo: "Confeitaria Doce Teto",
      head: HEAD_MINI_ESCURO,
      body: `<div>
  <h2>Bolos</h2>
  <p>Chocolate, cenoura e limão.</p>
</div>`,
    },
    previsao: {
      pergunta: "Tudo está dentro de uma div sem nenhum CSS. Como ela aparece na prévia?",
      opcoes: ["Sem visual nenhum, só agrupando", "Com uma borda em volta", "Em negrito"],
      correta: 0,
      explicacao: "A div é uma caixa sem significado nem estilo: só agrupa. O visual, se houver, vem do CSS.",
    },
    ajudas: {
      pergunta: "A div traz cor ou borda de fábrica?",
      dica: "Não. Ela só agrupa; qualquer visual vem do CSS.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
