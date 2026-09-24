import type { PropsIcone } from "./tipos";

/** Sinais de menor e maior com a barra, como numa tag. */
export function IconeCodigo({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M7 5.5L2.5 10 7 14.5M13 5.5l4.5 4.5-4.5 4.5" />
      <path d="M11.2 4l-2.4 12" />
    </svg>
  );
}
