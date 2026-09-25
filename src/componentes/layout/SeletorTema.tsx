"use client";

import { tocarEfeito } from "@/audio/motor";
import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { IconePaleta } from "@/componentes/icones/IconePaleta";
import { Dica } from "@/componentes/ui/Dica";
import { useProgresso } from "@/lib/armazemProgresso";
import { escolherTema } from "@/lib/tema";
import { TEMAS } from "@/tema/temas";

/**
 * Cada amostra é renderizada dentro de um data-theme próprio, então as
 * bolinhas mostram as cores reais daquele tema usando os mesmos tokens.
 */
export function SeletorTema() {
  const progresso = useProgresso();

  return (
    <div
      role="radiogroup"
      aria-label="Tema de cores"
      className="flex items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-2 py-1"
    >
      <IconePaleta className="mr-0.5 hidden text-texto-suave sm:block" />
      {TEMAS.map((tema) => {
        const livre = progresso.temasDesbloqueados.includes(tema.id);
        const ativo = progresso.tema === tema.id;
        const rotulo = livre
          ? `Tema ${tema.nome}: ${tema.descricao}`
          : "Tema secreto. Será que tem algo escondido no F12?";
        return (
          <Dica key={tema.id} texto={livre ? tema.nome : "Bloqueado"}>
            <button
              type="button"
              role="radio"
              aria-checked={ativo}
              aria-label={rotulo}
              disabled={!livre}
              onClick={() => {
                escolherTema(tema.id);
                tocarEfeito("clique");
              }}
              className={`relative grid h-7 w-7 place-items-center rounded-full transition-transform ${
                ativo ? "scale-110 ring-2 ring-primaria ring-offset-2 ring-offset-superficie" : ""
              } ${livre ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}`}
            >
              <span
                data-theme={livre ? tema.id : undefined}
                className="absolute inset-0 overflow-hidden rounded-full border-2 border-borda"
                style={{
                  background: livre
                    ? "conic-gradient(var(--cor-primaria) 0 33%, var(--cor-secundaria) 0 66%, var(--cor-destaque) 0)"
                    : "var(--cor-painel)",
                }}
              />
              {!livre && <IconeCadeado className="relative text-texto-suave" tamanho={13} />}
            </button>
          </Dica>
        );
      })}
    </div>
  );
}
