import type { PropsIcone } from "./tipos";

/** Uma tabela com a última coluna marcada. */
export function IconeTabelaVerdade({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M2.5 7.5h15M2.5 11.5h15M7.5 3.5v13M12.5 3.5v13" />
      <circle cx="15" cy="9.5" r="0.9" fill="currentColor" />
    </svg>
  );
}
