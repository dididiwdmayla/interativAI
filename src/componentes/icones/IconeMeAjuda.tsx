import type { PropsIcone } from "./tipos";

/** Boia salva-vidas. */
export function IconeMeAjuda({ className, tamanho = 18 }: PropsIcone) {
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
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3" />
      <path d="M5 5l2.9 2.9M15 5l-2.9 2.9M5 15l2.9-2.9M15 15l-2.9-2.9" />
    </svg>
  );
}
