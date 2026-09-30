import type { PropsIcone } from "./tipos";

/** Três caixinhas com etiqueta, como as variáveis no palco da memória. */
export function IconePalcoMemoria({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2.5" y="4" width="6" height="5" rx="1.2" />
      <rect x="11.5" y="4" width="6" height="5" rx="1.2" />
      <rect x="2.5" y="12" width="15" height="4.5" rx="1.2" />
      <path d="M7 12v4.5M11.5 12v4.5" />
    </svg>
  );
}
