"use client";

/*
 * Uma peça da bancada, em SVG: a chave (entrada), os portões E, OU, NÃO e
 * OU exclusivo nas formas de sempre, e a saída (lâmpada ou porta). As
 * bolinhas são as portas: a da direita é a saída da peça, as da esquerda
 * recebem fio. As áreas de toque das bolinhas são maiores que o desenho.
 */
import type { PointerEvent } from "react";
import { NOME_DO_PORTAO, type Peca } from "@/motor/circuito/modelo";
import { geometriaDa } from "./geometria";

type Props = {
  peca: Peca;
  acesa: boolean;
  selecionada: boolean;
  destacada: boolean;
  /** A saída desta peça está esperando o fio (o jogador tocou nela). */
  puxando: boolean;
  toque: boolean;
  aoApertarCorpo: (evento: PointerEvent<SVGGElement>) => void;
  aoTocarSaida: () => void;
  aoTocarEntrada: (porta: number) => void;
};

const FORMA: Record<"e" | "ou" | "nao" | "xou", string> = {
  e: "M 10 3 H 36 A 22 22 0 0 1 36 47 H 10 Z",
  ou: "M 8 3 Q 36 3 62 25 Q 36 47 8 47 Q 20 25 8 3 Z",
  nao: "M 10 6 L 54 25 L 10 44 Z",
  xou: "M 12 3 Q 38 3 62 25 Q 38 47 12 47 Q 24 25 12 3 Z",
};

export function PecaCircuito({ peca, acesa, selecionada, destacada, puxando, toque, aoApertarCorpo, aoTocarSaida, aoTocarEntrada }: Props) {
  const g = geometriaDa(peca);
  // As duas bolinhas de entrada de um portão ficam a 30 de distância: a área de toque não passa de 14.
  // No toque, o alvo grande é o corpo da peça (com um fio puxado, tocar nele liga na bolinha mais perto).
  const raio = toque ? 14 : 12;
  const raioSaida = toque ? 15 : 13;
  const contorno = selecionada ? "var(--cor-primaria)" : "var(--cor-texto)";
  const rotulo = peca.rotulo ?? peca.nome ?? peca.id;
  return (
    <g data-peca={peca.id} data-tipo-peca={peca.tipo} data-acesa={acesa ? "sim" : "nao"}>
      {destacada && (
        <rect x={peca.x - 8} y={peca.y - 8} width={g.largura + 16} height={g.altura + 16} rx={14} fill="none" stroke="var(--cor-destaque)" strokeWidth={4} className="animate-pulse" />
      )}
      <g
        onPointerDown={aoApertarCorpo}
        style={{ cursor: peca.tipo === "entrada" ? "pointer" : "grab", touchAction: "none" }}
        role="button"
        aria-label={
          peca.tipo === "entrada"
            ? `Chave ${rotulo}: ${peca.ligada ? "ligada" : "desligada"}`
            : peca.tipo === "saida"
              ? `Saída ${rotulo}: ${acesa ? "acesa" : "apagada"}`
              : `Portão ${NOME_DO_PORTAO[peca.tipo]}`
        }
        data-corpo-peca={peca.id}
      >
        <rect x={peca.x} y={peca.y} width={g.largura} height={g.altura} rx={10} fill="transparent" />
        {peca.tipo === "entrada" && (
          <>
            <rect x={peca.x} y={peca.y} width={g.largura} height={g.altura} rx={10} fill="var(--cor-superficie)" stroke={contorno} strokeWidth={2} />
            <rect x={peca.x + 8} y={peca.y + 8} width={34} height={18} rx={9} fill={peca.ligada ? "var(--cor-fio-ligado)" : "var(--cor-fio-desligado)"} />
            <circle cx={peca.x + (peca.ligada ? 33 : 17)} cy={peca.y + 17} r={7} fill="var(--cor-superficie)" stroke="var(--cor-texto)" strokeWidth={1.5} />
            <text x={peca.x + 48} y={peca.y + 22} fontSize={11} fontWeight={800} fill="var(--cor-texto)">
              {peca.ligada ? "ligada" : "desligada"}
            </text>
            <text x={peca.x + 8} y={peca.y + 40} fontSize={11} fontWeight={700} fill="var(--cor-texto-suave)">
              {rotulo}
            </text>
          </>
        )}
        {peca.tipo === "saida" && (
          <>
            <rect x={peca.x} y={peca.y} width={g.largura} height={g.altura} rx={10} fill="var(--cor-superficie)" stroke={contorno} strokeWidth={2} />
            {peca.forma === "porta" ? (
              <>
                <rect x={peca.x + 30} y={peca.y + 6} width={30} height={42} rx={2} fill="var(--cor-circuito-grade)" stroke="var(--cor-texto)" strokeWidth={1.5} />
                <path
                  d={acesa ? `M ${peca.x + 30} ${peca.y + 6} L ${peca.x + 42} ${peca.y + 10} L ${peca.x + 42} ${peca.y + 44} L ${peca.x + 30} ${peca.y + 48} Z` : `M ${peca.x + 30} ${peca.y + 6} H ${peca.x + 60} V ${peca.y + 48} H ${peca.x + 30} Z`}
                  fill={acesa ? "var(--cor-lampada-acesa)" : "var(--cor-madeira)"}
                  stroke="var(--cor-texto)"
                  strokeWidth={1.5}
                />
              </>
            ) : (
              <>
                {acesa && <circle cx={peca.x + g.largura / 2} cy={peca.y + 26} r={24} fill="var(--cor-lampada-acesa)" opacity={0.35} />}
                <circle cx={peca.x + g.largura / 2} cy={peca.y + 26} r={15} fill={acesa ? "var(--cor-lampada-acesa)" : "var(--cor-superficie)"} stroke="var(--cor-texto)" strokeWidth={2} />
                <path d={`M ${peca.x + g.largura / 2 - 5} ${peca.y + 42} h 10`} stroke="var(--cor-texto)" strokeWidth={2} />
              </>
            )}
            <text x={peca.x + g.largura / 2} y={peca.y + 63} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--cor-texto-suave)">
              {rotulo}
            </text>
          </>
        )}
        {(peca.tipo === "e" || peca.tipo === "ou" || peca.tipo === "nao" || peca.tipo === "xou") && (
          <g transform={`translate(${peca.x} ${peca.y + 5})`}>
            {peca.tipo === "xou" && <path d="M 4 3 Q 16 25 4 47" fill="none" stroke={contorno} strokeWidth={2} />}
            <path d={FORMA[peca.tipo]} fill="var(--cor-superficie)" stroke={contorno} strokeWidth={2.5} strokeLinejoin="round" />
            {peca.tipo === "nao" && <circle cx={60} cy={25} r={5} fill="var(--cor-superficie)" stroke={contorno} strokeWidth={2} />}
            <text x={peca.tipo === "nao" ? 26 : 32} y={29} fontSize={peca.tipo === "xou" ? 9 : 12} fontWeight={900} textAnchor="middle" fill="var(--cor-texto)">
              {peca.tipo === "xou" ? "XOU" : NOME_DO_PORTAO[peca.tipo]}
            </text>
          </g>
        )}
      </g>
      {g.entradas.map((ponto, porta) => (
        <g key={porta} onClick={() => aoTocarEntrada(porta)} style={{ cursor: "crosshair" }} data-porta-entrada={`${peca.id}:${porta}`}>
          <circle cx={ponto.x} cy={ponto.y} r={raio} fill="transparent" />
          <circle cx={ponto.x} cy={ponto.y} r={5.5} fill="var(--cor-superficie)" stroke="var(--cor-texto)" strokeWidth={2} />
        </g>
      ))}
      {g.saida && (
        <g onClick={aoTocarSaida} style={{ cursor: "crosshair" }} data-porta-saida={peca.id}>
          <circle cx={g.saida.x} cy={g.saida.y} r={raioSaida} fill="transparent" />
          <circle
            cx={g.saida.x}
            cy={g.saida.y}
            r={puxando ? 8 : 6}
            fill={acesa ? "var(--cor-fio-ligado)" : "var(--cor-superficie)"}
            stroke={puxando ? "var(--cor-primaria)" : "var(--cor-texto)"}
            strokeWidth={puxando ? 3 : 2}
            className={puxando ? "animate-pulse" : ""}
          />
        </g>
      )}
    </g>
  );
}
