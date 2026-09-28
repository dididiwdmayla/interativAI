import type { PropsIcone } from "./tipos";

/** Um aparelho deitando, com a seta de girar: o botão de girar da barra de dispositivo. */
export function IconeGirar({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2.5" y="9.5" width="11" height="7" rx="1.4" />
      <path d="M8 3.5a7 7 0 0 1 8.3 5.2" />
      <path d="M16.9 6.3l-.6 2.6-2.5-1" />
    </svg>
  );
}
