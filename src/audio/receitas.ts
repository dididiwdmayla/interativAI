import type { IdEfeito } from "./efeitos";
import type { Sintetizador } from "./sintese";

/*
 * Versão sintetizada de cada efeito. Os quatro sons que o jogo já tinha
 * (clique, acerto, conclusão e aviso, do antigo src/lib/som.ts) foram
 * trazidos iguais: mesmas notas, formas e envelope. Os de momentos grandes,
 * no espírito chiptune de computador antigo das músicas, são a reserva dos
 * arquivos gravados (public/audio/efeitos/efeitos.json): tocam se o arquivo
 * não carregar.
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

/** Um "toc" de madeira (o tear batendo a trama). */
function tocDeMadeira(s: Sintetizador, inicio: number, forca = 1): void {
  s.tom({ frequencia: variar(210, 0.06), frequenciaFinal: 150, inicio, duracao: 0.06, ganho: V * 0.5 * forca, forma: "triangle", ataque: 0.004 });
  s.ruido({ inicio, duracao: 0.03, ganho: V * 0.3 * forca, filtro: "lowpass", frequencia: 1200, q: 0.8 });
}

/** O tique de uma engrenagem (relojoaria). */
function tiqueDeEngrenagem(s: Sintetizador, inicio: number, forca = 1): void {
  s.ruido({ inicio, duracao: 0.012, ganho: V * 0.45 * forca, filtro: "highpass", frequencia: 3800, q: 0.9 });
  s.tom({ frequencia: variar(1900, 0.05), inicio, duracao: 0.02, ganho: V * 0.15 * forca, forma: "sine", ataque: 0.004 });
}

/** O estalo de um relé (os computadores de válvulas). */
function estaloDeRele(s: Sintetizador, inicio: number, forca = 1): void {
  s.ruido({ inicio, duracao: 0.016, ganho: V * 0.5 * forca, frequencia: variar(2400, 0.1), q: 3 });
}

/** Notas do arpejo de 8 bits (uma escala pentatônica alegre). */
const PENTATONICA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];

const RECEITAS_DO_MUSEU: Readonly<Record<Extract<
    IdEfeito,
    `fala-${string}` | `epoca-${string}` | "furar-cartao" | "acender-bit" | "encaixar-cartao" | "proxima-geracao" | "rodar-programa" | "coral" | "plugar-cabo" | "ciclo-processador" | "pacote-pulo" | "pacote-oceano"
  >, Receita>> = {
  // A voz de cada época: um tique por pedaço da fala (com limite de taxa no componente).
  "fala-tear": (s) => tocDeMadeira(s, 0, 0.7),
  "fala-engrenagem": (s) => tiqueDeEngrenagem(s, 0, 0.8),
  "fala-valvula": (s) => {
    estaloDeRele(s, 0, 0.8);
    s.tom({ frequencia: 110, inicio: 0, duracao: 0.14, ganho: V * 0.12, forma: "sawtooth", ataque: 0.01 });
    s.tom({ frequencia: variar(880, 0.04), inicio: 0.01, duracao: 0.06, ganho: V * 0.12, forma: "sine", ataque: 0.005 });
  },
  "fala-terminal": (s) => {
    s.ruido({ inicio: 0, duracao: 0.01, ganho: V * 0.35, frequencia: 3500, q: 2 });
    s.tom({ frequencia: 1200, inicio: 0.005, duracao: 0.022, ganho: V * 0.16, forma: "square", ataque: 0.004 });
  },
  "fala-8bit": (s) => {
    const nota = PENTATONICA[Math.floor(Math.random() * PENTATONICA.length)];
    s.tom({ frequencia: nota, inicio: 0, duracao: 0.045, ganho: V * 0.22, forma: "square", ataque: 0.004 });
  },
  "fala-modem": (s) => {
    s.fm({ frequencia: variar(1300, 0.15), frequenciaFinal: variar(2100, 0.1), inicio: 0, duracao: 0.04, ganho: V * 0.14, razao: 1.5, indice: 1.2 });
  },
  "fala-notificacao": (s) => {
    s.tom({ frequencia: 1318.51, inicio: 0, duracao: 0.14, ganho: V * 0.4, forma: "sine", ataque: 0.004 });
    s.tom({ frequencia: 1760, inicio: 0.08, duracao: 0.22, ganho: V * 0.4, forma: "sine", ataque: 0.004 });
  },

  // Cada antepassado acordando no corredor: a assinatura da época dele.
  // A tecelã: a lançadeira passando, a batida da trama e uma caixinha de música.
  "epoca-tecela": (s) => {
    s.ruido({ inicio: 0, duracao: 0.35, ganho: V * 0.25, frequencia: 600, frequenciaFinal: 2400, q: 1.5, ataque: 0.08 });
    tocDeMadeira(s, 0.36, 1);
    tocDeMadeira(s, 0.52, 0.8);
    [783.99, 987.77, 1174.66, 1567.98].forEach((frequencia, i) => s.tom({ frequencia, inicio: 0.7 + i * 0.13, duracao: 0.5, ganho: V * 0.3, forma: "sine", ataque: 0.004 }));
  },
  // A sonhadora: a catraca acelerando e um sino de relógio.
  "epoca-engrenagens": (s) => {
    [0, 0.14, 0.26, 0.36, 0.44, 0.51, 0.57, 0.62, 0.66].forEach((inicio) => tiqueDeEngrenagem(s, inicio, 1));
    s.tom({ frequencia: 1567.98, inicio: 0.75, duracao: 1.1, ganho: V * 0.35, forma: "sine", ataque: 0.004 });
    s.tom({ frequencia: 3135.96, inicio: 0.75, duracao: 0.6, ganho: V * 0.1, forma: "sine", ataque: 0.004 });
  },
  // O gigante: o zumbido ligando, as válvulas esquentando e os relés estalando.
  "epoca-valvulas": (s) => {
    s.tom({ frequencia: 45, frequenciaFinal: 110, inicio: 0, duracao: 1.2, ganho: V * 0.3, forma: "sawtooth", ataque: 0.3 });
    s.tom({ frequencia: 220, frequenciaFinal: 440, inicio: 0.2, duracao: 0.8, ganho: V * 0.18, forma: "triangle", ataque: 0.3 });
    [0.35, 0.42, 0.5, 0.71, 0.76, 0.95, 1.02].forEach((inicio) => estaloDeRele(s, inicio, 1));
  },
  // O terminal: o tubo de imagem ligando e três bipes secos.
  "epoca-terminal": (s) => {
    s.tom({ frequencia: 70, frequenciaFinal: 38, inicio: 0, duracao: 0.25, ganho: V * 0.9, forma: "sine", ataque: 0.005 });
    s.tom({ frequencia: 7800, inicio: 0.05, duracao: 0.6, ganho: V * 0.03, forma: "sine", ataque: 0.1 });
    [0.45, 0.62, 0.79].forEach((inicio) => s.tom({ frequencia: 1000, inicio, duracao: 0.07, ganho: V * 0.35, forma: "square", ataque: 0.004 }));
  },
  // O PC bege: a leitura do disquete e o arpejo de 8 bits de "pronto".
  "epoca-pc": (s) => {
    [0, 0.06, 0.1, 0.18, 0.22, 0.3].forEach((inicio) => s.ruido({ inicio, duracao: 0.03, ganho: V * 0.35, frequencia: 900, q: 4 }));
    s.tom({ frequencia: 65, inicio: 0, duracao: 0.4, ganho: V * 0.25, forma: "square", ataque: 0.01 });
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((frequencia, i) => s.tom({ frequencia, inicio: 0.5 + i * 0.07, duracao: 0.09, ganho: V * 0.35, forma: "square", ataque: 0.004 }));
  },
  // A internet discada: os tons de discar, o chiado do modem e a conexão.
  "epoca-internet": (s) => {
    [
      [697, 1209],
      [770, 1336],
      [852, 1477],
    ].forEach(([baixa, alta], i) => {
      s.tom({ frequencia: baixa, inicio: i * 0.11, duracao: 0.08, ganho: V * 0.25, forma: "sine", ataque: 0.004 });
      s.tom({ frequencia: alta, inicio: i * 0.11, duracao: 0.08, ganho: V * 0.25, forma: "sine", ataque: 0.004 });
    });
    s.fm({ frequencia: 1000, frequenciaFinal: 2300, inicio: 0.4, duracao: 0.35, ganho: V * 0.22, razao: 1.37, indice: 2.4 });
    s.ruido({ inicio: 0.75, duracao: 0.3, ganho: V * 0.3, filtro: "bandpass", frequencia: 2200, q: 0.6 });
    s.tom({ frequencia: 1046.5, inicio: 1.1, duracao: 0.4, ganho: V * 0.3, forma: "triangle", ataque: 0.01 });
  },
  // O celular: a vibração e o toque de notificação.
  "epoca-celular": (s) => {
    [0, 0.09, 0.18, 0.4, 0.49, 0.58].forEach((inicio) => s.tom({ frequencia: 150, inicio, duracao: 0.07, ganho: V * 0.35, forma: "sawtooth", ataque: 0.005 }));
    [1174.66, 1567.98, 2093].forEach((frequencia, i) => s.tom({ frequencia, inicio: 0.8 + i * 0.09, duracao: 0.3, ganho: V * 0.35, forma: "sine", ataque: 0.004 }));
  },

  // As peças das exposições.
  "furar-cartao": (s) => {
    s.ruido({ inicio: 0, duracao: 0.05, ganho: V * 0.6, filtro: "lowpass", frequencia: 2500, q: 0.8 });
    s.tom({ frequencia: 160, frequenciaFinal: 80, inicio: 0, duracao: 0.08, ganho: V * 0.6, forma: "sine", ataque: 0.004 });
  },
  "acender-bit": (s) => {
    estaloDeRele(s, 0, 0.7);
    s.tom({ frequencia: 660, frequenciaFinal: 880, inicio: 0.01, duracao: 0.09, ganho: V * 0.35, forma: "triangle", ataque: 0.005 });
  },
  "encaixar-cartao": (s) => {
    tocDeMadeira(s, 0, 0.9);
    tocDeMadeira(s, 0.07, 0.6);
  },
  // O lugar da próxima geração ocupado: um acorde que cresce, a família inteira junta e um brilho.
  "proxima-geracao": (s) => {
    [261.63, 329.63, 392, 493.88, 523.25, 659.25, 783.99, 1046.5].forEach((frequencia, i) =>
      s.tom({ frequencia, inicio: i * 0.12, duracao: 1.6 - i * 0.08, ganho: V * 0.32, forma: "triangle", ataque: 0.02 }),
    );
    [130.81, 196, 261.63].forEach((frequencia) => s.tom({ frequencia, inicio: 0.9, duracao: 2.2, ganho: V * 0.3, forma: "sine", ataque: 0.4 }));
    [1046.5, 1318.51, 1567.98, 2093].forEach((frequencia) => s.tom({ frequencia, inicio: 1.1, duracao: 1.8, ganho: V * 0.18, forma: "sine", ataque: 0.3 }));
    s.ruido({ inicio: 1.0, duracao: 1.4, ganho: V * 0.12, filtro: "highpass", frequencia: 6000, q: 0.7, ataque: 0.4 });
  },

  // As salas 3 a 6.
  // Rodar um programa: três bipes rápidos subindo, como um computador "pensando".
  "rodar-programa": (s) => {
    [880, 1174.66, 1567.98].forEach((frequencia, i) => s.tom({ frequencia, inicio: i * 0.05, duracao: 0.05, ganho: V * 0.3, forma: "square", ataque: 0.004 }));
  },
  // O fim do coral: a família inteira na mesma nota, cada um com o seu timbre de época.
  coral: (s) => {
    const notas = [261.63, 329.63, 392, 523.25];
    (["triangle", "square", "sawtooth", "sine"] as const).forEach((forma, i) =>
      notas.forEach((frequencia) => s.tom({ frequencia: frequencia * (i === 3 ? 2 : 1), inicio: i * 0.06, duracao: 1.4, ganho: V * 0.12, forma, ataque: 0.05 })),
    );
    tocDeMadeira(s, 0, 0.6);
    estaloDeRele(s, 0.05, 0.6);
  },
  // Plugar um cabo no painel do gigante: o tranco do plugue e o relé.
  "plugar-cabo": (s) => {
    s.tom({ frequencia: 110, frequenciaFinal: 70, inicio: 0, duracao: 0.09, ganho: V * 0.7, forma: "sine", ataque: 0.003 });
    s.ruido({ inicio: 0, duracao: 0.04, ganho: V * 0.4, filtro: "lowpass", frequencia: 1800, q: 0.8 });
    estaloDeRele(s, 0.06, 0.8);
  },
  // Uma etapa do ciclo do processador: o tique do relógio.
  "ciclo-processador": (s) => {
    s.tom({ frequencia: 1320, inicio: 0, duracao: 0.03, ganho: V * 0.3, forma: "square", ataque: 0.003 });
    s.tom({ frequencia: 660, inicio: 0.04, duracao: 0.03, ganho: V * 0.2, forma: "square", ataque: 0.003 });
  },
  // O pacote pula de um roteador para outro.
  "pacote-pulo": (s) => s.tom({ frequencia: 700, frequenciaFinal: 1400, inicio: 0, duracao: 0.08, ganho: V * 0.35, forma: "sine", ataque: 0.004 }),
  // O pacote atravessa o oceano pelo cabo submarino: um mergulho com bolhas.
  "pacote-oceano": (s) => {
    s.tom({ frequencia: 900, frequenciaFinal: 180, inicio: 0, duracao: 0.5, ganho: V * 0.35, forma: "sine", ataque: 0.01 });
    [0.15, 0.27, 0.36, 0.5].forEach((inicio, i) => s.tom({ frequencia: variar(500 + i * 120, 0.1), frequenciaFinal: 900 + i * 150, inicio, duracao: 0.06, ganho: V * 0.18, forma: "sine", ataque: 0.004 }));
    s.tom({ frequencia: 180, frequenciaFinal: 900, inicio: 0.6, duracao: 0.4, ganho: V * 0.3, forma: "sine", ataque: 0.01 });
  },
};

export const RECEITAS: Readonly<Record<IdEfeito, Receita>> = {
  ...RECEITAS_DO_MUSEU,
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
