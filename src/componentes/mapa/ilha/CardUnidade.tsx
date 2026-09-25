"use client";

import { EstrelasFase } from "@/componentes/layout/EstrelasFase";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import type { Unidade } from "@/conteudo/tipos";
import type { UnidadeCurriculo, ZonaCurriculo } from "@/curriculo/tipos";
import type { AcaoUnidade, EstadoUnidadeMapa } from "@/lib/mapa";

type Props = {
  aberto: boolean;
  zona: ZonaCurriculo;
  item: UnidadeCurriculo;
  /** Conteúdo da unidade (só as prontas têm). */
  conteudo: Unidade | undefined;
  estado: EstadoUnidadeMapa;
  estrelas: number;
  acao: AcaoUnidade | null;
  /** Por que está bloqueada (ex.: "Termine O site é seu para abrir."). */
  motivoBloqueio: string;
  aoJogar: () => void;
  aoFechar: () => void;
};

/** O card de um ponto do mapa: título, meta, estrelas e Jogar, Continuar ou Jogar de novo. */
export function CardUnidade({ aberto, zona, item, conteudo, estado, estrelas, acao, motivoBloqueio, aoJogar, aoFechar }: Props) {
  const posicao = zona.unidades.indexOf(item) + 1;
  return (
    <Modal aberto={aberto} titulo={item.titulo} aoFechar={aoFechar} className="max-w-md">
      <div data-card-unidade={item.id}>
        <p className="text-xs font-black uppercase tracking-wide text-texto-suave">
          {zona.nome} · Unidade {posicao}
        </p>
        <p className="text-xl font-black text-primaria">{item.titulo}</p>
        <p className="mt-1 text-[15px] font-bold leading-snug text-texto">{item.meta}</p>
        {conteudo && (
          <div className="mt-3 flex items-center gap-2">
            <EstrelasFase quantidade={estrelas} tamanho={22} />
            <span className="text-sm font-bold text-texto-suave">
              {estado === "concluida" ? "Unidade concluída!" : `${conteudo.fases.length} fases`}
            </span>
          </div>
        )}
        {estado === "bloqueada" && <p className="mt-3 text-sm font-bold text-texto-suave">{motivoBloqueio}</p>}
        {estado === "planejada" && (
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-texto-suave">
            <span className="rounded-full bg-madeira px-2 py-0.5 text-[11px] font-black uppercase text-superficie">Em breve</span>
            Essa parte do mapa ainda está sendo construída.
          </p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Botao variante="secundario" onClick={aoFechar}>
            Fechar
          </Botao>
          {acao && (estado === "disponivel" || estado === "concluida") && <Botao onClick={aoJogar}>{acao.rotulo}</Botao>}
        </div>
      </div>
    </Modal>
  );
}
