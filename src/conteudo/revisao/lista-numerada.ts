/*
 * Revisão: lista numerada, ol (U3, Fase 3).
 *
 * Ação: uma lista de passos que precisa de ordem virou ul (a direção contrária da
 * fase); previsão: em qual das duas a ordem importa.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_LISTA_NUMERADA: ItemRevisao[] = [
  {
    id: "lista-numerada-1",
    conceito: "lista-numerada",
    tipo: "acao",
    enunciado: {
      mouse: "Os passos da troca de pneu estão numa ul, sem numeração. Troque a tag da lista para ol.",
      toque: "Os passos da troca de pneu estão numa ul, sem numeração. Troque a tag da lista para ol.",
    },
    siteAlvo: {
      url: "borracharia24h.exemplo",
      titulo: "Borracharia 24h",
      head: HEAD_MINI,
      body: `<h2>Trocando o pneu</h2>
<ul id="passos">
  <li>Afrouxe os parafusos</li>
  <li>Levante o carro com o macaco</li>
  <li>Troque o pneu</li>
</ul>`,
    },
    validador: { tipo: "tag", seletor: "#passos", nome: "ol" },
    ajudas: {
      pergunta: "Nos passos de um manual, a ordem importa? Que lista numera?",
      dica: "ol numera, porque a ordem importa. Dois cliques no nome da tag da lista, e troque.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#passos", novaTag: "ol" }],
  },
  {
    id: "lista-numerada-2",
    conceito: "lista-numerada",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a página.",
      toque: "Responda olhando a página.",
    },
    siteAlvo: {
      url: "corridadaribeira.exemplo",
      titulo: "Corrida da Ribeira",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Top 3 da corrida</h2>
<ol>
  <li>Marta Alves</li>
  <li>João Pires</li>
  <li>Rita Nunes</li>
</ol>`,
    },
    previsao: {
      pergunta: "Neste pódio, a ordem dos corredores importa. A lista que a página usou é ol ou ul?",
      opcoes: ["ul, que só põe bolinhas", "ol, que numera os itens", "Tanto faz, as duas numeram"],
      correta: 1,
      explicacao: "A ol numera porque a ordem importa: primeiro, segundo, terceiro. A ul não numera, porque a ordem não importa.",
    },
    ajudas: {
      pergunta: "Se o primeiro lugar virasse o terceiro, mudaria o sentido?",
      dica: "Sim, mudaria. Quando a ordem importa, a lista é a que numera: a ol.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
