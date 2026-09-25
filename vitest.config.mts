import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Testes de conteúdo e do áudio (npm run testar:conteudo; só o áudio:
 * npm run testar:audio). Rodam no jsdom: o núcleo do painel e os
 * validadores usam só APIs comuns de DOM, e as partes puras do áudio
 * (voz de modem, tabela de faixas, manifestos) não precisam de Web Audio.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["testes/conteudo/**/*.test.ts", "testes/audio/**/*.test.ts"],
    reporters: ["default"],
  },
});
