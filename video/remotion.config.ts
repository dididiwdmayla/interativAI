import path from "node:path";
import { Config } from "@remotion/cli/config";
import { navegadorDoRender } from "./navegador.mjs";

const jogo = path.resolve(process.cwd(), "..", "src");
const modulos = path.resolve(process.cwd(), "node_modules");

const navegador = navegadorDoRender();
if (navegador) Config.setBrowserExecutable(navegador);

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
Config.setChromiumOpenGlRenderer("swangle");
Config.setOffthreadVideoCacheSizeInBytes(700 * 1024 * 1024);

// O vídeo importa peças do jogo (SVG puro e os tokens). Os arquivos de ../src
// resolvem "@/..." como no jogo, e o React é sempre o desta pasta (uma cópia só).
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      "@jogo": jogo,
      "@": jogo,
      react: path.join(modulos, "react"),
      "react-dom": path.join(modulos, "react-dom"),
    },
  },
}));
