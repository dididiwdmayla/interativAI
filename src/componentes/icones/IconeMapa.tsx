import type { PropsIcone } from "./tipos";

/** Mapa dobrado com um caminho pontilhado: voltar ao mapa. */
export function IconeMapa({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M2.5 5l5-2 5 2 5-2v12l-5 2-5-2-5 2z" fill="currentColor" fillOpacity={0.12} />
      <path d="M7.5 3v12M12.5 5v12" />
      <path d="M4.5 12.5c1.5-1 2.5-3 4.5-3s3 2.5 5.5 1" strokeDasharray="1.2 2" />
    </svg>
  );
}
