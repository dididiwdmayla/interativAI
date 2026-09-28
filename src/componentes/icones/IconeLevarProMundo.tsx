import type { PropsIcone } from "./tipos";

/** Um globo com uma seta subindo: levar o site pro mundo (baixar os arquivos para publicar). */
export function IconeLevarProMundo({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M17 10.5a7 7 0 1 1-7.5-7" />
      <path d="M3.2 9h7.3M9.8 3.6c-1.7 1.9-2.6 4.2-2.6 6.9s.9 5 2.6 6.9c1.4-1.5 2.2-3.2 2.5-5" />
      <path d="M15 8.5V2.5M12.6 4.8 15 2.5l2.4 2.3" />
    </svg>
  );
}
