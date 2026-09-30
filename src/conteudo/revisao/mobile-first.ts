/*
 * Revisão: mobile first (R2, Fase 2).
 *
 * Ação: uma coluna por padrão e duas só a partir de 700px (conferido em 390 e 800);
 * previsão: por onde começar a escrever.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_MOBILE_FIRST: ItemRevisao[] = [
  {
    id: "mobile-first-1",
    conceito: "mobile-first",
    tipo: "acao",
    enunciado: {
      mouse: "Mantenha uma coluna no celular e passe a duas colunas só a partir de 700px, com min-width, no fim da folha.",
      toque: "Mantenha uma coluna no celular e passe a duas colunas só a partir de 700px, com min-width, no fim da folha.",
    },
    siteAlvo: {
      url: "docesdaserra.exemplo",
      titulo: "Doces da Serra",
      head: HEAD_CSS,
      body: `<div class="lista">
  <div>Doce de leite</div>
  <div>Goiabada</div>
  <div>Cocada</div>
  <div>Pé de moça</div>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.lista {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.lista div {
  padding: 10px;
  background-color: #ffe9c7;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".lista", propriedade: "grid-template-columns", valor: "1fr", larguraTela: 390 },
        { tipo: "valorEfetivo", seletor: ".lista", propriedade: "grid-template-columns", valor: "1fr 1fr", larguraTela: 800 },
      ],
    },
    ajudas: {
      pergunta: "No mobile first, o layout maior entra ACRESCENTANDO com que condição?",
      dica: "min-width: @media (min-width: 700px) { .lista { grid-template-columns: 1fr 1fr; } }.",
    },
    solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (min-width: 700px) {\n  .lista {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n" }],
  },
  {
    id: "mobile-first-2",
    conceito: "mobile-first",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em como escrever o CSS.",
      toque: "Responda pensando em como escrever o CSS.",
    },
    siteAlvo: {
      url: "escolademecanica.exemplo",
      titulo: "Escola de Mecânica",
      head: HEAD_CSS,
      body: '<div class="cartao">Cursos de motor</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.cartao {
  padding: 10px;
  background-color: #cdeac0;
}

@media (min-width: 600px) {
  .cartao {
    padding: 24px;
  }
}
`,
    },
    previsao: {
      pergunta: "Em mobile first, escrevemos primeiro o CSS para qual tela?",
      opcoes: ["A grande, e depois tiramos com max-width", "As duas juntas, sem ordem", "A pequena, e depois acrescentamos com min-width"],
      correta: 2,
      explicacao: "Mobile first: primeiro o CSS da tela pequena, sem @media, e min-width vai ACRESCENTANDO layout conforme a tela cresce.",
    },
    ajudas: {
      pergunta: "O CSS de base (sem @media) é para a tela pequena ou grande?",
      dica: "Pequena: o celular vem primeiro.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
