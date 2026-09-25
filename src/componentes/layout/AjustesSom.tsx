"use client";

import { useId, useRef } from "react";
import { falar, tocarEfeito } from "@/audio/motor";
import { IconeSom } from "@/componentes/icones/IconeSom";
import { atualizarProgresso, useProgresso } from "@/lib/armazemProgresso";
import type { Progresso } from "@/lib/progresso";

/** Frase curtinha do botão "Testar voz". */
export const FRASE_TESTE_VOZ = "Oi! Eu sou o computadorzinho, e é assim que eu falo.";

type CampoVolume = "volumeMusica" | "volumeEfeitos" | "volumeVoz";

type PropsControle = {
  rotulo: string;
  campo: CampoVolume;
  valor: number;
  desativado: boolean;
  aoSoltar?: () => void;
};

/** Um controle deslizante de volume, de 0 a 100%. */
function ControleVolume({ rotulo, campo, valor, desativado, aoSoltar }: PropsControle) {
  const id = useId();
  const porcento = Math.round(valor * 100);
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold text-texto">
          {rotulo}
        </label>
        <output htmlFor={id} className="text-xs font-black tabular-nums text-texto-suave">
          {porcento}%
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={porcento}
        data-volume={campo}
        aria-valuetext={`${porcento}%`}
        disabled={desativado}
        onChange={(evento) => {
          const novo = Number(evento.target.value) / 100;
          atualizarProgresso((atual): Progresso => ({ ...atual, [campo]: novo }));
        }}
        onPointerUp={aoSoltar}
        onKeyUp={aoSoltar}
        className="h-8 w-full cursor-pointer accent-[var(--cor-primaria)] disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:h-11"
      />
    </div>
  );
}

/**
 * Seção "Som" dos ajustes: volume da música, dos efeitos e da voz do
 * computadorzinho, silenciar tudo e testar a voz. Tudo salvo no progresso
 * (o mesmo lugar do tema).
 */
export function AjustesSom() {
  const { som, volumeMusica, volumeEfeitos, volumeVoz } = useProgresso();
  const idTitulo = useId();
  const ultimoTeste = useRef(0);
  const mudo = !som;

  const testarEfeitos = () => {
    // Um clique para ouvir o volume novo (sem repetir a cada passinho).
    const agora = Date.now();
    if (agora - ultimoTeste.current < 150) return;
    ultimoTeste.current = agora;
    tocarEfeito("clique");
  };

  return (
    <section aria-labelledby={idTitulo} data-ajustes-som className="flex flex-col gap-2 text-left">
      <h2 id={idTitulo} className="flex items-center gap-1.5 text-sm font-black uppercase tracking-wide text-texto-suave">
        <IconeSom ligado={som} tamanho={16} />
        Som
      </h2>
      <ControleVolume rotulo="Música" campo="volumeMusica" valor={volumeMusica} desativado={mudo} />
      <ControleVolume
        rotulo="Efeitos"
        campo="volumeEfeitos"
        valor={volumeEfeitos}
        desativado={mudo}
        aoSoltar={testarEfeitos}
      />
      <ControleVolume rotulo="Voz do computadorzinho" campo="volumeVoz" valor={volumeVoz} desativado={mudo} />
      <div className="mt-1 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={mudo}
          data-silenciar
          onClick={() => {
            atualizarProgresso((atual) => ({ ...atual, som: !atual.som }));
            // Ao religar, o clique confirma que o som voltou.
            if (mudo) setTimeout(() => tocarEfeito("clique"), 0);
          }}
          className={`min-h-9 flex-1 whitespace-nowrap rounded-full border-2 px-3 text-sm font-black transition-colors pointer-coarse:min-h-11 ${
            mudo
              ? "border-primaria bg-primaria text-sobre-primaria"
              : "border-borda bg-superficie text-texto hover:border-primaria hover:text-primaria"
          }`}
        >
          {mudo ? "Som silenciado" : "Silenciar tudo"}
        </button>
        <button
          type="button"
          data-testar-voz
          disabled={mudo || volumeVoz <= 0}
          onClick={() => falar(FRASE_TESTE_VOZ, "feliz")}
          className="min-h-9 flex-1 whitespace-nowrap rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto transition-colors hover:border-primaria hover:text-primaria disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11"
        >
          Testar voz
        </button>
      </div>
    </section>
  );
}
