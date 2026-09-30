/*
 * Revisão: nome, endereço e telefone iguais (S3, Fase 1).
 *
 * Uma ação (o telefone do rodapé com um número trocado em relação ao do topo)
 * e uma previsão sobre um endereço escrito de dois jeitos.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_NOME_ENDERECO_TELEFONE: ItemRevisao[] = [
  {
    id: "nome-endereco-telefone-1",
    conceito: "nome-endereco-telefone",
    tipo: "acao",
    enunciado: {
      mouse: "O perfil da academia diz (85) 3555-0133. Deixe o telefone do rodapé igual, trocando o texto dele.",
      toque: "O perfil da academia diz (85) 3555-0133. Deixe o telefone do rodapé igual, trocando o texto dele (toque no texto, na árvore).",
    },
    siteAlvo: {
      url: "academiaforcaviva.exemplo",
      titulo: "Academia Força Viva",
      body: `<h1>Academia Força Viva</h1>
<p>Telefone: <span id="tel-a">(85) 3555-0133</span></p>
<p>Musculação e spinning, de segunda a sábado.</p>
<footer>Fale conosco: <span id="tel-b">(85) 3555-0313</span></footer>`,
    },
    validador: { tipo: "textoIgual", seletor: "#tel-b", valor: "(85) 3555-0133" },
    ajudas: {
      pergunta: "O número do rodapé é o mesmo do topo e do perfil?",
      dica: "Escreva o telefone do perfil, dígito por dígito, no rodapé.",
    },
    solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#tel-b", valor: "(85) 3555-0133" }],
  },
  {
    id: "nome-endereco-telefone-2",
    conceito: "nome-endereco-telefone",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "livrariacantodapraca.exemplo",
      titulo: "Livraria Canto da Praça",
      body: `<h1>Livraria Canto da Praça</h1>
<p>Rua Alta, 50, Vila Nova.</p>
<p>No Instagram: R. Alta, 5, Vila Nova.</p>`,
    },
    previsao: {
      pergunta: "O site diz \"Rua Alta, 50\" e o Instagram diz \"R. Alta, 5\". Qual o problema?",
      opcoes: [
        "Nenhum: cada lugar pode dizer o que quiser",
        "O cliente pode ir ao lugar errado, e a busca fica em dúvida",
        "A página fica mais lenta",
      ],
      correta: 1,
      explicacao: "Dados diferentes confundem o cliente e a busca. Nome, endereço e telefone iguais em todo lugar dizem que é o mesmo negócio.",
    },
    ajudas: {
      pergunta: "Qual dos dois endereços está certo? Alguém de fora consegue saber?",
      dica: "Se os dados divergem, ninguém sabe em qual acreditar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
