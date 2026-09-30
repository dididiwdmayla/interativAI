/*
 * Revisão: leilão do anúncio (S5, Fase 1).
 *
 * Só previsões: o simulador de campanha é um tipo de fase (não cabe num
 * mini-site de item), então as duas perguntas cobrem o conceito. O simulador da unidade é uma simplificação (lance vezes qualidade, números fictícios); o item pergunta o que o Google de verdade considera (conferido em 30/09/2026).
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_LEILAO_DE_ANUNCIO: ItemRevisao[] = [
  {
    id: "leilao-de-anuncio-1",
    conceito: "leilao-de-anuncio",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "padariapaodoce.exemplo",
      titulo: "Padaria Pão Doce",
      body: `<h1>Padaria Pão Doce</h1>
<p>Pães e bolos do dia, em Maringá.</p>`,
    },
    previsao: {
      pergunta: "No Google de verdade, o que decide a posição de um anúncio no leilão?",
      opcoes: [
        "Só o valor do lance",
        "O lance, a qualidade, a concorrência e o contexto da pesquisa",
        "Só o tamanho do orçamento",
      ],
      correta: 1,
      explicacao: "Entram o lance, a qualidade do anúncio e da página, os limites mínimos, a concorrência, o contexto da pesquisa e os recursos do anúncio.",
    },
    ajudas: {
      pergunta: "É só o lance que conta, ou tem mais coisa?",
      dica: "O lance é uma parte. A qualidade do anúncio e da página, a concorrência e o contexto também contam.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
  {
    id: "leilao-de-anuncio-2",
    conceito: "leilao-de-anuncio",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lojadetintasarcoiris.exemplo",
      titulo: "Loja de Tintas Arco-Íris",
      body: `<h1>Loja de Tintas Arco-Íris</h1>
<p>Tintas e materiais de pintura.</p>`,
    },
    previsao: {
      pergunta: "Um anunciante dá o maior lance e o outro tem o melhor anúncio e a melhor página. Quem aparece primeiro?",
      opcoes: [
        "Não dá para saber só pelo lance: a qualidade também pesa",
        "Sempre o do maior lance",
        "Sempre o mais antigo",
      ],
      correta: 0,
      explicacao: "O lance não decide sozinho: o anúncio e a página melhores podem ganhar mesmo com um lance menor.",
    },
    ajudas: {
      pergunta: "O maior lance garante o primeiro lugar?",
      dica: "Lembre do leilão: o lance é uma das coisas que contam, não a única.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
