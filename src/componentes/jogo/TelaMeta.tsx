"use client";

import { useMemo } from "react";
import { Mascote } from "@/componentes/mascote/Mascote";
import { MiniPrevia } from "@/componentes/preview/MiniPrevia";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import type { FaseDesafio, Unidade } from "@/conteudo/tipos";
import { documentoInteiroInicial } from "@/lib/documentoSiteAlvo";
import {
  circuitosDoDesafio,
  composicaoDoDesafio,
  estadoFinalDoDesafio,
  type LinhaDaSaida,
  memoriasDoDesafio,
  metaDoContrato,
  retratoTemConteudo,
} from "@/motor/simulacao";
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

/**
 * (Contrato sem cena) A saída do programa antes ou depois do conserto: o que
 * ele escreve no console e o que fica nas variáveis. O que o conserto mudou
 * fica em destaque (no antes, o que estava errado; no depois, o certo).
 */
function MiniSaida({ linhas, legenda }: { linhas: LinhaDaSaida[]; legenda: "Antes" | "Depois" }) {
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1" data-mini-saida={legenda}>
      <figcaption className="text-xs font-black uppercase tracking-wide text-texto-suave">{legenda}</figcaption>
      <div className="flex min-h-28 flex-col gap-1 overflow-hidden rounded-xl border-2 border-borda bg-codigo-fundo p-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-texto-suave">O que o programa devolve</p>
        <ul className="flex flex-col gap-1 font-mono text-[11px] leading-snug text-codigo-texto">
          {linhas.map((linha) => (
            <li
              key={`${linha.rotulo}-${linha.texto}`}
              data-mudou={linha.mudou ? "sim" : "nao"}
              className={`break-all rounded-md px-1.5 py-0.5 ${
                linha.mudou ? (legenda === "Antes" ? "bg-erro/15 font-bold text-texto" : "bg-sucesso/15 font-bold text-texto") : ""
              }`}
            >
              <span className="text-texto-suave">{linha.rotulo === "console" ? ">" : `${linha.rotulo}:`}</span> {linha.texto}
            </li>
          ))}
        </ul>
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
  // Contrato: a cena antes (com o sistema que o cliente já tem) e depois; sem cena, a saída do programa; sem nada, nem a seção.
  const doContrato = useMemo(() => (deContrato && aberta ? metaDoContrato(desafio) : null), [aberta, deContrato, desafio]);
  const composicao = useMemo(() => {
    if (!composto || !aberta) return null;
    if (deContrato) return doContrato?.tipo === "cena" ? { antes: doContrato.antes, depois: doContrato.depois } : null;
    return composicaoDoDesafio(desafio);
  }, [aberta, composto, deContrato, doContrato, desafio]);
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
      {/* Antes e depois: só com algo de verdade para mostrar (nunca caixas vazias). */}
      {composto ? (
        doContrato?.tipo === "saida" ? (
          <div className="mt-4 flex gap-3" data-meta-antes-depois="saida">
            <MiniSaida linhas={doContrato.antes} legenda="Antes" />
            <MiniSaida linhas={doContrato.depois} legenda="Depois" />
          </div>
        ) : composicao && (retratoTemConteudo(composicao.antes) || retratoTemConteudo(composicao.depois)) ? (
          <div className="mt-4 flex gap-3" data-meta-antes-depois={deContrato ? "cena" : "composicao"}>
            <MiniComposicao retrato={composicao.antes} legenda="Antes" />
            <MiniComposicao retrato={composicao.depois} legenda="Depois" />
          </div>
        ) : null
      ) : deCircuito ? (
        <div className="mt-4 flex gap-3">
          <MiniBancada circuito={circuitos?.antes ?? null} legenda="Antes" />
          <MiniBancada circuito={circuitos?.depois ?? null} legenda="Depois" />
        </div>
      ) : deProgramas ? (
        memorias && (memorias.antes || memorias.depois) ? (
          <div className="mt-4 flex gap-3">
            <MiniPalco foto={memorias.antes} legenda="Antes" />
            <MiniPalco foto={memorias.depois} legenda="Depois" />
          </div>
        ) : null
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
