import type { PropsIcone } from "./tipos";

/** Lápis simples. */
export function IconeEditar({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M4 16l1-3.5 7.5-7.5 2.5 2.5-7.5 7.5z" />
      <path d="M11 6.5l2.5 2.5" />
    </svg>
  );
}
