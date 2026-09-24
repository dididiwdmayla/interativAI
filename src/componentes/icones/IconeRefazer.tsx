import type { PropsIcone } from "./tipos";

/** Seta curva para a frente: refazer. */
export function IconeRefazer({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M12.5 5L16 8.5 12.5 12" />
      <path d="M16 8.5H8a4 4 0 0 0 0 8h3" />
    </svg>
  );
}
