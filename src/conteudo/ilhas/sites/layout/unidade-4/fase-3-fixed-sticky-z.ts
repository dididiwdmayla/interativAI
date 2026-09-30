/*
 * L4, Fase 3: "Fixed, sticky e quem fica por cima" (Loja Retrô Vinil).
 *
 * O QUE ENSINA: position: fixed (gruda na JANELA, não no pai), position:
 * sticky (normal até um limite, depois gruda) e z-index (decide quem
 * fica por cima quando duas peças se sobrepõem).
 *
 * ORDEM: guiado com o botão "Voltar ao topo" em fixed (contraste direto
 * com absolute da Fase 2: fixed ignora qualquer ancestral e sempre olha
 * para a janela); previsão sobre sticky no cabeçalho; sozinho resolve um
 * conflito real de sobreposição com z-index (o selo e a fita do primeiro
 * card, os dois absolute, brigando pelo canto).
 *
 * REVISÃO ESPAÇADA: position: absolute (Fase 2) contrastado com fixed.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_RETRO_VINIL } from "./sites/lojaRetroVinil";

export const FASE_L4_F3: FasePratica = {
  id: "sites-layout-u4-f3",
  tipo: "pratica",
  unidadeId: "sites-layout-u4",
  titulo: "Fixed, sticky e quem fica por cima",
  conceitos: ["position-fixed", "position-sticky", "z-index-css"],
  revisa: ["position-absolute"],
  prerequisitos: ["position-css", "position-relative", "position-absolute"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Faltam dois valores de position, e uma última pergunta: quando duas peças se sobrepõem, quem fica em cima?",
      expressao: "curioso",
    },
  ],
  siteAlvo: LOJA_RETRO_VINIL,
  objetivos: [
    {
      id: "botao-vira-fixed",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Dê position: fixed, bottom: 16px e right: 16px ao botão Voltar ao topo (.topo).",
        toque: "Dê position: fixed, bottom: 16px e right: 16px ao botão Voltar ao topo (.topo).",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".topo", propriedade: "position", valor: "fixed" },
          { tipo: "valorEfetivo", seletor: ".topo", propriedade: "bottom", valor: "16px" },
          { tipo: "valorEfetivo", seletor: ".topo", propriedade: "right", valor: "16px" },
        ],
      },
      ajudas: {
        pergunta: "Diferente de absolute (que olha para o pai relative), existe um position que sempre olha para a JANELA inteira?",
        dica: "position: fixed. bottom e right dizem a distância dos cantos da janela, não de nenhum pai.",
        linha: { alvo: "arvore", seletor: ".topo", fala: "É este botão, .topo, dentro do main." },
        solucao: {
          fala: "Dei position: fixed, bottom: 16px e right: 16px ao botão: ele gruda no canto da tela, e rola a página que ele fica ali.",
          acoes: [
            { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "position", valor: "fixed" },
            { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "bottom", valor: "16px" },
            { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "right", valor: "16px" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Fixed ignora qualquer pai: ele sempre se ancora na janela do navegador, mesmo dentro de um card relative.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "position", valor: "fixed" },
        { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "bottom", valor: "16px" },
        { tipo: "definirPropriedade", seletorRegra: ".topo", propriedade: "right", valor: "16px" },
      ],
    },
    {
      id: "cabecalho-vira-sticky",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você der position: sticky; top: 0 ao cabeçalho, o que acontece ao rolar a página para baixo?",
        opcoes: [
          "Ele já nasce grudado no topo, desde o início, como o fixed",
          "Ele desaparece assim que a rolagem começa",
          "Ele fica no lugar normal até a rolagem alcançá-lo, e então gruda no topo",
        ],
        correta: 2,
        explicacao: "sticky se comporta como normal (static) até a rolagem chegar no limite (top: 0); só então ele gruda, como um fixed.",
      },
      enunciado: {
        mouse: "Confira: dê position: sticky e top: 0 ao cabeçalho (#cabecalho).",
        toque: "Confira: dê position: sticky e top: 0 ao cabeçalho (#cabecalho).",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: "#cabecalho", propriedade: "position", valor: "sticky" },
          { tipo: "valorEfetivo", seletor: "#cabecalho", propriedade: "top", valor: "0" },
        ],
      },
      ajudas: {
        pergunta: "Qual position é um meio-termo entre normal e fixed, grudando só depois de um limite?",
        dica: "position: sticky, com top: 0 (o limite: quando o topo do cabeçalho tocar o topo da tela).",
        linha: { alvo: "estilos", seletorRegra: "#cabecalho", fala: "Acrescente position: sticky e top: 0 nesta regra, #cabecalho." },
        solucao: {
          fala: "Acrescentei position: sticky e top: 0: agora o cabeçalho gruda no topo quando a rolagem alcança ele.",
          acoes: [
            { tipo: "definirPropriedade", seletorRegra: "#cabecalho", propriedade: "position", valor: "sticky" },
            { tipo: "definirPropriedade", seletorRegra: "#cabecalho", propriedade: "top", valor: "0" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "sticky é o meio-termo: normal até certo ponto, fixed depois. Ótimo para cabeçalhos e filtros.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "definirPropriedade", seletorRegra: "#cabecalho", propriedade: "position", valor: "sticky" },
        { tipo: "definirPropriedade", seletorRegra: "#cabecalho", propriedade: "top", valor: "0" },
      ],
    },
    {
      id: "selo-por-cima-da-fita",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O selo Promoção e a fita Últimas unidades estão sobrepostos, e a fita ficou por cima. Dê z-index: 2 ao selo para ele passar na frente.",
        toque: "O selo Promoção e a fita Últimas unidades estão sobrepostos, e a fita ficou por cima. Dê z-index: 2 ao selo para ele passar na frente.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".selo", propriedade: "z-index", valor: "2" },
      ajudas: {
        pergunta: "Qual declaração decide quem fica por cima quando duas peças se sobrepõem?",
        dica: "z-index. O número maior fica por cima; sem ele, quem vem depois no código vence.",
      },
      falaAoConcluir: {
        texto: "O selo passou na frente da fita! z-index resolve qualquer empate de sobreposição.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "z-index", valor: "2" }],
    },
  ],
  conclusao: [
    {
      texto: "fixed gruda na janela, sticky é o meio-termo, e z-index resolve quem fica por cima. Os cinco valores de position, completos!",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, cabeçalhos fixos, botões flutuantes e menus sobrepostos usam exatamente essas três ideias.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, role a página até o fim e veja se algum cabeçalho ou botão fica grudado (fixed ou sticky) no Styles.",
  falaFinal: { texto: "Hora do desafio final da zona Layout: uma confeitaria precisa de você!", expressao: "feliz" },
};
