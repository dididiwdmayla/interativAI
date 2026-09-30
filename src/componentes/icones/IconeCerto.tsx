import type { PropsIcone } from "./tipos";

/** Um tique de conferido. */
export function IconeCerto({ className, tamanho = 14 }: PropsIcone) {
  return (
    <svg viewBox="0 0 14 14" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7.5l3 3 6-7" />
    </svg>
  );
}
