/*
 * L3, Fase 1: "Colunas com display: grid" (Revista Retalhos).
 *
 * O QUE ENSINA: display: grid (o container vira uma grade) e
 * grid-template-columns com a unidade fr (divide o espaço em frações).
 *
 * ORDEM: guiado no container de destaques (3 colunas iguais, 1fr 1fr 1fr);
 * previsão sobre o que "fr" quer dizer (a confusão: achar que é um pixel
 * ou porcentagem fixa); sozinho aplica os DOIS (grid e colunas) numa
 * galeria de fotos, situação nova, como o formato de E1F2 já fazia com
 * duas declarações num só objetivo sozinho.
 *
 * REVISÃO ESPAÇADA: display: flex (L2) contrastado na fala; cor-de-fundo
 * (E1) já usada nos cards da revista.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { REVISTA_RETALHOS } from "./sites/revistaRetalhos";

export const FASE_L3_F1: FasePratica = {
  id: "sites-layout-u3-f1",
  tipo: "pratica",
  unidadeId: "sites-layout-u3",
  titulo: "Colunas com display: grid",
  conceitos: ["css-grid", "grid-template-columns", "fr-do-grid"],
  revisa: ["flexbox", "cor-de-fundo"],
  prerequisitos: ["display-css"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Bem-vinda à Revista Retalhos! Os destaques da edição estão empilhados, um embaixo do outro.",
      expressao: "curioso",
    },
    {
      texto: "Para uma grade de verdade, com linhas E colunas, existe o CSS Grid: display: grid.",
      expressao: "apontando",
    },
  ],
  siteAlvo: REVISTA_RETALHOS,
  objetivos: [
    {
      id: "destaques-vira-grid",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Selecione a div com class destaques e dê display: grid a ela.",
        toque: "Selecione a div com class destaques e dê display: grid a ela.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".destaques", propriedade: "display", valor: "grid" },
      ajudas: {
        pergunta: "Qual display transforma um container numa grade de linhas e colunas?",
        dica: "grid, na regra .destaques (o pai das três matérias).",
        linha: { alvo: "arvore", seletor: ".destaques", fala: "É esta div, .destaques, que guarda as três matérias." },
        solucao: {
          fala: "Dei display: grid a .destaques: agora ela é uma grade, mas ainda sem colunas definidas.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".destaques", propriedade: "display", valor: "grid" }],
        },
      },
      falaAoConcluir: {
        texto: "Virou grid! Mas repare: ainda está tudo numa coluna só, porque não dissemos quantas colunas tem.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".destaques", propriedade: "display", valor: "grid" }],
    },
    {
      id: "destaques-tres-colunas",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você der grid-template-columns: 1fr 1fr 1fr ao .destaques, o que acontece?",
        opcoes: [
          "Aparecem 3 colunas, cada uma com a mesma largura (1 fração do espaço)",
          "Aparecem 3 colunas de exatamente 1 pixel cada",
          "Nada muda: fr só funciona com flexbox",
        ],
        correta: 0,
        explicacao: "fr divide o espaço que sobra em frações iguais. 1fr 1fr 1fr cria 3 colunas do mesmo tamanho, não 3 pixels.",
      },
      enunciado: {
        mouse: "Confira: dê grid-template-columns: 1fr 1fr 1fr ao .destaques.",
        toque: "Confira: dê grid-template-columns: 1fr 1fr 1fr ao .destaques.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".destaques", propriedade: "grid-template-columns", valor: "1fr 1fr 1fr" },
      ajudas: {
        pergunta: "Qual declaração diz quantas colunas o grid tem e a largura de cada uma?",
        dica: "grid-template-columns. Cada valor separado por espaço é uma coluna; 1fr é 'uma fração do espaço'.",
        linha: { alvo: "estilos", seletorRegra: ".destaques", fala: "Acrescente grid-template-columns: 1fr 1fr 1fr nesta regra." },
        solucao: {
          fala: "Acrescentei grid-template-columns: 1fr 1fr 1fr: as três matérias ficaram lado a lado, do mesmo tamanho.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".destaques", propriedade: "grid-template-columns", valor: "1fr 1fr 1fr" }],
        },
      },
      falaAoConcluir: {
        texto: "Três colunas iguais! fr reparte o espaço que sobra depois de tudo o mais já ter o seu lugar.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirPropriedade", seletorRegra: ".destaques", propriedade: "grid-template-columns", valor: "1fr 1fr 1fr" },
      ],
    },
    {
      id: "galeria-vira-grid",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "A galeria de capas antigas também está empilhada. Dê display: grid e grid-template-columns: 1fr 1fr a ela (2 colunas).",
        toque: "A galeria de capas antigas também está empilhada. Dê display: grid e grid-template-columns: 1fr 1fr a ela (2 colunas).",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".galeria", propriedade: "display", valor: "grid" },
          { tipo: "valorEfetivo", seletor: ".galeria", propriedade: "grid-template-columns", valor: "1fr 1fr" },
        ],
      },
      ajudas: {
        pergunta: "Quais duas declarações transformam a galeria numa grade de 2 colunas iguais?",
        dica: "display: grid na regra .galeria, e grid-template-columns: 1fr 1fr logo depois.",
      },
      falaAoConcluir: {
        texto: "Quatro capas antigas, duas por linha! As mesmas duas declarações, numa peça diferente.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".galeria", propriedade: "display", valor: "grid" },
        { tipo: "definirPropriedade", seletorRegra: ".galeria", propriedade: "grid-template-columns", valor: "1fr 1fr" },
      ],
    },
  ],
  conclusao: [
    {
      texto: "display: grid e grid-template-columns com fr: sua primeira grade de verdade, com linhas e colunas.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, muita revista e loja online usa exatamente essa dupla para as grades de produtos.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, ache uma grade de produtos ou fotos e veja no Styles se o pai é display: grid, com quantas colunas.",
  falaFinal: { texto: "Próxima fase: as linhas do grid e o espaço entre as células.", expressao: "feliz" },
};
