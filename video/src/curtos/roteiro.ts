/*
 * O roteiro dos dois curtos verticais ("O aprendiz", tema Doce, e "O chefão",
 * tema Fliperama): fonte única de tempos, textos, tomadas, câmera, falas e
 * sons. As composições (src/curtos) só desenham o que está aqui; o
 * ROTEIRO-CURTOS.md, as vozes e a trilha saem deste arquivo
 * (scripts/roteiro-curtos-md.mjs, scripts/vozes.mjs).
 *
 * Só dados e contas: nada de React (os scripts de Node importam este arquivo).
 *
 * A unidade de tempo é a BATIDA da música de cada curto. A música é uma janela
 * de N compassos escolhida por medida (scripts/energia.mjs, src/dados/energia.json);
 * o vídeo dura exatamente essa janela, e todo corte cai numa batida (a batida
 * `n` cai no quadro `quadroDa(curto, n)`). O laço fecha: o último quadro é o primeiro.
 */
import energia from "../dados/energia.json";
import numeros from "../dados/numeros.json";
import { instante, marca, takeDe } from "../lib/tomadas";
import { ENDERECO, FPS, type Expressao, type IdTomada, type Instante } from "../roteiro";

export { ENDERECO, FPS };
export type IdCurto = "aprendiz" | "chefao";

export type JanelaDeMusica = { musica: string; compassos: number; batidas: number; compassoInicial: number; de: number; duracao: number; batida: number; bpm: number; rmsDb: number; adiantamentoMs: number };
export const JANELAS = energia.escolhas as unknown as Record<IdCurto, JanelaDeMusica>;

/** O quadro em que cai a batida `n` (pode ser fração: 4.5 é a colcheia depois da quarta batida). */
export const quadroDa = (curto: IdCurto, n: number): number => Math.round(n * JANELAS[curto].batida * FPS);
/** O instante (s) da batida `n`, já no quadro inteiro. */
export const segundoDa = (curto: IdCurto, n: number): number => quadroDa(curto, n) / FPS;
/** Quantas batidas (fração) já passaram no instante `t`. */
export const batidaEm = (curto: IdCurto, t: number): number => t / JANELAS[curto].batida;
export const QUADROS: Record<IdCurto, number> = { aprendiz: quadroDa("aprendiz", JANELAS.aprendiz.batidas), chefao: quadroDa("chefao", JANELAS.chefao.batidas) };
export const DURACAO: Record<IdCurto, number> = { aprendiz: QUADROS.aprendiz / FPS, chefao: QUADROS.chefao / FPS };

/** Áreas seguras do 9:16 (as da v1): nada essencial fora daqui. */
export const SEGURA = { cima: 220, baixo: 1920 - 380, direita: 1080 - 120 } as const;

/* ------------------------------------------------------------------ */
/* Textos                                                              */
/* ------------------------------------------------------------------ */

export const NUMERO_DE_FASES = `mais de ${numeros.maisDeFases}`;

/** O aprendiz: uma combinação do kit de clientes que não repete nenhum cliente do jogo (rabo de cavalo, que nenhum deles usa). */
export const APARENCIA_DO_APRENDIZ = { pele: "morena", cabelo: "rabo", corCabelo: "preto", roupa: "camisa", corRoupa: "azul" } as const;
/** Os prêmios dele: o boné depois da fase 1, os óculos depois da fase 3. */
export const PREMIOS = ["bone", "oculos"] as const;

export const TEXTOS = {
  aprendiz: {
    gancho: ["Achei que", "programar", "era isso"],
    aoVivo: "AO VIVO",
    jogar: "JOGAR",
    concluida: ["FASE", "CONCLUÍDA"],
    uau: "uau",
    fases: [
      { rotulo: "FASE 1", linhas: ["mexer num site", "de verdade"] },
      { rotulo: "FASE 2", linhas: ["deixar com", "a sua cara"] },
      { rotulo: "FASE 3", linhas: ["programar", "a padaria"] },
      { rotulo: "FASE 4", linhas: ["caçar", "o bug"] },
    ],
    numero: [NUMERO_DE_FASES, "fases"],
    final: ["Programe", "jogando."],
  },
  chefao: {
    gancho: ["UM BUG", "APARECEU"],
    nome: "CHEFÃO: O HORÁRIO REPETIDO",
    cliente: { nome: "DONA ZÉLIA", negocio: "Salão Girassol" },
    missao: { rotulo: "MISSÃO", linhas: ["salvar a agenda", "do salão"] },
    golpes: ["PAUSA", "ACHEI", "CONSERTO"],
    combo: "COMBO",
    escudo: "ESCUDO",
    derrotado: ["BUG", "DERROTADO"],
    fases: ["MUNDO", "MUSEU", "PYTHON", "INSÍGNIAS"],
    numero: [NUMERO_DE_FASES, "fases"],
    final: ["Programe", "jogando."],
  },
} as const;

/* ------------------------------------------------------------------ */
/* Falas do computadorzinho (voz de modem, geradas pelo scripts/vozes.mjs) */
/* ------------------------------------------------------------------ */

export type FalaCurta = { id: string; texto: string; expressao: Expressao };
export const FALAS_DOS_CURTOS = {
  start: { id: "curto-start", texto: "Aperta start.", expressao: "feliz" },
  jogador: { id: "curto-jogador", texto: "1 jogador?", expressao: "curioso" },
} as const satisfies Record<string, FalaCurta>;

/* ------------------------------------------------------------------ */
/* Cortes e câmera                                                     */
/* ------------------------------------------------------------------ */

/**
 * A câmera de um corte: o ponto (x, y) da página gravada vai parar na âncora do quadro
 * (padrão: 540 x 880, o meio da faixa de ação entre a câmera de streamer e a faixa de texto),
 * com o zoom dado. `em` e `leva` em batidas desde o começo do corte.
 */
export type QuadroCurto = { em: number; x: number; y: number; zoom: number; leva?: number; ancora?: { x: number; y: number } };

export type CorteCurto = {
  tomada: IdTomada;
  /** Batidas do vídeo em que o corte começa e acaba. */
  de: number;
  ate: number;
  /** Onde a tomada começa a tocar. */
  inicio: Instante;
  velocidade?: number;
  camera: QuadroCurto[];
  /** Desenha o dedo a partir do take.json (padrão: sim). */
  dedo?: boolean;
  /** Toca o som dos toques e das teclas do take.json. */
  sons?: boolean;
};

/** Um som do vídeo. `em` em batidas. `importante`: a música abaixa 6 dB enquanto ele toca. */
export type SomCurto = { id: string; em: number; volume?: number; importante?: boolean };
export type FalaNoCurto = { fala: FalaCurta; em: number };

export type Plano = {
  id: string;
  titulo: string;
  de: number;
  ate: number;
  /** O que acontece, em uma frase (vai para o ROTEIRO-CURTOS.md). */
  acao: string;
  /** O texto que aparece na tela neste plano. */
  texto: string[];
  cortes: CorteCurto[];
  sons: SomCurto[];
  falas?: FalaNoCurto[];
};

/** O instante do vídeo (s) em que uma marca da tomada acontece dentro de um corte. */
export function momentoDaMarca(curto: IdCurto, corte: CorteCurto, nome: string, mais = 0): number {
  const take = takeDe(corte.tomada);
  return segundoDa(curto, corte.de) + (marca(take, nome) + mais - instante(take, corte.inicio)) / (corte.velocidade ?? 1);
}
/** O mesmo, em batidas. */
export const batidaDaMarca = (curto: IdCurto, corte: CorteCurto, nome: string, mais = 0): number => batidaEm(curto, momentoDaMarca(curto, corte, nome, mais));

/**
 * O instante (s da tomada) de uma tecla registrada no take.json. Serve para os momentos em que a tela muda
 * na própria tecla (o Enter que troca a manchete, o Backspace que apaga o trecho errado): a marca que vem
 * depois só é escrita quando a página termina de se acomodar, alguns décimos mais tarde.
 */
function teclaDa(tomada: IdTomada, letra: string): number {
  const evento = takeDe(tomada).eventos.findLast((item) => item.tipo === "tecla" && item.letra === letra);
  if (!evento) throw new Error(`a tomada ${tomada} não tem a tecla "${letra}"`);
  return evento.t + 0.05;
}

/* ------------------------------------------------------------------ */
/* "O aprendiz" (Doce, 28 batidas)                                     */
/* ------------------------------------------------------------------ */

const BA = JANELAS.aprendiz.batida;
const identidade = (em = 0): QuadroCurto => ({ em, x: 206, y: 366, zoom: 1, ancora: { x: 540, y: 960 } });

const A_FASE1_DIGITA: CorteCurto = {
  tomada: "V01-sites-u1-celular",
  de: 5,
  ate: 7,
  // O texto novo sendo digitado na árvore, acelerado para caber em duas batidas.
  inicio: { marca: "digitar", mais: -0.1 },
  velocidade: 2,
  sons: true,
  camera: [{ em: 0, x: 206, y: 590, zoom: 1.32 }],
};
const A_FASE1_MUDA: CorteCurto = {
  tomada: "V01-sites-u1-celular",
  de: 7,
  ate: 9,
  // A prévia: a manchete do site muda no Enter, um terço de batida depois do corte.
  inicio: teclaDa("V01-sites-u1-celular", "Enter") - BA / 3,
  camera: [
    { em: 0, x: 206, y: 238, zoom: 1.06 },
    { em: 2, x: 206, y: 238, zoom: 1.15, leva: 1.6 },
  ],
};
const A_FASE2_TOCA: CorteCurto = {
  tomada: "V05-estilos-celular",
  de: 9,
  ate: 10.5,
  // O dedo no quadradinho da cor, no painel Estilos.
  inicio: { marca: "clique-no-quadradinho", mais: -0.42 },
  sons: true,
  camera: [
    { em: 0, x: 206, y: 612, zoom: 1.25 },
    { em: 1.5, x: 206, y: 612, zoom: 1.4, leva: 1.3 },
  ],
};
const A_FASE2_MUDA: CorteCurto = {
  tomada: "V05-estilos-celular",
  de: 10.5,
  ate: 13,
  // O cabeçalho do site mudando de cor, logo depois do corte.
  inicio: { marca: "cor-mudou", mais: -0.1 },
  velocidade: 0.9,
  dedo: false,
  camera: [
    { em: 0, x: 206, y: 196, zoom: 1.1 },
    { em: 2.5, x: 206, y: 196, zoom: 1.2, leva: 2.2 },
  ],
};
const A_FASE3: CorteCurto = {
  tomada: "V09-vitrine-de-perto",
  de: 13,
  ate: 17,
  // A vitrine: a luz, o letreiro e o forno acendem uma batida depois do corte.
  inicio: { marca: "luz-acesa", mais: -BA },
  dedo: false,
  camera: [
    { em: 0, x: 69, y: 118, zoom: 0.94 },
    { em: 1, x: 69, y: 118, zoom: 0.94 },
    { em: 1.5, x: 69, y: 116, zoom: 1.06, leva: 0.45 },
    { em: 4, x: 69, y: 116, zoom: 1.12, leva: 2.4 },
  ],
};
const A_FASE4_PAUSA: CorteCurto = {
  tomada: "V06-chamado-celular",
  de: 17,
  ate: 19,
  // O programa para no ponto de parada meia batida depois do corte.
  inicio: { marca: "pausou", mais: -BA / 2 },
  sons: true,
  camera: [
    { em: 0, x: 206, y: 470, zoom: 1.12 },
    { em: 0.5, x: 206, y: 470, zoom: 1.12 },
    { em: 0.9, x: 214, y: 476, zoom: 1.34, leva: 0.35 },
  ],
};
const A_FASE4_TESTES: CorteCurto = {
  tomada: "V06-chamado-celular",
  de: 19,
  ate: 21,
  // O último caso de teste fica verde um terço de batida depois do corte.
  inicio: { marca: "teste-verde-4", mais: -BA / 3 },
  sons: true,
  camera: [
    { em: 0, x: 206, y: 520, zoom: 1.14 },
    { em: 0.33, x: 206, y: 520, zoom: 1.14 },
    { em: 0.75, x: 206, y: 540, zoom: 1.26, leva: 0.35 },
  ],
};
const A_MUNDO: CorteCurto = { tomada: "V07-mundo-noite-celular", de: 21, ate: 22, inicio: { marca: "arrasto:2", mais: 0.2 }, dedo: false, camera: [{ em: 0, x: 206, y: 205, zoom: 1.12 }] };
const A_MUSEU: CorteCurto = { tomada: "V04-museu-celular", de: 22, ate: 23, inicio: { marca: "acordou:pc", mais: 0.3 }, dedo: false, camera: [{ em: 0, x: 206, y: 520, zoom: 1.12 }] };
const A_INSIGNIAS: CorteCurto = { tomada: "V08-insignias-celular", de: 23, ate: 24, inicio: { marca: "painel-aberto", mais: 0.6 }, dedo: false, camera: [{ em: 0, x: 206, y: 300, zoom: 1.12 }] };

/** Os momentos de "O aprendiz" que não são corte, em batidas (as composições e a trilha leem daqui). */
export const MOMENTOS_DO_APRENDIZ = {
  /** O primeiro trinco no muro (uma batida antes de ele rachar de vez). */
  trinco: 1,
  /** O muro de código racha e cai. */
  racha: 2,
  caiu: 3,
  /** O botão JOGAR aparece e leva o toque. */
  botao: 3.5,
  toque: 4.2,
  mergulho: 4.35,
  /** A vitória de cada fase (o momento real da gravação): carimbo, estrelas e reação. */
  vitorias: [
    7 + 1 / 3,
    batidaDaMarca("aprendiz", A_FASE2_MUDA, "cor-mudou", 0.3),
    batidaDaMarca("aprendiz", A_FASE3, "luz-acesa"),
    batidaDaMarca("aprendiz", A_FASE4_TESTES, "teste-verde-4"),
  ],
  /** O programa pausado na fase 4 (a reação pensativa). */
  pausa: batidaDaMarca("aprendiz", A_FASE4_PAUSA, "pausou"),
  /** O fim de cada fase (o corte seguinte). */
  fimDasFases: [9, 13, 17, 21],
  /** A tela final. */
  final: 24,
  palavras: [24.5, 25.1],
  endereco: 25.6,
  /** A volta ao começo: os prêmios somem e o muro se remonta. */
  volta: 28 - 0.56 / BA,
} as const;

export const PLANOS_DO_APRENDIZ: Plano[] = [
  {
    id: "gancho",
    titulo: "Gancho",
    de: 0,
    ate: 3,
    acao: "O aprendiz em close, preocupado, na frente de um muro de código de verdade (programas da Ilha Lógica), desfocado e rolando devagar. Na batida 1 aparece o primeiro trinco; na batida 2 o muro racha como vidro e cai em pedaços.",
    texto: [TEXTOS.aprendiz.gancho.join(" ")],
    cortes: [],
    sons: [
      { id: "sint-tecla-3", em: 1, volume: 0.9 },
      { id: "sint-vidro", em: 2, importante: true },
      { id: "esbarrao", em: 2.05, volume: 0.7 },
    ],
  },
  {
    id: "start",
    titulo: "Start",
    de: 3,
    ate: 5,
    acao: "Atrás do muro está o computadorzinho, feliz. Ele fala com voz de modem; o botão JOGAR aparece, o dedo toca e a câmera mergulha na tela dele. O aprendiz encolhe para a câmera de streamer no canto.",
    texto: [FALAS_DOS_CURTOS.start.texto, TEXTOS.aprendiz.jogar],
    cortes: [],
    falas: [{ fala: FALAS_DOS_CURTOS.start, em: 3.08 }],
    sons: [
      { id: "acordar", em: 2.9, volume: 0.6 },
      { id: "sint-clique", em: 4.2, volume: 0.9 },
      { id: "entrar-mapa", em: 4.3, volume: 0.8 },
    ],
  },
  {
    id: "fase-1",
    titulo: "Fase 1",
    de: 5,
    ate: 9,
    acao: "O texto novo é digitado na árvore do site e, no Enter, a manchete da prévia muda. O aprendiz se empolga; carimbo, três estrelas para o placar e o boné voa para ele.",
    texto: [`${TEXTOS.aprendiz.fases[0].rotulo}: ${TEXTOS.aprendiz.fases[0].linhas.join(" ")}`, TEXTOS.aprendiz.concluida.join(" ")],
    cortes: [A_FASE1_DIGITA, A_FASE1_MUDA],
    sons: [],
  },
  {
    id: "fase-2",
    titulo: "Fase 2",
    de: 9,
    ate: 13,
    acao: "No painel Estilos, o dedo toca o quadradinho da cor e o cabeçalho do site troca de cor. Reação e estrelas.",
    texto: [`${TEXTOS.aprendiz.fases[1].rotulo}: ${TEXTOS.aprendiz.fases[1].linhas.join(" ")}`, TEXTOS.aprendiz.concluida.join(" ")],
    cortes: [A_FASE2_TOCA, A_FASE2_MUDA],
    sons: [],
  },
  {
    id: "fase-3",
    titulo: "Fase 3",
    de: 13,
    ate: 17,
    acao: "A vitrine da padaria: o código acende a luz, o letreiro e o forno. O aprendiz diz \"uau\" no balão; estrelas, e os óculos voam para ele.",
    texto: [`${TEXTOS.aprendiz.fases[2].rotulo}: ${TEXTOS.aprendiz.fases[2].linhas.join(" ")}`, TEXTOS.aprendiz.uau, TEXTOS.aprendiz.concluida.join(" ")],
    cortes: [A_FASE3],
    sons: [],
  },
  {
    id: "fase-4",
    titulo: "Fase 4",
    de: 17,
    ate: 21,
    acao: "O chamado da agenda: o programa para no ponto de parada (ele fica pensativo) e, depois do conserto, o último caso de teste fica verde (satisfeito). Estrelas.",
    texto: [`${TEXTOS.aprendiz.fases[3].rotulo}: ${TEXTOS.aprendiz.fases[3].linhas.join(" ")}`, TEXTOS.aprendiz.concluida.join(" ")],
    cortes: [A_FASE4_PAUSA, A_FASE4_TESTES],
    sons: [],
  },
  {
    id: "mundo",
    titulo: "Mundo",
    de: 21,
    ate: 24,
    acao: "Três cortes de uma batida: o mundo de noite, um antepassado acordando no museu e o painel de insígnias.",
    texto: [TEXTOS.aprendiz.numero.join(" ")],
    cortes: [A_MUNDO, A_MUSEU, A_INSIGNIAS],
    sons: [
      { id: "sint-clique", em: 21, volume: 0.7 },
      { id: "sint-clique", em: 22, volume: 0.7 },
      { id: "insignia", em: 23, volume: 0.55 },
    ],
  },
  {
    id: "final",
    titulo: "Final",
    de: 24,
    ate: 28,
    acao: "O aprendiz sai da câmera de streamer e volta ao close, de boné e óculos, satisfeito, com o placar grande ao lado. Na última meia batida ele pisca, os prêmios somem num brilho e o muro de código se remonta: o último quadro é o primeiro.",
    texto: [TEXTOS.aprendiz.final.join(" "), "InterativAI", ENDERECO, TEXTOS.aprendiz.gancho.join(" ")],
    cortes: [],
    sons: [
      { id: "unidade-concluida", em: 24.45, volume: 0.75, importante: true },
      { id: "sint-remonta", em: 28 - 0.74 / BA, volume: 0.8 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* "O chefão" (Fliperama, 36 batidas)                                  */
/* ------------------------------------------------------------------ */

const BC = JANELAS.chefao.batida;

const C_MISSAO: CorteCurto = {
  tomada: "F01-missao-fliperama",
  de: 3,
  ate: 8,
  // A tela do aplicativo acende com a terça uma batida depois do corte: as 10h marcadas duas vezes, em vermelho.
  inicio: { marca: "horario-repetido", mais: -BC },
  dedo: false,
  camera: [
    { em: 0, x: 75, y: 133.2, zoom: 1, ancora: { x: 540, y: 960 } },
    { em: 1, x: 75, y: 133.2, zoom: 1, ancora: { x: 540, y: 960 } },
    { em: 5, x: 86, y: 128, zoom: 1.1, leva: 3.9, ancora: { x: 590, y: 930 } },
  ],
};
const C_PAUSA: CorteCurto = {
  tomada: "F02-luta-fliperama",
  de: 8,
  ate: 11,
  // O programa parado no ponto de parada, na linha 3 (o corte cai em cima da pausa).
  inicio: { marca: "pausou", mais: -2 / FPS },
  dedo: false,
  camera: [
    { em: 0, x: 208, y: 470, zoom: 1.1 },
    { em: 3, x: 208, y: 478, zoom: 1.2, leva: 2.8 },
  ],
};
const C_OBSERVAR: CorteCurto = {
  tomada: "F02-luta-fliperama",
  de: 11,
  ate: 13,
  // O Observar, com os valores da segunda pausa: o pedido é das 10h e a comparação deu false.
  inicio: { marca: "observou", mais: 0.08 },
  dedo: false,
  camera: [
    { em: 0, x: 206, y: 515, zoom: 1.08 },
    { em: 2, x: 206, y: 525, zoom: 1.16, leva: 1.8 },
  ],
};
const C_CONSERTO: CorteCurto = {
  tomada: "F02-luta-fliperama",
  de: 13,
  ate: 17,
  // O trecho errado selecionado; na batida 14 ele é apagado (o Backspace do take.json).
  inicio: teclaDa("F02-luta-fliperama", "Backspace") - BC,
  dedo: false,
  sons: true,
  camera: [
    { em: 0, x: 208, y: 500, zoom: 1.1 },
    { em: 1, x: 208, y: 500, zoom: 1.12, leva: 0.9 },
    { em: 1.3, x: 208, y: 492, zoom: 1.18, leva: 0.28 },
    { em: 4, x: 208, y: 492, zoom: 1.24, leva: 2.5 },
  ],
};
/** Cada teste fica verde em cima de uma batida: o corte começa dois quadros antes. */
const teste = (n: number, de: number, ate: number): CorteCurto => ({
  tomada: "F02-luta-fliperama",
  de,
  ate,
  inicio: { marca: `teste-verde-${n}`, mais: -2 / FPS },
  dedo: false,
  camera: [
    { em: 0, x: 206, y: n === 1 ? 470 : 580, zoom: 1.1 },
    { em: ate - de, x: 206, y: n === 1 ? 470 : 580, zoom: 1.16, leva: ate - de - 0.1 },
  ],
});
const C_ULTIMO_TESTE: CorteCurto = {
  tomada: "F02-luta-fliperama",
  de: 20,
  ate: 25,
  // O último caso (o do horário repetido) ainda sem rodar; o dedo aperta "Rodar os casos" e ele fica verde na batida 21.
  inicio: { marca: "teste-verde-4", mais: -BC },
  sons: true,
  camera: [
    { em: 0, x: 206, y: 500, zoom: 1.04 },
    { em: 1, x: 206, y: 580, zoom: 1.18, leva: 0.9 },
  ],
};
const C_FASES: CorteCurto[] = [
  { tomada: "F03-mundo-fliperama", de: 25, ate: 26, inicio: { marca: "arrasto:3", mais: 0.25 }, dedo: false, camera: [identidade()] },
  { tomada: "F04-museu-fliperama", de: 26, ate: 27, inicio: { marca: "acordou:valvulas", mais: 0.15 }, velocidade: 1.5, dedo: false, camera: [identidade()] },
  { tomada: "F05-python-fliperama", de: 27, ate: 28, inicio: { marca: "python-rodou", mais: -0.12 }, dedo: false, camera: [{ em: 0, x: 206, y: 500, zoom: 1.16, ancora: { x: 540, y: 960 } }] },
  { tomada: "F06-insignias-fliperama", de: 28, ate: 29, inicio: { marca: "painel-aberto", mais: 0.5 }, dedo: false, camera: [identidade()] },
];

/** Os momentos de "O chefão" que não são corte, em batidas. */
export const MOMENTOS_DO_CHEFAO = {
  /** A missão: o cartão da cliente e a faixa. */
  missao: 3,
  /** Os três golpes da investigação (cada um quebra um pedaço do escudo). */
  golpes: [8, 11, 14],
  /** Cada teste real que fica verde tira um quarto da vida. O último é o nocaute. */
  testes: [17, 18, 19, 21],
  nocaute: 21,
  /** O quadro congela por 4 quadros no nocaute. */
  quadrosCongelados: 4,
  derrotado: 21.6,
  fases: 25,
  final: 29,
  palavras: [29.4, 30.4],
  fala: 31.4,
  endereco: 31,
  /** A volta: o pixel que sobrou cresce e vira o chefão. */
  pixel: 34,
  volta: 36 - 0.6 / BC,
} as const;

export const PLANOS_DO_CHEFAO: Plano[] = [
  {
    id: "gancho",
    titulo: "Gancho",
    de: 0,
    ate: 3,
    acao: "Fundo do Fliperama com scanlines. O chefão (o bug) já está inteiro no quadro 0, com a barra de vida e o nome; a tela treme com o estalo grave da entrada.",
    texto: [TEXTOS.chefao.gancho.join(" "), TEXTOS.chefao.nome],
    cortes: [],
    sons: [{ id: "sint-estalo", em: 0, importante: true }],
  },
  {
    id: "missao",
    titulo: "A missão",
    de: 3,
    ate: 8,
    acao: "A tela do aplicativo do Salão Girassol acende com a terça: as 10h marcadas duas vezes, em vermelho (gravação real, aproximada). A Dona Zélia aparece num cartão de cliente, preocupada.",
    texto: [`${TEXTOS.chefao.missao.rotulo}: ${TEXTOS.chefao.missao.linhas.join(" ")}`, TEXTOS.chefao.cliente.nome, TEXTOS.chefao.cliente.negocio],
    cortes: [C_MISSAO],
    sons: [
      { id: "viagem-ilha", em: 2.9, volume: 0.6 },
      { id: "sint-acerto", em: 4, volume: 0.6 },
    ],
  },
  {
    id: "luta",
    titulo: "A luta",
    de: 8,
    ate: 20,
    acao: "O mesmo chamado: o programa parado no ponto de parada (PAUSA); o Observar mostra o valor da segunda pausa (ACHEI); o trecho errado é selecionado e apagado (CONSERTO). Cada golpe quebra um pedaço do escudo do chefão. Depois, os casos de teste: cada um que fica verde na gravação tira um quarto da vida, e o contador de combo sobe.",
    texto: [...TEXTOS.chefao.golpes, `${TEXTOS.chefao.combo} x2`, `${TEXTOS.chefao.combo} x3`],
    cortes: [C_PAUSA, C_OBSERVAR, C_CONSERTO, teste(1, 17, 18), teste(2, 18, 19), teste(3, 19, 20)],
    sons: [
      { id: "sint-golpe", em: 8, importante: true },
      { id: "sint-golpe", em: 11, importante: true },
      { id: "sint-golpe", em: 14, importante: true },
      { id: "sint-estrela-1", em: 17 },
      { id: "sint-estrela-2", em: 18 },
      { id: "sint-estrela-3", em: 19 },
    ],
  },
  {
    id: "nocaute",
    titulo: "Nocaute",
    de: 20,
    ate: 25,
    acao: "O último caso de teste (o do horário repetido) fica verde e a barra zera. O quadro congela por 4 quadros, com um clarão; o chefão explode em pixels, que viram estrelas e sobem. A Dona Zélia fica satisfeita.",
    texto: [`${TEXTOS.chefao.combo} x4`, TEXTOS.chefao.derrotado.join(" ")],
    cortes: [C_ULTIMO_TESTE],
    sons: [
      { id: "sint-nocaute", em: 21, importante: true },
      { id: "unidade-concluida", em: 21.7, volume: 0.8, importante: true },
    ],
  },
  {
    id: "fases",
    titulo: "Próximas fases",
    de: 25,
    ate: 29,
    acao: "Um seletor de mundo de fliperama: quatro cartões de uma batida, com o mundo de noite, o museu, o Python rodando e as insígnias, tudo no tema Fliperama.",
    texto: [TEXTOS.chefao.numero.join(" "), ...TEXTOS.chefao.fases],
    cortes: C_FASES,
    sons: [
      { id: "sint-clique", em: 25, volume: 0.8 },
      { id: "sint-clique", em: 26, volume: 0.8 },
      { id: "sint-clique", em: 27, volume: 0.8 },
      { id: "sint-clique", em: 28, volume: 0.8 },
    ],
  },
  {
    id: "final",
    titulo: "Final",
    de: 29,
    ate: 36,
    acao: "O letreiro neon liga, palavra por palavra. O computadorzinho, no Fliperama, pergunta \"1 jogador?\" com voz de modem. Embaixo, o logo e o endereço. No fim, um pixel que sobrou da explosão cresce e vira o chefão de novo: o último quadro é o primeiro.",
    texto: [TEXTOS.chefao.final.join(" "), FALAS_DOS_CURTOS.jogador.texto, "InterativAI", ENDERECO, TEXTOS.chefao.gancho.join(" ")],
    cortes: [],
    falas: [{ fala: FALAS_DOS_CURTOS.jogador, em: 31.4 }],
    sons: [
      { id: "sint-neon", em: 29.4, importante: true },
      { id: "sint-neon", em: 30.4, volume: 0.9, importante: true },
      { id: "sint-pixel", em: 34, volume: 0.7 },
    ],
  },
];

export const PLANOS: Record<IdCurto, Plano[]> = { aprendiz: PLANOS_DO_APRENDIZ, chefao: PLANOS_DO_CHEFAO };
export const TITULOS: Record<IdCurto, string> = { aprendiz: "O aprendiz", chefao: "O chefão" };
export const TEMAS: Record<IdCurto, "doce" | "fliperama"> = { aprendiz: "doce", chefao: "fliperama" };

/** Todos os cortes de um curto, na ordem. */
export const cortesDo = (curto: IdCurto): CorteCurto[] => PLANOS[curto].flatMap((plano) => plano.cortes).sort((a, b) => a.de - b.de);

/**
 * Os sons que saem dos momentos reais das gravações de "O aprendiz" (a vitória de cada fase): a fanfarra
 * da fase concluída do jogo, uma estrela entrando na pílula a cada terço de batida (com o som de acerto do
 * jogo na última) e o prêmio voando.
 */
export function sonsDasVitorias(): SomCurto[] {
  return MOMENTOS_DO_APRENDIZ.vitorias.flatMap((batida, fase) => [
    { id: "fase-concluida", em: batida + 0.15, volume: 0.6, importante: true },
    ...[0, 1, 2].map((estrela) => ({ id: `sint-estrela-${estrela + 1}`, em: batida + 0.75 + estrela * 0.3, volume: 0.8 })),
    // O som de acerto do jogo quando o número do placar fecha a conta da fase.
    { id: "sint-acerto", em: batida + 0.75 + 0.6, volume: 0.6 },
    ...(fase === 0 || fase === 2 ? [{ id: "sint-voa", em: batida + 0.9, volume: 0.7 }, { id: "desbloqueio", em: batida + 1.5, volume: 0.45 }] : []),
  ]);
}

/** Todos os sons de um curto, com o instante em batidas. */
export const sonsDo = (curto: IdCurto): SomCurto[] => [...PLANOS[curto].flatMap((plano) => plano.sons), ...(curto === "aprendiz" ? sonsDasVitorias() : [])].sort((a, b) => a.em - b.em);
export const falasDo = (curto: IdCurto): FalaNoCurto[] => PLANOS[curto].flatMap((plano) => plano.falas ?? []);
