import type { PropsIcone } from "./tipos";

/** Setas para cima e para baixo em volta de um número. */
export function IconeSetasNumericas({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M10 2.5l3.5 3.5h-7z" fill="currentColor" fillOpacity={0.2} />
      <path d="M10 17.5l3.5-3.5h-7z" fill="currentColor" fillOpacity={0.2} />
      <path d="M7.5 8.5h1.3v3M7.3 11.5h2.8M11.5 8.5h1.6c.7 0 .9.5.6 1l-2.2 2h2.4" />
    </svg>
  );
}
