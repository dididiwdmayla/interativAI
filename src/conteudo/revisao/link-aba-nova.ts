/*
 * Revisão: link em aba nova (U4, Fase 1).
 *
 * Ação: pôr o target no link de um mapa externo; previsão: qual atributo abre aba nova.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_LINK_ABA_NOVA: ItemRevisao[] = [
  {
    id: "link-aba-nova-1",
    conceito: "link-aba-nova",
    tipo: "acao",
    enunciado: {
      mouse: "Faça o link do mapa abrir numa aba nova: acrescente target='_blank' nele.",
      toque: "Faça o link do mapa abrir numa aba nova: acrescente target='_blank' nele.",
    },
    siteAlvo: {
      url: "sitiovistaverde.exemplo",
      titulo: "Sítio Vista Verde",
      head: HEAD_MINI,
      body: `<h2>Passeios no sítio</h2>
<p><a id="link-mapa" href="https://mapa.exemplo/vistaverde">Como chegar</a></p>`,
    },
    validador: { tipo: "atributo", seletor: "#link-mapa", nome: "target", valor: "_blank" },
    ajudas: {
      pergunta: "Qual atributo faz o link abrir numa aba nova?",
      dica: "target, com o valor _blank. Use Adicionar atributo, no menu do nó do link.",
    },
    solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: "#link-mapa", nome: "target", valor: "_blank" }],
  },
  {
    id: "link-aba-nova-2",
    conceito: "link-aba-nova",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em quem está lendo.",
      toque: "Responda pensando em quem está lendo.",
    },
    siteAlvo: {
      url: "clubedaleitura.exemplo",
      titulo: "Clube da Leitura",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Próximo livro</h2>
<p><a href="https://livros.exemplo/sertao" target="_blank">Ver o livro</a></p>`,
    },
    previsao: {
      pergunta: "O link tem target='_blank'. Quem clicar perde a página do clube?",
      opcoes: ["Sim, a página do clube fecha", "Sim, o livro abre no lugar", "Não, o livro abre numa aba nova"],
      correta: 2,
      explicacao: "O target='_blank' abre o destino numa aba nova, e a página atual continua aberta.",
    },
    ajudas: {
      pergunta: "O que o target do link decide?",
      dica: "Onde o destino abre. Com _blank, é numa aba nova.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
