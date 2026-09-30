/*
 * Revisão: títulos e hierarquia (U3, Fase 1).
 *
 * A confusão de leigo é escolher h1 a h6 pelo tamanho da letra. A ação vai na
 * direção da fase (subir um título ao nível certo) num site de clube; a previsão
 * pergunta pela importância, não pelo visual.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_TITULOS_HIERARQUIA: ItemRevisao[] = [
  {
    id: "titulos-hierarquia-1",
    conceito: "titulos-hierarquia",
    tipo: "acao",
    enunciado: {
      mouse: "O nome do clube virou h3! Troque a tag dele para h1 (dois cliques no nome da tag, na árvore).",
      toque: "O nome do clube virou h3! Troque a tag dele para h1 (dois toques no nome da tag, na árvore).",
    },
    siteAlvo: {
      url: "clubexadrezreipreto.exemplo",
      titulo: "Clube de Xadrez Rei Preto",
      head: HEAD_MINI,
      body: `<h3 id="nome-clube">Clube de Xadrez Rei Preto</h3>
<h2>Aulas para iniciantes</h2>
<p>Terças e quintas, às 19h.</p>`,
    },
    validador: { tipo: "tag", seletor: "#nome-clube", nome: "h1" },
    ajudas: {
      pergunta: "O nome do clube é o título mais importante da página. Qual número de h combina com isso?",
      dica: "O h1 é o título mais importante; quanto maior o número, menor o nível. Dois cliques no nome da tag trocam ela.",
    },
    solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#nome-clube", novaTag: "h1" }],
  },
  {
    id: "titulos-hierarquia-2",
    conceito: "titulos-hierarquia",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a árvore do cardápio.",
      toque: "Responda olhando a árvore do cardápio.",
    },
    siteAlvo: {
      url: "cantinadopastel.exemplo",
      titulo: "Cantina do Pastel",
      head: HEAD_MINI_ESCURO,
      body: `<h4>Bebidas geladas</h4>
<h1>Cantina do Pastel</h1>
<h2>Pastéis do dia</h2>`,
    },
    previsao: {
      pergunta: "Nesta página, qual título tem MAIS importância: o h1 ou o h4?",
      opcoes: ["O h1, porque o número é menor", "O h4, porque o número é maior", "Os dois valem igual"],
      correta: 0,
      explicacao: "O número mostra o nível: h1 é o mais importante e h6 o menos. O tamanho da letra é outra história, e vem do CSS.",
    },
    ajudas: {
      pergunta: "Qual título é o nome da lanchonete: o de nível mais alto ou o de nível mais baixo?",
      dica: "h1 é o topo da hierarquia. O número do título diz o nível, não o tamanho.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
