// Leitor mínimo de PNG (o que o Playwright tira: 8 bits, RGB ou RGBA, sem
// entrelaçar), para os testes olharem os pixels de uma captura sem dependência
// nova. Devolve { largura, altura, pixel(x, y) -> [r, g, b] }.
import { inflateSync } from "node:zlib";

export function lerPng(buffer) {
  let posicao = 8;
  let largura = 0;
  let altura = 0;
  let tipoCor = 0;
  const dados = [];
  while (posicao < buffer.length) {
    const tamanho = buffer.readUInt32BE(posicao);
    const tipo = buffer.toString("ascii", posicao + 4, posicao + 8);
    const corpo = buffer.subarray(posicao + 8, posicao + 8 + tamanho);
    if (tipo === "IHDR") {
      largura = corpo.readUInt32BE(0);
      altura = corpo.readUInt32BE(4);
      if (corpo[8] !== 8 || corpo[12] !== 0) throw new Error("PNG fora do formato do Playwright (8 bits, sem entrelaçar)");
      tipoCor = corpo[9];
    } else if (tipo === "IDAT") dados.push(corpo);
    else if (tipo === "IEND") break;
    posicao += 12 + tamanho;
  }
  const canais = tipoCor === 6 ? 4 : tipoCor === 2 ? 3 : 0;
  if (!canais) throw new Error(`PNG com tipo de cor ${tipoCor} (só RGB e RGBA)`);
  const cru = inflateSync(Buffer.concat(dados));
  const linha = largura * canais;
  const pixels = Buffer.alloc(linha * altura);
  // Desfaz o filtro de cada linha (0 nenhum, 1 sub, 2 up, 3 média, 4 Paeth).
  for (let y = 0; y < altura; y++) {
    const filtro = cru[y * (linha + 1)];
    const origem = y * (linha + 1) + 1;
    const destino = y * linha;
    for (let i = 0; i < linha; i++) {
      const a = i >= canais ? pixels[destino + i - canais] : 0;
      const b = y > 0 ? pixels[destino - linha + i] : 0;
      const c = y > 0 && i >= canais ? pixels[destino - linha + i - canais] : 0;
      let previsto = 0;
      if (filtro === 1) previsto = a;
      else if (filtro === 2) previsto = b;
      else if (filtro === 3) previsto = (a + b) >> 1;
      else if (filtro === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        previsto = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      pixels[destino + i] = (cru[origem + i] + previsto) & 0xff;
    }
  }
  return {
    largura,
    altura,
    pixel: (x, y) => {
      const i = y * linha + x * canais;
      return [pixels[i], pixels[i + 1], pixels[i + 2]];
    },
  };
}

/** "#bfe8f7" ou "rgb(191, 232, 247)" em [r, g, b]. */
export function corEmRgb(texto) {
  const limpo = texto.trim();
  if (limpo.startsWith("#")) {
    const hex = limpo.length === 4 ? [...limpo.slice(1)].map((c) => c + c).join("") : limpo.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  return (limpo.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
}
