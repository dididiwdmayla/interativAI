"use client";

import { EstrelasFase } from "@/componentes/layout/EstrelasFase";
import { BalaoFala } from "@/componentes/mascote/BalaoFala";
import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import type { Fala, Fase } from "@/motor/tipos";

type Props = {
  aberta: boolean;
  fase: Fase;
  estrelas: number;
  indiceFala: number;
  fala: Fala;
  missaoFeita: boolean;
  aoAlternarMissao: (feita: boolean) => void;
  aoAvancar: () => void;
  aoFechar: () => void;
  aoRecomecar: () => void;
};

/** Tela de fim de fase: estrelas, falas finais e missão de campo. */
export function TelaConclusao({
  aberta,
  fase,
  estrelas,
  indiceFala,
  fala,
  missaoFeita,
  aoAlternarMissao,
  aoAvancar,
  aoFechar,
  aoRecomecar,
}: Props) {
  const naMissao = indiceFala >= fase.conclusao.length;

  return (
    <Modal aberto={aberta} titulo="Fase completa" aoFechar={aoFechar} className="max-w-xl">
      <div className="flex flex-col items-center text-center">
        <Mascote expressao={naMissao ? fala.expressao : "comemorando"} tamanho={140} />
        <p className="mt-1 text-xs font-black uppercase tracking-wide text-texto-suave">
          {fase.ilha} · {fase.zona} · Fase {fase.numero}
        </p>
        <p className="text-2xl font-black text-primaria">{fase.titulo}: completa!</p>
        <div className="my-2">
          <EstrelasFase quantidade={estrelas} tamanho={40} entrada />
        </div>
      </div>

      {!naMissao ? (
        <div className="mt-2">
          <BalaoFala fala={fala}>
            <Botao onClick={aoAvancar} className="ml-auto">
              Continuar
            </Botao>
          </BalaoFala>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          <section className="rounded-2xl border-2 border-dashed border-secundaria bg-painel p-4 text-left">
            <h3 className="text-sm font-black uppercase tracking-wide text-secundaria">Missão de campo</h3>
            <p className="mt-1 text-sm leading-relaxed">{fase.missaoDeCampo}</p>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={missaoFeita}
                onChange={(evento) => aoAlternarMissao(evento.target.checked)}
                className="h-5 w-5 accent-[var(--cor-sucesso)]"
              />
              Fiz num site de verdade
            </label>
          </section>
          <BalaoFala fala={fase.falaFinal} />
          <div className="flex flex-wrap justify-end gap-2">
            <Botao variante="secundario" onClick={aoRecomecar}>
              Jogar de novo
            </Botao>
            <Botao onClick={aoFechar}>Continuar mexendo no site</Botao>
          </div>
        </div>
      )}
    </Modal>
  );
}
