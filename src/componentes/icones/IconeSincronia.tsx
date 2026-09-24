import type { PropsIcone } from "./tipos";

/** Duas setas em círculo: um lado conversa com o outro. */
export function IconeSincronia({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M15.5 8A6 6 0 0 0 5 5.5L3.5 7" />
      <path d="M3.5 3.5V7H7" />
      <path d="M4.5 12A6 6 0 0 0 15 14.5l1.5-1.5" />
      <path d="M16.5 16.5V13H13" />
    </svg>
  );
}
