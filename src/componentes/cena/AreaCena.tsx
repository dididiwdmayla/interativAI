"use client";

/*
 * A área "cena" de uma fase composta: o desenho da cena e a barra de
 * controle (tocar e pausar, a barra de tempo da simulação e a velocidade:
 * 1x, 2x e 4x). O tempo é controlado de fora (useCena), porque a linha do
 * tempo da execução e o palco andam junto com ele.
 */
import type { ReactNode } from "react";
import { IconeTocar } from "@/componentes/icones/IconeTocar";
import { type DadosCena, type FiltroPasso, type RastroCena, textoDoTempo } from "@/motor/cena/modelo";
import { CenaSvg } from "./CenaSvg";

export const VELOCIDADES = [1, 2, 4] as const;
export type VelocidadeCena = (typeof VELOCIDADES)[number];

type Props = {
  dados: DadosCena;
  rastro: RastroCena;
  tempoMs: number;
  filtro: FiltroPasso | null;
  tocando: boolean;
  velocidade: VelocidadeCena;
  aoTocar: () => void;
  aoPausar: () => void;
  aoMudarTempo: (ms: number) => void;
  aoMudarVelocidade: (velocidade: VelocidadeCena) => void;
  aoTocarDispositivo?: (id: string) => void;
  destacado?: string | null;
  /** O nome da cena num selo no canto (em pé, ele já está no cabeçalho). */
  mostrarTitulo: boolean;
  /** O que aconteceu na última simulação ("A simulação terminou"...). */
  aviso?: string | null;
  /** Embrulha o seletor de velocidade (o alvo da apresentação da ferramenta). */
  alvoVelocidade?: (seletor: ReactNode) => ReactNode;
  /** Por cima do desenho (a ficha do dispositivo). */
  sobreposicao?: ReactNode;
};

export function AreaCena({
  dados,
  rastro,
  tempoMs,
  filtro,
  tocando,
  velocidade,
  aoTocar,
  aoPausar,
  aoMudarTempo,
  aoMudarVelocidade,
  aoTocarDispositivo,
  destacado,
  mostrarTitulo,
  aviso,
  alvoVelocidade = (seletor) => seletor,
  sobreposicao,
}: Props) {
  const botao =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primaria bg-primaria text-sobre-primaria hover:brightness-110 pointer-coarse:h-11 pointer-coarse:w-11";
  const seletor = (
    <div role="radiogroup" aria-label="Velocidade da simulação" className="inline-flex shrink-0 rounded-full border-2 border-borda bg-superficie p-0.5" data-velocidade-cena={velocidade}>
      {VELOCIDADES.map((opcao) => (
        <button
          key={opcao}
          type="button"
          role="radio"
          aria-checked={velocidade === opcao}
          onClick={() => aoMudarVelocidade(opcao)}
          className={`min-h-7 min-w-8 rounded-full px-1.5 text-xs font-black pointer-coarse:min-h-10 pointer-coarse:min-w-10 ${velocidade === opcao ? "bg-primaria text-sobre-primaria" : "text-texto-suave hover:text-texto"}`}
          data-velocidade={opcao}
        >
          {opcao}x
        </button>
      ))}
    </div>
  );
  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-painel shadow-[0_8px_0_var(--cor-sombra)]"
      data-area-cena={dados.id}
      data-tocando={tocando ? "sim" : "nao"}
    >
      <div className="relative min-h-0 flex-1 bg-codigo-fundo">
        <CenaSvg dados={dados} rastro={rastro} tempoMs={tempoMs} filtro={filtro} aoTocarDispositivo={aoTocarDispositivo} destacado={destacado} />
        {mostrarTitulo && (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full border-2 border-borda bg-superficie/90 px-2.5 py-0.5 text-xs font-black text-texto">{dados.titulo}</span>
        )}
        {aviso && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 max-w-[90%] -translate-x-1/2 truncate rounded-full border-2 border-borda bg-superficie/95 px-3 py-0.5 text-xs font-bold text-texto" aria-live="polite" data-aviso-cena>
            {aviso}
          </span>
        )}
        {sobreposicao}
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t-2 border-borda bg-painel px-2 py-1.5">
        <button type="button" className={botao} onClick={tocando ? aoPausar : aoTocar} aria-label={tocando ? "Pausar a cena" : "Tocar a cena do começo"} data-tocar-cena>
          <IconeTocar pausar={tocando} />
        </button>
        <input
          type="range"
          min={0}
          max={dados.duracaoMs}
          step={50}
          value={Math.min(dados.duracaoMs, Math.round(tempoMs))}
          onChange={(evento) => aoMudarTempo(Number(evento.target.value))}
          aria-label="Tempo da cena"
          aria-valuetext={`${textoDoTempo(tempoMs)} de ${textoDoTempo(dados.duracaoMs)}`}
          className="h-8 min-w-0 flex-1 accent-primaria pointer-coarse:h-11"
          data-barra-cena
        />
        <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-texto" data-relogio-cena>
          {textoDoTempo(tempoMs)}
        </span>
        {alvoVelocidade(seletor)}
      </div>
    </div>
  );
}
