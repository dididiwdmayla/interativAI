// Renderiza quadros soltos para conferir (rascunho, metade do tamanho).
// Uso: node scripts/quadros.mjs Apresentacao169 12.5 30 45.2   (instantes em segundos)
import { mkdirSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { folha } from "./lib/folha.mjs";
import { quadro } from "./lib/remotion.mjs";

const [id, ...instantes] = process.argv.slice(2);
const pasta = path.join(PASTA_VIDEO, "out", "quadros");
mkdirSync(pasta, { recursive: true });
const feitos = [];
for (const instante of instantes) {
  const numero = Math.round(Number(instante) * 30);
  const saida = path.join(pasta, `${id}-${String(instante).replace(".", "_")}.jpg`);
  await quadro(id, numero, saida, Number(process.env.ESCALA ?? 0.5));
  feitos.push(saida);
}
// FOLHA=nome: junta os quadros numa grade só (out/quadros/<nome>.jpg).
if (process.env.FOLHA) {
  const saida = path.join(pasta, `${process.env.FOLHA}.jpg`);
  folha(feitos, saida, { colunas: Number(process.env.COLUNAS ?? 2), largura: Number(process.env.LARGURA ?? 960) });
  console.log(saida);
} else console.log(feitos.join("\n"));
process.exit(0);
