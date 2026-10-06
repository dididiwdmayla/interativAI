"use client";

/*
 * O circuito no museu (sala 4), em duas aparências do mesmo modelo:
 *
 * - "cabos": o painel do gigante de válvulas. As chaves, as caixas de
 *   válvulas e as lâmpadas já estão no painel; o aluno pluga os cabos
 *   (toca na tomada de saída e depois na de entrada). Tocar numa tomada de
 *   entrada com cabo tira o cabo. As válvulas acendem quando a caixa liga.
 * - "portoes": a bancada da Ilha Lógica, com a paleta (E, OU, NÃO).
 *
 * Embaixo, o mostrador: as chaves e as lâmpadas agora e, quando o circuito
 * tem as saídas soma e vaiUm, a conta em binário (1 + 1 = 10).
 */
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { BancadaCircuito } from "@/componentes/circuito/BancadaCircuito";
import { sinalizarUso } from "@/ferramentas/uso";
import { ALTURA_BANCADA, type Circuito, entradasDo, fioChave, idLivre, LARGURA_BANCADA, nomeDa, type Peca, saidasDo } from "@/motor/circuito/modelo";
import { type EstacaoCircuito, type EstadoCircuito, type MudancaCircuito, simulacaoDoCircuito } from "@/motor/exposicao/circuitoMuseu";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

/* ------------------------------------------------------------------ o painel de cabos */

const CHAVE = { largura: 76, altura: 54 };
const CAIXA = { largura: 128, altura: 76 };
const LAMPADA = { largura: 76, altura: 76 };

function tamanhoDa(peca: Peca) {
  return peca.tipo === "entrada" ? CHAVE : peca.tipo === "saida" ? LAMPADA : CAIXA;
}

function tomadaDeSaida(peca: Peca) {
  const t = tamanhoDa(peca);
  return { x: peca.x + t.largura, y: peca.y + t.altura / 2 };
}

function tomadaDeEntrada(peca: Peca, porta: number) {
  if (peca.tipo === "saida") return { x: peca.x, y: peca.y + LAMPADA.altura / 2 };
  return { x: peca.x, y: peca.y + (porta === 0 ? 22 : CAIXA.altura - 22) };
}

const CORES_DOS_CABOS = ["var(--cor-ante-cabo-a)", "var(--cor-ante-cabo-b)", "var(--cor-ante-cabo-c)"];

type PropsPainel = {
  estacao: EstacaoCircuito;
  circuito: Circuito;
  valores: Record<string, boolean>;
  fios: Record<string, boolean>;
  toque: boolean;
  destaque: string | null;
  aoLigar: (de: string, para: string, porta: number) => void;
  aoSoltar: (para: string, porta: number) => void;
  aoAlternar: (entrada: string) => void;
};

function PainelDeCabos({ estacao, circuito, valores, fios, toque, destaque, aoLigar, aoSoltar, aoAlternar }: PropsPainel) {
  const reduzir = useReducedMotion();
  const [puxando, setPuxando] = useState<string | null>(null);
  const porId = new Map(circuito.pecas.map((p) => [p.id, p]));
  const tomadaGrande = toque ? 13 : 10;
  return (
    <div className="flex flex-col gap-1">
      <svg
        viewBox={`0 0 ${LARGURA_BANCADA} ${ALTURA_BANCADA}`}
        className="h-auto max-h-[52vh] w-full rounded-2xl border-4 border-[var(--cor-ante-gabinete-sombra)] bg-[var(--cor-ante-gabinete)]"
        role="group"
        aria-label="O painel de cabos do gigante de válvulas"
        data-painel-cabos={estacao.id}
        data-puxando={puxando ?? ""}
      >
        {/* Os parafusos e a grade do painel de metal. */}
        <defs>
          <pattern id={`furos-${estacao.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.6" fill="var(--cor-ante-gabinete-sombra)" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={LARGURA_BANCADA} height={ALTURA_BANCADA} fill={`url(#furos-${estacao.id})`} opacity="0.6" />
        {[
          [12, 12],
          [LARGURA_BANCADA - 12, 12],
          [12, ALTURA_BANCADA - 12],
          [LARGURA_BANCADA - 12, ALTURA_BANCADA - 12],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="6" fill="var(--cor-ante-latao)" stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.5" />
            <path d={`M${x - 3.5} ${y}h7`} stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.5" />
          </g>
        ))}

        {/* As peças. */}
        {circuito.pecas.map((peca) => {
          const aceso = Boolean(valores[peca.id]);
          const pisca = destaque === peca.id;
          if (peca.tipo === "entrada") {
            return (
              <g
                key={peca.id}
                role="switch"
                aria-checked={Boolean(peca.ligada)}
                aria-label={`Chave ${peca.rotulo ?? nomeDa(peca)}: ${peca.ligada ? "ligada" : "desligada"}`}
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => aoAlternar(peca.id)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    aoAlternar(peca.id);
                  }
                }}
                data-chave={peca.id}
                data-ligada={peca.ligada ? "sim" : "nao"}
              >
                <rect x={peca.x} y={peca.y} width={CHAVE.largura} height={CHAVE.altura} rx="8" fill="var(--cor-ante-madeira)" stroke={pisca ? "var(--cor-destaque)" : "var(--cor-ante-madeira-sombra)"} strokeWidth={pisca ? 5 : 2.5} />
                <text x={peca.x + CHAVE.largura / 2} y={peca.y - 6} textAnchor="middle" fontSize="15" fontWeight="900" fill="var(--cor-ante-branco)">
                  {peca.rotulo ?? nomeDa(peca)}
                </text>
                {/* A alavanca da chave de faca. */}
                <circle cx={peca.x + 18} cy={peca.y + CHAVE.altura / 2} r="5" fill="var(--cor-ante-latao)" />
                <motion.line
                  x1={peca.x + 18}
                  y1={peca.y + CHAVE.altura / 2}
                  initial={false}
                  animate={{ x2: peca.ligada ? peca.x + 58 : peca.x + 34, y2: peca.ligada ? peca.y + CHAVE.altura / 2 : peca.y + 10 }}
                  transition={reduzir ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 18 }}
                  stroke="var(--cor-ante-latao-sombra)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <text x={peca.x + CHAVE.largura - 12} y={peca.y + CHAVE.altura - 8} textAnchor="end" fontSize="14" fontWeight="900" fontFamily="monospace" fill="var(--cor-ante-branco)">
                  {peca.ligada ? "1" : "0"}
                </text>
              </g>
            );
          }
          if (peca.tipo === "saida") {
            return (
              <g key={peca.id} data-lampada={peca.id} data-acesa={aceso ? "sim" : "nao"} aria-label={`Lâmpada ${peca.rotulo ?? nomeDa(peca)}: ${aceso ? "acesa" : "apagada"}`} role="img">
                <rect x={peca.x} y={peca.y} width={LAMPADA.largura} height={LAMPADA.altura} rx="10" fill="var(--cor-ante-gabinete-sombra)" stroke={pisca ? "var(--cor-destaque)" : "var(--cor-ante-contorno)"} strokeWidth={pisca ? 5 : 2} />
                {aceso && <circle cx={peca.x + LAMPADA.largura / 2} cy={peca.y + 34} r="30" fill="var(--cor-ante-valvula-brilho)" opacity="0.35" />}
                <circle cx={peca.x + LAMPADA.largura / 2} cy={peca.y + 34} r="20" fill={aceso ? "var(--cor-lampada-acesa)" : "var(--cor-ante-valvula-apagada)"} stroke="var(--cor-ante-contorno)" strokeWidth="2" />
                <text x={peca.x + LAMPADA.largura / 2} y={peca.y + 40} textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="monospace" fill="var(--cor-ante-contorno)">
                  {aceso ? "1" : "0"}
                </text>
                <text x={peca.x + LAMPADA.largura / 2} y={peca.y + LAMPADA.altura + 16} textAnchor="middle" fontSize="14" fontWeight="900" fill="var(--cor-ante-branco)">
                  {peca.rotulo ?? nomeDa(peca)}
                </text>
              </g>
            );
          }
          const legenda = estacao.legendas?.[peca.id] ?? "";
          return (
            <g key={peca.id} data-caixa-valvulas={peca.id} data-acesa={aceso ? "sim" : "nao"}>
              <rect x={peca.x} y={peca.y} width={CAIXA.largura} height={CAIXA.altura} rx="8" fill="var(--cor-ante-gabinete-sombra)" stroke={pisca ? "var(--cor-destaque)" : "var(--cor-ante-contorno)"} strokeWidth={pisca ? 5 : 2} />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={peca.x + 30 + i * 26} y={peca.y + 10} width="16" height="30" rx="8" fill="var(--cor-ante-valvula-vidro)" stroke="var(--cor-ante-contorno)" strokeWidth="1.5" />
                  <motion.rect
                    x={peca.x + 34 + i * 26}
                    y={peca.y + 18}
                    width="8"
                    height="16"
                    rx="4"
                    initial={false}
                    animate={{ opacity: aceso ? (reduzir ? 1 : [0.75, 1, 0.8]) : 0.15 }}
                    transition={aceso && !reduzir ? { duration: 1.2, repeat: Infinity, delay: i * 0.2 } : { duration: 0.2 }}
                    fill="var(--cor-ante-valvula-brilho)"
                  />
                </g>
              ))}
              <text x={peca.x + CAIXA.largura / 2} y={peca.y + 58} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="var(--cor-ante-branco)">
                {legenda}
              </text>
            </g>
          );
        })}

        {/* Os cabos, por cima das peças (caídos, como cabos de verdade). */}
        {circuito.fios.map((fio, i) => {
          const de = porId.get(fio.de);
          const para = porId.get(fio.para);
          if (!de || !para) return null;
          const a = tomadaDeSaida(de);
          const b = tomadaDeEntrada(para, fio.porta);
          const queda = 40 + Math.abs(b.x - a.x) * 0.12;
          const caminho = `M${a.x} ${a.y} C${a.x + 60} ${a.y + queda}, ${b.x - 60} ${b.y + queda}, ${b.x} ${b.y}`;
          const aceso = fios[fioChave(fio)];
          return (
            <g key={fioChave(fio)} data-cabo={fioChave(fio)} data-aceso={aceso ? "sim" : "nao"} pointerEvents="none">
              <path d={caminho} fill="none" stroke="var(--cor-ante-contorno)" strokeWidth="9" strokeLinecap="round" />
              <path d={caminho} fill="none" stroke={CORES_DOS_CABOS[i % CORES_DOS_CABOS.length]} strokeWidth="6" strokeLinecap="round" />
              {aceso && !reduzir && (
                <motion.path d={caminho} fill="none" stroke="var(--cor-ante-valvula-brilho)" strokeWidth="2.5" strokeDasharray="6 14" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -40 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
              )}
            </g>
          );
        })}

        {/* As tomadas (por cima de tudo, para tocar). */}
        {circuito.pecas.map((peca) => {
          const s = tomadaDeSaida(peca);
          const ativa = puxando === peca.id;
          const saida =
            peca.tipo === "saida" ? null : (
              <circle
                key={`${peca.id}-s`}
                cx={s.x}
                cy={s.y}
                r={tomadaGrande}
                role="button"
                aria-label={`Tomada de saída de ${peca.rotulo ?? estacao.legendas?.[peca.id] ?? peca.id}${ativa ? " (cabo na mão)" : ""}`}
                tabIndex={0}
                className="cursor-pointer"
                fill={ativa ? "var(--cor-destaque)" : "var(--cor-ante-latao)"}
                stroke="var(--cor-ante-contorno)"
                strokeWidth="2.5"
                onClick={() => {
                  sinalizarUso("painel-de-cabos");
                  setPuxando(ativa ? null : peca.id);
                }}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    setPuxando(ativa ? null : peca.id);
                  }
                }}
                data-tomada-saida={peca.id}
              />
            );
          const portas = peca.tipo === "entrada" ? 0 : peca.tipo === "saida" || peca.tipo === "nao" ? 1 : 2;
          const entradas = Array.from({ length: portas }, (_, porta) => {
            const e = tomadaDeEntrada(peca, porta);
            const ocupada = circuito.fios.some((f) => f.para === peca.id && f.porta === porta);
            const tocar = () => {
              if (puxando) {
                aoLigar(puxando, peca.id, porta);
                setPuxando(null);
              } else if (ocupada) aoSoltar(peca.id, porta);
            };
            return (
              <circle
                key={`${peca.id}-e${porta}`}
                cx={e.x}
                cy={e.y}
                r={tomadaGrande}
                role="button"
                tabIndex={0}
                aria-label={`Tomada de entrada ${porta + 1} de ${peca.rotulo ?? estacao.legendas?.[peca.id] ?? peca.id}${ocupada ? " (com cabo: tocar tira o cabo)" : ""}`}
                className={puxando || ocupada ? "cursor-pointer" : ""}
                fill={puxando ? "var(--cor-ante-valvula-brilho)" : "var(--cor-ante-contorno)"}
                stroke="var(--cor-ante-latao)"
                strokeWidth="2.5"
                onClick={tocar}
                onKeyDown={(evento) => {
                  if (evento.key !== "Enter" && evento.key !== " ") return;
                  evento.preventDefault();
                  tocar();
                }}
                data-tomada-entrada={`${peca.id}:${porta}`}
              />
            );
          });
          return (
            <g key={`${peca.id}-tomadas`}>
              {saida}
              {entradas}
            </g>
          );
        })}
      </svg>
      <p className={`text-xs ${puxando ? "font-bold text-primaria" : "text-texto-suave"}`} aria-live="polite">
        {puxando
          ? `Cabo na mão: agora ${toque ? "toque" : "clique"} numa tomada de entrada (as bolinhas da esquerda).`
          : `${toque ? "Toque" : "Clique"} numa tomada de saída (à direita de uma peça) para pegar um cabo.`}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ o mostrador */

function Mostrador({ circuito, valores }: { circuito: Circuito; valores: Record<string, boolean> }) {
  const entradas = entradasDo(circuito);
  const saidas = saidasDo(circuito);
  const porNome = new Map(saidas.map((s) => [nomeDa(s), s]));
  const soma = porNome.get("soma");
  const vaiUm = porNome.get("vaiUm");
  const bit = (ligado: boolean) => (ligado ? "1" : "0");
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-[var(--cor-terminal-fundo)] px-3 py-1.5 font-codigo text-sm text-[var(--cor-terminal-texto)]" aria-live="polite" data-mostrador-circuito>
      {soma && vaiUm && entradas.length === 2 ? (
        <span data-conta-binaria>
          {bit(Boolean(entradas[0].ligada))} + {bit(Boolean(entradas[1].ligada))} = {bit(Boolean(valores[vaiUm.id]))}
          {bit(Boolean(valores[soma.id]))}
          <span className="ml-2 text-xs opacity-80">
            (em decimal: {Number(Boolean(entradas[0].ligada)) + Number(Boolean(entradas[1].ligada))} = {Number(Boolean(valores[vaiUm.id])) * 2 + Number(Boolean(valores[soma.id]))})
          </span>
        </span>
      ) : (
        <>
          {entradas.map((p) => (
            <span key={p.id}>
              {p.rotulo ?? nomeDa(p)}: {bit(Boolean(p.ligada))}
            </span>
          ))}
          <span aria-hidden="true">|</span>
          {saidas.map((p) => (
            <span key={p.id}>
              {p.rotulo ?? nomeDa(p)}: {valores[p.id] ? "acesa" : "apagada"}
            </span>
          ))}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ a estação */

export function EstacaoCircuitoMuseu({ estacao, estado, mexer, toque, destaque }: PropsEstacao<EstacaoCircuito, EstadoCircuito>) {
  const { valores, fios } = simulacaoDoCircuito(estado);
  const circuito = estado.circuito;
  const mudar = (mudanca: MudancaCircuito) => mexer({ tipo: "mexerNoCircuito", estacao: estacao.id, mudanca });
  return (
    <div className="flex flex-col gap-2" data-estacao-circuito={estacao.id} data-aparencia={estacao.aparencia}>
      <NucleoDaEstacao tipo="circuito" className={estacao.aparencia === "portoes" ? "h-[min(56vh,26rem)] min-h-64 overflow-hidden rounded-2xl border-2 border-borda" : ""}>
        {estacao.aparencia === "cabos" ? (
          <PainelDeCabos
            estacao={estacao}
            circuito={circuito}
            valores={valores}
            fios={fios}
            toque={toque}
            destaque={destaque?.peca ?? null}
            aoLigar={(de, para, porta) => mudar({ tipo: "fio", de, para, porta })}
            aoSoltar={(para, porta) => mudar({ tipo: "soltar", para, porta })}
            aoAlternar={(entrada) => mudar({ tipo: "chave", entrada })}
          />
        ) : (
          <BancadaCircuito
            circuito={circuito}
            valores={valores}
            fios={fios}
            paleta={estacao.paleta}
            toque={toque}
            destaque={destaque?.peca ?? null}
            aoAdicionar={(portao) => mudar({ tipo: "portao", portao, id: idLivre(circuito, portao) })}
            aoLigar={(de, para, porta) => mudar({ tipo: "fio", de, para, porta })}
            aoAlternar={(entrada) => mudar({ tipo: "chave", entrada })}
            aoMover={(id, x, y) => mudar({ tipo: "mover", id, x, y })}
            aoApagarPeca={(id) => mudar({ tipo: "apagar", id })}
            aoApagarFio={(para, porta) => mudar({ tipo: "soltar", para, porta })}
          />
        )}
      </NucleoDaEstacao>
      <Mostrador circuito={circuito} valores={valores} />
    </div>
  );
}
