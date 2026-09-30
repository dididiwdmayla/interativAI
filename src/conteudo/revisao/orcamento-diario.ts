/*
 * Revisão: orçamento diário (S5, Fase 2).
 *
 * Só previsões: o orçamento é um campo do simulador de campanha. Uma sobre o
 * que acontece quando a verba do dia acaba e outra sobre o efeito de subir a verba.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_ORCAMENTO_DIARIO: ItemRevisao[] = [
  {
    id: "orcamento-diario-1",
    conceito: "orcamento-diario",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "sorveteriaraiodesol.exemplo",
      titulo: "Sorveteria Raio de Sol",
      body: `<h1>Sorveteria Raio de Sol</h1>
<p>Sorvete artesanal em 20 sabores.</p>`,
    },
    previsao: {
      pergunta: "O orçamento diário do anúncio acaba às 11h. O que acontece com o anúncio?",
      opcoes: [
        "Ele para de aparecer até o dia seguinte",
        "Continua aparecendo, sem custo",
        "Aparece em todas as posições",
      ],
      correta: 0,
      explicacao: "O orçamento diário é um teto de gasto: quando a verba do dia acaba, o anúncio deixa de aparecer.",
    },
    ajudas: { pergunta: "O orçamento é um teto ou uma meta mínima?", dica: "É um teto de gasto por dia." },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "orcamento-diario-2",
    conceito: "orcamento-diario",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "livrariapapelaria.exemplo",
      titulo: "Papelaria Ponto Certo",
      body: `<h1>Papelaria Ponto Certo</h1>
<p>Material escolar e de escritório.</p>`,
    },
    previsao: {
      pergunta: "Uma campanha é limitada pelo orçamento. Subir o orçamento do dia faz o quê?",
      opcoes: [
        "Baixa a posição do anúncio",
        "Deixa o anúncio aparecer por mais tempo e receber mais cliques",
        "Muda a página de destino",
      ],
      correta: 1,
      explicacao: "Com mais verba no dia, o anúncio continua aparecendo depois do ponto em que antes acabava, e recebe mais cliques.",
    },
    ajudas: {
      pergunta: "O que o orçamento limita: a posição ou a quantidade de cliques do dia?",
      dica: "Ele limita quanto se gasta, então quantos cliques cabem no dia.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
