import type { PropsIcone } from "./tipos";

/** A setinha com ponto que o Console põe na frente da resposta (o sinal de menor com um ponto). */
export function IconeRespostaConsole({ className, tamanho = 12 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 12 12"
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
      <path d="M6 2.5L2.5 6 6 9.5" />
      <circle cx="9" cy="6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
