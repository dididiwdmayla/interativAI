/*
 * L3, Desafio: "Revista Ventania".
 *
 * O QUE PRATICA: as habilidades de grid da unidade, num site NOVO (uma
 * revista de viagem, não a Retalhos), sem passo a passo.
 *
 * PARTES: reportagens em grid de 3 colunas (Fase 1); mapas com linhas
 * fixas e gap (Fase 2, duas partes); abertura com áreas nomeadas (Fase 3,
 * os filhos já têm grid-area pronto).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { REVISTA_VENTANIA } from "./sites/revistaVentania";

export const FASE_L3_F4: FaseDesafio = {
  id: "sites-layout-u3-f4",
  tipo: "desafio",
  unidadeId: "sites-layout-u3",
  titulo: "Revista Ventania",
  conceitos: ["css-grid", "grid-template-columns", "fr-do-grid", "grid-template-rows", "gap-css", "grid-template-areas"],
  revisa: [],
  prerequisitos: ["css-grid", "grid-template-columns", "grid-template-rows", "gap-css", "grid-template-areas"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: REVISTA_VENTANIA,

  introducao: [
    {
      texto: "Hora do desafio! A Revista Ventania quer as reportagens em grade e uma abertura de capa chamativa.",
      expressao: "feliz",
    },
    {
      texto: "Tudo com CSS Grid, sem passo a passo. O checklist marca cada parte sozinho quando você fizer.",
      expressao: "curioso",
    },
    {
      texto: "Travou? O botão Rever te leva para a fase onde aquilo foi ensinado. Bora montar essa revista?",
      expressao: "apontando",
    },
  ],

  partes: [
    {
      id: "reportagens-grid",
      descricao: "Deixar as reportagens em grade de 3 colunas iguais",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".reportagens", propriedade: "display", valor: "grid" },
          { tipo: "valorEfetivo", seletor: ".reportagens", propriedade: "grid-template-columns", valor: "1fr 1fr 1fr" },
        ],
      },
      revisarEm: "sites-layout-u3-f1",
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".reportagens", propriedade: "display", valor: "grid" },
        { tipo: "definirPropriedade", seletorRegra: ".reportagens", propriedade: "grid-template-columns", valor: "1fr 1fr 1fr" },
      ],
    },
    {
      id: "mapas-linhas-fixas",
      descricao: "Dar altura fixa de 140px às duas linhas de mapas",
      validador: { tipo: "valorEfetivo", seletor: ".mapas", propriedade: "grid-template-rows", valor: "140px 140px" },
      revisarEm: "sites-layout-u3-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".mapas", propriedade: "grid-template-rows", valor: "140px 140px" }],
    },
    {
      id: "mapas-com-gap",
      descricao: "Dar um espaço de 12px entre os mapas com gap",
      validador: { tipo: "valorEfetivo", seletor: ".mapas", propriedade: "gap", valor: "12px" },
      revisarEm: "sites-layout-u3-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".mapas", propriedade: "gap", valor: "12px" }],
    },
    {
      id: "abertura-com-areas",
      descricao: "Montar a abertura com título em cima e texto/imagem lado a lado embaixo",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".abertura", propriedade: "display", valor: "grid" },
          { tipo: "valorEfetivo", seletor: ".abertura", propriedade: "grid-template-columns", valor: "1fr 1fr" },
          { tipo: "declaracao", seletorRegra: ".abertura", propriedade: "grid-template-areas", valor: '"titulo titulo" "texto imagem"' },
        ],
      },
      revisarEm: "sites-layout-u3-f3",
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".abertura", propriedade: "display", valor: "grid" },
        { tipo: "definirPropriedade", seletorRegra: ".abertura", propriedade: "grid-template-columns", valor: "1fr 1fr" },
        {
          tipo: "definirPropriedade",
          seletorRegra: ".abertura",
          propriedade: "grid-template-areas",
          valor: '"titulo titulo" "texto imagem"',
        },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Desafio vencido! A Revista Ventania ganhou uma grade de reportagens, mapas alinhados e uma abertura de capa.",
      expressao: "comemorando",
    },
    {
      texto: "display: grid, colunas e linhas com fr, gap e grid-template-areas: o CSS Grid inteiro na sua mão.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Escolha um site de verdade com um layout de revista ou blog e, pelo F12, veja se ele usa CSS Grid ou flexbox (ou os dois).",
  falaFinal: { texto: "Zona Layout quase completa! Na próxima unidade: posição e camadas.", expressao: "feliz" },
};
