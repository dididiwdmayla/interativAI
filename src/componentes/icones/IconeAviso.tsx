import type { PropsIcone } from "./tipos";

/** Triângulo com ponto de exclamação (valor que o navegador joga fora). */
export function IconeAviso({ className, tamanho = 14 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3l7.5 13.5h-15z" fill="currentColor" fillOpacity={0.15} />
      <path d="M10 8v4" />
      <circle cx="10" cy="14.2" r=".7" fill="currentColor" />
    </svg>
  );
}
