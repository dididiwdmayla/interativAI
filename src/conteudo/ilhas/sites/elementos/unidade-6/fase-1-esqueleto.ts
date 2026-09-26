/*
 * Unidade 6, Fase 1: "O esqueleto: head e body".
 *
 * O QUE ENSINA: a estrutura de um documento (doctype, html, head e body,
 * que já existem mesmo com a página "em branco"), a diferença entre head
 * (bastidor, não aparece na tela) e body (o que aparece) e o title (o nome
 * da aba, que mora no head). É a primeira fase do jogo em `modoDocumento`:
 * o editor mostra a página inteira, e a árvore começa no <html>.
 *
 * ORDEM: primeiro ESCREVER algo que aparece (o h1 no body, resultado bem
 * visível), depois PREVER que a mesma coisa escrita no head NÃO aparece
 * (ataca de frente a confusão "para no head ou no body, tanto faz": o
 * title muda só a aba), por fim o sozinho generaliza a escrita no body com
 * mais duas peças novas (parágrafo e link), numa tacada só.
 *
 * REVISÃO ESPAÇADA: escrever uma tag à mão exercita "tag" (Unidade 1) sem
 * o apoio da árvore; o link do objetivo 3 revisita "link-href" (Unidade 4).
 *
 * CONFUSÃO ATACADA: "tanto faz escrever no head ou no body" — a previsão do
 * objetivo 2 mostra que o head é bastidor (só muda a aba) e o body é palco.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_CARTAZ_EM_BRANCO } from "./sites/cartazFeiraDeTalentos";

export const FASE_U6_F1: FasePratica = {
  id: "sites-elementos-u6-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u6",
  titulo: "O esqueleto: head e body",
  conceitos: ["estrutura-do-documento", "head-vs-body", "title"],
  revisa: ["tag", "link-href"],
  prerequisitos: ["elemento", "tag"],
  usaFerramentas: ["editor"],
  modoDocumento: true,
  siteAlvo: SITE_CARTAZ_EM_BRANCO,

  introducao: [
    { texto: "Bem-vindo à última unidade da zona Elementos! Desta vez a página começa em branco: só o esqueleto.", expressao: "feliz" },
    { texto: "Doctype, html, head e body já existem, mesmo vazios. Agora é você quem escreve tudo o que entra neles.", expressao: "curioso" },
    { texto: "Vamos montar o cartaz da Feira de Talentos da escola. Bora escrever a primeira linha?", expressao: "apontando" },
  ],

  objetivos: [
    {
      id: "titulo-no-body",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "No editor, escreva <h1>Feira de Talentos</h1> dentro do body.",
        toque: "No editor, escreva <h1>Feira de Talentos</h1> dentro do body.",
      },
      validador: { tipo: "textoIgual", seletor: "h1", valor: "Feira de Talentos" },
      ajudas: {
        pergunta: "Que tag mostra o título mais importante de uma página?",
        dica: "h1 é o título principal. Escreva a tag de abertura, o texto e a tag de fechamento.",
        linha: { alvo: "arvore", seletor: "body", fala: "O body está vazio: é bem aqui dentro que o h1 vai entrar." },
        solucao: {
          fala: "Escrevi <h1>Feira de Talentos</h1> dentro do body: ele virou o título visível da página.",
          acoes: [{ tipo: "inserirHTML", seletor: "body", posicao: "fim", html: "<h1>Feira de Talentos</h1>" }],
        },
      },
      falaAoConcluir: { texto: "Isso! Seu primeiro título apareceu na tela: o body é o que vira página.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "body", posicao: "fim", html: "<h1>Feira de Talentos</h1>" }],
    },
    {
      id: "title-no-head",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você escrever <title>Feira de Talentos</title> dentro do head, esse texto aparece no meio da página?",
        opcoes: ["Sim, no topo da página", "Não, só na aba do navegador", "Sim, mas em letra bem pequena"],
        correta: 1,
        explicacao: "O head guarda informação sobre a página; o title só troca o nome da aba, nunca o que aparece no body.",
      },
      enunciado: {
        mouse: "Agora confira: escreva <title>Feira de Talentos</title> dentro do head e veja a aba mudar.",
        toque: "Agora confira: escreva <title>Feira de Talentos</title> dentro do head e veja a aba mudar.",
      },
      validador: { tipo: "tituloDaAba", valor: "Feira de Talentos" },
      ajudas: {
        pergunta: "Qual peça do head vira o nome da aba do navegador?",
        dica: "É o texto do title, dentro do head.",
        linha: { alvo: "arvore", seletor: "head", fala: "É aqui dentro, no head, vazio por enquanto." },
        solucao: {
          fala: "Escrevi <title>Feira de Talentos</title> no head: a aba mudou, e a página visível continuou igual.",
          acoes: [{ tipo: "inserirHTML", seletor: "head", posicao: "fim", html: "<title>Feira de Talentos</title>" }],
        },
      },
      falaAoConcluir: { texto: "Viu? A aba mudou, mas nada novo apareceu na tela. Head é bastidor; body é palco.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "inserirHTML", seletor: "head", posicao: "fim", html: "<title>Feira de Talentos</title>" },
      ],
    },
    {
      id: "aviso-e-link",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: 'No body, acrescente um parágrafo "Inscrições até sexta-feira!" e um link: <a href="https://exemplo.site/inscricao">Inscreva-se aqui</a>.',
        toque: 'No body, acrescente um parágrafo "Inscrições até sexta-feira!" e um link: <a href="https://exemplo.site/inscricao">Inscreva-se aqui</a>.',
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "textoIgual", seletor: "p", valor: "Inscrições até sexta-feira!" },
          { tipo: "existe", seletor: 'a[href="https://exemplo.site/inscricao"]' },
        ],
      },
      ajudas: {
        pergunta: "Que tag escreve um parágrafo, e qual cria um link?",
        dica: "p é parágrafo; a com href cria o link. As duas entram dentro do body, junto com o h1.",
      },
      falaAoConcluir: { texto: "Aviso e link no ar! Cada peça nova é só mais uma tag dentro do body.", expressao: "comemorando" },
      solucaoDeTeste: [
        {
          tipo: "inserirHTML",
          seletor: "body",
          posicao: "fim",
          html: '<p>Inscrições até sexta-feira!</p><a href="https://exemplo.site/inscricao">Inscreva-se aqui</a>',
        },
      ],
    },
  ],

  conclusao: [
    { texto: "Uma página do zero já tem título na aba, um h1, um aviso e um link. Nada mau para começar!", expressao: "comemorando" },
    { texto: "No F12 de verdade, a aba Elements sempre mostra doctype, head e body, mesmo numa página quase em branco.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Abra um site de verdade, aperte F12 e ache o head na aba Elements. Ache o title dentro dele e compare com o nome da aba.",

  falaFinal: { texto: "Na próxima fase: os acentos e mais uma peça nova do head. Até já!", expressao: "feliz" },
};
