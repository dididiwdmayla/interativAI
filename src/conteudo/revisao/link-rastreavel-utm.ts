/*
 * Revisão: link rastreável, os utm (S4, Fase 3).
 *
 * Uma ação (pôr o link com utm no link do panfleto e simular uma visita, no
 * construtor de link da aba Medição) e uma previsão sobre qual parâmetro diz a
 * divulgação.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_LINK_RASTREAVEL_UTM: ItemRevisao[] = [
  {
    id: "link-rastreavel-utm-1",
    conceito: "link-rastreavel-utm",
    tipo: "acao",
    enunciado: {
      mouse: "Monte o link (panfleto, impresso, festival), ponha no link do panfleto e simule uma visita.",
      toque: "Monte o link (panfleto, impresso, festival), ponha no link do panfleto e simule uma visita.",
    },
    siteAlvo: {
      url: "sorveteriaduasbolas.exemplo",
      titulo: "Sorveteria Duas Bolas",
      body: `<h1>Sorveteria Duas Bolas</h1>
<p>Sorvete artesanal. Venha ao festival do bairro.</p>
<p><a id="link-panfleto" href="https://sorveteriaduasbolas.exemplo/">Cupom do panfleto do festival</a></p>`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        {
          tipo: "linkRastreavel",
          seletor: "#link-panfleto",
          utm: { source: "panfleto", medium: "impresso", campaign: "festival" },
        },
        { tipo: "evento", evento: "visitaSimulada" },
      ],
    },
    ajudas: {
      pergunta: "Como a medição vai saber que a visita veio do panfleto?",
      dica: "Pelos utm no fim do link. Use o construtor da aba Medição, ponha no link selecionado e simule a visita.",
    },
    solucaoDeTeste: [
      {
        tipo: "definirAtributo",
        seletor: "#link-panfleto",
        nome: "href",
        valor: "https://sorveteriaduasbolas.exemplo/?utm_source=panfleto&utm_medium=impresso&utm_campaign=festival",
      },
      { tipo: "simularVisita", utm: { source: "panfleto", medium: "impresso", campaign: "festival" } },
    ],
  },
  {
    id: "link-rastreavel-utm-2",
    conceito: "link-rastreavel-utm",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lojadebicicletas.exemplo",
      titulo: "Loja de Bicicletas Roda Livre",
      body: `<h1>Loja de Bicicletas Roda Livre</h1>
<p>Bicicletas e peças.</p>`,
    },
    previsao: {
      pergunta: "No link com utm, qual parâmetro diz qual divulgação trouxe a visita (por exemplo, \"black-friday\")?",
      opcoes: ["utm_source", "utm_medium", "utm_campaign"],
      correta: 2,
      explicacao: "utm_campaign diz qual divulgação; utm_source diz de onde veio (instagram, email); utm_medium diz o tipo do canal (social, email).",
    },
    ajudas: {
      pergunta: "Qual dos três nomes fala de campanha, no sentido de uma divulgação com nome?",
      dica: "Um dos três tem a palavra campanha no nome.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
