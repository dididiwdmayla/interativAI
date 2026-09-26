/*
 * E4, Fase 2: "Herança e !important" (mesma loja).
 *
 * O QUE ENSINA: herança (sem regra própria, uma peça herda as
 * propriedades herdáveis do ancestral mais perto) e !important (vence
 * quase tudo; o jeito de mudar o valor é editar a PRÓPRIA declaração, e é
 * melhor evitar usá-lo).
 *
 * ORDEM: 1) previsão de herança (a confusão de leigo: "sem regra, fica
 * sem estilo nenhum"); 2) guiado, consertar um !important editando a
 * própria declaração; 3) sozinho, outro !important, situação diferente
 * (background em vez de color).
 *
 * REVISÃO ESPAÇADA: cor por nome e cor hexadecimal (E1) nas tarefas.
 *
 * CONFUSÃO ATACADA: "sem regra escrita, a peça fica sem estilo nenhum" —
 * a previsão do objetivo 1 mostra que ela herda do ancestral mais perto.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_CORDA_E_NOTA } from "./sites/lojaCordaENota";

export const FASE_E4_F2: FasePratica = {
  id: "sites-estilos-u4-f2",
  tipo: "pratica",
  unidadeId: "sites-estilos-u4",
  titulo: "Herança e !important",
  conceitos: ["heranca-css", "importante-css"],
  revisa: ["cor-por-nome", "cor-hexadecimal"],
  prerequisitos: ["cascata-css", "especificidade-css"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],

  introducao: [
    { texto: "Repare na descrição do violão: ninguém escreveu regra de cor pra ela, mas ela não é preta.", expressao: "curioso" },
  ],

  siteAlvo: LOJA_CORDA_E_NOTA,
  objetivos: [
    {
      id: "de-onde-vem-a-cor",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O parágrafo .descricao não tem NENHUMA regra de color. De que cor o texto dele aparece?",
        opcoes: [
          "Preto, o padrão do navegador quando não há regra",
          "Roxa (#3d348b), herdada do article que é o pai dele",
          "Branca, porque fica sem nenhuma cor",
        ],
        correta: 1,
        explicacao: "color é uma propriedade herdável: sem regra própria, a peça usa a cor do ancestral mais perto que tiver uma.",
      },
      enunciado: {
        mouse: "Confira: selecione a .descricao e veja Herdado de article.instrumento no painel.",
        toque: "Confira: selecione a .descricao e veja Herdado de article.instrumento no painel.",
      },
      validador: { tipo: "selecionado", seletor: ".descricao" },
      ajudas: {
        pergunta: "Sem uma regra própria, de onde a peça pega uma propriedade herdável?",
        dica: "Do ancestral mais perto que tiver essa propriedade escrita. O painel mostra isso na seção Herdado de.",
        linha: { alvo: "arvore", seletor: ".descricao", fala: "Selecione este parágrafo, o da descrição." },
        solucao: {
          fala: "Selecionei a .descricao: o painel mostra Herdado de article.instrumento, com o roxo #3d348b.",
          acoes: [{ tipo: "selecionar", seletor: ".descricao" }],
        },
      },
      falaAoConcluir: {
        texto: "Isso mesmo! color herda do pai mais perto. Sem regra não é sinônimo de sem estilo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "selecionar", seletor: ".descricao" },
      ],
    },
    {
      id: "vencer-o-important-do-preco",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O preço está crimson com !important, travado. Troque o color dele para teal, editando essa mesma declaração.",
        toque: "O preço está crimson com !important, travado. Troque o color dele para teal, editando essa mesma declaração.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".preco", propriedade: "color", valor: "teal" },
      ajudas: {
        pergunta: "Uma declaração !important só perde para outro !important mais específico. Como mudar o valor dela então?",
        dica: "Editando a PRÓPRIA declaração: o !important continua ali, só o valor muda.",
        linha: { alvo: "estilos", seletorRegra: ".preco", propriedade: "color", fala: "É esta declaração, com o !important no fim." },
        solucao: {
          fala: "Troquei o valor da própria declaração pra teal: o !important ficou, só a cor mudou.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".preco", propriedade: "color", valor: "teal" }],
        },
      },
      falaAoConcluir: {
        texto: "Resolvido sem criar outro !important! Cada !important a mais deixa a próxima briga pior: por isso é melhor evitar.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".preco", propriedade: "color", valor: "teal" }],
    },
    {
      id: "vencer-o-important-do-cabecalho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O fundo do cabeçalho também está travado com !important, em verde. Troque para #3d348b.",
        toque: "O fundo do cabeçalho também está travado com !important, em verde. Troque para #3d348b.",
      },
      validador: { tipo: "valorEfetivo", seletor: "header", propriedade: "background-color", valor: "#3d348b" },
      ajudas: {
        pergunta: "Que declaração do header tem !important?",
        dica: "O background-color. Edite o valor dela mesma, sem criar regra nova.",
      },
      falaAoConcluir: {
        texto: "De novo sem precisar de outro !important! Agora a loja toda tem a cara certa.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "header", propriedade: "background-color", valor: "#3d348b" }],
    },
  ],

  conclusao: [
    { texto: "Herança explica cor sem regra; !important só se resolve editando a própria declaração, evitando outro.", expressao: "comemorando" },
    { texto: "No F12 de verdade, uma declaração com !important aparece com um aviso amarelo ao lado, no painel Styles.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, ache no F12 uma peça sem regra de cor própria e veja de onde ela herdou. Depois procure algum !important no painel Styles.",

  falaFinal: { texto: "Agora o desafio: três regras que não pegam, numa academia. Bora depurar?", expressao: "feliz" },
};
