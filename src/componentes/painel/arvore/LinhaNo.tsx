"use client";

import { type ReactNode, useRef } from "react";
import { reivindicarToque } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import type { LinhaArvore, NoArvore } from "@/lib/arvore";
import { TagAbertura } from "./TagAbertura";
import { TextoEditavel } from "./TextoEditavel";
import { type EdicaoArvore, TAGS_VAZIAS } from "./tipos";

type Props = {
  linha: LinhaArvore;
  recolhido: boolean;
  selecionada: boolean;
  destaque: "no" | "texto" | null;
  edicao: EdicaoArvore | null;
  /** Nome novo sendo digitado para a tag deste nó (o fechamento acompanha). */
  rascunhoTag: string | null;
  /** Barra de ações do celular, mostrada embaixo do nó selecionado. */
  barra?: ReactNode;
  aoClicar: () => void;
  aoPassarMouse: () => void;
  aoAlternar: () => void;
  /** Botão direito (mouse) ou toque longo (dedo) no nó. */
  aoPedirMenu: (x: number, y: number) => void;
  aoIniciarEdicao: (edicao: EdicaoArvore) => void;
  aoCancelarEdicao: () => void;
  aoConfirmarTexto: (alvo: NoArvore, texto: string) => void;
  aoConfirmarAtributo: (alvo: NoArvore, nome: string, valor: string) => void;
  aoConfirmarNovoAtributo: (alvo: NoArvore, texto: string) => void;
  aoConfirmarTag: (alvo: NoArvore, novaTag: string) => void;
  aoDigitarTag: (rascunho: string) => void;
};

const RECUO_PX = 16;
const CLASSE_PULSO = "animate-[pulsar-no_1.1s_ease-in-out_infinite] bg-[var(--cor-codigo-destaque-linha)]";
const TOQUE_LONGO_MS = 550;
const TOLERANCIA_PX = 10;

/** Uma linha da árvore: tag de abertura, texto solto ou comentário. */
export function LinhaNo({
  linha,
  recolhido,
  selecionada,
  destaque,
  edicao,
  rascunhoTag,
  barra,
  aoClicar,
  aoPassarMouse,
  aoAlternar,
  aoPedirMenu,
  aoIniciarEdicao,
  aoCancelarEdicao,
  aoConfirmarTexto,
  aoConfirmarAtributo,
  aoConfirmarNovoAtributo,
  aoConfirmarTag,
  aoDigitarTag,
}: Props) {
  const { no } = linha;
  const temFilhos = no.filhos.length > 0;
  const editandoTexto = edicao?.alvo === "texto" && edicao.chave === no.chave;
  const toque = useRef<{ x: number; y: number; temporizador: ReturnType<typeof setTimeout> } | null>(null);
  const engolirClique = useRef(false);

  const cancelarToque = () => {
    if (toque.current) clearTimeout(toque.current.temporizador);
    toque.current = null;
  };

  const textoEditavel = (alvo: NoArvore, valor: string, marcadorVazio?: string) => (
    <TextoEditavel
      valor={valor}
      editando={editandoTexto}
      rotulo={no.tipo === "elemento" ? `Texto de ${no.tag}` : "Texto"}
      marcadorVazio={marcadorVazio}
      className={`text-codigo-texto ${destaque === "texto" ? `rounded-md ${CLASSE_PULSO}` : ""}`}
      aoIniciar={() => aoIniciarEdicao({ chave: no.chave, alvo: "texto" })}
      aoConfirmar={(novo) => aoConfirmarTexto(alvo, novo)}
      aoCancelar={aoCancelarEdicao}
    />
  );

  let conteudo;
  if (no.tipo === "texto") {
    conteudo = (
      <span className="text-codigo-texto">
        &quot;{textoEditavel(no, no.texto)}&quot;
      </span>
    );
  } else if (no.tipo === "comentario") {
    conteudo = <span className="italic text-codigo-comentario">&lt;!-- {no.texto} --&gt;</span>;
  } else {
    const vazia = TAGS_VAZIAS.has(no.tag);
    conteudo = (
      <>
        <TagAbertura
          no={no}
          edicao={edicao}
          aoIniciarAtributo={(nome) => aoIniciarEdicao({ chave: no.chave, alvo: "atributo", nome })}
          aoConfirmarAtributo={(nome, valor) => aoConfirmarAtributo(no, nome, valor)}
          aoConfirmarNovoAtributo={(texto) => aoConfirmarNovoAtributo(no, texto)}
          aoIniciarTag={() => aoIniciarEdicao({ chave: no.chave, alvo: "tag" })}
          aoConfirmarTag={(novaTag) => aoConfirmarTag(no, novaTag)}
          aoDigitarTag={aoDigitarTag}
          aoCancelar={aoCancelarEdicao}
        />
        {no.textoEmLinha && textoEditavel(no.textoEmLinha, no.textoEmLinha.texto)}
        {!vazia && !no.textoEmLinha && !temFilhos && textoEditavel(no, "", " ")}
        {temFilhos && recolhido && (
          <span className="mx-0.5 rounded bg-hover px-1 text-texto-suave" aria-hidden="true">
            …
          </span>
        )}
        {!vazia && (!temFilhos || recolhido) && (
          <span className="text-codigo-tag">&lt;/{rascunhoTag ?? no.tag}&gt;</span>
        )}
      </>
    );
  }

  return (
    <div
      id={linha.id}
      role="treeitem"
      aria-level={linha.profundidade + 1}
      aria-selected={selecionada}
      aria-expanded={temFilhos ? !recolhido : undefined}
      data-chave={no.chave}
    >
      <div
        onClick={() => {
          if (engolirClique.current) {
            engolirClique.current = false;
            return;
          }
          aoClicar();
        }}
        onMouseEnter={aoPassarMouse}
        onContextMenu={(evento) => {
          evento.preventDefault();
          aoPedirMenu(evento.clientX, evento.clientY);
        }}
        onPointerDown={(evento) => {
          if (evento.pointerType !== "touch") return;
          // O toque longo aqui é o menu do nó, não o card da árvore.
          reivindicarToque(evento.nativeEvent);
          cancelarToque();
          const { clientX: x, clientY: y } = evento;
          toque.current = {
            x,
            y,
            temporizador: setTimeout(() => {
              toque.current = null;
              engolirClique.current = true;
              navigator.vibrate?.(15);
              aoPedirMenu(x, y);
            }, TOQUE_LONGO_MS),
          };
        }}
        onPointerMove={(evento) => {
          const atual = toque.current;
          if (atual && Math.hypot(evento.clientX - atual.x, evento.clientY - atual.y) > TOLERANCIA_PX) cancelarToque();
        }}
        onPointerUp={cancelarToque}
        onPointerCancel={cancelarToque}
        className={`relative flex cursor-default items-start rounded-md py-px pr-2 pointer-coarse:py-2.5 ${
          selecionada ? "bg-selecao" : "hover:bg-hover"
        } ${destaque === "no" ? CLASSE_PULSO : ""}`}
        style={{ paddingLeft: linha.profundidade * RECUO_PX + 4 }}
      >
        <span className="mt-[3px] grid h-4 w-[18px] shrink-0 place-items-center">
          {temFilhos && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={recolhido ? `Expandir ${no.tag}` : `Recolher ${no.tag}`}
              onClick={(evento) => {
                evento.stopPropagation();
                aoAlternar();
              }}
              className="relative grid h-4 w-4 place-items-center rounded text-texto-suave after:absolute after:-inset-3.5 hover:bg-borda hover:text-texto pointer-fine:after:hidden"
            >
              <IconeChevron direcao={recolhido ? "direita" : "baixo"} tamanho={10} />
            </button>
          )}
        </span>
        <span className="min-w-0 whitespace-pre-wrap break-words">
          {conteudo}
          {selecionada && (
            <span className="ml-2 select-none text-texto-suave opacity-70" title="No F12 de verdade, $0 é o elemento selecionado">
              == $0
            </span>
          )}
        </span>
      </div>
      {barra}
    </div>
  );
}
