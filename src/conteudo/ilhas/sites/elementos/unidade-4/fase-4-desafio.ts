/*
 * Unidade 4, Desafio: "Trovão de Lata".
 *
 * O QUE PRATICA: os quatro problemas da unidade juntos (link quebrado,
 * link sem aba nova, imagem sem alt, cards sem a class em comum), num site
 * NOVO — uma banda de rock, e não mais o coral.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por habilidade, cada uma apontando
 * (revisarEm) para a fase onde ela foi ensinada de forma guiada.
 * - consertar o link do menu "Contato": fase 1;
 * - link da bilheteria em aba nova: fase 1;
 * - alt da foto da banda: fase 2;
 * - class em comum nos cards dos músicos: fase 3.
 *
 * ESTRELAS: 3, e cada "Rever" usado custa 1 (mínimo 1).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_BANDA } from "./sites/trovaoDeLata";

export const FASE_U4_F4: FaseDesafio = {
  id: "sites-elementos-u4-f4",
  tipo: "desafio",
  unidadeId: "sites-elementos-u4",
  titulo: "Trovão de Lata",
  conceitos: ["link-href", "link-ancora", "link-aba-nova", "imagem-alt", "class-repetivel"],
  revisa: ["editar-atributo"],
  prerequisitos: ["link-href", "link-ancora", "link-aba-nova", "imagem-alt", "class-repetivel"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "editar-duplo-clique"],
  siteAlvo: SITE_BANDA,

  introducao: [
    { texto: "Chegou o desafio! A banda Trovão de Lata pediu socorro: o site tem uns probleminhas.", expressao: "feliz" },
    { texto: "Sem passo a passo desta vez. O checklist marca cada parte sozinho quando você fizer.", expressao: "curioso" },
    { texto: "Travou? O Rever te leva de volta pra fase onde aquilo foi ensinado. Bora arrumar?", expressao: "apontando" },
  ],

  partes: [
    {
      id: "link-menu",
      descricao: "Consertar o link 'Contato' do menu, que não leva a lugar nenhum",
      validador: { tipo: "atributo", seletor: "#nav-contato", nome: "href", valor: "#rodape" },
      revisarEm: "sites-elementos-u4-f1",
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#nav-contato", nome: "href", valor: "#rodape" }],
    },
    {
      id: "aba-nova",
      descricao: "Fazer o link dos ingressos abrir numa aba nova",
      validador: { tipo: "atributo", seletor: "#link-ingressos-banda", nome: "target", valor: "_blank" },
      revisarEm: "sites-elementos-u4-f1",
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#link-ingressos-banda", nome: "target", valor: "_blank" }],
    },
    {
      id: "alt-foto",
      descricao: "Escrever uma descrição (alt) para a foto da banda",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "#foto-banda", nome: "alt" },
          { tipo: "nao", validador: { tipo: "atributo", seletor: "#foto-banda", nome: "alt", valor: "" } },
        ],
      },
      revisarEm: "sites-elementos-u4-f2",
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#foto-banda", nome: "alt", valor: "Os quatro integrantes da banda Trovão de Lata" }],
    },
    {
      id: "class-musicos",
      descricao: "Dar a mesma class aos três cards de músicos",
      validador: { tipo: "contagem", seletor: ".musico", op: ">=", valor: 3 },
      revisarEm: "sites-elementos-u4-f3",
      solucaoDeTeste: [
        { tipo: "definirAtributo", seletor: "#musico-rita", nome: "class", valor: "musico" },
        { tipo: "definirAtributo", seletor: "#musico-davi", nome: "class", valor: "musico" },
      ],
    },
  ],

  conclusao: [
    { texto: "Desafio vencido! Site da banda com links, imagens e cards todos certos.", expressao: "comemorando" },
    { texto: "Links, alt e a diferença entre id e class: você já arruma qualquer site bagunçado.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Escolha um site de verdade, aperte F12 e confira um link e uma imagem: o href leva pro lugar certo? A imagem tem alt? Só você vê.",

  falaFinal: {
    texto: "Lembra: no F12 a página é sua para explorar. Recarregou, voltou tudo. Pode mexer sem medo!",
    expressao: "comemorando",
  },
};
