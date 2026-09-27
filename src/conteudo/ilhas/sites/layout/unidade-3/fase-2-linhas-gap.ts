/*
 * L3, Fase 2: "Linhas fixas e o espaço com gap" (Revista Retalhos).
 *
 * O QUE ENSINA: grid-template-rows (a versão de linhas de
 * grid-template-columns) e gap, revisitado de L2 num container grid (a
 * mesma declaração, os dois tipos de layout).
 *
 * ORDEM: guiado na galeria (linhas fixas de 140px, para as fotos ficarem
 * do mesmo tamanho); previsão sobre gap num grid (a confusão, igual na
 * L2: achar que ele mexe nas pontas); sozinho aplica gap nos destaques,
 * situação nova.
 *
 * REVISÃO ESPAÇADA: gap (L2, flexbox) contrastado com o mesmo gap
 * funcionando igual num grid; grid-template-columns (Fase 1).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { REVISTA_RETALHOS } from "./sites/revistaRetalhos";

export const FASE_L3_F2: FasePratica = {
  id: "sites-layout-u3-f2",
  tipo: "pratica",
  unidadeId: "sites-layout-u3",
  titulo: "Linhas fixas e o espaço com gap",
  conceitos: ["grid-template-rows", "gap-css"],
  revisa: ["grid-template-columns"],
  prerequisitos: ["css-grid", "grid-template-columns"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "A galeria já tem colunas, mas as fotos ficam de alturas diferentes e coladas. Vamos ajeitar isso?",
      expressao: "curioso",
    },
  ],
  siteAlvo: REVISTA_RETALHOS,
  objetivos: [
    {
      id: "galeria-linhas-fixas",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Dê grid-template-rows: 140px 140px à galeria, para as duas linhas terem a mesma altura.",
        toque: "Dê grid-template-rows: 140px 140px à galeria, para as duas linhas terem a mesma altura.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".galeria", propriedade: "grid-template-rows", valor: "140px 140px" },
      ajudas: {
        pergunta: "Existe uma declaração parecida com grid-template-columns, mas para a altura das linhas?",
        dica: "grid-template-rows. Cada valor é a altura de uma linha, na ordem.",
        linha: { alvo: "estilos", seletorRegra: ".galeria", fala: "Acrescente grid-template-rows: 140px 140px nesta regra, .galeria." },
        solucao: {
          fala: "Acrescentei grid-template-rows: 140px 140px: as duas linhas da galeria ficaram com a mesma altura.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".galeria", propriedade: "grid-template-rows", valor: "140px 140px" }],
        },
      },
      falaAoConcluir: {
        texto: "Duas linhas de 140px cada! grid-template-columns cuida da largura, grid-template-rows cuida da altura.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".galeria", propriedade: "grid-template-rows", valor: "140px 140px" }],
    },
    {
      id: "galeria-com-gap",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "As fotos da galeria estão coladas. Se você der gap: 12px à galeria, o que acontece nas bordas de fora?",
        opcoes: [
          "Ganham 12px também, como um margin em cada foto",
          "Continuam sem espaço extra: gap só separa os vizinhos, dentro do grid",
          "O gap não existe em grid, só em flexbox",
        ],
        correta: 1,
        explicacao: "Assim como no flexbox, gap num grid cria espaço só entre as células vizinhas, sem tocar nas bordas de fora.",
      },
      enunciado: {
        mouse: "Confira: dê gap: 12px à galeria.",
        toque: "Confira: dê gap: 12px à galeria.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".galeria", propriedade: "gap", valor: "12px" },
      ajudas: {
        pergunta: "Qual declaração cria espaço entre as células de um grid, a mesma do flexbox?",
        dica: "gap. Funciona igual nos dois tipos de layout: só entre os vizinhos.",
        linha: { alvo: "estilos", seletorRegra: ".galeria", fala: "Acrescente gap: 12px nesta regra, .galeria." },
        solucao: {
          fala: "Acrescentei gap: 12px: agora as quatro fotos têm espaço entre si, sem mexer nas bordas.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".galeria", propriedade: "gap", valor: "12px" }],
        },
      },
      falaAoConcluir: {
        texto: "Confirmado: mesma regra do flexbox, mesmo comportamento. gap é a mesma ferramenta nos dois layouts.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".galeria", propriedade: "gap", valor: "12px" },
      ],
    },
    {
      id: "destaques-com-gap",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Os destaques também estão colados. Dê gap: 16px ao .destaques.",
        toque: "Os destaques também estão colados. Dê gap: 16px ao .destaques.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".destaques", propriedade: "gap", valor: "16px" },
      ajudas: {
        pergunta: "Qual declaração separa as três matérias dos destaques, sem margin em cada uma?",
        dica: "gap, na regra .destaques: a mesma ideia da galeria, numa peça diferente.",
      },
      falaAoConcluir: {
        texto: "Respiro entre as matérias também! gap funciona em qualquer grid ou flex, é só lembrar dele.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".destaques", propriedade: "gap", valor: "16px" }],
    },
  ],
  conclusao: [
    {
      texto: "grid-template-rows cuida da altura das linhas, e gap separa tudo sem margin. A galeria ficou uma grade de verdade.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, essa combinação (colunas, linhas e gap) monta a maioria das grades de fotos que você vê por aí.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, ache uma grade de fotos com espaço regular entre elas e veja no Styles se ela usa gap.",
  falaFinal: { texto: "Próxima fase: dar nome às áreas do grid, para montar a capa da revista.", expressao: "feliz" },
};
