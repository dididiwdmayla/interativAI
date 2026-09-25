"use client";

import { useEffect, useId, useRef, useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import { IconeSom } from "@/componentes/icones/IconeSom";
import { Dica } from "@/componentes/ui/Dica";
import { useProgresso } from "@/lib/armazemProgresso";
import { AjustesSom } from "./AjustesSom";

/**
 * Botão de som da barra (desktop): abre os ajustes de som num painel
 * pequeno logo abaixo. Fecha com Esc, com clique fora ou no próprio botão.
 * No celular os ajustes moram direto no menu (AjustesSom).
 */
export function BotaoSom() {
  const { som } = useProgresso();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const idPainel = useId();

  const alternar = (abrir: boolean) => {
    setAberto(abrir);
    tocarEfeito(abrir ? "abrir-painel" : "fechar-painel");
  };

  useEffect(() => {
    if (!aberto) return;
    const aoApertarFora = (evento: PointerEvent) => {
      if (evento.target instanceof Node && caixa.current?.contains(evento.target)) return;
      setAberto(false);
      tocarEfeito("fechar-painel");
    };
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return;
      evento.stopPropagation();
      setAberto(false);
      tocarEfeito("fechar-painel");
      botao.current?.focus();
    };
    window.addEventListener("pointerdown", aoApertarFora, true);
    window.addEventListener("keydown", aoTeclar, true);
    return () => {
      window.removeEventListener("pointerdown", aoApertarFora, true);
      window.removeEventListener("keydown", aoTeclar, true);
    };
  }, [aberto]);

  return (
    <div ref={caixa} className="relative">
      <Dica texto={som ? "Som" : "Som silenciado"} alinhar="fim">
        <button
          ref={botao}
          type="button"
          aria-expanded={aberto}
          aria-controls={idPainel}
          aria-label="Ajustes de som"
          onClick={() => alternar(!aberto)}
          className={`grid h-9 w-9 place-items-center rounded-full border-2 bg-superficie transition-colors hover:border-primaria hover:text-primaria ${
            aberto ? "border-primaria text-primaria" : "border-borda text-texto"
          }`}
        >
          <IconeSom ligado={som} />
        </button>
      </Dica>
      <div
        id={idPainel}
        hidden={!aberto}
        className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border-2 border-borda bg-superficie p-3 text-texto shadow-[0_6px_0_var(--cor-sombra)]"
      >
        {aberto && <AjustesSom />}
      </div>
    </div>
  );
}
