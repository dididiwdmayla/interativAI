import type { PropsIcone } from "./tipos";

/** Chaves de uma regra de CSS com uma linha de declaração dentro. */
export function IconeEditorCss({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M6.5 3.5C4.8 3.5 4.5 4.3 4.5 5.5v2.7c0 .9-.6 1.6-1.5 1.8.9.2 1.5.9 1.5 1.8v2.7c0 1.2.3 2 2 2" />
      <path d="M13.5 3.5c1.7 0 2 .8 2 2v2.7c0 .9.6 1.6 1.5 1.8-.9.2-1.5.9-1.5 1.8v2.7c0 1.2-.3 2-2 2" />
      <path d="M8 8.5h4M8 11.5h2.5" />
    </svg>
  );
}
