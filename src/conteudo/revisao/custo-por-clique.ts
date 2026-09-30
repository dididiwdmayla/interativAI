/*
 * Revisão: custo por clique (S5, Fase 1).
 *
 * Só previsões, pelo mesmo motivo do leilão: o simulador é um tipo de fase.
 * O simulador da unidade é uma simplificação (lance vezes qualidade, números fictícios); o item pergunta o que o Google de verdade considera (conferido em 30/09/2026).
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_CUSTO_POR_CLIQUE: ItemRevisao[] = [
  {
    id: "custo-por-clique-1",
    conceito: "custo-por-clique",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "oficinamecanicasilva.exemplo",
      titulo: "Oficina Mecânica Silva",
      body: `<h1>Oficina Mecânica Silva</h1>
<p>Revisão, freios e troca de óleo, em Bauru.</p>`,
    },
    previsao: {
      pergunta: "O lance máximo por clique é R$ 3,00. Quanto o anunciante paga por clique?",
      opcoes: [
        "Sempre exatamente R$ 3,00",
        "Costuma ser menos do que o lance máximo",
        "Sempre mais do que o lance máximo",
      ],
      correta: 1,
      explicacao: "O lance é o máximo que o anunciante aceita pagar. O custo real costuma ficar abaixo dele.",
    },
    ajudas: {
      pergunta: "O lance é o que você paga, ou o máximo que aceita pagar?",
      dica: "É o máximo que se aceita pagar; o custo real costuma ficar abaixo.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
  {
    id: "custo-por-clique-2",
    conceito: "custo-por-clique",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "clinicadeestetica.exemplo",
      titulo: "Clínica Bela Pele",
      body: `<h1>Clínica Bela Pele</h1>
<p>Limpeza de pele e massagem relaxante.</p>`,
    },
    previsao: {
      pergunta: "Dois anunciantes disputam a mesma palavra. O de qualidade mais alta costuma pagar...",
      opcoes: ["Mais por clique", "O mesmo, sempre", "Menos por clique"],
      correta: 2,
      explicacao: "Anúncios de qualidade mais alta costumam pagar menos por clique.",
    },
    ajudas: {
      pergunta: "Qualidade alta atrapalha ou ajuda a pagar menos?",
      dica: "A qualidade costuma baratear o clique.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
