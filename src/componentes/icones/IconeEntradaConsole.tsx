import type { PropsIcone } from "./tipos";

/** O sinal de maior azul que o Console põe na frente do que você digitou. */
export function IconeEntradaConsole({ className, tamanho = 12 }: PropsIcone) {
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
    >
      <path d="M4 2.5L7.5 6 4 9.5" />
    </svg>
  );
}
