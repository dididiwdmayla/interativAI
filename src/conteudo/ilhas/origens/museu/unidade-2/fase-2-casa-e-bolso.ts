/* Sala 2, fase 2: do chip ao bolso. A ordem e as plaquinhas do "o que mudou". */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { eventos } from "./eventos";

export const FASE_ORIGENS_U2_F2: Fase = {
  id: "origens-museu-u2-f2",
  tipo: "pratica",
  unidadeId: "origens-museu-u2",
  titulo: "Do chip ao bolso",
  conceitos: ["computador-pessoal", "web"],
  revisa: ["historia-da-computacao", "transistor"],
  prerequisitos: ["historia-da-computacao"],
  usaFerramentas: ["linha-do-tempo-museu"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "engrenagens",
    placa: {
      titulo: "A família cresce",
      texto: "Do chip dos anos 1970 ao celular no bolso: cada geração ficou menor, mais barata e mais perto das pessoas.",
    },
    falas: {
      abrir: "Agora a parte da família que eu não cheguei a conhecer! Eles vieram muito depois de mim, e são bem menores.",
      porEtapa: {
        "pc-e-web": "O chip já está no começo. Quem veio depois dele: o computador de casa ou a web?",
        "web-celular": "E a internet no bolso? Pensa bem: o celular de hoje precisa de quê para abrir uma página?",
        "plaquinha-tear": "Na outra linha, as plaquinhas estão soltas. Cada uma conta o que alguém mudou. Começa pela minha velha amiga tecelã.",
        "plaquinhas-sozinho": "Agora completa a linha e pendura cada plaquinha no dono certo.",
      },
      concluir: "Que família! Eu era só um sonho no papel, e olha onde a gente chegou.",
    },
    estacoes: [
      { id: "linha-novos", tipo: "linha-do-tempo", titulo: "Do chip ao bolso", eventos: eventos("chip", "pc", "web", "celular", "ia"), fixos: ["chip"] },
      { id: "linha-mudou", tipo: "linha-do-tempo", titulo: "O que cada um mudou", eventos: eventos("tear", "valvulas", "pc", "celular"), fixos: ["tear", "pc"], plaquinhas: true },
    ],
  },
  introducao: [
    { texto: "Na sala 2 continua a história! Agora os parentes que cabem na mesa, no colo e no bolso.", expressao: "apontando" },
    { texto: "Ah, e eu tenho uma surpresa para quem terminar esta sala. Lá no fim do corredor.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "pc-e-web",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ponha o computador pessoal e a web na linha, depois do microprocessador, na ordem certa.",
        toque: "Ponha o computador pessoal e a web na linha, depois do microprocessador, na ordem certa.",
      },
      validador: { tipo: "linhaEmOrdem", estacao: "linha-novos", eventos: ["chip", "pc", "web"] },
      ajudas: {
        pergunta: "Para abrir uma página da web, a pessoa precisava ter o quê em casa?",
        dica: "O computador pessoal levou a máquina para as casas. A web veio depois, ligando esses computadores com páginas e links.",
        linha: { alvo: "exposicao", estacao: "linha-novos", peca: "pc", fala: "Este é o computador pessoal: ele vem logo depois do chip." },
        solucao: {
          fala: "Pus o computador pessoal logo depois do chip, e a web depois dele.",
          acoes: [
            { tipo: "porNaLinha", estacao: "linha-novos", evento: "pc", posicao: 1 },
            { tipo: "porNaLinha", estacao: "linha-novos", evento: "web", posicao: 2 },
          ],
        },
      },
      falaAoConcluir: { texto: "Primeiro o computador chegou em casa. Depois, as casas se ligaram pela web!", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "porNaLinha", estacao: "linha-novos", evento: "pc" },
        { tipo: "porNaLinha", estacao: "linha-novos", evento: "web" },
      ],
    },
    {
      id: "web-celular",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora confira: ponha o smartphone e a IA no fim da linha.",
        toque: "Agora confira: ponha o smartphone e a IA no fim da linha.",
      },
      previsao: {
        pergunta: "O que veio primeiro: a web ou o smartphone?",
        opcoes: ["A web", "O smartphone", "Os dois juntos"],
        correta: 0,
        explicacao: "A web se espalhou nos anos 1990. O smartphone se popularizou no fim dos anos 2000 e levou a web para o bolso.",
      },
      validador: { tipo: "linhaEmOrdem", estacao: "linha-novos" },
      ajudas: {
        pergunta: "O smartphone abre páginas da web. Dá para abrir uma página antes de a web existir?",
        dica: "O smartphone juntou o computador e a web num aparelho de bolso. A IA que conversa é a mais nova da família.",
        linha: { alvo: "exposicao", estacao: "linha-novos", peca: "celular", fala: "O smartphone vem depois da web." },
        solucao: {
          fala: "Pus o smartphone depois da web, e a IA por último.",
          acoes: [
            { tipo: "porNaLinha", estacao: "linha-novos", evento: "celular", posicao: 3 },
            { tipo: "porNaLinha", estacao: "linha-novos", evento: "ia", posicao: 4 },
          ],
        },
      },
      falaAoConcluir: { texto: "Do chip à IA, em ordem! E cada um precisou de quem veio antes.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "porNaLinha", estacao: "linha-novos", evento: "celular" },
        { tipo: "porNaLinha", estacao: "linha-novos", evento: "ia" },
      ],
    },
    {
      id: "plaquinha-tear",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Na linha do que cada um mudou, clique na plaquinha certa e pendure ela no tear.",
        toque: "Na linha do que cada um mudou, toque na plaquinha certa e pendure ela no tear.",
      },
      validador: { tipo: "plaquinhasCertas", estacao: "linha-mudou", eventos: ["tear"] },
      ajudas: {
        pergunta: "O tear mudou o quê: o jeito de contar, de tecer ou de seguir ordens?",
        dica: "Cada plaquinha conta o que um parente mudou no mundo. O tear foi a primeira máquina a seguir ordens guardadas em cartões.",
        linha: { alvo: "exposicao", estacao: "linha-mudou", peca: "tear", fala: "Este é o tear: a plaquinha dele fala de cartões." },
        solucao: {
          fala: "Pendurei no tear a plaquinha das instruções guardadas em cartões.",
          acoes: [{ tipo: "pendurarPlaquinha", estacao: "linha-mudou", evento: "tear", plaquinha: "tear" }],
        },
      },
      falaAoConcluir: { texto: "Isso! Seguir instruções guardadas: é o que todo programa faz até hoje.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "pendurarPlaquinha", estacao: "linha-mudou", evento: "tear", plaquinha: "tear" }],
    },
    {
      id: "plaquinhas-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Complete a linha com os cartões que faltam e pendure cada plaquinha no parente certo.",
        toque: "Complete a linha com os cartões que faltam e pendure cada plaquinha no parente certo.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "linhaEmOrdem", estacao: "linha-mudou" },
          { tipo: "plaquinhasCertas", estacao: "linha-mudou" },
        ],
      },
      ajudas: {
        pergunta: "Quem ficou do tamanho de uma sala, quem chegou em casa e quem foi parar no bolso?",
        dica: "Primeiro a ordem: válvulas antes do computador de casa, e o celular por último. Depois, uma plaquinha por parente.",
      },
      falaAoConcluir: { texto: "Linha completa e cada um com a sua história! A família agradece.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "porNaLinha", estacao: "linha-mudou", evento: "valvulas", posicao: 1 },
        { tipo: "porNaLinha", estacao: "linha-mudou", evento: "celular" },
        { tipo: "pendurarPlaquinha", estacao: "linha-mudou", evento: "valvulas", plaquinha: "valvulas" },
        { tipo: "pendurarPlaquinha", estacao: "linha-mudou", evento: "pc", plaquinha: "pc" },
        { tipo: "pendurarPlaquinha", estacao: "linha-mudou", evento: "celular", plaquinha: "celular" },
      ],
    },
  ],
  conclusao: [
    { texto: "O computador pessoal levou a máquina para casa. A web ligou as casas. O celular pôs tudo no bolso.", expressao: "apontando" },
    { texto: "A web é o que você mexe na Ilha Sites: páginas ligadas por links, abertas num navegador.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Pergunte a alguém mais velho da sua família qual foi o primeiro computador ou celular que essa pessoa usou, e o que dava para fazer com ele. Ponha essa história na sua linha do tempo.",
  falaFinal: { texto: "Falta pouco para a surpresa do fim do corredor. Bora pro desafio da sala 2!", expressao: "comemorando" },
};
