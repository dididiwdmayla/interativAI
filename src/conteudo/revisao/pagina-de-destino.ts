/*
 * Revisão: página de destino (S5, Fase 3).
 *
 * Uma ação (melhorar a página com title e meta description: uma "página de
 * destino" mais clara) e uma previsão sobre o que ela decide. A ação não usa o
 * simulador, só o Resultado na busca, no modo documento.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_PAGINA_DE_DESTINO: ItemRevisao[] = [
  {
    id: "pagina-de-destino-1",
    conceito: "pagina-de-destino",
    tipo: "acao",
    enunciado: {
      mouse: "A página de destino do anúncio não tem meta description. Escreva uma, sem corte, falando da entrega.",
      toque: "A página de destino do anúncio não tem meta description. Escreva uma no Código, sem corte, falando da entrega.",
    },
    siteAlvo: {
      url: "brigadeiroscasadoces.exemplo",
      titulo: "Casa dos Brigadeiros",
      head: cabecaComTitulo("Casa dos Brigadeiros | Brigadeiros gourmet em Vitória"),
      body: `<h1>Casa dos Brigadeiros</h1>
<p>Brigadeiros gourmet feitos na hora.</p>
<p>Entregamos em Vitória em até 1 hora.</p>`,
    },
    modoDocumento: true,
    validador: { tipo: "resultadoBusca", campo: "descricao", contem: "entrega", semCorte: true },
    ajudas: {
      pergunta: "O que o anúncio promete, e a página diz isso logo?",
      dica: "Crie a meta description no head, com a entrega, curta o bastante para não cortar.",
    },
    solucaoDeTeste: [
      {
        tipo: "inserirHTML",
        seletor: "title",
        posicao: "depois",
        html: "<meta name=\"description\" content=\"Brigadeiros gourmet com entrega em Vitória em até 1 hora. Peça pelo WhatsApp.\">",
      },
    ],
  },
  {
    id: "pagina-de-destino-2",
    conceito: "pagina-de-destino",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "clinicaodontosorriso.exemplo",
      titulo: "Clínica Odonto Sorriso",
      body: `<h1>Clínica Odonto Sorriso</h1>
<p>Limpeza, clareamento e aparelho.</p>`,
    },
    previsao: {
      pergunta: "O anúncio leva a uma página lenta, confusa e sem botão de agendar. O que tende a acontecer?",
      opcoes: [
        "Muitos cliques viram clientes",
        "Muitos cliques, poucos clientes: o dinheiro do clique se perde",
        "A página melhora sozinha",
      ],
      correta: 1,
      explicacao: "A página de destino decide quantos cliques viram clientes. Uma página ruim faz o clique pago não render.",
    },
    ajudas: {
      pergunta: "O que acontece com quem clica e cai numa página que não ajuda?",
      dica: "Ele vai embora: pagou o clique e não virou cliente.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
