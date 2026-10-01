import type { PropsIcone } from "./tipos";

/** Um nó com dois filhos e um neto: a árvore de dados. */
export function IconeArvorePalco({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 5.5L5 10.5M10 5.5l5 5M15 10.5l-2.5 4" />
      <circle cx="10" cy="4" r="2" fill="currentColor" fillOpacity={0.3} />
      <circle cx="5" cy="11.5" r="2" />
      <circle cx="15" cy="11.5" r="2" />
      <circle cx="12" cy="16.5" r="2" />
    </svg>
  );
}
