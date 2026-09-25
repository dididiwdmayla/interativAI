import type { PropsIcone } from "./tipos";

/** Pincel sobre linhas de regras: o painel Estilos. */
export function IconePainelEstilos({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M3 5h7M3 9h5M3 13h4" />
      <path d="M15.5 3.5l1.5 1.5-5.5 5.5-1.5-1.5z" fill="currentColor" fillOpacity={0.15} />
      <path d="M10 10l-1.5 1.5c-1 1-.3 2.4-1.5 3.1 1.8.4 3.2 0 3.9-.7l1.1-1.4" />
    </svg>
  );
}
