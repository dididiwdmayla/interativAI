import type { PropsIcone } from "./tipos";

/** Maleta de trabalho: as profissões. */
export function IconeProfissoes({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="6" width="15" height="10.5" rx="2" fill="currentColor" fillOpacity={0.12} />
      <path d="M7.5 6V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V6M2.5 10.5h15M9 10.5v1.5h2v-1.5" />
    </svg>
  );
}
