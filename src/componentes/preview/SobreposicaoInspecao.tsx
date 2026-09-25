import type { Realce } from "@/lib/medirElemento";
import type { CamadaCaixa, Lados, RealceCaixa, Retangulo } from "@/lib/modeloCaixa";

type Props = {
  realce: Realce | null;
  /** Várias peças acesas (as que uma regra de CSS pega). */
  extras?: readonly Realce[];
  /** Camadas do modelo de caixa do selecionado (hover no diagrama da aba Calculado). */
  caixa?: RealceCaixa | null;
};

/** As cores do destaque do Chrome (Color.PageHighlight), vindas dos tokens. */
const COR_DA_CAMADA: Record<CamadaCaixa, string> = {
  margin: "var(--cor-caixa-margem)",
  border: "var(--cor-caixa-borda)",
  padding: "var(--cor-caixa-preenchimento)",
  content: "var(--cor-caixa-conteudo)",
};

const CAMADAS: readonly CamadaCaixa[] = ["margin", "border", "padding", "content"];

/**
 * Uma camada como o Chrome pinta: o anel entre a caixa dela e a de dentro
 * (uma borda da largura de cada lado), ou o miolo, no caso do conteúdo.
 */
function Camada({ camada, caixa, lados }: { camada: CamadaCaixa; caixa: Retangulo; lados: Lados | null }) {
  const cor = `color-mix(in srgb, ${COR_DA_CAMADA[camada]} 70%, transparent)`;
  return (
    <div
      data-realce-camada={camada}
      className="absolute"
      style={{
        left: caixa.x,
        top: caixa.y,
        width: caixa.largura,
        height: caixa.altura,
        ...(lados
          ? {
              borderStyle: "solid",
              borderColor: cor,
              borderTopWidth: Math.max(0, lados.cima),
              borderRightWidth: Math.max(0, lados.direita),
              borderBottomWidth: Math.max(0, lados.baixo),
              borderLeftWidth: Math.max(0, lados.esquerda),
            }
          : { backgroundColor: cor }),
      }}
    />
  );
}

/** Caixa translúcida e etiqueta sobre o elemento, desenhadas no documento do jogo. */
export function SobreposicaoInspecao({ realce, extras = [], caixa = null }: Props) {
  if (!realce && extras.length === 0 && !caixa) return null;
  const etiquetaEmCima = (realce?.y ?? 0) > 30;
  const ladosDa: Record<CamadaCaixa, Lados | null> | null = caixa
    ? { margin: caixa.modelo.margem, border: caixa.modelo.borda, padding: caixa.modelo.preenchimento, content: null }
    : null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {caixa &&
        ladosDa &&
        CAMADAS.filter((camada) => caixa.camada === "todas" || caixa.camada === camada).map((camada) => (
          <Camada key={camada} camada={camada} caixa={caixa.modelo.caixas[camada]} lados={ladosDa[camada]} />
        ))}
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
      {realce && <CaixaPrincipal realce={realce} etiquetaEmCima={etiquetaEmCima} soEtiqueta={caixa !== null} />}
    </div>
  );
}

function CaixaPrincipal({ realce, etiquetaEmCima, soEtiqueta }: { realce: Realce; etiquetaEmCima: boolean; soEtiqueta: boolean }) {
  return (
    <>
      {!soEtiqueta && (
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
      )}
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
