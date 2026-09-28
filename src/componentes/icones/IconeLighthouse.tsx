import type { PropsIcone } from "./tipos";

/** Um farol: a aba Lighthouse (farol, em inglês) do DevTools. */
export function IconeLighthouse({ className, tamanho = 18 }: PropsIcone) {
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
      <path d="M7.6 7.5h4.8l1.2 10H6.4z" />
      <path d="M7 7.5l.6-2.5h4.8l.6 2.5M10 5V3" />
      <path d="M7.1 12.5h5.8" />
      <path d="M3 4.5l2.4 1M17 4.5l-2.4 1M3.5 8l2-.3M16.5 8l-2-.3" />
      <path d="M4 17.5h12" />
    </svg>
  );
}
