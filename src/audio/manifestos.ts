/*
 * Manifestos de áudio em public/audio: as músicas (musica/musicas.json) e os
 * efeitos gravados (efeitos/efeitos.json). Os dois são lidos em tempo de
 * execução, então uma faixa ou efeito novo entra só com o arquivo e a
 * entrada no json, sem mexer em código.
 */

export const URL_MANIFESTO_MUSICAS = "/audio/musica/musicas.json";
export const URL_MANIFESTO_EFEITOS = "/audio/efeitos/efeitos.json";

/** Formatos aceitos: webm (Opus, preferido) e m4a (AAC, reserva). */
export type FormatoAudio = "webm" | "m4a";

export type ArquivosAudio = Partial<Record<FormatoAudio, string>>;

export type FaixaMusica = {
  titulo: string;
  arquivos: ArquivosAudio;
  /**
   * Fim do loop. Os containers reportam alguns ms a mais de duração, então o
   * loop usa este número, nunca a duração do arquivo decodificado.
   */
  duracaoSegundos: number;
};

export type ManifestoMusicas = {
  /** Faixas planejadas que ainda não chegaram (tocam silêncio). */
  pendentes: string[];
  faixas: Record<string, FaixaMusica>;
};

/**
 * Um efeito gravado. O formato do efeitos.json é o contrato: só tem entrada
 * o id que tem arquivo; id sem entrada toca a versão sintetizada.
 */
export type EntradaEfeito = {
  descricao: string;
  arquivos: ArquivosAudio;
  /**
   * Duração do som. Como na música, os containers reportam alguns ms a mais:
   * o fim do efeito usa este número quando ele vem.
   */
  duracaoSegundos: number | null;
};

export type ManifestoEfeitos = {
  efeitos: Record<string, EntradaEfeito>;
};

export const MANIFESTO_MUSICAS_VAZIO: ManifestoMusicas = { pendentes: [], faixas: {} };
export const MANIFESTO_EFEITOS_VAZIO: ManifestoEfeitos = { efeitos: {} };

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function lerArquivos(valor: unknown): ArquivosAudio | null {
  if (!ehObjeto(valor)) return null;
  const arquivos: ArquivosAudio = {};
  if (typeof valor.webm === "string" && valor.webm) arquivos.webm = valor.webm;
  if (typeof valor.m4a === "string" && valor.m4a) arquivos.m4a = valor.m4a;
  return arquivos.webm || arquivos.m4a ? arquivos : null;
}

function lerDuracao(valor: unknown): number | null {
  return typeof valor === "number" && Number.isFinite(valor) && valor > 0 ? valor : null;
}

/** Lê o musicas.json com tolerância: entrada malformada é ignorada, nunca quebra o jogo. */
export function lerManifestoMusicas(bruto: unknown): ManifestoMusicas {
  if (!ehObjeto(bruto)) return MANIFESTO_MUSICAS_VAZIO;
  const pendentes = Array.isArray(bruto.pendentes)
    ? bruto.pendentes.filter((item): item is string => typeof item === "string")
    : [];
  const faixas: Record<string, FaixaMusica> = {};
  if (ehObjeto(bruto.faixas)) {
    for (const [id, item] of Object.entries(bruto.faixas)) {
      if (!ehObjeto(item)) continue;
      const arquivos = lerArquivos(item.arquivos);
      const duracao = lerDuracao(item.duracaoSegundos);
      if (!arquivos || duracao === null) continue;
      faixas[id] = { titulo: typeof item.titulo === "string" ? item.titulo : id, arquivos, duracaoSegundos: duracao };
    }
  }
  return { pendentes, faixas };
}

/**
 * Lê o efeitos.json com tolerância: entrada sem arquivo válido é ignorada
 * (o id toca o sintetizado), nunca quebra o jogo.
 */
export function lerManifestoEfeitos(bruto: unknown): ManifestoEfeitos {
  if (!ehObjeto(bruto) || !ehObjeto(bruto.efeitos)) return MANIFESTO_EFEITOS_VAZIO;
  const efeitos: Record<string, EntradaEfeito> = {};
  for (const [id, item] of Object.entries(bruto.efeitos)) {
    if (!ehObjeto(item)) continue;
    const arquivos = lerArquivos(item.arquivos);
    if (!arquivos) continue;
    efeitos[id] = {
      descricao: typeof item.descricao === "string" ? item.descricao : id,
      arquivos,
      duracaoSegundos: lerDuracao(item.duracaoSegundos),
    };
  }
  return { efeitos };
}

/**
 * Escolhe o formato pelo que o navegador diz saber tocar: webm com Opus se
 * ele responder "probably" ou "maybe"; senão, m4a.
 */
export function escolherFormato(podeTocar: (tipo: string) => string): FormatoAudio {
  const resposta = podeTocar('audio/webm; codecs="opus"');
  return resposta === "probably" || resposta === "maybe" ? "webm" : "m4a";
}

/** O arquivo no formato escolhido, ou o outro se só ele existir. */
export function arquivoNoFormato(arquivos: ArquivosAudio, formato: FormatoAudio): string | null {
  const outro: FormatoAudio = formato === "webm" ? "m4a" : "webm";
  return arquivos[formato] ?? arquivos[outro] ?? null;
}
