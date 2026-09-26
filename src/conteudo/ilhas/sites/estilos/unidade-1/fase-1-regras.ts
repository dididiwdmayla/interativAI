/*
 * E1, Fase 1: "Regras e declarações" (Floricultura Pétala Azul).
 *
 * O QUE ENSINA: o que é o CSS (a roupa das peças, separada do HTML), o
 * formato de uma regra (seletor e declarações propriedade: valor), a cor do
 * texto com cor por nome e ligar e desligar uma declaração pela caixinha.
 * As três ferramentas básicas do painel Estilos são apresentadas uma por
 * objetivo, no primeiro que precisa delas.
 *
 * ORDEM: primeiro só OLHAR (selecionar o h1 e ver as regras dele), depois
 * MEXER num valor (a cor do nome), depois DESLIGAR (com previsão, porque a
 * confusão de leigo é "desligar apaga a peça"). O sozinho aplica a mesma
 * edição de valor numa situação nova: uma regra de class (.preco) que pega
 * três peças de uma vez.
 *
 * REVISÃO ESPAÇADA: selecionar pela árvore (U1) no primeiro objetivo e class
 * repetível (U4) no sozinho, misturados na tarefa.
 *
 * CONFUSÕES ATACADAS: "CSS muda o HTML" (a fala do objetivo 2 mostra que o
 * código HTML nem mexeu) e "desligar apaga" (a previsão do objetivo 3).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { FLORICULTURA_PETALA_AZUL } from "./sites/floriculturaPetalaAzul";

export const FASE_E1_F1: FasePratica = {
  id: "sites-estilos-u1-f1",
  tipo: "pratica",
  unidadeId: "sites-estilos-u1",
  titulo: "Regras e declarações",
  conceitos: ["o-que-e-css", "regra-e-declaracao", "cor-do-texto", "cor-por-nome", "ligar-desligar-declaracao", "cor-de-fundo"],
  revisa: ["selecionar-pela-arvore", "class-repetivel"],
  prerequisitos: ["elemento", "tag"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css", "ligar-desligar-declaracao"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Bem-vindo à zona Estilos! Até agora você mexeu nas peças. Agora vamos mexer na roupa delas: cor, tamanho, fonte.",
      expressao: "feliz",
    },
    {
      texto: "Quem veste as peças é o CSS, a folha de estilo. O HTML diz o que cada peça é; o CSS diz como ela aparece.",
      expressao: "curioso",
    },
    {
      texto: "Esta é a Floricultura Pétala Azul. O site está sem graça, e a dona pediu a nossa ajuda. Bora deixar ele bonito?",
      expressao: "apontando",
    },
  ],
  siteAlvo: FLORICULTURA_PETALA_AZUL,
  objetivos: [
    {
      id: "ver-regras-do-titulo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique no h1 da árvore (o nome da floricultura) e olhe o painel Estilos ao lado.",
        toque: "Toque no h1 da árvore (o nome da floricultura) e depois em Estilos.",
      },
      apresentar: ["painel-estilos"],
      validador: { tipo: "selecionado", seletor: "h1" },
      ajudas: {
        pergunta: "Qual peça mostra o nome da floricultura lá em cima?",
        dica: "O título principal da página é o h1. Com ele selecionado, o painel Estilos mostra as regras que vestem ele.",
        linha: { alvo: "arvore", seletor: "h1", fala: "É este aqui na árvore: o h1, dentro do header." },
        solucao: {
          fala: "Selecionei o h1. No painel Estilos, a regra h1 mostra a cor e o tamanho dele, entre chaves.",
          acoes: [{ tipo: "selecionar", seletor: "h1" }],
        },
      },
      falaAoConcluir: {
        texto: "Isso! Cada bloco do painel é uma regra: um seletor (h1) e as declarações dele entre chaves.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "selecionar", seletor: "h1" }],
    },
    {
      id: "cor-do-titulo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O nome está apagado. No painel Estilos, clique no valor de color do h1 e troque por white.",
        toque: "O nome está apagado. No painel Estilos, toque no valor de color do h1 e troque por white.",
      },
      apresentar: ["editar-valor-css"],
      validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "color", valor: "white" },
      ajudas: {
        pergunta: "Qual declaração da regra h1 cuida da cor das letras?",
        dica: "Cada declaração é propriedade: valor. color é a cor do texto; o que muda é o valor, depois dos dois-pontos.",
        linha: { alvo: "estilos", seletorRegra: "h1", propriedade: "color", fala: "É esta declaração: color, na regra h1. Troque só o valor." },
        solucao: {
          fala: "Troquei o valor de color para white. A regra h1 vale para o h1, então o nome ficou branco.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "white" }],
        },
      },
      falaAoConcluir: {
        texto: "Branquinho e legível! E repare: o código HTML nem mexeu. Só a folha de estilo mudou.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "white" }],
    },
    {
      id: "desligar-fundo-do-rodape",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O rodapé tem um fundo verdinho (background-color). Se você desligar essa declaração, o que acontece?",
        opcoes: ["O rodapé some da página", "Só o fundo verdinho some; o texto fica", "O texto do rodapé fica branco"],
        correta: 1,
        explicacao: "Desligar tira só aquela declaração. O rodapé continua no HTML, só perde o fundo.",
      },
      enunciado: {
        mouse: "Confira: selecione o footer e desligue o background-color dele pela caixinha.",
        toque: "Confira: selecione o footer e desligue o background-color dele pela caixinha.",
      },
      apresentar: ["ligar-desligar-declaracao"],
      validador: { tipo: "declaracao", seletorRegra: "footer", propriedade: "background-color", ativa: false },
      ajudas: {
        pergunta: "Qual regra dá o fundo verdinho ao rodapé?",
        dica: "A caixinha ao lado de uma declaração liga e desliga sem apagar. Desligada, ela fica riscada.",
        linha: {
          alvo: "estilos",
          seletorRegra: "footer",
          propriedade: "background-color",
          fala: "Esta é a declaração do fundo. A caixinha fica do lado dela.",
        },
        solucao: {
          fala: "Desliguei o background-color do footer: ficou riscado e, no CSS, virou comentário. O rodapé continua ali.",
          acoes: [{ tipo: "alternarDeclaracao", seletorRegra: "footer", propriedade: "background-color" }],
        },
      },
      falaAoConcluir: {
        texto: "Viu? O rodapé continua ali, só sem o fundo. Na folha, a declaração virou um comentário: dá para ligar de novo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "alternarDeclaracao", seletorRegra: "footer", propriedade: "background-color" },
      ],
    },
    {
      id: "precos-legiveis",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Os preços estão quase invisíveis. Deixe todos crimson mudando uma regra só.",
        toque: "Os preços estão quase invisíveis. Deixe todos crimson mudando uma regra só.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".preco", propriedade: "color", valor: "crimson" },
      ajudas: {
        pergunta: "Qual regra pega todos os preços de uma vez?",
        dica: "Uma regra com .preco vale para toda peça com a class preco. Trocando a cor nela, todos mudam juntos.",
      },
      falaAoConcluir: {
        texto: "Três preços com uma troca só! É a força de uma class repetida: uma regra, várias peças.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".preco", propriedade: "color", valor: "crimson" }],
    },
  ],
  conclusao: [
    {
      texto: "Você trocou uma cor, desligou um fundo e pintou três preços. Tudo sem tocar no HTML!",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade é igual: aba Elements, painel Styles e a mesma caixinha. A mudança fica só na sua tela.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Abra o F12 num site de verdade, selecione um título na aba Elements e troque a cor dele no painel Styles. Depois recarregue a página: tudo volta ao normal, porque a mudança foi só na sua tela.",
  falaFinal: { texto: "Na próxima fase: tamanho, fonte e alinhamento. Até já!", expressao: "feliz" },
};
