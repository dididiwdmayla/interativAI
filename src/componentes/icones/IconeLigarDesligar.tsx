import type { PropsIcone } from "./tipos";

/** Caixinha marcada ao lado de uma linha riscada. */
export function IconeLigarDesligar({ className, tamanho = 18 }: PropsIcone) {
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
      <rect x="2.5" y="6" width="7" height="7" rx="1.5" />
      <path d="M4.2 9.5l1.6 1.6 2.6-3" />
      <path d="M12 9.5h6" />
      <path d="M11.5 12.5h6.5" strokeOpacity={0.45} />
    </svg>
  );
}
