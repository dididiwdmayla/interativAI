"use client";

import { useMemo } from "react";
import { Mascote } from "@/componentes/mascote/Mascote";
import { MiniPrevia } from "@/componentes/preview/MiniPrevia";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import type { FaseDesafio, Unidade } from "@/conteudo/tipos";
import { documentoInteiroInicial } from "@/lib/documentoSiteAlvo";
import { circuitosDoDesafio, composicaoDoDesafio, estadoFinalDoDesafio, memoriasDoDesafio, type RetratoComposicao } from "@/motor/simulacao";
import { ehContrato } from "@/motor/contrato/modelo";
import { faseComposta } from "@/motor/composicao";
import { MiniComposicao } from "@/componentes/composicao/MiniComposicao";
import { MiniBancada } from "@/componentes/circuito/MiniBancada";
import { PalcoMemoria } from "@/componentes/palco/PalcoMemoria";

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
/** O palco da memória em miniatura, para o antes e o depois de um desafio de programa. */
function MiniPalco({ foto, legenda }: { foto: ReturnType<typeof memoriasDoDesafio>["antes"]; legenda: string }) {
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1" data-mini-palco={legenda}>
      <figcaption className="text-xs font-black uppercase tracking-wide text-texto-suave">{legenda}</figcaption>
      <div className="flex h-56 flex-col overflow-hidden rounded-xl border-2 border-borda text-[13px]">
        <PalcoMemoria foto={foto} anterior={null} passo={null} erro={null} />
      </div>
    </figure>
  );
}

export function TelaMeta({ aberta, unidade, desafio, noDesafio, aoComecar }: Props) {
  const deCircuito = desafio.circuito !== undefined;
  // Desafio composto: o antes e o depois das áreas (o plano, o código e os casos de teste).
  const composto = faseComposta(desafio);
  const deProgramas = desafio.programa !== undefined && !deCircuito && !composto;
  const semPagina = deProgramas || deCircuito || composto;
  // Contrato: a meta mostra só o mundo (a cena) antes e depois; o código é o aluno que escreve.
  const deContrato = ehContrato(desafio);
  const composicao = useMemo(() => {
    if (!composto || !aberta) return null;
    const retratos = composicaoDoDesafio(desafio);
    if (!deContrato) return retratos;
    const soCena = (retrato: RetratoComposicao): RetratoComposicao => ({ ...retrato, plano: null, codigo: null, casos: null });
    return { antes: soCena(retratos.antes), depois: soCena(retratos.depois) };
  }, [aberta, composto, deContrato, desafio]);
  const depois = useMemo(() => (semPagina ? { body: "", css: null } : estadoFinalDoDesafio(desafio)), [semPagina, desafio]);
  // Desafio de programa: o palco antes e depois (a memória que as soluções das partes deixam).
  const memorias = useMemo(() => (deProgramas && aberta ? memoriasDoDesafio(desafio) : null), [aberta, deProgramas, desafio]);
  // Desafio com circuito (inclusive a ponte com o Console): a bancada antes e depois.
  const circuitos = useMemo(() => (deCircuito && aberta ? circuitosDoDesafio(desafio) : null), [aberta, deCircuito, desafio]);
  const { head, body, titulo, css } = desafio.siteAlvo;
  const inteiro = desafio.modoDocumento === true;
  const antes = inteiro ? documentoInteiroInicial(head, body) : body;

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
              ? composto
                ? "Um problema novo e nenhum passo a passo. Planeje, programe e teste até ficar como o depois, parte por parte."
                : deCircuito
                ? "Um problema novo e nenhum passo a passo. Deixe a bancada igualzinha ao depois, parte por parte."
                : deProgramas
                ? "Um problema novo e nenhum passo a passo. Deixe a memória igualzinha ao depois, parte por parte."
                : "Um site novo e nenhum passo a passo. Deixe o antes igualzinho ao depois, parte por parte."
              : unidade.meta.enunciado}
          </p>
        </div>
      </div>
      {composto ? (
        <div className="mt-4 flex gap-3">
          <MiniComposicao retrato={composicao?.antes ?? null} legenda="Antes" />
          <MiniComposicao retrato={composicao?.depois ?? null} legenda="Depois" />
        </div>
      ) : deCircuito ? (
        <div className="mt-4 flex gap-3">
          <MiniBancada circuito={circuitos?.antes ?? null} legenda="Antes" />
          <MiniBancada circuito={circuitos?.depois ?? null} legenda="Depois" />
        </div>
      ) : deProgramas ? (
        <div className="mt-4 flex gap-3">
          <MiniPalco foto={memorias?.antes ?? null} legenda="Antes" />
          <MiniPalco foto={memorias?.depois ?? null} legenda="Depois" />
        </div>
      ) : (
      <div className="mt-4 flex gap-3">
        <MiniPrevia head={head} body={antes} css={css ?? null} documentoInteiro={inteiro} legenda="Antes" rotulo={`${titulo}, antes`} />
        <MiniPrevia
          head={head}
          body={depois.body}
          css={depois.css}
          documentoInteiro={inteiro}
          legenda="Depois"
          rotulo={`${titulo}, depois`}
        />
      </div>
      )}
      {!noDesafio && (
        <p className="mt-3 text-sm text-texto-suave">
          {deContrato
            ? "No fim da unidade, um cliente de verdade te contrata para fazer isso. Até lá, você conhece o lugar e os aparelhos."
            : "Esse é o desafio do fim da unidade. Até lá, cada passo aparece primeiro com ajuda e depois sozinho."}
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <Botao onClick={aoComecar}>{noDesafio ? "Começar o desafio" : "Bora!"}</Botao>
      </div>
    </Modal>
  );
}
