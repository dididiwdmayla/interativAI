import { dividirListaDeSeletores } from "@/motor/css/especificidade";

/**
 * Elementos da página que uma regra de CSS pega (cada seletor da lista),
 * sem o <html> e o que mora no <head>: é o que acende na prévia quando o
 * cursor está na regra ou o mouse passa no seletor.
 */
export function elementosDaRegra(documento: Document, seletor: string): Element[] {
  const achados = new Set<Element>();
  for (const item of dividirListaDeSeletores(seletor)) {
    try {
      documento.querySelectorAll(item).forEach((elemento) => achados.add(elemento));
    } catch {
      // Seletor pela metade enquanto o jogador digita: não acende nada.
    }
  }
  return [...achados].filter(
    (elemento) => elemento !== documento.documentElement && elemento !== documento.head && !documento.head?.contains(elemento),
  );
}
