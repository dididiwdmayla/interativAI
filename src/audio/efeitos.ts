import { arquivoNoFormato, type FormatoAudio, type ManifestoEfeitos } from "./manifestos";

/*
 * Registro central dos efeitos sonoros, por id. Todo id tem uma versão
 * sintetizada (receitas.ts) e pode ganhar um arquivo gravado: se o
 * public/audio/efeitos/efeitos.json listar um arquivo para ele, toca o
 * arquivo; senão, toca o sintetizado.
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
  // Momentos grandes (vão ganhar arquivos gravados).
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

/** Efeitos de momentos grandes: podem ser pré-carregados ao entrar no mapa. */
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

export type FonteEfeito = { tipo: "arquivo"; url: string } | { tipo: "sintetizado" };

/** Arquivo, se o manifesto listar um para o id; senão, sintetizado. */
export function fonteDoEfeito(id: IdEfeito, manifesto: ManifestoEfeitos, formato: FormatoAudio): FonteEfeito {
  const arquivos = manifesto.efeitos[id]?.arquivos;
  const url = arquivos ? arquivoNoFormato(arquivos, formato) : null;
  return url ? { tipo: "arquivo", url } : { tipo: "sintetizado" };
}
