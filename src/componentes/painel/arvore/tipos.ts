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

/** O que dá para fazer com um nó da árvore (menu do botão direito e barra do celular). */
export type AcoesNo = {
  podeEditar: boolean;
  podeEsconder: boolean;
  podeApagar: boolean;
  podeDuplicar: boolean;
  /** Já está escondido: o item vira "Mostrar de novo". */
  escondido: boolean;
  editar: () => void;
  esconder: () => void;
  apagar: () => void;
  duplicar: () => void;
};
