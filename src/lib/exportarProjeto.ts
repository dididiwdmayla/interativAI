/*
 * "Levar pro mundo": a página do jogo vira os arquivos de um site de
 * verdade, num .zip (fflate, que roda no navegador e no Node).
 *
 * - index.html: o documento que o jogador escreveu (sem nada do jogo), com
 *   o <!DOCTYPE html> garantido e a linha que liga o CSS,
 *   <link rel="stylesheet" href="style.css">, no fim do head (se ele ainda
 *   não escreveu);
 * - style.css: a folha editável (a aba estilo.css do jogo).
 */
import { strToU8, zipSync } from "fflate";

export const NOME_HTML = "index.html";
export const NOME_CSS = "style.css";

export type ArquivosDoProjeto = { [NOME_HTML]: string; [NOME_CSS]: string };

/** A linha que liga o style.css ao index.html. */
export const LINHA_DO_CSS = `<link rel="stylesheet" href="${NOME_CSS}">`;

const JA_LIGA_O_CSS = /<link\b[^>]*\bhref\s*=\s*["']?\.?\/?style\.css["']?[^>]*>/i;

/** O documento já tem a linha que liga o style.css? */
export function ligaOCss(documento: string): boolean {
  return JA_LIGA_O_CSS.test(documento);
}

/** Monta os dois arquivos a partir do documento do jogador e da folha editável. */
export function montarArquivos(documento: string, css: string | null): ArquivosDoProjeto {
  let html = documento.trim();
  if (!/^<!doctype html>/i.test(html)) html = `<!DOCTYPE html>\n${html}`;
  if (!ligaOCss(html)) {
    const fim = html.search(/<\/head>/i);
    if (fim >= 0) {
      // Recuo igual ao das outras linhas do head (o documento do jogo usa dois espaços).
      html = `${html.slice(0, fim).replace(/\s*$/, "")}\n  ${LINHA_DO_CSS}\n${html.slice(fim)}`;
    } else {
      html = html.replace(/<html(\s[^>]*)?>/i, (abertura) => `${abertura}\n<head>\n  ${LINHA_DO_CSS}\n</head>`);
    }
  }
  return { [NOME_HTML]: `${html}\n`, [NOME_CSS]: css ?? "" };
}

/** O .zip com os dois arquivos, na raiz (a pasta que a plataforma de publicação espera). */
export function zipDoProjeto(arquivos: ArquivosDoProjeto): Uint8Array {
  return zipSync({ [NOME_HTML]: strToU8(arquivos[NOME_HTML]), [NOME_CSS]: strToU8(arquivos[NOME_CSS]) }, { level: 6 });
}

/** "Meu primeiro site" vira "meu-primeiro-site.zip". */
export function nomeDoZip(nome: string): string {
  const base = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "meu-site"}.zip`;
}

/** Baixa um arquivo de texto no navegador (o .js do Levar pro mundo de um contrato). */
export function baixarTexto(texto: string, nome: string, tipo = "text/javascript"): void {
  const blob = new Blob([texto], { type: `${tipo};charset=utf-8` });
  const endereco = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = endereco;
  link.download = nome;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(endereco), 1000);
}

/** Baixa o .zip no navegador (um link temporário com download). */
export function baixarZip(arquivos: ArquivosDoProjeto, nome: string): void {
  const dados = zipDoProjeto(arquivos);
  const blob = new Blob([dados.slice().buffer], { type: "application/zip" });
  const endereco = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = endereco;
  link.download = nomeDoZip(nome);
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(endereco), 1000);
}
