import type { PropsIcone } from "./tipos";

/** Uma lista de casos, um com o certo e um com o x: os casos de teste. */
export function IconeCasosDeTeste({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2.5" width="16" height="15" rx="2" />
      <path d="M5 7.25 6.5 8.75 9 6" />
      <path d="M11 7.5h4.5" />
      <path d="M5.25 12.25l3 3M8.25 12.25l-3 3" />
      <path d="M11 13.75h4.5" />
    </svg>
  );
}
