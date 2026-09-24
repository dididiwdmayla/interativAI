export type OrigemSelecao = "arvore" | "teclado" | "inspecao" | "ajuda";

export type EventoFase =
  | { tipo: "selecionou"; tag: string; caminho: number[]; origem: OrigemSelecao }
  | { tipo: "inspecionou"; tag: string; caminho: number[] }
  | { tipo: "editouTexto"; tag: string; caminho: number[]; texto: string }
  | { tipo: "editouAtributo"; tag: string; caminho: number[]; atributo: string; valor: string }
  | { tipo: "editouCodigo" };

export type TipoEvento = EventoFase["tipo"];
