/*
 * Simulação honesta do "acento quebrado" (mojibake).
 *
 * Num site de verdade, o arquivo HTML chega como bytes. Sem
 * `<meta charset="utf-8">` (e sem o charset no cabeçalho do servidor), o
 * navegador pode adivinhar a codificação errada: os bytes UTF-8 de "ã"
 * (C3 A3) são lidos como Windows-1252 e viram "Ã£".
 *
 * No jogo isso NÃO acontece sozinho: a prévia usa srcdoc, que já é texto
 * (não há bytes para decodificar), e um blob: da mesma origem herdaria o
 * UTF-8 da página do jogo (HTML Living Standard, "determining the
 * character encoding": o documento aninhado de mesma origem usa a
 * codificação do pai). Então o jogo simula: sem meta charset, os textos da
 * prévia viram o que o navegador mostraria se adivinhasse Windows-1252. O
 * computadorzinho avisa que é uma simulação.
 *
 * As duas funções são inversas uma da outra (para o código do jogador não
 * receber os caracteres quebrados de volta quando a árvore edita a página).
 */

/** Windows-1252 nos bytes 0x80 a 0x9F (os outros bytes altos são iguais ao Latin-1). */
const CP1252_ALTOS: Readonly<Record<number, number>> = {
  0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021,
  0x88: 0x02c6, 0x89: 0x2030, 0x8a: 0x0160, 0x8b: 0x2039, 0x8c: 0x0152, 0x8e: 0x017d, 0x91: 0x2018,
  0x92: 0x2019, 0x93: 0x201c, 0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02dc,
  0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a, 0x9c: 0x0153, 0x9e: 0x017e, 0x9f: 0x0178,
};

const BYTE_DO_CARACTERE: ReadonlyMap<number, number> = new Map(
  Object.entries(CP1252_ALTOS).map(([byte, ponto]) => [ponto, Number(byte)]),
);

const codificador = new TextEncoder();
const decodificador = new TextDecoder("utf-8", { fatal: true });

/** O texto como o navegador mostraria lendo os bytes UTF-8 como Windows-1252. */
export function quebrarAcentos(texto: string): string {
  if (!/[^\u0000-\u007f]/.test(texto)) return texto;
  let saida = "";
  for (const byte of codificador.encode(texto)) {
    saida += String.fromCharCode(CP1252_ALTOS[byte] ?? byte);
  }
  return saida;
}

/** O inverso de quebrarAcentos (se o texto não veio dela, devolve igual). */
export function consertarAcentos(texto: string): string {
  if (!/[^\u0000-\u007f]/.test(texto)) return texto;
  const bytes: number[] = [];
  for (const caractere of texto) {
    const ponto = caractere.codePointAt(0) ?? 0;
    const byte = ponto <= 0xff ? ponto : BYTE_DO_CARACTERE.get(ponto);
    if (byte === undefined) return texto;
    bytes.push(byte);
  }
  try {
    return decodificador.decode(new Uint8Array(bytes));
  } catch {
    return texto;
  }
}

/** O documento declara a codificação (<meta charset> ou o http-equiv antigo)? */
export function temCharset(documento: Document): boolean {
  return (
    documento.querySelector("meta[charset]") !== null ||
    Array.from(documento.querySelectorAll("meta[http-equiv]")).some(
      (meta) => meta.getAttribute("http-equiv")?.toLowerCase() === "content-type" && /charset=/i.test(meta.getAttribute("content") ?? ""),
    )
  );
}
