import type { PropsIcone } from "./tipos";

/** O sinal de maior do prompt do Console e o cursor. */
export function IconeConsole({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2" y="3.5" width="16" height="13" rx="2.5" />
      <path d="M5.5 8l2.5 2-2.5 2M10 12.5h4" />
    </svg>
  );
}
