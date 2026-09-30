/*
 * Revisão: título na busca (S1, Fase 1).
 *
 * Um title genérico ("Home") num site novo, e uma previsão sobre o corte
 * antes de encurtar um title enorme. As duas situações que mais aparecem
 * em site de pequeno negócio.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_TITULO_NA_BUSCA: ItemRevisao[] = [
  {
    id: "titulo-na-busca-1",
    conceito: "titulo-na-busca",
    tipo: "acao",
    enunciado: {
      mouse: "O resultado na busca diz só Home. Troque o title para ter o nome da bicicletaria, Pedal Firme.",
      toque: "O resultado na busca diz só Home. Troque o title para ter o nome da bicicletaria, Pedal Firme.",
    },
    siteAlvo: {
      url: "pedalfirme.exemplo",
      titulo: "Bicicletaria Pedal Firme",
      head: cabecaComTitulo("Home"),
      body: "<h1>Bicicletaria Pedal Firme</h1>\n<p>Conserto e revisão de bicicletas.</p>",
    },
    modoDocumento: true,
    validador: { tipo: "resultadoBusca", campo: "titulo", contem: "Pedal Firme" },
    ajudas: {
      pergunta: "De que peça do head a busca tira o título do resultado?",
      dica: "Do <title>. Dois cliques no texto dele, na árvore, deixam trocar.",
    },
    solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: "Bicicletaria Pedal Firme | Conserto de bicicletas" }],
  },
  {
    id: "titulo-na-busca-2",
    conceito: "titulo-na-busca",
    tipo: "previsao",
    enunciado: {
      mouse: "Agora encurte o title até caber inteiro na busca, ainda com a palavra Pizzaria.",
      toque: "Agora encurte o title até caber inteiro na busca, ainda com a palavra Pizzaria.",
    },
    siteAlvo: {
      url: "pizzariaforno.exemplo",
      titulo: "Pizzaria Forno a Lenha",
      head: cabecaComTitulo(
        "Pizzaria Forno a Lenha: pizza, esfiha, calzone, lasanha, refrigerante e sobremesa com entrega rápida em todo o bairro",
      ),
      body: "<h1>Pizzaria Forno a Lenha</h1>\n<p>Pizza assada na lenha, entrega em 40 minutos.</p>",
    },
    modoDocumento: true,
    previsao: {
      pergunta: "O title desta pizzaria tem mais de 100 letras. O que a busca mostra no título do resultado?",
      opcoes: ["O começo, cortado com reticências", "Tudo, em duas linhas", "Só a palavra Pizzaria"],
      correta: 0,
      explicacao: "O título tem um espaço de uns 60 caracteres. Passou disso, a busca corta: o principal tem que vir no começo.",
    },
    validador: { tipo: "resultadoBusca", campo: "titulo", contem: "Pizzaria", semCorte: true },
    ajudas: {
      pergunta: "O que quem busca precisa ler primeiro no título?",
      dica: "O nome e o que vende. Olhe a aba Busca: sem reticências no fim, cabe.",
    },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 0 },
      { tipo: "definirTexto", seletor: "title", valor: "Pizzaria Forno a Lenha | Entrega no bairro" },
    ],
  },
];
