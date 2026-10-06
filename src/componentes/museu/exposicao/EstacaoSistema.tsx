"use client";

/*
 * O gerente (o sistema operacional, sala 4): o aluno dá a vez do
 * processador a um programa por fatia de tempo. A faixa do tempo mostra as
 * fatias dadas; a barra da memória, o pedaço de cada programa (que fica
 * livre quando ele termina). A música tem pressa: se passar tempo demais
 * sem a vez dela, engasga (e a faixa marca onde).
 */
import { motion, useReducedMotion } from "framer-motion";
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { type EstacaoSistema as DadosSistema, type EstadoSistema, fatiaDoEngasgo, type ProgramaNoSistema, restantes } from "@/motor/exposicao/simulacoes/sistema";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

const CORES = ["var(--cor-zona-1)", "var(--cor-zona-2)", "var(--cor-zona-3)", "var(--cor-zona-4)"];

function FiguraPrograma({ figura }: { figura: ProgramaNoSistema["figura"] }) {
  const comum = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" aria-hidden="true" {...comum}>
      {figura === "musica" && (
        <>
          <path d="M7 15V4l9-2v11" />
          <circle cx="5" cy="15" r="2.2" fill="currentColor" />
          <circle cx="14" cy="13" r="2.2" fill="currentColor" />
        </>
      )}
      {figura === "navegador" && (
        <>
          <rect x="2" y="3" width="16" height="14" rx="2" />
          <path d="M2 7h16M5 5h.01M7.5 5h.01" />
        </>
      )}
      {figura === "jogo" && (
        <>
          <rect x="2" y="6" width="16" height="9" rx="4" />
          <path d="M6 9v3M4.5 10.5h3M13 10h.01M15 11.5h.01" />
        </>
      )}
      {figura === "video" && (
        <>
          <rect x="2" y="5" width="11" height="10" rx="2" />
          <path d="M13 9l5-3v8l-5-3" />
        </>
      )}
      {figura === "editor" && (
        <>
          <path d="M4 16l1-4 8-8 3 3-8 8z" />
          <path d="M11 6l3 3" />
        </>
      )}
      {figura === "mensagens" && <path d="M3 4h14v9H8l-4 3v-3H3z" />}
    </svg>
  );
}

export function EstacaoSistema({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosSistema, EstadoSistema>) {
  const reduzir = useReducedMotion();
  const falta = restantes(estacao, estado.fatias);
  const engasgo = fatiaDoEngasgo(estacao, estado.fatias);
  const corDe = (id: string) => CORES[estacao.programas.findIndex((p) => p.id === id) % CORES.length];
  const todos = estacao.programas.every((p) => falta[p.id] <= 0);
  const total = estacao.programas.reduce((soma, p) => soma + p.fatias, 0);
  const comando = (texto: string) => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: texto });
  // A memória: os pedaços de cada programa que ainda não terminou, um depois do outro.
  const blocos: (string | null)[] = [];
  for (const programa of estacao.programas) for (let i = 0; i < programa.memoria; i += 1) blocos.push(falta[programa.id] > 0 ? programa.id : null);
  while (blocos.length < estacao.memoriaTotal) blocos.push(null);
  return (
    <div className="flex flex-col gap-2" data-estacao-sistema={estacao.id}>
      <NucleoDaEstacao tipo="sistema" className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {estacao.programas.map((programa) => {
          const feitas = programa.fatias - falta[programa.id];
          const terminou = falta[programa.id] <= 0;
          const engasgando = engasgo?.programa === programa.id;
          return (
            <motion.button
              key={programa.id}
              type="button"
              disabled={terminou}
              onClick={() => comando(`vez:${programa.id}`)}
              animate={engasgando && !reduzir ? { x: [0, -3, 3, -2, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col gap-1 rounded-2xl border-2 bg-superficie p-2 text-left disabled:opacity-70 ${terminou ? "border-sucesso" : "border-borda hover:bg-hover"} ${destaque?.peca === programa.id ? "animate-pulse ring-4 ring-destaque" : ""}`}
              style={{ borderLeftColor: corDe(programa.id), borderLeftWidth: 8 }}
              data-comando={`vez:${programa.id}`}
              data-terminou={terminou ? "sim" : "nao"}
              aria-label={`Dar a vez para ${programa.nome}: ${feitas} de ${programa.fatias} fatias${terminou ? ", terminou" : ""}`}
            >
              <span className="flex items-center gap-1.5 text-sm font-black text-texto">
                <FiguraPrograma figura={programa.figura} />
                {programa.nome}
                {terminou && <IconeCerto tamanho={14} />}
              </span>
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: programa.fatias }, (_, i) => (
                  <span key={i} className="h-2 flex-1 rounded-full" style={{ background: i < feitas ? corDe(programa.id) : "var(--cor-painel)" }} />
                ))}
              </span>
              <span className="text-[11px] font-bold text-texto-suave">
                {terminou ? "terminou" : `falta ${falta[programa.id]} fatia(s)`}
                {programa.ritmo ? ` · tem pressa: no máximo ${programa.ritmo} fatias sem a vez` : ""}
              </span>
            </motion.button>
          );
        })}
      </NucleoDaEstacao>
      {/* A faixa do tempo. */}
      <section className="flex flex-col gap-1" aria-label="As fatias de tempo">
        <p className="text-xs font-black uppercase tracking-wide text-texto-suave">O tempo do processador ({estado.fatias.length} de {total} fatias)</p>
        <ol className="flex flex-wrap gap-0.5" data-faixa-tempo>
          {Array.from({ length: total }, (_, i) => {
            const id = estado.fatias[i];
            const programa = estacao.programas.find((p) => p.id === id);
            return (
              <motion.li
                key={i}
                initial={reduzir || !id ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: estado.automatico && !reduzir ? Math.max(0, i - (estado.fatias.length - 8)) * 0.08 : 0 }}
                className={`relative flex h-8 w-8 items-center justify-center rounded-md border-2 ${id ? "border-transparent text-[var(--cor-texto)]" : "border-dashed border-borda"}`}
                style={id ? { background: corDe(id) } : undefined}
                title={programa?.nome}
                data-fatia={i}
                data-programa={id ?? ""}
              >
                {programa && <FiguraPrograma figura={programa.figura} />}
                {engasgo?.fatia === i && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-erro px-1 text-[9px] font-black text-[var(--cor-texto-sobre-destaque)]" aria-label="engasgou aqui">
                    !
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>
      </section>
      {/* A memória. */}
      <section className="flex flex-col gap-1" aria-label="A memória">
        <p className="text-xs font-black uppercase tracking-wide text-texto-suave">A memória ({estacao.memoriaTotal} pedaços)</p>
        <div className="flex gap-0.5" data-barra-memoria>
          {blocos.map((id, i) => (
            <span key={i} className="h-5 flex-1 rounded border border-borda transition-colors" style={{ background: id ? corDe(id) : "var(--cor-superficie)" }} title={id ? (estacao.programas.find((p) => p.id === id)?.nome ?? "") : "livre"} />
          ))}
        </div>
      </section>
      <p className={`text-xs font-bold ${engasgo ? "text-erro" : "text-texto-suave"}`} aria-live="polite" data-aviso-sistema>
        {engasgo
          ? `${estacao.programas.find((p) => p.id === engasgo.programa)?.nome} engasgou: ficou tempo demais sem a vez. Recomece e dê a vez mais cedo.`
          : todos
            ? estado.automatico
              ? "O gerente terminou sozinho, em roda, sem deixar ninguém engasgar. No computador, isso acontece milhares de vezes por segundo."
              : "Todos terminaram, sem engasgo. Você foi o sistema operacional!"
            : `${toque ? "Toque" : "Clique"} num programa para dar a próxima fatia de tempo a ele.`}
      </p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={todos}
          onClick={() => comando("automatico")}
          className={`inline-flex min-h-10 items-center rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 disabled:opacity-40 pointer-coarse:min-h-11 ${destaque?.peca === "automatico" ? "animate-pulse ring-4 ring-destaque" : ""}`}
          data-comando="automatico"
        >
          Automático
        </button>
        <button type="button" onClick={() => comando("reiniciar")} className="inline-flex min-h-10 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto hover:bg-hover pointer-coarse:min-h-11" data-comando="reiniciar">
          Recomeçar
        </button>
      </div>
    </div>
  );
}
