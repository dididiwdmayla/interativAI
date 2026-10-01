import type { PropsIcone } from "./tipos";

/** Passar por cima: a seta que pula a bolinha (o botão do Chrome). */
export function IconeControlesDepurador({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11.5a6.5 6.5 0 0 1 13 0" />
      <path d="M13.5 9.5l3 2 1.5-3.2" />
      <circle cx="10" cy="15.5" r="1.8" fill="currentColor" />
    </svg>
  );
}
