/*
 * Revisão: velocidade da página (S2, Fase 4).
 *
 * Uma ação (deixar só as fotos de baixo esperarem, sem a de cima, que aparece
 * logo) e uma previsão sobre o que deixa a página lenta.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_VELOCIDADE_DA_PAGINA: ItemRevisao[] = [
  {
    id: "velocidade-da-pagina-1",
    conceito: "velocidade-da-pagina",
    tipo: "acao",
    enunciado: {
      mouse: "A página baixa as 3 fotos de uma vez. Faça as duas de baixo esperarem (loading lazy), mas não a de cima.",
      toque: "A página baixa as 3 fotos de uma vez. Faça as duas de baixo esperarem (loading lazy, pelo menu da tag), mas não a de cima.",
    },
    siteAlvo: {
      url: "joalheriabrilhofino.exemplo",
      titulo: "Joalheria Brilho Fino",
      body: `<h1>Joalheria Brilho Fino</h1>
<img id="destaque" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23d9b45c'/%3E%3C/svg%3E" alt="Anel de ouro com pedra azul" width="160" height="100">
<div class="vitrine">
  <img id="v1" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23c9c9d6'/%3E%3C/svg%3E" alt="Colar de prata" width="160" height="100">
  <img id="v2" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23d98c9b'/%3E%3C/svg%3E" alt="Brincos de pérola" width="160" height="100">
</div>`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "contagem", seletor: ".vitrine img[loading=\"lazy\"]", op: ">=", valor: 2 },
        { tipo: "nao", validador: { tipo: "atributo", seletor: "#destaque", nome: "loading", valor: "lazy" } },
      ],
    },
    ajudas: {
      pergunta: "Qual foto a pessoa vê assim que a página abre?",
      dica: "Lazy só nas fotos que ficam abaixo. A de cima precisa baixar já.",
    },
    solucaoDeTeste: [
      { tipo: "adicionarAtributo", seletor: "#v1", nome: "loading", valor: "lazy" },
      { tipo: "adicionarAtributo", seletor: "#v2", nome: "loading", valor: "lazy" },
    ],
  },
  {
    id: "velocidade-da-pagina-2",
    conceito: "velocidade-da-pagina",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lojasolemar.exemplo",
      titulo: "Loja Sol e Mar",
      body: `<h1>Loja Sol e Mar</h1>
<p>Roupas de praia e acessórios.</p>
<p>Uma foto de 8 MB abre o site.</p>`,
    },
    previsao: {
      pergunta: "Uma foto de 8 MB abre a página. Uma pessoa com internet fraca, no celular, tende a...",
      opcoes: ["Esperar com calma, sempre", "Desistir antes de ver a página", "Gostar mais da foto"],
      correta: 1,
      explicacao: "Página lenta perde gente antes de ela ver qualquer coisa. Foto leve e só o que precisa na hora deixam a página rápida.",
    },
    ajudas: {
      pergunta: "Quanto uma pessoa espera por uma página que não abre?",
      dica: "Pense em você mesmo com o celular na rua.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
