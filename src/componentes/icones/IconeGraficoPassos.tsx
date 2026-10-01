import type { PropsIcone } from "./tipos";

/** Os eixos com uma reta e uma curva que dispara: o gráfico passos x tamanho. */
export function IconeGraficoPassos({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2.5v14.5h14.5" />
      <path d="M5 14.5l11-3" />
      <path d="M5 15c5 0 8-3 10.5-11" strokeDasharray="2.2 1.8" />
    </svg>
  );
}
