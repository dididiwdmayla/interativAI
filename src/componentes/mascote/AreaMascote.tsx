import type { ReactNode } from "react";

type Props = {
  mascote: ReactNode;
  fala: ReactNode;
  objetivos: ReactNode;
};

/** Faixa inferior com o computadorzinho, o balão de fala e os objetivos. */
export function AreaMascote({ mascote, fala, objetivos }: Props) {
  return (
    <section
      aria-label="Computadorzinho e objetivos"
      className="flex shrink-0 gap-3 border-t-2 border-borda bg-superficie px-4 py-3"
    >
      <div className="flex min-w-0 flex-1 items-end gap-3">
        <div className="shrink-0">{mascote}</div>
        <div className="min-w-0 flex-1">{fala}</div>
      </div>
      <div className="hidden w-[34%] shrink-0 lg:block">{objetivos}</div>
    </section>
  );
}
