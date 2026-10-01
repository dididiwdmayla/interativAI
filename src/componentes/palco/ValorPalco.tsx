"use client";

/*
 * Um valor no palco: primitivo (colorido pelo tipo), lista (vagões
 * numerados, o índice embaixo), objeto (ficha de chave e valor) ou
 * ponteiro (a lista já está desenhada em outro lugar: a seta sai daqui).
 *
 * Na lista, comparando com o passo anterior: o vagão entra e sai pelo lado
 * certo (push e pop pela direita, unshift e shift pela esquerda: a
 * diferença entre pilha e fila aparece), a posição escrita pisca, a troca
 * balança os dois vagões e a posição que a linha anterior leu acende.
 */
import { useContext } from "react";
import { literalJs } from "@/motor/executor/formatar";
import { movimentoDaLista } from "@/motor/estruturas";
import { assinar, type NoPalco, tipoDoNo } from "@/motor/palco";
import { ContextoPalco } from "./contextoPalco";
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

/** Um vagão da lista (o valor e o índice embaixo), com a animação e as marcas do passo. */
function Vagao({ item, anterior, indice, classe, lido, trocou, fantasma = false }: { item: NoPalco; anterior: NoPalco | null; indice: number; classe: string; lido: boolean; trocou: boolean; fantasma?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-center ${classe}`} data-vagao={fantasma ? undefined : indice} data-vagao-saindo={fantasma ? indice : undefined} data-lido={lido ? "sim" : undefined} data-trocou={trocou ? "sim" : undefined}>
      <span
        className={`min-w-8 rounded-md border-2 bg-superficie px-1.5 py-0.5 text-center text-sm ${lido ? "border-realce shadow-[0_0_0_3px_var(--cor-realce-inspecao)]" : "border-js-objeto"} ${trocou ? "bg-codigo-destaque-linha" : ""}`}
      >
        <ValorPalco no={item} anterior={anterior} />
      </span>
      <span className={`text-[10px] font-bold ${lido ? "text-realce" : trocou ? "text-texto" : "text-texto-suave"}`}>{lido ? `${indice} leu` : trocou ? `${indice} trocou` : indice}</span>
    </span>
  );
}

function ListaPalco({ no, anterior }: { no: Extract<NoPalco, { t: "lista" }>; anterior: NoPalco | null }) {
  const { leituras } = useContext(ContextoPalco);
  const itensAntes = anterior?.t === "lista" && anterior.id === no.id ? anterior.itens : null;
  const movimento = itensAntes ? movimentoDaLista(itensAntes.map(assinar), no.itens.map(assinar)) : null;
  const lidos = leituras.get(no.id);
  const n = no.itens.length;
  const saindoInicio = itensAntes && movimento?.sairamInicio ? itensAntes.slice(0, movimento.sairamInicio) : [];
  const saindoFim = itensAntes && movimento?.sairamFim && !movimento.escritos.length ? itensAntes.slice(itensAntes.length - movimento.sairamFim) : [];
  return (
    <span className="inline-flex max-w-full flex-wrap items-end gap-1" data-lista-palco={no.id} data-ancora-objeto={no.id}>
      {saindoInicio.map((item, i) => (
        <Vagao key={`sai-inicio-${i}`} item={item} anterior={null} indice={i} classe="palco-sair-esquerda" lido={false} trocou={false} fantasma />
      ))}
      {n === 0 && saindoInicio.length + saindoFim.length === 0 && <span className="rounded-md border-2 border-dashed border-js-objeto px-2 py-0.5 text-xs text-texto-suave">vazia</span>}
      {no.itens.map((item, i) => {
        const entrouInicio = movimento !== null && i < movimento.entraramInicio;
        const entrouFim = movimento !== null && i >= n - movimento.entraramFim;
        const trocou = movimento?.troca?.includes(i) ?? false;
        const escrito = movimento?.escritos.includes(i) ?? false;
        // Depois do shift e do unshift, o vagão de antes na mesma posição é outro: compara pelo deslocamento.
        const deslocamento = movimento ? movimento.entraramInicio - movimento.sairamInicio : 0;
        const antes = itensAntes?.[i - deslocamento] ?? null;
        const classe = entrouFim ? "palco-entrar-direita" : entrouInicio ? "palco-entrar-esquerda" : trocou ? "palco-trocar" : escrito ? "palco-piscar" : "";
        return <Vagao key={`${i}-${deslocamento}`} item={item} anterior={antes} indice={i} classe={classe} lido={lidos?.has(i) ?? false} trocou={trocou} />;
      })}
      {saindoFim.map((item, i) => (
        <Vagao key={`sai-fim-${i}`} item={item} anterior={null} indice={n + i} classe="palco-sair-direita" lido={false} trocou={false} fantasma />
      ))}
      {no.tamanho > no.itens.length && <span className="pb-3 text-texto-suave">… ({no.tamanho} no total)</span>}
    </span>
  );
}

export function ValorPalco({ no, anterior = null }: Props) {
  switch (no.t) {
    case "primitivo":
      return (
        <span className={`whitespace-pre-wrap break-all font-mono font-bold ${COR_DO_TIPO[tipoDoNo(no)].texto}`} data-valor-palco>
          {textoPrimitivo(no)}
        </span>
      );
    case "lista":
      return <ListaPalco no={no} anterior={anterior} />;
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
