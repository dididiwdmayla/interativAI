/**
 * De onde veio uma seleção.
 * - "arvore" e "teclado": clique ou setas na árvore de elementos;
 * - "inspecao": modo inspecionar (a setinha);
 * - "trilha": a trilha de ancestrais no rodapé da aba Elementos;
 * - "codigo": cursor posto no editor de código;
 * - "sistema": o próprio jogo mudou a seleção (depois de apagar, duplicar,
 *   desfazer). Não gera evento "selecionou".
 */
export type OrigemSelecao = "arvore" | "teclado" | "inspecao" | "trilha" | "codigo" | "sistema";

export type EventoFase =
  | { tipo: "selecionou"; tag: string; caminho: number[]; origem: OrigemSelecao }
  | { tipo: "inspecionou"; tag: string; caminho: number[] }
  | { tipo: "trilha"; tag: string; caminho: number[] }
  | { tipo: "editouTexto"; tag: string; caminho: number[]; texto: string }
  | { tipo: "editouAtributo"; tag: string; caminho: number[]; atributo: string; valor: string }
  | { tipo: "editouCodigo" }
  | { tipo: "escondeu"; tag: string; caminho: number[] }
  | { tipo: "mostrou"; tag: string; caminho: number[] }
  | { tipo: "apagou"; tag: string; caminho: number[] }
  /** O caminho é o da cópia, que fica logo depois do original. */
  | { tipo: "duplicou"; tag: string; caminho: number[] }
  | { tipo: "desfez" }
  | { tipo: "refez" }
  | { tipo: "respondeuPrevisao"; opcao: number; acertou: boolean };

export type TipoEvento = EventoFase["tipo"];

/** Todos os tipos de evento, para conferir dados de conteúdo. */
export const TIPOS_EVENTO: readonly TipoEvento[] = [
  "selecionou",
  "inspecionou",
  "trilha",
  "editouTexto",
  "editouAtributo",
  "editouCodigo",
  "escondeu",
  "mostrou",
  "apagou",
  "duplicou",
  "desfez",
  "refez",
  "respondeuPrevisao",
];
