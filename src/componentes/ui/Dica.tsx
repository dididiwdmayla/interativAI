import type { ReactNode } from "react";

type Props = {
  texto: string;
  children: ReactNode;
  lado?: "baixo" | "cima";
  /** "centro" centraliza; "inicio" e "fim" encostam numa borda (bom perto das bordas da tela). */
  alinhar?: "centro" | "inicio" | "fim";
  className?: string;
};

/** Balãozinho de dica que aparece no hover e no foco do teclado. */
export function Dica({ texto, children, lado = "baixo", alinhar = "centro", className = "" }: Props) {
  return (
    <span className={`group/dica relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap ${
          alinhar === "centro" ? "left-1/2 -translate-x-1/2" : alinhar === "inicio" ? "left-0" : "right-0"
        } rounded-lg bg-texto px-2.5 py-1 text-xs font-bold text-fundo shadow-md hidden group-focus-within/dica:block group-hover/dica:block ${
          lado === "baixo" ? "top-full mt-2" : "bottom-full mb-2"
        }`}
      >
        {texto}
      </span>
    </span>
  );
}
