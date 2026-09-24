import type { ReactNode } from "react";

type Props = {
  texto: string;
  children: ReactNode;
  lado?: "baixo" | "cima";
  className?: string;
};

/** Balãozinho de dica que aparece no hover e no foco do teclado. */
export function Dica({ texto, children, lado = "baixo", className = "" }: Props) {
  return (
    <span className={`group/dica relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-texto px-2.5 py-1 text-xs font-bold text-fundo opacity-0 shadow-md transition-opacity duration-150 group-focus-within/dica:opacity-100 group-hover/dica:opacity-100 ${
          lado === "baixo" ? "top-full mt-2" : "bottom-full mb-2"
        }`}
      >
        {texto}
      </span>
    </span>
  );
}
