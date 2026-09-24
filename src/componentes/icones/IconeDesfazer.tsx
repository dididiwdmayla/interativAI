import type { PropsIcone } from "./tipos";

/** Seta curva para trás: desfazer. */
export function IconeDesfazer({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M7.5 5L4 8.5 7.5 12" />
      <path d="M4 8.5h8a4 4 0 0 1 0 8H9" />
    </svg>
  );
}
