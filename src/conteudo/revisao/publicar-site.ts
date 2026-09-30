/*
 * Revisão: publicar o site (P2, Fase 1), no modo documento.
 *
 * Ação: levar o site pro mundo (o .zip com os arquivos); previsão: onde precisam estar
 * para qualquer pessoa abrir.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_PUBLICAR_SITE: ItemRevisao[] = [
  {
    id: "publicar-site-1",
    conceito: "publicar-site",
    tipo: "acao",
    enunciado: {
      mouse: "Transforme o site em arquivos para publicar: clique em Levar pro mundo e baixe o .zip.",
      toque: "Transforme o site em arquivos para publicar: toque em Levar pro mundo e baixe o .zip.",
    },
    siteAlvo: {
      url: "cantinhodafeira.exemplo",
      titulo: "Cantinho da Feira",
      head: cabecaComTitulo("Cantinho da Feira"),
      body: `<h1>Cantinho da Feira</h1>
<p>Frutas e verduras frescas.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h1 {
  color: #2a9d8f;
}
`,
    },
    modoDocumento: true,
    validador: { tipo: "evento", evento: "exportouProjeto" },
    ajudas: {
      pergunta: "Que botão transforma o site em arquivos prontos para publicar?",
      dica: "Levar pro mundo, na barra do navegador em cima da prévia: depois, Baixar .zip.",
    },
    solucaoDeTeste: [{ tipo: "levarProMundo" }],
  },
  {
    id: "publicar-site-2",
    conceito: "publicar-site",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em quem está do outro lado do mundo.",
      toque: "Responda pensando em quem está do outro lado do mundo.",
    },
    siteAlvo: {
      url: "atelierdaluna.exemplo",
      titulo: "Ateliê da Luna",
      head: HEAD_CSS,
      body: `<h1>Ateliê da Luna</h1>
<p>Peças de crochê feitas à mão.</p>`,
    },
    previsao: {
      pergunta: "Para uma pessoa em outra cidade abrir o seu site, os arquivos precisam estar onde?",
      opcoes: ["No seu computador, ligado", "Num servidor da internet", "Num pen drive"],
      correta: 1,
      explicacao: "Publicar é pôr os arquivos do site num servidor da internet, para qualquer pessoa abrir pelo endereço.",
    },
    ajudas: {
      pergunta: "O que faz um site ficar aberto para o mundo todo?",
      dica: "Estar num servidor, que fica ligado na internet.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
