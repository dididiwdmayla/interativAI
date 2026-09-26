/*
 * E2, Fase 2: "Seletor de id e seletor descendente" (mesma Livraria).
 *
 * O QUE ENSINA: o seletor de id (#id: pega só UMA peça, porque id não se
 * repete) e o seletor descendente (dois seletores com espaço: só pega o
 * segundo quando está DENTRO do primeiro). O seletor descendente resolve
 * de vez o problema que a Fase 1 revelou: como pintar só os autores dos
 * livros, sem pegar a citação do aviso (que também tem class autor).
 *
 * ORDEM: 1) previsão do id (a confusão de leigo é achar que id e class são
 * a mesma coisa: a previsão pergunta direto isso); 2) descendente, com o
 * problema real da Fase 1 (a citação mudando junto) — o + do painel só
 * sugere o seletor da peça selecionada (.autor sozinho), então um seletor
 * COMPOSTO como main .autor se escreve direto na aba CSS, apresentada
 * aqui; 3) sozinho, a mesma ideia (tag + descendente) numa dupla de peças
 * diferente (o parágrafo do rodapé x os parágrafos dos livros).
 *
 * REVISÃO ESPAÇADA: regra nova (E1F3) no objetivo 1.
 *
 * CONFUSÃO ATACADA: "id e class são a mesma coisa" (previsão do objetivo 1,
 * a mesma confusão da U4, agora do lado do CSS).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LIVRARIA_PAGINA_VIRADA } from "./sites/livrariaPaginaVirada";

export const FASE_E2_F2: FasePratica = {
  id: "sites-estilos-u2-f2",
  tipo: "pratica",
  unidadeId: "sites-estilos-u2",
  titulo: "Seletor de id e seletor descendente",
  conceitos: ["seletor-de-id", "seletor-descendente"],
  revisa: ["regra-nova"],
  prerequisitos: ["seletor-de-tag", "seletor-de-classe"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css", "nova-regra", "editor-css"],
  paineisElementos: ["estilos"],

  introducao: [
    { texto: "O livro mais vendido tem um id só dele: #livro-mais-vendido. Vamos usar isso.", expressao: "curioso" },
    { texto: "E tem um jeito de pintar só os autores dos livros, sem pegar a citação do aviso. Bora ver como?", expressao: "apontando" },
  ],

  siteAlvo: LIVRARIA_PAGINA_VIRADA,
  objetivos: [
    {
      id: "destaque-mais-vendido",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O card do livro mais vendido tem id=\"livro-mais-vendido\". Uma regra #livro-mais-vendido pega quantas peças?",
        opcoes: ["Só essa, porque id não se repete", "Todos os livros, igual à class", "Só se ela também tivesse a class livro"],
        correta: 0,
        explicacao: "Um id é único na página inteira. Por isso o seletor #id sempre pega uma peça só, nunca um grupo.",
      },
      enunciado: {
        mouse: "Confira: crie uma regra #livro-mais-vendido com background-color: #fff3cd.",
        toque: "Confira: crie uma regra #livro-mais-vendido com background-color: #fff3cd.",
      },
      validador: { tipo: "valorEfetivo", seletor: "#livro-mais-vendido", propriedade: "background-color", valor: "#fff3cd" },
      ajudas: {
        pergunta: "Que sinal, na frente do nome, cria um seletor de id?",
        dica: "O sustenido (#) antes do nome do id. Sem regra ainda, você cria uma com o +.",
        linha: { alvo: "arvore", seletor: "#livro-mais-vendido", fala: "É este card: repare no id dele na árvore." },
        solucao: {
          fala: "Criei a regra #livro-mais-vendido com um fundo amarelinho: só esse card mudou.",
          acoes: [
            { tipo: "selecionar", seletor: "#livro-mais-vendido" },
            { tipo: "adicionarRegra", seletorRegra: "#livro-mais-vendido", declaracoes: [{ propriedade: "background-color", valor: "#fff3cd" }] },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Só o card do livro mais vendido ganhou o fundo. Id é único: o seletor dele nunca pega um grupo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "selecionar", seletor: "#livro-mais-vendido" },
        { tipo: "adicionarRegra", seletorRegra: "#livro-mais-vendido", declaracoes: [{ propriedade: "background-color", valor: "#fff3cd" }] },
      ],
    },
    {
      id: "autores-so-dos-livros",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: 'Pinte só os autores dos livros (não a citação do aviso) de azul: escreva "main .autor { color: #2a6f97; }" no fim da aba CSS.',
        toque: 'Pinte só os autores dos livros (não a citação do aviso) de azul: escreva "main .autor { color: #2a6f97; }" no fim da aba CSS.',
      },
      apresentar: ["editor-css"],
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: "main .autor", propriedade: "color", valor: "#2a6f97" },
          { tipo: "valorEfetivo", seletor: ".chamada .autor", propriedade: "color", valor: "#999999" },
        ],
      },
      ajudas: {
        pergunta: "Como escrever um seletor que pega .autor só quando está dentro do main?",
        dica: "Dois seletores com um espaço: main .autor pega a class autor só dentro do main. O + só sugere a peça selecionada; este é direto na aba CSS.",
        linha: { alvo: "arvore", seletor: "main", fala: "É aqui dentro que os autores de livro moram." },
        solucao: {
          fala: "Escrevi main .autor { color: #2a6f97; } na aba CSS: só os três nomes de autor mudaram, a citação ficou como estava.",
          acoes: [{ tipo: "editarCss", posicao: "fim", texto: "main .autor { color: #2a6f97; }" }],
        },
      },
      falaAoConcluir: {
        texto: "Agora sim: só os autores dos livros mudaram. O espaço entre os dois seletores faz toda a diferença.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "main .autor { color: #2a6f97; }" }],
    },
    {
      id: "rodape-diferente",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: 'Deixe só o parágrafo do rodapé (não os dos livros) em itálico: escreva "footer p { font-style: italic; }" na aba CSS.',
        toque: 'Deixe só o parágrafo do rodapé (não os dos livros) em itálico: escreva "footer p { font-style: italic; }" na aba CSS.',
      },
      validador: { tipo: "valorEfetivo", seletor: "footer p", propriedade: "font-style", valor: "italic" },
      ajudas: {
        pergunta: "Que seletor pega um p só quando está dentro do footer?",
        dica: "footer p, com espaço: tag dentro de tag, do jeito que o seletor descendente funciona.",
      },
      falaAoConcluir: {
        texto: "Só o rodapé ficou em itálico. Tag com tag, class com class: o espaço sempre quer dizer 'dentro de'.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "footer p { font-style: italic; }" }],
    },
  ],

  conclusao: [
    { texto: "Id pega uma peça só; descendente combina dois seletores pra mirar só o que está dentro do certo.", expressao: "comemorando" },
    { texto: "No F12 de verdade, o + do painel Styles sugere id quando a peça tem um, exatamente por isso.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, ache uma peça com id no F12 e veja o seletor #id. Depois ache uma regra com espaço no meio (tipo nav a) e repare onde ela mira.",

  falaFinal: { texto: "Agora o desafio: estilizar só os itens em promoção. Bora?", expressao: "feliz" },
};
