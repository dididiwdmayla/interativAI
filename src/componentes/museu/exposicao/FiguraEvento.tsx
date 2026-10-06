"use client";

/*
 * A figurinha de um cartão da linha do tempo: um antepassado (acordado,
 * pequeno) ou um objeto da época que não tem antepassado próprio (o cartão
 * perfurado do censo, o transistor, o chip e a IA).
 */
import { Antepassado } from "@/componentes/museu/antepassados/Antepassado";
import { ehIdAntepassado } from "@/motor/exposicao/modelo";
import type { EventoHistorico } from "@/motor/exposicao/modelo";

export function FiguraEvento({ figura, tamanho = 44 }: { figura: EventoHistorico["figura"]; tamanho?: number }) {
  if (ehIdAntepassado(figura)) return <Antepassado id={figura} tamanho={tamanho} className="h-auto shrink-0" />;
  return (
    <svg viewBox="0 0 40 40" width={tamanho} height={tamanho} className="shrink-0" aria-hidden="true">
      {figura === "cartao" && (
        <g>
          <path d="M4 10h28l4 4v16H4z" fill="var(--cor-ante-cartao)" stroke="var(--cor-ante-cartao-sombra)" strokeWidth="1.6" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect
              key={i}
              x={7 + (i % 4) * 7}
              y={i < 4 ? 15 : 22}
              width="3"
              height="4"
              rx="0.8"
              fill={(i * 5) % 3 === 0 ? "var(--cor-ante-madeira-sombra)" : "transparent"}
            />
          ))}
        </g>
      )}
      {figura === "transistor" && (
        <g>
          <path d="M10 8h20v14a10 10 0 0 1-20 0z" fill="var(--cor-ante-disquete)" stroke="var(--cor-ante-contorno)" strokeWidth="1.6" />
          <path d="M14 30v8M20 32v6M26 30v8" stroke="var(--cor-ante-latao)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M14 12h12" stroke="var(--cor-ante-branco)" strokeOpacity="0.5" strokeWidth="2" />
        </g>
      )}
      {figura === "chip" && (
        <g>
          <rect x="9" y="9" width="22" height="22" rx="3" fill="var(--cor-ante-disquete)" stroke="var(--cor-ante-contorno)" strokeWidth="1.6" />
          {[13, 18, 23, 28].map((p) => (
            <g key={p} stroke="var(--cor-ante-latao)" strokeWidth="2" strokeLinecap="round">
              <path d={`M${p - 1} 9V4M${p - 1} 31v5M9 ${p - 1}H4M31 ${p - 1}h5`} />
            </g>
          ))}
          <rect x="15" y="15" width="10" height="10" rx="1.5" fill="var(--cor-ante-latao)" />
        </g>
      )}
      {figura === "ia" && (
        <g>
          <circle cx="20" cy="20" r="15" fill="var(--cor-ante-celular-tela)" stroke="var(--cor-ante-contorno)" strokeWidth="1.6" />
          {[
            [12, 15],
            [28, 15],
            [20, 28],
            [20, 12],
          ].map(([x, y], i, todos) => (
            <g key={i}>
              {todos.slice(i + 1).map(([x2, y2]) => (
                <path key={`${x2}-${y2}`} d={`M${x} ${y}L${x2} ${y2}`} stroke="var(--cor-ante-globo)" strokeWidth="1.4" />
              ))}
              <circle cx={x} cy={y} r="3" fill="var(--cor-ante-fio-b)" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
