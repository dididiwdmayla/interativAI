/*
 * Unidade 3, Desafio: "Receita da Vovó".
 *
 * O QUE PRATICA: os três problemas da unidade juntos (hierarquia de
 * títulos, ênfase forte e lista numerada), num site NOVO — uma receita de
 * bolo, e não mais um post de blog.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por habilidade, cada uma apontando
 * (revisarEm) para a fase onde ela foi ensinada de forma guiada.
 * - corrigir o título principal para h1: fase 1;
 * - corrigir os dois subtítulos para h2: fase 1;
 * - trocar o aviso de b para strong: fase 2;
 * - duplicar um passo (revisão de duplicar elemento) e numerar a lista de
 *   passos: fase 3.
 *
 * DIFERENÇAS DE PROPÓSITO: os subtítulos aqui (Ingredientes, Modo de
 * preparo) estão os DOIS errados, e não um só — o jogador precisa achar e
 * corrigir as duas peças, sem pista de qual delas está pior.
 *
 * ESTRELAS: 3, e cada "Rever" usado custa 1 (mínimo 1).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_RECEITA } from "./sites/receitaDaVovo";

export const FASE_U3_F4: FaseDesafio = {
  id: "sites-elementos-u3-f4",
  tipo: "desafio",
  unidadeId: "sites-elementos-u3",
  titulo: "Receita da Vovó",
  conceitos: ["titulos-hierarquia", "enfase-forte", "lista-numerada"],
  revisa: ["duplicar-elemento"],
  prerequisitos: ["titulos-hierarquia", "enfase-forte", "lista-numerada"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "trilha", "duplicar", "renomear-tag"],
  siteAlvo: SITE_RECEITA,

  introducao: [
    { texto: "Chegou o desafio! A vovó Alzira digitou a receita, mas a formatação saiu toda errada.", expressao: "feliz" },
    { texto: "Sem passo a passo desta vez. O checklist marca cada parte sozinho quando você fizer.", expressao: "curioso" },
    { texto: "Travou? O Rever te leva de volta pra fase onde aquilo foi ensinado. Bora arrumar?", expressao: "apontando" },
  ],

  partes: [
    {
      id: "titulo-principal",
      descricao: "Trocar o título principal da receita para h1",
      validador: { tipo: "tag", seletor: "#titulo-receita", nome: "h1" },
      revisarEm: "sites-elementos-u3-f1",
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#titulo-receita", novaTag: "h1" }],
    },
    {
      id: "subtitulos",
      descricao: "Trocar 'Ingredientes' e 'Modo de preparo' para h2",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#ingredientes-titulo", nome: "h2" },
          { tipo: "tag", seletor: "#modo-titulo", nome: "h2" },
        ],
      },
      revisarEm: "sites-elementos-u3-f1",
      solucaoDeTeste: [
        { tipo: "renomearTag", seletor: "#ingredientes-titulo", novaTag: "h2" },
        { tipo: "renomearTag", seletor: "#modo-titulo", novaTag: "h2" },
      ],
    },
    {
      id: "aviso-forte",
      descricao: "Deixar o aviso do forno importante de verdade (strong)",
      validador: { tipo: "tag", seletor: "#aviso-receita .destaque-importante", nome: "strong" },
      revisarEm: "sites-elementos-u3-f2",
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#aviso-receita .destaque-importante", novaTag: "strong" }],
    },
    {
      id: "passos-numerados",
      descricao: "Duplicar um passo, escrever um passo novo e numerar a lista do modo de preparo",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "#passos-receita li", op: ">=", valor: 5 },
          { tipo: "textoDiferenteDoInicial", seletor: "#passos-receita li" },
          { tipo: "tag", seletor: "#passos-receita", nome: "ol" },
        ],
      },
      revisarEm: "sites-elementos-u3-f3",
      solucaoDeTeste: [
        { tipo: "duplicar", seletor: "#passos-receita li" },
        { tipo: "definirTexto", seletor: "$0", valor: "Deixe esfriar antes de desenformar" },
        { tipo: "renomearTag", seletor: "#passos-receita", novaTag: "ol" },
      ],
    },
  ],

  conclusao: [
    { texto: "Desafio vencido! Receita da vovó com títulos, ênfase e lista todos certos.", expressao: "comemorando" },
    { texto: "Hierarquia, negrito de verdade e listas numeradas: você já organiza qualquer artigo bagunçado.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Escolha um artigo de verdade, aperte F12 e confira a hierarquia dos títulos e se o negrito importante usa strong. Só você vê.",

  falaFinal: {
    texto: "Lembra: no F12 a página é sua para explorar. Recarregou, voltou tudo. Pode mexer sem medo!",
    expressao: "comemorando",
  },
};
