/*
 * E2, Fase 1: "Seletor de tag e de classe" (Livraria Página Virada).
 *
 * O QUE ENSINA: o seletor de tag (h3: pega TODAS as peças daquele tipo) e o
 * seletor de classe (.autor, .preco: pega toda peça com aquela class, onde
 * quer que ela more). A ideia central, repetida nos dois: um seletor não
 * escolhe UMA peça, ele escolhe um GRUPO por uma regra (o tipo da tag ou a
 * class marcada).
 *
 * ORDEM: 1) tag (h3), o caso mais simples: só olhar o nome da tag; 2)
 * classe, com uma previsão ANTES de mexer, porque a confusão de leigo é
 * achar que cada peça "tem a sua regra" (a resposta certa: mudar .autor
 * muda os três autores E a citação do aside, porque os dois têm a mesma
 * class); 3) sozinho, outra classe (.preco), mesma ideia.
 *
 * REVISÃO ESPAÇADA: tamanho da letra (E1F2) no objetivo 1; cor por nome
 * (E1F1) no sozinho.
 *
 * CONFUSÃO ATACADA: "cada peça tem a sua própria regra" — a previsão do
 * objetivo 2 mostra que uma classe repetida muda TUDO que a usa de uma vez,
 * até uma peça que não parece ter nada a ver (a citação do aside).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LIVRARIA_PAGINA_VIRADA } from "./sites/livrariaPaginaVirada";

export const FASE_E2_F1: FasePratica = {
  id: "sites-estilos-u2-f1",
  tipo: "pratica",
  unidadeId: "sites-estilos-u2",
  titulo: "Seletor de tag e de classe",
  conceitos: ["seletor-de-tag", "seletor-de-classe"],
  revisa: ["tamanho-da-letra", "cor-por-nome"],
  prerequisitos: ["regra-e-declaracao", "cor-do-texto"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],

  introducao: [
    { texto: "Bem-vinda à Livraria Página Virada! Hoje a gente aprende a mirar direitinho com os seletores.", expressao: "feliz" },
    { texto: "Um seletor não escolhe uma peça só: ele escolhe um GRUPO, por uma regra (o tipo da tag ou a class marcada).", expressao: "curioso" },
  ],

  siteAlvo: LIVRARIA_PAGINA_VIRADA,
  objetivos: [
    {
      id: "titulos-maiores",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Os títulos dos livros (h3) estão pequenos. Aumente o font-size da regra h3 para 20px.",
        toque: "Os títulos dos livros (h3) estão pequenos. Aumente o font-size da regra h3 para 20px.",
      },
      validador: { tipo: "valorEfetivo", seletor: "h3", propriedade: "font-size", valor: "20px" },
      ajudas: {
        pergunta: "Que seletor pega o TIPO de peça h3, os três títulos de uma vez?",
        dica: "Um seletor com o nome de uma tag pega toda peça daquele tipo na página: é o seletor de tag.",
        linha: { alvo: "estilos", seletorRegra: "h3", propriedade: "font-size", fala: "É esta declaração, na regra h3." },
        solucao: {
          fala: "Troquei o font-size da regra h3 para 20px: os três títulos cresceram juntos.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "h3", propriedade: "font-size", valor: "20px" }],
        },
      },
      falaAoConcluir: {
        texto: "Os três títulos cresceram de uma vez! A regra h3 vale pra toda peça daquele tipo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h3", propriedade: "font-size", valor: "20px" }],
    },
    {
      id: "cor-dos-autores",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Cada autor tem a class autor. Se você mudar a cor da regra .autor, quantos textos mudam?",
        opcoes: ["Só o do primeiro livro", "Os três autores E a citação do aviso, porque têm a mesma class", "Nenhum: cada peça precisa da própria regra"],
        correta: 1,
        explicacao: "Uma class repetida liga tudo que a usa: os três nomes de autor e até a citação do aviso, que também tem class autor.",
      },
      enunciado: {
        mouse: "Confira: troque o color da regra .autor para #555555.",
        toque: "Confira: troque o color da regra .autor para #555555.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".autor", propriedade: "color", valor: "#555555" },
      ajudas: {
        pergunta: "Qual regra tem o seletor .autor?",
        dica: "Um seletor com ponto na frente é de classe: pega toda peça com aquela class, onde quer que ela more.",
        linha: { alvo: "estilos", seletorRegra: ".autor", propriedade: "color", fala: "É esta declaração, na regra .autor." },
        solucao: {
          fala: "Troquei o color da regra .autor: os três autores E a citação do aviso mudaram juntos.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".autor", propriedade: "color", valor: "#555555" }],
        },
      },
      falaAoConcluir: {
        texto: "Viu? Até a citação do aviso mudou, porque ela também tem class autor. Classe é assim: liga tudo que a usa.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".autor", propriedade: "color", valor: "#555555" },
      ],
    },
    {
      id: "precos-visiveis",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Os preços estão quase invisíveis (a class é .preco). Deixe todos crimson, mudando uma regra só.",
        toque: "Os preços estão quase invisíveis (a class é .preco). Deixe todos crimson, mudando uma regra só.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".preco", propriedade: "color", valor: "crimson" },
      ajudas: {
        pergunta: "Qual regra pega todos os preços de uma vez?",
        dica: "É a mesma ideia do autor: uma regra com a class .preco vale para toda peça marcada com ela.",
      },
      falaAoConcluir: {
        texto: "Três preços com uma troca só! Class repetida é assim: uma regra, várias peças.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".preco", propriedade: "color", valor: "crimson" }],
    },
  ],

  conclusao: [
    { texto: "Seletor de tag pega um tipo inteiro; seletor de classe pega tudo que usa aquela class. Nenhum dos dois escolhe uma peça só.", expressao: "comemorando" },
    { texto: "No F12 de verdade é igual: no painel Styles, o topo de cada bloco mostra exatamente esse seletor.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, abra o F12 e ache uma regra de tag (como p ou h2) e uma de classe (com ponto). Veja quantas peças cada uma pega.",

  falaFinal: { texto: "Na próxima fase: um seletor que pega só UMA peça, e outro que combina dois de uma vez.", expressao: "curioso" },
};
