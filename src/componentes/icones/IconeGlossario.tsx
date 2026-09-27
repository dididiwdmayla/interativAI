import type { PropsIcone } from "./tipos";

/** Livro aberto: o glossário. */
export function IconeGlossario({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M10 5.5C8.5 4 6 3.5 2.5 4v11c3.5-.5 6 0 7.5 1.5 1.5-1.5 4-2 7.5-1.5V4c-3.5-.5-6 0-7.5 1.5z" fill="currentColor" fillOpacity={0.12} />
      <path d="M10 5.5v11M5 7.5h2.5M5 10h2.5M12.5 7.5H15M12.5 10H15" />
    </svg>
  );
}
