"use client";

/*
 * A tela de uma fase composta (src/motor/composicao.ts): o motor monta as
 * áreas de trabalho que a fase declara, nos três layouts.
 *
 * - Computador: o plano numa coluna à esquerda, o código no centro e, à
 *   direita, o palco em cima e os casos de teste embaixo (divisor
 *   arrastável quando os dois existem).
 * - Celular deitado: o plano (ou o palco, ou os testes, em abas) ao lado do
 *   código, que fica sempre à vista.
 * - Celular em pé: o palco recolhível em cima e as abas "Plano | Código |
 *   Testes" embaixo.
 *
 * Cada área fica SEMPRE montada no mesmo lugar da árvore (um filho da grade,
 * na mesma ordem): girar o celular ou trocar de aba só muda a grade e o que
 * está escondido. Assim o editor não perde o texto nem o cursor, e as
 * apresentações acham os alvos.
 */
import { type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode, useRef, useState } from "react";
import type { LayoutJogo } from "@/componentes/jogo/movel/useLayoutJogo";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { SeletorSegmentado } from "@/componentes/ui/SeletorSegmentado";
import type { AreaTrabalho } from "@/motor/composicao";

/** O nome de cada área nas abas do celular. */
export const ROTULO_DA_AREA: Record<AreaTrabalho, string> = {
  plano: "Plano",
  snippet: "Código",
  palco: "Palco",
};

type Props = {
  layout: LayoutJogo;
  areas: readonly AreaTrabalho[];
  /** O conteúdo de cada área declarada. */
  conteudo: Partial<Record<AreaTrabalho, ReactNode>>;
  /** (Celular) A área escolhida nas abas: controlada pelo jogo (apresentações e ajuda trocam a aba). */
  abaCelular: AreaTrabalho;
  aoTrocarAba: (area: AreaTrabalho) => void;
  /** (Em pé) O palco aberto ou recolhido. */
  palcoAberto: boolean;
  aoAlternarPalco: () => void;
  /** Teclado virtual aberto: o palco recolhe sozinho (o código precisa do espaço). */
  tecladoAberto: boolean;
};

/** As áreas que viram abas em cada layout de celular (as outras ficam fixas). */
export function abasDoLayout(layout: LayoutJogo, areas: readonly AreaTrabalho[]): AreaTrabalho[] {
  if (layout === "paisagem") return areas.filter((area) => area !== "snippet");
  if (layout === "retrato") return areas.filter((area) => area !== "palco");
  return [];
}

/** A aba que vale agora: a escolhida, se ela é aba neste layout, ou a primeira. */
export function abaVisivel(layout: LayoutJogo, areas: readonly AreaTrabalho[], escolhida: AreaTrabalho): AreaTrabalho | null {
  const abas = abasDoLayout(layout, areas);
  return abas.includes(escolhida) ? escolhida : (abas[0] ?? null);
}

const LIMITES_DIVISOR = { minimo: 0.2, maximo: 0.8 };

export function TelaComposta({ layout, areas, conteudo, abaCelular, aoTrocarAba, palcoAberto, aoAlternarPalco, tecladoAberto }: Props) {
  const grade = useRef<HTMLElement>(null);
  /** (Computador) A parte do palco na coluna da direita, quando os testes dividem com ele. */
  const [divisao, setDivisao] = useState(0.55);
  const [arrastando, setArrastando] = useState(false);
  const tem = (area: AreaTrabalho) => areas.includes(area);
  const abas = abasDoLayout(layout, areas);
  const aba = abaVisivel(layout, areas, abaCelular);
  const palcoVisivelEmPe = tem("palco") && palcoAberto && !tecladoAberto;
  // O que mora na coluna da direita do computador (por enquanto, só o palco).
  const direita = (["palco"] as const).filter(tem);
  const divididaNaDireita = direita.length > 1;

  /* ------------------------------------------------------------- a grade de cada layout */
  let estiloGrade: CSSProperties;
  let lugar: Record<AreaTrabalho, string>;
  if (layout === "desktop") {
    const colunas = [tem("plano") ? "minmax(16rem, 27%)" : null, "minmax(0, 1fr)", direita.length ? "minmax(18rem, 32%)" : null].filter(Boolean);
    const linha = (alvo: string) => [tem("plano") ? "plano" : null, "codigo", direita.length ? alvo : null].filter(Boolean).join(" ");
    const linhas = divididaNaDireita ? [linha(direita[0]), linha("divisor"), linha(direita[1])] : [linha(direita[0] ?? "codigo")];
    estiloGrade = {
      gridTemplateColumns: colunas.join(" "),
      gridTemplateRows: divididaNaDireita ? `minmax(0, ${divisao}fr) 0.75rem minmax(0, ${1 - divisao}fr)` : "minmax(0, 1fr)",
      gridTemplateAreas: linhas.map((l) => `"${l}"`).join(" "),
    };
    lugar = { plano: "plano", snippet: "codigo", palco: "palco" };
  } else if (layout === "paisagem") {
    const comLado = abas.length > 0;
    estiloGrade = comLado
      ? {
          gridTemplateColumns: "minmax(0, 44%) minmax(0, 1fr)",
          gridTemplateRows: abas.length > 1 ? "auto minmax(0, 1fr)" : "minmax(0, 1fr)",
          gridTemplateAreas: abas.length > 1 ? '"abas codigo" "lado codigo"' : '"lado codigo"',
        }
      : { gridTemplateColumns: "minmax(0, 1fr)", gridTemplateRows: "minmax(0, 1fr)", gridTemplateAreas: '"codigo"' };
    lugar = { plano: "lado", snippet: "codigo", palco: "lado" };
  } else {
    const linhas = [tem("palco") ? '"cabecalho"' : null, palcoVisivelEmPe ? '"palco"' : null, abas.length > 1 ? '"abas"' : null, '"conteudo"'].filter(Boolean);
    const alturas = [tem("palco") ? "auto" : null, palcoVisivelEmPe ? "minmax(0, 2fr)" : null, abas.length > 1 ? "auto" : null, palcoVisivelEmPe ? "minmax(0, 3fr)" : "minmax(0, 1fr)"].filter(Boolean);
    estiloGrade = { gridTemplateColumns: "minmax(0, 1fr)", gridTemplateRows: alturas.join(" "), gridTemplateAreas: linhas.join(" ") };
    lugar = { plano: "conteudo", snippet: "conteudo", palco: "palco" };
  }

  /** A área aparece neste layout agora? */
  const visivel = (area: AreaTrabalho): boolean => {
    if (!tem(area)) return false;
    if (layout === "desktop") return true;
    if (layout === "paisagem") return area === "snippet" || area === aba;
    if (area === "palco") return palcoVisivelEmPe;
    return area === aba;
  };

  /* ------------------------------------------------------------- o divisor do computador */
  const moverDivisor = (y: number) => {
    const caixa = grade.current?.getBoundingClientRect();
    if (!caixa || caixa.height === 0) return;
    setDivisao(Math.min(LIMITES_DIVISOR.maximo, Math.max(LIMITES_DIVISOR.minimo, (y - caixa.top) / caixa.height)));
  };
  const teclarDivisor = (evento: KeyboardEvent<HTMLDivElement>) => {
    const passo = evento.shiftKey ? 0.1 : 0.04;
    if (evento.key === "ArrowUp") setDivisao((v) => Math.max(LIMITES_DIVISOR.minimo, v - passo));
    else if (evento.key === "ArrowDown") setDivisao((v) => Math.min(LIMITES_DIVISOR.maximo, v + passo));
    else return;
    evento.preventDefault();
  };

  const classesGrade = {
    desktop: "grid min-h-0 flex-1 gap-x-3 p-3 lg:gap-x-4 lg:p-4",
    paisagem: "grid min-h-0 flex-1 gap-x-2 gap-y-1.5 p-1.5 pr-14",
    retrato: "grid min-h-0 flex-1 gap-y-1.5 px-2 pb-2 pt-2",
  }[layout];

  const seletorAbas = (
    <SeletorSegmentado
      rotulo="Áreas de trabalho"
      opcoes={abas.map((area) => ({ id: area, rotulo: ROTULO_DA_AREA[area] }))}
      valor={aba ?? abas[0]}
      aoTrocar={aoTrocarAba}
      className="w-full"
      alto
    />
  );

  return (
    <main ref={grade} className={classesGrade} style={estiloGrade} data-composicao={areas.join(" ")} data-aba-composta={aba ?? ""}>
      {/* (Em pé) O cabeçalho do palco recolhível. */}
      {layout === "retrato" && tem("palco") && (
        <button
          type="button"
          onClick={aoAlternarPalco}
          aria-expanded={palcoVisivelEmPe}
          className="flex min-h-11 items-center gap-2 rounded-xl border-2 border-borda bg-superficie px-3 text-left text-sm font-black text-texto"
          style={{ gridArea: "cabecalho" }}
          data-alternar-palco
        >
          <span className="flex-1">Palco da memória</span>
          <span className="text-xs font-bold text-texto-suave">{palcoVisivelEmPe ? "Recolher" : tecladoAberto ? "Recolhido enquanto digita" : "Mostrar"}</span>
          <IconeChevron direcao={palcoVisivelEmPe ? "cima" : "baixo"} />
        </button>
      )}
      {/* (Celular) As abas das áreas. */}
      {layout !== "desktop" && abas.length > 1 && (
        <div className="flex min-w-0" style={{ gridArea: "abas" }} data-abas-composicao>
          {seletorAbas}
        </div>
      )}
      {(["plano", "snippet", "palco"] as const).map((area) =>
        tem(area) ? (
          <section
            key={area}
            aria-label={area === "plano" ? "Plano" : area === "snippet" ? "Código" : "Palco da memória"}
            className={visivel(area) ? "flex min-h-0 min-w-0 flex-col" : "hidden"}
            style={{ gridArea: lugar[area] }}
            data-area-trabalho={area}
          >
            {conteudo[area]}
          </section>
        ) : null,
      )}
      {/* (Computador) O divisor entre o palco e os testes. */}
      {layout === "desktop" && divididaNaDireita && (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Redimensionar o palco e os casos de teste"
          aria-valuemin={20}
          aria-valuemax={80}
          aria-valuenow={Math.round(divisao * 100)}
          tabIndex={0}
          style={{ gridArea: "divisor" }}
          onPointerDown={(evento: PointerEvent<HTMLDivElement>) => {
            evento.currentTarget.setPointerCapture(evento.pointerId);
            setArrastando(true);
          }}
          onPointerMove={(evento) => arrastando && moverDivisor(evento.clientY)}
          onPointerUp={(evento) => {
            evento.currentTarget.releasePointerCapture(evento.pointerId);
            setArrastando(false);
          }}
          onPointerCancel={() => setArrastando(false)}
          onKeyDown={teclarDivisor}
          className="group flex cursor-row-resize touch-none items-center justify-center"
        >
          <span className={`h-1 w-10 rounded-full ${arrastando ? "bg-primaria" : "bg-texto-suave group-hover:bg-primaria"}`} aria-hidden="true" />
        </div>
      )}
    </main>
  );
}
