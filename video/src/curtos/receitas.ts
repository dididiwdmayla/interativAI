/*
 * Os sons que só existem nos curtos, feitos com o sintetizador do jogo
 * (criarSintetizador, de src/audio/sintese.ts), no mesmo espírito das receitas
 * do jogo (src/audio/receitas.ts). O scripts/vozes.mjs renderiza cada um num
 * OfflineAudioContext e grava em public/efeitos/<id>.wav.
 */
import type { Sintetizador } from "@jogo/audio/sintese";

type Receita = (s: Sintetizador) => void;

/** Volume de referência (os arquivos são normalizados depois). */
const V = 0.2;

/** Uma estrela entrando na pílula do placar: um tom curto subindo, com um brilho em cima. */
const estrela =
  (nota: number): Receita =>
  (s) => {
    s.tom({ frequencia: nota, frequenciaFinal: nota * 2, inicio: 0, duracao: 0.13, ganho: V, forma: "triangle", ataque: 0.004 });
    s.tom({ frequencia: nota * 3, inicio: 0.05, duracao: 0.12, ganho: V * 0.35, forma: "sine", ataque: 0.004 });
  };

export const RECEITAS_DOS_CURTOS: Record<string, { receita: Receita; duracao: number; semente: number; pico: number }> = {
  "sint-estrela-1": { receita: estrela(783.99), duracao: 0.4, semente: 41, pico: 0.5 },
  "sint-estrela-2": { receita: estrela(987.77), duracao: 0.4, semente: 42, pico: 0.5 },
  "sint-estrela-3": { receita: estrela(1174.66), duracao: 0.4, semente: 43, pico: 0.5 },
  // Um golpe: ruído curto e um tom grave caindo.
  "sint-golpe": {
    duracao: 0.6,
    semente: 51,
    pico: 0.66,
    receita: (s) => {
      s.ruido({ inicio: 0, duracao: 0.09, ganho: V * 1.4, filtro: "lowpass", frequencia: 2600, frequenciaFinal: 300, q: 0.7, ataque: 0.005 });
      s.tom({ frequencia: 190, frequenciaFinal: 46, inicio: 0, duracao: 0.26, ganho: V * 1.6, forma: "sine", ataque: 0.005 });
      s.tom({ frequencia: 95, frequenciaFinal: 40, inicio: 0.01, duracao: 0.3, ganho: V * 0.7, forma: "triangle", ataque: 0.005 });
      s.ruido({ inicio: 0, duracao: 0.025, ganho: V * 0.9, filtro: "bandpass", frequencia: 3400, q: 1.5 });
    },
  },
  // A entrada do chefão: um estalo grave e comprido, com o quadro "quebrando".
  "sint-estalo": {
    duracao: 1.1,
    semente: 52,
    pico: 0.7,
    receita: (s) => {
      s.tom({ frequencia: 130, frequenciaFinal: 30, inicio: 0, duracao: 0.7, ganho: V * 1.8, forma: "sine", ataque: 0.005 });
      s.tom({ frequencia: 65, frequenciaFinal: 28, inicio: 0, duracao: 0.9, ganho: V * 0.9, forma: "triangle", ataque: 0.005 });
      s.ruido({ inicio: 0, duracao: 0.4, ganho: V * 1.2, filtro: "lowpass", frequencia: 3000, frequenciaFinal: 120, q: 0.7, ataque: 0.005 });
      s.ruido({ inicio: 0, duracao: 0.03, ganho: V * 1.1, filtro: "highpass", frequencia: 4200, q: 0.8 });
      [0.07, 0.13, 0.22].forEach((inicio, i) => s.ruido({ inicio, duracao: 0.02, ganho: V * (0.6 - i * 0.15), filtro: "bandpass", frequencia: 5200 - i * 900, q: 3 }));
    },
  },
  // O nocaute: uma varredura descendo (o silêncio de 4 quadros que vem junto é da mixagem).
  "sint-nocaute": {
    duracao: 0.9,
    semente: 53,
    pico: 0.7,
    receita: (s) => {
      s.tom({ frequencia: 1800, frequenciaFinal: 55, inicio: 0, duracao: 0.55, ganho: V * 1.2, forma: "sawtooth", ataque: 0.005 });
      s.tom({ frequencia: 900, frequenciaFinal: 40, inicio: 0, duracao: 0.6, ganho: V * 1.1, forma: "square", ataque: 0.005 });
      s.ruido({ inicio: 0, duracao: 0.5, ganho: V * 0.9, filtro: "bandpass", frequencia: 6000, frequenciaFinal: 200, q: 1.1 });
      s.tom({ frequencia: 70, frequenciaFinal: 34, inicio: 0.42, duracao: 0.4, ganho: V * 1.5, forma: "sine", ataque: 0.01 });
    },
  },
  // O letreiro neon ligando: um zumbido elétrico curto, com as faíscas do começo.
  "sint-neon": {
    duracao: 0.7,
    semente: 54,
    pico: 0.55,
    receita: (s) => {
      [0, 0.05, 0.11].forEach((inicio, i) => s.ruido({ inicio, duracao: 0.03, ganho: V * (0.9 - i * 0.2), filtro: "bandpass", frequencia: 5200, q: 4 }));
      s.tom({ frequencia: 120, inicio: 0.13, duracao: 0.5, ganho: V * 0.8, forma: "sawtooth", ataque: 0.01 });
      s.tom({ frequencia: 240, inicio: 0.13, duracao: 0.45, ganho: V * 0.4, forma: "square", ataque: 0.01 });
      s.ruido({ inicio: 0.13, duracao: 0.4, ganho: V * 0.25, filtro: "bandpass", frequencia: 7000, q: 6 });
    },
  },
  // O muro de código rachando como vidro: o estalo, os cacos tilintando e a queda.
  "sint-vidro": {
    duracao: 1.0,
    semente: 55,
    pico: 0.6,
    receita: (s) => {
      s.ruido({ inicio: 0, duracao: 0.05, ganho: V * 1.5, filtro: "highpass", frequencia: 3500, q: 0.8 });
      s.tom({ frequencia: 150, frequenciaFinal: 60, inicio: 0, duracao: 0.18, ganho: V * 1.1, forma: "sine", ataque: 0.005 });
      [0.03, 0.07, 0.1, 0.16, 0.21, 0.29, 0.36, 0.45, 0.55].forEach((inicio, i) => s.tom({ frequencia: 2300 + ((i * 977) % 2900), inicio, duracao: 0.09, ganho: V * (0.55 - i * 0.04), forma: "sine", ataque: 0.003 }));
      s.ruido({ inicio: 0.08, duracao: 0.5, ganho: V * 0.5, filtro: "bandpass", frequencia: 6500, frequenciaFinal: 2500, q: 2 });
    },
  },
  // O muro se remontando no fim (o laço): os cacos voltando, de trás para a frente.
  "sint-remonta": {
    duracao: 0.7,
    semente: 56,
    pico: 0.45,
    receita: (s) => {
      s.ruido({ inicio: 0, duracao: 0.45, ganho: V * 0.5, filtro: "bandpass", frequencia: 1800, frequenciaFinal: 6500, q: 2 });
      [0.05, 0.14, 0.22, 0.29, 0.35, 0.4, 0.44].forEach((inicio, i) => s.tom({ frequencia: 1900 + i * 380, inicio, duracao: 0.07, ganho: V * (0.25 + i * 0.05), forma: "sine", ataque: 0.003 }));
    },
  },
  // Um prêmio voando para o aprendiz.
  "sint-voa": {
    duracao: 0.6,
    semente: 57,
    pico: 0.4,
    receita: (s) => {
      s.ruido({ inicio: 0, duracao: 0.34, ganho: V * 0.8, filtro: "bandpass", frequencia: 500, frequenciaFinal: 3600, q: 1.6, ataque: 0.05 });
      s.tom({ frequencia: 420, frequenciaFinal: 1260, inicio: 0.02, duracao: 0.3, ganho: V * 0.35, forma: "sine", ataque: 0.04 });
    },
  },
  // O pixel que sobrou crescendo de volta (o laço do chefão).
  "sint-pixel": {
    duracao: 0.9,
    semente: 58,
    pico: 0.45,
    receita: (s) => {
      [0, 0.12, 0.24, 0.34, 0.42, 0.49, 0.55].forEach((inicio, i) => s.tom({ frequencia: 180 * 1.26 ** i, inicio, duracao: 0.08, ganho: V * (0.35 + i * 0.06), forma: "square", ataque: 0.004 }));
      s.ruido({ inicio: 0.3, duracao: 0.4, ganho: V * 0.3, filtro: "bandpass", frequencia: 900, frequenciaFinal: 4200, q: 3 });
    },
  },
};
