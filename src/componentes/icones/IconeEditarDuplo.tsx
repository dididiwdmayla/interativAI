import type { PropsIcone } from "./tipos";

/** Lápis com dois toques: editar com dois cliques. */
export function IconeEditarDuplo({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M4 16l1-3.5 7.5-7.5 2.5 2.5-7.5 7.5z" fill="currentColor" fillOpacity={0.15} />
      <path d="M11 6.5l2.5 2.5" />
      <path d="M14.5 2.5v2M17.5 5.5h-2M16.8 3.2l-1.3 1.3" />
    </svg>
  );
}
