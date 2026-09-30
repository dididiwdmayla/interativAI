/*
 * Revisão: texto alternativo, alt (U4, Fase 2).
 *
 * Ação: trocar um alt que não descreve ("foto") por uma descrição de verdade;
 * previsão: o que quem usa leitor de tela ouve.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_MINI, HEAD_MINI_ESCURO } from "./sites/estilos";

export const ITENS_IMAGEM_ALT: ItemRevisao[] = [
  {
    id: "imagem-alt-1",
    conceito: "imagem-alt",
    tipo: "acao",
    enunciado: {
      mouse: "O alt da imagem só diz 'foto'. Troque para uma descrição: 'Pizza de mussarela com manjericão'.",
      toque: "O alt da imagem só diz 'foto'. Troque para uma descrição: 'Pizza de mussarela com manjericão'.",
    },
    siteAlvo: {
      url: "pizzariaboaideia.exemplo",
      titulo: "Pizzaria Boa Ideia",
      head: HEAD_MINI,
      body: `<h2>Pizza da semana</h2>
<img id="foto-pizza" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23e76f51'/%3E%3C/svg%3E" alt="foto">
<p>Mussarela, tomate e manjericão.</p>`,
    },
    validador: { tipo: "atributo", seletor: "#foto-pizza", nome: "alt", valor: "Pizza de mussarela com manjericão" },
    ajudas: {
      pergunta: "Se a imagem não carregasse, que frase substituiria a foto?",
      dica: "O alt é a descrição da imagem em palavras. Dois cliques no valor 'foto' e escreva a frase.",
    },
    solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#foto-pizza", nome: "alt", valor: "Pizza de mussarela com manjericão" }],
  },
  {
    id: "imagem-alt-2",
    conceito: "imagem-alt",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em quem não enxerga a imagem.",
      toque: "Responda pensando em quem não enxerga a imagem.",
    },
    siteAlvo: {
      url: "trilhasdoparque.exemplo",
      titulo: "Trilhas do Parque",
      head: HEAD_MINI_ESCURO,
      body: `<h2>Trilha da Cachoeira</h2>
<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23457b9d'/%3E%3C/svg%3E" alt="Ponte de madeira sobre o rio">`,
    },
    previsao: {
      pergunta: "Uma pessoa cega usa leitor de tela nesta página. O que ela ouve na imagem?",
      opcoes: ["A descrição do alt", "Nada, imagem não fala", "O nome do arquivo, ponte.jpg"],
      correta: 0,
      explicacao: "O leitor de tela lê o alt em voz alta. Sem ele, a imagem some para quem não enxerga.",
    },
    ajudas: {
      pergunta: "O que o alt guarda: uma descrição ou o nome do arquivo?",
      dica: "Uma descrição em palavras. É ela que o leitor de tela fala.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
