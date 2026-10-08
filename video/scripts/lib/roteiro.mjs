// Carrega o src/roteiro.ts (TypeScript) num script de Node: o esbuild empacota
// num módulo só e o Node importa o resultado.
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PASTA_VIDEO } from "./jogo.mjs";

const exigir = createRequire(import.meta.url);

export async function carregarRoteiro() {
  const esbuild = exigir("esbuild");
  const pasta = path.join(PASTA_VIDEO, ".cache");
  mkdirSync(pasta, { recursive: true });
  const saida = path.join(pasta, "roteiro.mjs");
  await esbuild.build({ entryPoints: [path.join(PASTA_VIDEO, "src", "roteiro.ts")], bundle: true, format: "esm", platform: "node", outfile: saida, logLevel: "silent" });
  return import(`${pathToFileURL(saida).href}?v=${Date.now()}`);
}
