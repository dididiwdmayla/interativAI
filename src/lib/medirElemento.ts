import { elementoDoNo } from "@/lib/arvore";

export type Realce = {
  x: number;
  y: number;
  largura: number;
  altura: number;
  rotulo: string;
};

/** Etiqueta no estilo do F12: tag.classe  largura × altura. */
export function rotuloDoElemento(elemento: Element, largura: number, altura: number): string {
  const tag = elemento.tagName.toLowerCase();
  const id = elemento.id ? `#${elemento.id}` : "";
  const classes = Array.from(elemento.classList)
    .map((classe) => `.${classe}`)
    .join("");
  return `${tag}${id}${classes}  ${Math.round(largura)} × ${Math.round(altura)}`;
}

/** Mede um nó do iframe. As coordenadas valem para a caixa que envolve o iframe. */
export function medirNo(no: Node | null): Realce | null {
  const elemento = elementoDoNo(no);
  if (!elemento) return null;
  const caixa = elemento.getBoundingClientRect();
  return {
    x: caixa.left,
    y: caixa.top,
    largura: caixa.width,
    altura: caixa.height,
    rotulo: rotuloDoElemento(elemento, caixa.width, caixa.height),
  };
}
