/*
 * Revisão: parágrafo (U3, Fase 1).
 *
 * A ação usa o caminho contrário do da fase (texto corrido preso numa div, que
 * precisa virar p); a previsão pergunta qual tag marca um bloco de texto.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_PARAGRAFO: ItemRevisao[] = [
  {
    id: "paragrafo-1",
    conceito: "paragrafo",
    tipo: "acao",
    enunciado: {
      mouse: "O texto de apresentação está numa div. Troque a tag dela para p, o parágrafo.",
      toque: "O texto de apresentação está numa div. Troque a tag dela para p, o parágrafo.",
    },
    siteAlvo: {
      url: "estudiosolnascente.exemplo",
      titulo: "Estúdio Sol Nascente",
      head: HEAD_MINI,
      body: `<h2>Estúdio Sol Nascente</h2>
<div id="apresentacao">Aulas de ioga para todas as idades, em turmas pequenas e com muito cuidado.</div>`,
    },
    validador: { tipo: "tag", seletor: "#apresentacao", nome: "p" },
    ajudas: {
      pergunta: "Que tag marca um bloco de texto corrido?",
      dica: "A tag p é a do parágrafo. Dois cliques no nome da tag, na árvore, e troque de div para p.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#apresentacao", novaTag: "p" }],
  },
  {
    id: "paragrafo-2",
    conceito: "paragrafo",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a página.",
      toque: "Responda olhando a página.",
    },
    siteAlvo: {
      url: "cursoinglesviagem.exemplo",
      titulo: "Inglês para Viagem",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Inglês para viajar sem susto</h2>
<p>Você aprende a pedir comida, perguntar caminhos e reservar hotel.</p>
<p>As turmas têm no máximo oito alunos.</p>`,
    },
    previsao: {
      pergunta: "Dois blocos de texto corrido, um embaixo do outro. Que tag a página usou em cada um?",
      opcoes: ["A tag h2, um título cada", "A tag p, um parágrafo cada", "A tag li, um item cada"],
      correta: 1,
      explicacao: "A tag p marca um bloco de texto corrido: cada p é um parágrafo, e o navegador deixa um espaço entre eles.",
    },
    ajudas: {
      pergunta: "Qual tag aparece nas duas linhas de texto da árvore?",
      dica: "Procure o que vem depois do título, na árvore: as duas linhas têm a mesma tag de texto corrido.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
