"use client";

import { useRef, type ReactNode } from "react";

type Props = { rotulo: string; children?: ReactNode; className: string; aoAtivar: () => void };

/** Depois de uma pinça, o navegador pode omitir o click de compatibilidade.
 * No toque, a navegação responde ao pointerup; um click posterior não repete
 * a ação. Mouse e teclado continuam usando click. */
export function BotaoNavegacaoCircuito({ rotulo, children, className, aoAtivar }: Props) {
  const suprimirClick = useRef(false);
  return (
    <button type="button" aria-label={rotulo} className={className}
      onPointerDown={() => { suprimirClick.current = false; }}
      onPointerUp={(evento) => {
        if (evento.pointerType !== "touch" || !evento.isPrimary) return;
        const r = evento.currentTarget.getBoundingClientRect();
        if (evento.clientX < r.left || evento.clientX > r.right || evento.clientY < r.top || evento.clientY > r.bottom) return;
        suprimirClick.current = true;
        aoAtivar();
      }}
      onClick={(evento) => {
        if (evento.detail !== 0 && suprimirClick.current) { suprimirClick.current = false; return; }
        suprimirClick.current = false;
        aoAtivar();
      }}
    >{children ?? rotulo}</button>
  );
}
