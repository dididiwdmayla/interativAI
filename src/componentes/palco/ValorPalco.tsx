"use client";

/*
 * Um valor no palco: primitivo (colorido pelo tipo), lista (vagões
 * numerados, o índice embaixo), objeto (ficha de chave e valor) ou
 * ponteiro (a lista já está desenhada em outro lugar: a seta sai daqui).
 */
import { literalJs } from "@/motor/executor/formatar";
import { type NoPalco, tipoDoNo } from "@/motor/palco";
import { COR_DO_TIPO } from "./coresDoTipo";

type Props = { no: NoPalco; anterior?: NoPalco | null };

function textoPrimitivo(no: Extract<NoPalco, { t: "primitivo" }>): string {
  const v = no.valor;
  switch (v.t) {
    case "string":
      return literalJs(v.v);
    case "undefined":
    case "null":
      return v.t;
    case "funcao":
      return `ƒ ${v.nome === "(anônima)" ? "" : v.nome}()`;
    case "bigint":
      return `${v.v}n`;
    default:
      return String(v.v);
  }
}

function mesmo(a: NoPalco | null | undefined, b: NoPalco): boolean {
  return a !== null && a !== undefined && JSON.stringify(a) === JSON.stringify(b);
}

export function ValorPalco({ no, anterior = null }: Props) {
  switch (no.t) {
    case "primitivo":
      return (
        <span className={`whitespace-pre-wrap break-all font-mono font-bold ${COR_DO_TIPO[tipoDoNo(no)].texto}`} data-valor-palco>
          {textoPrimitivo(no)}
        </span>
      );
    case "lista": {
      const itensAntes = anterior?.t === "lista" && anterior.id === no.id ? anterior.itens : null;
      return (
        <span className="inline-flex max-w-full flex-wrap items-end gap-1" data-lista-palco={no.id} data-ancora-objeto={no.id}>
          {no.itens.length === 0 && <span className="rounded-md border-2 border-dashed border-js-objeto px-2 py-0.5 text-xs text-texto-suave">vazia</span>}
          {no.itens.map((item, i) => {
            const mudou = itensAntes !== null && !mesmo(itensAntes[i], item);
            return (
              <span key={i} className="inline-flex flex-col items-center" data-vagao={i}>
                <span
                  className={`min-w-8 rounded-md border-2 border-js-objeto bg-superficie px-1.5 py-0.5 text-center text-sm ${mudou ? "palco-piscar" : ""}`}
                >
                  <ValorPalco no={item} anterior={itensAntes?.[i] ?? null} />
                </span>
                <span className="text-[10px] font-bold text-texto-suave">{i}</span>
              </span>
            );
          })}
          {no.tamanho > no.itens.length && <span className="pb-3 text-texto-suave">… ({no.tamanho} no total)</span>}
        </span>
      );
    }
    case "ficha": {
      const camposAntes = anterior?.t === "ficha" && anterior.id === no.id ? new Map(anterior.campos) : null;
      return (
        <span className="inline-flex max-w-full flex-col rounded-lg border-2 border-js-objeto bg-superficie text-sm" data-ficha-palco={no.id} data-ancora-objeto={no.id}>
          {no.classe && <span className="border-b-2 border-js-objeto px-2 text-xs font-bold text-js-objeto">{no.classe}</span>}
          {no.campos.length === 0 && <span className="px-2 py-0.5 text-xs text-texto-suave">sem campos</span>}
          {no.campos.map(([chave, valor]) => {
            const mudou = camposAntes !== null && !mesmo(camposAntes.get(chave), valor);
            return (
              <span key={chave} className={`flex items-start gap-2 border-b border-borda px-2 py-0.5 last:border-b-0 ${mudou ? "palco-piscar" : ""}`} data-campo-palco={chave}>
                <span className="shrink-0 font-bold text-texto-suave">{chave}</span>
                <ValorPalco no={valor} anterior={camposAntes?.get(chave) ?? null} />
              </span>
            );
          })}
        </span>
      );
    }
    case "mapa":
      return (
        <span className="inline-flex flex-col rounded-lg border-2 border-js-objeto bg-superficie text-sm" data-ancora-objeto={no.id}>
          <span className="border-b-2 border-js-objeto px-2 text-xs font-bold text-js-objeto">Map</span>
          {no.entradas.map(([k, v], i) => (
            <span key={i} className="flex items-center gap-1.5 border-b border-borda px-2 py-0.5 last:border-b-0">
              <ValorPalco no={k} />
              <span className="text-texto-suave">=&gt;</span>
              <ValorPalco no={v} />
            </span>
          ))}
        </span>
      );
    case "conjunto":
      return (
        <span className="inline-flex flex-wrap items-center gap-1 rounded-lg border-2 border-js-objeto bg-superficie px-1.5 py-0.5 text-sm" data-ancora-objeto={no.id}>
          <span className="text-xs font-bold text-js-objeto">Set</span>
          {no.itens.map((item, i) => (
            <ValorPalco key={i} no={item} />
          ))}
        </span>
      );
    case "texto":
      return (
        <span className="font-mono text-sm text-erro" data-ancora-objeto={no.id}>
          {no.texto}
        </span>
      );
    case "ponteiro":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-js-objeto px-2 py-0.5 text-xs font-bold text-js-objeto" data-ponteiro={no.id}>
          <span className="h-2.5 w-2.5 rounded-full bg-js-objeto" data-ponta-seta={no.id} aria-hidden="true" />
          a mesma de <span className="font-mono">{no.dono}</span>
        </span>
      );
    case "ausente":
      return <span className="text-texto-suave">…</span>;
  }
}
