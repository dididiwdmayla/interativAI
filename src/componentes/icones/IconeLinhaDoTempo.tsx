import type { PropsIcone } from "./tipos";

/** Uma barra com marquinhas e o botão de voltar e avançar. */
export function IconeLinhaDoTempo({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M2.5 13h15M5 11v4M10 11v4M15 11v4" />
      <circle cx="10" cy="13" r="2" fill="currentColor" />
      <path d="M7 4.5L4.5 7 7 9.5M13 4.5L15.5 7 13 9.5" />
    </svg>
  );
}
