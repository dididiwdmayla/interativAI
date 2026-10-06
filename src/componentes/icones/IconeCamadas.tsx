import type { PropsIcone } from "./tipos";

/** Três camadas empilhadas, com uma seta descendo: do que a gente escreve até a máquina. */
export function IconeCamadas({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2.5" width="11" height="3.5" rx="1" />
      <rect x="2" y="8.25" width="11" height="3.5" rx="1" />
      <rect x="2" y="14" width="11" height="3.5" rx="1" fill="currentColor" fillOpacity={0.3} />
      <path d="M16.5 4v11M14.5 13l2 2 2-2" />
    </svg>
  );
}
