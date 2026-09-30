/*
 * Revisão: CSS externo (P2, Fase 1), no modo documento.
 *
 * Ação: ligar a folha de estilo ao head com link; previsão: o que a linha link liga.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_CSS_EXTERNO: ItemRevisao[] = [
  {
    id: "css-externo-1",
    conceito: "css-externo",
    tipo: "acao",
    enunciado: {
      mouse: "O visual mora no style.css, mas a página não liga a ele. Acrescente o link da folha no head.",
      toque: "O visual mora no style.css, mas a página não liga a ele. Acrescente o link da folha no head.",
    },
    siteAlvo: {
      url: "casadapipoca.exemplo",
      titulo: "Casa da Pipoca",
      head: cabecaComTitulo("Casa da Pipoca"),
      body: `<h1>Casa da Pipoca</h1>
<p>Pipoca doce e salgada.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h1 {
  color: #e76f51;
}
`,
    },
    modoDocumento: true,
    validador: { tipo: "existe", seletor: "head link[rel=\"stylesheet\"]" },
    ajudas: {
      pergunta: "Que tag do head liga a página ao arquivo .css?",
      dica: 'link, com rel="stylesheet" e href="style.css". Escreva depois do title.',
    },
    solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: "<link rel=\"stylesheet\" href=\"style.css\">" }],
  },
  {
    id: "css-externo-2",
    conceito: "css-externo",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a linha do head.",
      toque: "Responda olhando a linha do head.",
    },
    siteAlvo: {
      url: "estudiovozeoutra.exemplo",
      titulo: "Estúdio Voz",
      head: cabecaComTitulo("Estúdio Voz", '<link rel="stylesheet" href="style.css">'),
      body: `<h1>Estúdio Voz</h1>
<p>Gravações de áudio.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h1 {
  color: #6a4c93;
}
`,
    },
    modoDocumento: true,
    previsao: {
      pergunta: 'A linha <link rel="stylesheet" href="style.css"> está no head. O que ela faz?',
      opcoes: ["Cria um link clicável na tela", "Liga a página ao arquivo de estilo", "Abre outro site"],
      correta: 1,
      explicacao: "A linha link liga a página ao arquivo .css: o visual mora nesse arquivo à parte, e o HTML só aponta para ele.",
    },
    ajudas: {
      pergunta: "O link do head aparece na tela ou liga arquivos?",
      dica: "Liga arquivos. Não é clicável.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
