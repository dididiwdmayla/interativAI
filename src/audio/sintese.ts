/*
 * Peças de síntese com Web Audio, usadas pelos efeitos e pela voz. Todo som
 * começa e termina com rampa de ganho (mínimo 5 ms) para não estalar.
 */

export const RAMPA_MINIMA = 0.005;
const SILENCIO = 0.0001;

export type OpcoesTom = {
  frequencia: number;
  /** Deslize até esta frequência (rampa exponencial). */
  frequenciaFinal?: number;
  inicio: number;
  duracao: number;
  ganho: number;
  forma?: OscillatorType;
  /** Tempo de subida do ganho (padrão 15 ms, o do som antigo do jogo). */
  ataque?: number;
};

export type OpcoesRuido = {
  inicio: number;
  duracao: number;
  ganho: number;
  filtro?: BiquadFilterType;
  frequencia?: number;
  frequenciaFinal?: number;
  q?: number;
  ataque?: number;
};

const buffersDeRuido = new WeakMap<BaseAudioContext, AudioBuffer>();

/** Um segundo de ruído branco por contexto, reaproveitado por todos. */
function ruidoBranco(ctx: BaseAudioContext): AudioBuffer {
  const pronto = buffersDeRuido.get(ctx);
  if (pronto) return pronto;
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let indice = 0; indice < dados.length; indice++) dados[indice] = Math.random() * 2 - 1;
  buffersDeRuido.set(ctx, buffer);
  return buffer;
}

/** Envelope: sobe em `ataque` e cai exponencialmente até o fim. */
function envelope(ganho: GainNode, inicio: number, duracao: number, pico: number, ataque: number): void {
  const subida = Math.min(Math.max(ataque, RAMPA_MINIMA), Math.max(RAMPA_MINIMA, duracao / 2));
  // O GainNode nasce com ganho 1: sem isto, a primeira amostra do som (antes
  // da automação valer) passa inteira e vira um clique.
  ganho.gain.value = 0;
  ganho.gain.setValueAtTime(SILENCIO, inicio);
  ganho.gain.exponentialRampToValueAtTime(Math.max(pico, SILENCIO * 2), inicio + subida);
  ganho.gain.exponentialRampToValueAtTime(SILENCIO, inicio + Math.max(duracao, subida + RAMPA_MINIMA));
}

export type Sintetizador = {
  readonly ctx: BaseAudioContext;
  tom: (opcoes: OpcoesTom) => void;
  ruido: (opcoes: OpcoesRuido) => void;
  /** Tom com modulação FM suave (usado na voz e em alguns efeitos). */
  fm: (opcoes: OpcoesTom & { razao?: number; indice?: number }) => void;
};

/** Sintetizador que toca em `destino`, a partir do tempo `t0` do contexto. */
export function criarSintetizador(ctx: BaseAudioContext, destino: AudioNode, t0: number): Sintetizador {
  const tom = ({ frequencia, frequenciaFinal, inicio, duracao, ganho, forma = "sine", ataque = 0.015 }: OpcoesTom) => {
    const comeco = t0 + inicio;
    const oscilador = ctx.createOscillator();
    const volume = ctx.createGain();
    oscilador.type = forma;
    oscilador.frequency.setValueAtTime(frequencia, comeco);
    if (frequenciaFinal !== undefined) oscilador.frequency.exponentialRampToValueAtTime(frequenciaFinal, comeco + duracao);
    envelope(volume, comeco, duracao, ganho, ataque);
    oscilador.connect(volume);
    volume.connect(destino);
    oscilador.start(comeco);
    oscilador.stop(comeco + duracao + 0.03);
  };

  const ruido = ({
    inicio,
    duracao,
    ganho,
    filtro = "bandpass",
    frequencia = 2000,
    frequenciaFinal,
    q = 1.2,
    ataque = RAMPA_MINIMA,
  }: OpcoesRuido) => {
    const comeco = t0 + inicio;
    const fonte = ctx.createBufferSource();
    fonte.buffer = ruidoBranco(ctx);
    const passa = ctx.createBiquadFilter();
    passa.type = filtro;
    passa.frequency.setValueAtTime(frequencia, comeco);
    if (frequenciaFinal !== undefined) passa.frequency.exponentialRampToValueAtTime(frequenciaFinal, comeco + duracao);
    passa.Q.value = q;
    const volume = ctx.createGain();
    envelope(volume, comeco, duracao, ganho, ataque);
    fonte.connect(passa);
    passa.connect(volume);
    volume.connect(destino);
    // Começa num ponto qualquer do buffer para cada rajada soar diferente.
    fonte.start(comeco, Math.random() * 0.5);
    fonte.stop(comeco + duracao + 0.03);
  };

  const fm = ({ razao = 2, indice = 0.8, ...opcoes }: OpcoesTom & { razao?: number; indice?: number }) => {
    const comeco = t0 + opcoes.inicio;
    const fim = comeco + opcoes.duracao;
    const portadora = ctx.createOscillator();
    const moduladora = ctx.createOscillator();
    const profundidade = ctx.createGain();
    const volume = ctx.createGain();
    portadora.type = "sine";
    moduladora.type = "sine";
    portadora.frequency.setValueAtTime(opcoes.frequencia, comeco);
    moduladora.frequency.setValueAtTime(opcoes.frequencia * razao, comeco);
    profundidade.gain.setValueAtTime(opcoes.frequencia * indice, comeco);
    if (opcoes.frequenciaFinal !== undefined) {
      portadora.frequency.exponentialRampToValueAtTime(opcoes.frequenciaFinal, fim);
      moduladora.frequency.exponentialRampToValueAtTime(opcoes.frequenciaFinal * razao, fim);
    }
    envelope(volume, comeco, opcoes.duracao, opcoes.ganho, opcoes.ataque ?? RAMPA_MINIMA);
    moduladora.connect(profundidade);
    profundidade.connect(portadora.frequency);
    portadora.connect(volume);
    volume.connect(destino);
    moduladora.start(comeco);
    portadora.start(comeco);
    moduladora.stop(fim + 0.03);
    portadora.stop(fim + 0.03);
  };

  return { ctx, tom, ruido, fm };
}
