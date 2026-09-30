import type { TipoNoPalco } from "@/motor/palco";

/** A cor de cada tipo no palco (os mesmos tokens do Console). */
export const COR_DO_TIPO: Record<TipoNoPalco, { texto: string; borda: string }> = {
  texto: { texto: "text-js-texto", borda: "border-js-texto" },
  numero: { texto: "text-js-numero", borda: "border-js-numero" },
  booleano: { texto: "text-js-booleano", borda: "border-js-booleano" },
  undefined: { texto: "text-js-nulo", borda: "border-js-nulo" },
  null: { texto: "text-js-nulo", borda: "border-js-nulo" },
  lista: { texto: "text-js-objeto", borda: "border-js-objeto" },
  objeto: { texto: "text-js-objeto", borda: "border-js-objeto" },
  funcao: { texto: "text-js-funcao", borda: "border-js-funcao" },
  outro: { texto: "text-codigo-texto", borda: "border-borda" },
};
