import type { PropsIcone } from "./tipos";

/** Três degraus ligados, como a trilha de ancestrais do F12. */
export function IconeTrilha({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2" y="7.5" width="4" height="5" rx="1.2" />
      <rect x="8" y="7.5" width="4" height="5" rx="1.2" />
      <rect x="14" y="7.5" width="4" height="5" rx="1.2" fill="currentColor" />
      <path d="M6 10h2M12 10h2" />
    </svg>
  );
}
