import type { PropsIcone } from "./tipos";

/** Uma pasta com uma página dentro: Meus projetos (os sites do jogador). */
export function IconeProjetos({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M2.5 6V15a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V7.5A1.5 1.5 0 0 0 16 6H9.5L8 4H4A1.5 1.5 0 0 0 2.5 5.5Z" />
      <path d="M7 10.5h6M7 13h4" />
    </svg>
  );
}
