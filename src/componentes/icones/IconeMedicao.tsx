import type { PropsIcone } from "./tipos";

/** Barras de um gráfico com um ponto chegando: a medição em tempo real. */
export function IconeMedicao({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17h14" />
      <path d="M5.5 14v-3M9 14V8M12.5 14v-5" />
      <circle cx="16" cy="5" r="2" fill="currentColor" fillOpacity={0.2} />
      <path d="M16 7.5V14" strokeDasharray="1.5 2" />
    </svg>
  );
}
