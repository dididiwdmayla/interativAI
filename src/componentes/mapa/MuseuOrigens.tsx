"use client";

import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { Mascote } from "@/componentes/mascote/Mascote";
import { ilhaDoId } from "@/curriculo";
import { useProgressoCarregado } from "@/lib/armazemProgresso";
import { BarraMapa } from "./BarraMapa";
import { BotaoVoltarAoMundo } from "./ilha/TelaIlha";

const SILHUETA = "var(--cor-texto)";

/** Cartão perfurado, em silhueta. */
function CartaoPerfurado() {
  return (
    <svg viewBox="0 0 120 90" className="h-24 w-auto" aria-hidden="true">
      <path d="M14 18h86l8 8v48H14z" fill={SILHUETA} opacity="0.85" />
      {Array.from({ length: 24 }, (_, indice) => (
        <rect
          key={indice}
          x={24 + (indice % 8) * 10}
          y={30 + Math.floor(indice / 8) * 13}
          width="4"
          height="7"
          rx="1"
          fill="var(--cor-superficie)"
          opacity={(indice * 7) % 3 === 0 ? 0 : 0.9}
        />
      ))}
    </svg>
  );
}

/** Terminal de tela verde, em silhueta (só a letrinha verde acesa). */
function TerminalVerde() {
  return (
    <svg viewBox="0 0 120 90" className="h-24 w-auto" aria-hidden="true">
      <rect x="18" y="8" width="84" height="62" rx="8" fill={SILHUETA} opacity="0.85" />
      <rect x="27" y="16" width="66" height="44" rx="4" fill="var(--cor-terminal-fundo)" />
      <path d="M34 26h20M34 34h30M34 42h12" stroke="var(--cor-terminal-texto)" strokeWidth="3" strokeLinecap="round" />
      <rect x="30" y="72" width="60" height="10" rx="3" fill={SILHUETA} opacity="0.85" />
    </svg>
  );
}

/** O primeiro computador pessoal: caixa, monitor e teclado, em silhueta. */
function PrimeiroPc() {
  return (
    <svg viewBox="0 0 120 90" className="h-24 w-auto" aria-hidden="true">
      <rect x="30" y="6" width="60" height="44" rx="6" fill={SILHUETA} opacity="0.85" />
      <rect x="38" y="13" width="44" height="30" rx="3" fill="var(--cor-superficie)" opacity="0.25" />
      <rect x="14" y="52" width="92" height="14" rx="3" fill={SILHUETA} opacity="0.85" />
      <rect x="22" y="70" width="76" height="12" rx="3" fill={SILHUETA} opacity="0.85" />
      <rect x="84" y="56" width="16" height="4" rx="1" fill="var(--cor-superficie)" opacity="0.3" />
    </svg>
  );
}

/** Uma porta de sala, fechada. */
function PortaFechada() {
  return (
    <svg viewBox="0 0 80 110" className="h-28 w-auto" aria-hidden="true">
      <path d="M8 108V40a32 32 0 0 1 64 0v68z" fill="var(--cor-pedra-sombra)" />
      <path d="M16 108V42a24 24 0 0 1 48 0v66z" fill="var(--cor-madeira)" />
      <path d="M40 18v90M16 64h48" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="2" />
      <circle cx="52" cy="72" r="3" fill="var(--cor-destaque)" />
      <rect x="18" y="80" width="44" height="18" rx="3" fill="var(--cor-areia)" stroke="var(--cor-madeira)" strokeWidth="2" />
    </svg>
  );
}

/** Fachada do museu: frontão e colunas. */
function Fachada() {
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full max-w-md" aria-hidden="true">
      <path d="M20 44L160 6l140 38z" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="160" cy="30" r="9" fill="var(--cor-destaque)" />
      <rect x="24" y="44" width="272" height="12" rx="3" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      {[40, 90, 140, 190, 240].map((x) => (
        <rect key={x} x={x} y="58" width="22" height="56" rx="3" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      ))}
      <rect x="14" y="114" width="292" height="12" rx="3" fill="var(--cor-pedra-sombra)" />
    </svg>
  );
}

const ANTEPASSADOS = [
  { id: "cartao", nome: "Cartão perfurado", Desenho: CartaoPerfurado },
  { id: "terminal", nome: "Terminal verde", Desenho: TerminalVerde },
  { id: "pc", nome: "O primeiro PC", Desenho: PrimeiroPc },
];

type Props = { ilhaId: string };

/**
 * O Museu das Origens (ilha sempre aberta). Por enquanto: a entrada com os
 * antepassados do computadorzinho em silhueta e as salas planejadas como
 * portas fechadas, "Em breve".
 */
export function MuseuOrigens({ ilhaId }: Props) {
  const carregado = useProgressoCarregado();
  const ilha = ilhaDoId(ilhaId);
  if (!carregado || !ilha) return <TelaCarregando />;
  const salas = ilha.zonas.flatMap((zona) => zona.unidades);
  return (
    <div className="flex h-dvh flex-col overflow-hidden" data-mapa="museu" data-ilha={ilha.id}>
      <BarraMapa caminho={["Mundo", `Ilha ${ilha.nome}`]} voltar={<BotaoVoltarAoMundo />} />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-6">
          <section className="flex w-full flex-col items-center text-center">
            <Fachada />
            <h1 className="mt-2 text-2xl font-black text-primaria">Museu das Origens</h1>
            <p className="mt-1 max-w-lg text-sm font-bold text-texto-suave">
              Aqui você vai descobrir de onde vieram os computadores, as linguagens e a própria internet.
            </p>
          </section>

          <section aria-labelledby="entrada-museu" className="w-full rounded-3xl border-2 border-borda bg-superficie p-4">
            <div className="flex items-center gap-3">
              <Mascote expressao="curioso" tamanho={72} className="shrink-0" />
              <div>
                <h2 id="entrada-museu" className="text-lg font-black text-texto">
                  Na entrada
                </h2>
                <p className="text-sm font-bold text-texto-suave">
                  Esses são meus antepassados! Um dia eu te conto a história de cada um.
                </p>
              </div>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ANTEPASSADOS.map(({ id, nome, Desenho }) => (
                <li key={id} data-antepassado={id} className="flex flex-col items-center rounded-2xl bg-painel p-3">
                  <Desenho />
                  <span className="mt-1 text-sm font-black text-texto">{nome}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="salas-museu" className="w-full">
            <h2 id="salas-museu" className="text-lg font-black text-texto">
              As salas
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {salas.map((sala, indice) => (
                <li
                  key={sala.id}
                  data-sala={sala.id}
                  aria-label={`Sala ${indice + 1}: ${sala.titulo}. Porta fechada, em breve.`}
                  className="flex flex-col items-center rounded-2xl border-2 border-borda bg-superficie p-3 text-center"
                >
                  <PortaFechada />
                  <span className="mt-1 text-[11px] font-black uppercase text-texto-suave">Sala {indice + 1}</span>
                  <span className="text-sm font-black leading-tight text-texto">{sala.titulo}</span>
                  <span className="mt-1 rounded-full bg-madeira px-2 py-0.5 text-[10px] font-black uppercase text-superficie">
                    Em breve
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
