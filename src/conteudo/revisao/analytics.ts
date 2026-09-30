/*
 * Revisão: Analytics (S4, Fase 1).
 *
 * Só previsões: o Analytics é um programa externo, que o jogo só simula pela
 * aba Medição (e o código de medição de verdade vem na ilha Páginas vivas),
 * então não há gesto real para uma ação. As perguntas cobrem o que ele mede
 * e a diferença para o Search Console.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_ANALYTICS: ItemRevisao[] = [
  {
    id: "analytics-1",
    conceito: "analytics",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "oficinadobrinquedo.exemplo",
      titulo: "Oficina do Brinquedo",
      body: `<h1>Oficina do Brinquedo</h1>
<p>Brinquedos de madeira feitos à mão.</p>
<button type="button">Comprar agora</button>`,
    },
    previsao: {
      pergunta: "O dono quer saber quantas pessoas clicaram em \"Comprar agora\" no site. O que ajuda?",
      opcoes: [
        "Uma ferramenta de análise, como o Analytics, que mede o que se faz no site",
        "O perfil da empresa no Google",
        "Aumentar a letra do botão",
      ],
      correta: 0,
      explicacao: "Programas de análise, como o Analytics, contam as visitas e os cliques: mostram o que as pessoas fazem no site depois que entram.",
    },
    ajudas: {
      pergunta: "A pergunta é sobre o que as pessoas FAZEM no site, ou sobre como o site aparece na busca?",
      dica: "O que acontece dentro do site, depois da visita, é o trabalho da ferramenta de análise.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "analytics-2",
    conceito: "analytics",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "padariaespiga.exemplo",
      titulo: "Padaria Espiga",
      body: `<h1>Padaria Espiga</h1>
<p>Pães e bolos do dia.</p>`,
    },
    previsao: {
      pergunta: "O que uma ferramenta de análise, como o Analytics, NÃO mostra por si só?",
      opcoes: [
        "Quantas visitas o site recebeu",
        "O que as pessoas clicaram no site",
        "Se o cliente gostou do sabor do pão, na hora de comer",
      ],
      correta: 2,
      explicacao: "Ela conta visitas e ações no site (de onde vieram, o que clicaram). A medição não chega ao que acontece fora do site, como o sabor do pão.",
    },
    ajudas: {
      pergunta: "Qual das três coisas acontece fora do site, onde a medição não chega?",
      dica: "Pense no que acontece na tela do site: visitas e cliques.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
