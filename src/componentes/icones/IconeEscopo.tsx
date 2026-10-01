import type { PropsIcone } from "./tipos";

/** As chaves de um bloco com as variáveis dentro: o painel Escopo. */
export function IconeEscopo({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3.5c-1.5 0-2 .7-2 2v2.5c0 1-.6 2-1.5 2 .9 0 1.5 1 1.5 2v2.5c0 1.3.5 2 2 2" />
      <path d="M14 3.5c1.5 0 2 .7 2 2v2.5c0 1 .6 2 1.5 2-.9 0-1.5 1-1.5 2v2.5c0 1.3-.5 2-2 2" />
      <path d="M8 8h4M8 12h3" />
    </svg>
  );
}
