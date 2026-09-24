"use client";

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { achatarArvore, type NoArvore } from "@/lib/arvore";
import { chaveDoCaminho } from "@/lib/dom";
import { LinhaFechamento } from "./LinhaFechamento";
import { LinhaNo } from "./LinhaNo";
import type { DestaqueArvore, EdicaoArvore } from "./tipos";

type Props = {
  raiz: NoArvore | null;
  recolhidos: ReadonlySet<string>;
  caminhoSelecionado: readonly number[] | null;
  destaque: DestaqueArvore | null;
  aoSelecionar: (caminho: number[], origem: "arvore" | "teclado") => void;
  aoAlternar: (chave: string, recolher: boolean) => void;
  aoPassarMouse: (no: Node | null) => void;
  aoEditarTexto: (caminho: number[], texto: string) => void;
  aoEditarAtributo: (caminho: number[], nome: string, valor: string) => void;
};

/** Árvore de Elementos no estilo do F12, construída do body do iframe. */
export function ArvoreElementos({
  raiz,
  recolhidos,
  caminhoSelecionado,
  destaque,
  aoSelecionar,
  aoAlternar,
  aoPassarMouse,
  aoEditarTexto,
  aoEditarAtributo,
}: Props) {
  const recipiente = useRef<HTMLDivElement>(null);
  const [edicao, setEdicao] = useState<EdicaoArvore | null>(null);

  const linhas = useMemo(() => (raiz ? achatarArvore(raiz, recolhidos) : []), [raiz, recolhidos]);
  const nos = useMemo(() => linhas.filter((linha) => linha.tipo === "abertura"), [linhas]);
  const chaveSelecionada = caminhoSelecionado ? chaveDoCaminho(caminhoSelecionado) : null;
  const chaveDestaque = destaque ? chaveDoCaminho(destaque.caminho) : null;
  const indiceSelecionado = nos.findIndex((linha) => linha.no.chave === chaveSelecionada);

  useEffect(() => {
    if (chaveSelecionada === null) return;
    recipiente.current
      ?.querySelector(`[data-chave="${chaveSelecionada}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [chaveSelecionada, raiz]);

  useEffect(() => {
    if (chaveDestaque === null) return;
    recipiente.current
      ?.querySelector(`[data-chave="${chaveDestaque}"]`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [chaveDestaque, raiz]);

  const terminarEdicao = () => {
    setEdicao(null);
    recipiente.current?.focus();
  };

  const selecionarPorTeclado = (no: NoArvore) => {
    aoSelecionar(no.caminho, "teclado");
    aoPassarMouse(no.no);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (edicao || nos.length === 0) return;
    const atual = indiceSelecionado >= 0 ? nos[indiceSelecionado].no : null;
    switch (evento.key) {
      case "ArrowDown": {
        const proximo = nos[Math.min(indiceSelecionado + 1, nos.length - 1)];
        selecionarPorTeclado(proximo.no);
        break;
      }
      case "ArrowUp": {
        const anterior = nos[Math.max(indiceSelecionado - 1, 0)];
        selecionarPorTeclado(anterior.no);
        break;
      }
      case "Home":
        selecionarPorTeclado(nos[0].no);
        break;
      case "End":
        selecionarPorTeclado(nos[nos.length - 1].no);
        break;
      case "ArrowRight":
        if (!atual) selecionarPorTeclado(nos[0].no);
        else if (atual.filhos.length > 0 && recolhidos.has(atual.chave)) aoAlternar(atual.chave, false);
        else if (atual.filhos.length > 0) selecionarPorTeclado(atual.filhos[0]);
        break;
      case "ArrowLeft":
        if (!atual) selecionarPorTeclado(nos[0].no);
        else if (atual.filhos.length > 0 && !recolhidos.has(atual.chave)) aoAlternar(atual.chave, true);
        else if (atual.caminho.length > 0) {
          const pai = nos.find((linha) => linha.no.chave === chaveDoCaminho(atual.caminho.slice(0, -1)));
          if (pai) selecionarPorTeclado(pai.no);
        }
        break;
      case "Enter":
      case "F2":
        if (atual && (atual.tipo === "texto" || (atual.tipo === "elemento" && atual.filhos.length === 0))) {
          setEdicao({ chave: atual.chave, alvo: "texto" });
        }
        break;
      default:
        return;
    }
    evento.preventDefault();
  };

  if (!raiz) {
    return <div className="p-4 text-sm text-texto-suave">Carregando a página...</div>;
  }

  return (
    <div
      ref={recipiente}
      role="tree"
      tabIndex={0}
      aria-label="Árvore de elementos da página. Setas navegam, Enter edita o texto."
      aria-activedescendant={indiceSelecionado >= 0 ? nos[indiceSelecionado].id : undefined}
      onKeyDown={aoTeclar}
      onMouseLeave={() => aoPassarMouse(null)}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) aoPassarMouse(null);
      }}
      className="h-full overflow-auto px-2 py-2 font-codigo text-[13px] leading-6 focus-visible:outline-offset-[-3px]"
    >
      {linhas.map((linha) => {
        if (linha.tipo === "fechamento") {
          return (
            <LinhaFechamento
              key={linha.id}
              linha={linha}
              selecionada={linha.no.chave === chaveSelecionada}
              aoClicar={() => {
                aoSelecionar(linha.no.caminho, "arvore");
                recipiente.current?.focus();
              }}
              aoPassarMouse={() => aoPassarMouse(linha.no.no)}
            />
          );
        }
        const chave = linha.no.chave;
        return (
          <LinhaNo
            key={linha.id}
            linha={linha}
            recolhido={recolhidos.has(chave)}
            selecionada={chave === chaveSelecionada}
            destaque={chave === chaveDestaque && destaque ? destaque.parte : null}
            edicao={edicao}
            aoClicar={() => {
              aoSelecionar(linha.no.caminho, "arvore");
              if (!edicao) recipiente.current?.focus();
            }}
            aoPassarMouse={() => aoPassarMouse(linha.no.no)}
            aoAlternar={() => aoAlternar(chave, !recolhidos.has(chave))}
            aoIniciarEdicao={(nova) => {
              aoSelecionar(linha.no.caminho, "arvore");
              setEdicao(nova);
            }}
            aoCancelarEdicao={terminarEdicao}
            aoConfirmarTexto={(alvo, texto) => {
              terminarEdicao();
              aoEditarTexto(alvo.caminho, texto);
            }}
            aoConfirmarAtributo={(alvo, nome, valor) => {
              terminarEdicao();
              aoEditarAtributo(alvo.caminho, nome, valor);
            }}
          />
        );
      })}
    </div>
  );
}
