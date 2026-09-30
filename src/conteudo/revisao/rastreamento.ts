/*
 * Revisão: rastreamento (S1, Fase 1).
 *
 * Conceito sem gesto no painel: os dois itens são previsões, em situações
 * que a fase não mostrou (uma página sem nenhum link apontando para ela e
 * uma mudança de preço que demora a aparecer). A confusão atacada é a
 * mesma da fase: "o Google lê o site na hora".
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_RASTREAMENTO: ItemRevisao[] = [
  {
    id: "rastreamento-1",
    conceito: "rastreamento",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lojanova.exemplo/lancamento",
      titulo: "Loja Nova",
      head: cabecaComTitulo("Lançamento | Loja Nova"),
      body: "<h1>Coleção de verão</h1>\n<p>Página publicada ontem. Nenhuma outra página tem link para cá.</p>",
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Esta página foi publicada ontem e nenhuma outra página tem link para ela. Como o robô da busca chega aqui?",
      opcoes: ["Só se algum link levar até ela (ou o dono avisar a busca)", "Ele descobre na hora todo site novo", "Não chega nunca, de jeito nenhum"],
      correta: 0,
      explicacao: "O robô anda de link em link. Página sem link apontando é difícil de achar; o dono pode avisar a busca pelas ferramentas dela.",
    },
    ajudas: {
      pergunta: "Como o robô passa de uma página para outra?",
      dica: "Rastrear é visitar e seguir os links que a página tem, um depois do outro.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "rastreamento-2",
    conceito: "rastreamento",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "hortifruti.exemplo",
      titulo: "Hortifrúti do Zé",
      head: cabecaComTitulo("Hortifrúti do Zé | Frutas e verduras"),
      body: '<h1>Hortifrúti do Zé</h1>\n<p class="preco">Banana: 4 reais o quilo (preço novo, trocado agora).</p>',
    },
    modoDocumento: true,
    previsao: {
      pergunta: "O Zé trocou o preço da banana no site agora. Quando o resultado da busca mostra o preço novo?",
      opcoes: ["Depois que o robô visitar a página de novo", "No mesmo segundo", "Nunca, o resultado não muda"],
      correta: 0,
      explicacao: "A busca mostra o que guardou na última visita do robô. A mudança aparece depois que ele volta, o que pode levar dias.",
    },
    ajudas: {
      pergunta: "De onde a busca tira o texto que mostra: do site agora, ou de outro lugar?",
      dica: "Do catálogo, com o que o robô viu na última visita.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
