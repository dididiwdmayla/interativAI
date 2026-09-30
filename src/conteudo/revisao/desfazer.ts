/*
 * Revisão: desfazer (U2, Fase 2).
 *
 * O desfazer precisa de algo para desfazer: os dois itens pedem a mudança
 * E a volta, e o validador confere o evento `desfez` junto com a página
 * de volta ao normal (sem o evento, o estado inicial já passaria).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_DESFAZER: ItemRevisao[] = [
  {
    id: "desfazer-1",
    conceito: "desfazer",
    tipo: "acao",
    enunciado: {
      mouse: "Apague o rodapé e depois desfaça (Ctrl+Z ou o botão de desfazer) para ele voltar.",
      toque: "Apague o rodapé e depois toque no botão de desfazer para ele voltar.",
    },
    siteAlvo: {
      url: "marcenariacedro.exemplo",
      titulo: "Marcenaria Cedro",
      head: HEAD_MINI,
      body: "<h1>Marcenaria Cedro</h1>\n<p>Móveis sob medida.</p>\n<footer>Rua das Tábuas, 12</footer>",
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "evento", evento: "desfez" },
        { tipo: "existe", seletor: "footer" },
      ],
    },
    ajudas: {
      pergunta: "Depois de apagar, qual comando traz a última mudança de volta?",
      dica: "O desfazer: Ctrl+Z com o foco no painel, ou a setinha curva no topo do painel.",
    },
    solucaoDeTeste: [{ tipo: "apagar", seletor: "footer" }, { tipo: "desfazer" }],
  },
  {
    id: "desfazer-2",
    conceito: "desfazer",
    tipo: "previsao",
    enunciado: {
      mouse: "Agora faça: esconda o título e depois desfaça.",
      toque: "Agora faça: esconda o título e depois toque em desfazer.",
    },
    siteAlvo: {
      url: "cinemadavila.exemplo",
      titulo: "Cine da Vila",
      head: HEAD_MINI_ESCURO,
      body: "<h1>Sessão das 19h</h1>\n<p>Filme de aventura, livre para todos.</p>",
    },
    previsao: {
      pergunta: "Você escondeu o título e depois usou o desfazer. O que acontece?",
      opcoes: ["O título aparece de novo", "A página inteira some", "Nada, esconder não se desfaz"],
      correta: 0,
      explicacao: "O desfazer volta a última mudança, qualquer que seja: esconder, apagar, editar. O título aparece de novo.",
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "evento", evento: "desfez" },
        { tipo: "nao", validador: { tipo: "escondido", seletor: "h1" } },
      ],
    },
    ajudas: {
      pergunta: "O desfazer só funciona para apagar, ou para qualquer mudança?",
      dica: "Para qualquer mudança feita pelo painel. Esconda o h1 (tecla H) e depois desfaça.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }, { tipo: "esconder", seletor: "h1" }, { tipo: "desfazer" }],
  },
];
