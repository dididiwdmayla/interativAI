"use client";

/*
 * O processador de brinquedo (sala 4): a memória com as ordens e os dados,
 * o contador (a próxima ordem), o acumulador e o ciclo buscar, entender,
 * executar. Cada Próximo passo anda uma etapa; a etapa de agora acende na
 * roda do ciclo e a frase diz o que aconteceu.
 */
import { motion, useReducedMotion } from "framer-motion";
import {
  bitsDaOrdem,
  ehOrdem,
  type EstacaoProcessador as DadosProcessador,
  type EstadoProcessador,
  type FaseDoCiclo,
  SENTIDO_DA_ORDEM,
} from "@/motor/exposicao/simulacoes/processador";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

const ETAPAS: { id: FaseDoCiclo; nome: string }[] = [
  { id: "buscar", nome: "Buscar" },
  { id: "entender", nome: "Entender" },
  { id: "executar", nome: "Executar" },
];

/** O que acabou de acontecer (a etapa de antes da atual). */
function frase(dados: DadosProcessador, estado: EstadoProcessador): string {
  if (estado.parado) return "PARA: o programa acabou. O processador fica esperando a próxima ordem.";
  const celula = estado.instrucao === null ? undefined : dados.memoria[estado.instrucao];
  if (estado.fase === "entender" && ehOrdem(celula)) return `Buscou a caixa ${estado.instrucao}: ${bitsDaOrdem(celula.ordem, celula.endereco)}. O contador já aponta a ${estado.contador}.`;
  if (estado.fase === "executar" && ehOrdem(celula)) return `Entendeu: ${celula.ordem} ${celula.ordem === "PARA" ? "" : celula.endereco} quer dizer "${SENTIDO_DA_ORDEM[celula.ordem].replace("{e}", String(celula.endereco))}".`;
  if (estado.ciclos > 0 && ehOrdem(celula)) return `Executou ${celula.ordem}${celula.ordem === "PARA" ? "" : ` ${celula.endereco}`}. Volta a buscar.`;
  return "O contador aponta a caixa 0. Próximo passo: buscar a primeira ordem.";
}

export function EstacaoProcessador({ estacao, estado, mexer, destaque }: PropsEstacao<DadosProcessador, EstadoProcessador>) {
  const reduzir = useReducedMotion();
  const comando = (texto: string) => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: texto });
  const botao = "inline-flex min-h-10 items-center rounded-full border-2 px-3 text-xs font-black disabled:opacity-40 pointer-coarse:min-h-11";
  return (
    <div className="flex flex-col gap-2" data-estacao-processador={estacao.id} data-fase-ciclo={estado.fase}>
      <div className="flex flex-col gap-2 lg:flex-row">
        {/* A CPU: a roda do ciclo e os registradores. */}
        <section className="flex flex-col items-center gap-2 rounded-2xl border-2 border-borda bg-painel p-2 lg:w-60" aria-label="O processador">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
              {ETAPAS.map((etapa, i) => {
                const a0 = (i * 120 - 90) * (Math.PI / 180);
                const a1 = ((i + 1) * 120 - 90 - 4) * (Math.PI / 180);
                const r = 54;
                const caminho = `M60 60 L${60 + r * Math.cos(a0)} ${60 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${60 + r * Math.cos(a1)} ${60 + r * Math.sin(a1)} Z`;
                const atual = !estado.parado && estado.fase === etapa.id;
                const meio = ((i * 120 + 60 - 90) * Math.PI) / 180;
                return (
                  <g key={etapa.id}>
                    <path d={caminho} fill={atual ? "var(--cor-secundaria)" : "var(--cor-superficie)"} stroke="var(--cor-borda)" strokeWidth="2" />
                    <text x={60 + 34 * Math.cos(meio)} y={60 + 34 * Math.sin(meio) + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill={atual ? "var(--cor-texto-sobre-secundaria)" : "var(--cor-texto)"}>
                      {etapa.nome}
                    </text>
                  </g>
                );
              })}
              <circle cx="60" cy="60" r="14" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="2" />
            </svg>
            <motion.div
              className="absolute left-1/2 top-1/2 h-1 w-12 origin-left rounded-full bg-[var(--cor-texto)]"
              initial={false}
              animate={{ rotate: ({ buscar: 0, entender: 120, executar: 240 } as const)[estado.fase] - 30 }}
              transition={reduzir ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 14 }}
              aria-hidden="true"
            />
          </div>
          <dl className="grid w-full grid-cols-2 gap-1 text-xs">
            <dt className="font-bold text-texto-suave">Contador</dt>
            <dd className="text-right font-codigo font-black text-texto" data-contador={estado.contador}>
              caixa {estado.contador}
            </dd>
            <dt className="font-bold text-texto-suave">Acumulador</dt>
            <dd className="text-right font-codigo font-black text-texto" data-acumulador={estado.acumulador ?? ""}>
              {estado.acumulador ?? "vazio"}
            </dd>
            <dt className="font-bold text-texto-suave">Ordens feitas</dt>
            <dd className="text-right font-codigo font-black text-texto">{estado.ciclos}</dd>
          </dl>
        </section>
        {/* A memória: as ordens (com os bits) e os dados. */}
        <section className="flex min-w-0 flex-1 flex-col gap-1.5" aria-label="A memória">
          <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-4">
            {estacao.memoria.map((celula, n) => {
              const apontada = !estado.parado && estado.contador === n && estado.fase === "buscar";
              const atual = estado.instrucao === n && estado.fase !== "buscar";
              const valor = estado.valores[n];
              return (
                <li
                  key={n}
                  className={`flex flex-col rounded-xl border-2 px-2 py-1 ${atual ? "border-secundaria bg-selecao" : apontada ? "border-primaria bg-superficie" : "border-borda bg-[var(--cor-caixa-preenchimento)]"} ${destaque?.peca === String(n) ? "animate-pulse ring-4 ring-destaque" : ""}`}
                  data-caixa-processador={n}
                  data-valor={ehOrdem(celula) ? "" : (valor ?? "")}
                >
                  <span className="flex items-center gap-1 font-codigo text-[10px] font-bold text-texto-suave">
                    #{n}
                    {apontada && <span className="rounded bg-primaria px-1 text-sobre-primaria">contador</span>}
                  </span>
                  {ehOrdem(celula) ? (
                    <>
                      <span className="font-codigo text-sm font-black text-texto">
                        {celula.ordem}
                        {celula.ordem === "PARA" ? "" : ` ${celula.endereco}`}
                      </span>
                      <span className="font-codigo text-[10px] text-texto-suave">{bitsDaOrdem(celula.ordem, celula.endereco)}</span>
                    </>
                  ) : (
                    <>
                      <span className="font-codigo text-sm font-black text-texto">{valor ?? " "}</span>
                      <span className="text-[10px] font-bold text-texto-suave">{celula.nome ?? "dado"}</span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <p className="min-h-10 rounded-xl bg-[var(--cor-terminal-fundo)] px-3 py-1.5 font-codigo text-xs text-[var(--cor-terminal-texto)]" aria-live="polite" data-frase-processador>
        {frase(estacao, estado)}
      </p>
      <NucleoDaEstacao tipo="processador" className="flex flex-wrap gap-1.5">
        <button type="button" disabled={estado.parado} onClick={() => comando("passo")} className={`${botao} border-primaria bg-primaria text-sobre-primaria hover:brightness-110 ${destaque?.peca === "passo" ? "animate-pulse ring-4 ring-destaque" : ""}`} data-comando="passo">
          Próximo passo
        </button>
        <button type="button" disabled={estado.parado} onClick={() => comando("ciclo")} className={`${botao} border-borda bg-superficie text-texto hover:bg-hover`} data-comando="ciclo">
          Terminar a ordem
        </button>
        <button type="button" disabled={estado.parado} onClick={() => comando("rodar")} className={`${botao} border-borda bg-superficie text-texto hover:bg-hover ${destaque?.peca === "rodar" ? "animate-pulse ring-4 ring-destaque" : ""}`} data-comando="rodar">
          Rodar até o fim
        </button>
        <button type="button" onClick={() => comando("reiniciar")} className={`${botao} border-borda bg-superficie text-texto hover:bg-hover`} data-comando="reiniciar">
          Recomeçar
        </button>
      </NucleoDaEstacao>
    </div>
  );
}
