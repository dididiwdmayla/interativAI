import type { PropsIcone } from "./tipos";

/** Lista com marcadores: a lista de fases. */
export function IconeListaFases({ className, tamanho = 18 }: PropsIcone) {
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
      <circle cx="4.5" cy="5" r="1.3" fill="currentColor" />
      <circle cx="4.5" cy="10" r="1.3" fill="currentColor" />
      <circle cx="4.5" cy="15" r="1.3" fill="currentColor" />
      <path d="M8 5h8.5M8 10h8.5M8 15h6" />
    </svg>
  );
}
