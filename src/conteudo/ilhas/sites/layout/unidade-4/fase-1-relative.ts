/*
 * L4, Fase 1: "Relative: desliza sem sair do lugar" (Loja Retrô Vinil).
 *
 * O QUE ENSINA: position: relative, e o fato de que ele sozinho não muda
 * nada (é preciso um top/left/right/bottom para deslizar), mantendo o
 * espaço original reservado.
 *
 * ORDEM: guiado dando position: relative ao aviso (nada muda ainda, ataca
 * de cara a confusão "só o position já move algo"); previsão sobre o
 * efeito de top: 12px (desliza, mas o espaço de baixo NÃO sobe, diferente
 * de mover de verdade no fluxo); sozinho aplica a mesma dupla numa peça
 * diferente.
 *
 * REVISÃO ESPAÇADA: cor-de-fundo (E1) já presente no .aviso.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_RETRO_VINIL } from "./sites/lojaRetroVinil";

export const FASE_L4_F1: FasePratica = {
  id: "sites-layout-u4-f1",
  tipo: "pratica",
  unidadeId: "sites-layout-u4",
  titulo: "Relative: desliza sem sair do lugar",
  conceitos: ["position-css", "position-relative"],
  revisa: ["cor-de-fundo", "selecionar-pela-arvore"],
  prerequisitos: ["display-css"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Última unidade da zona Layout! Agora vamos falar de position: onde uma peça se posiciona de verdade.",
      expressao: "feliz",
    },
    {
      texto: "Existem cinco valores: static (o padrão), relative, absolute, fixed e sticky. Vamos um de cada vez.",
      expressao: "apontando",
    },
  ],
  siteAlvo: LOJA_RETRO_VINIL,
  objetivos: [
    {
      id: "aviso-vira-relative",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Selecione o aviso de lançamentos e dê position: relative a ele.",
        toque: "Selecione o aviso de lançamentos e dê position: relative a ele.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".aviso", propriedade: "position", valor: "relative" },
      ajudas: {
        pergunta: "Existe uma declaração que muda como uma peça se posiciona na página?",
        dica: "position. O valor relative é o primeiro dos quatro que tiram a peça do jeito padrão (static).",
        linha: { alvo: "arvore", seletor: ".aviso", fala: "É este aviso, .aviso, logo no topo do conteúdo." },
        solucao: {
          fala: "Dei position: relative ao aviso. Repare: nada mudou na tela ainda!",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "position", valor: "relative" }],
        },
      },
      falaAoConcluir: {
        texto: "Position: relative sozinho não move nada. Ele só abre a porta para usar top, left, right ou bottom.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "position", valor: "relative" }],
    },
    {
      id: "aviso-desliza",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você der top: 12px ao aviso (já relative), o que acontece com o espaço vazio que ele deixa em cima?",
        opcoes: [
          "Continua reservado: o texto de baixo não sobe para preenchê-lo",
          "O texto de baixo sobe e ocupa o espaço vazio",
          "A página inteira rola 12px para baixo",
        ],
        correta: 0,
        explicacao: "relative desliza a peça visualmente, mas o lugar ORIGINAL dela no fluxo continua reservado, vazio.",
      },
      enunciado: {
        mouse: "Confira: dê top: 12px ao aviso e veja se o texto de baixo se mexe.",
        toque: "Confira: dê top: 12px ao aviso e veja se o texto de baixo se mexe.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".aviso", propriedade: "top", valor: "12px" },
      ajudas: {
        pergunta: "Qual declaração desliza uma peça relative para baixo?",
        dica: "top: 12px. top, left, right e bottom dizem quanto deslizar, a partir do lugar original.",
        linha: { alvo: "estilos", seletorRegra: ".aviso", fala: "Acrescente top: 12px nesta regra, .aviso." },
        solucao: {
          fala: "Acrescentei top: 12px: o aviso desceu, mas o espaço vazio dele em cima continua lá.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "top", valor: "12px" }],
        },
      },
      falaAoConcluir: {
        texto: "Confirmado: um buraco ficou no lugar antigo. relative nunca tira a peça do fluxo, só desliza a aparência.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "top", valor: "12px" },
      ],
    },
    {
      id: "preco-desliza",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Dê position: relative e top: 6px ao preço do primeiro disco (.preco-disco), para destacá-lo um pouco.",
        toque: "Dê position: relative e top: 6px ao preço do primeiro disco (.preco-disco), para destacá-lo um pouco.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".preco-disco", propriedade: "position", valor: "relative" },
          { tipo: "valorEfetivo", seletor: ".preco-disco", propriedade: "top", valor: "6px" },
        ],
      },
      ajudas: {
        pergunta: "Quais duas declarações fazem o preço deslizar 6px para baixo, sem sair do fluxo?",
        dica: "position: relative e top: 6px, na regra .preco-disco: a mesma dupla do aviso.",
      },
      falaAoConcluir: {
        texto: "O preço desceu um pouquinho, sem bagunçar nada ao redor. relative é sutil assim.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".preco-disco", propriedade: "position", valor: "relative" },
        { tipo: "definirPropriedade", seletorRegra: ".preco-disco", propriedade: "top", valor: "6px" },
      ],
    },
  ],
  conclusao: [
    {
      texto: "position: relative desliza uma peça sem tirar o espaço dela do fluxo. É o mais suave dos quatro valores.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, relative também serve para outra coisa importante: ser a 'âncora' de um filho absolute. Já já você vê isso.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, procure algo levemente deslocado (um ícone, um texto) e veja no Styles se é position: relative.",
  falaFinal: { texto: "Próxima fase: o selo de promoção que gruda no canto do card.", expressao: "feliz" },
};
