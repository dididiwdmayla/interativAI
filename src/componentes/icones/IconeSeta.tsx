import type { PropsIcone } from "./tipos";

type Props = PropsIcone & { direcao: "esquerda" | "direita" };

export function IconeSeta({ className, tamanho = 16, direcao }: Props) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direcao === "esquerda" ? "scaleX(-1)" : undefined }}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
