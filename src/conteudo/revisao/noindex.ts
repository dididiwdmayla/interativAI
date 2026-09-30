/*
 * Revisão: noindex (S1, Fase 3).
 *
 * Uma ação na direção que a fase deixou por último (pôr o noindex numa
 * página que não deve aparecer: uma promoção vencida) e a previsão da
 * confusão principal ("noindex tira do ar").
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_NOINDEX: ItemRevisao[] = [
  {
    id: "noindex-1",
    conceito: "noindex",
    tipo: "acao",
    enunciado: {
      mouse: "A promoção desta página acabou. Ponha um noindex no head, pelo editor, para ela sair da busca.",
      toque: "A promoção desta página acabou. Ponha um noindex no head, pelo Código, para ela sair da busca.",
    },
    siteAlvo: {
      url: "moveisbarato.exemplo/queima",
      titulo: "Móveis Barato",
      head: cabecaComTitulo("Queima de estoque | Móveis Barato"),
      body: "<h1>Queima de estoque</h1>\n<p>Promoção encerrada em março.</p>",
    },
    modoDocumento: true,
    validador: { tipo: "indexavel", valor: false },
    ajudas: {
      pergunta: "Que meta do head pede para a busca não guardar a página?",
      dica: "<meta name=\"robots\" content=\"noindex\">, escrita no head.",
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: '<meta name="robots" content="noindex">' }],
  },
  {
    id: "noindex-2",
    conceito: "noindex",
    tipo: "previsao",
    enunciado: { mouse: "Responda e confira na aba Busca.", toque: "Responda e confira na aba Busca." },
    siteAlvo: {
      url: "festajunina.exemplo/convite",
      titulo: "Convite da Festa",
      head: cabecaComTitulo("Convite | Festa da Rua", '<meta name="robots" content="noindex">'),
      body: "<h1>Você foi convidado!</h1>\n<p>Festa da rua, sábado às 18h.</p>",
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Esta página tem noindex. Quem recebeu o link pelo celular consegue abrir?",
      opcoes: ["Sim, ela continua no ar", "Não, ela saiu do ar"],
      correta: 0,
      explicacao: "noindex só tira a página da busca. Com o link, ela abre normal: bom para convites e páginas de teste.",
    },
    ajudas: {
      pergunta: "O noindex fala com quem: com os visitantes ou com o robô da busca?",
      dica: "Com o robô: ele pede para não guardar no catálogo. A página em si continua igual.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
