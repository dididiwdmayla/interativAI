// Renderiza as duas versões do vídeo (sem a mixagem final: quem fecha o áudio é o finalizar.mjs).
// Uso: node scripts/renderizar.mjs                 as duas, tamanho final (out/<id>.mp4)
//      node scripts/renderizar.mjs --rascunho      as duas, metade do tamanho (out/rascunho-<id>.mp4)
//      node scripts/renderizar.mjs Apresentacao916 só uma
import { mkdirSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { video } from "./lib/remotion.mjs";

const argumentos = process.argv.slice(2);
const rascunho = argumentos.includes("--rascunho");
const pedidas = argumentos.filter((item) => !item.startsWith("--"));
const ids = pedidas.length ? pedidas : ["Apresentacao169", "Apresentacao916"];
const crf = Number(process.env.CRF ?? (rascunho ? 24 : 18));
mkdirSync(path.join(PASTA_VIDEO, "out"), { recursive: true });

for (const id of ids) {
  const saida = path.join(PASTA_VIDEO, "out", `${rascunho ? "rascunho-" : ""}${id}.mp4`);
  const inicio = Date.now();
  let ultimo = 0;
  const comp = await video(id, saida, {
    escala: rascunho ? 0.5 : 1,
    crf,
    aoAndar: ({ progress }) => {
      const porcento = Math.floor(progress * 10) * 10;
      if (porcento > ultimo) {
        ultimo = porcento;
        console.log(`${id}: ${porcento}% (${Math.round((Date.now() - inicio) / 1000)} s)`);
      }
    },
  });
  console.log(`${id}: pronto em ${Math.round((Date.now() - inicio) / 1000)} s -> ${path.relative(PASTA_VIDEO, saida)} (${(comp.durationInFrames / comp.fps).toFixed(2)} s)`);
}
process.exit(0);
