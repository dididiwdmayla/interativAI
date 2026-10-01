"use client";

/*
 * O que o palco inteiro sabe do passo de agora, para as listas e as
 * árvores lá dentro: as posições de lista que a linha anterior leu (o vagão
 * acende "leu") e os objetos que a função de agora está olhando (o nó
 * visitado aceso na árvore).
 */
import { createContext } from "react";

export type ContextoDoPalco = {
  /** Pelo id da lista: as posições lidas pela linha anterior. */
  leituras: ReadonlyMap<number, ReadonlySet<number>>;
  /** Os ids dos objetos que as variáveis da função de agora apontam. */
  visitados: ReadonlySet<number>;
};

export const ContextoPalco = createContext<ContextoDoPalco>({ leituras: new Map(), visitados: new Set() });
