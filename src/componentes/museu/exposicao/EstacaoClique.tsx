"use client";

/*
 * O caminho de um clique (sala 5): o diagrama de rede (o navegador, o
 * roteador de casa, os roteadores da internet, o DNS e o servidor), o
 * pacote andando etapa por etapa, a janela do navegador montando a página
 * (ou a tela de erro) e os cenários de quebra. Front e back aparecem onde
 * moram: o navegador e o servidor.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CENARIOS_DO_CLIQUE, type CenarioClique, type EstacaoClique as DadosClique, type EstadoClique, etapasDoCenario, type LugarDoPacote } from "@/motor/exposicao/simulacoes/clique";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

const ONDE: Record<LugarDoPacote, { x: number; y: number }> = {
  navegador: { x: 70, y: 150 },
  dns: { x: 300, y: 42 },
  roteadores: { x: 330, y: 150 },
  servidor: { x: 565, y: 150 },
};

const NOME_DO_CENARIO: Record<CenarioClique, string> = { normal: "Tudo certo", "dns-fora": "DNS fora do ar", "servidor-lento": "Servidor lento" };

function Diagrama({ estacao, estado }: { estacao: DadosClique; estado: EstadoClique }) {
  const reduzir = useReducedMotion();
  const etapas = etapasDoCenario(estado.cenario, estacao.site);
  const etapa = etapas[estado.etapa];
  const dnsFora = estado.cenario === "dns-fora";
  const lento = estado.cenario === "servidor-lento";
  const pacote = etapa ? ONDE[etapa.lugar] : null;
  const falhou = etapa?.id === "dns-falhou";
  const ativo = (lugar: LugarDoPacote) => etapa?.lugar === lugar;
  return (
    <svg viewBox="0 0 640 220" className="h-auto w-full rounded-2xl border-2 border-borda bg-painel" role="img" aria-label={`Diagrama da rede: ${etapa ? etapa.titulo : "antes do clique"}`} data-diagrama-rede>
      {/* Os cabos. */}
      <path d="M100 150 H190 M250 150 H290 M370 150 H530" stroke="var(--cor-ante-contorno)" strokeWidth="4" strokeDasharray="2 6" strokeLinecap="round" />
      <path d="M330 120 L305 72" stroke={dnsFora ? "var(--cor-erro)" : "var(--cor-ante-contorno)"} strokeWidth="4" strokeDasharray="2 6" strokeLinecap="round" />
      {/* O navegador (o front). */}
      <g>
        <rect x="30" y="118" width="80" height="54" rx="6" fill="var(--cor-superficie)" stroke={ativo("navegador") ? "var(--cor-secundaria)" : "var(--cor-borda)"} strokeWidth="3" />
        <rect x="22" y="172" width="96" height="8" rx="3" fill="var(--cor-borda)" />
        <text x="70" y="200" textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--cor-texto)">navegador</text>
        <text x="70" y="214" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--cor-texto-suave)">(o front)</text>
      </g>
      {/* O roteador de casa. */}
      <g>
        <rect x="190" y="136" width="60" height="28" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="3" />
        <path d="M205 136 v-14 M235 136 v-14" stroke="var(--cor-borda)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="210" cy="150" r="3" fill="var(--cor-sucesso)" />
        <circle cx="222" cy="150" r="3" fill="var(--cor-sucesso)" />
        <text x="220" y="185" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--cor-texto-suave)">roteador de casa</text>
      </g>
      {/* A internet: a nuvem de roteadores. */}
      <g>
        <ellipse cx="330" cy="150" rx="44" ry="30" fill="var(--cor-superficie)" stroke={ativo("roteadores") ? "var(--cor-secundaria)" : "var(--cor-borda)"} strokeWidth="3" />
        {[
          [312, 140],
          [340, 138],
          [326, 160],
          [352, 158],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="var(--cor-ante-globo)" />
        ))}
        <path d="M312 140 L340 138 L352 158 L326 160 Z" fill="none" stroke="var(--cor-ante-globo-terra)" strokeWidth="1.5" />
        <text x="330" y="200" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--cor-texto-suave)">roteadores da internet</text>
      </g>
      {/* O DNS: a lista telefônica da internet. */}
      <g opacity={dnsFora ? 0.5 : 1}>
        <rect x="270" y="18" width="62" height="44" rx="4" fill="var(--cor-ante-cartao)" stroke={ativo("dns") ? "var(--cor-secundaria)" : "var(--cor-ante-madeira)"} strokeWidth="3" />
        <path d="M282 30h38M282 39h30M282 48h34" stroke="var(--cor-ante-madeira)" strokeWidth="2" />
        <text x="346" y="36" fontSize="12" fontWeight="900" fill="var(--cor-texto)">DNS</text>
        <text x="346" y="51" fontSize="10" fontWeight="800" fill={dnsFora ? "var(--cor-erro)" : "var(--cor-texto-suave)"}>
          {dnsFora ? "fora do ar" : "nome > endereço"}
        </text>
      </g>
      {/* O servidor (o back). */}
      <g>
        <rect x="535" y="104" width="60" height="78" rx="6" fill="var(--cor-superficie)" stroke={ativo("servidor") ? "var(--cor-secundaria)" : "var(--cor-borda)"} strokeWidth="3" />
        {[118, 140, 162].map((y) => (
          <g key={y}>
            <rect x="543" y={y} width="44" height="14" rx="3" fill="var(--cor-painel)" />
            <circle cx="579" cy={y + 7} r="2.5" fill={lento && etapa?.id === "esperando" ? "var(--cor-alerta)" : "var(--cor-sucesso)"} />
          </g>
        ))}
        <text x="565" y="200" textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--cor-texto)">servidor</text>
        <text x="565" y="214" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--cor-texto-suave)">(o back)</text>
      </g>
      {/* O pacote. */}
      {pacote && (
        <motion.g initial={false} animate={{ x: pacote.x, y: pacote.y }} transition={reduzir ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 14 }} data-pacote-clique={etapa?.lugar}>
          <rect x="-15" y="-11" width="30" height="22" rx="3" fill={falhou ? "var(--cor-erro)" : "var(--cor-destaque)"} stroke="var(--cor-ante-contorno)" strokeWidth="2" />
          <path d={falhou ? "M-6 -5 L6 5 M6 -5 L-6 5" : "M-15 -11 L0 1 L15 -11"} stroke="var(--cor-ante-contorno)" strokeWidth="2" fill="none" />
          {etapa?.id === "esperando" && !reduzir && (
            <motion.circle r="16" fill="none" stroke="var(--cor-alerta)" strokeWidth="3" strokeDasharray="20 80" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          )}
        </motion.g>
      )}
    </svg>
  );
}

/** A janela do navegador: em branco, carregando, a página montada ou o erro. */
function JanelaDoNavegador({ estacao, estado, aoClicar, destaque }: { estacao: DadosClique; estado: EstadoClique; aoClicar: () => void; destaque: boolean }) {
  const reduzir = useReducedMotion();
  const etapas = etapasDoCenario(estado.cenario, estacao.site);
  const etapa = etapas[estado.etapa];
  const montada = etapa?.id === "pagina";
  const erro = etapa?.id === "dns-falhou";
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border-2 border-borda bg-superficie" data-janela-navegador>
      <div className="flex items-center gap-1.5 border-b-2 border-borda bg-painel px-2 py-1">
        <span className="h-2 w-2 rounded-full bg-erro" />
        <span className="h-2 w-2 rounded-full bg-alerta" />
        <span className="h-2 w-2 rounded-full bg-sucesso" />
        <span className="ml-1 min-w-0 flex-1 truncate rounded-full bg-superficie px-2 font-codigo text-[11px] text-texto">{estado.etapa >= 0 ? estacao.site : "busca"}</span>
        {estado.etapa >= 0 && !montada && !erro && <span className="h-3 w-3 animate-spin rounded-full border-2 border-primaria border-t-transparent motion-reduce:animate-none" aria-label="carregando" />}
      </div>
      <div className="flex min-h-28 flex-col gap-1 p-2">
        {estado.etapa < 0 ? (
          <>
            <p className="text-[11px] text-texto-suave">Resultado da busca:</p>
            <button type="button" onClick={aoClicar} className={`self-start text-sm font-black text-primaria underline underline-offset-2 ${destaque ? "animate-pulse rounded ring-4 ring-destaque" : ""}`} data-comando="clicar" data-link-clique>
              {estacao.site}
            </button>
          </>
        ) : erro ? (
          <div data-tela-erro>
            <p className="text-sm font-black text-texto">Não é possível acessar esse site</p>
            <p className="text-[11px] text-texto-suave">Não foi possível encontrar o endereço do servidor de {estacao.site}.</p>
          </div>
        ) : montada ? (
          <motion.div className="flex flex-col gap-1" data-pagina-montada>
            <motion.div initial={reduzir ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="rounded bg-[var(--cor-cena-toldo)] px-2 py-1 text-xs font-black text-[var(--cor-ante-branco)]">
              Padaria do Bairro
            </motion.div>
            <motion.div initial={reduzir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduzir ? 0 : 0.4 }} className="flex gap-1">
              {["Pão francês", "Bolo de fubá", "Café"].map((item) => (
                <span key={item} className="rounded border border-borda bg-painel px-1.5 text-[10px] font-bold text-texto">
                  {item}
                </span>
              ))}
            </motion.div>
            <motion.div initial={reduzir ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduzir ? 0 : 0.8 }} className="h-8 rounded bg-[var(--cor-cena-pao)]" aria-label="a foto do pão" />
          </motion.div>
        ) : (
          <p className="text-xs text-texto-suave">{etapa?.id === "esperando" ? "A página está em branco, esperando o servidor..." : "Esperando a resposta..."}</p>
        )}
      </div>
    </div>
  );
}

export function EstacaoClique({ estacao, estado, mexer, destaque }: PropsEstacao<DadosClique, EstadoClique>) {
  const [tocando, setTocando] = useState(false);
  const etapas = etapasDoCenario(estado.cenario, estacao.site);
  const etapa = etapas[estado.etapa];
  const fim = estado.etapa >= etapas.length - 1;
  const comando = (texto: string) => {
    setTocando(false);
    mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: texto });
  };
  // Tocar até o fim: avança sozinho, uma etapa a cada pouco (para no fim ou quando o aluno muda alguma coisa).
  const andando = tocando && !fim && estado.etapa >= 0;
  useEffect(() => {
    if (!andando) return;
    const relogio = setTimeout(() => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: "avancar" }), 1400);
    return () => clearTimeout(relogio);
  }, [andando, estado.etapa, estacao.id, mexer]);
  return (
    <div className="flex flex-col gap-2" data-estacao-clique={estacao.id} data-etapa-clique={etapa?.id ?? "antes"}>
      {estacao.cenarios.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Cenário">
          <span className="text-xs font-bold text-texto-suave">Cenário:</span>
          {CENARIOS_DO_CLIQUE.filter((c) => estacao.cenarios.includes(c)).map((cenario) => (
            <button
              key={cenario}
              type="button"
              role="radio"
              aria-checked={estado.cenario === cenario}
              onClick={() => comando(`cenario:${cenario}`)}
              className={`inline-flex min-h-9 items-center gap-1 rounded-full border-2 px-3 text-xs font-black pointer-coarse:min-h-11 ${estado.cenario === cenario ? "border-primaria bg-primaria text-sobre-primaria" : "border-borda bg-superficie text-texto hover:bg-hover"} ${destaque?.peca === `cenario:${cenario}` ? "animate-pulse ring-4 ring-destaque" : ""}`}
              data-comando={`cenario:${cenario}`}
            >
              {NOME_DO_CENARIO[cenario]}
              {estado.vistos.includes(cenario) && <span aria-label="já visto"> (visto)</span>}
            </button>
          ))}
        </div>
      )}
      <NucleoDaEstacao tipo="clique" className="flex flex-col gap-2 lg:flex-row">
        <div className="min-w-0 flex-[3]">
          <Diagrama estacao={estacao} estado={estado} />
        </div>
        <div className="min-w-0 flex-[2]">
          <JanelaDoNavegador estacao={estacao} estado={estado} aoClicar={() => comando("clicar")} destaque={destaque?.peca === "clicar"} />
        </div>
      </NucleoDaEstacao>
      <AnimatePresence mode="wait">
        <motion.div key={`${estado.cenario}-${estado.etapa}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="min-h-14 rounded-xl border-2 border-dashed border-borda bg-painel px-3 py-1.5" aria-live="polite">
          {etapa ? (
            <>
              <p className="text-xs font-black uppercase tracking-wide text-texto-suave">
                Etapa {estado.etapa + 1} de {etapas.length}: {etapa.titulo}
              </p>
              <p className="text-sm text-texto">{etapa.texto}</p>
            </>
          ) : (
            <p className="text-sm font-bold text-texto-suave">Clique no link do site para começar a viagem.</p>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={estado.etapa < 0 || fim}
          onClick={() => comando("avancar")}
          className={`inline-flex min-h-10 items-center rounded-full border-2 border-primaria bg-primaria px-4 text-xs font-black text-sobre-primaria hover:brightness-110 disabled:opacity-40 pointer-coarse:min-h-11 ${destaque?.peca === "avancar" ? "animate-pulse ring-4 ring-destaque" : ""}`}
          data-comando="avancar"
        >
          Próxima etapa
        </button>
        <button
          type="button"
          disabled={estado.etapa < 0 || fim || andando}
          onClick={() => setTocando(true)}
          className="inline-flex min-h-10 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto hover:bg-hover disabled:opacity-40 pointer-coarse:min-h-11"
          data-tocar-tudo
        >
          Tocar até o fim
        </button>
        {fim && (
          <button type="button" onClick={() => comando("clicar")} className="inline-flex min-h-10 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto hover:bg-hover pointer-coarse:min-h-11" data-clicar-de-novo>
            Clicar de novo
          </button>
        )}
      </div>
    </div>
  );
}
