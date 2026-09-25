/*
 * Unidade 3, Fase 1: "Hierarquia de títulos".
 *
 * O QUE ENSINA: os níveis de título (h1 a h6) dizem importância, não
 * tamanho de letra, e a tag p marca um bloco de texto corrido. A
 * ferramenta renomear tag é apresentada aqui, na sua primeira falta real.
 *
 * REVISÃO ESPAÇADA: selecionar pela árvore e o modo inspecionar (Unidade
 * 1) entram misturados, ao escolher qual título corrigir.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, ação: o gesto mínimo de renomear tag, no título mais óbvio
 *    (o principal, virou h4). Apresenta a ferramenta.
 * 2. Guiado, previsão: antes de corrigir o segundo título (h5), o jogador
 *    aposta o que muda. A resposta certa ataca de frente a confusão
 *    "título é só pra letra ficar grande": o nível é sobre importância.
 * 3. Guiado, ação: acrescentar um parágrafo pelo código, ensinando a tag
 *    p como a peça mais comum da página (revisão do editor da Unidade 1).
 * 4. Sozinho: mesmas duas habilidades (renomear título, acrescentar
 *    parágrafo) numa situação diferente — o título mais escondido (h6,
 *    função de subtítulo dentro do passo a passo) e usando a setinha em
 *    vez da árvore.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_HORTA } from "./sites/blogDaHorta";

export const FASE_U3_F1: FasePratica = {
  id: "sites-elementos-u3-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u3",
  titulo: "Hierarquia de títulos",
  conceitos: ["titulos-hierarquia", "paragrafo"],
  revisa: ["selecionar-pela-arvore", "modo-inspecionar"],
  prerequisitos: ["elemento", "tag", "selecionar-pela-arvore", "codigo-html"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editor", "sincronia", "renomear-tag"],
  siteAlvo: SITE_HORTA,

  introducao: [
    { texto: "Bem-vindo ao Blog da Horta! Esse post sobre tomate está com os títulos todos fora de ordem.", expressao: "feliz" },
    {
      texto: "Título não é só letra grande: o nível dele (h1 a h6) diz o quanto aquela parte é importante.",
      expressao: "pensativo",
    },
    { texto: "Tem uma ferramenta nova do F12 pra consertar isso rapidinho. Bora?", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "corrigir-titulo-principal",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O título principal virou h4! Dois cliques no nome da tag, na árvore, e troque para h1.",
        toque: "O título principal virou h4! Dois toques no nome da tag, na árvore, e troque para h1.",
      },
      apresentar: ["renomear-tag"],
      validador: { tipo: "tag", seletor: "#titulo-principal", nome: "h1" },
      ajudas: {
        pergunta: "Esse título é o mais importante da página inteira. Qual número de h combina com isso?",
        dica: "Os títulos vão de h1 a h6. O h1 é o mais importante; quanto maior o número, menor o nível.",
        linha: {
          alvo: "arvore",
          seletor: "#titulo-principal",
          fala: "Essa linha piscando é o título errado. Dois cliques no nome da tag trocam ela.",
        },
        solucao: {
          fala: "Troquei o h4 por h1: agora o título principal tem o nível certo, o mais importante da página.",
          acoes: [{ tipo: "renomearTag", seletor: "#titulo-principal", novaTag: "h1" }],
        },
      },
      falaAoConcluir: { texto: "Isso! Agora o h1 realmente é o título mais importante da página.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#titulo-principal", novaTag: "h1" }],
    },
    {
      id: "prever-subtitulo",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: se a gente trocar esse h5 ('Passo a passo') por h2, o que muda de verdade?",
        opcoes: [
          "Só o tamanho da letra fica menor",
          "O tamanho muda e a página passa a entender que é uma seção importante",
          "Nada muda, é só estética",
        ],
        correta: 1,
        explicacao:
          "O nível do título não é só visual: ele diz para leitores de tela e para o Google que aquilo é uma seção de verdade.",
      },
      enunciado: {
        mouse: "Agora confira: troque o h5 'Passo a passo' para h2.",
        toque: "Agora confira: toque duas vezes no nome da tag e troque o h5 'Passo a passo' para h2.",
      },
      validador: { tipo: "tag", seletor: "#passos-titulo", nome: "h2" },
      ajudas: {
        pergunta: "Esse título está no mesmo nível de 'O que você vai precisar'?",
        dica: "Duas seções irmãs do artigo geralmente têm o mesmo nível de título.",
        linha: {
          alvo: "arvore",
          seletor: "#passos-titulo",
          fala: "Essa é a linha do 'Passo a passo'. Dois cliques no nome da tag trocam ela.",
        },
        solucao: {
          fala: "Troquei o h5 por h2: agora as duas seções (materiais e passo a passo) têm o mesmo nível.",
          acoes: [{ tipo: "renomearTag", seletor: "#passos-titulo", novaTag: "h2" }],
        },
      },
      falaAoConcluir: {
        texto: "Exato! O nível do título é sobre importância, não sobre tamanho de letra.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "renomearTag", seletor: "#passos-titulo", novaTag: "h2" },
      ],
    },
    {
      id: "acrescentar-paragrafo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Pelo código, no fim do article, escreva um novo parágrafo contando por que você gosta de tomate.",
        toque: "Pelo código, no fim do article, escreva um novo parágrafo contando por que você gosta de tomate.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "article > p", op: ">=", valor: 6 },
          { tipo: "textoDiferenteDoInicial", seletor: "article > p" },
        ],
      },
      ajudas: {
        pergunta: "Que tag marca um bloco de texto corrido, como esse parágrafo?",
        dica: "A tag p é a peça mais comum da página: qualquer texto corrido mora dentro dela.",
        linha: {
          alvo: "editor",
          seletor: "#extra",
          fala: "Olha as linhas do último parágrafo piscando no código. Escreva o seu logo depois delas, com a tag p.",
        },
        solucao: {
          fala: "Escrevi um novo p com uma frase minha: todo texto corrido vai dentro da tag p.",
          acoes: [
            {
              tipo: "inserirHTML",
              seletor: "article",
              posicao: "fim",
              html: "<p>Tomate colhido na hora tem um sabor que nenhum de mercado alcança.</p>",
            },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Boa! Agora o artigo tem a sua marca: um parágrafo novo, escrito por você.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        {
          tipo: "inserirHTML",
          seletor: "article",
          posicao: "fim",
          html: "<p>Tomate colhido na hora tem um sabor que nenhum de mercado alcança.</p>",
        },
      ],
    },
    {
      id: "hierarquia-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Com a setinha, ache o título da dica da vizinha e acerte o nível dele. Depois, pelo código, escreva mais um parágrafo com uma dica sua.",
        toque: "Toque no título da dica da vizinha com a setinha e acerte o nível dele. Depois, pelo código, escreva mais um parágrafo com uma dica sua.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#dica-titulo", nome: "h3" },
          { tipo: "evento", evento: "inspecionou" },
          { tipo: "contagem", seletor: "article > p", op: ">=", valor: 7 },
        ],
      },
      ajudas: {
        pergunta: "Essa dica é uma sub-parte de qual seção? Qual nível fica um andar abaixo dela?",
        dica: "Se o Passo a passo é h2, uma dica dentro dele fica um nível abaixo: h3.",
      },
      falaAoConcluir: {
        texto: "Perfeito! Título no nível certo e mais um parágrafo seu na página.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: "#dica-titulo", via: "inspecionar" },
        { tipo: "renomearTag", seletor: "#dica-titulo", novaTag: "h3" },
        {
          tipo: "inserirHTML",
          seletor: "article",
          posicao: "fim",
          html: "<p>Plantas de tomate gostam de um espaço para as raízes respirarem.</p>",
        },
      ],
    },
  ],

  conclusao: [
    { texto: "Agora você acerta a hierarquia de qualquer artigo: h1 no topo, e cada nível abaixo do seu pai.", expressao: "comemorando" },
    {
      texto: "No F12 de verdade, dois cliques no nome da tag (ou botão direito, Edit node type) fazem a mesma troca.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Abra um site de notícias de verdade, aperte F12 e confira: o título principal é h1? Os subtítulos seguem uma ordem sem pular níveis? Só você vê.",

  falaFinal: {
    texto: "Curiosidade: pular de h1 direto pra h4 é como pular capítulo de livro. Sempre desce um nível de cada vez.",
    expressao: "curioso",
  },
};
