/* Sala 1, fase 1: o tear que lê cartões. Furar cartões tece um desenho: binário sem dizer que é. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U1_F1: Fase = {
  id: "origens-museu-u1-f1",
  tipo: "pratica",
  unidadeId: "origens-museu-u1",
  titulo: "O tear que lê cartões",
  conceitos: ["bit"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["tear-de-cartoes"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "tecela",
    placa: {
      titulo: "O tear de Jacquard",
      texto: "Início dos anos 1800. Um tear que tecia desenhos sozinho, lendo uma corrente de cartões perfurados: um cartão para cada linha do pano.",
    },
    falas: {
      abrir: "Chega mais, meu bem. Cada cartão meu é uma linha do pano. Onde tem furo, o fio sobe e a cor aparece.",
      porEtapa: {
        "furar-linha-cheia": "O cartão 3 está em branco. Fura tudo, que essa linha é a mais larga do desenho.",
        "um-furo": "Agora o último cartão. Um furinho só... o que será que acontece?",
        "coracao-sozinho": "Esse outro tear é seu. Os cartões estão em branco e o desenho é um coração. Capricha!",
      },
      concluir: "Viu? Eu não sei o que é flor nem coração. Eu só leio furo e sem furo, e o desenho aparece.",
    },
    estacoes: [
      {
        id: "tear-flor",
        tipo: "tear",
        titulo: "O tear da árvore",
        modelo: ["..#..", ".###.", "#####", "..#.."],
        inicial: ["..#..", ".###.", ".....", "....."],
      },
      {
        id: "tear-coracao",
        tipo: "tear",
        titulo: "O tear do coração",
        modelo: [".#.#.", "#####", ".###.", "..#.."],
      },
    ],
  },
  introducao: [
    { texto: "Bem-vindo à sala 1! Antes de ter tela, teclado ou luz, já existia máquina seguindo ordens. Olha só quem eu trouxe.", expressao: "apontando" },
    { texto: "Ela é a tataravó de todo mundo: o tear que lê cartões perfurados. Cada furo é uma ordem para o fio.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "furar-linha-cheia",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique nos cinco lugares do cartão 3 para furar e veja a linha 3 do tecido aparecer.",
        toque: "Toque nos cinco lugares do cartão 3 para furar e veja a linha 3 do tecido aparecer.",
      },
      validador: { tipo: "tecidoIgual", estacao: "tear-flor", linhas: [2] },
      apresentar: ["tear-de-cartoes"],
      ajudas: {
        pergunta: "No desenho pedido, a linha 3 tem quantos quadradinhos coloridos?",
        dica: "Cada lugar furado no cartão levanta um fio, e aquele quadradinho do tecido fica colorido. Sem furo, fica a cor do pano.",
        linha: { alvo: "exposicao", estacao: "tear-flor", peca: "2-0", fala: "Comece por aqui: o primeiro lugar do cartão 3." },
        solucao: {
          fala: "Furei os cinco lugares do cartão 3: os cinco fios subiram e a linha ficou cheia de cor.",
          acoes: [0, 1, 2, 3, 4].map((coluna) => ({ tipo: "furarCartao", estacao: "tear-flor", linha: 2, coluna, furado: true }) as const),
        },
      },
      falaAoConcluir: { texto: "A linha cheia apareceu! O tear não pensa: ele obedece aos furos.", expressao: "comemorando" },
      solucaoDeTeste: [0, 1, 2, 3, 4].map((coluna) => ({ tipo: "furarCartao", estacao: "tear-flor", linha: 2, coluna }) as const),
    },
    {
      id: "um-furo",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora confira: fure só o meio do cartão 4 e olhe a linha 4 do tecido.",
        toque: "Agora confira: fure só o meio do cartão 4 e olhe a linha 4 do tecido.",
      },
      previsao: {
        pergunta: "Se o cartão 4 tiver um furo só, bem no meio, como fica a linha 4 do tecido?",
        opcoes: ["A linha inteira colorida", "Só o quadradinho do meio colorido", "A linha some do pano"],
        correta: 1,
        explicacao: "Um furo levanta um fio só. Os outros lugares, sem furo, ficam com a cor do pano: o tronco da árvore.",
      },
      validador: { tipo: "tecidoIgual", estacao: "tear-flor", linhas: [3] },
      ajudas: {
        pergunta: "Quantos fios sobem com um furo só?",
        dica: "Cada furo é um fio levantado. O lugar do furo no cartão é o lugar da cor no pano.",
        linha: { alvo: "exposicao", estacao: "tear-flor", peca: "3-2", fala: "O meio do cartão 4 é este lugar aqui." },
        solucao: {
          fala: "Um furo no meio do cartão 4: um fio subiu e virou o tronco da árvore.",
          acoes: [{ tipo: "furarCartao", estacao: "tear-flor", linha: 3, coluna: 2, furado: true }],
        },
      },
      falaAoConcluir: { texto: "A árvore ficou pronta! Furo ou sem furo: só dois jeitos, e já dá para fazer um desenho.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "furarCartao", estacao: "tear-flor", linha: 3, coluna: 2 },
      ],
    },
    {
      id: "coracao-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "No tear do coração, os cartões estão em branco. Fure os lugares certos e teça o coração inteiro.",
        toque: "No tear do coração, os cartões estão em branco. Fure os lugares certos e teça o coração inteiro.",
      },
      validador: { tipo: "tecidoIgual", estacao: "tear-coracao" },
      ajudas: {
        pergunta: "Olhando o desenho pedido linha por linha, onde cada cartão precisa de furo?",
        dica: "Faça um cartão de cada vez: confira a linha do desenho e fure só onde ela é colorida.",
      },
      falaAoConcluir: { texto: "Um coração inteiro, só de furos! Você deu as ordens e o tear obedeceu.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "furarCartao", estacao: "tear-coracao", linha: 0, coluna: 1 },
        { tipo: "furarCartao", estacao: "tear-coracao", linha: 0, coluna: 3 },
        ...[0, 1, 2, 3, 4].map((coluna) => ({ tipo: "furarCartao", estacao: "tear-coracao", linha: 1, coluna }) as const),
        ...[1, 2, 3].map((coluna) => ({ tipo: "furarCartao", estacao: "tear-coracao", linha: 2, coluna }) as const),
        { tipo: "furarCartao", estacao: "tear-coracao", linha: 3, coluna: 2 },
      ],
    },
  ],
  conclusao: [
    { texto: "Cada lugar do cartão só tem duas respostas: furo ou sem furo. Essa ideia tem nome: bit, a menor informação que existe.", expressao: "apontando" },
    { texto: "Guarde esse segredo da minha tataravó. Na próxima exposição, ele vira número.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Pegue uma folha quadriculada e invente um desenho de 5 por 5. Escreva embaixo de cada linha um X onde a cor aparece e um tracinho onde não aparece. Você acabou de escrever os cartões do tear.",
  falaFinal: { texto: "Furo e sem furo. Ligado e desligado. Você vai ver esse par em todo canto do computador.", expressao: "feliz" },
};
