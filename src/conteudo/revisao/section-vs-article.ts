/*
 * Revisão: section ou article (U5, Fase 2).
 *
 * Ação: a receita que se basta sozinha era uma section; previsão: a tag que agrupa
 * blocos por tema.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_SECTION_VS_ARTICLE: ItemRevisao[] = [
  {
    id: "section-vs-article-1",
    conceito: "section-vs-article",
    tipo: "acao",
    enunciado: {
      mouse: "A receita se basta sozinha e poderia ir para outro site. Troque a tag dela de section para article.",
      toque: "A receita se basta sozinha e poderia ir para outro site. Troque a tag dela de section para article.",
    },
    siteAlvo: {
      url: "docesdatia.exemplo",
      titulo: "Doces da Tia",
      head: HEAD_MINI,
      body: `<section id="receita">
  <h2>Brigadeiro de colher</h2>
  <p>Leite condensado, chocolate e manteiga.</p>
</section>`,
    },
    validador: { tipo: "tag", seletor: "#receita", nome: "article" },
    ajudas: {
      pergunta: "Um conteúdo que faz sentido sozinho é section ou article?",
      dica: "article. Dois cliques no nome da tag da section, e troque.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#receita", novaTag: "article" }],
  },
  {
    id: "section-vs-article-2",
    conceito: "section-vs-article",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a estrutura da página.",
      toque: "Responda olhando a estrutura da página.",
    },
    siteAlvo: {
      url: "escolaviolaviva.exemplo",
      titulo: "Escola Viola Viva",
      head: HEAD_MINI_ESCURO,
      body: `<main>
  <section>
    <h2>Cursos</h2>
    <p>Violão, cavaquinho e viola.</p>
  </section>
  <section>
    <h2>Preços</h2>
    <p>A partir de R$ 90 por mês.</p>
  </section>
</main>`,
    },
    previsao: {
      pergunta: "Cursos e Preços são partes do mesmo assunto, a escola. Que tag agrupa cada parte por tema?",
      opcoes: ["article", "span", "section"],
      correta: 2,
      explicacao: "A section agrupa conteúdo por tema dentro da página. O article é para um conteúdo que se basta sozinho.",
    },
    ajudas: {
      pergunta: "Cursos e Preços fazem sentido fora desta página, sozinhos?",
      dica: "Não: são partes de um todo. Por isso, section.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
