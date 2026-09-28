"use client";

import type { ReactNode } from "react";
import { IconeGirar } from "@/componentes/icones/IconeGirar";
import { type EstadoDispositivo, type IdModelo, LARGURA_MAXIMA, LARGURA_MINIMA, medidasNaTela, MODELOS } from "@/motor/dispositivos";

type Props = {
  estado: EstadoDispositivo;
  /** Zoom para caber (1 = 100%). */
  zoom: number;
  /** No celular: tudo numa linha, só o seletor, a medida, girar e o zoom. */
  compacta: boolean;
  aoTrocarModelo: (modelo: IdModelo | "livre", largura?: number) => void;
  aoGirar: () => void;
  /** Envolve o botão de girar (a ferramenta girar-dispositivo, com o "?" do card). */
  alvoGirar: (botao: ReactNode) => ReactNode;
};

/**
 * A barra de dispositivo, como a do Chrome (DeviceModeToolbar): o aparelho
 * (os modelos prontos ou "Livre"), a largura e a altura, o zoom quando o
 * aparelho não cabe e o botão de girar.
 */
export function BarraDispositivo({ estado, zoom, compacta, aoTrocarModelo, aoGirar, alvoGirar }: Props) {
  const { largura, altura } = medidasNaTela(estado);
  const botaoGirar = (
    <button
      type="button"
      data-girar-dispositivo
      onClick={aoGirar}
      aria-label={estado.deitado ? "Girar o aparelho para ficar em pé" : "Girar o aparelho para ficar deitado"}
      title="Girar"
      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-texto hover:bg-hover pointer-coarse:h-11 pointer-coarse:w-11"
    >
      <IconeGirar tamanho={18} />
    </button>
  );
  return (
    <div
      data-barra-dispositivo
      data-orientacao={altura >= largura ? "retrato" : "paisagem"}
      className={`flex shrink-0 items-center border-b-2 border-borda bg-superficie text-xs font-bold text-texto ${
        compacta ? "flex-nowrap gap-1 px-1.5 py-0.5" : "flex-wrap gap-2 px-3 py-1"
      }`}
    >
      <label className="min-w-0 shrink">
        <span className="sr-only">Aparelho</span>
        <select
          data-modelo-dispositivo
          value={estado.modelo}
          onChange={(evento) => aoTrocarModelo(evento.target.value as IdModelo | "livre")}
          className={`h-7 max-w-full rounded-lg border-2 border-borda bg-superficie px-1.5 font-bold text-texto pointer-coarse:h-11 ${compacta ? "w-[7.5rem]" : ""}`}
        >
          {MODELOS.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>
              {modelo.nome}
            </option>
          ))}
          <option value="livre">Livre (arraste as bordas)</option>
        </select>
      </label>
      {compacta ? (
        <span className="shrink-0 font-codigo text-texto-suave" data-medidas-dispositivo>
          {largura}x{altura}
        </span>
      ) : (
        <span className="flex items-center gap-1 font-codigo" data-medidas-dispositivo>
          <label>
            <span className="sr-only">Largura do aparelho, em px</span>
            <input
              type="number"
              data-largura-dispositivo
              min={LARGURA_MINIMA}
              max={LARGURA_MAXIMA}
              value={largura}
              onChange={(evento) => {
                const valor = Number(evento.target.value);
                if (Number.isFinite(valor) && valor >= LARGURA_MINIMA) aoTrocarModelo("livre", valor);
              }}
              className="h-7 w-16 rounded-lg border-2 border-borda bg-superficie px-1 text-right"
            />
          </label>
          <span aria-hidden="true">x</span>
          <span title="Altura do aparelho">{altura}</span>
        </span>
      )}
      {alvoGirar(botaoGirar)}
      <span
        data-zoom-dispositivo={Math.round(zoom * 100)}
        title={zoom < 1 ? "O aparelho não cabe inteiro aqui: a tela está encolhida para caber (as medidas continuam as de verdade)" : "Tamanho real"}
        className={`shrink-0 rounded-full px-1.5 font-codigo ${zoom < 1 ? "bg-painel text-texto" : "text-texto-suave"}`}
      >
        {Math.round(zoom * 100)}%
      </span>
    </div>
  );
}
