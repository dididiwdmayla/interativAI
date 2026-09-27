/*
 * L2, Desafio: "Brechó Segunda Chance".
 *
 * O QUE PRATICA: as quatro habilidades da unidade, num site NOVO (um
 * brechó, não a livraria), sem passo a passo.
 *
 * PARTES: menu em flex (Fase 1); produtos espalhados com justify-content
 * e alinhados com align-items (Fase 2, duas partes); espaço com gap e
 * quebra com flex-wrap nos produtos (Fase 3, duas partes).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { BRECHO_SEGUNDA_CHANCE } from "./sites/brechoSegundaChance";

export const FASE_L2_F4: FaseDesafio = {
  id: "sites-layout-u2-f4",
  tipo: "desafio",
  unidadeId: "sites-layout-u2",
  titulo: "Brechó Segunda Chance",
  conceitos: ["flexbox", "flex-direction", "justify-content", "align-items", "gap-css", "flex-wrap"],
  revisa: [],
  prerequisitos: ["flexbox", "justify-content", "align-items", "gap-css", "flex-wrap"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: BRECHO_SEGUNDA_CHANCE,

  introducao: [
    {
      texto: "Hora do desafio! O Brechó Segunda Chance quer o menu em linha e os produtos bem organizados.",
      expressao: "feliz",
    },
    {
      texto: "Tudo com flexbox, sem passo a passo. O checklist marca cada parte sozinho quando você fizer.",
      expressao: "curioso",
    },
    {
      texto: "Travou? O botão Rever te leva para a fase onde aquilo foi ensinado. Bora organizar esse brechó?",
      expressao: "apontando",
    },
  ],

  partes: [
    {
      id: "menu-flex",
      descricao: "Deixar o menu do brechó em fila com display: flex",
      validador: { tipo: "valorEfetivo", seletor: "nav ul", propriedade: "display", valor: "flex" },
      revisarEm: "sites-layout-u2-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "nav ul", propriedade: "display", valor: "flex" }],
    },
    {
      id: "produtos-espalhados",
      descricao: "Deixar os produtos em fila (flex) espalhados com justify-content: space-between",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "display", valor: "flex" },
          { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "justify-content", valor: "space-between" },
        ],
      },
      revisarEm: "sites-layout-u2-f2",
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".produtos", propriedade: "display", valor: "flex" },
        { tipo: "definirPropriedade", seletorRegra: ".produtos", propriedade: "justify-content", valor: "space-between" },
      ],
    },
    {
      id: "produtos-centralizados",
      descricao: "Centralizar os produtos na vertical com align-items: center",
      validador: { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "align-items", valor: "center" },
      revisarEm: "sites-layout-u2-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".produtos", propriedade: "align-items", valor: "center" }],
    },
    {
      id: "produtos-com-gap",
      descricao: "Dar um espaço de 16px entre os produtos com gap",
      validador: { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "gap", valor: "16px" },
      revisarEm: "sites-layout-u2-f3",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".produtos", propriedade: "gap", valor: "16px" }],
    },
    {
      id: "produtos-quebram",
      descricao: "Deixar os produtos quebrarem de linha em telas estreitas com flex-wrap: wrap",
      validador: { tipo: "valorEfetivo", seletor: ".produtos", propriedade: "flex-wrap", valor: "wrap" },
      revisarEm: "sites-layout-u2-f3",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".produtos", propriedade: "flex-wrap", valor: "wrap" }],
    },
  ],

  conclusao: [
    {
      texto: "Desafio vencido! O brechó ganhou um menu em linha e produtos espalhados, alinhados e prontos para qualquer tela.",
      expressao: "comemorando",
    },
    {
      texto: "display: flex, flex-direction, justify-content, align-items, gap e flex-wrap: o flexbox inteiro na sua mão.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Escolha um site de verdade e, pelo F12, ache uma fileira de cards: veja se ela usa justify-content, gap e flex-wrap.",
  falaFinal: { texto: "Zona Layout andando! Na próxima unidade: CSS Grid.", expressao: "feliz" },
};
