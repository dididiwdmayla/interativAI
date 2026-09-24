import type { PropsIcone } from "./tipos";

/** Janela do DevTools: barra de abas e duas áreas. */
export function IconePainel({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M5 5.2h2M8.5 5.2h2" />
      <path d="M2.5 11.5h15" strokeDasharray="1.5 1.5" />
    </svg>
  );
}
