"use client";

import { Carinha } from "@/componentes/mascote/Carinha";
import { Botao } from "@/componentes/ui/Botao";
import type { Ferramenta } from "@/ferramentas/registro";

type Props = {
  ferramenta: Ferramenta;
  conhecida: boolean;
  toque: boolean;
  emFoco: boolean;
  aoRever: () => void;
};

/** O texto do F12 é escrito para seguir "No F12 de verdade:"; no card vira frase própria. */
function comMaiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function Bloco({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div>
      <dt className="text-[11px] font-black uppercase tracking-wide text-texto-suave">{titulo}</dt>
      <dd className="text-sm leading-snug text-texto">{texto}</dd>
    </div>
  );
}

/** Card da Caixa de Ferramentas. Ferramenta ainda não apresentada vira silhueta. */
export function CardFerramenta({ ferramenta, conhecida, toque, emFoco, aoRever }: Props) {
  const { Icone, demo: Demo } = ferramenta;

  if (!conhecida) {
    return (
      <li
        data-card={ferramenta.id}
        className={`flex items-center gap-3 rounded-2xl border-2 border-dashed border-borda bg-painel p-3 ${
          emFoco ? "ring-2 ring-primaria" : ""
        }`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-superficie text-borda">
          <Icone tamanho={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="h-3 w-24 rounded-full bg-borda" aria-hidden="true" />
          <p className="mt-1.5 text-sm font-bold text-texto-suave">Você conhece essa em breve</p>
        </div>
        <Carinha variante="dormindo" tom="suave" tamanho={28} rotulo="Ferramenta ainda dormindo" />
      </li>
    );
  }

  return (
    <li
      data-card={ferramenta.id}
      className={`rounded-2xl border-2 border-borda bg-superficie p-3 ${emFoco ? "ring-2 ring-primaria" : ""}`}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-painel text-primaria">
          <Icone tamanho={22} />
        </span>
        <h3 className="min-w-0 flex-1 text-base font-black text-texto">{ferramenta.nome}</h3>
      </div>
      <dl className="mt-2 space-y-2">
        <Bloco titulo="O que faz" texto={ferramenta.oQueFaz} />
        <Bloco titulo="Pra que serve" texto={ferramenta.praQueServe} />
        <Bloco titulo="Como usar aqui" texto={ferramenta.comoUsarAqui[toque ? "toque" : "mouse"]} />
        <Bloco titulo="No F12 de verdade" texto={comMaiuscula(ferramenta.noF12DeVerdade)} />
      </dl>
      {Demo && (
        <div className="mt-2 flex justify-center">
          <Demo />
        </div>
      )}
      <Botao variante="secundario" tamanho="p" className="mt-3 min-h-11" onClick={aoRever}>
        Rever apresentação
      </Botao>
    </li>
  );
}
