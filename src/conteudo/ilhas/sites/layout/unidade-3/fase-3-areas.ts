/*
 * L3, Fase 3: "Áreas com nome" (Revista Retalhos).
 *
 * O QUE ENSINA: grid-template-areas, que desenha o layout com nomes. As
 * peças da capa (.capa-titulo, .capa-texto, .capa-imagem) e dos créditos
 * (.creditos-texto, .creditos-redes) JÁ TÊM grid-area nas próprias
 * regras: a fase ataca direto a confusão de leigo "cada filho também
 * precisa ganhar alguma coisa nova" (não precisa: a ligação já existe,
 * falta só desenhar o mapa no container).
 *
 * ORDEM: previsão guiada sobre o efeito de um grid-template-areas dado
 * (o título ocupa as duas colunas, numa linha só, porque os filhos já
 * estão prontos); sozinho desenha um mapa mais simples nos créditos.
 *
 * Como o motor não tem um checador de valor para grid-template-areas
 * (não é lista de medidas nem palavra-chave fixa), o validador é
 * `declaracao`, que compara o texto declarado, não `valorEfetivo`.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { REVISTA_RETALHOS } from "./sites/revistaRetalhos";

export const FASE_L3_F3: FasePratica = {
  id: "sites-layout-u3-f3",
  tipo: "pratica",
  unidadeId: "sites-layout-u3",
  titulo: "Áreas com nome",
  conceitos: ["grid-template-areas"],
  revisa: ["css-grid"],
  prerequisitos: ["css-grid", "grid-template-columns"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "A capa da revista já tem título, texto e imagem, cada um com um nome de área na própria regra (grid-area).",
      expressao: "curioso",
    },
    {
      texto: "Falta só desenhar o mapa no container: dizer ONDE cada nome vai, com grid-template-areas.",
      expressao: "apontando",
    },
  ],
  siteAlvo: REVISTA_RETALHOS,
  objetivos: [
    {
      id: "capa-vira-grid",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Selecione a div com class capa e dê display: grid e grid-template-columns: 1fr 1fr a ela.",
        toque: "Selecione a div com class capa e dê display: grid e grid-template-columns: 1fr 1fr a ela.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".capa", propriedade: "display", valor: "grid" },
          { tipo: "valorEfetivo", seletor: ".capa", propriedade: "grid-template-columns", valor: "1fr 1fr" },
        ],
      },
      ajudas: {
        pergunta: "Antes de desenhar o mapa de áreas, o container precisa virar grid, com quantas colunas?",
        dica: "display: grid e grid-template-columns: 1fr 1fr (2 colunas), do mesmo jeito da Fase 1.",
        linha: { alvo: "arvore", seletor: ".capa", fala: "É esta div, .capa, que guarda título, texto e imagem." },
        solucao: {
          fala: "Dei display: grid e grid-template-columns: 1fr 1fr a .capa: agora ela é uma grade de 2 colunas.",
          acoes: [
            { tipo: "definirPropriedade", seletorRegra: ".capa", propriedade: "display", valor: "grid" },
            { tipo: "definirPropriedade", seletorRegra: ".capa", propriedade: "grid-template-columns", valor: "1fr 1fr" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Grid de 2 colunas pronto. Cada filho já tem um grid-area próprio: titulo, texto e imagem.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".capa", propriedade: "display", valor: "grid" },
        { tipo: "definirPropriedade", seletorRegra: ".capa", propriedade: "grid-template-columns", valor: "1fr 1fr" },
      ],
    },
    {
      id: "capa-areas",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta:
          'Os filhos já têm grid-area certo. Com "titulo titulo" "texto imagem" em grid-template-areas, o que acontece com o título?',
        opcoes: [
          "Ele ocupa as duas colunas, numa linha só, porque o nome se repete duas vezes",
          "Ele fica só na primeira coluna, porque só apareceu uma vez na regra",
          "Nada muda, porque os filhos precisam ganhar mais alguma declaração",
        ],
        correta: 0,
        explicacao:
          'Repetir "titulo" nas duas posições da primeira linha faz ele ocupar as duas colunas. Os filhos já estavam prontos: só faltava o mapa.',
      },
      enunciado: {
        mouse: 'Confira: dê grid-template-areas: "titulo titulo" "texto imagem" ao .capa.',
        toque: 'Confira: dê grid-template-areas: "titulo titulo" "texto imagem" ao .capa.',
      },
      validador: { tipo: "declaracao", seletorRegra: ".capa", propriedade: "grid-template-areas", valor: '"titulo titulo" "texto imagem"' },
      ajudas: {
        pergunta: "Qual declaração desenha o mapa de áreas de um grid, ligando os nomes aos lugares?",
        dica: 'grid-template-areas. Cada linha entre aspas é uma linha do grid; repetir um nome faz ele ocupar mais de uma coluna.',
        linha: { alvo: "estilos", seletorRegra: ".capa", fala: 'Acrescente grid-template-areas: "titulo titulo" "texto imagem" nesta regra.' },
        solucao: {
          fala: "Acrescentei o mapa de áreas: o título ficou em cima, ocupando tudo, e texto e imagem lado a lado embaixo.",
          acoes: [
            {
              tipo: "definirPropriedade",
              seletorRegra: ".capa",
              propriedade: "grid-template-areas",
              valor: '"titulo titulo" "texto imagem"',
            },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Virou capa de revista de verdade! Nenhum filho mudou: só o mapa do container.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        {
          tipo: "definirPropriedade",
          seletorRegra: ".capa",
          propriedade: "grid-template-areas",
          valor: '"titulo titulo" "texto imagem"',
        },
      ],
    },
    {
      id: "creditos-areas",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: 'Os créditos já têm os nomes texto e redes prontos. Dê a eles display: grid, colunas 1fr 1fr e o mapa "texto redes".',
        toque: 'Os créditos já têm os nomes texto e redes prontos. Dê a eles display: grid, colunas 1fr 1fr e o mapa "texto redes".',
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".creditos", propriedade: "display", valor: "grid" },
          { tipo: "valorEfetivo", seletor: ".creditos", propriedade: "grid-template-columns", valor: "1fr 1fr" },
          { tipo: "declaracao", seletorRegra: ".creditos", propriedade: "grid-template-areas", valor: '"texto redes"' },
        ],
      },
      ajudas: {
        pergunta: "Quais três declarações fazem os créditos virarem um grid de 2 colunas com o mapa texto/redes?",
        dica: 'display: grid, grid-template-columns: 1fr 1fr e grid-template-areas: "texto redes", na regra .creditos.',
      },
      falaAoConcluir: {
        texto: "Texto e redes sociais lado a lado, cada um no seu lugar certo!",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".creditos", propriedade: "display", valor: "grid" },
        { tipo: "definirPropriedade", seletorRegra: ".creditos", propriedade: "grid-template-columns", valor: "1fr 1fr" },
        { tipo: "definirPropriedade", seletorRegra: ".creditos", propriedade: "grid-template-areas", valor: '"texto redes"' },
      ],
    },
  ],
  conclusao: [
    {
      texto: "grid-template-areas: você desenha o layout com nomes, como um mapa, sem mexer em cada filho.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, essa é a forma mais fácil de ler um layout de grid complexo: os nomes contam a história.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade com um layout complexo (cabeçalho, lateral, conteúdo, rodapé), veja no Styles se o container usa grid-template-areas.",
  falaFinal: { texto: "Hora do desafio: outra revista precisa de você!", expressao: "feliz" },
};
