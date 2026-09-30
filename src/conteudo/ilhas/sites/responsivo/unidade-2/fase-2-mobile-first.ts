/*
 * R2, Fase 2: "Mobile first e imagem responsiva" (Loja Verde Vivo).
 *
 * O QUE ENSINA: duas ideias que andam juntas.
 * 1. Imagem responsiva: `max-width: 100%` (com `height: auto`) faz a
 *    imagem nunca estourar a largura do espaço dela, em NENHUMA tela —
 *    sem precisar de @media nenhuma.
 * 2. Mobile first: escrever o CSS base já pensando no celular (uma
 *    coluna, sem @media) e usar `min-width` para ACRESCENTAR layout
 *    conforme a tela cresce — o oposto do `max-width` da Fase 1 (que
 *    parte do desktop e tira coisas para telas pequenas).
 *
 * ORDEM: 1) guiado, imagem responsiva (max-width: 100%); 2) guiado,
 * previsão sobre por que escrever pensando no celular primeiro é mais
 * simples, depois acrescentar um @media (min-width) que muda os
 * produtos para lado a lado numa tela maior; 3) sozinho, outro
 * min-width para o mesmo estilo de acréscimo.
 *
 * SITE-ALVO: Loja Verde Vivo, escrita MOBILE FIRST de propósito (uma
 * coluna, sem @media nenhuma na folha inicial — contraste direto com o
 * Estúdio Passo Leve da Fase 1, que era desktop first).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_VERDE_VIVO } from "./sites/lojaVerdeVivo";

export const FASE_R2_F2: FasePratica = {
  id: "sites-responsivo-u2-f2",
  tipo: "pratica",
  unidadeId: "sites-responsivo-u2",
  titulo: "Mobile first e imagem responsiva",
  conceitos: ["imagem-responsiva", "mobile-first", "unidade-responsiva"],
  revisa: ["media-query", "breakpoint"],
  prerequisitos: ["media-query"],
  usaFerramentas: ["painel-estilos", "editar-valor-css", "editor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: LOJA_VERDE_VIVO,
  introducao: [
    { texto: "A foto da Verde Vivo tem 480px fixos: numa tela menor que isso, ela estoura e empurra a página para o lado.", expressao: "pensativo" },
    { texto: "E o CSS desta loja já começa pensando no celular: uma coluna só, sem @media nenhuma ainda.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "imagem-responsiva",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Na regra .foto-loja, troque width: 480px por max-width: 100% (e acrescente height: auto).",
        toque: "Na regra .foto-loja, troque width: 480px por max-width: 100% (e acrescente height: auto).",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "declaracao", seletorRegra: ".foto-loja", propriedade: "max-width", valor: "100%" },
          { tipo: "declaracao", seletorRegra: ".foto-loja", propriedade: "height", valor: "auto" },
        ],
      },
      ajudas: {
        pergunta: "Qual valor faz uma medida se ajustar ao espaço disponível, em vez de ficar sempre do mesmo tamanho?",
        dica: "max-width: 100% (nunca passa da largura do pai) e height: auto (a altura acompanha, sem esticar a imagem).",
        linha: { alvo: "estilos", seletorRegra: ".foto-loja", propriedade: "width", fala: "É esta declaração: troque width por max-width, e acrescente height." },
        solucao: {
          fala: "Troquei width: 480px por max-width: 100% e acrescentei height: auto: a foto agora se ajusta em qualquer tela.",
          acoes: [
            { tipo: "definirPropriedade", seletorRegra: ".foto-loja", propriedade: "max-width", valor: "100%" },
            { tipo: "definirPropriedade", seletorRegra: ".foto-loja", propriedade: "height", valor: "auto" },
          ],
        },
      },
      falaAoConcluir: { texto: "Agora a foto NUNCA estoura, em nenhuma largura: nem precisou de @media para isso.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".foto-loja", propriedade: "max-width", valor: "100%" },
        { tipo: "definirPropriedade", seletorRegra: ".foto-loja", propriedade: "height", valor: "auto" },
      ],
    },
    {
      id: "previsao-mobile-first",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O CSS da Verde Vivo já é o do celular (uma coluna), sem nenhuma @media. Para a tela crescer e virar duas colunas, que tipo de condição faz mais sentido usar?",
        opcoes: ["min-width (a partir de uma largura)", "max-width (abaixo de uma largura)", "Nenhuma: duas colunas têm que ser o padrão"],
        correta: 0,
        explicacao: "Mobile first é isso: o padrão já É o celular. Uma @media com min-width ACRESCENTA o layout maior só quando a tela CRESCE o bastante, sem tirar nada do celular.",
      },
      enunciado: {
        mouse: "Confira: acrescente @media (min-width: 700px) { .produtos { flex-direction: row; } }.",
        toque: "Confira: acrescente @media (min-width: 700px) { .produtos { flex-direction: row; } }.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "flex-direction", valor: "row", larguraTela: 1280 },
          { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "flex-direction", valor: "column", larguraTela: 390 },
        ],
      },
      ajudas: {
        pergunta: "Qual palavra troca max-width por \"a partir de\" numa @media?",
        dica: "min-width: 700px. Dentro do bloco, .produtos { flex-direction: row; }.",
        linha: { alvo: "css", seletorRegra: ".produtos", fala: "Acrescente um bloco @media (min-width: 700px) no fim da folha, com essa regra dentro." },
        solucao: {
          fala: "Acrescentei @media (min-width: 700px): a partir daí, os produtos ficam lado a lado; abaixo, continuam em coluna (o padrão mobile first).",
          acoes: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (min-width: 700px) {\n  .produtos {\n    flex-direction: row;\n  }\n}\n" }],
        },
      },
      falaAoConcluir: { texto: "O celular nunca perdeu nada: a tela grande é que GANHOU o layout extra, ao crescer.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "editarCss", posicao: "fim", texto: "\n@media (min-width: 700px) {\n  .produtos {\n    flex-direction: row;\n  }\n}\n" },
      ],
    },
    {
      id: "min-width-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Mais um acréscimo: @media (min-width: 700px) dando gap: 16px aos produtos.",
        toque: "Mais um acréscimo: @media (min-width: 700px) dando gap: 16px aos produtos.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "gap", valor: "16px", larguraTela: 1280 },
      ajudas: {
        pergunta: "Posso acrescentar outra declaração dentro do mesmo bloco @media (min-width: 700px) já criado?",
        dica: "Sim: dentro das chaves do @media (min-width: 700px), junto de .produtos { flex-direction: row; }, acrescente gap: 16px.",
      },
      falaAoConcluir: { texto: "Mobile first: o celular sempre funciona primeiro, e a tela grande vai ganhando mais conforme cresce.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (min-width: 700px) {\n  .produtos {\n    gap: 16px;\n  }\n}\n" }],
    },
  ],
  conclusao: [
    { texto: "Imagem responsiva e mobile first: duas ferramentas que, juntas, fazem a maioria dos sites funcionarem bem em qualquer tela.", expressao: "comemorando" },
    { texto: "Hora de juntar tudo desta zona: max-width, min-width e imagem responsiva, num desafio sem passo a passo.", expressao: "curioso" },
  ],
  missaoDeCampo: "No F12 de um site de verdade, selecione uma imagem grande e veja se ela tem max-width: 100% no painel Estilos (ou calculado).",
  falaFinal: { texto: "Hora do desafio: deixar um restaurante inteiro bom no celular.", expressao: "feliz" },
};
