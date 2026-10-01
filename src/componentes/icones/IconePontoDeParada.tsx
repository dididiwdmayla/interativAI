import type { PropsIcone } from "./tipos";

/** A etiqueta do ponto de parada, como a marca em cima do número da linha no Chrome. */
export function IconePontoDeParada({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 5.5h10l4.5 4.5-4.5 4.5h-10z" fill="currentColor" fillOpacity={0.25} />
      <path d="M6 9h3M6 11.5h1.5" />
    </svg>
  );
}
