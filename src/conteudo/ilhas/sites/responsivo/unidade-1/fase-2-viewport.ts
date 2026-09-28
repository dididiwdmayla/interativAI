/*
 * R1, Fase 2: "Por que o celular desenha gigante" (Pet Shop Focinho
 * Feliz, modo documento).
 *
 * O QUE ENSINA: o `<meta name="viewport">`. Sem ele, o navegador de
 * celular desenha a página numa largura de 980px (como se fosse um
 * monitor pequeno) e depois ENCOLHE tudo para caber na tela — por isso
 * texto e botões ficam minúsculos. Com o meta viewport, o navegador
 * desenha a página na largura REAL do aparelho.
 *
 * ORDEM: 1) guiado, ligar o Celular 390 no site (que ainda não tem o
 * meta) e VER a simulação de 980px de propósito, antes de consertar; 2)
 * guiado, previsão sobre o que vai mudar ao acrescentar o meta, depois
 * acrescentar; 3) sozinho, tablet + confirmar sem simulação.
 *
 * SITE-ALVO: modo documento (para editar o head). PET_SHOP_FOCINHO_FELIZ
 * começa sem `<meta name="viewport">`.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { PET_SHOP_FOCINHO_FELIZ } from "./sites/petShopFocinhoFeliz";

export const FASE_R1_F2: FasePratica = {
  id: "sites-responsivo-u1-f2",
  tipo: "pratica",
  unidadeId: "sites-responsivo-u1",
  titulo: "Por que o celular desenha gigante",
  conceitos: ["meta-viewport", "simulacao-sem-viewport"],
  revisa: ["modo-dispositivo"],
  prerequisitos: ["estrutura-do-documento", "head-vs-body"],
  usaFerramentas: ["modo-dispositivo", "editor", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  modoDocumento: true,
  siteAlvo: PET_SHOP_FOCINHO_FELIZ,
  introducao: [
    { texto: "O Pet Shop Focinho Feliz ainda não tem uma linha importante no head: o meta viewport.", expressao: "pensativo" },
    { texto: "Vamos ver o que acontece SEM ela primeiro, no celular.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "ver-simulacao",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ligue o modo dispositivo no Celular 390 e olhe o aviso que aparece na prévia.",
        toque: "Ligue o modo dispositivo no Celular 390 e olhe o aviso que aparece na prévia.",
      },
      validador: { tipo: "dispositivo", largura: 390 },
      ajudas: {
        pergunta: "Qual botão liga o modo dispositivo?",
        dica: "O mesmo botão da fase anterior, ao lado da setinha.",
        linha: { alvo: "ferramenta", ferramenta: "modo-dispositivo", fala: "Este botão." },
        solucao: { fala: "Liguei o Celular 390: apareceu um aviso de simulação, e tudo ficou minúsculo.", acoes: [{ tipo: "trocarDispositivo", modelo: "celular-390" }] },
      },
      falaAoConcluir: {
        texto: "Reparou como ficou tudo pequeno, e um aviso de \"simulação\" apareceu? Sem o meta viewport, o celular desenha a página em 980px e encolhe tudo para caber.",
        expressao: "pensativo",
      },
      solucaoDeTeste: [{ tipo: "trocarDispositivo", modelo: "celular-390" }],
    },
    {
      id: "previsao-viewport",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: 'Se eu acrescentar <meta name="viewport" content="width=device-width, initial-scale=1"> no head, o que muda na prévia?',
        opcoes: ["Nada, é só um detalhe técnico", "A página passa a desenhar na largura real do celular, sem precisar encolher tudo", "A página fica mais rápida de carregar"],
        correta: 1,
        explicacao: "device-width diz para o navegador usar a largura REAL da tela (390px), em vez dos 980px de simulação. Texto e botões voltam ao tamanho certo.",
      },
      enunciado: {
        mouse: "Confira: acrescente essa linha no fim do head, pelo editor.",
        toque: "Confira: acrescente essa linha no fim do head, pelo editor.",
      },
      validador: { tipo: "existe", seletor: 'meta[name="viewport"]' },
      ajudas: {
        pergunta: "Onde ficam as linhas meta de uma página?",
        dica: "Dentro do head, no editor (aba HTML). Escreva a linha completa, com as aspas.",
        linha: { alvo: "editor", seletor: "head", fala: "É dentro daqui, do head." },
        solucao: {
          fala: 'Acrescentei <meta name="viewport" content="width=device-width, initial-scale=1"> no fim do head.',
          acoes: [{ tipo: "inserirHTML", seletor: "head", posicao: "fim", html: '<meta name="viewport" content="width=device-width, initial-scale=1">' }],
        },
      },
      falaAoConcluir: { texto: "Olha só a diferença! Texto e botões voltaram ao tamanho certo, e o aviso de simulação sumiu.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "inserirHTML", seletor: "head", posicao: "fim", html: '<meta name="viewport" content="width=device-width, initial-scale=1">' },
      ],
    },
    {
      id: "banner-cabe-na-tela",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Ainda no Celular 390: o banner amarelo de promoção (.banner-promocao) tem 500px de largura, maior que a tela. Troque para 360px.",
        toque: "Ainda no Celular 390: o banner amarelo de promoção (.banner-promocao) tem 500px de largura, maior que a tela. Troque para 360px.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".banner-promocao", propriedade: "width", valor: "360px", larguraTela: 390 },
      ajudas: {
        pergunta: "Mesmo com o meta viewport certo, uma peça pode continuar maior que a tela: onde está essa largura fixa?",
        dica: "A regra .banner-promocao, no painel Estilos: troque o valor de width de 500px para 360px.",
      },
      falaAoConcluir: {
        texto: "Agora cabe! O meta viewport resolve a página inteira; uma peça com largura fixa ainda pode estourar sozinha, e precisa de ajuste à parte.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".banner-promocao", propriedade: "width", valor: "360px" }],
    },
  ],
  conclusao: [
    { texto: "Agora você sabe diagnosticar o problema mais comum de celular: a página sem meta viewport.", expressao: "comemorando" },
    { texto: "Todo site de verdade que você abrir daqui pra frente vai ter essa linha no head — agora você sabe por quê.", expressao: "feliz" },
  ],
  missaoDeCampo: "No F12 de um site de verdade, abra a aba Elements, expanda o head e procure a linha meta name=\"viewport\". Quase todo site tem.",
  falaFinal: { texto: "Hora do desafio: achar e consertar problemas de celular sozinho.", expressao: "curioso" },
};
