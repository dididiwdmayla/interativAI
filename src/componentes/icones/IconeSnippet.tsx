import type { PropsIcone } from "./tipos";

/** Uma folha de código com o triângulo de executar. */
export function IconeSnippet({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M11.5 2.5H5a1.5 1.5 0 00-1.5 1.5v12A1.5 1.5 0 005 17.5h4M11.5 2.5L15 6v2.5M11.5 2.5V6H15" />
      <path d="M6.5 9.5h4M6.5 12.5h2" />
      <path d="M12 11.5v6l5-3z" fill="currentColor" />
    </svg>
  );
}
