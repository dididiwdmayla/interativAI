/*
 * Revisão: avaliações dos clientes (S3, Fase 2).
 *
 * Uma ação (responder uma avaliação de uma estrela) e uma previsão sobre o
 * que fazer com uma avaliação ruim.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_AVALIACOES_DO_CLIENTE: ItemRevisao[] = [
  {
    id: "avaliacoes-do-cliente-1",
    conceito: "avaliacoes-do-cliente",
    tipo: "acao",
    enunciado: {
      mouse: "Um cliente deu 1 estrela. Troque o \"Sem resposta.\" pelo texto de uma resposta educada, que peça desculpas.",
      toque: "Um cliente deu 1 estrela. Troque o \"Sem resposta.\" (toque no texto, na árvore) por uma resposta educada, que peça desculpas.",
    },
    siteAlvo: {
      url: "lavarapidodoze.exemplo",
      titulo: "Lava Rápido Doze",
      body: `<h1>Lava Rápido Doze</h1>
<article>
  <p><strong>1 estrela.</strong> Entregaram o carro com o banco molhado.</p>
  <p id="resposta-cliente">Sem resposta.</p>
</article>`,
    },
    validador: { tipo: "textoDiferenteDoInicial", seletor: "#resposta-cliente" },
    ajudas: {
      pergunta: "O cliente reclamou de quê? Uma resposta pode resolver?",
      dica: "Peça desculpas, diga o que vai fazer (secar de novo, por exemplo) e não discuta.",
    },
    solucaoDeTeste: [
      {
        tipo: "definirTexto",
        seletor: "#resposta-cliente",
        valor: "Desculpe o transtorno. Vamos secar o banco de novo, sem custo. Pode passar aqui quando quiser.",
      },
    ],
  },
  {
    id: "avaliacoes-do-cliente-2",
    conceito: "avaliacoes-do-cliente",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "clinicavetpatinhas.exemplo",
      titulo: "Clínica Vet Patinhas",
      body: `<h1>Clínica Vet Patinhas</h1>
<p>Consultas, vacinas e banho e tosa.</p>`,
    },
    previsao: {
      pergunta: "Chegou uma avaliação de 2 estrelas na ficha da clínica. O que faz mais sentido?",
      opcoes: [
        "Ignorar: avaliação ruim passa sozinha",
        "Pagar alguém para escrever avaliações boas",
        "Responder com educação e oferecer uma solução",
      ],
      correta: 2,
      explicacao: "Resposta educada mostra cuidado, e quem lê também decide pela resposta. Comprar avaliações é enganar quem lê.",
    },
    ajudas: {
      pergunta: "Quem mais lê a resposta, além do cliente que reclamou?",
      dica: "Quem ainda vai decidir também lê. Pense no que faria você confiar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
