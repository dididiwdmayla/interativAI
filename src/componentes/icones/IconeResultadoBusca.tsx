import type { PropsIcone } from "./tipos";

/** Uma lupa em cima de linhas de texto: o resultado na busca. */
export function IconeResultadoBusca({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M2.5 4h8M2.5 7.5h5M2.5 11h4" />
      <circle cx="12.5" cy="11" r="3.5" />
      <path d="M15 13.5l3 3" />
    </svg>
  );
}
