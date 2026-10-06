/*
 * Sala 4, fase 5: o gigante de válvulas deixa o aluno programar plugando
 * cabos, como nos anos 1940, para somar dois números de um bit. No fim,
 * ele revela: aquilo era um meio somador (que a fase seguinte monta com
 * portões).
 */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { LEGENDAS_DO_GIGANTE, PAINEL_DO_GIGANTE, tabelaDoSomador } from "./circuitos";

export const FASE_ORIGENS_U4_F5: Fase = {
  id: "origens-museu-u4-f5",
  tipo: "pratica",
  unidadeId: "origens-museu-u4",
  titulo: "Os cabos do gigante",
  conceitos: ["meio-somador"],
  revisa: ["binario", "bit"],
  prerequisitos: ["binario"],
  usaFerramentas: ["painel-de-cabos"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "valvulas",
    placa: {
      titulo: "O painel de cabos",
      texto: "Anos 1940: os computadores de válvulas eram programados ligando cabos e chaves, à mão. Simplificado: duas caixas de válvulas, duas lâmpadas.",
    },
    falas: {
      abrir: "VISITA NA SALA DO TIO! PEQUENO, NO MEU TEMPO NÃO TINHA TECLADO. PROGRAMA ERA CABO. QUER TENTAR?",
      porEtapa: {
        "vai-um": "A SOMA ACENDE! AGORA O VAI UM. OUTRA CAIXA, MAIS TRÊS CABOS. CAPRICHA!",
        "um-mais-um": "AGORA A CONTA DE VERDADE. LIGA AS DUAS CHAVES. UM MAIS UM!",
      },
      concluir: "UM MAIS UM DEU 10! E SABE O QUE VOCÊ PLUGOU? UM MEIO SOMADOR! O TIO VAI TE MOSTRAR ELE EM PORTÕES.",
    },
    estacoes: [{ id: "painel", tipo: "circuito", titulo: "O painel do gigante", aparencia: "cabos", inicial: PAINEL_DO_GIGANTE, paleta: [], legendas: LEGENDAS_DO_GIGANTE }],
  },
  introducao: [
    { texto: "Olha quem veio de visita: o meu bisavô gigante! Ele quer mostrar como se programava antes do teclado.", expressao: "curioso" },
    { texto: "Duas chaves, A e B, cada uma é um bit. Vamos fazer o gigante somar as duas.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "a-soma",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Plugue a soma: um cabo de A e um de B na caixa de cima, e a caixa na lâmpada soma.",
        toque: "Plugue a soma: um cabo de A e um de B na caixa de cima, e a caixa na lâmpada soma.",
      },
      validador: { tipo: "circuitoNaEstacao", estacao: "painel", esperado: tabelaDoSomador("soma") },
      apresentar: ["painel-de-cabos"],
      ajudas: {
        pergunta: "A caixa de cima acende se só uma das entradas acender. De onde vêm as entradas dela?",
        dica: "Toque na tomada da direita de uma peça e depois numa tomada da esquerda de outra: o cabo liga as duas.",
        linha: { alvo: "exposicao", estacao: "painel", peca: "so-uma", fala: "Esta caixa faz a soma." },
        solucao: {
          fala: "Pluguei A e B na caixa de cima, e a caixa na lâmpada soma.",
          acoes: [
            { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "a", para: "so-uma", porta: 0 } },
            { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "b", para: "so-uma", porta: 1 } },
            { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "so-uma", para: "soma", porta: 0 } },
          ],
        },
      },
      falaAoConcluir: { texto: "Liga só uma chave: a soma acende. 1 + 0 = 1! Era assim, cabo por cabo.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "a", para: "so-uma", porta: 0 } },
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "b", para: "so-uma", porta: 1 } },
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "so-uma", para: "soma", porta: 0 } },
      ],
    },
    {
      id: "vai-um",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: plugue o vai um. As chaves na caixa de baixo, e ela na lâmpada vai um.",
        toque: "Agora sozinho: plugue o vai um. As chaves na caixa de baixo, e ela na lâmpada vai um.",
      },
      validador: { tipo: "circuitoNaEstacao", estacao: "painel", esperado: tabelaDoSomador("as-duas") },
      ajudas: {
        pergunta: "Quando a conta passa de 1, o que precisa ir para a casa da frente?",
        dica: "A caixa de baixo acende quando as duas chaves acendem. É ela que manda o vai um.",
      },
      falaAoConcluir: { texto: "Duas caixas, seis cabos. O painel do gigante está programado!", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "a", para: "as-duas", porta: 0 } },
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "b", para: "as-duas", porta: 1 } },
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "fio", de: "as-duas", para: "vai-um", porta: 0 } },
      ],
    },
    {
      id: "um-mais-um",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Ligue as duas chaves, A e B: o gigante vai somar 1 + 1.",
        toque: "Ligue as duas chaves, A e B: o gigante vai somar 1 + 1.",
      },
      previsao: {
        pergunta: "Com A e B ligadas (1 + 1), quais lâmpadas vão acender?",
        opcoes: ["Só a soma", "Só o vai um", "As duas"],
        correta: 1,
        explicacao: "1 + 1 = 2, que em binário é 10: o vai um aceso (o 1 da frente) e a soma apagada (o 0).",
      },
      validador: { tipo: "circuitoNaEstacao", estacao: "painel", agora: { entradas: { a: true, b: true }, saidas: { soma: false, vaiUm: true } } },
      ajudas: {
        pergunta: "Como se escreve o número 2 em binário, com dois bits?",
        dica: "Toque nas duas chaves de faca para ligar. O mostrador embaixo faz a conta em binário.",
        linha: { alvo: "exposicao", estacao: "painel", peca: "a", fala: "Ligue esta chave e a de baixo." },
        solucao: {
          fala: "Liguei A e B: 1 + 1 = 10.",
          acoes: [
            { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "chave", entrada: "a", ligada: true } },
            { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "chave", entrada: "b", ligada: true } },
          ],
        },
      },
      falaAoConcluir: { texto: "1 + 1 = 10! O 1 vai para a casa da frente, como o vai um da conta de armar.", expressao: "curioso" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "chave", entrada: "a", ligada: true } },
        { tipo: "mexerNoCircuito", estacao: "painel", mudanca: { tipo: "chave", entrada: "b", ligada: true } },
      ],
    },
  ],
  conclusao: [
    { texto: "Isso que você plugou tem nome: meio somador. Soma dois bits e diz se vai um.", expressao: "apontando" },
    { texto: "Por dentro, as caixas de válvulas eram portões lógicos. A próxima exposição abre elas.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Procure uma foto do ENIAC, um dos computadores de válvulas dos anos 1940. Repare nos painéis cheios de cabos: cada programa novo era plugado à mão.",
  falaFinal: { texto: "Hoje ninguém pluga cabo para programar. Mas lá dentro do chip, a soma ainda é feita assim.", expressao: "feliz" },
};
