import type { PropsIcone } from "./tipos";

/** Três cartões em fila, um sendo arrastado para o lugar: o quadro de passos. */
export function IconeQuadroPassos({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="3" width="9" height="3.5" rx="1" />
      <rect x="2.5" y="8.25" width="9" height="3.5" rx="1" strokeDasharray="2 1.6" />
      <rect x="2.5" y="13.5" width="9" height="3.5" rx="1" />
      <rect x="9.5" y="7" width="8" height="3.5" rx="1" fill="currentColor" fillOpacity={0.3} />
      <path d="M13.5 12.5l-1.5 1.5 1.5 1.5" />
    </svg>
  );
}
