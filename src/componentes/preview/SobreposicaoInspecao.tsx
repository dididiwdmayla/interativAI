import type { Realce } from "@/lib/medirElemento";

type Props = {
  realce: Realce | null;
  /** Várias peças acesas (as que uma regra de CSS pega). */
  extras?: readonly Realce[];
};

/** Caixa translúcida e etiqueta sobre o elemento, desenhadas no documento do jogo. */
export function SobreposicaoInspecao({ realce, extras = [] }: Props) {
  if (!realce && extras.length === 0) return null;
  const etiquetaEmCima = (realce?.y ?? 0) > 30;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {extras.map((caixa, indice) => (
        <div
          key={`${indice}-${caixa.x}-${caixa.y}`}
          data-realce-regra
          className="absolute rounded-[3px] border-2 border-dashed border-realce"
          style={{
            left: caixa.x,
            top: caixa.y,
            width: caixa.largura,
            height: caixa.altura,
            backgroundColor: "color-mix(in srgb, var(--cor-realce-inspecao) 22%, transparent)",
          }}
        />
      ))}
      {realce && <CaixaPrincipal realce={realce} etiquetaEmCima={etiquetaEmCima} />}
    </div>
  );
}

function CaixaPrincipal({ realce, etiquetaEmCima }: { realce: Realce; etiquetaEmCima: boolean }) {
  return (
    <>
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
    </>
  );
}
