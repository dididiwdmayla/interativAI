import type { PropsIcone } from "./tipos";

type Props = PropsIcone & { direcao?: "direita" | "esquerda" | "baixo" | "cima" };

const ROTACAO: Record<NonNullable<Props["direcao"]>, number> = {
  direita: 0,
  baixo: 90,
  esquerda: 180,
  cima: 270,
};

export function IconeChevron({ className, tamanho = 12, direcao = "direita" }: Props) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${ROTACAO[direcao]}deg)` }}
    >
      <path d="M4.5 2.5L8 6l-3.5 3.5" />
    </svg>
  );
}
