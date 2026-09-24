import type { ReactNode } from "react";

type Props = { rotulo: string; children: ReactNode };

/** Moldura comum das mini animações: 160 × 90, cores só dos tokens. */
export function MoldeDemo({ rotulo, children }: Props) {
  return (
    <svg viewBox="0 0 160 90" className="h-auto w-full max-w-[240px]" role="img" aria-label={rotulo}>
      <rect x="1" y="1" width="158" height="88" rx="10" fill="var(--cor-painel)" stroke="var(--cor-borda)" strokeWidth="2" />
      {children}
    </svg>
  );
}

/** Setinha do mouse, desenhada com a ponta em (0, 0). */
export function Cursor() {
  return (
    <path
      d="M0 0l0 12 3.2-3 2.3 5 2-1-2.3-4.8 4.4-.2z"
      fill="var(--cor-texto)"
      stroke="var(--cor-superficie)"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  );
}
