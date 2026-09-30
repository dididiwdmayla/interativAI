/*
 * Revisão: palavra-chave do anúncio (S5, Fase 1).
 *
 * Uma previsão sobre o que a palavra-chave é e uma sobre os tipos de
 * correspondência (ampla, de frase e exata, conferidos em 30/09/2026). Só
 * previsões: escolher a palavra é gesto do simulador de campanha.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_PALAVRA_CHAVE_DE_ANUNCIO: ItemRevisao[] = [
  {
    id: "palavra-chave-de-anuncio-1",
    conceito: "palavra-chave-de-anuncio",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "escoladenatacao.exemplo",
      titulo: "Escola de Natação Golfinho",
      body: `<h1>Escola de Natação Golfinho</h1>
<p>Aulas para crianças e adultos.</p>`,
    },
    previsao: {
      pergunta: "No anúncio pago, o que é a palavra-chave?",
      opcoes: [
        "O que a pessoa digita na busca e que dispara o anúncio",
        "O título da página do anunciante",
        "O nome do concorrente",
      ],
      correta: 0,
      explicacao: "A palavra-chave é o termo que a pessoa busca e que o anunciante escolhe para o anúncio poder aparecer.",
    },
    ajudas: {
      pergunta: "A palavra-chave vem da pessoa que busca, ou do dono do site?",
      dica: "É o que a pessoa digita na busca.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "palavra-chave-de-anuncio-2",
    conceito: "palavra-chave-de-anuncio",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lojadecolchoes.exemplo",
      titulo: "Loja de Colchões Bom Sono",
      body: `<h1>Loja de Colchões Bom Sono</h1>
<p>Colchões, camas e travesseiros.</p>`,
    },
    previsao: {
      pergunta: "Quais são os três tipos de correspondência de palavra-chave do Google Ads?",
      opcoes: ["Simples, dupla e tripla", "Ampla, de frase e exata", "Curta, média e longa"],
      correta: 1,
      explicacao: "Os três tipos de correspondência de palavra-chave do Google Ads são ampla, de frase e exata.",
    },
    ajudas: {
      pergunta: "Qual das três listas tem os nomes que o Google Ads usa?",
      dica: "Ampla, de frase e exata.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
