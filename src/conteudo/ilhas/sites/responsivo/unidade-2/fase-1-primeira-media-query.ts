/*
 * R2, Fase 1: "Sua primeira @media" (Estúdio Passo Leve).
 *
 * O QUE ENSINA: a sintaxe de uma media query, `@media (max-width: Npx) {
 * ... }`, e a ideia de BREAKPOINT: a largura onde o layout muda de jeito.
 * A regra só vale ABAIXO daquela largura — ataca a confusão "escrevi a
 * regra, por que ela não aparece na tela grande?" com uma previsão.
 *
 * ORDEM: 1) guiado, escrever a primeira @media (empilhar o cabeçalho);
 * 2) guiado, previsão sobre por que a regra desliga na tela grande,
 * depois adicionar outra declaração na MESMA @media (empilhar os
 * cards); 3) sozinho, um breakpoint diferente para outra peça.
 *
 * SITE-ALVO: Estúdio Passo Leve, escrito DESKTOP FIRST de propósito (a
 * Fase 2 contrasta com mobile first).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { ESTUDIO_PASSO_LEVE } from "./sites/estudioPassoLeve";

export const FASE_R2_F1: FasePratica = {
  id: "sites-responsivo-u2-f1",
  tipo: "pratica",
  unidadeId: "sites-responsivo-u2",
  titulo: "Sua primeira @media",
  conceitos: ["media-query", "breakpoint"],
  revisa: ["modo-dispositivo", "regra-e-declaracao"],
  prerequisitos: ["o-que-e-css", "regra-e-declaracao"],
  usaFerramentas: ["modo-dispositivo", "editor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: ESTUDIO_PASSO_LEVE,
  introducao: [
    { texto: "O Estúdio Passo Leve tem um cabeçalho lado a lado e cards em três colunas. No celular, isso fica apertado.", expressao: "pensativo" },
    { texto: "Uma @media é uma regra que só vale quando a tela cumpre uma condição. Vamos escrever a primeira.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "primeira-media",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: 'No editor CSS, acrescente: @media (max-width: 600px) { .cabecalho { flex-direction: column; } }',
        toque: 'No editor CSS, acrescente: @media (max-width: 600px) { .cabecalho { flex-direction: column; } }',
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".cabecalho", propriedade: "flex-direction", valor: "column", larguraTela: 390 },
          { tipo: "valorEfetivo", seletor: ".cabecalho", propriedade: "flex-direction", valor: "row", larguraTela: 1280 },
        ],
      },
      ajudas: {
        pergunta: "Qual é o formato de uma media query?",
        dica: '@media (max-width: 600px) { seletor { propriedade: valor; } } — como uma regra normal, só que dentro de um bloco @media.',
        linha: { alvo: "css", seletorRegra: ".cabecalho", fala: "Acrescente um bloco @media (max-width: 600px) no fim da folha, com essa regra dentro." },
        solucao: {
          fala: "Escrevi a @media: abaixo de 600px, o cabeçalho empilha (column); acima, continua row (o valor de fora da @media).",
          acoes: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  .cabecalho {\n    flex-direction: column;\n  }\n}\n" }],
        },
      },
      falaAoConcluir: { texto: "No Celular 390 o cabeçalho empilhou; no Notebook 1280, continua lado a lado. A regra só vale ABAIXO de 600px.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  .cabecalho {\n    flex-direction: column;\n  }\n}\n" }],
    },
    {
      id: "previsao-breakpoint",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Por que essa mesma regra não aparece no painel Estilos quando a tela está em 1280px?",
        opcoes: ["Porque ela foi apagada sozinha", "Porque a condição (max-width: 600px) não vale numa tela de 1280px", "Porque só funciona a primeira vez que a página carrega"],
        correta: 1,
        explicacao: "600px é o BREAKPOINT: a largura onde a regra liga ou desliga. Acima dela, a condição é falsa, e a regra nem entra na conta da cascata.",
      },
      enunciado: {
        mouse: "Confira: no mesmo bloco @media, empilhe também os cards (.cards) com flex-direction: column.",
        toque: "Confira: no mesmo bloco @media, empilhe também os cards (.cards) com flex-direction: column.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".cards", propriedade: "flex-direction", valor: "column", larguraTela: 390 },
      ajudas: {
        pergunta: "Onde acrescento uma segunda regra dentro do mesmo bloco @media?",
        dica: "Dentro das chaves do @media (max-width: 600px), depois da regra .cabecalho, acrescente .cards { flex-direction: column; }.",
        linha: { alvo: "css", seletorRegra: ".cabecalho", fala: "Logo abaixo desta regra, dentro do mesmo bloco @media." },
        solucao: {
          fala: "Troquei .cards para display: flex e flex-direction: column dentro da @media: no celular, os cards empilham.",
          acoes: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  .cards {\n    display: flex;\n    flex-direction: column;\n  }\n}\n" }],
        },
      },
      falaAoConcluir: { texto: "Um bloco @media pode ter várias regras dentro, todas ligando e desligando juntas.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  .cards {\n    display: flex;\n    flex-direction: column;\n  }\n}\n" },
      ],
    },
    {
      id: "breakpoint-diferente",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora um breakpoint diferente: @media (max-width: 900px) deixando .card com padding: 8px.",
        toque: "Agora um breakpoint diferente: @media (max-width: 900px) deixando .card com padding: 8px.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".card", propriedade: "padding", valor: "8px", larguraTela: 700 },
          { tipo: "valorEfetivo", seletor: ".card", propriedade: "padding", valor: "16px", larguraTela: 1280 },
        ],
      },
      ajudas: {
        pergunta: "Cada @media pode ter o breakpoint que fizer sentido para AQUELA peça: qual é o pedido aqui?",
        dica: "Um bloco @media (max-width: 900px) novo, com .card { padding: 8px; } dentro.",
      },
      falaAoConcluir: { texto: "900px de breakpoint, 8px de padding: uma página pode ter várias @media, cada uma com o limite que precisar.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 900px) {\n  .card {\n    padding: 8px;\n  }\n}\n" }],
    },
  ],
  conclusao: [
    { texto: "Sua primeira @media, com dois breakpoints diferentes: 600px e 900px.", expressao: "comemorando" },
    { texto: "Tem um jeito de escrever @media que evita repetir tudo do zero: começar pelo celular. Vamos ver.", expressao: "curioso" },
  ],
  missaoDeCampo: "No F12 de um site de verdade, na aba Estilos, redimensione a janela (ou use o modo dispositivo) e veja alguma regra @media aparecer e sumir do painel.",
  falaFinal: { texto: "Próxima fase: mobile first, e imagens que se ajustam sozinhas.", expressao: "feliz" },
};
