import type { PropsIcone } from "./tipos";

/** Dois elos de corrente com uma etiqueta: um link com a marca de onde veio. */
export function IconeLinkRastreavel({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M8.5 11.5l3-3" />
      <path d="M9.5 6.5l1.2-1.2a2.8 2.8 0 0 1 4 4L13.5 10.5" />
      <path d="M10.5 13.5l-1.2 1.2a2.8 2.8 0 0 1-4-4L6.5 9.5" />
      <path d="M13 14.5h4l1 1.5-1 1.5h-4z" fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}
