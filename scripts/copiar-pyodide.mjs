// Copia o Pyodide do node_modules para public/pyodide/<versão>/: o jogo
// serve o Python do próprio site, sem CDN de fora. Roda antes do dev e do
// build (package.json); a pasta não vai para o git (.gitignore). Só os
// arquivos do núcleo (sem pacotes extras): uns 13 MB.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pasta = dirname(require.resolve("pyodide/package.json"));
const { version } = JSON.parse(readFileSync(join(pasta, "package.json"), "utf8"));
const destino = join(process.cwd(), "public", "pyodide", version);
const ARQUIVOS = ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];

mkdirSync(destino, { recursive: true });
let copiados = 0;
for (const nome of ARQUIVOS) {
  const de = join(pasta, nome);
  const para = join(destino, nome);
  if (existsSync(para) && statSync(para).size === statSync(de).size) continue;
  copyFileSync(de, para);
  copiados += 1;
}
console.log(`Pyodide ${version}: ${copiados ? `${copiados} arquivo(s) copiado(s)` : "já estava"} em public/pyodide/${version}/`);
