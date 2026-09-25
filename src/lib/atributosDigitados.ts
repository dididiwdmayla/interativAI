/*
 * "Adicionar atributo" na árvore, como o Chrome: o jogador escreve o
 * atributo inteiro (alt="Foto da banda", target=_blank, ou mais de um
 * separados por espaço) e o navegador lê como leria dentro de uma tag.
 */

export type AtributoDigitado = { nome: string; valor: string };

/** Os atributos que o texto escreve, na ordem. Lista vazia se não tem nenhum válido. */
export function lerAtributosDigitados(texto: string, criarDocumento: () => Document = () => document.implementation.createHTMLDocument("")): AtributoDigitado[] {
  const limpo = texto.trim();
  if (limpo.length === 0) return [];
  const documento = criarDocumento();
  const molde = documento.createElement("template");
  molde.innerHTML = `<span ${limpo}></span>`;
  const elemento = molde.content.firstElementChild;
  if (!elemento) return [];
  return Array.from(elemento.attributes)
    .filter((atributo) => /^[a-zA-Z_:][-a-zA-Z0-9_:.]*$/.test(atributo.name))
    .map((atributo) => ({ nome: atributo.name, valor: atributo.value }));
}
