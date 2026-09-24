import type { PropsIcone } from "./tipos";

/** Caixa de ferramentas com alça. */
export function IconeCaixaFerramentas({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M7.5 6V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V6" />
      <rect x="2.5" y="6" width="15" height="10.5" rx="1.8" fill="currentColor" fillOpacity={0.15} />
      <path d="M2.5 10.5h15" />
      <rect x="8.5" y="9.3" width="3" height="2.4" rx="0.6" fill="currentColor" />
    </svg>
  );
}
