import type { PropsIcone } from "./tipos";

/** Janela de navegador com a página dentro. */
export function IconePrevia({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M2.5 7h15" />
      <circle cx="4.8" cy="5.2" r="0.6" fill="currentColor" />
      <circle cx="6.8" cy="5.2" r="0.6" fill="currentColor" />
      <path d="M5.5 10h6M5.5 13h9" />
    </svg>
  );
}
