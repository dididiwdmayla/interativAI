/*
 * Revisão: variável CSS (E5, Fase 1).
 *
 * Ação: trocar o valor num lugar só e ver tudo mudar; previsão: quantos lugares
 * mudam. (O jogo-maquete da E5 não cabe num item, por isso o mini-site é o de uma loja.)
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_VARIAVEL_CSS: ItemRevisao[] = [
  {
    id: "variavel-css-1",
    conceito: "variavel-css",
    tipo: "acao",
    enunciado: {
      mouse: "O botão e o título usam var(--cor-marca). Troque a --cor-marca no :root para crimson.",
      toque: "O botão e o título usam var(--cor-marca). Troque a --cor-marca no :root para crimson.",
    },
    siteAlvo: {
      url: "docesdomel.exemplo",
      titulo: "Doces do Mel",
      head: HEAD_CSS,
      body: `<h1 class="titulo">Doces do Mel</h1>
<a class="botao" href="#">Encomendar</a>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

:root {
  --cor-marca: teal;
}

.titulo {
  color: var(--cor-marca);
}

.botao {
  display: inline-block;
  padding: 8px 14px;
  color: white;
  background-color: var(--cor-marca);
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".botao", propriedade: "background-color", valor: "crimson" },
    ajudas: {
      pergunta: "Onde mudar uma cor que várias regras usam por variável?",
      dica: "Na declaração da variável, no :root: --cor-marca: crimson.",
    },
    solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-marca", valor: "crimson" }],
  },
  {
    id: "variavel-css-2",
    conceito: "variavel-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando na variável.",
      toque: "Responda pensando na variável.",
    },
    siteAlvo: {
      url: "estudiodeyoga.exemplo",
      titulo: "Estúdio de Yoga",
      head: HEAD_CSS,
      body: `<h2 class="titulo">Aulas</h2>
<p class="nota">Traga seu tapete.</p>
<a class="botao" href="#">Reservar</a>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
:root {
  --cor-marca: purple;
}

.titulo {
  color: var(--cor-marca);
}

.nota {
  border-left: 4px solid var(--cor-marca);
}

.botao {
  background-color: var(--cor-marca);
}
`,
    },
    previsao: {
      pergunta: "Três regras usam var(--cor-marca). Você muda o valor da variável. Quantas regras mudam de cor?",
      opcoes: ["As três, de uma vez", "Só a primeira", "Nenhuma, tem que mudar uma a uma"],
      correta: 0,
      explicacao: "Uma variável guarda um valor num lugar só: mudou ali, tudo que usa var(--nome) muda junto.",
    },
    ajudas: {
      pergunta: "Trocar o valor de uma variável muda quantas regras?",
      dica: "Todas as que usam var(--cor-marca).",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
