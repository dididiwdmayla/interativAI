/*
 * Revisão: media query (R2, Fase 1).
 *
 * Ação: escrever uma @media que só vale em tela estreita (conferida em 390 e 1280);
 * previsão: quando ela vale.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_MEDIA_QUERY: ItemRevisao[] = [
  {
    id: "media-query-1",
    conceito: "media-query",
    tipo: "acao",
    enunciado: {
      mouse: "Em telas de até 600px, o título deve ter font-size: 1.2rem. Escreva essa @media no fim da folha.",
      toque: "Em telas de até 600px, o título deve ter font-size: 1.2rem. Escreva essa @media no fim da folha.",
    },
    siteAlvo: {
      url: "pousadadamontanha.exemplo",
      titulo: "Pousada da Montanha",
      head: HEAD_CSS,
      body: `<h1 class="titulo">Pousada da Montanha</h1>
<p>Lareira e café colonial.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  font-size: 2rem;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".titulo", propriedade: "font-size", valor: "1.2rem", larguraTela: 390 },
        { tipo: "valorEfetivo", seletor: ".titulo", propriedade: "font-size", valor: "2rem", larguraTela: 1280 },
      ],
    },
    ajudas: {
      pergunta: "Que regra só vale quando a tela cumpre uma condição de largura?",
      dica: "Uma @media (max-width: 600px) { .titulo { font-size: 1.2rem; } }, no fim da folha.",
    },
    solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  .titulo {\n    font-size: 1.2rem;\n  }\n}\n" }],
  },
  {
    id: "media-query-2",
    conceito: "media-query",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a @media.",
      toque: "Responda olhando a @media.",
    },
    siteAlvo: {
      url: "cursodefotografia.exemplo",
      titulo: "Curso de Fotografia",
      head: HEAD_CSS,
      body: '<h1 class="titulo">Curso de Fotografia</h1>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  color: navy;
}

@media (max-width: 500px) {
  .titulo {
    color: crimson;
  }
}
`,
    },
    previsao: {
      pergunta: "Numa tela de 1000px de largura, o título fica de que cor?",
      opcoes: ["Navy: a @media só vale até 500px", "Crimson: a @media sempre vale", "Sem cor"],
      correta: 0,
      explicacao: "A regra dentro de @media (max-width: 500px) só vale em telas de até 500px. Em 1000px, vale a regra de fora.",
    },
    ajudas: {
      pergunta: "A @media com max-width: 500px vale em telas grandes?",
      dica: "Não: só até 500px de largura.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
