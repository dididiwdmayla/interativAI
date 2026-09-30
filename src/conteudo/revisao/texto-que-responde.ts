/*
 * Revisão: texto que responde (S2, Fase 2).
 *
 * Uma ação (reescrever um texto vago com o prazo que a pessoa busca) e uma
 * previsão sobre qual texto responde uma busca de horário.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_TEXTO_QUE_RESPONDE: ItemRevisao[] = [
  {
    id: "texto-que-responde-1",
    conceito: "texto-que-responde",
    tipo: "acao",
    enunciado: {
      mouse: "Alguém busca \"em quanto tempo fica pronto óculos de grau\". Reescreva o parágrafo vago com o prazo.",
      toque: "Alguém busca \"em quanto tempo fica pronto óculos de grau\". Reescreva o parágrafo vago (toque no texto, na árvore) com o prazo.",
    },
    siteAlvo: {
      url: "oticavisaoclara.exemplo",
      titulo: "Ótica Visão Clara",
      body: `<h1>Ótica Visão Clara</h1>
<p id="prazo">Trabalhamos com muito carinho para você.</p>
<p>Armações, lentes e consertos.</p>`,
    },
    validador: { tipo: "textoDiferenteDoInicial", seletor: "#prazo" },
    ajudas: {
      pergunta: "O parágrafo diz quando os óculos ficam prontos?",
      dica: "Escreva a resposta que a pessoa buscou: o prazo, em dias.",
    },
    solucaoDeTeste: [
      {
        tipo: "definirTexto",
        seletor: "#prazo",
        valor: "Óculos de grau prontos em até 3 dias úteis, com lentes de vidro ou resina.",
      },
    ],
  },
  {
    id: "texto-que-responde-2",
    conceito: "texto-que-responde",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lavanderiabolhaazul.exemplo",
      titulo: "Lavanderia Bolha Azul",
      body: `<h1>Lavanderia Bolha Azul</h1>
<p>A melhor lavanderia da região.</p>
<p>Lavamos, secamos e passamos.</p>`,
    },
    previsao: {
      pergunta: "Alguém busca \"lavanderia aberta domingo\". Qual texto da página responde melhor?",
      opcoes: [
        "Abrimos todos os dias, inclusive domingo, das 8h às 14h",
        "A melhor lavanderia da região",
        "Lavanderia, lavanderia, lavanderia",
      ],
      correta: 0,
      explicacao: "A pessoa quer saber se abre no domingo. O texto que diz os dias e as horas responde a busca, e é o que ela quer ler.",
    },
    ajudas: {
      pergunta: "O que a pessoa quer descobrir com essa busca?",
      dica: "Procure o texto que fala de dia e de hora, as palavras da pergunta.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
