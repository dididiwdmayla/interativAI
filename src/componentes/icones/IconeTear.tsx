import type { PropsIcone } from "./tipos";

/** Um cartão perfurado com os fios do tear saindo dos furos: o tear de cartões. */
export function IconeTear({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h12l2 2v5H3z" />
      <circle cx="6" cy="7.5" r="0.9" fill="currentColor" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" />
      <path d="M6 11v6M9 11v4M12 11v6M15 11v4" strokeWidth={1.3} />
    </svg>
  );
}
