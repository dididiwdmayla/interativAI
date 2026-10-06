import type { PropsIcone } from "./tipos";

/** Três potes de tinta (vermelho, verde e azul) e o quadradinho da cor que eles fazem. */
export function IconeMesaCores({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 10.5h3.5v5a1.75 1.75 0 0 1-3.5 0z" />
      <path d="M8.25 10.5h3.5v5a1.75 1.75 0 0 1-3.5 0z" />
      <path d="M14 10.5h3.5v5a1.75 1.75 0 0 1-3.5 0z" />
      <rect x="6" y="2" width="8" height="5.5" rx="1.2" fill="currentColor" fillOpacity={0.35} />
    </svg>
  );
}
