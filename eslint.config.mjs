import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // O Pyodide copiado do node_modules (scripts/copiar-pyodide.mjs): código de fora, não lintado.
    "public/pyodide/**",
    // O vídeo de apresentação (Remotion): projeto separado, com o package.json e o tsconfig dele.
    "video/**",
  ]),
]);

export default eslintConfig;
