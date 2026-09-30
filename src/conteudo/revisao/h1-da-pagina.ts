/*
 * Revisão: h1 da página (S2, Fase 1).
 *
 * Uma ação num site novo (a marca de uma pizzaria que é só uma div grande:
 * renomear a tag para h1) e uma previsão sobre uma página com vários h1.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_H1_DA_PAGINA: ItemRevisao[] = [
  {
    id: "h1-da-pagina-1",
    conceito: "h1-da-pagina",
    tipo: "acao",
    enunciado: {
      mouse: "O nome da pizzaria é uma div grande, mas não é título. Renomeie a tag dele para h1.",
      toque: "O nome da pizzaria é uma div grande, mas não é título. Renomeie a tag dele para h1 (toque na tag, na árvore).",
    },
    siteAlvo: {
      url: "pizzariafornoalenha.exemplo",
      titulo: "Pizzaria Forno a Lenha",
      body: `<div id="marca" style="font-size: 28px; font-weight: bold">Pizzaria Forno a Lenha</div>
<p>Massa fina no forno a lenha, com entrega em Santos.</p>
<h2>Sabores</h2>
<ul>
  <li>Marguerita</li>
  <li>Calabresa</li>
</ul>`,
    },
    validador: { tipo: "tag", seletor: "#marca", nome: "h1" },
    ajudas: {
      pergunta: "Qual peça é o nome da página, e a etiqueta dela diz que é um título?",
      dica: "O h1 é o título principal. Dois cliques no nome da tag, na árvore, trocam ela sem perder o texto.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#marca", novaTag: "h1" }],
  },
  {
    id: "h1-da-pagina-2",
    conceito: "h1-da-pagina",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "academiacorpoemmovimento.exemplo",
      titulo: "Academia Corpo em Movimento",
      body: `<h1>Academia Corpo em Movimento</h1>
<p>Musculação, dança e funcional.</p>
<h1>Planos</h1>
<p>Mensal a partir de R$ 89.</p>
<h1>Contato</h1>
<p>Rua das Palmeiras, 300.</p>`,
    },
    previsao: {
      pergunta: "A página tem três h1: o nome, \"Planos\" e \"Contato\". O que é melhor?",
      opcoes: [
        "Só o nome como h1; \"Planos\" e \"Contato\" como h2",
        "Deixar tudo h1: quanto mais, melhor",
        "Só \"Contato\" como h1, porque vem por último",
      ],
      correta: 0,
      explicacao: "O h1 diz do que a página trata, e só existe um. Os outros títulos descem para h2, como capítulos.",
    },
    ajudas: {
      pergunta: "Se a página tem três títulos principais, qual deles diz do que ela trata?",
      dica: "Um h1 só por página. Os demais são h2, abaixo dele.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
