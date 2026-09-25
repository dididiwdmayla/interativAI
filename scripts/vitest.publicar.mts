import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * npm run publicar:conteudo: roda scripts/publicarConteudo.ts no mesmo
 * ambiente dos testes de conteúdo (jsdom, alias @/), para poder importar o
 * conteúdo em TypeScript e rodar as checagens antes de publicar.
 */
export default defineConfig({
  root: fileURLToPath(new URL("..", import.meta.url)),
  resolve: {
    alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["scripts/publicarConteudo.ts"],
    reporters: ["default"],
  },
});
