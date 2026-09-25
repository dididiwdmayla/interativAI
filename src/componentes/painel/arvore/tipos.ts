import { TAGS_SEM_CONTEUDO } from "@/motor/nucleoPainel";

export type EdicaoArvore =
  | { chave: string; alvo: "texto" }
  | { chave: string; alvo: "atributo"; nome: string }
  /** O nome da tag (dois cliques no h2 de <h2>). */
  | { chave: string; alvo: "tag" };

export type DestaqueArvore = {
  caminho: number[];
  parte: "no" | "texto";
};

/** Tags que não têm fechamento nem conteúdo (a lista mora no núcleo do painel). */
export const TAGS_VAZIAS = TAGS_SEM_CONTEUDO;

/** O que dá para fazer com um nó da árvore (menu do botão direito e barra do celular). */
export type AcoesNo = {
  podeEditar: boolean;
  podeEsconder: boolean;
  podeApagar: boolean;
  podeDuplicar: boolean;
  podeRenomear: boolean;
  /** Já está escondido: o item vira "Mostrar de novo". */
  escondido: boolean;
  editar: () => void;
  esconder: () => void;
  apagar: () => void;
  duplicar: () => void;
  /** Começa a editar o nome da tag. */
  renomear: () => void;
};
