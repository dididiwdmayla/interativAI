import type { ReactNode } from "react";

type Props = {
  mascote: ReactNode;
  conversa: ReactNode;
  objetivos: ReactNode;
};

/** Faixa inferior com o computadorzinho, o balão de fala e os objetivos. */
export function AreaMascote({ mascote, conversa, objetivos }: Props) {
  return (
    <section
      aria-label="Computadorzinho e objetivos"
      className="flex shrink-0 items-stretch gap-3 border-t-2 border-borda bg-superficie px-3 py-2 lg:px-4 lg:py-3"
    >
      <div className="flex min-w-0 flex-1 items-end gap-2 lg:gap-3">
        <div className="shrink-0 self-end">{mascote}</div>
        <div className="flex h-full min-w-0 flex-1 flex-col">{conversa}</div>
      </div>
      <div className="hidden h-[11rem] w-[32%] shrink-0 lg:block">{objetivos}</div>
    </section>
  );
}
