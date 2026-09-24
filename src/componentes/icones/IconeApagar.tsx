import type { PropsIcone } from "./tipos";

/** Lixeira: apagar o elemento. */
export function IconeApagar({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M4 5.5h12" />
      <path d="M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5" />
      <path d="M5.5 5.5l.8 10.2a1.5 1.5 0 0 0 1.5 1.3h4.4a1.5 1.5 0 0 0 1.5-1.3l.8-10.2" />
      <path d="M8.5 8.5v5.5M11.5 8.5v5.5" />
    </svg>
  );
}
