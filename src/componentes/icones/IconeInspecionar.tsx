import type { PropsIcone } from "./tipos";

/** Seta sobre um quadrado, igual ao botão de inspecionar do F12. */
export function IconeInspecionar({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M8 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V8" />
      <path d="M9.5 9.5l8 3-3.4 1.2-1.2 3.4z" fill="currentColor" />
    </svg>
  );
}
