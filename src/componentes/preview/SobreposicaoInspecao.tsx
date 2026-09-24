import type { Realce } from "@/lib/medirElemento";

type Props = {
  realce: Realce | null;
};

/** Caixa translúcida e etiqueta sobre o elemento, desenhadas no documento do jogo. */
export function SobreposicaoInspecao({ realce }: Props) {
  if (!realce) return null;
  const etiquetaEmCima = realce.y > 30;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute rounded-[3px] border-2 border-realce"
        style={{
          left: realce.x,
          top: realce.y,
          width: realce.largura,
          height: realce.altura,
          backgroundColor: "color-mix(in srgb, var(--cor-realce-inspecao) 32%, transparent)",
        }}
      />
      <div
        data-realce-rotulo
        className="absolute whitespace-nowrap rounded-md bg-texto px-2 py-0.5 font-codigo text-xs text-fundo shadow-md"
        style={{
          left: Math.max(4, realce.x),
          top: etiquetaEmCima ? realce.y - 26 : realce.y + realce.altura + 4,
        }}
      >
        {realce.rotulo}
      </div>
    </div>
  );
}
