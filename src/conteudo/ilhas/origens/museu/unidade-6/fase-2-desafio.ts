/* Sala 6, desafio: quem programa o quê, e o que tem código. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

const ligar = (estacao: string, cartao: string, alvo: string) => ({ tipo: "ligarCartao", estacao, cartao, alvo }) as const;

export const FASE_ORIGENS_U6_F2: Fase = {
  id: "origens-museu-u6-f2",
  tipo: "desafio",
  unidadeId: "origens-museu-u6",
  titulo: "Quem programa o quê",
  conceitos: ["software-embarcado", "carreiras-em-programacao"],
  revisa: ["front-e-back", "sistema-operacional"],
  prerequisitos: ["software-embarcado"],
  usaFerramentas: ["cartoes-de-ligar"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "celular",
    placa: {
      titulo: "As profissões da rua",
      texto: "Cada programa da cidade tem gente por trás. Uns cuidam da tela, outros do servidor, dos dados, da segurança ou dos aparelhos.",
    },
    falas: {
      abrir: "Último desafio. Quem programa o quê? E o que tem código? Vai.",
      porEtapa: {
        quem: "Cada um no seu caminho. Bom.",
        "tem-codigo": "Cadeira não tem programa. Maquininha tem. Certo.",
      },
      concluir: "Museu completo. Nova mensagem: você conhece a família. Abre o corredor.",
    },
    estacoes: [
      {
        id: "quem",
        tipo: "ligar",
        titulo: "Quem programa?",
        pergunta: "Quem cuida de cada um destes programas?",
        alvos: [
          { id: "front-end", nome: "Front-end", descricao: "A tela que a gente toca" },
          { id: "back-end", nome: "Back-end", descricao: "O servidor, nos fundos" },
          { id: "dados", nome: "Dados", descricao: "Números que viram previsão" },
          { id: "seguranca", nome: "Segurança", descricao: "Proteger contra quem quer entrar" },
          { id: "embarcado", nome: "Software embarcado", descricao: "O programa dentro do aparelho" },
        ],
        cartoes: [
          { id: "tela-app", texto: "A tela do app do banco", alvo: "front-end", revela: "Botões, cores e animações: front-end." },
          { id: "saldo", texto: "O servidor que guarda o saldo de todo mundo", alvo: "back-end", revela: "Contas e regras ficam nos fundos: back-end." },
          { id: "previsao", texto: "A previsão de quando o ônibus chega", alvo: "dados", revela: "Muitas viagens antigas viram uma previsão boa: dados." },
          { id: "golpe", texto: "Bloquear o cartão depois de três senhas erradas", alvo: "seguranca", revela: "Pensar no que um golpista tentaria: segurança." },
          { id: "freio", texto: "O freio automático do carro", alvo: "embarcado", revela: "Um computador pequeno dentro do carro: embarcado." },
        ],
      },
      {
        id: "tem-codigo",
        tipo: "ligar",
        titulo: "Tem código?",
        pergunta: "Qual destes tem um programa dentro?",
        alvos: [
          { id: "tem", nome: "Tem programa dentro" },
          { id: "nao-tem", nome: "Não tem programa" },
        ],
        cartoes: [
          { id: "micro-ondas", texto: "O micro-ondas", alvo: "tem", revela: "O relógio, o tempo e o bipe: um programa pequeno." },
          { id: "cadeira", texto: "Uma cadeira de madeira", alvo: "nao-tem", revela: "Só madeira e prego. Nenhum programa." },
          { id: "maquininha", texto: "A maquininha de cartão", alvo: "tem", revela: "Lê o cartão, pede a senha e fala com o banco." },
          { id: "bicicleta", texto: "Uma bicicleta comum", alvo: "nao-tem", revela: "Pedal, corrente e roda. A elétrica já teria programa." },
          { id: "catraca", texto: "A catraca do ônibus", alvo: "tem", revela: "Lê o cartão de passagem e libera a volta." },
        ],
      },
    ],
  },
  introducao: [
    { texto: "Desafio da última sala! Ligue cada programa a quem cuida dele, e descubra o que tem código.", expressao: "apontando" },
    { texto: "Se travar, o Rever leva você de volta à rua.", expressao: "feliz" },
  ],
  partes: [
    {
      id: "quem",
      descricao: "Ligar cada programa da cidade a quem cuida dele",
      validador: { tipo: "cartoesLigados", estacao: "quem" },
      revisarEm: "origens-museu-u6-f1",
      solucaoDeTeste: [
        ligar("quem", "tela-app", "front-end"),
        ligar("quem", "saldo", "back-end"),
        ligar("quem", "previsao", "dados"),
        ligar("quem", "golpe", "seguranca"),
        ligar("quem", "freio", "embarcado"),
      ],
    },
    {
      id: "tem-codigo",
      descricao: "Separar o que tem programa dentro do que não tem",
      validador: { tipo: "cartoesLigados", estacao: "tem-codigo" },
      revisarEm: "origens-museu-u6-f1",
      solucaoDeTeste: [
        ligar("tem-codigo", "micro-ondas", "tem"),
        ligar("tem-codigo", "cadeira", "nao-tem"),
        ligar("tem-codigo", "maquininha", "tem"),
        ligar("tem-codigo", "bicicleta", "nao-tem"),
        ligar("tem-codigo", "catraca", "tem"),
      ],
    },
  ],
  conclusao: [
    { texto: "Você terminou o museu inteiro! Do tear de cartões ao celular, e de volta para a rua.", expressao: "comemorando" },
    { texto: "Volte ao corredor: o seu lugar na árvore da família ganhou uma coisa nova.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Abra a tela de Profissões do jogo e escolha a que mais combina com você hoje. Depois pergunte a alguém da família qual programa da rua ele usa mais.",
  falaFinal: { texto: "Corre pro corredor! A família inteira quer te ver.", expressao: "comemorando" },
};
