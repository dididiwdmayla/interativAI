"use client";

import Link from "next/link";
import { tocarEfeito } from "@/audio/motor";
import { temaComIcone } from "@/componentes/temas/temas";
import type { DestinoFase, EntradaGlossario } from "@/lib/glossario";

type Props = {
  entrada: EntradaGlossario;
  destinos: (ids: readonly string[]) => DestinoFase[];
};

/** A lista de fases de um verbete: link para a fase liberada, ou para o ponto no mapa com o aviso. */
function ListaDeFases({ titulo, destinos, vazio }: { titulo: string; destinos: DestinoFase[]; vazio: string }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-wide text-texto-suave">{titulo}</h3>
      {destinos.length === 0 ? (
        <p className="mt-0.5 text-sm font-bold text-texto-suave">{vazio}</p>
      ) : (
        <ul className="mt-1 flex flex-col gap-1">
          {destinos.map((destino) => (
            <li key={destino.faseId} data-fase-do-verbete={destino.faseId} data-liberada={destino.liberada ? "sim" : "nao"}>
              <Link
                href={destino.href}
                onClick={() => tocarEfeito("clique")}
                className="group inline-flex min-h-9 flex-wrap items-center gap-x-2 rounded-lg text-sm font-black text-primaria hover:text-texto"
              >
                <span className="underline decoration-2 underline-offset-2">{destino.rotulo}</span>
                {destino.aviso && <span className="text-xs font-bold text-texto-suave">{destino.aviso}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Um termo do glossário: nome, resumo de leigo, temas, onde aprender e onde praticar. */
export function VerbeteGlossario({ entrada, destinos }: Props) {
  const { conceito } = entrada;
  return (
    <li
      id={conceito.id}
      data-verbete={conceito.id}
      className="scroll-mt-28 rounded-3xl border-2 border-borda bg-superficie p-4 shadow-[0_4px_0_var(--cor-sombra)] target:border-primaria"
    >
      <h2 className="text-lg font-black text-texto">
        {conceito.nome}
        {conceito.termoIngles && (
          <span className="ml-2 align-middle text-xs font-bold text-texto-suave" data-termo-ingles>
            em inglês: <span lang="en" className="font-codigo">{conceito.termoIngles}</span>
          </span>
        )}
      </h2>
      <p className="mt-0.5 text-[15px] font-bold leading-snug text-texto">{conceito.resumo}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`Temas de ${conceito.nome}`}>
        {conceito.temas.map((id) => {
          const tema = temaComIcone(id);
          return (
            <li key={id} className="flex items-center gap-1 rounded-full bg-painel px-2 py-0.5 text-xs font-bold text-texto-suave">
              <tema.Icone tamanho={13} />
              {tema.nome}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <ListaDeFases titulo="Onde aprender" destinos={destinos(entrada.aprender)} vazio="Ainda não tem fase que ensine." />
        <ListaDeFases titulo="Onde praticar" destinos={destinos(entrada.praticar)} vazio="Ainda não tem fase que pratique." />
      </div>
    </li>
  );
}
