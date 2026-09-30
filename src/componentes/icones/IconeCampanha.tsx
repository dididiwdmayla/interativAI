import type { PropsIcone } from "./tipos";

/** Um megafone: o anúncio da campanha. */
export function IconeCampanha({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M3 8.5v3h2.5L13 15.5v-11L5.5 8.5z" fill="currentColor" fillOpacity={0.15} />
      <path d="M6 11.5l1.2 4h2" />
      <path d="M15.5 8a3 3 0 0 1 0 4" />
    </svg>
  );
}
