/*
 * Preparo dos testes de conteúdo (Vitest, jsdom): no jsdom não há as folhas
 * de estilo da página do jogo, então os tokens de cor (src/tema/tokens.css)
 * vêm do próprio arquivo. É o que a maquete do jogo (site-alvo "jogo", E5)
 * e o Meu tema usam.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { definirLeitorDeTokens, tokensDoTextoCss } from "@/tema/tokensDoJogo";
import { definirFabricaDeNucleo } from "@/motor/executor/fabrica";
import { criarNucleoNode } from "@/motor/executor/node";

// No jsdom, o import.meta.url não é um file://: o caminho sai da raiz do projeto (onde o Vitest roda).
const TEXTO_TOKENS = readFileSync(resolve(process.cwd(), "src/tema/tokens.css"), "utf8");

definirLeitorDeTokens((tema) => tokensDoTextoCss(TEXTO_TOKENS, tema));

// Fases de programa (Ilha Lógica): o executor síncrono do Node (vm), o mesmo núcleo do Web Worker do jogo.
definirFabricaDeNucleo(criarNucleoNode);
