import { elementoDoNo } from "@/lib/arvore";

/** Tag (minúscula) do elemento selecionado, ou do pai se for um texto. */
export function tagSelecionada(selecionado: Node | null): string {
  return elementoDoNo(selecionado)?.tagName.toLowerCase() ?? "";
}

export function textoLimpo(elemento: Element | null | undefined): string {
  return (elemento?.textContent ?? "").replace(/\s+/g, " ").trim();
}

/** Itens diretos de uma lista que têm algum texto. */
export function itensComTexto(lista: Element | null): number {
  if (!lista) return 0;
  return Array.from(lista.children).filter(
    (filho) => filho.tagName === "LI" && textoLimpo(filho).length > 0,
  ).length;
}
