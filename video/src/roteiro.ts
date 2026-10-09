/*
 * O roteiro do vídeo de apresentação: fonte única de tempos, falas, tomadas,
 * músicas e efeitos. As composições (src/composicoes) só desenham o que está
 * aqui; o ROTEIRO.md, o .srt e as vozes saem deste arquivo
 * (scripts/vozes.mjs, scripts/roteiro-md.mjs, scripts/finalizar.mjs).
 *
 * Só dados e contas: nada de React aqui (os scripts de Node importam este arquivo).
 * Tempos em segundos. Dentro de um bloco, tudo é relativo ao começo do bloco.
 * Onde há música, as durações são contadas em batidas da faixa do bloco
 * (src/dados/batidas.json, gerado por scripts/batidas.mjs), para os cortes
 * caírem no tempo.
 */
import batidas from "./dados/batidas.json";

export const FPS = 30;

export type Expressao = "feliz" | "curioso" | "pensativo" | "apontando" | "comemorando" | "preocupado" | "dormindo";
export type IdMusica = "mapa" | "sites" | "logica" | "origens";

/** Duração de `n` batidas da faixa, em segundos. */
export const bat = (musica: IdMusica, n: number): number => Number((batidas[musica].batida * n).toFixed(4));

/* ------------------------------------------------------------------ */
/* Falas do computadorzinho                                            */
/* ------------------------------------------------------------------ */

export type ParteDeVoz = { id: string; texto: string; expressao: Expressao };
export type Fala = {
  texto: string;
  /** A expressão do computadorzinho enquanto fala (e o humor da voz de modem). */
  expressao: Expressao;
  /** Quando a fala muda de humor no meio: cada parte vira um arquivo de voz, uma atrás da outra. */
  vozes?: ParteDeVoz[];
};

export const FALAS = {
  oi: { texto: "Oi. Quer ver um truque?", expressao: "feliz" },
  f12: { texto: "Aperta F12.", expressao: "apontando" },
  pronto: { texto: "Pronto. Esse site agora é seu.", expressao: "comemorando" },
  qualquer: { texto: "Isso funciona em qualquer site. De verdade.", expressao: "curioso" },
  ilhas: { texto: "Cada ilha é um pedaço do ofício.", expressao: "feliz" },
  madrugada: { texto: "Estuda de madrugada? O mundo também.", expressao: "curioso" },
  mexe: { texto: "Aqui você não decora. Você mexe e vê.", expressao: "feliz" },
  vitrine: { texto: "Seu código acende a vitrine da padaria.", expressao: "comemorando" },
  cliente: { texto: "Cliente de mentirinha. Problema de verdade.", expressao: "curioso" },
  errou: {
    texto: "Errou? Ótimo. A gente pausa e investiga.",
    expressao: "preocupado",
    vozes: [
      { id: "errou-1", texto: "Errou?", expressao: "preocupado" },
      { id: "errou-2", texto: "Ótimo. A gente pausa e investiga.", expressao: "feliz" },
    ],
  },
  familia: { texto: "Essa é a minha família.", expressao: "feliz" },
  python: { texto: "E sim: Python rodando de verdade, no navegador.", expressao: "comemorando" },
  travou: { texto: "Travou? Eu pergunto antes de entregar a resposta.", expressao: "pensativo" },
  segredo: { texto: "Tem um tema secreto escondido. Boa sorte.", expressao: "curioso" },
  construindo: { texto: "Ainda estou construindo o resto do mundo.", expressao: "apontando" },
  ia: { texto: "Inclusive a ilha onde você aprende a revisar código de IA.", expressao: "curioso" },
  vez: { texto: "Sua vez.", expressao: "comemorando" },
} as const satisfies Record<string, Fala>;

export type IdFala = keyof typeof FALAS;

/** Tempo mínimo do balão na tela: 0,35 s por palavra + 1 s. */
export function tempoDoBalao(texto: string): number {
  return Number((texto.trim().split(/\s+/).length * 0.35 + 1).toFixed(2));
}

/* ------------------------------------------------------------------ */
/* A lista de objetivos da "Fase 0"                                    */
/* ------------------------------------------------------------------ */

export const TITULO_DA_FASE = "Fase 0: Conhecer o InterativAI";
export const OBJETIVOS = [
  "Mexer num site de verdade",
  "Conhecer o mundo",
  "Deixar uma página com a sua cara",
  "Programar a vitrine de uma padaria",
  "Visitar o museu",
  "Começar a sua jornada",
] as const;

export const ENDERECO = "interativ-ai.vercel.app";
export const LINK_FINAL = `<a href="https://${ENDERECO}">Começar a sua jornada</a>`;
export const TITULO = "InterativAI";
export const CHAMADA = ["Aprenda programação jogando.", "Do zero ao código de verdade."] as const;
export const CONVITE = ["Comece pelo navegador.", "Sem instalar nada."] as const;
export const ASSINATURA = "Feito com o próprio InterativAI.";
export const ILHAS_CHEGANDO = [
  { id: "paginas-vivas", nome: "Páginas vivas" },
  { id: "rede-servidor", nome: "Rede e Servidor" },
  { id: "python", nome: "Python" },
  { id: "ia", nome: "IA" },
  { id: "oficio", nome: "Ofício" },
] as const;

/* ------------------------------------------------------------------ */
/* Tomadas, cortes e câmera                                            */
/* ------------------------------------------------------------------ */

export type IdTomada =
  | "T01-sites-u1"
  | "T02-mundo-dia"
  | "T03-mundo-noite"
  | "T04-ilha-sites"
  | "T05-estilos-cor"
  | "T06-flexbox"
  | "T07-console"
  | "T08-padaria-vitrine"
  | "T09-contrato-cliente"
  | "T10-depurador"
  | "T11-museu-corredor"
  | "T12-comparador"
  | "T13-mesa-de-cores"
  | "T14-glossario"
  | "T15-profissoes"
  | "T16-lente-tema"
  | "T17-troca-tema"
  | "T18-em-construcao"
  | "V01-sites-u1-celular"
  | "V02-mundo-celular"
  | "V03-padaria-celular"
  | "V04-museu-celular"
  // Tomadas dos curtos (src/curtos/roteiro.ts):
  | "V05-estilos-celular"
  | "V06-chamado-celular"
  | "V07-mundo-noite-celular"
  | "V08-insignias-celular"
  | "V09-vitrine-de-perto"
  | "F01-missao-fliperama"
  | "F02-luta-fliperama"
  | "F03-mundo-fliperama"
  | "F04-museu-fliperama"
  | "F05-python-fliperama"
  | "F06-insignias-fliperama";

/** Um instante da tomada: em segundos, ou relativo a uma marca do take.json. */
export type Instante = number | { marca: string; mais?: number };

/** Uma área, em px da página gravada (as mesmas unidades das caixas do take.json). */
export type Area = { x: number; y: number; l: number; a: number };

/**
 * Para onde a câmera olha: o quadro inteiro, uma caixa registrada no take.json
 * (pelo nome) ou uma área em px da página. `zoom` limita a aproximação
 * (o teto geral é 1,8x no 16:9); `margem` é a folga em volta, em px do vídeo.
 */
export type Foco = { tudo: true; zoom?: number; cx?: number; cy?: number } | { caixa: string; zoom?: number; margem?: number } | { area: Area; zoom?: number; margem?: number };

/** A câmera chega em `foco` no instante `em` (relativo ao corte), saindo `leva` segundos antes. */
export type QuadroDaCamera = { em: number; foco: Foco; leva?: number };

export type Corte = {
  tomada: IdTomada;
  /** Começo do corte no bloco. */
  em: number;
  duracao: number;
  /** Onde a tomada começa a tocar. */
  de: Instante;
  velocidade?: number;
  camera?: QuadroDaCamera[];
  /** Desenha o cursor (ou o dedo) a partir do take.json. Padrão: sim. */
  cursor?: boolean;
  /** Toca os sons de clique e de tecla dos eventos do take.json. */
  sons?: boolean;
  /** Começa com o mergulho na tela do computadorzinho. */
  mergulho?: boolean;
  /** Palavra grande que entra junto com o corte (bloco Sites). */
  palavra?: string;
  /** Um anel pulsando em volta de uma caixa do take.json, a partir de `de` (s do corte). */
  realce?: { caixa: string; de: number };
  /** No 9:16: a tomada de computador aparece num cartão, com este recorte (px da página). */
  recorte?: Area;
  /** No cartão do mundo (9:16): a linha diagonal troca o dia (T02) pela noite (T03) em `em` (s do corte). */
  viraNoite?: { em: number; dura: number };
};

export type IdEfeito =
  | "boot"
  | "acordar"
  | "dormir"
  | "entrar-mapa"
  | "viagem-ilha"
  | "abrir-museu"
  | "insignia"
  | "desbloqueio"
  | "fase-concluida"
  | "unidade-concluida"
  // Sintetizados pelas receitas do jogo (scripts/vozes.mjs):
  | "sint-acerto"
  | "sint-clique"
  | "sint-tecla-enter"
  | "sint-inspecionar";

export type Efeito = { id: IdEfeito; em: number; volume?: number };
export type FalaNoBloco = { fala: IdFala; em: number; /** Troca de expressão no meio da fala. */ depois?: { em: number; expressao: Expressao } };

export type IdBloco = "abertura" | "truque" | "titulo" | "mundo" | "sites" | "logica" | "origens" | "tudo-o-mais" | "chegando" | "convite" | "pos-creditos";

export type Bloco = {
  id: IdBloco;
  titulo: string;
  duracao: number;
  /** A música do bloco (a da ilha que está na tela). null: sem música. */
  musica: IdMusica | null;
  /** De onde a faixa toca no começo do bloco (s). Sem isto, continua de onde estava ou entra do zero. */
  musicaDe?: number;
  falas: FalaNoBloco[];
  efeitos: Efeito[];
  cortes: Corte[];
  /** O objetivo da Fase 0 marcado neste bloco (índice em OBJETIVOS) e quando. `lado`: onde a lista abre no 16:9 (padrão: à direita). */
  objetivo?: { indice: number; em: number; lado?: "esquerda" | "direita" };
  /** Quando o bloco marca mais de um objetivo (a edição 9:16 junta Sites e Lógica num bloco). */
  maisObjetivos?: { indice: number; em: number }[];
  /** Um trecho do bloco em que a pílula da lista sai da frente (ela cobriria o que a câmera mostra no canto). */
  semLista?: { de: number; ate: number };
  /** Instantes do bloco que as composições usam pelo nome. */
  momentos?: Record<string, number>;
};

/* ------------------------------------------------------------------ */
/* Versão 16:9                                                         */
/* ------------------------------------------------------------------ */

const S = (n: number) => bat("sites", n);
const L = (n: number) => bat("logica", n);
const O = (n: number) => bat("origens", n);
const M = (n: number) => bat("mapa", n);

export const BLOCOS_169: Bloco[] = [
  {
    id: "abertura",
    titulo: "Abertura",
    duracao: 6.2,
    musica: null,
    momentos: { linha: 0.45, abre: 1.05, monitor: 1.25, acorda: 2.55, lista: 3.6 },
    efeitos: [
      { id: "boot", em: 0.15, volume: 0.9 },
      { id: "acordar", em: 2.5 },
    ],
    falas: [{ fala: "oi", em: 3.35 }],
    cortes: [],
  },
  {
    id: "truque",
    titulo: "O truque",
    duracao: 15.5,
    musica: null,
    momentos: { tecla: 0.2, aperto: 1.25, mergulho: 1.7, volta: 11.3 },
    efeitos: [{ id: "sint-tecla-enter", em: 1.25, volume: 1 }],
    falas: [
      { fala: "f12", em: 0.3 },
      { fala: "pronto", em: 8.2 },
      { fala: "qualquer", em: 12.0 },
    ],
    objetivo: { indice: 0, em: 8.15 },
    cortes: [
      {
        tomada: "T01-sites-u1",
        em: 1.7,
        duracao: 5.69,
        de: 0.6,
        velocidade: 1.6,
        mergulho: true,
        sons: true,
        camera: [
          { em: 0, foco: { tudo: true } },
          { em: 2.05, foco: { tudo: true } },
          { em: 2.8, foco: { caixa: "no", zoom: 1.8 }, leva: 0.7 },
        ],
      },
      {
        tomada: "T01-sites-u1",
        em: 7.39,
        duracao: 3.91,
        de: 9.7,
        velocidade: 1,
        sons: true,
        camera: [
          { em: 0, foco: { caixa: "no", zoom: 1.8 } },
          { em: 0.5, foco: { caixa: "caixa:manchete-nova", zoom: 1.8 }, leva: 0.45 },
          { em: 2.7, foco: { caixa: "caixa:manchete-nova", zoom: 1.8 } },
          { em: 3.75, foco: { tudo: true }, leva: 0.9 },
        ],
      },
    ],
  },
  {
    id: "titulo",
    titulo: "Título",
    duracao: M(8),
    musica: "mapa",
    musicaDe: 0,
    momentos: { sinais: 0.05, encaixe: 0.62, nome: 0.7, chamada: 1.55, numeros: 2.7 },
    efeitos: [{ id: "sint-acerto", em: 0.62, volume: 0.8 }],
    falas: [],
    cortes: [],
  },
  {
    id: "mundo",
    titulo: "O mundo",
    duracao: M(21),
    musica: "mapa",
    momentos: { virada: M(11), viradaDura: 0.8, parou: 10.05 },
    efeitos: [{ id: "entrar-mapa", em: 0 }],
    falas: [
      { fala: "ilhas", em: 0.9 },
      { fala: "madrugada", em: M(11) + 0.15 },
    ],
    objetivo: { indice: 1, em: 10.3 },
    cortes: [
      {
        tomada: "T02-mundo-dia",
        em: 0,
        duracao: M(21),
        de: { marca: "rolar", mais: -2 },
        mergulho: true,
        cursor: false,
        camera: [
          { em: 0, foco: { tudo: true } },
          { em: M(21), foco: { tudo: true, zoom: 1.06, cy: 0.56 }, leva: M(21) - 1 },
        ],
      },
    ],
  },
  {
    id: "sites",
    titulo: "Sites",
    duracao: S(24),
    musica: "sites",
    musicaDe: 0,
    efeitos: [{ id: "viagem-ilha", em: -0.25 }],
    falas: [{ fala: "mexe", em: 3.1 }],
    objetivo: { indice: 2, em: 5.45 },
    cortes: [
      {
        tomada: "T04-ilha-sites",
        em: 0,
        duracao: S(5),
        de: { marca: "parou", mais: -S(5) * 2 - 0.1 },
        velocidade: 2,
        mergulho: true,
        cursor: false,
        palavra: "HTML.",
        camera: [{ em: 0, foco: { tudo: true, zoom: 1.08, cy: 0.56 } }],
      },
      {
        tomada: "T05-estilos-cor",
        em: S(5),
        duracao: S(6),
        de: 2.75,
        velocidade: 1.35,
        palavra: "CSS.",
        camera: [
          { em: 0, foco: { area: { x: 400, y: 70, l: 1190, a: 460 } } },
          { em: S(6), foco: { area: { x: 420, y: 70, l: 1170, a: 420 } }, leva: S(6) },
        ],
      },
      {
        tomada: "T06-flexbox",
        em: S(11),
        duracao: S(6),
        de: 3.3,
        velocidade: 1.6,
        sons: true,
        palavra: "Flexbox.",
        camera: [
          { em: 0, foco: { area: { x: 400, y: 100, l: 1190, a: 470 } } },
          { em: 1.9, foco: { area: { x: 400, y: 100, l: 1190, a: 470 } } },
          { em: 2.4, foco: { area: { x: 560, y: 130, l: 1030, a: 430 } }, leva: 0.5 },
        ],
      },
      {
        tomada: "T04-ilha-sites",
        em: S(17),
        duracao: S(3),
        de: { marca: "clique-na-unidade", mais: -0.2 },
        palavra: "Grid.",
        camera: [
          { em: 0, foco: { tudo: true, zoom: 1.15, cx: 0.52, cy: 0.56 } },
          { em: 1.1, foco: { caixa: "card", zoom: 1.6, margem: 140 }, leva: 0.5 },
        ],
      },
      {
        tomada: "T04-ilha-sites",
        em: S(20),
        duracao: S(4),
        de: { marca: "publicar", mais: 0.15 },
        velocidade: 2,
        cursor: false,
        palavra: "Publicar.",
        camera: [{ em: 0, foco: { tudo: true, zoom: 1.4, cx: 0.34, cy: 0.41 } }],
      },
    ],
  },
  {
    id: "logica",
    titulo: "Lógica",
    duracao: L(24),
    musica: "logica",
    musicaDe: 0,
    efeitos: [{ id: "viagem-ilha", em: -0.25 }],
    falas: [
      { fala: "vitrine", em: L(4) + 0.25 },
      { fala: "cliente", em: L(12) + 0.2 },
      { fala: "errou", em: L(17) + 0.35, depois: { em: 0.95, expressao: "feliz" } },
    ],
    objetivo: { indice: 3, em: 4.2, lado: "esquerda" },
    cortes: [
      {
        tomada: "T07-console",
        em: 0,
        duracao: L(4),
        de: 1.5,
        velocidade: 1.25,
        mergulho: true,
        sons: true,
        camera: [
          { em: 0, foco: { tudo: true } },
          { em: 1.2, foco: { area: { x: 10, y: 60, l: 620, a: 330 }, zoom: 1.8 }, leva: 0.55 },
        ],
      },
      {
        tomada: "T08-padaria-vitrine",
        em: L(4),
        duracao: L(8),
        de: 2.5,
        velocidade: 1.15,
        camera: [
          { em: 0, foco: { area: { x: 440, y: 60, l: 1150, a: 560 } } },
          { em: 1.5, foco: { area: { x: 440, y: 60, l: 1150, a: 560 } } },
          { em: 2.3, foco: { caixa: "desenho", zoom: 1.8, margem: 30 }, leva: 0.8 },
        ],
      },
      {
        tomada: "T09-contrato-cliente",
        em: L(12),
        duracao: 1.55,
        de: 0.35,
        cursor: false,
        camera: [
          { em: 0, foco: { caixa: "conversa", zoom: 1.7, margem: 90 } },
          { em: 1.55, foco: { caixa: "conversa", zoom: 1.8, margem: 60 }, leva: 1.55 },
        ],
      },
      {
        tomada: "T09-contrato-cliente",
        em: L(12) + 1.55,
        duracao: L(5) - 1.55,
        de: { marca: "cartao:luz", mais: -0.75 },
        camera: [{ em: 0, foco: { caixa: "requisitos", margem: 50 } }],
      },
      {
        tomada: "T10-depurador",
        em: L(17),
        duracao: L(7),
        de: 5.45,
        velocidade: 1.2,
        camera: [
          { em: 0, foco: { area: { x: 10, y: 130, l: 950, a: 480 } } },
          { em: 1.3, foco: { area: { x: 10, y: 130, l: 950, a: 480 } } },
          { em: 2.1, foco: { area: { x: 330, y: 150, l: 620, a: 330 }, zoom: 1.8 }, leva: 0.8 },
          { em: L(7), foco: { area: { x: 420, y: 160, l: 520, a: 300 }, zoom: 1.8 }, leva: L(7) - 2.2 },
        ],
      },
    ],
  },
  {
    id: "origens",
    titulo: "Origens",
    duracao: O(14),
    musica: "origens",
    musicaDe: 0,
    efeitos: [{ id: "abrir-museu", em: -0.2 }],
    falas: [
      { fala: "familia", em: 0.9 },
      { fala: "python", em: O(8) + 0.2 },
    ],
    objetivo: { indice: 4, em: O(8) + 2.55, lado: "esquerda" },
    cortes: [
      {
        tomada: "T11-museu-corredor",
        em: 0,
        duracao: O(6),
        de: { marca: "rolar", mais: 0 },
        velocidade: 3.5,
        mergulho: true,
        cursor: false,
        camera: [{ em: 0, foco: { tudo: true } }],
      },
      {
        tomada: "T13-mesa-de-cores",
        em: O(6),
        duracao: O(2),
        de: 5.0,
        velocidade: 2.1,
        camera: [{ em: 0, foco: { area: { x: 620, y: 140, l: 720, a: 480 }, zoom: 1.8 } }],
      },
      {
        tomada: "T12-comparador",
        em: O(8),
        duracao: 1.5,
        de: 1.0,
        camera: [
          { em: 0, foco: { area: { x: 780, y: 330, l: 790, a: 330 }, zoom: 1.6 } },
          { em: 1.5, foco: { caixa: "python", zoom: 1.8, margem: 40 }, leva: 1.2 },
        ],
      },
      {
        tomada: "T12-comparador",
        em: O(8) + 1.5,
        duracao: O(6) - 1.5,
        de: { marca: "python-rodou", mais: -0.95 },
        cursor: false,
        camera: [{ em: 0, foco: { caixa: "python-depois", zoom: 1.8, margem: 40 } }],
      },
    ],
  },
  {
    id: "tudo-o-mais",
    titulo: "Tudo o mais",
    duracao: M(16),
    musica: "mapa",
    musicaDe: M(32),
    momentos: { cadeado: M(13) },
    semLista: { de: M(10) + 0.9, ate: M(16) },
    efeitos: [{ id: "insignia", em: M(8) + 0.2 }],
    falas: [
      { fala: "travou", em: 0.25 },
      { fala: "segredo", em: M(10) },
    ],
    cortes: [
      {
        tomada: "T14-glossario",
        em: 0,
        duracao: M(3),
        de: 1.6,
        velocidade: 1.3,
        sons: true,
        camera: [{ em: 0, foco: { area: { x: 150, y: 50, l: 980, a: 470 } } }],
      },
      {
        tomada: "T15-profissoes",
        em: M(3),
        duracao: M(3),
        de: 1.15,
        velocidade: 2,
        cursor: false,
        camera: [{ em: 0, foco: { tudo: true, zoom: 1.12, cy: 0.56 } }],
      },
      {
        tomada: "T16-lente-tema",
        em: M(6),
        duracao: M(2),
        de: 1.3,
        velocidade: 1.5,
        camera: [{ em: 0, foco: { tudo: true } }],
      },
      {
        tomada: "T16-lente-tema",
        em: M(8),
        duracao: M(2),
        de: { marca: "painel-aberto", mais: -0.45 },
        cursor: false,
        camera: [{ em: 0, foco: { caixa: "painel", margem: 60 } }],
      },
      {
        tomada: "T17-troca-tema",
        em: M(10),
        duracao: M(3),
        de: 1.85,
        velocidade: 1.2,
        camera: [
          { em: 0, foco: { tudo: true } },
          { em: M(3), foco: { tudo: true, zoom: 1.3, cx: 0.8, cy: 0.3 }, leva: 1.1 },
        ],
      },
      {
        tomada: "T17-troca-tema",
        em: M(13),
        duracao: M(3),
        de: 4.1,
        cursor: false,
        realce: { caixa: "cadeado", de: 0.35 },
        camera: [
          { em: 0, foco: { tudo: true, zoom: 1.3, cx: 0.8, cy: 0.3 } },
          { em: 0.7, foco: { caixa: "cadeado", zoom: 1.8 }, leva: 0.7 },
        ],
      },
    ],
  },
  {
    id: "chegando",
    titulo: "Chegando",
    duracao: M(15),
    musica: "mapa",
    momentos: { nomes: M(2), passo: M(1) },
    efeitos: [{ id: "desbloqueio", em: M(2) - 0.05 }],
    falas: [
      { fala: "construindo", em: 0.2 },
      { fala: "ia", em: 3.8 },
    ],
    cortes: [
      {
        tomada: "T18-em-construcao",
        em: 0,
        duracao: M(15),
        de: 0.15,
        velocidade: 0.97,
        cursor: false,
        camera: [
          { em: 0, foco: { tudo: true } },
          { em: M(15), foco: { tudo: true, zoom: 1.08, cy: 0.56 }, leva: M(15) - 0.5 },
        ],
      },
    ],
  },
  {
    id: "convite",
    titulo: "Convite",
    duracao: M(16),
    musica: "mapa",
    momentos: { lista: 0.35, cartao: 1.7, cursor: 2.5, realce: 3.3, final: M(8), endereco: M(8) + 0.5 },
    efeitos: [{ id: "unidade-concluida", em: M(8) - 0.05 }],
    falas: [{ fala: "vez", em: M(8) + 0.25 }],
    cortes: [],
  },
  {
    id: "pos-creditos",
    titulo: "Pós-créditos",
    duracao: 2.5,
    musica: null,
    momentos: { boceja: 0.15, dorme: 0.85, desliga: 1.55, preto: 2.15 },
    efeitos: [{ id: "dormir", em: 0.45 }],
    falas: [],
    cortes: [],
  },
];

/* ------------------------------------------------------------------ */
/* Versão 9:16 (edição própria, com as tomadas de celular)             */
/* ------------------------------------------------------------------ */

export const BLOCOS_916: Bloco[] = [
  {
    id: "abertura",
    titulo: "Abertura",
    duracao: 2.4,
    musica: null,
    momentos: { linha: 0.15, abre: 0.5, monitor: 0.6, acorda: 1.15, lista: 1.7 },
    efeitos: [
      { id: "boot", em: 0, volume: 0.8 },
      { id: "acordar", em: 1.1 },
    ],
    falas: [{ fala: "oi", em: 1.3 }],
    cortes: [],
  },
  {
    id: "truque",
    titulo: "O truque",
    duracao: 10.2,
    musica: null,
    momentos: { tecla: 1.75, aperto: 2.55, mergulho: 2.9 },
    efeitos: [{ id: "sint-tecla-enter", em: 2.55, volume: 1 }],
    falas: [
      { fala: "f12", em: 1.85 },
      { fala: "pronto", em: 8.9 },
    ],
    objetivo: { indice: 0, em: 8.75 },
    cortes: [
      {
        tomada: "V01-sites-u1-celular",
        em: 2.9,
        duracao: 7.3,
        de: 0.7,
        velocidade: 1.7,
        mergulho: true,
        sons: true,
        camera: [{ em: 0, foco: { tudo: true } }],
      },
    ],
  },
  {
    id: "titulo",
    titulo: "Título",
    duracao: M(6),
    musica: "mapa",
    musicaDe: 0,
    momentos: { sinais: 0.05, encaixe: 0.55, nome: 0.62, chamada: 1.3, numeros: 2.2 },
    efeitos: [{ id: "sint-acerto", em: 0.55, volume: 0.8 }],
    falas: [],
    cortes: [],
  },
  {
    id: "mundo",
    titulo: "O mundo",
    duracao: M(12),
    musica: "mapa",
    efeitos: [{ id: "entrar-mapa", em: 0 }],
    falas: [{ fala: "madrugada", em: M(8) + 0.2 }],
    objetivo: { indice: 1, em: M(8) - 1.3 },
    cortes: [
      {
        tomada: "V02-mundo-celular",
        em: 0,
        duracao: M(8),
        de: 0.8,
        velocidade: 1.9,
        mergulho: true,
        camera: [{ em: 0, foco: { tudo: true } }],
      },
      {
        // O mesmo enquadramento de dia (T02) e de noite (T03), num recorte em pé do mundo de computador.
        tomada: "T02-mundo-dia",
        em: M(8),
        duracao: M(4),
        de: { marca: "rolar", mais: 3.2 },
        cursor: false,
        recorte: { x: 900, y: 104, l: 640, a: 976 },
        viraNoite: { em: 0.75, dura: 0.7 },
      },
    ],
  },
  {
    id: "sites",
    titulo: "Sites e Lógica",
    duracao: S(22),
    musica: "sites",
    musicaDe: 0,
    efeitos: [{ id: "viagem-ilha", em: -0.25 }],
    falas: [
      { fala: "mexe", em: 1.0 },
      { fala: "vitrine", em: S(8) + 0.5 },
      { fala: "cliente", em: S(16) - 0.1 },
    ],
    objetivo: { indice: 2, em: 2.6 },
    maisObjetivos: [{ indice: 3, em: S(11) + 0.7 }],
    cortes: [
      {
        tomada: "T05-estilos-cor",
        em: 0,
        duracao: S(8),
        de: 2.9,
        velocidade: 1.15,
        mergulho: true,
        palavra: "CSS.",
        recorte: { x: 410, y: 120, l: 700, a: 500 },
      },
      {
        tomada: "V03-padaria-celular",
        em: S(8),
        duracao: S(3),
        de: 1.3,
        velocidade: 1.3,
        camera: [
          { em: 0, foco: { tudo: true } },
          { em: S(3), foco: { area: { x: 0, y: 60, l: 412, a: 330 } }, leva: S(3) - 0.2 },
        ],
      },
      {
        tomada: "T08-padaria-vitrine",
        em: S(11),
        duracao: S(5),
        de: 3.6,
        velocidade: 1.25,
        cursor: false,
        recorte: { x: 957, y: 72, l: 627, a: 478 },
      },
      {
        tomada: "T09-contrato-cliente",
        em: S(16),
        duracao: S(6),
        de: 0.3,
        cursor: false,
        recorte: { x: 548, y: 327, l: 504, a: 247 },
      },
    ],
  },
  {
    id: "origens",
    titulo: "Museu",
    duracao: O(7),
    musica: "origens",
    musicaDe: 0,
    efeitos: [{ id: "abrir-museu", em: -0.2 }],
    falas: [{ fala: "familia", em: 0.9 }],
    objetivo: { indice: 4, em: 4.6 },
    cortes: [
      {
        tomada: "V04-museu-celular",
        em: 0,
        duracao: O(7),
        de: { marca: "rolar", mais: 0.4 },
        velocidade: 3,
        mergulho: true,
        cursor: false,
        camera: [{ em: 0, foco: { tudo: true } }],
      },
    ],
  },
  {
    id: "convite",
    titulo: "Convite",
    duracao: M(10),
    musica: "mapa",
    musicaDe: M(32),
    momentos: { lista: 0.3, cartao: 1.3, cursor: 1.7, realce: 2.2, final: M(5), endereco: M(5) + 0.4 },
    efeitos: [{ id: "unidade-concluida", em: M(5) - 0.05 }],
    falas: [{ fala: "vez", em: M(5) + 0.2 }],
    cortes: [],
  },
  {
    id: "pos-creditos",
    titulo: "Pós-créditos",
    duracao: 2.2,
    musica: null,
    momentos: { boceja: 0.1, dorme: 0.7, desliga: 1.3, preto: 1.9 },
    efeitos: [{ id: "dormir", em: 0.35 }],
    falas: [],
    cortes: [],
  },
];

/* ------------------------------------------------------------------ */
/* Contas sobre o roteiro                                              */
/* ------------------------------------------------------------------ */

export const quadros = (segundos: number): number => Math.round(segundos * FPS);

export type BlocoNoTempo = Bloco & { inicio: number; fim: number };

/** Os blocos com o instante em que cada um começa e acaba no vídeo. */
export function noTempo(blocos: Bloco[]): BlocoNoTempo[] {
  let inicio = 0;
  return blocos.map((bloco) => {
    const comeco = inicio;
    // Cada bloco começa num quadro inteiro.
    inicio = quadros(comeco + bloco.duracao) / FPS;
    return { ...bloco, inicio: comeco, fim: inicio };
  });
}

export const duracaoTotal = (blocos: Bloco[]): number => noTempo(blocos).at(-1)?.fim ?? 0;

/** Todas as falas com o instante absoluto no vídeo, na ordem. */
export function falasNoTempo(blocos: Bloco[]): { fala: IdFala; texto: string; expressao: Expressao; inicio: number; bloco: IdBloco; depois?: FalaNoBloco["depois"] }[] {
  return noTempo(blocos).flatMap((bloco) =>
    bloco.falas.map((item) => ({ fala: item.fala, texto: FALAS[item.fala].texto, expressao: FALAS[item.fala].expressao as Expressao, inicio: bloco.inicio + item.em, bloco: bloco.id, depois: item.depois })),
  );
}

/** Os objetivos marcados, com o instante absoluto. */
export function objetivosNoTempo(blocos: Bloco[]): { indice: number; em: number; lado?: "esquerda" | "direita" }[] {
  return noTempo(blocos).flatMap((bloco) => [
    ...(bloco.objetivo ? [{ indice: bloco.objetivo.indice, em: bloco.inicio + bloco.objetivo.em, lado: bloco.objetivo.lado }] : []),
    ...(bloco.maisObjetivos ?? []).map((item) => ({ indice: item.indice, em: bloco.inicio + item.em })),
  ]);
}
