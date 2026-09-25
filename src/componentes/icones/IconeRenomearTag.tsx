import type { PropsIcone } from "./tipos";

/** Sinais de tag com uma setinha girando no meio: trocar o nome da tag. */
export function IconeRenomearTag({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M5 5.5L1.8 10 5 14.5" />
      <path d="M15 5.5l3.2 4.5-3.2 4.5" />
      <path d="M13 8.2a3.4 3.4 0 00-6 .6" />
      <path d="M7 11.8a3.4 3.4 0 006-.6" />
      <path d="M13.3 5.8l-.3 2.4-2.3-.5" />
      <path d="M6.7 14.2l.3-2.4 2.3.5" />
    </svg>
  );
}
