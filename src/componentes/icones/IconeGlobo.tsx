import type { PropsIcone } from "./tipos";

/** Globo: o ícone genérico de página na aba do navegador falso. */
export function IconeGlobo({ className, tamanho = 18 }: PropsIcone) {
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
    >
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c2.2 2.2 3 4.7 3 7.5s-.8 5.3-3 7.5M10 2.5c-2.2 2.2-3 4.7-3 7.5s.8 5.3 3 7.5" />
    </svg>
  );
}
