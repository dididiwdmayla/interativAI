"use client";

import { EstrelasFase } from "@/componentes/layout/EstrelasFase";
import { BalaoFala } from "@/componentes/mascote/BalaoFala";
import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import type { LocalDaFase } from "@/conteudo";
import type { ModoJogo } from "@/motor/estadoMotor";
import type { Fala } from "@/motor/tipos";

type Props = {
  aberta: boolean;
  local: LocalDaFase;
  modo: ModoJogo;
  falaFinal: Fala;
  estrelas: number;
  indiceFala: number;
  fala: Fala;
  missaoFeita: boolean;
  /** Título da próxima fase, se houver (mostra "Próxima fase"). */
  proxima: string | null;
  aoAlternarMissao: (feita: boolean) => void;
  aoAvancar: () => void;
  aoFechar: () => void;
  aoRecomecar: () => void;
  aoProxima: () => void;
  /** Revisão: volta para o desafio que abriu esta fase. */
  aoVoltarAoDesafio: () => void;
};

/** Tela de fim de fase: estrelas, falas finais, missão de campo e o caminho para a próxima. */
export function TelaConclusao({
  aberta,
  local,
  modo,
  falaFinal,
  estrelas,
  indiceFala,
  fala,
  missaoFeita,
  proxima,
  aoAlternarMissao,
  aoAvancar,
  aoFechar,
  aoRecomecar,
  aoProxima,
  aoVoltarAoDesafio,
}: Props) {
  const { fase, unidade, numero } = local;
  const naMissao = indiceFala >= fase.conclusao.length;
  const revisao = modo === "revisao";
  const titulo = fase.tipo === "desafio" ? "Desafio completo!" : `${fase.titulo}: completa!`;

  return (
    <Modal aberto={aberta} titulo="Fase completa" aoFechar={aoFechar} className="max-w-xl">
      <div className="flex flex-col items-center text-center" data-conclusao>
        <Mascote expressao={naMissao ? fala.expressao : "comemorando"} tamanho={140} />
        <p className="mt-1 text-xs font-black uppercase tracking-wide text-texto-suave">
          {unidade.ilha} · {unidade.zona} · Unidade {unidade.numero} · {fase.tipo === "desafio" ? "Desafio" : `Fase ${numero}`}
        </p>
        <p className="text-2xl font-black text-primaria">{titulo}</p>
        <div className="my-2">
          {revisao ? (
            <p className="rounded-full bg-painel px-3 py-1 text-sm font-black text-texto-suave">Revisão: sem estrelas</p>
          ) : (
            <EstrelasFase quantidade={estrelas} tamanho={40} entrada />
          )}
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
          {fase.missaoDeCampo && !revisao && (
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
          )}
          <BalaoFala fala={falaFinal} />
          <div className="flex flex-wrap justify-end gap-2">
            {revisao ? (
              <Botao onClick={aoVoltarAoDesafio}>Voltar ao desafio</Botao>
            ) : (
              <>
                <Botao variante="secundario" onClick={aoRecomecar}>
                  Jogar de novo
                </Botao>
                <Botao variante={proxima ? "secundario" : "primario"} onClick={aoFechar}>
                  Continuar mexendo no site
                </Botao>
                {proxima && <Botao onClick={aoProxima}>Próxima fase</Botao>}
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
