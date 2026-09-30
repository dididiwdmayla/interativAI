/*
 * Revisão: perfil da empresa no Google (S3, Fase 1).
 *
 * Só previsões: o perfil vive no Google, fora do jogo, então não há gesto
 * para uma ação. As duas perguntas cobrem o que ele é (a ficha que aparece na
 * busca e no mapa) e quem pode ter um (até quem atende sem loja).
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_PERFIL_DA_EMPRESA: ItemRevisao[] = [
  {
    id: "perfil-da-empresa-1",
    conceito: "perfil-da-empresa",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "mercadinhosaojorge.exemplo",
      titulo: "Mercadinho São Jorge",
      body: `<h1>Mercadinho São Jorge</h1>
<p>Frutas, verduras e mercearia.</p>
<p>Rua Nova, 300, Londrina. Aberto das 7h às 20h.</p>`,
    },
    previsao: {
      pergunta: "Alguém busca \"mercadinho perto de mim\". Onde aparece o telefone e o horário dele, sem abrir o site?",
      opcoes: ["Na ficha do perfil da empresa, no mapa e na busca", "Só dentro do site dele", "Só nas redes sociais"],
      correta: 0,
      explicacao: "O perfil da empresa é a ficha do negócio no Google: aparece na Pesquisa e no Maps, com endereço, telefone e horário.",
    },
    ajudas: {
      pergunta: "De onde vem o mapa com a lista de empresas que aparece na busca local?",
      dica: "É o perfil da empresa no Google, que o dono preenche e cuida.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "perfil-da-empresa-2",
    conceito: "perfil-da-empresa",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "eletricistaaraujo.exemplo",
      titulo: "Eletricista Araújo",
      body: `<h1>Eletricista Araújo</h1>
<p>Atendimento a domicílio em Fortaleza e região.</p>
<p>Não tenho loja: vou até você.</p>`,
    },
    previsao: {
      pergunta: "Este eletricista atende na casa dos clientes e não tem loja. Ele pode ter um perfil da empresa?",
      opcoes: [
        "Não, o perfil é só para quem tem loja",
        "Sim, informando a área de atendimento no lugar do endereço",
        "Só se alugar uma sala comercial",
      ],
      correta: 1,
      explicacao: "O perfil também serve a quem atende em domicílio: no lugar do endereço da loja, ele informa a área de atendimento.",
    },
    ajudas: {
      pergunta: "Quem não tem loja precisa de um endereço físico para aparecer?",
      dica: "Existe um jeito de dizer onde você atende, sem loja: a área de atendimento.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];
