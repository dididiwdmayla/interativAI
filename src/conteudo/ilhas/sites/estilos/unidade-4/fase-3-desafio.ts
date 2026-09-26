/*
 * E4, Desafio: "Academia Corpo Ativo".
 *
 * O QUE PRATICA: achar e consertar três regras que não pegam, sem passo a
 * passo, num site NOVO (uma academia, não a loja de instrumentos) — bem
 * como o mapa curricular descreve.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por bug, cada uma apontando
 * (revisarEm) pra fase onde aquele tipo de problema foi ensinado guiado:
 * - #marca vencendo h1 (especificidade): Fase 1;
 * - .titulo-plano vencendo main h2 (especificidade, classe x tag): Fase 1;
 * - .valor travada com !important: Fase 2.
 *
 * Em todas, o conserto é editar a regra que ESTÁ vencendo, não criar uma
 * nova nem mexer na que já está perdendo.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { ACADEMIA_CORPO_ATIVO } from "./sites/academiaCorpoAtivo";

export const FASE_E4_F3: FaseDesafio = {
  id: "sites-estilos-u4-f3",
  tipo: "desafio",
  unidadeId: "sites-estilos-u4",
  titulo: "Academia Corpo Ativo",
  conceitos: ["especificidade-css", "importante-css"],
  revisa: [],
  prerequisitos: ["cascata-css", "ordem-das-regras", "especificidade-css", "heranca-css", "importante-css"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: ACADEMIA_CORPO_ATIVO,

  introducao: [
    { texto: "Hora do desafio! Na Academia Corpo Ativo, três cores não são as que o dono pediu.", expressao: "feliz" },
    { texto: "Ache quem está vencendo cada peça e edite a regra certa, sem passo a passo.", expressao: "curioso" },
    { texto: "Travou? O Rever te leva pra fase onde aquele tipo de problema foi ensinado. Bora depurar?", expressao: "apontando" },
  ],

  partes: [
    {
      id: "titulo-da-marca-laranja",
      descricao: "Deixar o nome da academia (h1) laranja de verdade",
      validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "color", valor: "orange" },
      revisarEm: "sites-estilos-u4-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "#marca", propriedade: "color", valor: "orange" }],
    },
    {
      id: "titulo-dos-planos-vermelho",
      descricao: "Deixar o título \"Planos disponíveis\" (h2) vermelho de verdade",
      validador: { tipo: "valorEfetivo", seletor: "h2", propriedade: "color", valor: "crimson" },
      revisarEm: "sites-estilos-u4-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".titulo-plano", propriedade: "color", valor: "crimson" }],
    },
    {
      id: "valor-do-plano-destacado",
      descricao: "Deixar o valor do plano (travado com !important) na cor #1b998b",
      validador: { tipo: "valorEfetivo", seletor: ".valor", propriedade: "color", valor: "#1b998b" },
      revisarEm: "sites-estilos-u4-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".valor", propriedade: "color", valor: "#1b998b" }],
    },
  ],

  conclusao: [
    { texto: "Desafio vencido! As três cores agora são exatamente as que o dono da academia pediu.", expressao: "comemorando" },
    { texto: "Cascata, especificidade, herança e !important: agora você sabe por que uma regra não pega, e como consertar.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, ache uma cor \"errada\" no F12 e descubra por quê: veja qual regra está vencendo no painel Styles antes de editar.",

  falaFinal: { texto: "Zona Estilos completa! Você já lê e mexe em qualquer folha de estilo.", expressao: "comemorando" },
};
