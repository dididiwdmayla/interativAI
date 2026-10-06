import type { PropsIcone } from "./tipos";

/** Uma linha com marcos e um cartão descendo para o lugar dele: a linha do tempo do museu. */
export function IconeLinhaDoTempoMuseu({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14h16" />
      <path d="M4 12.5v3M9 12.5v3M16 12.5v3" />
      <rect x="9.5" y="2.5" width="6" height="5" rx="1" fill="currentColor" fillOpacity={0.3} />
      <path d="M12.5 8v3" strokeDasharray="1.2 1.2" />
    </svg>
  );
}
