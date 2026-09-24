import { Carinha } from "./Carinha";

type Props = { compacto?: boolean; className?: string };

/** Selo dos objetivos feitos sem ajuda completa: carinha determinada e "Sozinho". */
export function SeloSozinho({ compacto = false, className = "" }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-secundaria bg-superficie font-black uppercase tracking-wide text-secundaria ${
        compacto ? "px-1 py-0 text-[10px]" : "px-1.5 py-0.5 text-[11px]"
      } ${className}`}
      title="Objetivo sozinho: a ajuda vai só até a dica"
    >
      <Carinha variante="determinada" tom="primaria" tamanho={compacto ? 14 : 16} />
      Sozinho
    </span>
  );
}
