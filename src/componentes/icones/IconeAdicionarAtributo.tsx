import type { PropsIcone } from "./tipos";

/** Uma tag com um "+" no lugar do atributo: adicionar atributo. */
export function IconeAdicionarAtributo({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M5 6L1.8 10 5 14" />
      <path d="M15 6l3.2 4-3.2 4" />
      <path d="M10 6.5v7M6.5 10h7" />
    </svg>
  );
}
