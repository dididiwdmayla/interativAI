import type { PropsIcone } from "./tipos";

/** Um cartão do plano virando uma linha de comentário (//) no código. */
export function IconePlanoNoCodigo({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3" width="7" height="4" rx="1" />
      <rect x="1.5" y="9" width="7" height="4" rx="1" fill="currentColor" fillOpacity={0.3} />
      <path d="M9.5 11h3.5M11.5 9.25 13.25 11 11.5 12.75" />
      <path d="M15 7.5 13.75 14.5M17.75 7.5 16.5 14.5" />
    </svg>
  );
}
