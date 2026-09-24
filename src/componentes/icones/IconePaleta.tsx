import type { PropsIcone } from "./tipos";

export function IconePaleta({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 2.5a7.5 7.5 0 0 0 0 15c1.2 0 1.6-.9 1.2-1.8-.5-1 .1-2.2 1.3-2.2h1.8a3.2 3.2 0 0 0 3.2-3.2C17.5 5.8 14.1 2.5 10 2.5z"
        fill="var(--cor-superficie)"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <circle cx="6.3" cy="9" r="1.4" fill="var(--cor-primaria)" />
      <circle cx="8.6" cy="5.8" r="1.4" fill="var(--cor-destaque)" />
      <circle cx="12.4" cy="5.9" r="1.4" fill="var(--cor-secundaria)" />
      <circle cx="14.6" cy="9" r="1.4" fill="var(--cor-sucesso)" />
    </svg>
  );
}
