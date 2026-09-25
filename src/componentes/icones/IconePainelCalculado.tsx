import type { PropsIcone } from "./tipos";

/** Lista de propriedades com o sinal de igual: a aba Calculado. */
export function IconePainelCalculado({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="3" y="3" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity={0.12} />
      <path d="M6 7h3M6 10.5h3M6 14h3" />
      <path d="M11.5 6.5h3M11.5 8h3M11.5 10h3M11.5 11.5h3M11.5 13.5h3M11.5 15h3" strokeWidth={1.2} />
    </svg>
  );
}
