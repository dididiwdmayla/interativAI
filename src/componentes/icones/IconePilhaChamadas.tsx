import type { PropsIcone } from "./tipos";

/** Três quadros empilhados: a Pilha de chamadas (a função de cima é a que roda agora). */
export function IconePilhaChamadas({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="12" height="4" rx="1.2" fill="currentColor" fillOpacity={0.3} />
      <rect x="3" y="8.5" width="14" height="4" rx="1.2" />
      <rect x="2" y="14" width="16" height="4" rx="1.2" />
    </svg>
  );
}
