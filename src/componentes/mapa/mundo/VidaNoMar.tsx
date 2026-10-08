"use client";

/*
 * A vida no mar do mundo: peixes que saltam de vez em quando, cada um no
 * seu lugar; uma baleia que aparece raramente (de propósito: é para virar
 * um "eu vi!"), perto de onde a pessoa está olhando; e a garrafa com uma
 * mensagem boiando num canto escondido, com uma curiosidade da história da
 * computação.
 *
 * Desempenho: tudo anima só transform e opacity; os peixes param fora da
 * tela; a baleia é sorteada de tempos em tempos e some depois do mergulho.
 * Com menos movimento, nenhum peixe salta e a baleia não aparece (a garrafa
 * fica, parada).
 */
import { useMenosMovimento } from "@/lib/useConsultaMidia";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import { Modal } from "@/componentes/ui/Modal";
import { Botao } from "@/componentes/ui/Botao";
import type { Ponto } from "../geometria";
import { CURIOSIDADES } from "./curiosidades";
import { caixaPx, Pausavel } from "./MarDoMundo";

type NoDesenho = { escala: number };

/** Um peixinho saltando: o arco, o respingo na saída e na entrada. */
function Peixe({ lugar, escala, indice }: NoDesenho & { lugar: Ponto; indice: number }) {
  const duracao = 9 + indice * 3.5;
  return (
    <Pausavel estilo={{ ...caixaPx(lugar, 70, 60, escala), "--duracao": `${duracao}s`, "--atraso": `${-indice * 2.7}s` } as CSSProperties} data-peixe="">
      <svg viewBox="-35 -40 70 60" width="100%" height="100%" className="respingo absolute inset-0 block overflow-visible">
        <ellipse cx="-14" cy="12" rx="9" ry="3" fill="none" stroke="var(--cor-espuma)" strokeWidth="2" />
        <ellipse cx="16" cy="12" rx="9" ry="3" fill="none" stroke="var(--cor-espuma)" strokeWidth="2" />
      </svg>
      <svg viewBox="-35 -40 70 60" width="100%" height="100%" className="peixe-salta absolute inset-0 block overflow-visible">
        <g transform="translate(-16 10)">
          <path d="M-9 0c4-6 13-6 17 0-4 6-13 6-17 0z" fill="var(--cor-peixe)" />
          <path d="M-8 0l-7-5v10z" fill="var(--cor-peixe)" />
          <circle cx="4" cy="-1" r="1.3" fill="var(--cor-texto)" />
        </g>
      </svg>
    </Pausavel>
  );
}

export function Peixes({ lugares, escala }: NoDesenho & { lugares: readonly Ponto[] }) {
  const reduzir = useMenosMovimento();
  if (reduzir) return null;
  return (
    <>
      {lugares.map((lugar, indice) => (
        <Peixe key={indice} lugar={lugar} escala={escala} indice={indice} />
      ))}
    </>
  );
}

/** De quanto em quanto tempo o mar sorteia a baleia, e a chance de ela aparecer em cada sorteio. */
const SORTEIO_DA_BALEIA_MS = 40_000;
const CHANCE_DA_BALEIA = 0.18;
const MERGULHO_MS = 9_000;

/**
 * A baleia: rara de propósito. De tempos em tempos, o mar sorteia; quando
 * dá, ela sobe num lugar de mar aberto que está na tela, solta o jato,
 * mostra a cauda e mergulha. `?baleia` no endereço chama ela logo (para
 * conferir).
 */
export function Baleia({ lugares, escala }: NoDesenho & { lugares: readonly Ponto[] }) {
  const reduzir = useMenosMovimento();
  const [onde, setOnde] = useState<Ponto | null>(null);
  const ancora = useRef<HTMLDivElement>(null);
  const lugaresAgora = useRef(lugares);
  useEffect(() => {
    lugaresAgora.current = lugares;
  }, [lugares]);

  useEffect(() => {
    if (reduzir) return;
    const area = ancora.current?.closest("[data-area-arrastavel]");
    /** Um lugar de mar aberto que está na tela agora (a baleia é para ser vista). */
    const lugarNaTela = (): Ponto | null => {
      if (!(area instanceof HTMLElement)) return null;
      const na = lugaresAgora.current.filter((lugar) => {
        const x = lugar.x * escala - area.scrollLeft;
        const y = lugar.y * escala - area.scrollTop;
        return x > 60 && x < area.clientWidth - 60 && y > 50 && y < area.clientHeight - 50;
      });
      return na.length ? na[Math.floor(Math.random() * na.length)] : null;
    };
    let fim: ReturnType<typeof setTimeout> | undefined;
    const surgir = () => {
      const lugar = lugarNaTela();
      if (!lugar) return;
      setOnde(lugar);
      tocarEfeito("baleia");
      fim = setTimeout(() => setOnde(null), MERGULHO_MS);
    };
    const pedida = new URLSearchParams(window.location.search).has("baleia");
    const primeira = pedida ? setTimeout(surgir, 1500) : undefined;
    const sorteio = setInterval(() => {
      if (!document.hidden && Math.random() < CHANCE_DA_BALEIA) surgir();
    }, SORTEIO_DA_BALEIA_MS);
    return () => {
      clearTimeout(primeira);
      clearTimeout(fim);
      clearInterval(sorteio);
    };
  }, [escala, reduzir]);

  return (
    <div ref={ancora} aria-hidden="true" className="contents">
      {onde && (
        <div className="pointer-events-none absolute" style={caixaPx(onde, 120, 90, escala)} data-baleia="">
          <svg viewBox="-60 -55 120 90" width="100%" height="100%" className="baleia-surge block overflow-visible">
            {/* A água abrindo em volta */}
            <ellipse cx="0" cy="18" rx="46" ry="9" fill="none" stroke="var(--cor-espuma)" strokeWidth="2.5" opacity="0.8" />
            {/* O jato */}
            <g className="baleia-jato">
              <path d="M-4 -8c-2-12-10-18-16-20M-4 -8c0-14 2-22 2-28M-4 -8c3-12 10-18 16-20" fill="none" stroke="var(--cor-espuma)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="-20" cy="-30" r="3" fill="var(--cor-espuma)" />
              <circle cx="-2" cy="-38" r="3.4" fill="var(--cor-espuma)" />
              <circle cx="13" cy="-30" r="3" fill="var(--cor-espuma)" />
            </g>
            {/* As costas e a cauda */}
            <path d="M-38 16c6-22 44-30 66-10 4 4 6 8 6 10z" fill="var(--cor-baleia)" />
            <path d="M-24 15c10-6 30-8 46-2" fill="none" stroke="var(--cor-baleia-barriga)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <circle cx="14" cy="4" r="2" fill="var(--cor-texto)" />
            <g className="baleia-cauda">
              <path d="M30 14c6-2 10-10 10-18 4 4 12 4 16 0-2 8-10 12-18 14z" fill="var(--cor-baleia)" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * A garrafa com mensagem: boia num canto de mar aberto, longe da rota.
 * Tocar abre uma curiosidade da história da computação; cada vez, a próxima.
 */
export function GarrafaComMensagem({ lugar, escala }: NoDesenho & { lugar: Ponto }) {
  const [aberta, setAberta] = useState(false);
  const [qual, setQual] = useState(0);
  const tamanho = Math.max(44 / escala, 52);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          tocarEfeito("garrafa");
          setAberta(true);
        }}
        aria-label="Uma garrafa boiando, com uma mensagem dentro"
        className="pointer-events-auto absolute grid place-items-center rounded-full focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primaria"
        style={caixaPx(lugar, tamanho, tamanho, escala)}
        data-garrafa
      >
        <svg viewBox="-20 -20 40 40" width="100%" height="100%" className="garrafa-boia block overflow-visible" aria-hidden="true">
          <ellipse cx="0" cy="9" rx="15" ry="3.5" fill="none" stroke="var(--cor-espuma)" strokeWidth="1.6" opacity="0.8" />
          <g transform="rotate(-24)">
            <rect x="-11" y="-5" width="18" height="11" rx="5" fill="var(--cor-garrafa)" opacity="0.85" stroke="var(--cor-texto)" strokeOpacity="0.35" strokeWidth="1.2" />
            <rect x="6" y="-2.5" width="6" height="5" rx="1.5" fill="var(--cor-garrafa)" opacity="0.85" />
            <rect x="11" y="-2" width="3" height="4" rx="1" fill="var(--cor-madeira)" />
            <rect x="-7" y="-2.5" width="9" height="6" rx="1" fill="var(--cor-superficie)" transform="rotate(8)" />
          </g>
        </svg>
      </button>
      <Modal aberto={aberta} titulo="Uma mensagem na garrafa" aoFechar={() => setAberta(false)}>
        <p className="text-base font-bold leading-snug text-texto" data-curiosidade={qual}>
          {CURIOSIDADES[qual % CURIOSIDADES.length]}
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Botao
            variante="secundario"
            onClick={() => {
              tocarEfeito("clique");
              setQual((atual) => (atual + 1) % CURIOSIDADES.length);
            }}
          >
            Outra mensagem
          </Botao>
          <Botao onClick={() => setAberta(false)}>Devolver ao mar</Botao>
        </div>
      </Modal>
    </>
  );
}
