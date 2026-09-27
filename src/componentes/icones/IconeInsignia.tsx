import type { PropsIcone } from "./tipos";

/** Medalha com fita: as insígnias. */
export function IconeInsignia({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M6.5 2.5l2.5 5M13.5 2.5l-2.5 5" />
      <circle cx="10" cy="12.5" r="5" fill="currentColor" fillOpacity={0.15} />
      <path d="M10 10v5M8 11l2-1" />
    </svg>
  );
}
