import { arquivoNoFormato, type FormatoAudio, type ManifestoEfeitos } from "./manifestos";

/*
 * Registro central dos efeitos sonoros, por id. Todo id tem uma versão
 * sintetizada (receitas.ts) e pode ganhar um arquivo gravado: se o
 * public/audio/efeitos/efeitos.json tiver entrada para ele, toca o arquivo;
 * senão (ou se o arquivo não carregar), toca o sintetizado.
 */

export const IDS_EFEITOS = [
  // Interação (tocam com frequência).
  "tecla",
  "tecla-espaco",
  "tecla-enter",
  "tecla-apagar",
  "clique",
  "hover",
  "acerto",
  "erro",
  "aviso",
  "abrir-painel",
  "fechar-painel",
  // Ferramentas do DevTools.
  "inspecionar",
  "editar",
  "esconder",
  "apagar",
  "desfazer",
  "refazer",
  "duplicar",
  "renomear-tag",
  // Momentos grandes (os que têm arquivo gravado no efeitos.json).
  "boot",
  "dormir",
  "acordar",
  "esbarrao",
  "fase-concluida",
  "fez-sozinho",
  "unidade-concluida",
  "desbloqueio",
  "insignia",
  "entrar-mapa",
  "viagem-ilha",
  "abrir-museu",
] as const;

export type IdEfeito = (typeof IDS_EFEITOS)[number];

export function ehIdEfeito(valor: unknown): valor is IdEfeito {
  return typeof valor === "string" && (IDS_EFEITOS as readonly string[]).includes(valor);
}

/** Efeitos de momentos grandes: os arquivos são pré-carregados no primeiro gesto do jogador. */
export const EFEITOS_GRANDES: readonly IdEfeito[] = [
  "boot",
  "dormir",
  "acordar",
  "esbarrao",
  "fase-concluida",
  "fez-sozinho",
  "unidade-concluida",
  "desbloqueio",
  "insignia",
  "entrar-mapa",
  "viagem-ilha",
  "abrir-museu",
];

export type FonteEfeito =
  | { tipo: "arquivo"; url: string; duracaoSegundos: number | null }
  | { tipo: "sintetizado" };

/** Arquivo, se o manifesto tiver entrada para o id; senão, sintetizado. */
export function fonteDoEfeito(id: IdEfeito, manifesto: ManifestoEfeitos, formato: FormatoAudio): FonteEfeito {
  const entrada = Object.hasOwn(manifesto.efeitos, id) ? manifesto.efeitos[id] : undefined;
  const url = entrada ? arquivoNoFormato(entrada.arquivos, formato) : null;
  return url && entrada ? { tipo: "arquivo", url, duracaoSegundos: entrada.duracaoSegundos } : { tipo: "sintetizado" };
}

/** O que de fato toca: o arquivo já decodificado, ou o sintetizado. */
export type EfeitoTocavel<Buffer> =
  | { tipo: "arquivo"; buffer: Buffer; duracaoSegundos: number | null }
  | { tipo: "sintetizado" };

/**
 * Resolve a fonte num som tocável. Arquivo que falha ao carregar (404, rede,
 * formato que o navegador não abre) cai no sintetizado, sem erro.
 */
export async function resolverEfeito<Buffer>(
  fonte: FonteEfeito,
  carregar: (url: string) => Promise<Buffer | null>,
): Promise<EfeitoTocavel<Buffer>> {
  if (fonte.tipo === "sintetizado") return fonte;
  try {
    const buffer = await carregar(fonte.url);
    if (buffer) return { tipo: "arquivo", buffer, duracaoSegundos: fonte.duracaoSegundos };
  } catch {
    // Cai no sintetizado.
  }
  return { tipo: "sintetizado" };
}
