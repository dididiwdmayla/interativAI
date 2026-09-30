import type { PropsIcone } from "./tipos";

/** Um portão E (a forma de D) com dois fios entrando e um saindo. */
export function IconeCircuito({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M7 4.5h3.5a5.5 5.5 0 010 11H7z" />
      <path d="M2 7.5h5M2 12.5h5M16 10h2.5" />
    </svg>
  );
}
