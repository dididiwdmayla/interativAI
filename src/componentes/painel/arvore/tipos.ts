export type EdicaoArvore =
  | { chave: string; alvo: "texto" }
  | { chave: string; alvo: "atributo"; nome: string };

export type DestaqueArvore = {
  caminho: number[];
  parte: "no" | "texto";
};

/** Tags que não têm fechamento nem conteúdo. */
export const TAGS_VAZIAS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);
