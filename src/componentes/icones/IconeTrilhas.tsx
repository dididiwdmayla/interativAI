import type { PropsIcone } from "./tipos";

/** Dois caminhos saindo do mesmo ponto: as trilhas. */
export function IconeTrilhas({ className, tamanho = 18 }: PropsIcone) {
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
      <circle cx="10" cy="16.5" r="1.8" fill="currentColor" fillOpacity={0.25} />
      <path d="M10 14.7V11c0-2-3.5-2.5-5-5.5" />
      <path d="M10 11c0-2 3.5-2.5 5-5.5" />
      <path d="M3.2 6.8L4.8 3.4l2.6 2.4M16.8 6.8l-1.6-3.4-2.6 2.4" />
    </svg>
  );
}
