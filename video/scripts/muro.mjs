// O muro de código do gancho de "O aprendiz" é código de verdade: programas do conteúdo da Ilha Lógica
// (os dois chamados da Depuração e o contrato da padaria), lidos dos arquivos do jogo. O script empacota
// os módulos do conteúdo com o esbuild, pega os textos e grava src/dados/muro.json.
// As linhas com preço ("R$") ficam de fora: os curtos não mostram "R$" em quadro nenhum.
// Uso: node scripts/muro.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PASTA_VIDEO, RAIZ } from "./lib/jogo.mjs";

const exigir = createRequire(import.meta.url);
const esbuild = exigir("esbuild");
const FONTES = [
  { arquivo: "src/conteudo/ilhas/logica/depuracao/unidade-6/fase-2-contrato.ts", exporta: "CODIGO_COM_DEFEITO", nome: "agenda.js (Depuração, o chamado do Salão Girassol)" },
  { arquivo: "src/conteudo/ilhas/logica/programa-de-verdade/unidade-1/fase-2-contrato.ts", exporta: "CODIGO_PADARIA_DEPOIS", nome: "vitrine.js (Programa de verdade, o contrato da padaria)" },
  { arquivo: "src/conteudo/ilhas/logica/depuracao/unidade-5/fase-2-contrato.ts", exporta: "CODIGO_COM_DEFEITO", nome: "estoque.js (Depuração, o chamado do Mercadinho Estrela)" },
];
const entrada = FONTES.map((fonte, i) => `export { ${fonte.exporta} as F${i} } from ${JSON.stringify(path.join(RAIZ, fonte.arquivo))};`).join("\n");
const pasta = path.join(PASTA_VIDEO, ".cache");
mkdirSync(pasta, { recursive: true });
const saida = path.join(pasta, "muro.mjs");
await esbuild.build({ stdin: { contents: entrada, resolveDir: RAIZ, loader: "ts" }, bundle: true, format: "esm", platform: "node", outfile: saida, alias: { "@": path.join(RAIZ, "src") }, logLevel: "silent" });
const modulo = await import(`${pathToFileURL(saida).href}?v=${Date.now()}`);

const linhas = [];
const fontes = [];
for (const [i, fonte] of FONTES.entries()) {
  const codigo = modulo[`F${i}`];
  if (typeof codigo !== "string") throw new Error(`${fonte.arquivo} não exporta ${fonte.exporta} como texto`);
  const proprias = codigo.split("\n").filter((linha) => linha.trim() && !/R\$/.test(linha) && !linha.trim().startsWith("//"));
  fontes.push({ ...fonte, linhas: proprias.length });
  linhas.push(...proprias);
}
writeFileSync(path.join(PASTA_VIDEO, "src", "dados", "muro.json"), `${JSON.stringify({ geradoPor: "video/scripts/muro.mjs, a partir do conteúdo da Ilha Lógica", fontes, linhas }, null, 1)}\n`);
console.log(`${linhas.length} linhas de código de ${fontes.length} programas da Ilha Lógica:`);
for (const fonte of fontes) console.log(`  ${fonte.nome}: ${fonte.linhas} linhas`);
console.log(`  a mais longa: ${Math.max(...linhas.map((linha) => linha.length))} letras`);
