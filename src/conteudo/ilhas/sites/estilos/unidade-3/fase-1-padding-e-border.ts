/*
 * E3, Fase 1: "Padding e border" (Confeitaria Doce Encanto).
 *
 * O QUE ENSINA: o modelo de caixa (conteúdo, padding, border e margin, de
 * dentro pra fora) pela aba Calculado e o diagrama, e as duas primeiras
 * camadas: padding (o espaço DENTRO da caixa) e border (a linha ao redor
 * dela). As ferramentas painel-calculado e modelo-de-caixa são
 * apresentadas juntas, no primeiro objetivo: o jogador olha o diagrama
 * ANTES de mexer em qualquer coisa, com os bolos ainda colados na borda.
 *
 * ORDEM: 1) guiado, padding (o texto encostado na borda é o problema mais
 * visível); 2) guiado, border (a caixa ainda não tem moldura nenhuma); 3)
 * sozinho, padding de novo, situação nova (o aviso de domingo).
 *
 * REVISÃO ESPAÇADA: regra e declaração (E1) e seletor de classe (E2), nas
 * tarefas novas.
 *
 * CONFUSÃO ATACADA (preparação): esta fase só mexe pra DENTRO da caixa
 * (padding, border). A Fase 2 contrasta com o margin, que empurra pra
 * FORA — por isso aqui ainda não existe nenhum espaço entre os bolos.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { CONFEITARIA_DOCE_ENCANTO } from "./sites/confeitariaDoceEncanto";

export const FASE_E3_F1: FasePratica = {
  id: "sites-estilos-u3-f1",
  tipo: "pratica",
  unidadeId: "sites-estilos-u3",
  titulo: "Padding e border",
  conceitos: ["modelo-de-caixa", "padding-css", "border-css"],
  revisa: ["regra-e-declaracao", "seletor-de-classe"],
  prerequisitos: ["regra-e-declaracao", "cor-de-fundo"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css", "painel-calculado", "modelo-de-caixa"],
  paineisElementos: ["estilos", "calculado"],

  introducao: [
    { texto: "Bem-vinda à Confeitaria Doce Encanto! Os bolos estão com o texto colado na borda: hora do modelo de caixa.", expressao: "feliz" },
    { texto: "Toda peça é uma caixa com camadas: conteúdo, padding, border e margin, de dentro pra fora. Vamos ver isso de verdade.", expressao: "curioso" },
  ],

  siteAlvo: CONFEITARIA_DOCE_ENCANTO,
  objetivos: [
    {
      id: "respiro-no-bolo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Selecione um bolo (.bolo) e dê um respiro ao texto: acrescente padding: 16px na regra .bolo.",
        toque: "Toque num bolo (.bolo) e dê um respiro ao texto: acrescente padding: 16px na regra .bolo.",
      },
      apresentar: ["painel-calculado", "modelo-de-caixa"],
      validador: { tipo: "valorEfetivo", seletor: ".bolo", propriedade: "padding", valor: "16px" },
      ajudas: {
        pergunta: "Qual camada da caixa fica ENTRE o conteúdo e a borda?",
        dica: "É o padding. Uma declaração nova na regra .bolo empurra o conteúdo pra dentro.",
        linha: { alvo: "estilos", seletorRegra: ".bolo", fala: "Aqui na regra .bolo: acrescente a declaração de padding." },
        solucao: {
          fala: "Acrescentei padding: 16px na regra .bolo: o texto ganhou respiro dos quatro lados.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".bolo", propriedade: "padding", valor: "16px" }],
        },
      },
      falaAoConcluir: {
        texto: "Olha o diagrama no Calculado: a camada de padding apareceu ao redor do conteúdo!",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".bolo", propriedade: "padding", valor: "16px" }],
    },
    {
      id: "moldura-no-bolo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Dê uma moldura ao bolo: acrescente border: 2px solid #f2a65a na regra .bolo.",
        toque: "Dê uma moldura ao bolo: acrescente border: 2px solid #f2a65a na regra .bolo.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".bolo", propriedade: "border-width", valor: "2px" },
          { tipo: "valorEfetivo", seletor: ".bolo", propriedade: "border-style", valor: "solid" },
          { tipo: "valorEfetivo", seletor: ".bolo", propriedade: "border-color", valor: "#f2a65a" },
        ],
      },
      ajudas: {
        pergunta: "Qual camada fica ao REDOR do padding, como uma moldura?",
        dica: "É a border: espessura, estilo (solid) e cor, os três de uma vez, separados por espaço.",
        linha: { alvo: "estilos", seletorRegra: ".bolo", fala: "Mais uma declaração aqui na regra .bolo: a border." },
        solucao: {
          fala: "Acrescentei border: 2px solid #f2a65a: agora o bolo tem uma moldura ao redor do padding.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".bolo", propriedade: "border", valor: "2px solid #f2a65a" }],
        },
      },
      falaAoConcluir: {
        texto: "Moldura pronta! No diagrama, a camada de border apareceu entre o padding e a margin.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".bolo", propriedade: "border", valor: "2px solid #f2a65a" }],
    },
    {
      id: "respiro-no-aviso",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O aviso de domingo (.aviso) também está com o texto colado na moldura da caixa dele. Dê um padding de 12px.",
        toque: "O aviso de domingo (.aviso) também está com o texto colado na moldura da caixa dele. Dê um padding de 12px.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".aviso", propriedade: "padding", valor: "12px" },
      ajudas: {
        pergunta: "Qual declaração dá respiro ao conteúdo, de dentro da caixa?",
        dica: "O padding, na regra .aviso.",
      },
      falaAoConcluir: {
        texto: "Padding em outra peça, sozinha! Toda caixa CSS aceita as mesmas quatro camadas.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "padding", valor: "12px" }],
    },
  ],

  conclusao: [
    { texto: "Padding e border prontos! A caixa dos bolos já não engole mais o próprio texto.", expressao: "comemorando" },
    { texto: "No F12 de verdade, a aba Computed mostra esse mesmo diagrama, com as medidas reais da peça.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, selecione uma peça no F12 e abra a aba Computed. Ache o diagrama e aponte o padding e a border dela.",

  falaFinal: { texto: "Na próxima fase: o margin, que empurra pra FORA da caixa. E uma pegadinha de largura.", expressao: "curioso" },
};
