import type { NegocioNoMapa } from "@/motor/busca";

/** O cartão do negócio no mapa, como a busca mostra ao lado do resultado (simulado). */
export function CartaoNegocio({ negocio }: { negocio: NegocioNoMapa }) {
  return (
    <article className="overflow-hidden rounded-2xl border-2 border-borda bg-fundo" data-cartao-negocio>
      {/* Um pedacinho de mapa desenhado, com o alfinete no negócio. */}
      <svg viewBox="0 0 240 70" className="block h-16 w-full bg-grama" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <path d="M0 42h240M70 0v70M170 0v70" stroke="var(--cor-superficie)" strokeWidth="7" />
        <path d="M0 18h240" stroke="var(--cor-superficie)" strokeWidth="3" opacity="0.7" />
        <path d="M120 50s-11-10-11-18a11 11 0 0 1 22 0c0 8-11 18-11 18z" fill="var(--cor-alerta)" stroke="var(--cor-borda)" strokeWidth="2" />
        <circle cx="120" cy="32" r="4" fill="var(--cor-superficie)" />
      </svg>
      <div className="p-3 text-sm">
        <p className="font-black text-texto" data-negocio-nome>
          {negocio.nome}
        </p>
        <p className="text-xs font-bold text-texto-suave">{negocio.tipo}</p>
        <p className="mt-1 text-texto" data-negocio-endereco>
          {negocio.endereco}
        </p>
        {negocio.horario && (
          <p className="text-texto" data-negocio-horario>
            Horário: {negocio.horario}
          </p>
        )}
        {negocio.telefone && <p className="text-texto">Telefone: {negocio.telefone}</p>}
      </div>
    </article>
  );
}
