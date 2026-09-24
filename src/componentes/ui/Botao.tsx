import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "fantasma";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  tamanho?: "p" | "m";
};

const VARIANTES: Record<Variante, string> = {
  primario:
    "border-primaria bg-primaria text-sobre-primaria shadow-[0_3px_0_var(--cor-mascote-moldura-sombra)] hover:brightness-110 active:translate-y-[2px] active:shadow-none",
  secundario: "border-borda bg-superficie text-texto hover:border-primaria hover:text-primaria",
  fantasma: "border-transparent bg-transparent text-texto-suave hover:bg-hover hover:text-texto",
};

/** Botão arredondado do jogo. */
export function Botao({ variante = "primario", tamanho = "m", className = "", type = "button", ...resto }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border-2 font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
        tamanho === "p" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm"
      } ${VARIANTES[variante]} ${className}`}
      {...resto}
    />
  );
}
