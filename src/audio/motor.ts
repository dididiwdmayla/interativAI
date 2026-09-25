import { EFEITOS_GRANDES, fonteDoEfeito, type IdEfeito, resolverEfeito } from "./efeitos";
import {
  arquivoNoFormato,
  escolherFormato,
  type FormatoAudio,
  lerManifestoEfeitos,
  lerManifestoMusicas,
  MANIFESTO_EFEITOS_VAZIO,
  MANIFESTO_MUSICAS_VAZIO,
  type ManifestoEfeitos,
  type ManifestoMusicas,
  URL_MANIFESTO_EFEITOS,
  URL_MANIFESTO_MUSICAS,
} from "./manifestos";
import { RECEITAS } from "./receitas";
import { criarSintetizador, RAMPA_MINIMA } from "./sintese";
import { faixaTocavel, type TelaDoJogo } from "./telas";
import { tocarEventosVoz } from "./tocadorVoz";
import { duracaoDaFala, gerarFala, type HumorVoz, PASSA_BAIXA_VOZ } from "./vozModem";

/*
 * Motor de áudio do jogo, sem React. Um único AudioContext, criado ou
 * retomado no primeiro gesto do jogador (liberarAudio). Antes disso, nada
 * toca e nada reclama: só os manifestos e o arquivo do boot são baixados
 * (prepararAudio), para o boot estar pronto no primeiro gesto.
 *
 * Grafo:
 *   música (faixas) -> barramento música -> abaixar (ducking) -\
 *   efeitos -------------------------> barramento efeitos ------> master -> saída
 *   voz -> passa-baixa --------------> barramento voz ---------/
 */

export type AjustesAudio = {
  /** Silenciar tudo. */
  mudo: boolean;
  /** Volumes de 0 a 1. */
  musica: number;
  efeitos: number;
  voz: number;
};

export const AJUSTES_AUDIO_PADRAO: AjustesAudio = { mudo: false, musica: 0.5, efeitos: 0.7, voz: 0.7 };

/** Crossfade entre faixas de telas diferentes. */
export const CROSSFADE_MUSICA = 1.5;
/** Quanto a música abaixa enquanto o computadorzinho fala (-6 dB). */
const GANHO_DUCKING = 0.5;
/**
 * Ajuste de cada barramento sobre o volume do jogador, medido contra as
 * músicas (-18 LUFS): nos padrões (música 50%, efeitos e voz 70%), a voz
 * fica uns 3 dB acima da música abaixada pelo ducking, e os efeitos de
 * interação um pouco abaixo da música.
 */
const REFERENCIA = { musica: 1, efeitos: 4, voz: 7 } as const;
/**
 * Ganho dos efeitos em arquivo no barramento de efeitos. Os arquivos vêm
 * normalizados em -16 LUFS e as músicas em -18; com os barramentos nos
 * padrões (música 0,25, efeitos 1,96), 0,13 devolve a diferença de 2 dB
 * entre os dois (efeito gravado um pouco acima da música), perto das
 * fanfarras sintetizadas (medições em docs/AUDIO.md).
 */
const GANHO_ARQUIVO_EFEITO = 0.13;
/**
 * Arquivos de efeito guardados decodificados (os mais recentes). Os 11 dos
 * momentos grandes somam uns 21 s de mono, cerca de 4 MB decodificados.
 */
const CACHE_EFEITOS = 16;

type Barramentos = {
  master: GainNode;
  musica: GainNode;
  abaixar: GainNode;
  efeitos: GainNode;
  voz: GainNode;
  passaBaixaVoz: BiquadFilterNode;
};

type FaixaTocando = { faixa: string; fonte: AudioBufferSourceNode; ganho: GainNode };

type VozTocando = { id: number; chave: string; inicio: number; fim: number; ganho: GainNode };

let contexto: AudioContext | null = null;
let barramentos: Barramentos | null = null;
let liberado = false;
let ajustes: AjustesAudio = AJUSTES_AUDIO_PADRAO;
let formato: FormatoAudio | null = null;

let manifestoMusicas: ManifestoMusicas | null = null;
let carregandoMusicas: Promise<ManifestoMusicas> | null = null;
let manifestoEfeitos: ManifestoEfeitos = MANIFESTO_EFEITOS_VAZIO;
let manifestoEfeitosPronto = false;
let carregandoEfeitos: Promise<void> | null = null;
/** Decodifica arquivos antes do primeiro gesto (não conta para a política de autoplay). */
let decodificadorOffline: BaseAudioContext | null = null;

// Música.
let telaAtual: TelaDoJogo | null = null;
let faixaDesejada: string | null = null;
let tocando: FaixaTocando | null = null;
const saindo = new Set<FaixaTocando>();
/** Faixas decodificadas: no máximo a atual e a que está entrando. */
const buffersMusica = new Map<string, AudioBuffer>();
let pedidoMusica = 0;

// Voz.
let voz: VozTocando | null = null;
let proximaVoz = 1;

// Efeitos em arquivo.
const buffersEfeitos = new Map<string, AudioBuffer>();
const carregandoEfeito = new Map<string, Promise<AudioBuffer | null>>();

// Teclas.
let ultimaTecla = 0;

function temJanela(): boolean {
  return typeof window !== "undefined";
}

function ganhoDoVolume(volume: number): number {
  const limitado = Math.min(1, Math.max(0, volume));
  return limitado * limitado;
}

/** Leva um parâmetro até `valor` com rampa curta, sem estalo. */
function rampa(parametro: AudioParam, valor: number, agora: number, duracao = 0.03): void {
  parametro.cancelScheduledValues(agora);
  parametro.setValueAtTime(parametro.value, agora);
  parametro.linearRampToValueAtTime(valor, agora + Math.max(RAMPA_MINIMA, duracao));
}

function formatoDoNavegador(): FormatoAudio {
  if (formato) return formato;
  const elemento = document.createElement("audio");
  formato = escolherFormato((tipo) => elemento.canPlayType(tipo));
  return formato;
}

/** decodeAudioData com promessa, também no Safari antigo (que só aceita callbacks). */
function decodificar(ctx: BaseAudioContext, bytes: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise((resolver, rejeitar) => {
    const promessa = ctx.decodeAudioData(bytes, resolver, rejeitar) as Promise<AudioBuffer> | undefined;
    promessa?.then(resolver, rejeitar);
  });
}

/**
 * Onde decodificar: no AudioContext, se já existe; antes do primeiro gesto,
 * num OfflineAudioContext (o AudioBuffer serve para qualquer contexto).
 */
function contextoDeDecodificacao(): BaseAudioContext | null {
  if (contexto) return contexto;
  if (decodificadorOffline) return decodificadorOffline;
  const Offline =
    window.OfflineAudioContext ??
    (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  if (!Offline) return null;
  try {
    decodificadorOffline = new Offline(1, 1, 48000);
  } catch {
    return null;
  }
  return decodificadorOffline;
}

function criarGrafo(ctx: AudioContext): Barramentos {
  const master = ctx.createGain();
  const musica = ctx.createGain();
  const abaixar = ctx.createGain();
  const efeitos = ctx.createGain();
  const vozBus = ctx.createGain();
  const passaBaixaVoz = ctx.createBiquadFilter();
  passaBaixaVoz.type = "lowpass";
  passaBaixaVoz.frequency.value = PASSA_BAIXA_VOZ;
  passaBaixaVoz.Q.value = 0.7;
  musica.connect(abaixar);
  abaixar.connect(master);
  efeitos.connect(master);
  passaBaixaVoz.connect(vozBus);
  vozBus.connect(master);
  master.connect(ctx.destination);
  const grafo = { master, musica, abaixar, efeitos, voz: vozBus, passaBaixaVoz };
  aplicarGanhos(grafo, ctx.currentTime, true);
  return grafo;
}

function aplicarGanhos(grafo: Barramentos, agora: number, imediato = false): void {
  const valores: [AudioParam, number][] = [
    [grafo.master.gain, ajustes.mudo ? 0 : 1],
    [grafo.musica.gain, ganhoDoVolume(ajustes.musica) * REFERENCIA.musica],
    [grafo.efeitos.gain, ganhoDoVolume(ajustes.efeitos) * REFERENCIA.efeitos],
    [grafo.voz.gain, ganhoDoVolume(ajustes.voz) * REFERENCIA.voz],
  ];
  for (const [parametro, valor] of valores) {
    if (imediato) parametro.value = valor;
    else rampa(parametro, valor, agora, 0.05);
  }
}

function aoMudarVisibilidade(): void {
  if (!contexto) return;
  if (document.hidden) {
    void contexto.suspend().catch(() => {});
  } else if (liberado) {
    void contexto.resume().catch(() => {});
  }
}

/**
 * Chamar a partir de um gesto do jogador (clique, toque, tecla). Cria o
 * AudioContext na primeira vez e o retoma se estiver suspenso.
 */
export function liberarAudio(): void {
  if (!temJanela()) return;
  if (!contexto) {
    const Construtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Construtor) return;
    try {
      contexto = new Construtor();
    } catch {
      return;
    }
    barramentos = criarGrafo(contexto);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
  }
  const primeiraVez = !liberado;
  liberado = true;
  if (contexto.state === "suspended" && !document.hidden) void contexto.resume().catch(() => {});
  if (primeiraVez) {
    decodificadorOffline = null;
    preCarregarEfeitosGrandes();
    if (telaAtual) void resolverMusica();
  }
}

/**
 * Antes do primeiro gesto: baixa os manifestos e, na tela inicial, o arquivo
 * do boot, já decodificado, para ele tocar no primeiro gesto. Não cria o
 * AudioContext nem toca nada.
 */
export function prepararAudio({ boot }: { boot: boolean }): void {
  if (!temJanela()) return;
  void obterManifestoMusicas();
  void carregarManifestoEfeitos().then(() => {
    if (!boot || liberado) return;
    const fonte = fonteDoEfeito("boot", manifestoEfeitos, formatoDoNavegador());
    if (fonte.tipo === "arquivo") void carregarEfeito(fonte.url);
  });
}

export function audioLiberado(): boolean {
  return liberado;
}

/** Volumes e mudo do jogador (vêm do progresso salvo). */
export function definirAjustes(novos: AjustesAudio): void {
  const antes = ajustes;
  ajustes = novos;
  if (contexto && barramentos) aplicarGanhos(barramentos, contexto.currentTime);
  const audivelAntes = !antes.mudo && antes.musica > 0;
  const audivelAgora = musicaAudivel();
  if (audivelAntes !== audivelAgora) mudarFaixa(faixaDesejada);
  if (novos.mudo || novos.voz <= 0) calar();
}

function podeTocar(barramento: "efeitos" | "voz" | "musica"): boolean {
  if (!liberado || !contexto || !barramentos || contexto.state === "closed") return false;
  if (typeof document !== "undefined" && document.hidden) return false;
  return !ajustes.mudo && ajustes[barramento] > 0;
}

function musicaAudivel(): boolean {
  return !ajustes.mudo && ajustes.musica > 0;
}

// ---------------------------------------------------------------- música

async function obterManifestoMusicas(): Promise<ManifestoMusicas> {
  if (manifestoMusicas) return manifestoMusicas;
  if (!carregandoMusicas) {
    carregandoMusicas = fetch(URL_MANIFESTO_MUSICAS)
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((bruto: unknown) => lerManifestoMusicas(bruto))
      .catch(() => MANIFESTO_MUSICAS_VAZIO)
      .then((lido) => {
        manifestoMusicas = lido;
        return lido;
      });
  }
  return carregandoMusicas;
}

/** A tela atual do jogo. Decide a música pela tabela de telas.ts. */
export function definirTelaMusical(tela: TelaDoJogo): void {
  telaAtual = tela;
  if (liberado) void resolverMusica();
}

async function resolverMusica(): Promise<void> {
  const tela = telaAtual;
  if (!tela) return;
  const manifesto = await obterManifestoMusicas();
  if (tela !== telaAtual) return;
  mudarFaixa(faixaTocavel(tela, manifesto));
}

function marcarFaixaNaPagina(faixa: string | null): void {
  if (faixa) document.documentElement.dataset.faixaMusica = faixa;
  else delete document.documentElement.dataset.faixaMusica;
}

function tirarDeCena(faixa: FaixaTocando, duracao: number): void {
  if (!contexto) return;
  const agora = contexto.currentTime;
  saindo.add(faixa);
  rampa(faixa.ganho.gain, 0, agora, duracao);
  try {
    faixa.fonte.stop(agora + duracao + 0.05);
  } catch {
    // Já parada.
  }
  faixa.fonte.onended = () => {
    saindo.delete(faixa);
    faixa.ganho.disconnect();
  };
}

function mudarFaixa(faixa: string | null): void {
  faixaDesejada = faixa;
  if (!contexto || !barramentos) return;
  const alvo = musicaAudivel() ? faixa : null;
  // Todo pedido novo invalida carregamentos antigos, mesmo quando a faixa não muda.
  const pedido = ++pedidoMusica;
  // Mesma faixa (outra tela da mesma ilha): continua tocando, sem reiniciar.
  if (tocando && tocando.faixa === alvo) return;
  if (alvo === null) {
    if (tocando) tirarDeCena(tocando, CROSSFADE_MUSICA);
    tocando = null;
    for (const chave of buffersMusica.keys()) buffersMusica.delete(chave);
    marcarFaixaNaPagina(null);
    return;
  }
  void carregarFaixa(alvo, pedido).then((buffer) => {
    if (!buffer || pedido !== pedidoMusica) return;
    comecarFaixa(alvo, buffer);
  });
}

async function carregarFaixa(faixa: string, pedido: number): Promise<AudioBuffer | null> {
  const pronto = buffersMusica.get(faixa);
  if (pronto) return pronto;
  const manifesto = await obterManifestoMusicas();
  const dados = manifesto.faixas[faixa];
  const url = dados ? arquivoNoFormato(dados.arquivos, formatoDoNavegador()) : null;
  if (!url || !contexto) return null;
  try {
    const resposta = await fetch(url);
    if (!resposta.ok || pedido !== pedidoMusica) return null;
    const bytes = await resposta.arrayBuffer();
    if (pedido !== pedidoMusica || !contexto) return null;
    const buffer = await decodificar(contexto, bytes);
    if (pedido !== pedidoMusica) return null;
    buffersMusica.set(faixa, buffer);
    return buffer;
  } catch {
    // Arquivo faltando ou formato que o navegador não abre: silêncio, sem erro.
    return null;
  }
}

function comecarFaixa(faixa: string, buffer: AudioBuffer): void {
  if (!contexto || !barramentos) return;
  const duracao = manifestoMusicas?.faixas[faixa]?.duracaoSegundos ?? buffer.duration;
  const agora = contexto.currentTime;
  // Quem ainda estava saindo de uma troca anterior sai de vez: no máximo duas faixas vivas.
  for (const velha of saindo) {
    rampa(velha.ganho.gain, 0, agora, 0.05);
    try {
      velha.fonte.stop(agora + 0.08);
    } catch {
      // Já parada.
    }
  }
  if (tocando) tirarDeCena(tocando, CROSSFADE_MUSICA);

  const fonte = contexto.createBufferSource();
  fonte.buffer = buffer;
  fonte.loop = true;
  fonte.loopStart = 0;
  // O fim do loop vem do manifesto, nunca da duração do arquivo.
  fonte.loopEnd = Math.min(duracao, buffer.duration);
  const ganho = contexto.createGain();
  ganho.gain.value = 0;
  ganho.gain.setValueAtTime(0, agora);
  ganho.gain.linearRampToValueAtTime(1, agora + CROSSFADE_MUSICA);
  fonte.connect(ganho);
  ganho.connect(barramentos.musica);
  fonte.start(agora);
  tocando = { faixa, fonte, ganho };
  // Libera as faixas decodificadas que não são a atual (a que sai já tem a sua no nó).
  for (const chave of buffersMusica.keys()) if (chave !== faixa) buffersMusica.delete(chave);
  marcarFaixaNaPagina(faixa);
}

// ---------------------------------------------------------------- voz

/** Música abaixa ~6 dB enquanto a voz toca, com rampas curtas. */
function abaixarMusica(inicio: number, fim: number): void {
  if (!barramentos || !contexto) return;
  const parametro = barramentos.abaixar.gain;
  const agora = contexto.currentTime;
  parametro.cancelScheduledValues(agora);
  parametro.setValueAtTime(parametro.value, agora);
  parametro.linearRampToValueAtTime(GANHO_DUCKING, Math.max(agora + 0.06, inicio));
  parametro.setValueAtTime(GANHO_DUCKING, fim);
  parametro.linearRampToValueAtTime(1, fim + 0.3);
}

function soltarMusica(): void {
  if (!barramentos || !contexto) return;
  rampa(barramentos.abaixar.gain, 1, contexto.currentTime, 0.25);
}

/**
 * O computadorzinho fala. Uma voz por vez: a nova interrompe a anterior
 * com fade curto. Devolve um id para calar só esta fala depois (0 se nada
 * tocou). A mesma fala pedida duas vezes seguidas não recomeça.
 */
export function falar(texto: string, humor: HumorVoz): number {
  if (!texto.trim() || !podeTocar("voz") || !contexto || !barramentos) return 0;
  const agora = contexto.currentTime;
  const chave = `${humor}|${texto}`;
  if (voz && voz.chave === chave && agora - voz.inicio < 0.5) return voz.id;
  interromperVoz(false);
  const eventos = gerarFala(texto, humor);
  const inicio = agora + 0.02;
  const fim = inicio + duracaoDaFala(eventos);
  const ganho = contexto.createGain();
  ganho.gain.value = 1;
  ganho.connect(barramentos.passaBaixaVoz);
  tocarEventosVoz(contexto, ganho, inicio, eventos);
  abaixarMusica(inicio, fim);
  const id = proximaVoz++;
  voz = { id, chave, inicio, fim, ganho };
  const atual = voz;
  setTimeout(
    () => {
      atual.ganho.disconnect();
      if (voz === atual) voz = null;
    },
    (fim - agora + 0.2) * 1000,
  );
  return id;
}

function interromperVoz(devolverMusica: boolean): void {
  if (!voz || !contexto) return;
  const atual = voz;
  voz = null;
  if (contexto.currentTime < atual.fim) {
    rampa(atual.ganho.gain, 0, contexto.currentTime, 0.03);
    setTimeout(() => atual.ganho.disconnect(), 80);
    if (devolverMusica) soltarMusica();
  }
}

/** Cala o computadorzinho na hora (fade curto). Com id, só se ainda for essa fala. */
export function calar(id?: number): void {
  if (id !== undefined && voz?.id !== id) return;
  interromperVoz(true);
}

// ---------------------------------------------------------------- efeitos

async function carregarManifestoEfeitos(): Promise<void> {
  if (!carregandoEfeitos) {
    carregandoEfeitos = fetch(URL_MANIFESTO_EFEITOS)
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((bruto: unknown) => {
        manifestoEfeitos = lerManifestoEfeitos(bruto);
      })
      .catch(() => {
        manifestoEfeitos = MANIFESTO_EFEITOS_VAZIO;
      })
      .finally(() => {
        manifestoEfeitosPronto = true;
      });
  }
  return carregandoEfeitos;
}

/** O arquivo já decodificado, se estiver no cache (e passa a ser o mais recente). */
function efeitoPronto(url: string): AudioBuffer | null {
  const pronto = buffersEfeitos.get(url);
  if (!pronto) return null;
  // Mais recente vai para o fim (o cache solta os mais antigos).
  buffersEfeitos.delete(url);
  buffersEfeitos.set(url, pronto);
  return pronto;
}

function carregarEfeito(url: string): Promise<AudioBuffer | null> {
  const pronto = efeitoPronto(url);
  if (pronto) return Promise.resolve(pronto);
  const emAndamento = carregandoEfeito.get(url);
  if (emAndamento) return emAndamento;
  const ctx = contextoDeDecodificacao();
  if (!ctx) return Promise.resolve(null);
  const promessa = fetch(url)
    .then((resposta) => (resposta.ok ? resposta.arrayBuffer() : Promise.reject(new Error("sem arquivo"))))
    .then((bytes) => decodificar(ctx, bytes))
    .then((buffer) => {
      buffersEfeitos.set(url, buffer);
      while (buffersEfeitos.size > CACHE_EFEITOS) {
        const maisAntigo = buffersEfeitos.keys().next().value;
        if (maisAntigo === undefined) break;
        buffersEfeitos.delete(maisAntigo);
      }
      return buffer;
    })
    .catch(() => null)
    .finally(() => carregandoEfeito.delete(url));
  carregandoEfeito.set(url, promessa);
  return promessa;
}

/** Último efeito tocado e de onde veio, em <html> (usado pelos testes de navegador). */
function marcarEfeitoNaPagina(id: IdEfeito, fonte: "arquivo" | "sintetizado"): void {
  document.documentElement.dataset.ultimoEfeito = id;
  document.documentElement.dataset.ultimoEfeitoFonte = fonte;
}

function tocarSintetizado(id: IdEfeito): void {
  if (!contexto || !barramentos) return;
  RECEITAS[id](criarSintetizador(contexto, barramentos.efeitos, contexto.currentTime + 0.01));
  marcarEfeitoNaPagina(id, "sintetizado");
}

function tocarBuffer(id: IdEfeito, buffer: AudioBuffer, duracaoSegundos: number | null): void {
  if (!contexto || !barramentos) return;
  const agora = contexto.currentTime;
  // O fim vem do manifesto (o container reporta alguns ms a mais), nunca além do arquivo.
  const duracao = Math.max(RAMPA_MINIMA * 2, Math.min(buffer.duration, duracaoSegundos ?? buffer.duration));
  const fonte = contexto.createBufferSource();
  const ganho = contexto.createGain();
  fonte.buffer = buffer;
  ganho.gain.value = 0;
  ganho.gain.setValueAtTime(0, agora);
  ganho.gain.linearRampToValueAtTime(GANHO_ARQUIVO_EFEITO, agora + RAMPA_MINIMA);
  ganho.gain.setValueAtTime(GANHO_ARQUIVO_EFEITO, agora + duracao - RAMPA_MINIMA);
  ganho.gain.linearRampToValueAtTime(0, agora + duracao);
  fonte.connect(ganho);
  ganho.connect(barramentos.efeitos);
  fonte.onended = () => ganho.disconnect();
  fonte.start(agora);
  fonte.stop(agora + duracao + 0.02);
  marcarEfeitoNaPagina(id, "arquivo");
}

/** Última vez (tempo do contexto) que cada momento grande tocou. */
const ultimaVezGrande = new Map<IdEfeito, number>();

export type OpcoesEfeito = {
  /**
   * Tocar agora ou nunca: se o arquivo ainda não estiver decodificado, toca
   * o sintetizado em vez de esperar (o boot no primeiro gesto).
   */
  naHora?: boolean;
};

/**
 * Toca um efeito pelo id: o arquivo, se o efeitos.json tiver entrada para
 * ele (carregado sob demanda, com cache); senão, ou se o arquivo falhar, o
 * sintetizado.
 */
export function tocarEfeito(id: IdEfeito, { naHora = false }: OpcoesEfeito = {}): void {
  if (!podeTocar("efeitos") || !contexto) return;
  // Momento grande pedido duas vezes quase juntas (efeito montado duas vezes) toca uma só.
  if (EFEITOS_GRANDES.includes(id)) {
    const antes = ultimaVezGrande.get(id);
    if (antes !== undefined && contexto.currentTime - antes < 0.2) return;
    ultimaVezGrande.set(id, contexto.currentTime);
  }
  if (!manifestoEfeitosPronto) {
    // O manifesto é pedido antes do primeiro gesto; se ainda não chegou, espera (ou, na hora, sintetiza).
    if (naHora) tocarSintetizado(id);
    else void carregarManifestoEfeitos().then(() => tocarDaFonte(id, false));
    return;
  }
  tocarDaFonte(id, naHora);
}

function tocarDaFonte(id: IdEfeito, naHora: boolean): void {
  if (!podeTocar("efeitos")) return;
  const fonte = fonteDoEfeito(id, manifestoEfeitos, formatoDoNavegador());
  if (fonte.tipo === "sintetizado") {
    tocarSintetizado(id);
    return;
  }
  const pronto = efeitoPronto(fonte.url);
  if (pronto) {
    tocarBuffer(id, pronto, fonte.duracaoSegundos);
    return;
  }
  if (naHora) {
    tocarSintetizado(id);
    void carregarEfeito(fonte.url);
    return;
  }
  void resolverEfeito(fonte, carregarEfeito).then((tocavel) => {
    if (!podeTocar("efeitos")) return;
    if (tocavel.tipo === "arquivo") tocarBuffer(id, tocavel.buffer, tocavel.duracaoSegundos);
    else tocarSintetizado(id);
  });
}

/** Pré-carrega os arquivos dos momentos grandes (no primeiro gesto do jogador). */
function preCarregarEfeitosGrandes(): void {
  void carregarManifestoEfeitos().then(() => {
    for (const id of EFEITOS_GRANDES) {
      const fonte = fonteDoEfeito(id, manifestoEfeitos, formatoDoNavegador());
      if (fonte.tipo === "arquivo") void carregarEfeito(fonte.url);
    }
  });
}

/** Hover: só com ponteiro fino (mouse), nunca no toque. */
export function tocarHover(): void {
  if (!temJanela() || !window.matchMedia("(pointer: fine)").matches) return;
  tocarEfeito("hover");
}

/** Qual efeito de tecla combina com um caractere ou nome de tecla. */
export function efeitoDaTecla(tecla: string): IdEfeito | null {
  if (tecla === " " || tecla === "Spacebar") return "tecla-espaco";
  if (tecla === "Enter" || tecla === "\n") return "tecla-enter";
  if (tecla === "Backspace" || tecla === "Delete") return "tecla-apagar";
  // Teclado virtual do celular manda "Unidentified" (ou "Process") no keydown.
  if (tecla.length === 1 || tecla === "Unidentified" || tecla === "Process" || tecla === "Tab") return "tecla";
  return null;
}

/**
 * Som de tecla, com limite de taxa (tecla segurada não vira metralhadora).
 * Usado pela digitação do jogador no editor e, no futuro, por digitação
 * programática (tocarTeclaProgramatica).
 */
export function tocarTecla(tecla: string, repetindo = false): void {
  const id = efeitoDaTecla(tecla);
  if (!id) return;
  const agora = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (agora - ultimaTecla < (repetindo ? 90 : 28)) return;
  ultimaTecla = agora;
  tocarEfeito(id);
}

/**
 * Tecla de digitação programática (ex.: a futura "IA ao vivo" escrevendo no
 * editor). Ainda não está ligada a nada.
 */
export function tocarTeclaProgramatica(caractere: string): void {
  tocarTecla(caractere);
}
