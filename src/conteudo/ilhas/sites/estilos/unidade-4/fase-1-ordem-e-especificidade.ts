/*
 * E4, Fase 1: "Ordem e especificidade" (loja Corda & Nota).
 *
 * O QUE ENSINA: que várias regras podem mirar a mesma peça (cascata), que
 * a ORDEM só desempata quando a especificidade é igual, e que um seletor
 * com id sempre vence um de classe, que sempre vence um só de tag —
 * mesmo escrito antes no arquivo.
 *
 * A folha foi escrita de propósito na ordem ERRADA pra confundir quem
 * pensa "a última regra sempre vence": #topo (mais específico) vem ANTES
 * de h1 no arquivo, mas #topo vence assim mesmo.
 *
 * ORDEM: 1) previsão (a confusão de leigo do mapa: "a última regra do
 * arquivo sempre vence"), confirmada pela riscada no painel; 2) guiado, a
 * correção pelo jeito certo: editar a regra que ESTÁ vencendo, não criar
 * outra; 3) sozinho, o mesmo problema (classe vencendo duas tags) no h2.
 *
 * REVISÃO ESPAÇADA: seletor de id (E2) e seletor de classe (E2) na
 * própria explicação da especificidade.
 *
 * CONFUSÃO ATACADA: "a última regra do arquivo sempre vence" — a
 * previsão do objetivo 1 mostra que a ordem só decide quando a
 * especificidade empata.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_CORDA_E_NOTA } from "./sites/lojaCordaENota";

export const FASE_E4_F1: FasePratica = {
  id: "sites-estilos-u4-f1",
  tipo: "pratica",
  unidadeId: "sites-estilos-u4",
  titulo: "Ordem e especificidade",
  conceitos: ["cascata-css", "ordem-das-regras", "especificidade-css"],
  revisa: ["seletor-de-id", "seletor-de-classe"],
  prerequisitos: ["regra-e-declaracao", "seletor-de-tag"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],

  introducao: [
    { texto: "Bem-vindo à loja Corda & Nota! O título está dourado, mas o dono jura que escreveu color: blue no h1.", expressao: "curioso" },
    { texto: "Isso é cascata: várias regras miram a mesma peça, e uma regra só vence de verdade.", expressao: "pensativo" },
  ],

  siteAlvo: LOJA_CORDA_E_NOTA,
  objetivos: [
    {
      id: "quem-vence-o-h1",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "No arquivo, a regra #topo (dourado) vem ANTES da regra h1 (azul). Qual cor vence?",
        opcoes: [
          "Azul, porque h1 é a última regra do arquivo",
          "Dourado, porque #topo é mais específico que h1",
          "As duas se misturam num tom intermediário",
        ],
        correta: 1,
        explicacao: "Um seletor com id sempre vence um seletor só de tag, não importa qual foi escrito primeiro no arquivo.",
      },
      enunciado: {
        mouse: "Confira: selecione o h1 e veja qual declaração de color fica riscada no painel.",
        toque: "Confira: selecione o h1 e veja qual declaração de color fica riscada no painel.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "selecionado", seletor: "h1" },
          { tipo: "riscada", seletor: "h1", propriedade: "color", seletorRegra: "h1" },
        ],
      },
      ajudas: {
        pergunta: "Qual das duas regras tem o seletor mais específico: #topo ou h1?",
        dica: "Id vale mais que tag. A regra h1 perde e fica riscada, mesmo vindo depois no arquivo.",
        linha: { alvo: "arvore", seletor: "h1", fala: "Selecione este h1 e olhe o painel Estilos ao lado." },
        solucao: {
          fala: "Selecionei o h1: a regra #topo vence (dourado) e a regra h1 (azul) fica riscada.",
          acoes: [{ tipo: "selecionar", seletor: "h1" }],
        },
      },
      falaAoConcluir: {
        texto: "Isso! #topo vence porque tem id, mesmo escrita antes. Ordem só desempata especificidade igual.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "selecionar", seletor: "h1" },
      ],
    },
    {
      id: "consertar-o-topo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Pra deixar o título realmente azul, edite a regra que está VENCENDO: troque o color de #topo pra blue.",
        toque: "Pra deixar o título realmente azul, edite a regra que está VENCENDO: troque o color de #topo pra blue.",
      },
      validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "color", valor: "blue" },
      ajudas: {
        pergunta: "Editar a regra h1 (que já está perdendo) muda alguma coisa na tela?",
        dica: "Não adianta mexer em quem perde. O jeito certo é editar #topo, a regra que vence de verdade.",
        linha: { alvo: "estilos", seletorRegra: "#topo", propriedade: "color", fala: "É aqui: a declaração color da regra #topo." },
        solucao: {
          fala: "Troquei o color de #topo pra blue: agora o h1 fica azul de verdade, porque #topo é quem manda.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "#topo", propriedade: "color", valor: "blue" }],
        },
      },
      falaAoConcluir: {
        texto: "Azul de verdade! Quando uma regra não pega, o primeiro passo é achar quem está vencendo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "#topo", propriedade: "color", valor: "blue" }],
    },
    {
      id: "consertar-o-titulo-da-secao",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O mesmo problema acontece com o h2: a regra .titulo-secao vence a regra main h2. Edite a que vence pra deixar o h2 #3d348b.",
        toque: "O mesmo problema acontece com o h2: a regra .titulo-secao vence a regra main h2. Edite a que vence pra deixar o h2 #3d348b.",
      },
      validador: { tipo: "valorEfetivo", seletor: "h2", propriedade: "color", valor: "#3d348b" },
      ajudas: {
        pergunta: "Uma classe (0,1,0) e duas tags (0,0,2): qual especificidade é maior?",
        dica: "Classe vence duas tags juntas. Edite .titulo-secao, não main h2.",
      },
      falaAoConcluir: {
        texto: "De novo, editar quem vence resolveu na hora! Especificidade não depende de quantos seletores você usa, e sim do tipo deles.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".titulo-secao", propriedade: "color", valor: "#3d348b" }],
    },
  ],

  conclusao: [
    { texto: "Cascata, ordem e especificidade: agora você sabe achar quem realmente manda numa peça.", expressao: "comemorando" },
    { texto: "No F12 de verdade, o painel Styles sempre risca quem perde. É o primeiro lugar pra olhar.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, ache uma peça com mais de uma regra no painel Styles e veja qual está riscada. Repare se quem vence tem id, classe ou só tag.",

  falaFinal: { texto: "Na próxima fase: herança e aquele !important que ninguém devia usar.", expressao: "curioso" },
};
