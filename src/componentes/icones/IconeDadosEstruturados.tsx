import type { PropsIcone } from "./tipos";

/** Chaves de JSON com um alfinete de mapa no meio: dados estruturados de um negócio. */
export function IconeDadosEstruturados({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M5.5 3C4 3 4 4 4 5.5v2c0 1-.8 2.5-2 2.5 1.2 0 2 1.5 2 2.5v2C4 16 4 17 5.5 17" />
      <path d="M14.5 3C16 3 16 4 16 5.5v2c0 1 .8 2.5 2 2.5-1.2 0-2 1.5-2 2.5v2c0 1.5 0 2.5-1.5 2.5" />
      <path d="M10 14.5s-3-2.8-3-5a3 3 0 0 1 6 0c0 2.2-3 5-3 5z" />
      <circle cx="10" cy="9.5" r="0.9" fill="currentColor" />
    </svg>
  );
}
