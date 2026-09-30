import type { PropsIcone } from "./tipos";

/** Um círculo cortado: o botão de limpar o Console do Chrome. */
export function IconeLimpar({ className, tamanho = 16 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="5.5" />
      <path d="M4.2 11.8l7.6-7.6" />
    </svg>
  );
}
