import Link from "next/link";
import { IconeMapa } from "@/componentes/icones/IconeMapa";

type Props = {
  /** Para onde volta (a ilha da fase). */
  href: string;
  /** Celular: só o ícone e a palavra pequena, em 44 px. */
  compacto?: boolean;
};

/** Botão "Mapa" dentro da fase: volta para a ilha. */
export function BotaoMapa({ href, compacto = false }: Props) {
  return (
    <Link
      href={href}
      aria-label="Voltar ao mapa da ilha"
      data-botao-mapa
      className={
        compacto
          ? "flex h-11 min-w-11 shrink-0 flex-col items-center justify-center rounded-full px-1 text-[10px] font-black leading-none text-texto hover:bg-hover"
          : "flex h-9 items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto transition-colors hover:border-primaria hover:text-primaria"
      }
    >
      <IconeMapa tamanho={compacto ? 18 : 18} />
      <span className={compacto ? "mt-0.5" : ""}>Mapa</span>
    </Link>
  );
}
