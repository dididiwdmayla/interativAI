/*
 * L4, Fase 2: "Absolute: gruda no canto do pai certo" (Loja Retrô Vinil).
 *
 * O QUE ENSINA: position: absolute e o ancestral mais próximo com
 * position diferente de static (aqui, o .card relative da Fase 1).
 *
 * ORDEM: guiado dando position: relative ao .card (a âncora, revisão
 * direta da Fase 1, numa peça nova: o card, não o texto); previsão sobre
 * ONDE o selo absolute vai se ancorar (a confusão: achar que é sempre a
 * tela inteira); sozinho repete a dupla no segundo card.
 *
 * REVISÃO ESPAÇADA: position: relative (Fase 1), agora como âncora, não
 * como deslize.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_RETRO_VINIL } from "./sites/lojaRetroVinil";

export const FASE_L4_F2: FasePratica = {
  id: "sites-layout-u4-f2",
  tipo: "pratica",
  unidadeId: "sites-layout-u4",
  titulo: "Absolute: gruda no canto do pai certo",
  conceitos: ["position-absolute"],
  revisa: ["position-relative"],
  prerequisitos: ["position-css", "position-relative"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "O selo de Promoção está solto, dentro do card, sem destaque. Vamos grudá-lo no canto?",
      expressao: "curioso",
    },
  ],
  siteAlvo: LOJA_RETRO_VINIL,
  objetivos: [
    {
      id: "card-vira-ancora",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Dê position: relative ao card (a regra .card), para ele virar a âncora do selo.",
        toque: "Dê position: relative ao card (a regra .card), para ele virar a âncora do selo.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".card", propriedade: "position", valor: "relative" },
      ajudas: {
        pergunta: "Antes de grudar o selo no canto, o card precisa virar a referência. Qual position faz isso, sem mover nada?",
        dica: "position: relative, na regra .card. Lembra da Fase 1: sozinho, ele não move nada.",
        linha: { alvo: "arvore", seletor: ".card", fala: "É este card, o pai do selo e da fita." },
        solucao: {
          fala: "Dei position: relative ao .card: nada mudou na tela, mas agora ele é uma referência para os filhos.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".card", propriedade: "position", valor: "relative" }],
        },
      },
      falaAoConcluir: {
        texto: "O card virou a âncora. Ele nem precisou de top ou left: só o relative já basta para isso.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".card", propriedade: "position", valor: "relative" }],
    },
    {
      id: "selo-vira-absolute",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você der position: absolute; top: 8px; right: 8px ao selo, em relação a QUEM ele vai se posicionar?",
        opcoes: [
          "Sempre em relação à tela inteira, não importa onde ele esteja",
          "Em relação ao card (o ancestral mais próximo com position diferente de static)",
          "Em relação ao body, sempre",
        ],
        correta: 1,
        explicacao: "absolute se ancora no ancestral mais PRÓXIMO que tem position diferente de static. Sem nenhum, aí sim seria a página toda.",
      },
      enunciado: {
        mouse: "Confira: dê position: absolute, top: 8px e right: 8px ao selo.",
        toque: "Confira: dê position: absolute, top: 8px e right: 8px ao selo.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".selo", propriedade: "position", valor: "absolute" },
          { tipo: "valorEfetivo", seletor: ".selo", propriedade: "top", valor: "8px" },
          { tipo: "valorEfetivo", seletor: ".selo", propriedade: "right", valor: "8px" },
        ],
      },
      ajudas: {
        pergunta: "Quais três declarações grudam o selo no canto superior direito do card?",
        dica: "position: absolute, top: 8px e right: 8px, na regra .selo.",
        linha: { alvo: "estilos", seletorRegra: ".selo", fala: "Acrescente as três declarações nesta regra, .selo." },
        solucao: {
          fala: "Acrescentei position: absolute, top: 8px e right: 8px: o selo grudou no canto do CARD, não da tela.",
          acoes: [
            { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "position", valor: "absolute" },
            { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "top", valor: "8px" },
            { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "right", valor: "8px" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Perfeito! O selo saiu do fluxo (o texto de baixo subiu) e grudou no canto do card, sua âncora.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "position", valor: "absolute" },
        { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "top", valor: "8px" },
        { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "right", valor: "8px" },
      ],
    },
    {
      id: "selo-topo-vira-absolute",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "No segundo card, faça o mesmo com o selo Novo (.selo-topo): position: absolute, top: 8px, right: 8px.",
        toque: "No segundo card, faça o mesmo com o selo Novo (.selo-topo): position: absolute, top: 8px, right: 8px.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".selo-topo", propriedade: "position", valor: "absolute" },
          { tipo: "valorEfetivo", seletor: ".selo-topo", propriedade: "top", valor: "8px" },
          { tipo: "valorEfetivo", seletor: ".selo-topo", propriedade: "right", valor: "8px" },
        ],
      },
      ajudas: {
        pergunta: "Quais três declarações grudam o selo Novo no canto do SEU card (que também já é relative)?",
        dica: "position: absolute, top: 8px e right: 8px, na regra .selo-topo.",
      },
      falaAoConcluir: {
        texto: "Os dois selos grudados, cada um no canto do seu próprio card!",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".selo-topo", propriedade: "position", valor: "absolute" },
        { tipo: "definirPropriedade", seletorRegra: ".selo-topo", propriedade: "top", valor: "8px" },
        { tipo: "definirPropriedade", seletorRegra: ".selo-topo", propriedade: "right", valor: "8px" },
      ],
    },
  ],
  conclusao: [
    {
      texto: "relative no pai, absolute no filho: a dupla clássica para grudar um selo no canto de um card.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, quase todo selo, balão ou contador de notificação usa exatamente essa dupla.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, ache um selo ou contador grudado no canto de algo e veja no Styles qual é o ancestral relative dele.",
  falaFinal: { texto: "Próxima fase: o que gruda na tela mesmo quando a página rola.", expressao: "feliz" },
};
