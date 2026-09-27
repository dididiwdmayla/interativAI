/*
 * L1, Fase 1: "Block ocupa a linha toda" (Papelaria Ponto de Luz).
 *
 * O QUE ENSINA: o que é `display` (a propriedade que decide como a caixa
 * de um elemento ocupa espaço) e o valor `block`, que faz a caixa tomar a
 * linha toda e empurrar o que vem depois para baixo.
 *
 * ORDEM: primeiro OLHAR o valor de display de uma peça pequena (a
 * etiqueta "Novidade", que é um span: por padrão, inline) no painel
 * Estilos; depois PREVER o que muda se ela virar block (a confusão de
 * leigo é achar que só troca de posição, sem crescer). O sozinho repete a
 * troca para block noutra peça (o "Chegou!" dos brindes), sem o painel
 * apontar o caminho.
 *
 * FERRAMENTAS: painel Estilos e editar valor já foram apresentados na E1;
 * aqui só usam, sem apresentar de novo.
 *
 * REVISÃO ESPAÇADA: selecionar pela árvore (U1) no objetivo 1 e
 * background-color (E1) já presente no CSS inicial, para o jogador
 * enxergar a caixa mudando de forma, não só ler o texto "block" no painel.
 *
 * CONFUSÃO ATACADA: "display só muda a posição" — a previsão mostra que
 * `block` faz a caixa crescer até a borda e empurrar o texto seguinte.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { PAPELARIA_PONTO_DE_LUZ } from "./sites/papelariaPontoDeLuz";

export const FASE_L1_F1: FasePratica = {
  id: "sites-layout-u1-f1",
  tipo: "pratica",
  unidadeId: "sites-layout-u1",
  titulo: "Block ocupa a linha toda",
  conceitos: ["display-css", "display-block"],
  revisa: ["selecionar-pela-arvore", "cor-de-fundo"],
  prerequisitos: ["regra-e-declaracao", "elemento"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Bem-vindo à zona Layout! Aqui a gente decide como cada peça ocupa espaço na página.",
      expressao: "feliz",
    },
    {
      texto: "Toda peça tem um display: block, inline, inline-block ou none. Ele decide o formato da caixa dela.",
      expressao: "curioso",
    },
    {
      texto: "A Papelaria Ponto de Luz precisa de ajuda para organizar o layout. Vamos começar pelo básico?",
      expressao: "apontando",
    },
  ],
  siteAlvo: PAPELARIA_PONTO_DE_LUZ,
  objetivos: [
    {
      id: "ver-display-da-etiqueta",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique no span com a etiqueta 'Novidade' na árvore e olhe o valor de display dele no painel Estilos.",
        toque: "Toque no span com a etiqueta 'Novidade' na árvore e depois em Estilos.",
      },
      validador: { tipo: "selecionado", seletor: ".etiqueta" },
      ajudas: {
        pergunta: "Qual peça mostra o texto 'Novidade' logo depois da frase de boas-vindas?",
        dica: "É um span, uma peça pequena que fica no meio do texto. O painel Estilos mostra o display dela na folha do navegador.",
        linha: { alvo: "arvore", seletor: ".etiqueta", fala: "É este span aqui, com a class etiqueta." },
        solucao: {
          fala: "Selecionei o span. No painel, a folha do navegador mostra display: inline: é o padrão de um span.",
          acoes: [{ tipo: "selecionar", seletor: ".etiqueta" }],
        },
      },
      falaAoConcluir: {
        texto: "Viu? display: inline vem da folha do navegador, sem regra nenhuma do site. Todo span nasce assim.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "selecionar", seletor: ".etiqueta" }],
    },
    {
      id: "etiqueta-vira-block",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você trocar o display do span .etiqueta de inline para block, o que acontece com a caixa dele?",
        opcoes: [
          "Nada muda, só o texto do painel",
          "A caixa cresce até a borda da página e o que vem depois desce",
          "A caixa fica menor, só do tamanho da letra N",
        ],
        correta: 1,
        explicacao: "block faz a caixa ocupar a linha toda (a largura do pai) e empurra o próximo conteúdo para baixo.",
      },
      enunciado: {
        mouse: "Confira: no painel Estilos, mude o display de .etiqueta para block.",
        toque: "Confira: no painel Estilos, mude o display de .etiqueta para block.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".etiqueta", propriedade: "display", valor: "block" },
      ajudas: {
        pergunta: "No painel Estilos, qual declaração da regra .etiqueta decide o formato da caixa?",
        dica: "display é a declaração. Clique no valor 'inline' e escreva 'block' no lugar.",
        linha: { alvo: "estilos", seletorRegra: ".etiqueta", propriedade: "display", fala: "É aqui: a declaração display, dentro da regra .etiqueta." },
        solucao: {
          fala: "Troquei display para block na regra .etiqueta: a caixa vermelha agora ocupa a linha toda.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".etiqueta", propriedade: "display", valor: "block" }],
        },
      },
      falaAoConcluir: {
        texto: "Isso! A caixa cresceu até a borda e o texto de baixo desceu. block é assim: a linha toda é dele.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".etiqueta", propriedade: "display", valor: "block" },
      ],
    },
    {
      id: "chegou-vira-block",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Faça o 'Chegou!' dos brindes ocupar a linha própria também: mude o display de .chegou para block.",
        toque: "Faça o 'Chegou!' dos brindes ocupar a linha própria também: mude o display de .chegou para block.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".chegou", propriedade: "display", valor: "block" },
      ajudas: {
        pergunta: "Qual regra veste o span 'Chegou!' da seção Brindes?",
        dica: "É a mesma ideia de antes, numa peça diferente: troque o display dela para block.",
      },
      falaAoConcluir: {
        texto: "De novo! Duas caixas viraram block: cada uma tomou a linha inteira para si.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".chegou", propriedade: "display", valor: "block" }],
    },
  ],
  conclusao: [
    {
      texto: "Você já sabe o que é display e viu o block em ação: a caixa cresce e empurra tudo pra baixo.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade é o mesmo painel Styles, com o mesmo display: block, inline, inline-block e mais.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Abra o F12 num site de verdade, selecione um link (a) e veja no Styles que o display dele é inline. Compare com um título (h1): block.",
  falaFinal: { texto: "Próxima fase: inline-block, que junta um pouco dos dois.", expressao: "feliz" },
};
