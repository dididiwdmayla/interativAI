// Carrega o src/roteiro.ts (TypeScript) num script de Node: o esbuild empacota
// num módulo só e o Node importa o resultado.
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PASTA_VIDEO } from "./jogo.mjs";

const exigir = createRequire(import.meta.url);

async function carregar(entrada, nome) {
  const esbuild = exigir("esbuild");
  const pasta = path.join(PASTA_VIDEO, ".cache");
  mkdirSync(pasta, { recursive: true });
  const saida = path.join(pasta, nome);
  await esbuild.build({ entryPoints: [path.join(PASTA_VIDEO, "src", ...entrada)], bundle: true, format: "esm", platform: "node", outfile: saida, logLevel: "silent" });
  return import(`${pathToFileURL(saida).href}?v=${Date.now()}`);
}

export const carregarRoteiro = () => carregar(["roteiro.ts"], "roteiro.mjs");

/** O roteiro dos curtos (src/curtos/roteiro.ts). */
export const carregarRoteiroDosCurtos = () => carregar(["curtos", "roteiro.ts"], "roteiro-curtos.mjs");
