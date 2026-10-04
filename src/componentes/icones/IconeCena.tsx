import type { PropsIcone } from "./tipos";

/** Um quarto com uma lâmpada acesa: a cena que o código controla. */
export function IconeCena({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M2.5 17.5V7.5L10 2.5l7.5 5v10z" />
      <path d="M10 5.5v2.5" />
      <path d="M8 10a2 2 0 1 1 4 0c0 .9-.6 1.3-.9 1.8H8.9C8.6 11.3 8 10.9 8 10z" />
      <path d="M9 13.5h2M6 9.5l-1-.6M14 9.5l1-.6" />
    </svg>
  );
}
