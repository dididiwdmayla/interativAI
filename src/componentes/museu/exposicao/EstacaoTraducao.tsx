"use client";

/*
 * Compilar ou interpretar (sala 3), em duas pistas lado a lado. Na pista do
 * compilador, todas as linhas passam pelo tradutor ANTES, viram um
 * executável (um bloco de bits) e ele roda depressa; rodando de novo, nada
 * é traduzido. Na do intérprete, cada linha é traduzida e roda, uma de cada
 * vez, e rodando de novo tudo é traduzido outra vez. O placar conta as
 * traduções. Com menos movimento, a pista mostra direto o fim.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { EstacaoTraducao as DadosTraducao, EstadoTraducao } from "@/motor/exposicao/simulacoes/traducao";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

type Quadro = { linha: number | null; onde: "papel" | "tradutor" | "pronto" | "processador" };

/** A linha do tempo de uma pista, quadro a quadro. */
function quadrosDa(pista: "compilada" | "interpretada", modo: "traduzir" | "repetir", linhas: number): Quadro[] {
  const lista: Quadro[] = [];
  if (pista === "compilada") {
    if (modo === "traduzir") for (let i = 0; i < linhas; i += 1) lista.push({ linha: i, onde: "tradutor" });
    lista.push({ linha: null, onde: "pronto" });
    for (let i = 0; i < linhas; i += 1) lista.push({ linha: i, onde: "processador" });
  } else {
    for (let i = 0; i < linhas; i += 1) lista.push({ linha: i, onde: "tradutor" }, { linha: i, onde: "processador" });
  }
  lista.push({ linha: null, onde: "papel" });
  return lista;
}

/** O quadro de agora de uma pista: anda sozinho até o fim (a pista nasce de novo a cada comando, pela chave). */
function usePista(quadros: Quadro[] | null, ritmoMs: number, reduzir: boolean): Quadro | null {
  const [indice, setIndice] = useState(() => (quadros ? (reduzir ? quadros.length - 1 : 0) : -1));
  useEffect(() => {
    if (!quadros || reduzir) return;
    const relogio = setInterval(() => setIndice((antes) => Math.min(antes + 1, quadros.length - 1)), ritmoMs);
    return () => clearInterval(relogio);
  }, [quadros, reduzir, ritmoMs]);
  return quadros && indice >= 0 ? (quadros[indice] ?? null) : null;
}

function Pista({
  titulo,
  exemplo,
  programa,
  quadros,
  ritmoMs,
  traducoes,
  executavel,
  rotuloTradutor,
}: {
  titulo: string;
  exemplo: string;
  programa: string[];
  quadros: Quadro[] | null;
  ritmoMs: number;
  traducoes: number;
  /** (Compilador) O executável já existe. */
  executavel?: boolean;
  rotuloTradutor: string;
}) {
  const reduzir = useReducedMotion() ?? false;
  const quadro = usePista(quadros, ritmoMs, reduzir);
  const tradutorAceso = quadro?.onde === "tradutor";
  const processadorAceso = quadro?.onde === "processador";
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border-2 border-borda bg-superficie p-2" aria-label={titulo}>
      <header className="flex flex-wrap items-baseline gap-1.5">
        <h4 className="text-sm font-black text-texto">{titulo}</h4>
        <span className="text-[11px] font-bold text-texto-suave">como {exemplo}</span>
        <span className="flex-1" />
        <span className="rounded-full bg-painel px-2 py-0.5 text-[11px] font-black text-texto" data-placar-traducoes={traducoes}>
          traduções: {traducoes}
        </span>
      </header>
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
        {/* O programa no papel. */}
        <ol className="rounded-lg bg-codigo-fundo py-1 font-codigo text-[11px] leading-snug text-codigo-texto">
          {programa.map((linha, i) => (
            <li key={i} className={`whitespace-pre px-1.5 transition-colors ${quadro?.linha === i ? "bg-[var(--cor-codigo-destaque-linha)] font-black" : ""}`}>
              {linha}
            </li>
          ))}
        </ol>
        {/* O tradutor. */}
        <motion.div
          className={`flex h-14 w-16 flex-col items-center justify-center rounded-xl border-2 text-center text-[10px] font-black leading-tight ${tradutorAceso ? "border-secundaria bg-secundaria text-sobre-secundaria" : "border-borda bg-painel text-texto"}`}
          animate={tradutorAceso && !reduzir ? { rotate: [0, -3, 3, 0] } : { rotate: 0 }}
          transition={{ duration: 0.35 }}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="10" cy="10" r="3" />
            <path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.3 4.3l2.1 2.1M13.6 13.6l2.1 2.1M4.3 15.7l2.1-2.1M13.6 6.4l2.1-2.1" />
          </svg>
          {rotuloTradutor}
        </motion.div>
        {/* O processador (e o executável pronto, na pista do compilador). */}
        <div className="flex flex-col items-center gap-1">
          {executavel !== undefined && (
            <span
              className={`rounded-md px-1.5 py-0.5 font-codigo text-[9px] font-black ${executavel ? "bg-primaria text-sobre-primaria" : "bg-painel text-texto-suave"} ${quadro?.onde === "pronto" && !reduzir ? "animate-pulse" : ""}`}
              aria-label={executavel ? "Executável pronto" : "Sem executável"}
            >
              {executavel ? "0110 1001" : "----"}
            </span>
          )}
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 ${processadorAceso ? "border-[var(--cor-lampada-acesa)] bg-[var(--cor-lampada-acesa)]" : "border-borda bg-painel"}`} aria-label={processadorAceso ? "O processador está rodando" : "O processador"}>
            <svg viewBox="0 0 20 20" className="h-7 w-7 text-texto" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="5" y="5" width="10" height="10" rx="1.5" />
              <path d="M8 2v3M12 2v3M8 15v3M12 15v3M2 8h3M2 12h3M15 8h3M15 12h3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EstacaoTraducao({ estacao, estado, mexer, destaque }: PropsEstacao<DadosTraducao, EstadoTraducao>) {
  const linhas = estacao.programa.length;
  const chave = `${estado.ultimo}-${estado.traducoes.compilada}-${estado.traducoes.interpretada}`;
  const ultimo = estado.ultimo;
  const quadrosCompilada = useMemo(() => (ultimo === "compilar" ? quadrosDa("compilada", "traduzir", linhas) : ultimo === "repetir" ? quadrosDa("compilada", "repetir", linhas) : null), [linhas, ultimo]);
  const quadrosInterpretada = useMemo(() => (ultimo === "interpretar" || ultimo === "repetir" ? quadrosDa("interpretada", "traduzir", linhas) : null), [linhas, ultimo]);
  const podeRepetir = estado.vistos.includes("compilar") && estado.vistos.includes("interpretar");
  const botao = (comando: "compilar" | "interpretar" | "repetir", rotulo: string, ativo = true) => (
    <button
      key={comando}
      type="button"
      disabled={!ativo}
      onClick={() => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando })}
      className={`inline-flex min-h-10 items-center rounded-full border-2 px-4 text-sm font-black disabled:opacity-40 pointer-coarse:min-h-11 ${comando === "repetir" ? "border-borda bg-superficie text-texto hover:bg-hover" : "border-primaria bg-primaria text-sobre-primaria hover:brightness-110"} ${destaque?.peca === comando ? "animate-pulse ring-4 ring-destaque" : ""}`}
      data-comando={comando}
    >
      {rotulo}
    </button>
  );
  return (
    <div className="flex flex-col gap-2" data-estacao-traducao={estacao.id}>
      <NucleoDaEstacao tipo="traducao" className="flex flex-wrap gap-2">
        {botao("compilar", "Compilar")}
        {botao("interpretar", "Interpretar")}
        {botao("repetir", "Rodar de novo (os dois)", podeRepetir)}
      </NucleoDaEstacao>
      <div className="flex flex-col gap-2 md:flex-row">
        <Pista key={`c-${chave}`} titulo="Compilar" exemplo={estacao.exemplos.compilada} programa={estacao.programa} quadros={quadrosCompilada} ritmoMs={420} traducoes={estado.traducoes.compilada} executavel={estado.vistos.includes("compilar")} rotuloTradutor="Compilador" />
        <Pista key={`i-${chave}`} titulo="Interpretar" exemplo={estacao.exemplos.interpretada} programa={estacao.programa} quadros={quadrosInterpretada} ritmoMs={520} traducoes={estado.traducoes.interpretada} rotuloTradutor="Intérprete" />
      </div>
      <p className="text-xs font-bold text-texto-suave" aria-live="polite">
        {ultimo === "compilar"
          ? "O compilador traduziu tudo antes e entregou um programa pronto. Rodar ficou rápido."
          : ultimo === "interpretar"
            ? "O intérprete traduz uma linha e já roda; depois a próxima. Começa na hora, mas traduz enquanto roda."
            : ultimo === "repetir"
              ? "Rodando de novo: o executável já estava pronto, sem traduzir nada. O intérprete traduziu tudo outra vez."
              : "Escolha um caminho e acompanhe as linhas."}
      </p>
    </div>
  );
}
