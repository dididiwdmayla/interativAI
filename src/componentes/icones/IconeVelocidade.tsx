import type { PropsIcone } from "./tipos";

/** Dois triângulos de avançar: a velocidade da simulação. */
export function IconeVelocidade({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 5.5v9l6.5-4.5zM10 5.5v9l6.5-4.5z" />
    </svg>
  );
}
