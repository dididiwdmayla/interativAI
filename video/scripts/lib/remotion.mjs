// O Remotion pelos scripts de Node: empacota uma vez (com os mesmos atalhos do
// remotion.config.ts) e devolve as funções de renderizar quadros e vídeos.
import { createRequire } from "node:module";
import path from "node:path";
import { navegadorDoRender } from "../../navegador.mjs";
import { PASTA_VIDEO, RAIZ } from "./jogo.mjs";

const exigir = createRequire(import.meta.url);
const { bundle } = exigir("@remotion/bundler");
const renderer = exigir("@remotion/renderer");

const modulos = path.join(PASTA_VIDEO, "node_modules");
const jogo = path.join(RAIZ, "src");

let pacote;
export async function empacotar() {
  pacote ??= await bundle({
    entryPoint: path.join(PASTA_VIDEO, "src", "index.ts"),
    publicDir: path.join(PASTA_VIDEO, "public"),
    webpackOverride: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: { ...(config.resolve?.alias ?? {}), "@jogo": jogo, "@": jogo, react: path.join(modulos, "react"), "react-dom": path.join(modulos, "react-dom") },
      },
    }),
  });
  return pacote;
}

const navegador = navegadorDoRender(PASTA_VIDEO);
// O extrator de quadros das tomadas guarda um cache; sem um teto, numa máquina de 8 GB ele cresce até o
// sistema matar o processo no meio do render.
const comum = { browserExecutable: navegador ?? undefined, chromiumOptions: { gl: "swangle" }, logLevel: "error", offthreadVideoCacheSizeInBytes: 700 * 1024 * 1024 };

export async function composicao(id, props) {
  return renderer.selectComposition({ serveUrl: await empacotar(), id, inputProps: props, ...comum });
}

/** Só o áudio, em WAV (`so`: "musica", "voz" ou "efeitos" para uma parte só da trilha). */
export async function audio(id, saida, so) {
  const props = so ? { so } : undefined;
  const comp = await composicao(id, props);
  await renderer.renderMedia({ composition: comp, serveUrl: await empacotar(), codec: "wav", outputLocation: saida, inputProps: props, concurrency: 2, ...comum });
  return comp;
}

/** Um quadro em PNG (ou JPEG, pela extensão). `escala` 0,5 para rascunho. */
export async function quadro(id, numero, saida, escala = 1) {
  const comp = await composicao(id);
  await renderer.renderStill({ composition: comp, serveUrl: await empacotar(), output: saida, frame: Math.min(comp.durationInFrames - 1, Math.max(0, numero)), scale: escala, ...(saida.endsWith(".png") ? { imageFormat: "png" } : { imageFormat: "jpeg", jpegQuality: 88 }), ...comum });
  return comp;
}

/** O vídeo inteiro (ou um trecho). */
export async function video(id, saida, { escala = 1, crf = 18, de, ate, aoAndar } = {}) {
  const comp = await composicao(id);
  await renderer.renderMedia({
    composition: comp,
    serveUrl: await empacotar(),
    codec: "h264",
    outputLocation: saida,
    scale: escala,
    crf,
    pixelFormat: "yuv420p",
    imageFormat: "jpeg",
    jpegQuality: 92,
    concurrency: 2,
    frameRange: de !== undefined ? [de, ate ?? comp.durationInFrames - 1] : undefined,
    onProgress: aoAndar,
    ...comum,
  });
  return comp;
}
