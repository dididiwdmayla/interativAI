"use client";

import { useMemo } from "react";
import { Mascote } from "@/componentes/mascote/Mascote";
import { MiniPrevia } from "@/componentes/preview/MiniPrevia";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import type { FaseDesafio, Unidade } from "@/conteudo/tipos";
import { estadoFinalDoDesafio } from "@/motor/simulacao";

type Props = {
  aberta: boolean;
  unidade: Unidade;
  /** O desafio da unidade: o antes e o depois vêm do site dele. */
  desafio: FaseDesafio;
  /** A meta aparece antes do próprio desafio (e não no começo da unidade). */
  noDesafio: boolean;
  aoComecar: () => void;
};

/**
 * A meta da unidade: o jogador vê o X pronto antes de começar. Mostra o
 * site do desafio antes e depois (o depois sai das soluções das partes).
 */
export function TelaMeta({ aberta, unidade, desafio, noDesafio, aoComecar }: Props) {
  const depois = useMemo(() => estadoFinalDoDesafio(desafio), [desafio]);
  const { head, body, titulo, css } = desafio.siteAlvo;

  return (
    <Modal aberto={aberta} titulo={noDesafio ? "Hora do desafio" : "Meta da unidade"} aoFechar={aoComecar} className="max-w-2xl">
      <div className="flex items-start gap-3" data-meta>
        <Mascote expressao={noDesafio ? "curioso" : "comemorando"} tamanho={84} className="shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-texto-suave">
            {unidade.zona} · Unidade {unidade.numero}
          </p>
          <p className="text-xl font-black text-primaria">{noDesafio ? "Hora do desafio!" : unidade.titulo}</p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-texto">
            {noDesafio
              ? "Um site novo e nenhum passo a passo. Deixe o antes igualzinho ao depois, parte por parte."
              : unidade.meta.enunciado}
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <MiniPrevia head={head} body={body} css={css ?? null} legenda="Antes" rotulo={`${titulo}, antes`} />
        <MiniPrevia head={head} body={depois.body} css={depois.css} legenda="Depois" rotulo={`${titulo}, depois`} />
      </div>
      {!noDesafio && (
        <p className="mt-3 text-sm text-texto-suave">
          Esse é o desafio do fim da unidade. Até lá, cada passo aparece primeiro com ajuda e depois sozinho.
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <Botao onClick={aoComecar}>{noDesafio ? "Começar o desafio" : "Bora!"}</Botao>
      </div>
    </Modal>
  );
}
