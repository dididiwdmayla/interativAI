/*
 * L2, Fase 1: "O container vira flex" (Livraria Página Virada).
 *
 * O QUE ENSINA: display: flex (o container vira uma fila de filhos) e
 * flex-direction (row, o padrão, e column).
 *
 * ORDEM: primeiro resolver o MESMO problema da L1 (menu empilhado) com
 * flexbox, mais simples que inline-block; a previsão explora
 * flex-direction: column (o menu volta a empilhar, mas por um motivo
 * diferente de display: block); o sozinho repete display: flex numa peça
 * nova (a lista de redes do rodapé), sem repetir a solução de row (que já
 * é o valor inicial de flex-direction e não daria um teste válido).
 *
 * REVISÃO ESPAÇADA: display: inline-block (L1) contrastado direto na fala
 * do objetivo 1; selecionar pela árvore (U1).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LIVRARIA_PAGINA_VIRADA } from "./sites/livrariaPaginaVirada";

export const FASE_L2_F1: FasePratica = {
  id: "sites-layout-u2-f1",
  tipo: "pratica",
  unidadeId: "sites-layout-u2",
  titulo: "O container vira flex",
  conceitos: ["flexbox", "flex-direction"],
  revisa: ["display-inline-block", "selecionar-pela-arvore"],
  prerequisitos: ["display-css"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Bem-vindo à Livraria Página Virada! O menu dela está empilhado, igual ao da Papelaria antes do inline-block.",
      expressao: "curioso",
    },
    {
      texto: "Desta vez vamos resolver com flexbox: display: flex transforma os filhos de uma caixa numa fila.",
      expressao: "apontando",
    },
  ],
  siteAlvo: LIVRARIA_PAGINA_VIRADA,
  objetivos: [
    {
      id: "nav-vira-flex",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Selecione o ul do menu (dentro do nav) e dê display: flex a ele.",
        toque: "Selecione o ul do menu (dentro do nav) e dê display: flex a ele.",
      },
      validador: { tipo: "valorEfetivo", seletor: "nav ul", propriedade: "display", valor: "flex" },
      ajudas: {
        pergunta: "Existe um display que transforma os filhos de uma caixa numa fila de uma vez, sem mexer em cada item?",
        dica: "É display: flex, na própria caixa que guarda os itens (o ul), não nos itens.",
        linha: { alvo: "arvore", seletor: "nav ul", fala: "É este ul, dentro do nav." },
        solucao: {
          fala: "Dei display: flex ao ul: os três li viraram uma fila horizontal de uma vez, sem tocar em nenhum deles.",
          acoes: [
            { tipo: "selecionar", seletor: "nav ul" },
            { tipo: "definirPropriedade", seletorRegra: "nav ul", propriedade: "display", valor: "flex" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Menu horizontal, sem inline-block em cada item! flexbox resolve na caixa que guarda tudo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: "nav ul" },
        { tipo: "definirPropriedade", seletorRegra: "nav ul", propriedade: "display", valor: "flex" },
      ],
    },
    {
      id: "flex-direction-column",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O menu está em fila com display: flex. Se você der flex-direction: column ao mesmo ul, o que acontece?",
        opcoes: [
          "Os itens voltam a empilhar, um embaixo do outro",
          "Nada muda: column é o mesmo que row",
          "Os itens ficam maiores",
        ],
        correta: 0,
        explicacao: "flex-direction escolhe o sentido da fila: row (padrão) é horizontal, column é vertical, como se empilhasse de novo.",
      },
      enunciado: {
        mouse: "Confira: dê flex-direction: column ao ul do menu.",
        toque: "Confira: dê flex-direction: column ao ul do menu.",
      },
      validador: { tipo: "valorEfetivo", seletor: "nav ul", propriedade: "flex-direction", valor: "column" },
      ajudas: {
        pergunta: "Qual declaração escolhe o sentido da fila de um flex container?",
        dica: "flex-direction. column empilha verticalmente; é diferente de tirar o display: flex.",
        linha: { alvo: "estilos", seletorRegra: "nav ul", fala: "Acrescente flex-direction: column nesta regra, nav ul." },
        solucao: {
          fala: "Acrescentei flex-direction: column: os itens empilharam de novo, mas continuam sendo flex, só que na vertical.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "nav ul", propriedade: "flex-direction", valor: "column" }],
        },
      },
      falaAoConcluir: {
        texto: "Empilhou de novo! Mas repare: display ainda é flex. Só o sentido da fila mudou.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirPropriedade", seletorRegra: "nav ul", propriedade: "flex-direction", valor: "column" },
      ],
    },
    {
      id: "redes-vira-flex",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "No rodapé, a lista de redes (ul.redes) também está empilhada. Dê display: flex a ela.",
        toque: "No rodapé, a lista de redes (ul.redes) também está empilhada. Dê display: flex a ela.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".redes", propriedade: "display", valor: "flex" },
      ajudas: {
        pergunta: "Qual display transforma a lista de redes numa fila, igual você fez com o menu?",
        dica: "flex, na regra .redes: a mesma ideia do menu, numa peça diferente.",
      },
      falaAoConcluir: {
        texto: "De novo! Instagram e WhatsApp lado a lado agora, com o mesmo display: flex.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".redes", propriedade: "display", valor: "flex" }],
    },
  ],
  conclusao: [
    {
      texto: "display: flex e flex-direction: você já resolve um menu empilhado sem inline-block.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, flexbox é a técnica mais usada de layout hoje. Muito site inteiro é construído com ela.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, ache um menu ou uma barra de ícones e veja no Styles se o pai deles é display: flex.",
  falaFinal: { texto: "Próxima fase: espalhar e alinhar os filhos de um flex container.", expressao: "feliz" },
};
