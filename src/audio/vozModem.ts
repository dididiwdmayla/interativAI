import type { Expressao } from "@/motor/expressao";
import { criarSorteio, hashTexto } from "./aleatorio";

/*
 * Voz de modem do computadorzinho, parte pura: texto + humor viram uma lista
 * de eventos sonoros (tempo, tipo, frequência, duração, ganho). Nada aqui
 * toca som; quem toca é o tocadorVoz. A semente vem do hash do texto e do
 * humor, então a mesma frase soa sempre igual.
 *
 * Ideia: vogais viram apitos curtos numa escala pentatônica, consoantes
 * viram chiados curtos de dados, espaços e pontuação viram pausas, e cada
 * fala começa com um "handshake" de modem bem curtinho.
 */

/** Assinaturas de voz. As expressões do mascote caem numa delas (HUMOR_DA_EXPRESSAO). */
export type HumorVoz = "feliz" | "pensativo" | "triste" | "surpreso";

export const HUMORES_VOZ: readonly HumorVoz[] = ["feliz", "pensativo", "triste", "surpreso"];

/**
 * Expressão do mascote -> assinatura de voz. Comemorando soa como feliz;
 * curioso começa com o apito de surpresa; apontando explica (pensativo);
 * preocupado e dormindo (chat desligado) caem no triste.
 */
export const HUMOR_DA_EXPRESSAO: Readonly<Record<Expressao, HumorVoz>> = {
  feliz: "feliz",
  comemorando: "feliz",
  curioso: "surpreso",
  pensativo: "pensativo",
  apontando: "pensativo",
  preocupado: "triste",
  dormindo: "triste",
};

export type TipoEventoVoz =
  /** Apito tonal curto de uma vogal (ou sílaba sem vogal). */
  | "blip"
  /** Rajada de ruído com passa-banda: consoante, chiado de dados, linha caindo. */
  | "chiado"
  /** Tom puro de linha telefônica (handshake, trinado de dados). */
  | "tom"
  /** Tom que desliza de `frequencia` até `frequenciaFinal`. */
  | "varrido";

export type EventoVoz = {
  /** Início, em segundos, a partir do começo da fala. */
  tempo: number;
  tipo: TipoEventoVoz;
  /** Hz. No chiado, o centro do passa-banda. */
  frequencia: number;
  /** Hz no fim do evento (deslize). Sem ela, a altura fica parada. */
  frequenciaFinal?: number;
  duracao: number;
  /** Ganho relativo (0 a 1). O ruído fica sempre abaixo dos tons. */
  ganho: number;
  /** Só no blip: onda quadrada ou FM suave. */
  forma?: "quadrada" | "fm";
};

/** Teto de uma fala, em segundos, por maior que seja o texto. */
export const DURACAO_MAXIMA_VOZ = 2.5;

/** Filtro passa-baixa geral da voz (Hz), aplicado pelo tocador. */
export const PASSA_BAIXA_VOZ = 4500;

/** Duração máxima do handshake do começo. */
export const DURACAO_HANDSHAKE = 0.15;

/** Maior ganho de qualquer chiado; todo blip e tom tonal fica acima disso. */
export const GANHO_MAXIMO_CHIADO = 0.16;

type Assinatura = {
  /** Frequência do grau zero da escala. */
  base: number;
  /** Semitons da escala pentatônica, numa oitava. */
  escala: readonly number[];
  /** Tempo entre sílabas (s). Limita a taxa de blips. */
  passo: number;
  /** Duração dos blips (s), entre 40 e 70 ms. */
  blip: readonly [number, number];
  /** Maior salto de grau entre sílabas: quanto maior, mais saltitante. */
  salto: number;
  forma: "quadrada" | "fm";
  ganhoBlip: number;
  pausaEspaco: number;
  pausaVirgula: number;
  pausaPonto: number;
};

const PENTATONICA_MAIOR = [0, 2, 4, 7, 9] as const;
const PENTATONICA_MENOR = [0, 3, 5, 7, 10] as const;

export const ASSINATURAS: Readonly<Record<HumorVoz, Assinatura>> = {
  feliz: {
    base: 523.25,
    escala: PENTATONICA_MAIOR,
    passo: 0.088,
    blip: [0.04, 0.055],
    salto: 3,
    forma: "quadrada",
    ganhoBlip: 0.5,
    pausaEspaco: 0.04,
    pausaVirgula: 0.15,
    pausaPonto: 0.26,
  },
  pensativo: {
    base: 392,
    escala: PENTATONICA_MAIOR,
    passo: 0.118,
    blip: [0.055, 0.07],
    salto: 1,
    forma: "fm",
    ganhoBlip: 0.45,
    pausaEspaco: 0.07,
    pausaVirgula: 0.2,
    pausaPonto: 0.32,
  },
  triste: {
    base: 220,
    escala: PENTATONICA_MENOR,
    passo: 0.122,
    blip: [0.058, 0.07],
    salto: 1,
    forma: "fm",
    ganhoBlip: 0.45,
    pausaEspaco: 0.07,
    pausaVirgula: 0.2,
    pausaPonto: 0.32,
  },
  surpreso: {
    base: 466.16,
    escala: PENTATONICA_MAIOR,
    passo: 0.096,
    blip: [0.045, 0.06],
    salto: 2,
    forma: "quadrada",
    ganhoBlip: 0.48,
    pausaEspaco: 0.05,
    pausaVirgula: 0.17,
    pausaPonto: 0.28,
  },
};

/** Graus disponíveis: duas oitavas da escala. */
const GRAUS = 10;

function frequenciaDoGrau(assinatura: Assinatura, grau: number): number {
  const oitava = Math.floor(grau / assinatura.escala.length);
  const semitom = assinatura.escala[grau % assinatura.escala.length] + 12 * oitava;
  return assinatura.base * 2 ** (semitom / 12);
}

type Silaba = { ataque: string; nucleo: string; coda: string };

type Token =
  | { tipo: "silaba"; silaba: Silaba; fimDePergunta: boolean }
  | { tipo: "espaco" }
  | { tipo: "virgula" }
  | { tipo: "ponto"; pergunta: boolean };

const VOGAIS = new Set("aeiouy");
const SIBILANTES = new Set("szxcfjvh");
const OCLUSIVAS = new Set("ptkqbdg");

function ehVogal(letra: string): boolean {
  return VOGAIS.has(letra);
}

/**
 * Sílabas aproximadas: consoantes do começo + grupo de vogais. Consoantes
 * que sobram no fim entram como coda da última. Palavra sem vogal (html,
 * css, números) vira pedaços de 2 caracteres, para não falar letra por letra.
 */
export function silabasDe(palavra: string): Silaba[] {
  const silabas: Silaba[] = [];
  let ataque = "";
  let indice = 0;
  while (indice < palavra.length) {
    const letra = palavra[indice];
    if (ehVogal(letra)) {
      let nucleo = "";
      while (indice < palavra.length && ehVogal(palavra[indice])) nucleo += palavra[indice++];
      silabas.push({ ataque, nucleo, coda: "" });
      ataque = "";
    } else {
      ataque += letra;
      indice++;
    }
  }
  if (ataque) {
    const ultima = silabas[silabas.length - 1];
    if (ultima) {
      ultima.coda = ataque;
    } else {
      for (let inicio = 0; inicio < ataque.length; inicio += 2) {
        silabas.push({ ataque: ataque.slice(inicio, inicio + 2), nucleo: "", coda: "" });
      }
    }
  }
  return silabas;
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Texto -> sílabas, espaços e pontuação. O "?" marca a sílaba de antes para subir. */
export function tokensDe(texto: string): Token[] {
  const tokens: Token[] = [];
  const partes = normalizar(texto).match(/[a-z0-9]+|\s+|[,;:]|[.!?]+|\S/g) ?? [];
  for (const parte of partes) {
    if (/^[a-z0-9]+$/.test(parte)) {
      for (const silaba of silabasDe(parte)) tokens.push({ tipo: "silaba", silaba, fimDePergunta: false });
    } else if (/^\s+$/.test(parte)) {
      if (tokens.length > 0 && tokens[tokens.length - 1].tipo === "silaba") tokens.push({ tipo: "espaco" });
    } else if (/^[,;:]$/.test(parte)) {
      tokens.push({ tipo: "virgula" });
    } else if (/^[.!?]+$/.test(parte)) {
      const pergunta = parte.includes("?");
      if (pergunta) {
        for (let indice = tokens.length - 1; indice >= 0; indice--) {
          const token = tokens[indice];
          if (token.tipo === "silaba") {
            token.fimDePergunta = true;
            break;
          }
        }
      }
      tokens.push({ tipo: "ponto", pergunta });
    }
    // Outros símbolos (aspas, parênteses, sinais de código) não fazem som.
  }
  return tokens;
}

/** A frase que contém o token de índice `indice` termina com "?"? */
function fraseEhPergunta(tokens: readonly Token[], indice: number): boolean {
  for (let atual = indice; atual < tokens.length; atual++) {
    const token = tokens[atual];
    if (token.tipo === "ponto") return token.pergunta;
  }
  return false;
}

function fimDoEvento(evento: EventoVoz): number {
  return evento.tempo + evento.duracao;
}

/** Duração total de uma lista de eventos (fim do último som). */
export function duracaoDaFala(eventos: readonly EventoVoz[]): number {
  return eventos.reduce((maior, evento) => Math.max(maior, fimDoEvento(evento)), 0);
}

/** Handshake: tom duplo de linha (como os tons de um modem antigo) e um varrido curto. */
function handshake(inicio: number): EventoVoz[] {
  return [
    { tempo: inicio, tipo: "tom", frequencia: 1270, duracao: 0.055, ganho: 0.2 },
    { tempo: inicio, tipo: "tom", frequencia: 2225, duracao: 0.055, ganho: 0.17 },
    { tempo: inicio + 0.06, tipo: "varrido", frequencia: 2100, frequenciaFinal: 1200, duracao: 0.055, ganho: 0.18 },
  ];
}

/** Trinado rápido de dados: tons alternando depressa, baixinho. */
function trinado(inicio: number, sorteio: () => number): { eventos: EventoVoz[]; duracao: number } {
  const notas = 4 + Math.floor(sorteio() * 3);
  const passo = 0.017;
  const alto = 1650 + Math.round(sorteio() * 300);
  const eventos: EventoVoz[] = [];
  for (let indice = 0; indice < notas; indice++) {
    eventos.push({
      tempo: inicio + indice * passo,
      tipo: "tom",
      frequencia: indice % 2 === 0 ? alto : alto * 0.8,
      duracao: passo * 0.9,
      ganho: 0.18,
    });
  }
  return { eventos, duracao: notas * passo + 0.02 };
}

/** Linha caindo: varrido para baixo com chiado, no fim das falas tristes. */
function linhaCaindo(inicio: number, frequencia: number): EventoVoz[] {
  return [
    { tempo: inicio, tipo: "varrido", frequencia: frequencia * 0.9, frequenciaFinal: frequencia * 0.35, duracao: 0.2, ganho: 0.3 },
    { tempo: inicio + 0.02, tipo: "chiado", frequencia: 1200, duracao: 0.18, ganho: 0.08 },
  ];
}

const DURACAO_LINHA_CAINDO = 0.22;
const DURACAO_CAUDA = 0.075;

/**
 * Gera a fala. Pura e determinística: mesmo texto e humor, mesma lista.
 * Texto longo para no teto (DURACAO_MAXIMA_VOZ) com uma cauda suave, sem
 * corte seco.
 */
export function gerarFala(texto: string, humor: HumorVoz): EventoVoz[] {
  const assinatura = ASSINATURAS[humor];
  const sorteio = criarSorteio(hashTexto(`${humor}|${texto}`));
  const eventos: EventoVoz[] = [];
  let tempo = 0;

  if (humor === "surpreso") {
    // Apito subindo antes de tudo.
    eventos.push({ tempo: 0, tipo: "varrido", frequencia: 520, frequenciaFinal: 1560, duracao: 0.13, ganho: 0.32 });
    tempo = 0.15;
  }
  eventos.push(...handshake(tempo));
  tempo += DURACAO_HANDSHAKE;

  const tokens = tokensDe(texto);
  const reserva = DURACAO_CAUDA + (humor === "triste" ? DURACAO_LINHA_CAINDO + 0.03 : 0.02);
  const limite = DURACAO_MAXIMA_VOZ - reserva;
  let grau = 4 + Math.floor(sorteio() * 2);
  let ultimaFrequencia = frequenciaDoGrau(assinatura, grau);
  let silabasDitas = 0;
  let trinados = 0;
  let cortada = false;
  let indiceCorte = tokens.length;

  for (let indice = 0; indice < tokens.length; indice++) {
    const token = tokens[indice];
    if (token.tipo === "espaco") {
      tempo += assinatura.pausaEspaco;
      continue;
    }
    if (token.tipo === "virgula") {
      tempo += assinatura.pausaVirgula;
      continue;
    }
    if (token.tipo === "ponto") {
      tempo += assinatura.pausaPonto;
      continue;
    }

    const { ataque, nucleo, coda } = token.silaba;
    const temChiado = [...ataque].some((letra) => SIBILANTES.has(letra) || OCLUSIVAS.has(letra));
    const duracaoChiado = [...ataque].some((letra) => SIBILANTES.has(letra)) ? 0.022 : 0.012;
    const duracaoBlip = assinatura.blip[0] + sorteio() * (assinatura.blip[1] - assinatura.blip[0]);
    const espacoSilaba = (temChiado ? duracaoChiado + 0.005 : 0) + duracaoBlip + 0.03;
    if (tempo + espacoSilaba > limite) {
      cortada = true;
      indiceCorte = indice;
      break;
    }

    // Altura: passeio pela escala, puxado de volta ao meio, com um toque da vogal.
    const passo = Math.round((sorteio() * 2 - 1) * assinatura.salto);
    const volta = grau > 7 ? -1 : grau < 2 ? 1 : 0;
    grau = Math.min(GRAUS - 1, Math.max(0, grau + passo + volta));
    const vogal = nucleo[0] ?? "";
    const tom = vogal === "i" || vogal === "e" ? 1 : vogal === "o" || vogal === "u" ? -1 : 0;
    const grauSom = Math.min(GRAUS, Math.max(0, grau + tom));
    const frequencia = frequenciaDoGrau(assinatura, grauSom);

    if (temChiado) {
      const sibilante = [...ataque].some((letra) => SIBILANTES.has(letra));
      eventos.push({
        tempo,
        tipo: "chiado",
        frequencia: sibilante ? 3200 + sorteio() * 600 : 1800 + sorteio() * 600,
        duracao: duracaoChiado,
        ganho: sibilante ? GANHO_MAXIMO_CHIADO : 0.13,
      });
      tempo += duracaoChiado + 0.005;
    }

    // Nasal ou líquida (m, n, l, r) entra deslizando de leve até a nota.
    const desliza = !temChiado && ataque.length > 0;
    let frequenciaFinal: number | undefined = desliza ? frequencia : undefined;
    const inicioBlip = desliza ? frequencia * 0.94 : frequencia;
    if (token.fimDePergunta) frequenciaFinal = frequencia * 1.45;
    eventos.push({
      tempo,
      tipo: "blip",
      frequencia: inicioBlip,
      ...(frequenciaFinal !== undefined ? { frequenciaFinal } : {}),
      duracao: duracaoBlip,
      ganho: assinatura.ganhoBlip * (0.85 + sorteio() * 0.15),
      forma: assinatura.forma,
    });
    ultimaFrequencia = frequenciaFinal ?? frequencia;

    if ([...coda].some((letra) => SIBILANTES.has(letra))) {
      eventos.push({ tempo: tempo + duracaoBlip, tipo: "chiado", frequencia: 3400, duracao: 0.015, ganho: 0.1 });
    }

    tempo += Math.max(duracaoBlip + 0.01, assinatura.passo * (0.9 + sorteio() * 0.2) - (temChiado ? duracaoChiado + 0.005 : 0));
    silabasDitas++;

    // De vez em quando, um trinado de dados (nunca no começo, no máximo dois).
    if (silabasDitas > 3 && trinados < 2 && sorteio() < 0.08) {
      const extra = trinado(tempo, sorteio);
      if (tempo + extra.duracao < limite) {
        eventos.push(...extra.eventos);
        tempo += extra.duracao;
        trinados++;
      }
    }
  }

  // Fim natural: se o texto não coube, uma cauda que desce (ou sobe, se a frase é pergunta).
  let fim = duracaoDaFala(eventos);
  if (cortada) {
    const pergunta = fraseEhPergunta(tokens, indiceCorte);
    const frequencia = ultimaFrequencia;
    eventos.push({
      tempo: fim + 0.02,
      tipo: "blip",
      frequencia,
      frequenciaFinal: pergunta ? frequencia * 1.4 : frequencia * 0.78,
      duracao: DURACAO_CAUDA - 0.02,
      ganho: assinatura.ganhoBlip * 0.7,
      forma: assinatura.forma,
    });
    fim = duracaoDaFala(eventos);
  }
  if (humor === "triste") eventos.push(...linhaCaindo(fim + 0.02, ultimaFrequencia));

  return eventos.sort((a, b) => a.tempo - b.tempo);
}
