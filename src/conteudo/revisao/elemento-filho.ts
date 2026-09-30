/*
 * Revisão: elemento filho (U2, Fase 1).
 *
 * Um menu (nav) com links: selecionar um filho qualquer. E uma previsão de
 * contagem, que só acerta quem olha os filhos DIRETOS (um li com um
 * strong dentro não vira dois filhos da ul).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ELEMENTO_FILHO: ItemRevisao[] = [
  {
    id: "elemento-filho-1",
    conceito: "elemento-filho",
    tipo: "acao",
    enunciado: {
      mouse: "Selecione, na árvore, um dos filhos do menu (nav) do site.",
      toque: "Toque, na árvore, num dos filhos do menu (nav) do site.",
    },
    siteAlvo: {
      url: "clinicasorriso.exemplo",
      titulo: "Clínica Sorriso",
      head: HEAD_MINI,
      body:
        '<nav>\n  <a href="#inicio">Início</a>\n  <a href="#servicos">Serviços</a>\n  <a href="#contato">Contato</a>\n</nav>\n<h1>Clínica Sorriso</h1>',
    },
    validador: { tipo: "selecionado", seletor: "nav > a" },
    ajudas: {
      pergunta: "O que mora dentro do nav, um andar mais para dentro?",
      dica: "Abra o nav na árvore: os links (a) são os filhos dele. Qualquer um vale.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "nav > a" }],
  },
  {
    id: "elemento-filho-2",
    conceito: "elemento-filho",
    tipo: "previsao",
    enunciado: {
      mouse: "Abra a lista na árvore e responda.",
      toque: "Abra a lista na árvore e responda.",
    },
    siteAlvo: {
      url: "lanchonetetrem.exemplo",
      titulo: "Lanchonete Trem Bão",
      head: HEAD_MINI_ESCURO,
      body:
        "<h2>Cardápio</h2>\n<ul>\n  <li>Misto quente</li>\n  <li><strong>X-tudo</strong></li>\n  <li>Suco de laranja</li>\n  <li>Café</li>\n</ul>",
    },
    previsao: {
      pergunta: "Quantos filhos diretos tem a ul do cardápio?",
      opcoes: ["Quatro", "Cinco", "Um"],
      correta: 0,
      explicacao: "Quatro li. O strong mora dentro de um li: ele é neto da ul, não filho direto.",
    },
    ajudas: {
      pergunta: "Quais peças ficam exatamente um andar abaixo da ul?",
      dica: "Filho direto é só o primeiro andar para dentro. O que mora dentro de um li não conta.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
