/*
 * S3, Fase 2: "Avaliações dos clientes" (Restaurante Sabor de Casa).
 *
 * O QUE ENSINA: avaliações: pedir e responder, nunca comprar. Também a
 * verificação do perfil (a prova de que você é o responsável, condição
 * para responder avaliações e editar o resto), conferida em 30/09/2026.
 *
 * REVISA: editar texto pela árvore (U1).
 *
 * ORDEM: 1) guiado, com previsão sobre comprar avaliações, depois
 * responder a de duas estrelas; 2) sozinho, agradecer a de quatro estrelas.
 * O validador só confere que o texto mudou: quem confere o tom é o jogador
 * (e o computadorzinho, que pergunta).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { RESTAURANTE_SABOR_DE_CASA } from "./sites/restauranteSaborDeCasa";

export const FASE_S3_F2: FasePratica = {
  id: "sites-ser-encontrado-u3-f2",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u3",
  titulo: "Avaliações dos clientes",
  conceitos: ["avaliacoes-do-cliente"],
  revisa: ["editar-texto"],
  prerequisitos: ["perfil-da-empresa"],
  usaFerramentas: ["arvore", "editar-duplo-clique"],
  siteAlvo: RESTAURANTE_SABOR_DE_CASA,
  introducao: [
    { texto: "Antes de ir a um lugar, muita gente lê as avaliações dos outros clientes. Elas pesam na decisão.", expressao: "pensativo" },
    { texto: "Para responder avaliações no perfil de verdade, ele precisa estar verificado: a prova de que você é o responsável pelo negócio.", expressao: "curioso" },
    { texto: "Aqui o Sabor de Casa mostra três avaliações no site, e você treina as respostas.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "responder-avaliacao-ruim",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Um amigo oferece 50 avaliações de 5 estrelas por R$ 30. Vale a pena para o restaurante?",
        opcoes: ["Vale: nota alta atrai clientes", "Vale, se ninguém descobrir", "Não: são falsas, enganam quem lê e queimam a confiança"],
        correta: 2,
        explicacao: "Avaliação boa vem de cliente satisfeito: peça e responda. Comprar é enganar quem decide, e a confiança perdida não volta fácil.",
      },
      enunciado: {
        mouse: "Responda à avaliação de 2 estrelas: troque o \"Sem resposta do restaurante.\" dela (dois cliques na árvore) por uma resposta educada.",
        toque: "Responda à avaliação de 2 estrelas: troque o \"Sem resposta do restaurante.\" dela (toque no texto, na árvore) por uma resposta educada.",
      },
      validador: { tipo: "textoDiferenteDoInicial", seletor: "#resposta-2" },
      ajudas: {
        pergunta: "Como você gostaria de ser tratado se tivesse esperado 50 minutos?",
        dica: "Agradeça o aviso, peça desculpas sem discutir e diga o que vai mudar. Quem ainda vai decidir também lê a resposta.",
        linha: { alvo: "arvore", seletor: "#resposta-2", parte: "texto", fala: "Este é o espaço da resposta da avaliação de 2 estrelas. Escreva a resposta aqui." },
        solucao: {
          fala: "Respondi com um agradecimento, um pedido de desculpas e o que vai mudar: sem discutir e sem prometer o que não dá.",
          acoes: [
            {
              tipo: "definirTexto",
              seletor: "#resposta-2",
              valor: "Obrigado pelo aviso e desculpe a demora. Reforçamos a cozinha no almoço. Volte para a gente acertar.",
            },
          ],
        },
      },
      falaAoConcluir: { texto: "Resposta educada e sem discussão. Uma avaliação ruim bem respondida pode até ganhar clientes.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "definirTexto", seletor: "#resposta-2", valor: "Obrigado pelo aviso e desculpe a demora. Reforçamos a cozinha no almoço. Volte para a gente acertar." },
      ],
    },
    {
      id: "agradecer-avaliacao",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora agradeça a avaliação de 4 estrelas, no espaço de resposta dela. Cite algo que o cliente elogiou.",
        toque: "Agora agradeça a avaliação de 4 estrelas, no espaço de resposta dela. Cite algo que o cliente elogiou.",
      },
      validador: { tipo: "textoDiferenteDoInicial", seletor: "#resposta-3" },
      ajudas: {
        pergunta: "Qual foi o elogio do cliente? Vale usar as palavras dele na resposta?",
        dica: "Agradeça, cite a feijoada e, se der, diga que a sobremesa foi anotada. Resposta curta e sincera.",
      },
      falaAoConcluir: { texto: "Agradecimento com o elogio citado. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#resposta-3", valor: "Que bom que gostou da feijoada! Anotamos a sobremesa. Obrigado pela visita." }],
    },
  ],
  conclusao: [
    { texto: "Só depois de verificado dá para editar tudo no perfil, responder avaliações, publicar fotos e posts e ver as estatísticas.", expressao: "feliz" },
    { texto: "A verificação pode ser por carta com código, telefone, e-mail ou vídeo, conforme o caso, e pode levar dias (conferido em 30/09/2026).", expressao: "pensativo" },
  ],
  missaoDeCampo:
    "Abra no Google a ficha de um restaurante ou loja que você conhece e leia uma avaliação ruim. O dono respondeu? O tom foi educado? Como você teria escrito a resposta?",
  falaFinal: { texto: "Próxima fase: o bloco de dados que liga o site ao negócio.", expressao: "feliz" },
};
