/*
 * Revisão: id único (U4, Fase 3).
 *
 * Ação: um id repetido em duas peças, e o jogador corrige o segundo (o alvo do
 * seletor é uma class, porque o id está repetido). Previsão: o que está errado.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_ID_UNICO: ItemRevisao[] = [
  {
    id: "id-unico-1",
    conceito: "id-unico",
    tipo: "acao",
    enunciado: {
      mouse: "Duas peças têm id='oferta'. Troque o id da peça de class 'segunda' para 'oferta-2'.",
      toque: "Duas peças têm id='oferta'. Troque o id da peça de class 'segunda' para 'oferta-2'.",
    },
    siteAlvo: {
      url: "lojadedescontos.exemplo",
      titulo: "Loja de Descontos",
      head: HEAD_MINI,
      body: `<p id="oferta" class="primeira">Tênis com 20% de desconto.</p>
<p id="oferta" class="segunda">Mochila com 30% de desconto.</p>`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "contagem", seletor: "#oferta", op: "==", valor: 1 },
        { tipo: "existe", seletor: "#oferta-2" },
      ],
    },
    ajudas: {
      pergunta: "Um id pode aparecer em duas peças da mesma página?",
      dica: "Não: cada id é de UMA peça só. Mude o id da segunda para oferta-2, dois cliques no valor.",
    },
    solucaoDeTeste: [{ tipo: "definirAtributo", seletor: ".segunda", nome: "id", valor: "oferta-2" }],
  },
  {
    id: "id-unico-2",
    conceito: "id-unico",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando os dois botões.",
      toque: "Responda olhando os dois botões.",
    },
    siteAlvo: {
      url: "mercearianoivas.exemplo",
      titulo: "Mercearia Noivas",
      head: HEAD_MINI_ESCURO,
      body: `<button id="comprar">Comprar arroz</button>
<button id="comprar">Comprar feijão</button>`,
    },
    previsao: {
      pergunta: "Os dois botões têm id='comprar'. O que está errado?",
      opcoes: ["Falta uma class nos botões", "O id deveria ser único na página", "Nada, id pode se repetir"],
      correta: 1,
      explicacao: "Um id identifica UMA peça só na página. Repetido, o navegador não sabe qual é qual. Para repetir, use class.",
    },
    ajudas: {
      pergunta: "Para várias peças parecidas, o que se usa: id ou class?",
      dica: "Class. O id é único por página.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
