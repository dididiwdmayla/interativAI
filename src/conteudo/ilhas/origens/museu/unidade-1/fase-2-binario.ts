/* Sala 1, fase 2: os furos viram uns e zeros, e as válvulas acesas viram números. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U1_F2: Fase = {
  id: "origens-museu-u1-f2",
  tipo: "pratica",
  unidadeId: "origens-museu-u1",
  titulo: "Uns e zeros",
  conceitos: ["binario"],
  revisa: ["bit"],
  prerequisitos: ["bit"],
  usaFerramentas: ["tear-de-cartoes", "lampadas-de-bits"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "valvulas",
    placa: {
      titulo: "As válvulas dos anos 1940",
      texto: "Os primeiros computadores eletrônicos usavam milhares de válvulas, que acendiam e apagavam como lâmpadas. Ocupavam salas inteiras.",
    },
    falas: {
      abrir: "OLÁ, PEQUENO! Primeiro, um segredo do tear: cada cartão também é uma fileira de uns e zeros. Furo é 1. Sem furo é 0.",
      porEtapa: {
        "cartao-1011": "Fura esse cartão para ele dizer 1, 0, 1, 1. Olha os números aparecendo do lado!",
        "valvulas-5": "Agora as minhas válvulas! Cada uma vale um peso: 8, 4, 2 e 1. Acesa conta, apagada não.",
        "maior-numero": "Quatro válvulas. Qual o maior número que eu consigo mostrar? Pensa antes de acender!",
        "valvulas-12": "Agora sem ajuda: me mostra o 12. Pode apagar as que sobrarem.",
      },
      concluir: "Eu esquentava feito forno, mas sabia contar! Só com aceso e apagado, e é assim até hoje.",
    },
    estacoes: [
      {
        id: "tear-bits",
        tipo: "tear",
        titulo: "O tear que conta",
        modelo: ["#.##", "##.."],
        inicial: ["....", "##.."],
        mostrarBinario: true,
      },
      { id: "valvulas", tipo: "bits", titulo: "As válvulas", quantos: 4, aparencia: "valvula", pesos: true },
    ],
  },
  introducao: [
    { texto: "Esse é o meu bisavô gigante, dos anos 1940! Cada válvula dele liga ou desliga, que nem um furo no cartão.", expressao: "apontando" },
    { texto: "Furo ou sem furo, aceso ou apagado: dá para trocar por 1 e 0. É assim que o computador escreve números.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "cartao-1011",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "No tear que conta, fure o cartão 1 para ele dizer 1 0 1 1 (furo, sem furo, furo, furo).",
        toque: "No tear que conta, fure o cartão 1 para ele dizer 1 0 1 1 (furo, sem furo, furo, furo).",
      },
      validador: { tipo: "tecidoIgual", estacao: "tear-bits", linhas: [0] },
      ajudas: {
        pergunta: "Se furo é 1 e sem furo é 0, onde o cartão 1 precisa de furo para dizer 1 0 1 1?",
        dica: "Leia da esquerda para a direita: 1 é furo, 0 é deixar sem furo. Os números aparecem do lado do cartão.",
        linha: { alvo: "exposicao", estacao: "tear-bits", peca: "0-0", fala: "O primeiro 1 é este lugar aqui." },
        solucao: {
          fala: "Furei o primeiro, o terceiro e o quarto lugar: o cartão diz 1 0 1 1.",
          acoes: [
            { tipo: "furarCartao", estacao: "tear-bits", linha: 0, coluna: 0, furado: true },
            { tipo: "furarCartao", estacao: "tear-bits", linha: 0, coluna: 2, furado: true },
            { tipo: "furarCartao", estacao: "tear-bits", linha: 0, coluna: 3, furado: true },
          ],
        },
      },
      falaAoConcluir: { texto: "1 0 1 1! Você escreveu em binário furando cartão. A tecelã fazia isso há mais de 200 anos.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "furarCartao", estacao: "tear-bits", linha: 0, coluna: 0 },
        { tipo: "furarCartao", estacao: "tear-bits", linha: 0, coluna: 2 },
        { tipo: "furarCartao", estacao: "tear-bits", linha: 0, coluna: 3 },
      ],
    },
    {
      id: "valvulas-5",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Nas válvulas, acenda as que somam 5. O número aparece embaixo.",
        toque: "Nas válvulas, acenda as que somam 5. O número aparece embaixo.",
      },
      validador: { tipo: "bitsValem", estacao: "valvulas", valor: 5 },
      apresentar: ["lampadas-de-bits"],
      ajudas: {
        pergunta: "Os pesos são 8, 4, 2 e 1. Quais deles somam 5?",
        dica: "Em binário, cada válvula vale o dobro da vizinha da direita. O número é a soma das acesas: 4 + 1 = 5.",
        linha: { alvo: "exposicao", estacao: "valvulas", peca: "1", fala: "Esta válvula vale 4. Falta pouco para o 5." },
        solucao: {
          fala: "Acendi a do 4 e a do 1: 4 + 1 = 5. Em binário, 0101.",
          acoes: [
            { tipo: "alternarBit", estacao: "valvulas", indice: 1, ligado: true },
            { tipo: "alternarBit", estacao: "valvulas", indice: 3, ligado: true },
          ],
        },
      },
      falaAoConcluir: { texto: "5 em binário é 0101. Nada de dígito 5: só aceso e apagado, somando os pesos.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "alternarBit", estacao: "valvulas", indice: 1 },
        { tipo: "alternarBit", estacao: "valvulas", indice: 3 },
      ],
    },
    {
      id: "maior-numero",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora confira: acenda as quatro válvulas e veja o número.",
        toque: "Agora confira: acenda as quatro válvulas e veja o número.",
      },
      previsao: {
        pergunta: "Com quatro válvulas, qual é o MAIOR número que dá para mostrar?",
        opcoes: ["4", "8", "15", "16"],
        correta: 2,
        explicacao: "Todas acesas: 8 + 4 + 2 + 1 = 15. Contando o zero, são 16 números diferentes, de 0 a 15.",
      },
      validador: { tipo: "bitsValem", estacao: "valvulas", valor: 15 },
      ajudas: {
        pergunta: "Se todas estiverem acesas, quanto dá a soma dos pesos?",
        dica: "O maior número é com tudo aceso: some 8, 4, 2 e 1.",
        linha: { alvo: "exposicao", estacao: "valvulas", fala: "Acenda todas as válvulas." },
        solucao: {
          fala: "Todas acesas: 8 + 4 + 2 + 1 = 15. É o maior que quatro válvulas mostram.",
          acoes: [0, 1, 2, 3].map((indice) => ({ tipo: "alternarBit", estacao: "valvulas", indice, ligado: true }) as const),
        },
      },
      falaAoConcluir: { texto: "15 é o teto de quatro válvulas. Quer número maior? Põe mais válvula!", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "alternarBit", estacao: "valvulas", indice: 0, ligado: true },
        { tipo: "alternarBit", estacao: "valvulas", indice: 2, ligado: true },
      ],
    },
    {
      id: "valvulas-12",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Mostre o número 12 nas válvulas. Apague as que não fazem parte.",
        toque: "Mostre o número 12 nas válvulas. Apague as que não fazem parte.",
      },
      validador: { tipo: "bitsValem", estacao: "valvulas", valor: 12 },
      ajudas: {
        pergunta: "Quais pesos, entre 8, 4, 2 e 1, somam 12?",
        dica: "Comece pelo maior peso que cabe: 8. Quanto falta para 12?",
      },
      falaAoConcluir: { texto: "8 + 4 = 12, ou 1100 em binário. Você já conta como computador!", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "alternarBit", estacao: "valvulas", indice: 2, ligado: false },
        { tipo: "alternarBit", estacao: "valvulas", indice: 3, ligado: false },
      ],
    },
  ],
  conclusao: [
    { texto: "Binário é contar só com 0 e 1: cada posição vale o dobro da vizinha, e o número é a soma das acesas.", expressao: "apontando" },
    { texto: "Por baixo de tudo, o computador guarda números assim. Fotos, músicas e esta tela também.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Abra o Console de qualquer site (F12, aba Console) e digite (12).toString(2). Ele responde \"1100\": o 12 em binário. Agora tente parseInt(\"1011\", 2) e descubra que número o cartão do tear guardava.",
  falaFinal: { texto: "O cartão 1011 do tear guardava o 11. A tataravó já contava, e ninguém sabia!", expressao: "comemorando" },
};
