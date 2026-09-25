import type { PropsIcone } from "./tipos";

/** Chaves de uma regra com um sinal de mais. */
export function IconeNovaRegra({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M6 3.5C4.5 3.5 4.2 4.3 4.2 5.5v2.7c0 .9-.6 1.6-1.4 1.8.8.2 1.4.9 1.4 1.8v2.7c0 1.2.3 2 1.8 2" />
      <path d="M14 3.5c1.5 0 1.8.8 1.8 2v2.7c0 .9.6 1.6 1.4 1.8-.8.2-1.4.9-1.4 1.8v2.7c0 1.2-.3 2-1.8 2" />
      <path d="M10 7v6M7 10h6" />
    </svg>
  );
}
