"use client";

import { type FormEvent, useId, useState } from "react";
import { IconeEnviar } from "@/componentes/icones/IconeEnviar";
import { LIMITES_TUTOR } from "@/lib/tutor/tipos";

type Props = {
  carregando: boolean;
  desativado: boolean;
  motivoDesativado?: string;
  aoEnviar: (pergunta: string) => void;
};

/** Campo "Pergunte ao computadorzinho". */
export function CampoTutor({ carregando, desativado, motivoDesativado, aoEnviar }: Props) {
  const [texto, setTexto] = useState("");
  const id = useId();
  const bloqueado = desativado || carregando;

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    const pergunta = texto.trim();
    if (!pergunta || bloqueado) return;
    aoEnviar(pergunta);
    setTexto("");
  };

  return (
    <form onSubmit={enviar} className="mt-2 flex items-center gap-2">
      <label htmlFor={id} className="sr-only">
        Pergunte ao computadorzinho
      </label>
      <input
        id={id}
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        maxLength={LIMITES_TUTOR.pergunta}
        disabled={desativado}
        placeholder={desativado ? motivoDesativado : "Pergunte ao computadorzinho..."}
        autoComplete="off"
        className="min-w-0 flex-1 rounded-full border-2 border-borda bg-superficie px-4 py-1.5 text-sm text-texto placeholder:text-texto-suave focus:border-primaria focus:outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={bloqueado || texto.trim().length === 0}
        aria-label={carregando ? "Esperando a resposta" : "Enviar pergunta"}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primaria text-sobre-primaria transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {carregando ? (
          <span className="flex gap-0.5" aria-hidden="true">
            {[0, 1, 2].map((ponto) => (
              <span
                key={ponto}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-sobre-primaria"
                style={{ animationDelay: `${ponto * 120}ms` }}
              />
            ))}
          </span>
        ) : (
          <IconeEnviar />
        )}
      </button>
    </form>
  );
}
