/*
 * Revisão: breakpoint (R2, Fase 1).
 *
 * Ação: mudar de jeito numa largura escolhida (600px), ao lado de um breakpoint antigo
 * em 400px; previsão: o nome do ponto de mudança.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_BREAKPOINT: ItemRevisao[] = [
  {
    id: "breakpoint-1",
    conceito: "breakpoint",
    tipo: "acao",
    enunciado: {
      mouse: "Em 600px o menu ainda está em fila. Faça ele virar coluna até 700px de largura, com uma @media nova no fim da folha.",
      toque: "Em 600px o menu ainda está em fila. Faça ele virar coluna até 700px de largura, com uma @media nova no fim da folha.",
    },
    siteAlvo: {
      url: "clubedecinema.exemplo",
      titulo: "Clube de Cinema",
      head: HEAD_CSS,
      body: `<nav class="menu">
  <a href="#a">Filmes</a>
  <a href="#b">Sessões</a>
  <a href="#c">Contato</a>
</nav>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.menu {
  display: flex;
  gap: 12px;
}

@media (max-width: 400px) {
  .menu {
    flex-direction: column;
  }
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".menu", propriedade: "flex-direction", valor: "column", larguraTela: 600 },
    ajudas: {
      pergunta: "Como se chama a largura onde o layout muda de jeito?",
      dica: "Breakpoint. Escreva @media (max-width: 700px) { .menu { flex-direction: column; } } no fim.",
    },
    solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 700px) {\n  .menu {\n    flex-direction: column;\n  }\n}\n" }],
  },
  {
    id: "breakpoint-2",
    conceito: "breakpoint",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em quando o layout muda.",
      toque: "Responda pensando em quando o layout muda.",
    },
    siteAlvo: {
      url: "lojadetenis.exemplo",
      titulo: "Loja de Tênis",
      head: HEAD_CSS,
      body: '<div class="lista">Tênis de corrida</div>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.lista {
  font-size: 1rem;
}

@media (min-width: 800px) {
  .lista {
    font-size: 1.5rem;
  }
}
`,
    },
    previsao: {
      pergunta: "A largura de 800px, onde o layout muda de jeito, tem qual nome?",
      opcoes: ["Viewport", "Breakpoint", "Gap"],
      correta: 1,
      explicacao: "Breakpoint é a largura de tela onde o layout muda, porque uma @media liga ou desliga ali.",
    },
    ajudas: {
      pergunta: "O ponto de largura onde o visual muda tem que nome?",
      dica: "Breakpoint, o ponto de quebra.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
