"use client";

/*
 * A bancada do circuito em miniatura, só para ver (a meta de um desafio com
 * circuito: o antes e o depois). Mesmo desenho das peças e dos fios da
 * bancada, sem paleta, sem toque e com as chaves como vieram.
 */
import { useMemo } from "react";
import { type Circuito, fioChave, simular } from "@/motor/circuito/modelo";
import { caminhoDoFio, geometriaDa } from "./geometria";
import { PecaCircuito } from "./PecaCircuito";

const nada = () => {};

export function MiniBancada({ circuito, legenda }: { circuito: Circuito | null; legenda: string }) {
  const simulado = useMemo(() => (circuito ? simular(circuito) : null), [circuito]);
  const quadro = useMemo(() => {
    if (!circuito?.pecas.length) return "0 0 640 380";
    const caixas = circuito.pecas.map((peca) => ({ peca, g: geometriaDa(peca) }));
    const x0 = Math.min(...caixas.map((c) => c.peca.x)) - 16;
    const y0 = Math.min(...caixas.map((c) => c.peca.y)) - 16;
    const x1 = Math.max(...caixas.map((c) => c.peca.x + c.g.largura)) + 16;
    const y1 = Math.max(...caixas.map((c) => c.peca.y + c.g.altura)) + 16;
    return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
  }, [circuito]);
  const porId = new Map(circuito?.pecas.map((peca) => [peca.id, peca]) ?? []);
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1" data-mini-bancada={legenda}>
      <figcaption className="text-xs font-black uppercase tracking-wide text-texto-suave">{legenda}</figcaption>
      <div className="pointer-events-none flex h-48 overflow-hidden rounded-xl border-2 border-borda bg-circuito-fundo" aria-hidden="true">
        {circuito && simulado && (
          <svg viewBox={quadro} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
            {circuito.fios.map((fio) => {
              const de = porId.get(fio.de);
              const para = porId.get(fio.para);
              const saida = de ? geometriaDa(de).saida : null;
              const entrada = para ? geometriaDa(para).entradas[fio.porta] : null;
              if (!saida || !entrada) return null;
              const aceso = simulado.fios[fioChave(fio)];
              return (
                <path
                  key={fioChave(fio)}
                  d={caminhoDoFio(saida, entrada)}
                  stroke={aceso ? "var(--cor-fio-ligado)" : "var(--cor-fio-desligado)"}
                  strokeWidth={aceso ? 5 : 3.5}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
            {circuito.pecas.map((peca) => (
              <PecaCircuito
                key={peca.id}
                peca={peca}
                acesa={Boolean(simulado.valores[peca.id])}
                selecionada={false}
                destacada={false}
                puxando={false}
                escala={1}
                aoApertarCorpo={nada}
                aoTocarSaida={nada}
                aoTocarEntrada={nada}
              />
            ))}
          </svg>
        )}
      </div>
    </figure>
  );
}
