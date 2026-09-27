/*
 * L1, Fase 2: "Inline-block: bloco e linha ao mesmo tempo" (Papelaria
 * Ponto de Luz).
 *
 * O QUE ENSINA: display: inline-block, que fica lado a lado como inline
 * mas respeita width, height e padding vertical como block.
 *
 * ORDEM: primeiro um caso concreto em que inline atrapalha (o preço já
 * tem width: 60px na folha, mas fica do tamanho do texto porque é inline;
 * a previsão ataca essa confusão) e a correção é inline-block; o sozinho
 * aplica a mesma ideia para resolver o problema real da unidade: o menu
 * vertical vira horizontal.
 *
 * REVISÃO ESPAÇADA: display: block (Fase 1) explicado de novo por
 * contraste na fala; class repetida (.preco em duas seções, U4) no
 * objetivo guiado.
 *
 * CONFUSÃO ATACADA: "se width não funciona, o CSS está quebrado" — na
 * verdade elementos inline simplesmente ignoram width e height.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { PAPELARIA_PONTO_DE_LUZ } from "./sites/papelariaPontoDeLuz";

export const FASE_L1_F2: FasePratica = {
  id: "sites-layout-u1-f2",
  tipo: "pratica",
  unidadeId: "sites-layout-u1",
  titulo: "Inline-block: bloco e linha juntos",
  conceitos: ["display-inline", "display-inline-block"],
  revisa: ["class-repetivel", "display-block"],
  prerequisitos: ["display-css", "display-block"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Os preços da papelaria estão com um width definido no CSS, mas parece que ele não funciona. Vamos ver por quê?",
      expressao: "curioso",
    },
  ],
  siteAlvo: PAPELARIA_PONTO_DE_LUZ,
  objetivos: [
    {
      id: "preco-vira-inline-block",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "A regra .preco já tem width: 60px, mas a caixa amarela do preço fica só do tamanho do texto. Por quê?",
        opcoes: [
          "O width está escrito errado",
          "display: inline ignora width e height; só block e inline-block respeitam",
          "O navegador não gosta de width em px",
        ],
        correta: 1,
        explicacao: "Elementos inline (o padrão de span) ignoram width e height. Para o width valer, a caixa precisa ser block ou inline-block.",
      },
      enunciado: {
        mouse: "Confira: mude o display de .preco para inline-block e veja a caixa ganhar a largura certa, ao lado do texto.",
        toque: "Confira: mude o display de .preco para inline-block e veja a caixa ganhar a largura certa, ao lado do texto.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".preco", propriedade: "display", valor: "inline-block" },
      ajudas: {
        pergunta: "Existe um valor de display que fica lado a lado do texto (como inline) mas respeita width (como block)?",
        dica: "É o inline-block: mistura o melhor dos dois. Troque o valor na declaração display da regra .preco.",
        linha: { alvo: "estilos", seletorRegra: ".preco", propriedade: "display", fala: "É esta declaração: display, na regra .preco." },
        solucao: {
          fala: "Troquei display para inline-block na regra .preco: agora a caixa respeita o width e fica ao lado do texto.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".preco", propriedade: "display", valor: "inline-block" }],
        },
      },
      falaAoConcluir: {
        texto: "Agora sim! A caixa do preço ficou com os 60px certinhos, do lado do texto. inline-block é assim: os dois mundos.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".preco", propriedade: "display", valor: "inline-block" },
      ],
    },
    {
      id: "menu-horizontal",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O menu principal está empilhado, um item embaixo do outro. Deixe os itens lado a lado com display: inline-block.",
        toque: "O menu principal está empilhado, um item embaixo do outro. Deixe os itens lado a lado com display: inline-block.",
      },
      validador: { tipo: "valorEfetivo", seletor: "#menu-principal li", propriedade: "display", valor: "inline-block" },
      ajudas: {
        pergunta: "Qual regra veste todos os itens (li) do menu de uma vez?",
        dica: "É a regra #menu-principal li. Troque o display dela para inline-block: os itens ficam lado a lado.",
      },
      falaAoConcluir: {
        texto: "Menu horizontal pronto! Foi a mesma troca do preço, numa peça diferente: display: inline-block.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "#menu-principal li", propriedade: "display", valor: "inline-block" }],
    },
  ],
  conclusao: [
    {
      texto: "Duas caixas resolvidas com inline-block: o preço e o menu inteiro!",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, inline-block é o truque clássico de menus horizontais antes do flexbox (que vem na próxima unidade).",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, ache um menu horizontal e olhe o display dos itens no F12: muitos ainda usam inline-block.",
  falaFinal: { texto: "Próxima fase: o display que faz a peça sumir de vez.", expressao: "feliz" },
};
