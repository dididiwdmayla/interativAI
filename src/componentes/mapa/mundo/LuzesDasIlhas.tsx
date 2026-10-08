"use client";

/*
 * As luzes das ilhas, ao entardecer e de noite: janelas acesas, o LED do
 * servidor piscando, a lanterna da obra e o farol da ilha IA girando a luz
 * de verdade. Ficam numa camada por cima da arte (que escurece de noite)
 * e por baixo dos nomes. As coordenadas são as da arte de cada ilha
 * (src/componentes/mapa/arte), em volta do centro dela.
 *
 * Desempenho: as janelas são desenho parado; o que pisca (LEDs) anima
 * opacity e o farol gira por transform, pelo compositor; fora da tela,
 * param. Com menos movimento, o facho do farol fica parado.
 */
import { type CSSProperties, type ReactNode, useId } from "react";
import type { Ponto } from "../geometria";
import { caixaPx, Pausavel } from "./MarDoMundo";

/** A mesma caixa da arte de uma ilha no desenho (MundoMapa, CAIXA_DA_ARTE). */
const CAIXA = { x: -160, y: -130, largura: 320, altura: 230 };

type Janela = { x: number; y: number; largura: number; altura: number; raio?: number };

/** Uma janela acesa: o vidro claro e o brilho em volta. */
function JanelaAcesa({ janela, brilho }: { janela: Janela; brilho: string }) {
  const { x, y, largura, altura, raio = 1.5 } = janela;
  return (
    <g>
      <ellipse cx={x + largura / 2} cy={y + altura / 2} rx={largura / 2 + 10} ry={altura / 2 + 9} fill={`url(#${brilho})`} />
      <rect x={x} y={y} width={largura} height={altura} rx={raio} fill="var(--cor-janela-acesa)" />
    </g>
  );
}

/** As janelas de cada ilha (e do Porto), nas coordenadas da arte dela. */
const JANELAS: Record<string, readonly Janela[]> = {
  origens: [
    { x: -31, y: -46, largura: 7, altura: 30 },
    { x: -11, y: -46, largura: 7, altura: 30 },
    { x: 9, y: -46, largura: 7, altura: 30 },
  ],
  sites: [
    { x: -78, y: -38, largura: 7, altura: 6 },
    { x: -78, y: -26, largura: 7, altura: 6 },
    { x: 71, y: -38, largura: 7, altura: 6 },
    { x: 71, y: -26, largura: 7, altura: 6 },
  ],
  "paginas-vivas": [{ x: 22, y: -6, largura: 50, altura: 18, raio: 9 }],
  python: [
    { x: -46, y: -24, largura: 8, altura: 8, raio: 4 },
    { x: -49, y: -5, largura: 14, altura: 22, raio: 3 },
  ],
  ia: [{ x: 47, y: -64, largura: 12, altura: 9, raio: 2 }],
  oficio: [
    { x: -44, y: -34, largura: 14, altura: 12, raio: 2 },
    { x: -22, y: -16, largura: 18, altura: 26, raio: 3 },
  ],
  porto: [{ x: -58, y: -16, largura: 9, altura: 9 }],
};

/** Os postes de luz das ilhas que não têm janela (um poste com a lâmpada acesa). */
const POSTES: Record<string, readonly Ponto[]> = {
  logica: [{ x: 70, y: 22 }],
  frameworks: [{ x: 58, y: 18 }],
  "rede-servidor": [{ x: -96, y: 22 }],
};

/** O que pisca de noite: o LED do servidor e a luz do alto da antena (Rede). */
const PISCAM: Record<string, readonly (Ponto & { cor: string })[]> = {
  "rede-servidor": [
    { x: -58, y: -11.5, cor: "var(--cor-sucesso)" },
    { x: -58, y: -1.5, cor: "var(--cor-sucesso)" },
    { x: -58, y: 8.5, cor: "var(--cor-sucesso)" },
    { x: -20, y: -80, cor: "var(--cor-erro)" },
  ],
};

function CamadaDeLuz({ centro, escala, children, id }: { centro: Ponto; escala: number; children: ReactNode; id: string }) {
  return (
    <div
      aria-hidden="true"
      className="camada-propria pointer-events-none absolute"
      style={{ left: (centro.x + CAIXA.x) * escala, top: (centro.y + CAIXA.y) * escala, width: CAIXA.largura * escala, height: CAIXA.altura * escala }}
      data-luzes-ilha={id}
    >
      <svg viewBox={`${CAIXA.x} ${CAIXA.y} ${CAIXA.largura} ${CAIXA.altura}`} width="100%" height="100%" className="block overflow-visible">
        {children}
      </svg>
    </div>
  );
}

/** As luzes de uma ilha (`emObra`: a lanterna pendurada no andaime). */
export function LuzesDaIlha({ id, centro, escala, emObra }: { id: string; centro: Ponto; escala: number; emObra: boolean }) {
  const brilho = `brilho-${useId().replace(/:/g, "")}`;
  const janelas = JANELAS[id] ?? [];
  const postes = POSTES[id] ?? [];
  const piscam = PISCAM[id] ?? [];
  if (janelas.length === 0 && postes.length === 0 && piscam.length === 0 && !emObra) return null;
  return (
    <>
      <CamadaDeLuz centro={centro} escala={escala} id={id}>
        <defs>
          <radialGradient id={brilho}>
            <stop offset="0" stopColor="var(--cor-janela-acesa)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--cor-janela-acesa)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {janelas.map((janela, indice) => (
          <JanelaAcesa key={indice} janela={janela} brilho={brilho} />
        ))}
        {postes.map((poste, indice) => (
          <g key={indice} transform={`translate(${poste.x} ${poste.y})`}>
            <path d="M0 0V-30" stroke="var(--cor-madeira)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <circle cy="-32" r="16" fill={`url(#${brilho})`} />
            <circle cy="-32" r="3.5" fill="var(--cor-janela-acesa)" />
          </g>
        ))}
        {emObra && (
          <g transform="translate(30 -62)">
            <path d="M0-4V4" stroke="var(--cor-madeira)" strokeWidth="1.5" />
            <circle cy="9" r="18" fill={`url(#${brilho})`} />
            <rect x="-3.5" y="4" width="7" height="9" rx="2" fill="var(--cor-janela-acesa)" />
          </g>
        )}
      </CamadaDeLuz>
      {piscam.map((ponto, indice) => (
        <Pausavel
          key={indice}
          estilo={{ ...caixaPx({ x: centro.x + ponto.x, y: centro.y + ponto.y }, 10, 10, escala), "--atraso": `${-indice * 0.4}s` } as CSSProperties}
          className="led-pisca"
          data-led=""
        >
          <svg viewBox="-5 -5 10 10" width="100%" height="100%" className="block overflow-visible">
            <circle r="4.5" fill={ponto.cor} opacity="0.35" />
            <circle r="2" fill={ponto.cor} />
          </svg>
        </Pausavel>
      ))}
    </>
  );
}

/** Onde fica a lâmpada do farol na arte da ilha IA (ArteIA, LUZ). */
export const LAMPADA_DO_FAROL: Ponto = { x: 53, y: -60 };
/** O alcance do facho, em unidades do desenho. */
const ALCANCE = 170;

/**
 * O farol da ilha IA girando a luz: dois fachos opostos que varrem o mar
 * numa elipse (o mapa é visto de cima, meio de lado). Uma camada só, que
 * gira por transform; fora da tela, para.
 */
export function FarolDaIA({ centro, escala }: { centro: Ponto; escala: number }) {
  const facho = `facho-${useId().replace(/:/g, "")}`;
  const lampada = { x: centro.x + LAMPADA_DO_FAROL.x, y: centro.y + LAMPADA_DO_FAROL.y };
  return (
    <Pausavel estilo={{ ...caixaPx(lampada, ALCANCE * 2, ALCANCE * 2, escala), transform: "scaleY(0.42)" }} data-farol="">
      <svg viewBox={`${-ALCANCE} ${-ALCANCE} ${ALCANCE * 2} ${ALCANCE * 2}`} width="100%" height="100%" className="farol-gira block overflow-visible">
        <defs>
          <linearGradient id={facho} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--cor-farol-luz)" stopOpacity="0.75" />
            <stop offset="1" stopColor="var(--cor-farol-luz)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0 0L${ALCANCE} -26L${ALCANCE} 26Z`} fill={`url(#${facho})`} />
        <path d={`M0 0L${ALCANCE} -26L${ALCANCE} 26Z`} fill={`url(#${facho})`} transform="rotate(180)" />
        <circle r="10" fill="var(--cor-farol-luz)" opacity="0.6" />
      </svg>
    </Pausavel>
  );
}
