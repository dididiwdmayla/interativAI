"use client";

/*
 * Mandar um pacote pelo caminho (sala 5): o oceano do próprio mapa do
 * jogo, com as ilhas, e os cabos que ligam os roteadores, inclusive os
 * submarinos, que descem até o fundo do mar. O aluno leva o pacote um pulo
 * de cada vez (os vizinhos piscam); um cabo partido não deixa passar. No
 * fim, o caminho inteiro fica aceso.
 */
import { motion, useReducedMotion } from "framer-motion";
import { caboEntre, type EstacaoPacote as DadosPacote, type EstadoPacote, type NoDoMapa, vizinhos } from "@/motor/exposicao/simulacoes/pacote";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

const X = (x: number) => 8 + x * 1.84;
const Y = (y: number) => 8 + y * 1.04;

function FiguraNo({ no }: { no: NoDoMapa }) {
  const x = X(no.x);
  const y = Y(no.y);
  switch (no.figura) {
    case "casa":
      return <path d={`M${x - 4.5} ${y + 3.5}v-4l4.5-4 4.5 4v4z`} fill="var(--cor-cena-fachada)" stroke="var(--cor-ante-contorno)" strokeWidth="0.8" />;
    case "servidor":
      return (
        <g>
          <rect x={x - 4} y={y - 5} width="8" height="10" rx="1" fill="var(--cor-superficie)" stroke="var(--cor-ante-contorno)" strokeWidth="0.8" />
          <path d={`M${x - 2.5} ${y - 2}h5M${x - 2.5} ${y + 1}h5`} stroke="var(--cor-ante-contorno)" strokeWidth="0.7" />
        </g>
      );
    case "estacao-cabo":
      return <rect x={x - 3.5} y={y - 3.5} width="7" height="7" rx="1.5" fill="var(--cor-ante-latao)" stroke="var(--cor-ante-contorno)" strokeWidth="0.8" />;
    default:
      return (
        <g>
          <circle cx={x} cy={y} r="3.6" fill="var(--cor-ante-globo)" stroke="var(--cor-ante-contorno)" strokeWidth="0.8" />
          <path d={`M${x - 2} ${y}h4M${x} ${y - 2}v4`} stroke="var(--cor-ante-branco)" strokeWidth="0.7" />
        </g>
      );
  }
}

export function EstacaoPacote({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosPacote, EstadoPacote>) {
  const reduzir = useReducedMotion();
  const porId = new Map(estacao.nos.map((n) => [n.id, n]));
  const aqui = porId.get(estado.caminho[estado.caminho.length - 1]);
  const proximos = estado.entregue ? [] : vizinhos(estacao, estado);
  const noCaminho = (a: string, b: string) => estado.caminho.some((id, i) => i > 0 && ((estado.caminho[i - 1] === a && id === b) || (estado.caminho[i - 1] === b && id === a)));
  const comando = (texto: string) => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: texto });
  const submarinos = estado.caminho.filter((id, i) => i > 0 && caboEntre(estacao, estado.caminho[i - 1], id)?.submarino).length;
  return (
    <div className="flex flex-col gap-2" data-estacao-pacote={estacao.id} data-entregue={estado.entregue ? "sim" : "nao"}>
      <NucleoDaEstacao tipo="pacote">
        <svg viewBox="0 0 200 120" className="h-auto w-full rounded-2xl border-2 border-borda" role="group" aria-label="O mapa: as ilhas, os roteadores e os cabos" data-mapa-cabos>
          <defs>
            <pattern id={`ondas-${estacao.id}`} width="16" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 4q4-3 8 0t8 0" fill="none" stroke="var(--cor-onda)" strokeWidth="0.6" />
            </pattern>
            <linearGradient id={`fundo-${estacao.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--cor-mar)" />
              <stop offset="1" stopColor="var(--cor-mar-fundo)" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="200" height="120" fill={`url(#fundo-${estacao.id})`} />
          <rect x="0" y="0" width="200" height="120" fill={`url(#ondas-${estacao.id})`} opacity="0.7" />
          {/* As ilhas do jogo. */}
          {estacao.ilhas.map((ilha) => {
            const x = X(ilha.x);
            const y = Y(ilha.y);
            const r = ilha.raio * 1.6;
            return (
              <g key={ilha.nome} aria-hidden="true" pointerEvents="none">
                <ellipse cx={x} cy={y + 1.5} rx={r + 2} ry={r * 0.62 + 2} fill="var(--cor-espuma)" opacity="0.6" />
                <ellipse cx={x} cy={y} rx={r + 1} ry={r * 0.62 + 1} fill="var(--cor-areia)" />
                <ellipse cx={x} cy={y - 0.8} rx={r} ry={r * 0.55} fill="var(--cor-grama)" />
                <text x={x} y={y + r * 0.62 + 6.5} textAnchor="middle" fontSize="4.2" fontWeight="900" fill="var(--cor-ante-branco)" stroke="var(--cor-ante-contorno)" strokeWidth="0.6" paintOrder="stroke">
                  {ilha.nome}
                </text>
              </g>
            );
          })}
          {/* Os cabos: os de terra retos; os submarinos descem até o fundo do mar. */}
          {estacao.cabos.map((cabo) => {
            const a = porId.get(cabo.de);
            const b = porId.get(cabo.para);
            if (!a || !b) return null;
            const [x1, y1, x2, y2] = [X(a.x), Y(a.y), X(b.x), Y(b.y)];
            const caminho = cabo.submarino ? `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(116, Math.max(y1, y2) + 28)} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`;
            const usado = noCaminho(cabo.de, cabo.para);
            return (
              <g key={`${cabo.de}-${cabo.para}`} pointerEvents="none" data-cabo-mapa={`${cabo.de}-${cabo.para}`} data-submarino={cabo.submarino ? "sim" : "nao"}>
                <path d={caminho} fill="none" stroke={cabo.partido ? "var(--cor-erro)" : usado ? "var(--cor-destaque)" : cabo.submarino ? "var(--cor-ante-contorno)" : "var(--cor-ante-madeira-sombra)"} strokeWidth={usado ? 1.6 : 1} strokeDasharray={cabo.partido ? "3 3" : cabo.submarino ? "1.5 1.2" : undefined} />
                {cabo.partido && (
                  <text x={(x1 + x2) / 2} y={cabo.submarino ? Math.min(110, Math.max(y1, y2) + 14) : (y1 + y2) / 2} textAnchor="middle" fontSize="5" fontWeight="900" fill="var(--cor-erro)">
                    partido
                  </text>
                )}
              </g>
            );
          })}
          {/* Os pontos (roteadores, a casa, o servidor): só o desenho. */}
          {estacao.nos.map((no) => {
            const pode = proximos.includes(no.id);
            return (
              <g key={no.id} pointerEvents="none" data-ponto-mapa={no.id} data-pode={pode ? "sim" : "nao"}>
                {pode && !reduzir && (
                  <motion.circle cx={X(no.x)} cy={Y(no.y)} r="6" fill="none" stroke="var(--cor-destaque)" strokeWidth="1" animate={{ r: [5, 8, 5], opacity: [0.9, 0.2, 0.9] }} transition={{ duration: 1.4, repeat: Infinity }} />
                )}
                {(pode && reduzir) || destaque?.peca === no.id ? <circle cx={X(no.x)} cy={Y(no.y)} r="6.5" fill="none" stroke="var(--cor-destaque)" strokeWidth="1.2" /> : null}
                <FiguraNo no={no} />
                <text x={X(no.x)} y={Y(no.y) - 6} textAnchor="middle" fontSize="3.6" fontWeight="800" fill="var(--cor-ante-branco)" stroke="var(--cor-ante-contorno)" strokeWidth="0.5" paintOrder="stroke">
                  {no.nome}
                </text>
              </g>
            );
          })}
          {/* As áreas de toque, numa camada por cima de todos os desenhos (maiores que o ponto). */}
          {estacao.nos.map((no) => {
            const pode = proximos.includes(no.id);
            const atual = aqui?.id === no.id;
            return (
              <circle
                key={`toque-${no.id}`}
                cx={X(no.x)}
                cy={Y(no.y)}
                r={toque ? 8 : 6}
                fill="transparent"
                role="button"
                tabIndex={pode ? 0 : -1}
                aria-disabled={!pode}
                aria-label={`${no.nome}${atual ? " (o pacote está aqui)" : pode ? ": mandar o pacote para cá" : ""}`}
                className={pode ? "cursor-pointer" : ""}
                onClick={() => pode && comando(`pular:${no.id}`)}
                onKeyDown={(evento) => {
                  if (pode && (evento.key === "Enter" || evento.key === " ")) {
                    evento.preventDefault();
                    comando(`pular:${no.id}`);
                  }
                }}
                data-comando={`pular:${no.id}`}
              />
            );
          })}
          {/* O pacote. */}
          {aqui && (
            <motion.g initial={false} animate={{ x: X(aqui.x), y: Y(aqui.y) + 7 }} transition={reduzir ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 12 }} data-pacote-em={aqui.id} pointerEvents="none">
              <rect x="-4" y="-2.8" width="8" height="5.6" rx="0.8" fill={estado.entregue ? "var(--cor-sucesso)" : "var(--cor-destaque)"} stroke="var(--cor-ante-contorno)" strokeWidth="0.6" />
              <path d="M-4 -2.8 L0 0.4 L4 -2.8" fill="none" stroke="var(--cor-ante-contorno)" strokeWidth="0.6" />
            </motion.g>
          )}
        </svg>
      </NucleoDaEstacao>
      <p className={`text-xs font-bold ${estado.entregue ? "text-texto" : "text-texto-suave"}`} aria-live="polite" data-aviso-pacote>
        {estado.entregue
          ? `Entregue em ${estado.caminho.length - 1} pulos${submarinos ? `, ${submarinos} deles por baixo do oceano` : ""}. Na internet de verdade, os roteadores escolhem esse caminho sozinhos, em milésimos de segundo.`
          : `O pacote está em ${aqui?.nome}. ${toque ? "Toque" : "Clique"} num vizinho que pisca para mandar para lá.`}
      </p>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" disabled={estado.caminho.length < 2 || estado.entregue} onClick={() => comando("voltar")} className="inline-flex min-h-10 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto hover:bg-hover disabled:opacity-40 pointer-coarse:min-h-11" data-comando="voltar">
          Voltar um pulo
        </button>
        <button type="button" disabled={estado.caminho.length < 2} onClick={() => comando("recomecar")} className="inline-flex min-h-10 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto hover:bg-hover disabled:opacity-40 pointer-coarse:min-h-11" data-comando="recomecar">
          Recomeçar
        </button>
      </div>
    </div>
  );
}
