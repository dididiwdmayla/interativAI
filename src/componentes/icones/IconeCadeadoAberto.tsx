import type { PropsIcone } from "./tipos";

export function IconeCadeadoAberto({ className, tamanho = 14 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="10" height="7.5" rx="2" fill="currentColor" fillOpacity={0.15} />
      <path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.4-1" />
    </svg>
  );
}
