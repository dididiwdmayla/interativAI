import type { PropsIcone } from "./tipos";

/** Nome e valor de uma declaração, com o cursor no valor. */
export function IconeEditarValorCss({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M3 7.5h5" />
      <circle cx="10" cy="6.2" r=".6" fill="currentColor" />
      <circle cx="10" cy="8.8" r=".6" fill="currentColor" />
      <rect x="11.5" y="4.5" width="6" height="6" rx="1.2" fill="currentColor" fillOpacity={0.15} />
      <path d="M14.5 12.5v5M13 12.5h3M13 17.5h3" />
    </svg>
  );
}
