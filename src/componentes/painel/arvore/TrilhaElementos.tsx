"use client";

import { useEffect, useRef } from "react";
import type { NoArvore } from "@/lib/arvore";
import { CLASSE_ESCONDER } from "@/lib/esconder";

type Props = {
  raiz: NoArvore | null;
  caminhoSelecionado: readonly number[] | null;
  aoSelecionar: (caminho: number[]) => void;
  /** Espaço à direita para o computadorzinho flutuante não cobrir o fim da trilha. */
  recuoDireita?: boolean;
};

/** "tag#id.classe", como o F12 escreve na trilha (sem a classe de esconder, que é longa). */
function rotuloDo(no: NoArvore): string {
  const id = no.atributos.find((atributo) => atributo.nome === "id")?.valor;
  const classes = (no.atributos.find((atributo) => atributo.nome === "class")?.valor ?? "")
    .split(/\s+/)
    .filter((classe) => classe.length > 0 && classe !== CLASSE_ESCONDER);
  return `${no.tag}${id ? `#${id}` : ""}${classes.map((classe) => `.${classe}`).join("")}`;
}

/** Elementos do body até o selecionado (se o selecionado for um texto, para no dono dele). */
function ancestrais(raiz: NoArvore, caminho: readonly number[]): NoArvore[] {
  const lista = [raiz];
  let atual = raiz;
  for (const indice of caminho) {
    const filho = atual.filhos[indice] ?? (indice === 0 ? atual.textoEmLinha : null);
    if (!filho || filho.tipo !== "elemento") break;
    lista.push(filho);
    atual = filho;
  }
  return lista;
}

/**
 * Trilha no rodapé da aba Elementos: o caminho do nó selecionado
 * (html › body › main › article › h3). Clicar num item seleciona aquele
 * ancestral. No celular, rola na horizontal.
 */
export function TrilhaElementos({ raiz, caminhoSelecionado, aoSelecionar, recuoDireita = false }: Props) {
  const lista = useRef<HTMLOListElement>(null);
  const itens = raiz && caminhoSelecionado ? ancestrais(raiz, caminhoSelecionado) : [];
  const chave = itens.map((item) => item.chave).join("|");

  // O selecionado (o último) sempre à vista.
  useEffect(() => {
    const elemento = lista.current;
    if (elemento) elemento.scrollLeft = elemento.scrollWidth;
  }, [chave]);

  return (
    <nav
      aria-label="Trilha de elementos: o caminho do elemento selecionado"
      className="shrink-0 border-t-2 border-borda bg-painel"
    >
      {itens.length === 0 ? (
        <p className={`py-1.5 pl-3 text-xs font-bold text-texto-suave pointer-coarse:py-3 ${recuoDireita ? "pr-20" : "pr-3"}`}>
          Selecione um elemento para ver o caminho dele.
        </p>
      ) : (
        <ol
          ref={lista}
          className={`flex items-center gap-0.5 overflow-x-auto whitespace-nowrap py-1 pl-2 font-codigo text-xs [scrollbar-width:thin] ${
            recuoDireita ? "pr-20" : "pr-2"
          }`}
        >
          <li className="flex items-center">
            <span className="px-1.5 py-0.5 text-texto-suave" title="O html é a raiz de tudo. Aqui o painel começa no body.">
              html
            </span>
          </li>
          {itens.map((item, indice) => {
            const ultimo = indice === itens.length - 1;
            return (
              <li key={item.chave} className="flex items-center">
                <span className="px-0.5 text-texto-suave" aria-hidden="true">
                  ›
                </span>
                <button
                  type="button"
                  onClick={() => aoSelecionar(item.caminho)}
                  aria-current={ultimo ? "location" : undefined}
                  title={ultimo ? "Elemento selecionado" : `Selecionar ${rotuloDo(item)}, que guarda o selecionado`}
                  className={`max-w-[16rem] truncate rounded-md px-1.5 py-0.5 text-codigo-tag pointer-coarse:min-h-11 ${
                    ultimo ? "bg-selecao font-bold" : "hover:bg-hover"
                  }`}
                >
                  {rotuloDo(item)}
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
