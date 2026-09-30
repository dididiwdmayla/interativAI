/*
 * Revisão: texto de link (S2, Fase 3).
 *
 * Uma ação (trocar um "leia mais" por um texto que diz o destino, conferido
 * pelo Lighthouse) e uma previsão sobre qual texto de link ajuda mais.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_TEXTO_DE_LINK: ItemRevisao[] = [
  {
    id: "texto-de-link-1",
    conceito: "texto-de-link",
    tipo: "acao",
    enunciado: {
      mouse: "O link \"leia mais\" não diz para onde vai. Troque o texto dele para o Lighthouse não reclamar dos links.",
      toque: "O link \"leia mais\" não diz para onde vai. Troque o texto dele (toque no texto, na árvore) para o Lighthouse não reclamar dos links.",
    },
    siteAlvo: {
      url: "escolafalalivre.exemplo",
      titulo: "Escola de Idiomas Fala Livre",
      body: `<h1>Escola de Idiomas Fala Livre</h1>
<p>Aulas de inglês e espanhol, em turmas pequenas.</p>
<p><a id="link-turmas" href="turmas.html">leia mais</a></p>`,
    },
    validador: { tipo: "semProblema", regra: "link-generico" },
    ajudas: {
      pergunta: "Fora da frase, \"leia mais\" diz o que vai aparecer?",
      dica: "Escreva o destino no link: por exemplo, \"Veja os horários das turmas\".",
    },
    solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#link-turmas", valor: "Veja os horários das turmas" }],
  },
  {
    id: "texto-de-link-2",
    conceito: "texto-de-link",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "clinicasaopedro.exemplo",
      titulo: "Clínica São Pedro",
      body: `<h1>Clínica São Pedro</h1>
<p>Consultas de segunda a sábado.</p>
<p><a href="agendar.html">Agende sua consulta</a></p>
<p><a href="convenios.html">aqui</a></p>`,
    },
    previsao: {
      pergunta: "Na lista de links da página, qual texto ajuda mais quem ouve só os links?",
      opcoes: ["aqui", "Veja os convênios aceitos", "Agende sua consulta e veja os convênios"],
      correta: 1,
      explicacao: "Um link curto que diz o destino ajuda mais. \"aqui\" não diz nada, e o longo tenta dizer duas coisas.",
    },
    ajudas: {
      pergunta: "Quem escuta só os links entende para onde cada um leva?",
      dica: "Escolha o texto que diz uma coisa só e diz o destino.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
