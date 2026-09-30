/*
 * S1, Fase 1: "O título na busca" (Ateliê Linha Fina).
 *
 * O QUE ENSINA: rastreamento e indexação (o robô visita antes e guarda no
 * catálogo; a busca procura no catálogo, não no site) e o <title> como o
 * título do resultado. Apresenta a ferramenta nova "Resultado na busca"
 * (docs/GUIA-DE-CONTEUDO.md, seção 19).
 *
 * REVISA: o <title> e o head (U6) e editar texto pela árvore (U1), agora
 * com um motivo novo: o título da aba também é o convite da busca.
 *
 * ORDEM: 1) guiado, com previsão: a confusão de leigo "o Google lê o site
 * na hora da busca" vem primeiro, e depois trocar o title vendo o
 * resultado mudar; 2) sozinho, outra situação: pôr a cidade no title sem
 * ele passar do espaço (o corte aparece aqui pela primeira vez).
 *
 * Modo documento: o title mora no head, que só aparece na árvore assim.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { ATELIE_LINHA_FINA } from "./sites/atelieLinhaFina";

const TITULO_COM_NOME = "Ateliê Linha Fina | Consertos de roupa";
const TITULO_COM_CIDADE = "Ateliê Linha Fina | Consertos de roupa em Recife";

export const FASE_S1_F1: FasePratica = {
  id: "sites-ser-encontrado-u1-f1",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u1",
  titulo: "O título na busca",
  conceitos: ["rastreamento", "indexacao", "titulo-na-busca"],
  revisa: ["title", "editar-texto"],
  prerequisitos: ["title", "head-vs-body"],
  usaFerramentas: ["resultado-busca", "arvore", "editar-duplo-clique"],
  modoDocumento: true,
  siteAlvo: ATELIE_LINHA_FINA,
  introducao: [
    { texto: "Zona extra da Ilha Sites: fazer o site ser encontrado. Ela é opcional, então a Lógica já está aberta.", expressao: "feliz" },
    { texto: "O Ateliê Linha Fina conserta roupa em Recife, mas quem busca no Google nem percebe que o resultado é dele.", expressao: "pensativo" },
    { texto: "Vou te mostrar uma simulação do resultado na busca. Aproximada, mas bem parecida com a de verdade.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "titulo-com-nome",
      tipo: "previsao",
      modo: "guiado",
      apresentar: ["resultado-busca"],
      previsao: {
        pergunta: "Alguém busca \"conserto de roupa em Recife\". O Google abre os sites nessa hora para procurar?",
        opcoes: ["Não: o robô dele já visitou e guardou a página", "Sim: abre todos os sites na hora", "Só abre os sites que pagaram"],
        correta: 0,
        explicacao:
          "O robô visita as páginas antes (rastreamento) e guarda no catálogo (indexação). Na busca, ele procura no catálogo. Por isso uma mudança demora a aparecer.",
      },
      enunciado: {
        mouse: "Veja o resultado na aba Busca. Depois troque o texto do title, na árvore, por um com o nome do ateliê.",
        toque: "Veja o resultado na aba Busca. Depois troque o texto do title, na árvore, por um com o nome do ateliê.",
      },
      validador: { tipo: "resultadoBusca", campo: "titulo", contem: "Linha Fina" },
      ajudas: {
        pergunta: "Que texto aparece no título do resultado? De onde ele vem?",
        dica: "O título do resultado vem do <title>, no head. Dois cliques no texto dele, na árvore, deixam trocar.",
        linha: { alvo: "arvore", seletor: "title", parte: "texto", fala: "Este é o title: o texto dele vira o título do resultado." },
        solucao: {
          fala: "Troquei o title: agora o resultado diz de quem é a página e o que ela oferece.",
          acoes: [{ tipo: "definirTexto", seletor: "title", valor: TITULO_COM_NOME }],
        },
      },
      falaAoConcluir: {
        texto: "Agora quem busca sabe na hora de quem é o resultado. No Google de verdade, isso aparece depois que o robô visitar de novo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirTexto", seletor: "title", valor: TITULO_COM_NOME },
      ],
    },
    {
      id: "titulo-com-cidade",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Quem busca quer um ateliê perto. Ponha Recife no title, sem ele passar do espaço e ser cortado na busca.",
        toque: "Quem busca quer um ateliê perto. Ponha Recife no title, sem ele passar do espaço e ser cortado na busca.",
      },
      validador: { tipo: "resultadoBusca", campo: "titulo", contem: "Recife", semCorte: true },
      ajudas: {
        pergunta: "Se o title ficar comprido demais, o que aparece no fim dele na aba Busca?",
        dica: "Reticências: a busca cortou. Escreva o principal no começo e olhe a aba Busca a cada mudança.",
      },
      falaAoConcluir: { texto: "Título completo, com a cidade, e sem corte. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: TITULO_COM_CIDADE }],
    },
  ],
  conclusao: [
    { texto: "O title é o título da aba e também o título do resultado na busca: vale caprichar.", expressao: "comemorando" },
    { texto: "Embaixo do título tem outro texto importante, a descrição. É o próximo.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Busque no Google site: seguido do endereço de um site que você conhece (por exemplo, site:wikipedia.org). Depois abra uma das páginas, aperte F12 e compare o título do resultado com o <title> no head, na aba Elementos.",
  falaFinal: { texto: "Próxima fase: a descrição que convida a clicar.", expressao: "feliz" },
};
