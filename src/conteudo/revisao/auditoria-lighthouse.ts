/*
 * Revisão: auditoria do Lighthouse (P1, Fase 1).
 *
 * Ação: consertar um problema achado e rodar a análise para confirmar; previsão: o
 * que o Lighthouse avalia.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_AUDITORIA_LIGHTHOUSE: ItemRevisao[] = [
  {
    id: "auditoria-lighthouse-1",
    conceito: "auditoria-lighthouse",
    tipo: "acao",
    enunciado: {
      mouse: "A foto está sem alt. Descreva ela (alt) e rode o Analisar do Lighthouse para conferir.",
      toque: "A foto está sem alt. Descreva ela (alt) e rode o Analisar do Lighthouse para conferir.",
    },
    siteAlvo: {
      url: "sorveteriapolo.exemplo",
      titulo: "Sorveteria Polo",
      head: HEAD_CSS,
      body: `<main>
  <h1>Sorveteria Polo</h1>
  <img id="foto" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Crect width='240' height='120' fill='%2348cae4'/%3E%3C/svg%3E">
</main>`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "semProblema", regra: "imagem-sem-alt" },
        { tipo: "evento", evento: "auditou" },
      ],
    },
    ajudas: {
      pergunta: "Que aba do F12 confere a página e dá notas?",
      dica: "O Lighthouse: escreva o alt da imagem (adicione o atributo) e clique em Analisar.",
    },
    solucaoDeTeste: [
      { tipo: "adicionarAtributo", seletor: "#foto", nome: "alt", valor: "Sorvete de casquinha" },
      { tipo: "analisarAuditoria" },
    ],
  },
  {
    id: "auditoria-lighthouse-2",
    conceito: "auditoria-lighthouse",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda pensando no Lighthouse.",
      toque: "Responda pensando no Lighthouse.",
    },
    siteAlvo: {
      url: "quiosquedopraiano.exemplo",
      titulo: "Quiosque do Praiano",
      head: HEAD_CSS,
      body: `<main>
  <h1>Quiosque do Praiano</h1>
  <p>Caipirinha e porção de peixe.</p>
</main>`,
    },
    previsao: {
      pergunta: "O Lighthouse dá notas de quais três categorias?",
      opcoes: ["Só de velocidade", "Cores, fontes e imagens", "Acessibilidade, boas práticas e SEO"],
      correta: 2,
      explicacao: "A aba Lighthouse confere a página e dá notas de acessibilidade, boas práticas e SEO, apontando o que consertar.",
    },
    ajudas: {
      pergunta: "O Lighthouse só olha velocidade ou também acessibilidade?",
      dica: "Também acessibilidade, boas práticas e SEO.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
