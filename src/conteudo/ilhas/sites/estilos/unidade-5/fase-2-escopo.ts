/*
 * E5, Fase 2: "Uma variável só numa parte" (o alcance/escopo).
 *
 * O QUE ENSINA: uma variável não precisa morar no :root. Declarada numa
 * regra qualquer, ela só vale NAQUELA peça e em quem está dentro dela
 * (herança), sem afetar o resto da página. É a mesma herança da E4
 * ("Por que minha regra não pega?"), aplicada a variáveis.
 *
 * ORDEM: 1) guiado, previsão sobre o alcance (ataca a confusão "toda
 * variável é global, como no :root da fase anterior"), depois criar uma
 * regra nova que redeclara --cor-texto só dentro de .fala; 2) guiado,
 * repete numa peça diferente (.mascote); 3) sozinho, numa terceira
 * (.painel).
 *
 * SITE-ALVO: SITE_ALVO_DO_JOGO, como a Fase 1.
 *
 * VALIDADOR: `variavelCss` com `seletor` (não o :root) confere que a
 * variável foi declarada (ou herdada) naquele elemento — regra nova é o
 * caminho natural, mas o validador aceita qualquer um.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_ALVO_DO_JOGO } from "@/motor/siteDoJogo";

export const FASE_E5_F2: FasePratica = {
  id: "sites-estilos-u5-f2",
  tipo: "pratica",
  unidadeId: "sites-estilos-u5",
  titulo: "Uma variável só numa parte",
  conceitos: ["escopo-de-variavel"],
  revisa: ["heranca-css", "regra-nova"],
  prerequisitos: ["variavel-css"],
  usaFerramentas: ["arvore", "painel-estilos", "nova-regra", "editar-valor-css", "seletor-de-cor"],
  paineisElementos: ["estilos"],
  siteAlvo: SITE_ALVO_DO_JOGO,
  introducao: [
    { texto: "Na fase passada, toda variável morava no :root e valia a página inteira. Mas não precisa ser assim.", expressao: "curioso" },
    { texto: "Uma variável declarada dentro de uma regra só vale ali e em quem está dentro dela, como qualquer herança.", expressao: "pensativo" },
  ],
  objetivos: [
    {
      id: "previsao-alcance",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se eu declarar --cor-texto de novo, mas só dentro da regra .fala (a caixa de texto do computadorzinho), o resto da página muda de cor de texto também?",
        opcoes: ["Sim, --cor-texto é sempre global", "Não: só o texto de dentro de .fala usa esse valor novo", "Não muda nem o texto de .fala, porque já tinha cor herdada"],
        correta: 1,
        explicacao: "Uma variável se comporta como qualquer declaração herdável: quem está DENTRO de .fala vê o valor novo; o resto da página continua com o do :root.",
      },
      enunciado: {
        mouse: "Confira: crie uma regra nova para .fala com --cor-texto num valor diferente.",
        toque: "Confira: crie uma regra nova para .fala com --cor-texto num valor diferente.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-texto", seletor: ".fala", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Como criar uma regra nova para uma peça, sem precisar dela estar selecionada numa regra já existente?",
        dica: "Selecione a fala do computadorzinho na árvore e use o botão de regra nova no painel Estilos; escreva --cor-texto: valor dentro dela.",
        linha: { alvo: "ferramenta", ferramenta: "nova-regra", fala: "Este botão cria uma regra nova para a peça selecionada." },
        solucao: {
          fala: "Criei a regra .fala com --cor-texto num tom diferente: só o balão de fala usa esse valor.",
          acoes: [{ tipo: "selecionar", seletor: ".fala" }, { tipo: "adicionarRegra", seletorRegra: ".fala", declaracoes: [{ propriedade: "--cor-texto", valor: "#3b2f2f" }] }],
        },
      },
      falaAoConcluir: { texto: "Isso! O resto da página nem sentiu: a variável só existe (com esse valor novo) dentro de .fala.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "selecionar", seletor: ".fala" },
        { tipo: "adicionarRegra", seletorRegra: ".fala", declaracoes: [{ propriedade: "--cor-texto", valor: "#3b2f2f" }] },
      ],
    },
    {
      id: "escopo-mascote",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Faça o mesmo com o computadorzinho inteiro: uma regra nova para .mascote com --cor-borda diferente.",
        toque: "Faça o mesmo com o computadorzinho inteiro: uma regra nova para .mascote com --cor-borda diferente.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-borda", seletor: ".mascote", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Qual peça é o computadorzinho inteiro (a moldura, a fala e os botões juntos)?",
        dica: "A classe .mascote. Selecione ela, regra nova, e escreva --cor-borda: valor.",
        linha: { alvo: "estilos", seletorRegra: ".mascote", fala: "Selecione o computadorzinho e use o botão de regra nova aqui." },
        solucao: {
          fala: "Criei a regra .mascote com --cor-borda num tom novo: a borda do computadorzinho mudou, o resto não.",
          acoes: [{ tipo: "selecionar", seletor: ".mascote" }, { tipo: "adicionarRegra", seletorRegra: ".mascote", declaracoes: [{ propriedade: "--cor-borda", valor: "#7c3aed" }] }],
        },
      },
      falaAoConcluir: { texto: "De novo, só ali. Duas peças, duas variáveis locais, sem misturar uma com a outra.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: ".mascote" },
        { tipo: "adicionarRegra", seletorRegra: ".mascote", declaracoes: [{ propriedade: "--cor-borda", valor: "#7c3aed" }] },
      ],
    },
    {
      id: "escopo-painel",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: uma regra para .painel (a caixa com a árvore) com --cor-painel diferente.",
        toque: "Agora sozinho: uma regra para .painel (a caixa com a árvore) com --cor-painel diferente.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-painel", seletor: ".painel", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Qual variável dá o fundo do painel com a árvore, e em qual classe ela mora agora?",
        dica: "Regra nova para .painel, com --cor-painel: valor dentro.",
      },
      falaAoConcluir: { texto: "Três peças, três alcances diferentes. Você escolhe se a variável é do jogo inteiro ou só de um cantinho.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: ".painel" },
        { tipo: "adicionarRegra", seletorRegra: ".painel", declaracoes: [{ propriedade: "--cor-painel", valor: "#0b1220" }] },
      ],
    },
  ],
  conclusao: [
    { texto: "Variável no :root é global; variável numa regra é só dali para dentro. A mesma herança de sempre.", expressao: "feliz" },
    { texto: "Falta uma coisa: guardar essas cores todas como um tema de verdade, para usar sempre que abrir o jogo.", expressao: "curioso" },
  ],
  missaoDeCampo: "No F12 de um site de verdade, ache uma variável declarada FORA do :root (numa classe qualquer) na aba Styles. Ela só vale dentro daquela peça.",
  falaFinal: { texto: "Próxima fase: salvar as cores como o seu Meu tema.", expressao: "feliz" },
};
