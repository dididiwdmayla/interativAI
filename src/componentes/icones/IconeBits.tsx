import type { PropsIcone } from "./tipos";

/** Quatro lâmpadas em fila, duas acesas: os bits. */
export function IconeBits({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {[3.5, 7.8, 12.1, 16.4].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="8" r="1.9" fill={i % 2 === 1 ? "currentColor" : "none"} />
          <path d={`M${x} 10v2.2`} />
        </g>
      ))}
      <path d="M2 15h16" />
    </svg>
  );
}
