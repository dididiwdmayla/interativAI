/*
 * Revisão: selecionar pela árvore (U1, Fases 1 e 2).
 *
 * Dois sites novos, e o alvo nunca é o título (o primeiro que a mão
 * procura): o horário no meio da página e o segundo item de uma lista,
 * para o jogador usar o acender da tela para se orientar na árvore.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_SELECIONAR_PELA_ARVORE: ItemRevisao[] = [
  {
    id: "selecionar-pela-arvore-1",
    conceito: "selecionar-pela-arvore",
    tipo: "acao",
    enunciado: {
      mouse: "Pela árvore, selecione o horário de funcionamento da biblioteca.",
      toque: "Pela árvore, toque no horário de funcionamento da biblioteca.",
    },
    siteAlvo: {
      url: "bibliotecadobairro.exemplo",
      titulo: "Biblioteca do Bairro",
      head: HEAD_MINI,
      body:
        '<h1>Biblioteca do Bairro</h1>\n<p>Empréstimo grátis para moradores.</p>\n<p id="horario">De segunda a sábado, das 9h às 18h.</p>\n<p>Traga um comprovante de endereço.</p>',
    },
    validador: { tipo: "selecionado", seletor: "#horario", via: "arvore" },
    ajudas: {
      pergunta: "Qual dos parágrafos da árvore acende o horário na tela?",
      dica: "Passe pelos p da árvore um por um: o que acende o horário é o do meio.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "#horario" }],
  },
  {
    id: "selecionar-pela-arvore-2",
    conceito: "selecionar-pela-arvore",
    tipo: "acao",
    enunciado: {
      mouse: "Pela árvore, selecione o segundo item do cardápio do quiosque.",
      toque: "Pela árvore, toque no segundo item do cardápio do quiosque.",
    },
    siteAlvo: {
      url: "quiosquedapraia.exemplo",
      titulo: "Quiosque da Praia",
      head: HEAD_MINI_ESCURO,
      body: "<h2>Cardápio</h2>\n<ul>\n  <li>Água de coco</li>\n  <li>Pastel de queijo</li>\n  <li>Milho cozido</li>\n</ul>",
    },
    validador: { tipo: "selecionado", seletor: "li:nth-child(2)", via: "arvore" },
    ajudas: {
      pergunta: "Onde moram os itens do cardápio na árvore?",
      dica: "Abra a ul: cada li é um item. O segundo li é o do pastel.",
    },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "li:nth-child(2)" }],
  },
];
