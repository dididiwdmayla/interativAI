"use client";

/*
 * "Ver como árvore": um objeto com filhos objetos desenhado como árvore
 * (nós e ligações). Cada objeto é um nó; o rótulo é o nome (ou valor,
 * texto, título...), e os filhos são os campos que guardam objetos (ou
 * listas de objetos). Andando pela linha do tempo ou pelo depurador, o nó
 * que a função de agora está olhando fica aceso (o percurso acontecendo).
 * Embaixo, a ponte: a árvore de Elementos do F12 é a mesma ideia.
 */
import { useContext, useMemo } from "react";
import { IconeArvore } from "@/componentes/icones/IconeArvore";
import { arvoreDoNo, type NoArvore } from "@/motor/estruturas";
import type { NoPalco } from "@/motor/palco";
import { ContextoPalco } from "./contextoPalco";

const LARGURA = 104;
const ALTURA = 42;
const ESPACO_X = 12;
const ESPACO_Y = 30;

type Posto = { no: NoArvore; x: number; y: number; filhos: Posto[] };

/** Posições: as folhas em fila, cada pai no meio dos filhos, um nível por andar. */
function posicionar(no: NoArvore, nivel: number, proximaFolha: { x: number }): Posto {
  const filhos = no.filhos.map((filho) => posicionar(filho, nivel + 1, proximaFolha));
  let x: number;
  if (!filhos.length) {
    x = proximaFolha.x;
    proximaFolha.x += LARGURA + ESPACO_X;
  } else x = (filhos[0].x + filhos[filhos.length - 1].x) / 2;
  return { no, x, y: nivel * (ALTURA + ESPACO_Y), filhos };
}

function todos(posto: Posto): Posto[] {
  return [posto, ...posto.filhos.flatMap(todos)];
}

const curto = (texto: string, max: number) => (texto.length > max ? `${texto.slice(0, max - 1)}…` : texto);

export function ArvorePalco({ no }: { no: NoPalco }) {
  const { visitados } = useContext(ContextoPalco);
  const desenho = useMemo(() => {
    const arvore = arvoreDoNo(no);
    if (!arvore) return null;
    const folhas = { x: 0 };
    const raiz = posicionar(arvore, 0, folhas);
    const postos = todos(raiz);
    const largura = Math.max(LARGURA, folhas.x - ESPACO_X);
    const altura = Math.max(...postos.map((p) => p.y)) + ALTURA;
    return { postos, largura, altura };
  }, [no]);
  if (!desenho) return null;
  const { postos, largura, altura } = desenho;
  return (
    <div className="flex max-w-full flex-col gap-1.5" data-arvore-palco>
      <div className="max-w-full overflow-x-auto">
        <svg width={largura + 8} height={altura + 8} viewBox={`-4 -4 ${largura + 8} ${altura + 8}`} role="img" aria-label="O objeto desenhado como árvore">
          {postos.flatMap((pai) =>
            pai.filhos.map((filho) => {
              const x1 = pai.x + LARGURA / 2;
              const y1 = pai.y + ALTURA;
              const x2 = filho.x + LARGURA / 2;
              const y2 = filho.y;
              const meio = (y1 + y2) / 2;
              return <path key={`${pai.no.id}-${filho.no.id}`} d={`M ${x1} ${y1} C ${x1} ${meio}, ${x2} ${meio}, ${x2} ${y2}`} fill="none" stroke="var(--cor-js-objeto)" strokeWidth={2} />;
            }),
          )}
          {postos.map((posto) => {
            const aceso = visitados.has(posto.no.id);
            return (
              <g key={posto.no.id} transform={`translate(${posto.x} ${posto.y})`} data-no-arvore={posto.no.rotulo} data-no-visitado={aceso ? "sim" : "nao"}>
                <rect
                  width={LARGURA}
                  height={ALTURA}
                  rx={10}
                  fill={aceso ? "var(--cor-destaque)" : "var(--cor-superficie)"}
                  stroke={aceso ? "var(--cor-texto)" : "var(--cor-js-objeto)"}
                  strokeWidth={aceso ? 3 : 2}
                />
                <text x={LARGURA / 2} y={posto.no.detalhe ? 17 : 26} textAnchor="middle" fontSize={13} fontWeight={800} fill={aceso ? "var(--cor-texto-sobre-destaque)" : "var(--cor-texto)"}>
                  {curto(posto.no.rotulo, 13)}
                </text>
                {posto.no.detalhe && (
                  <text x={LARGURA / 2} y={33} textAnchor="middle" fontSize={10} fill={aceso ? "var(--cor-texto-sobre-destaque)" : "var(--cor-texto-suave)"}>
                    {curto(posto.no.detalhe, 17)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="flex items-start gap-1.5 text-[11px] leading-snug text-texto-suave" data-ponte-elementos>
        <IconeArvore className="mt-0.5 shrink-0 text-primaria" tamanho={14} />
        <span>
          É a mesma ideia da árvore de Elementos do F12: a página é um objeto &lt;html&gt; com os filhos &lt;head&gt; e &lt;body&gt;, e cada filho tem os seus.
        </span>
      </p>
    </div>
  );
}
