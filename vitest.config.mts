import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Testes de conteúdo (npm run testar:conteudo). Rodam no jsdom: o núcleo do
 * painel e os validadores usam só APIs comuns de DOM.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["testes/conteudo/**/*.test.ts"],
    reporters: ["default"],
  },
});
