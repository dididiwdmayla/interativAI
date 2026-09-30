/*
 * Revisão: orientação da tela (R1, Fase 1).
 *
 * Ação: girar o aparelho para paisagem; previsão: qual é a deitada.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_ORIENTACAO_DA_TELA: ItemRevisao[] = [
  {
    id: "orientacao-da-tela-1",
    conceito: "orientacao-da-tela",
    tipo: "acao",
    enunciado: {
      mouse: "Ligue o Celular 390 e gire o aparelho para a paisagem (deitado).",
      toque: "Ligue o Celular 390 e gire o aparelho para a paisagem (deitado).",
    },
    siteAlvo: {
      url: "videolocadoranoite.exemplo",
      titulo: "Videolocadora Noite",
      head: HEAD_CSS,
      body: `<h1>Videolocadora Noite</h1>
<p>Clássicos e lançamentos.</p>`,
    },
    validador: { tipo: "dispositivo", orientacao: "paisagem" },
    ajudas: {
      pergunta: "Deitado, o celular fica em retrato ou em paisagem?",
      dica: "Ligue o modo dispositivo e use o botão de girar, na barra de dispositivo.",
    },
    solucaoDeTeste: [
      { tipo: "trocarDispositivo", modelo: "celular-390" },
      { tipo: "girarDispositivo" },
    ],
  },
  {
    id: "orientacao-da-tela-2",
    conceito: "orientacao-da-tela",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando em como você segura o celular.",
      toque: "Responda pensando em como você segura o celular.",
    },
    siteAlvo: {
      url: "cantinadamusica.exemplo",
      titulo: "Cantina da Música",
      head: HEAD_CSS,
      body: `<h1>Cantina da Música</h1>
<p>Shows ao vivo às sextas.</p>`,
    },
    previsao: {
      pergunta: "Você deita o celular para ver um vídeo. A tela fica em qual orientação?",
      opcoes: ["Paisagem, mais larga que alta", "Retrato, mais alta que larga", "Quadrada"],
      correta: 0,
      explicacao: "Em pé é retrato (mais alta que larga); deitada é paisagem (mais larga que alta). O layout pode reagir a cada uma.",
    },
    ajudas: {
      pergunta: "Paisagem é mais larga ou mais alta?",
      dica: "Mais larga que alta, como uma paisagem pintada.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
