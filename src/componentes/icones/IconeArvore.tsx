import type { PropsIcone } from "./tipos";

/** Árvore de nós ligados, como a aba Elementos. */
export function IconeArvore({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2.5" y="2.5" width="6" height="4" rx="1.2" fill="currentColor" fillOpacity={0.2} />
      <rect x="10.5" y="8" width="7" height="4" rx="1.2" />
      <rect x="10.5" y="13.5" width="7" height="4" rx="1.2" />
      <path d="M5.5 6.5v9h5M5.5 10h5" />
    </svg>
  );
}
