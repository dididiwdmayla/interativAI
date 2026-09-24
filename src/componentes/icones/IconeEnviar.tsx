import type { PropsIcone } from "./tipos";

export function IconeEnviar({ className, tamanho = 16 }: PropsIcone) {
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
      <path d="M2.5 8.2L13.5 3l-3.6 10.5-2.4-4.3z" fill="currentColor" fillOpacity={0.2} />
      <path d="M7.5 9.2l6-6.2" />
    </svg>
  );
}
