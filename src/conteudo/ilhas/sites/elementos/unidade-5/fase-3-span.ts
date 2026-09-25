/*
 * Unidade 5, Fase 3: "Span: a div do meio da frase".
 *
 * O QUE ENSINA: span é a versão em linha da div — uma marcação sem
 * significado, só um gancho de estilo dentro de um texto. Revisita direto
 * a lição da Unidade 3 (strong vs b): o preço em negrito não é
 * "importante de verdade", é só um destaque visual, então não é strong.
 *
 * REVISÃO ESPAÇADA: ênfase forte (Unidade 3) volta explicitamente: o
 * jogador precisa perceber que NÃO é o caso de usar strong.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, ação: troca o b do preço (no primeiro card) para span,
 *    entendendo por que não é strong.
 * 2. Sozinho: a mesma troca no preço do segundo card.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_OFICINA } from "./sites/oficinaRodaLivre";

export const FASE_U5_F3: FasePratica = {
  id: "sites-elementos-u5-f3",
  tipo: "pratica",
  unidadeId: "sites-elementos-u5",
  titulo: "Span: a div do meio da frase",
  conceitos: ["span-generico"],
  revisa: ["enfase-forte"],
  prerequisitos: ["tag", "selecionar-pela-arvore"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "renomear-tag"],
  siteAlvo: SITE_OFICINA,

  introducao: [
    { texto: "Section e article já estão certos! Falta um detalhe: o preço, ainda em negrito de mentirinha.", expressao: "feliz" },
    { texto: "Você lembra de strong e b? Pois tem uma terceira opção, pra quando NENHUM dos dois serve.", expressao: "pensativo" },
    { texto: "Vamos conhecer o span: a div de dentro da frase.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "preco-vira-span",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O preço da revisão está em b. Ele não é 'importante de verdade' (não é strong): troque para span.",
        toque: "O preço da revisão está em b. Ele não é 'importante de verdade' (não é strong): troque para span.",
      },
      validador: { tipo: "tag", seletor: "#servico-revisao .preco", nome: "span" },
      ajudas: {
        pergunta: "Um leitor de tela precisa avisar 'isso é importante' quando chega nesse preço, ou é só um destaque visual?",
        dica: "Se não é strong (importância) nem em (tom), e ainda assim você quer marcar um pedacinho do texto pra estilizar, use span: ele não diz nada, só dá um gancho.",
        linha: { alvo: "arvore", seletor: "#servico-revisao .preco", fala: "Esse é o preço, ainda em b. Dois cliques no nome da tag trocam para span." },
        solucao: {
          fala: "Troquei o b por span: o preço continua destacado pelo CSS, mas agora a tag não finge um significado que não existe.",
          acoes: [{ tipo: "renomearTag", seletor: "#servico-revisao .preco", novaTag: "span" }],
        },
      },
      falaAoConcluir: { texto: "Isso! span é a caixa neutra de dentro do texto, assim como div é a de fora.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#servico-revisao .preco", novaTag: "span" }],
    },
    {
      id: "span-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Faça o mesmo com o preço do outro serviço.",
        toque: "Faça o mesmo com o preço do outro serviço.",
      },
      validador: { tipo: "tag", seletor: "#servico-pintura .preco", nome: "span" },
      ajudas: {
        pergunta: "Esse preço também é importante de verdade, ou só um destaque visual?",
        dica: "Mesma regra: se é só estilo, sem significado, é span.",
      },
      falaAoConcluir: { texto: "Perfeito! Os dois preços agora usam a tag certa, sem fingir importância.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#servico-pintura .preco", novaTag: "span" }],
    },
  ],

  conclusao: [
    { texto: "Agora você tem as duas caixas neutras: div por fora, span por dentro do texto.", expressao: "comemorando" },
    { texto: "No F12 de verdade, span é a tag mais usada pra pintar um pedacinho de texto sem mudar seu significado.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e ache um span. Veja se ele só está lá para receber um estilo, sem significado próprio.",

  falaFinal: {
    texto: "Resumo da unidade: div e span não dizem nada; header, footer, section, article e as demais contam uma história.",
    expressao: "curioso",
  },
};
