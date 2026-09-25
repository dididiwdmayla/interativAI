import type { IdEfeito } from "./efeitos";
import type { Sintetizador } from "./sintese";

/*
 * Versão sintetizada de cada efeito. Os quatro sons que o jogo já tinha
 * (clique, acerto, conclusão e aviso, do antigo src/lib/som.ts) foram
 * trazidos iguais: mesmas notas, formas e envelope. Os de momentos grandes
 * são provisórios, no espírito chiptune de computador antigo das músicas,
 * até chegarem os arquivos gravados (ver public/audio/efeitos/efeitos.json).
 *
 * V é o volume de referência do som antigo; o barramento de efeitos aplica
 * o volume escolhido pelo jogador por cima.
 */

const V = 0.06;

/** Variação pequena e aleatória (tecla não soa sempre igual). */
function variar(valor: number, fracao: number): number {
  return valor * (1 + (Math.random() * 2 - 1) * fracao);
}

type Receita = (s: Sintetizador) => void;

/** Arpejo do som antigo de conclusão (fase concluída, "Fez sozinho!"). */
const conclusaoAntiga: Receita = (s) => {
  [523.25, 659.25, 783.99, 1046.5].forEach((frequencia, indice) =>
    s.tom({ frequencia, inicio: indice * 0.11, duracao: 0.26, ganho: V, forma: "triangle" }),
  );
  [523.25, 659.25, 783.99].forEach((frequencia) =>
    s.tom({ frequencia: frequencia * 2, inicio: 0.5, duracao: 0.6, ganho: V * 0.55, forma: "sine" }),
  );
};

/** Clique mecânico de teclado: rajada de ruído com passa-banda e um "toc" grave. */
function teclaMecanica(s: Sintetizador, { ruido, toc, forca }: { ruido: number; toc: number; forca: number }): void {
  s.ruido({
    inicio: 0,
    duracao: variar(0.018, 0.15),
    ganho: variar(V * 0.55 * forca, 0.2),
    frequencia: variar(ruido, 0.08),
    q: 2.2,
    ataque: 0.005,
  });
  s.tom({ frequencia: variar(toc, 0.05), inicio: 0.002, duracao: 0.03, ganho: variar(V * 0.45 * forca, 0.2), ataque: 0.005 });
}

export const RECEITAS: Readonly<Record<IdEfeito, Receita>> = {
  tecla: (s) => teclaMecanica(s, { ruido: 3000, toc: 190, forca: 1 }),
  "tecla-espaco": (s) => teclaMecanica(s, { ruido: 1500, toc: 125, forca: 1.2 }),
  "tecla-enter": (s) => {
    teclaMecanica(s, { ruido: 2100, toc: 150, forca: 1.3 });
    s.tom({ frequencia: 660, inicio: 0.03, duracao: 0.05, ganho: V * 0.18, forma: "triangle", ataque: 0.005 });
  },
  "tecla-apagar": (s) => {
    teclaMecanica(s, { ruido: 2600, toc: 230, forca: 0.9 });
    s.tom({ frequencia: 520, frequenciaFinal: 380, inicio: 0.01, duracao: 0.04, ganho: V * 0.15, forma: "triangle", ataque: 0.005 });
  },

  // Som antigo, igual.
  clique: (s) => s.tom({ frequencia: 900, inicio: 0, duracao: 0.06, ganho: V * 0.5, forma: "sine" }),
  hover: (s) => s.tom({ frequencia: 1760, inicio: 0, duracao: 0.03, ganho: V * 0.12, forma: "sine", ataque: 0.005 }),

  // Som antigo, igual: arpejo curto e alegre (dó, mi, sol).
  acerto: (s) =>
    [523.25, 659.25, 783.99].forEach((frequencia, indice) =>
      s.tom({ frequencia, inicio: indice * 0.08, duracao: 0.2, ganho: V, forma: "triangle" }),
    ),
  // Errar não custa estrela: um "bwoop" macio que desce, sem drama.
  erro: (s) => {
    s.tom({ frequencia: 330, frequenciaFinal: 262, inicio: 0, duracao: 0.16, ganho: V * 0.7, forma: "triangle" });
    s.tom({ frequencia: 262, frequenciaFinal: 196, inicio: 0.13, duracao: 0.24, ganho: V * 0.6, forma: "triangle" });
  },
  // Som antigo, igual.
  aviso: (s) => {
    s.tom({ frequencia: 523.25, inicio: 0, duracao: 0.16, ganho: V * 0.7, forma: "sine" });
    s.tom({ frequencia: 392, inicio: 0.12, duracao: 0.24, ganho: V * 0.7, forma: "sine" });
  },

  "abrir-painel": (s) => {
    s.tom({ frequencia: 420, frequenciaFinal: 840, inicio: 0, duracao: 0.09, ganho: V * 0.35, forma: "sine", ataque: 0.008 });
    s.ruido({ inicio: 0, duracao: 0.08, ganho: V * 0.12, filtro: "highpass", frequencia: 2500, q: 0.7 });
  },
  "fechar-painel": (s) => {
    s.tom({ frequencia: 840, frequenciaFinal: 420, inicio: 0, duracao: 0.09, ganho: V * 0.35, forma: "sine", ataque: 0.008 });
    s.ruido({ inicio: 0, duracao: 0.08, ganho: V * 0.1, filtro: "highpass", frequencia: 2000, q: 0.7 });
  },

  // Ferramentas: família de blips curtos. Apagar desce com chiado;
  // desfazer sobe rebobinando: nunca se confundem.
  inspecionar: (s) => {
    s.tom({ frequencia: 1200, inicio: 0, duracao: 0.04, ganho: V * 0.35, forma: "square", ataque: 0.005 });
    s.tom({ frequencia: 1600, inicio: 0.055, duracao: 0.05, ganho: V * 0.35, forma: "square", ataque: 0.005 });
  },
  editar: (s) => {
    s.tom({ frequencia: 700, frequenciaFinal: 940, inicio: 0, duracao: 0.07, ganho: V * 0.45, forma: "triangle", ataque: 0.006 });
    s.ruido({ inicio: 0, duracao: 0.012, ganho: V * 0.25, frequencia: 3200, q: 2 });
  },
  esconder: (s) => {
    s.tom({ frequencia: 880, frequenciaFinal: 440, inicio: 0, duracao: 0.14, ganho: V * 0.4, forma: "triangle", ataque: 0.006 });
    s.tom({ frequencia: 1320, frequenciaFinal: 660, inicio: 0.02, duracao: 0.12, ganho: V * 0.15, forma: "sine", ataque: 0.006 });
  },
  apagar: (s) => {
    s.ruido({ inicio: 0, duracao: 0.2, ganho: V * 0.6, filtro: "lowpass", frequencia: 3500, frequenciaFinal: 250, q: 1 });
    s.tom({ frequencia: 240, frequenciaFinal: 90, inicio: 0, duracao: 0.14, ganho: V * 0.4, forma: "square", ataque: 0.005 });
  },
  desfazer: (s) => {
    s.tom({ frequencia: 330, frequenciaFinal: 990, inicio: 0, duracao: 0.12, ganho: V * 0.45, forma: "triangle", ataque: 0.006 });
    s.tom({ frequencia: 990, inicio: 0.13, duracao: 0.06, ganho: V * 0.4, forma: "triangle", ataque: 0.005 });
  },
  refazer: (s) => {
    s.tom({ frequencia: 660, inicio: 0, duracao: 0.05, ganho: V * 0.4, forma: "triangle", ataque: 0.005 });
    s.tom({ frequencia: 990, inicio: 0.06, duracao: 0.07, ganho: V * 0.4, forma: "triangle", ataque: 0.005 });
  },
  duplicar: (s) => {
    s.tom({ frequencia: 880, inicio: 0, duracao: 0.05, ganho: V * 0.4, forma: "square", ataque: 0.005 });
    s.tom({ frequencia: 880, inicio: 0.075, duracao: 0.05, ganho: V * 0.4, forma: "square", ataque: 0.005 });
  },
  "renomear-tag": (s) => {
    [660, 784, 1047].forEach((frequencia, indice) =>
      s.tom({ frequencia, inicio: indice * 0.045, duracao: 0.045, ganho: V * 0.35, forma: "square", ataque: 0.005 }),
    );
    s.ruido({ inicio: 0.14, duracao: 0.015, ganho: V * 0.25, frequencia: 3000, q: 2 });
  },

  // Computador ligando: ventoinha, cabeça do HD procurando e o bip de inicialização.
  boot: (s) => {
    s.ruido({ inicio: 0, duracao: 1.7, ganho: V * 0.35, filtro: "lowpass", frequencia: 180, frequenciaFinal: 520, q: 0.8, ataque: 0.5 });
    s.tom({ frequencia: 55, frequenciaFinal: 110, inicio: 0, duracao: 1.5, ganho: V * 0.25, forma: "sine", ataque: 0.4 });
    [0.25, 0.33, 0.38, 0.52, 0.6, 0.71, 0.76, 0.9].forEach((inicio) =>
      s.ruido({ inicio, duracao: 0.02, ganho: V * 0.35, frequencia: 1400, q: 3 }),
    );
    s.tom({ frequencia: 1000, inicio: 1.1, duracao: 0.16, ganho: V * 0.45, forma: "square", ataque: 0.005 });
    [523.25, 783.99, 1046.5].forEach((frequencia, indice) =>
      s.tom({ frequencia, inicio: 1.35 + indice * 0.08, duracao: 0.14, ganho: V * 0.4, forma: "triangle" }),
    );
  },
  dormir: (s) => {
    s.tom({ frequencia: 620, frequenciaFinal: 300, inicio: 0, duracao: 0.5, ganho: V * 0.45, forma: "triangle", ataque: 0.05 });
    s.tom({ frequencia: 196, inicio: 0.6, duracao: 0.3, ganho: V * 0.25, forma: "sine", ataque: 0.05 });
    s.tom({ frequencia: 175, inicio: 1.0, duracao: 0.35, ganho: V * 0.2, forma: "sine", ataque: 0.05 });
  },
  acordar: (s) => {
    s.tom({ frequencia: 300, frequenciaFinal: 720, inicio: 0, duracao: 0.25, ganho: V * 0.45, forma: "triangle", ataque: 0.02 });
    s.tom({ frequencia: 880, inicio: 0.28, duracao: 0.1, ganho: V * 0.4, forma: "square", ataque: 0.005 });
    s.tom({ frequencia: 1174.66, inicio: 0.38, duracao: 0.14, ganho: V * 0.4, forma: "square", ataque: 0.005 });
  },
  // Batida seca e um "boing".
  esbarrao: (s) => {
    s.tom({ frequencia: 120, frequenciaFinal: 50, inicio: 0, duracao: 0.16, ganho: V * 1.4, forma: "sine", ataque: 0.005 });
    s.ruido({ inicio: 0, duracao: 0.06, ganho: V * 0.7, filtro: "lowpass", frequencia: 600, q: 0.8 });
    s.tom({ frequencia: 220, frequenciaFinal: 440, inicio: 0.1, duracao: 0.1, ganho: V * 0.6, forma: "triangle", ataque: 0.005 });
    s.tom({ frequencia: 440, frequenciaFinal: 260, inicio: 0.2, duracao: 0.1, ganho: V * 0.5, forma: "triangle", ataque: 0.005 });
    s.tom({ frequencia: 260, frequenciaFinal: 360, inicio: 0.3, duracao: 0.1, ganho: V * 0.4, forma: "triangle", ataque: 0.005 });
    s.tom({ frequencia: 360, frequenciaFinal: 300, inicio: 0.4, duracao: 0.14, ganho: V * 0.3, forma: "triangle", ataque: 0.005 });
  },
  // Som antigo de conclusão, igual.
  "fase-concluida": conclusaoAntiga,
  "fez-sozinho": conclusaoAntiga,
  // Fanfarra maior: arpejo mais longo, baixo e acorde final segurado.
  "unidade-concluida": (s) => {
    const notas = [392, 523.25, 659.25, 783.99, 1046.5, 1318.51];
    notas.forEach((frequencia, indice) => {
      s.tom({ frequencia, inicio: indice * 0.1, duracao: 0.22, ganho: V, forma: "triangle" });
      s.tom({ frequencia, inicio: indice * 0.1, duracao: 0.1, ganho: V * 0.25, forma: "square", ataque: 0.005 });
    });
    [1046.5, 1318.51, 1567.98].forEach((frequencia) =>
      s.tom({ frequencia, inicio: 0.66, duracao: 1.0, ganho: V * 0.5, forma: "triangle", ataque: 0.02 }),
    );
    s.tom({ frequencia: 130.81, inicio: 0.66, duracao: 1.0, ganho: V * 0.7, forma: "triangle", ataque: 0.02 });
  },
  // Brilho de algo se abrindo: arpejo rápido subindo e faísca.
  desbloqueio: (s) => {
    [880, 987.77, 1174.66, 1318.51, 1567.98, 1760, 2093].forEach((frequencia, indice) =>
      s.tom({ frequencia, inicio: indice * 0.045, duracao: 0.12, ganho: V * 0.4, forma: "sine", ataque: 0.005 }),
    );
    s.ruido({ inicio: 0.05, duracao: 0.45, ganho: V * 0.15, filtro: "highpass", frequencia: 5000, q: 0.7, ataque: 0.1 });
  },
  // Sininho de conquista.
  insignia: (s) => {
    s.tom({ frequencia: 1318.51, inicio: 0, duracao: 0.6, ganho: V * 0.6, forma: "sine", ataque: 0.005 });
    s.tom({ frequencia: 2637, inicio: 0, duracao: 0.3, ganho: V * 0.2, forma: "sine", ataque: 0.005 });
    s.tom({ frequencia: 1567.98, inicio: 0.18, duracao: 0.8, ganho: V * 0.6, forma: "sine", ataque: 0.005 });
    s.tom({ frequencia: 3136, inicio: 0.18, duracao: 0.4, ganho: V * 0.2, forma: "sine", ataque: 0.005 });
  },
  "entrar-mapa": (s) => {
    s.ruido({ inicio: 0, duracao: 0.35, ganho: V * 0.2, frequencia: 600, frequenciaFinal: 1800, q: 0.9, ataque: 0.1 });
    [392, 523.25, 659.25].forEach((frequencia, indice) =>
      s.tom({ frequencia, inicio: 0.18 + indice * 0.1, duracao: 0.18, ganho: V * 0.6, forma: "triangle" }),
    );
  },
  // Barquinho partindo: onda do mar e dois tons de apito subindo.
  "viagem-ilha": (s) => {
    s.ruido({ inicio: 0, duracao: 0.6, ganho: V * 0.25, frequencia: 400, frequenciaFinal: 1200, q: 0.8, ataque: 0.2 });
    s.tom({ frequencia: 392, inicio: 0.1, duracao: 0.2, ganho: V * 0.35, forma: "square", ataque: 0.01 });
    s.tom({ frequencia: 587.33, inicio: 0.32, duracao: 0.28, ganho: V * 0.35, forma: "square", ataque: 0.01 });
  },
  // Rangido de porta antiga e um acorde calmo de museu.
  "abrir-museu": (s) => {
    const passos = 9;
    for (let indice = 0; indice < passos; indice++) {
      const base = 85 + ((indice * 37) % 60);
      s.tom({
        frequencia: base,
        frequenciaFinal: base * 1.25,
        inicio: indice * 0.075,
        duracao: 0.07,
        ganho: V * (0.35 + (indice % 3) * 0.1),
        forma: "sawtooth",
        ataque: 0.005,
      });
    }
    s.ruido({ inicio: 0, duracao: 0.7, ganho: V * 0.15, frequencia: 900, q: 4, ataque: 0.05 });
    s.tom({ frequencia: 70, frequenciaFinal: 45, inicio: 0.72, duracao: 0.15, ganho: V * 0.8, forma: "sine", ataque: 0.005 });
    [261.63, 329.63, 392].forEach((frequencia) =>
      s.tom({ frequencia, inicio: 0.9, duracao: 0.9, ganho: V * 0.35, forma: "triangle", ataque: 0.08 }),
    );
  },
};
