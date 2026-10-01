import type { PropsIcone } from "./tipos";

/** Pegadas contadas: o contador de passos do palco. */
export function IconeContadorPassos({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="6" cy="6.5" rx="2.2" ry="3.2" fill="currentColor" fillOpacity={0.3} />
      <ellipse cx="13" cy="11" rx="2.2" ry="3.2" fill="currentColor" fillOpacity={0.3} />
      <path d="M3 17h14M6 15v4M10 15v4M14 15v4" />
    </svg>
  );
}
