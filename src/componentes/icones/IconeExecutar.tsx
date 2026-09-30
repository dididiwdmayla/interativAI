import type { PropsIcone } from "./tipos";

/** O triângulo de executar. */
export function IconeExecutar({ className, tamanho = 14 }: PropsIcone) {
  return (
    <svg viewBox="0 0 14 14" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="currentColor">
      <path d="M4 2.6v8.8a.6.6 0 00.9.5l7-4.4a.6.6 0 000-1L4.9 2.1a.6.6 0 00-.9.5z" />
    </svg>
  );
}
