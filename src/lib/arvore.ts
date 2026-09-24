import {
  chaveDoCaminho,
  ehComentario,
  ehElemento,
  ehTexto,
  filhosVisiveis,
} from "@/lib/dom";

export type AtributoNo = { nome: string; valor: string };

export type NoArvore = {
  chave: string;
  caminho: number[];
  tipo: "elemento" | "texto" | "comentario";
  /** Nome da tag em minúsculas (só elementos). */
  tag: string;
  atributos: AtributoNo[];
  /** Conteúdo de textos e comentários. */
  texto: string;
  filhos: NoArvore[];
  /** Texto único mostrado na mesma linha da tag, como no F12. */
  textoEmLinha: NoArvore | null;
  /** O nó real dentro do iframe. */
  no: Node;
};

export type LinhaArvore = {
  id: string;
  no: NoArvore;
  profundidade: number;
  tipo: "abertura" | "fechamento";
};

function construirNo(no: Node, caminho: number[]): NoArvore {
  const base = {
    chave: chaveDoCaminho(caminho),
    caminho,
    atributos: [] as AtributoNo[],
    filhos: [] as NoArvore[],
    textoEmLinha: null,
    no,
  };

  if (ehTexto(no)) {
    return { ...base, tipo: "texto", tag: "", texto: (no.nodeValue ?? "").replace(/\s+/g, " ").trim() };
  }
  if (ehComentario(no)) {
    return { ...base, tipo: "comentario", tag: "", texto: (no.nodeValue ?? "").trim() };
  }

  const elemento = no as Element;
  const filhos = filhosVisiveis(elemento).map((filho, indice) => construirNo(filho, [...caminho, indice]));
  const unicoTexto = filhos.length === 1 && filhos[0].tipo === "texto" ? filhos[0] : null;

  return {
    ...base,
    tipo: "elemento",
    tag: elemento.tagName.toLowerCase(),
    atributos: Array.from(elemento.attributes).map((atributo) => ({
      nome: atributo.name,
      valor: atributo.value,
    })),
    texto: "",
    filhos: unicoTexto ? [] : filhos,
    textoEmLinha: unicoTexto,
  };
}

/** Foto da árvore a partir do body do iframe. A raiz é o próprio <body>. */
export function construirArvore(body: HTMLElement): NoArvore {
  return construirNo(body, []);
}

/** Linhas visíveis. Tudo nasce expandido; `recolhidos` guarda o que o jogador fechou. */
export function achatarArvore(raiz: NoArvore, recolhidos: ReadonlySet<string>): LinhaArvore[] {
  const linhas: LinhaArvore[] = [];
  const visitar = (no: NoArvore, profundidade: number) => {
    linhas.push({ id: `no-${no.chave}`, no, profundidade, tipo: "abertura" });
    if (no.filhos.length > 0 && !recolhidos.has(no.chave)) {
      for (const filho of no.filhos) visitar(filho, profundidade + 1);
      linhas.push({ id: `fim-${no.chave}`, no, profundidade, tipo: "fechamento" });
    }
  };
  visitar(raiz, 0);
  return linhas;
}

/** Chaves de todos os ancestrais de um caminho (inclusive o body). */
export function chavesAncestrais(caminho: readonly number[]): string[] {
  const chaves: string[] = [];
  for (let tamanho = 0; tamanho < caminho.length; tamanho++) {
    chaves.push(chaveDoCaminho(caminho.slice(0, tamanho)));
  }
  return chaves;
}

/** Elemento dono de um nó (o próprio, se for elemento; o pai, se for texto). */
export function elementoDoNo(no: Node | null): Element | null {
  if (!no) return null;
  if (ehElemento(no)) return no;
  const pai = no.parentNode;
  return ehElemento(pai) ? pai : null;
}
