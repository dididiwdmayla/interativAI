/*
 * Unidade 5, Desafio: "Pet Shop Focinho Feliz".
 *
 * O QUE PRATICA: os quatro problemas da unidade juntos (cabeçalho e rodapé
 * em div, agrupamento e cards sem tag semântica, preço sem significado),
 * num site NOVO — um pet shop, e não mais a oficina de bicicletas.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por habilidade, cada uma apontando
 * (revisarEm) para a fase onde ela foi ensinada de forma guiada.
 * - cabeçalho e rodapé (header/footer): fase 1;
 * - a seção de serviços e os dois cards (section/article): fase 2;
 * - os dois preços (span): fase 3.
 *
 * ESTRELAS: 3, e cada "Rever" usado custa 1 (mínimo 1).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_PET_SHOP } from "./sites/petShopFocinhoFeliz";

export const FASE_U5_F4: FaseDesafio = {
  id: "sites-elementos-u5-f4",
  tipo: "desafio",
  unidadeId: "sites-elementos-u5",
  titulo: "Pet Shop Focinho Feliz",
  conceitos: ["semantica-html", "section-vs-article", "span-generico"],
  revisa: ["div-generica"],
  prerequisitos: ["semantica-html", "section-vs-article", "span-generico"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "renomear-tag"],
  siteAlvo: SITE_PET_SHOP,

  introducao: [
    { texto: "Chegou o desafio! O Pet Shop Focinho Feliz foi montado só com div, do topo ao rodapé.", expressao: "feliz" },
    { texto: "Sem passo a passo desta vez. O checklist marca cada parte sozinho quando você fizer.", expressao: "curioso" },
    { texto: "Travou? O Rever te leva de volta pra fase onde aquilo foi ensinado. Bora arrumar?", expressao: "apontando" },
  ],

  partes: [
    {
      id: "cabecalho-rodape",
      descricao: "Trocar o cabeçalho para header e o rodapé para footer",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#topo", nome: "header" },
          { tipo: "tag", seletor: "#rodape", nome: "footer" },
        ],
      },
      revisarEm: "sites-elementos-u5-f1",
      solucaoDeTeste: [
        { tipo: "renomearTag", seletor: "#topo", novaTag: "header" },
        { tipo: "renomearTag", seletor: "#rodape", novaTag: "footer" },
      ],
    },
    {
      id: "secao-servicos",
      descricao: "Trocar o agrupamento dos serviços para section",
      validador: { tipo: "tag", seletor: "#servicos", nome: "section" },
      revisarEm: "sites-elementos-u5-f2",
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#servicos", novaTag: "section" }],
    },
    {
      id: "cards-artigo",
      descricao: "Trocar os dois cards de serviço para article",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#servico-banho", nome: "article" },
          { tipo: "tag", seletor: "#servico-vet", nome: "article" },
        ],
      },
      revisarEm: "sites-elementos-u5-f2",
      solucaoDeTeste: [
        { tipo: "renomearTag", seletor: "#servico-banho", novaTag: "article" },
        { tipo: "renomearTag", seletor: "#servico-vet", novaTag: "article" },
      ],
    },
    {
      id: "precos-span",
      descricao: "Trocar os dois preços de b para span",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#servico-banho .preco", nome: "span" },
          { tipo: "tag", seletor: "#servico-vet .preco", nome: "span" },
        ],
      },
      revisarEm: "sites-elementos-u5-f3",
      solucaoDeTeste: [
        { tipo: "renomearTag", seletor: "#servico-banho .preco", novaTag: "span" },
        { tipo: "renomearTag", seletor: "#servico-vet .preco", novaTag: "span" },
      ],
    },
  ],

  conclusao: [
    { texto: "Desafio vencido! Pet shop com cabeçalho, rodapé, seções e cards todos com o nome certo.", expressao: "comemorando" },
    { texto: "Div, span, header, footer, section e article: você já dá estrutura a qualquer site.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Escolha um site de verdade, aperte F12 e conte quantas divs dariam pra virar header, footer, section, article ou span.",

  falaFinal: {
    texto: "Lembra: no F12 a página é sua para explorar. Recarregou, voltou tudo. Pode mexer sem medo!",
    expressao: "comemorando",
  },
};
