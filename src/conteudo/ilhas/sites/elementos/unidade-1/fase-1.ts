/*
 * Unidade 1, Fase 1: "O site é seu".
 *
 * Primeira fase do jogo, migrada do formato antigo sem mudar o
 * comportamento: só objetivos guiados. Os objetivos sozinho e o desafio
 * da Unidade 1 ainda vão ser escritos (primeiro trabalho com a fábrica).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_PADARIA } from "./sites/padariaPaoQuentinho";

const NOVO_PRODUTO = "Sonho de creme";
const NOVA_MANCHETE = "Aqui quem manda sou eu";

export const FASE_U1_F1: FasePratica = {
  id: "sites-elementos-u1-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u1",
  titulo: "O site é seu",
  conceitos: [
    "elemento",
    "tag",
    "selecionar-pela-arvore",
    "modo-inspecionar",
    "editar-texto",
    "codigo-html",
    "lista-e-itens",
  ],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: [
    "painel",
    "previa",
    "me-ajuda",
    "tutor",
    "arvore",
    "inspecionar",
    "editar-duplo-clique",
    "editor",
    "sincronia",
  ],
  apresentar: ["painel", "previa", "me-ajuda", "tutor"],
  siteAlvo: SITE_PADARIA,

  introducao: [
    {
      texto:
        "Oi! Eu sou o computadorzinho. Sabia que todo site é montado com pecinhas? Elas se chamam elementos.",
      expressao: "feliz",
    },
    {
      texto: "Este painel aqui em cima mostra essas peças, igualzinho ao F12 de qualquer navegador de verdade.",
      expressao: "apontando",
    },
    {
      texto: "E hoje você vai mexer num site que não é seu: a Padaria Pão Quentinho. Bora?",
      expressao: "curioso",
    },
  ],

  objetivos: [
    {
      id: "selecionar-manchete",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Passe o mouse pela árvore e veja o que acende na tela. Depois clique na manchete principal.",
        toque: "Toque nos itens da árvore e veja o que acende na tela. Depois toque na manchete principal.",
      },
      apresentar: ["arvore"],
      validador: { tipo: "selecionado", seletor: "h1" },
      ajudas: {
        pergunta: "Qual peça da árvore acende o texto maior da página?",
        dica: "Manchetes costumam usar a tag h1, a de título mais importante.",
        linha: {
          alvo: "arvore",
          seletor: "h1",
          parte: "no",
          fala: "Olha esse nó piscando na árvore. Passe o mouse nele e veja o que acende na tela.",
        },
        solucao: {
          fala: "Selecionei o h1 pra você. Ele é a manchete principal: a peça que mostra o texto maior da página.",
          acoes: [{ tipo: "selecionar", seletor: "h1" }],
        },
      },
      falaAoConcluir: {
        texto: "Isso! Essa é a manchete, a tag h1. Viu como ela acendeu lá na tela?",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "selecionar", seletor: "h1" }],
    },
    {
      id: "inspecionar-botao",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora ao contrário: use o modo inspecionar (a setinha) e clique no botão Encomendar lá na tela.",
        toque: "Agora ao contrário: toque na setinha do modo inspecionar e depois no botão Encomendar lá na tela.",
      },
      apresentar: ["inspecionar"],
      validador: { tipo: "selecionado", seletor: "button", via: "inspecionar" },
      ajudas: {
        pergunta: "E se, em vez de procurar na árvore, você apontasse direto na tela?",
        dica: "A setinha no topo do painel faz o site te mostrar qual peça é qual.",
        linha: {
          alvo: "ferramenta",
          ferramenta: "inspecionar",
          fala: "Tá vendo a setinha piscando no topo do painel? Clique nela e depois no botão Encomendar lá na tela.",
        },
        solucao: {
          fala: "Usei a setinha e cliquei no botão Encomendar. Repare que a árvore pulou direto para a tag button.",
          acoes: [{ tipo: "selecionar", seletor: "button", via: "inspecionar" }],
        },
      },
      falaAoConcluir: {
        texto:
          "Mandou bem! A setinha faz o caminho contrário: da tela para o código. No F12 de verdade é igualzinho.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "selecionar", seletor: "button", via: "inspecionar" }],
    },
    {
      id: "trocar-manchete",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Dê dois cliques no texto da manchete, na árvore, e troque por qualquer frase sua.",
        toque: "Dê dois toques no texto da manchete, na árvore (ou toque em Editar), e troque por qualquer frase sua.",
      },
      apresentar: ["editar-duplo-clique"],
      validador: { tipo: "textoDiferenteDoInicial", seletor: "h1" },
      ajudas: {
        pergunta: "Onde mora o texto que aparece na manchete?",
        dica: "Na árvore, o texto fica entre a tag de abertura e a de fechamento. Dois cliques nele deixam editar.",
        linha: {
          alvo: "arvore",
          seletor: "h1",
          parte: "texto",
          fala: "O texto piscando na árvore é o da manchete. Dê dois cliques bem em cima dele.",
        },
        solucao: {
          fala: `Troquei o texto do h1 por "${NOVA_MANCHETE}". Foi só dar dois cliques no texto, escrever e apertar Enter.`,
          acoes: [{ tipo: "definirTexto", seletor: "h1", valor: NOVA_MANCHETE }],
        },
      },
      falaAoConcluir: {
        texto: "Olha a manchete nova no site! Você acabou de editar a página de outra pessoa.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "h1", valor: NOVA_MANCHETE }],
    },
    {
      id: "novo-produto",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora pelo código: adicione um produto novo na lista.",
        toque: "Agora pelo código: adicione um produto novo na lista.",
      },
      apresentar: ["editor", "sincronia"],
      validador: { tipo: "contagem", seletor: "ul.produtos > li", op: ">", valor: 3, comTexto: true },
      ajudas: {
        pergunta: "No código, que tag se repete uma vez pra cada produto?",
        dica: "Cada produto é um li dentro do ul. Copie uma linha de li e mude o texto.",
        linha: {
          alvo: "editor",
          seletor: "ul.produtos > li",
          fala: "Essas linhas piscando no editor são os produtos. Repare no padrão que se repete.",
        },
        solucao: {
          fala: `Coloquei <li>${NOVO_PRODUTO}</li> depois do último li. Cada produto é uma linha li dentro do ul.`,
          acoes: [{ tipo: "inserirHTML", seletor: "ul.produtos", posicao: "fim", html: `<li>${NOVO_PRODUTO}</li>` }],
        },
      },
      falaAoConcluir: {
        texto: "Produto novo na vitrine! Cada li é um item da lista, e você criou um do zero.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "inserirHTML", seletor: "ul.produtos", posicao: "fim", html: `<li>${NOVO_PRODUTO}</li>` },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Fase completa! Você mexeu num site do jeitinho que quem programa mexe.",
      expressao: "comemorando",
    },
    {
      texto: "E o melhor: isso funciona em qualquer site. Tenho uma missão de campo pra você.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Isso funciona em qualquer site. Abra um site de verdade, aperte F12 (ou Ctrl+Shift+I), use a setinha, clique num texto e dê dois cliques nele na aba Elements. Troque o que quiser: só você vê, e some quando recarregar.",

  falaFinal: {
    texto: "Ah, e este jogo também é um site... o que será que tem no F12 dele?",
    expressao: "curioso",
  },
};
