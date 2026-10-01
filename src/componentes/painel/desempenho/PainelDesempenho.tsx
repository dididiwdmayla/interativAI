"use client";

/*
 * A aba Desempenho (zonas Algoritmos essenciais e Estruturas de dados): o
 * gráfico passos x tamanho. "Medir" roda cada função da fase com listas de
 * tamanhos diferentes e conta os passos (cada linha executada é um passo).
 * Um jeito linear vira uma reta deitada; um quadrático, uma curva que
 * dispara. Duas séries no máximo (as cores validadas para daltonismo em
 * tokens.css), legenda sempre, o valor final escrito ao lado da linha,
 * detalhe ao passar o dedo ou o mouse e a mesma coisa em tabela.
 */
import { useRef, useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeContadorPassos } from "@/componentes/icones/IconeContadorPassos";
import { IconeGraficoPassos } from "@/componentes/icones/IconeGraficoPassos";
import { useTamanho } from "@/componentes/mapa/useTamanho";
import type { IdFerramenta } from "@/ferramentas/ids";
import { type ConfigDesempenho, crescimento, LIMITE_DA_MEDICAO, textoDePassos } from "@/motor/desempenho";
import type { MedicaoPassos } from "@/motor/executor/tipos";

const CORES = ["var(--cor-grafico-1)", "var(--cor-grafico-2)"] as const;

const MARGEM = { esquerda: 52, direita: 64, cima: 28, baixo: 34 };

type Serie = { funcao: string; cor: string; pontos: MedicaoPassos[] };

type Props = {
  config: ConfigDesempenho;
  /** A última medição (null antes de medir). */
  medicoes: readonly MedicaoPassos[] | null;
  ocupado: boolean;
  aoMedir: () => void;
  aoAbrirCard: (id: IdFerramenta) => void;
};

/** Um teto redondo para o eixo dos passos (1, 2 ou 5 vezes uma potência de 10). */
function tetoRedondo(valor: number): number {
  if (valor <= 10) return 10;
  const potencia = 10 ** Math.floor(Math.log10(valor));
  const passo = [1, 2, 2.5, 5, 10].find((m) => m * potencia >= valor) ?? 10;
  return passo * potencia;
}

function textoDoPonto(ponto: MedicaoPassos): string {
  if (ponto.erro) return `erro: ${ponto.erro}`;
  if (ponto.passouDoLimite) return `passou de ${textoDePassos(LIMITE_DA_MEDICAO)} passos (travaria)`;
  return `${textoDePassos(ponto.passos)} passos`;
}

function Grafico({ series, tamanhos }: { series: Serie[]; tamanhos: number[] }) {
  const caixa = useRef<HTMLDivElement>(null);
  const { largura } = useTamanho(caixa);
  const [foco, setFoco] = useState<{ serie: number; ponto: number } | null>(null);
  const altura = largura < 420 ? 214 : 254;
  const larguraPlot = Math.max(0, largura - MARGEM.esquerda - MARGEM.direita);
  const alturaPlot = altura - MARGEM.cima - MARGEM.baixo;
  const maxTamanho = Math.max(...tamanhos, 1);
  const validos = series.flatMap((s) => s.pontos.filter((p) => !p.erro && !p.passouDoLimite).map((p) => p.passos));
  const travou = series.some((s) => s.pontos.some((p) => p.passouDoLimite));
  const teto = travou ? LIMITE_DA_MEDICAO : tetoRedondo(Math.max(...validos, 1));
  const x = (tamanho: number) => MARGEM.esquerda + (tamanho / maxTamanho) * larguraPlot;
  const y = (passos: number) => MARGEM.cima + alturaPlot - (Math.min(passos, teto) / teto) * alturaPlot;
  const marcasY = [0, 0.25, 0.5, 0.75, 1].map((f) => f * teto);
  const pontoDe = (p: MedicaoPassos) => (p.erro ? null : { cx: x(p.tamanho), cy: p.passouDoLimite ? y(teto) : y(p.passos) });

  // Os valores finais escritos ao lado da linha, sem um encostar no outro.
  const rotulosFinais = series
    .map((s, i) => {
      const ultimo = [...s.pontos].reverse().find((p) => !p.erro);
      const posicao = ultimo ? pontoDe(ultimo) : null;
      return ultimo && posicao ? { i, texto: ultimo.passouDoLimite ? "travaria" : textoDePassos(ultimo.passos), x: posicao.cx + 9, y: posicao.cy } : null;
    })
    .filter((r) => r !== null)
    .sort((a, b) => a.y - b.y);
  for (let k = 1; k < rotulosFinais.length; k += 1) {
    if (rotulosFinais[k].y - rotulosFinais[k - 1].y < 14) rotulosFinais[k].y = rotulosFinais[k - 1].y + 14;
  }

  const focado = foco ? series[foco.serie]?.pontos[foco.ponto] : undefined;
  const posFoco = focado ? pontoDe(focado) : null;

  return (
    <div ref={caixa} className="relative w-full" data-grafico-passos>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label="Gráfico de passos por tamanho da lista" onPointerLeave={() => setFoco(null)}>
          {marcasY.map((valor) => (
            <g key={valor}>
              <line x1={MARGEM.esquerda} x2={MARGEM.esquerda + larguraPlot} y1={y(valor)} y2={y(valor)} stroke="var(--cor-borda)" strokeWidth={1} opacity={valor === 0 ? 1 : 0.5} />
              <text x={MARGEM.esquerda - 6} y={y(valor) + 4} textAnchor="end" fontSize={11} fill="var(--cor-texto-suave)">
                {textoDePassos(valor)}
              </text>
            </g>
          ))}
          {tamanhos.map((tamanho) => (
            <text key={tamanho} x={x(tamanho)} y={MARGEM.cima + alturaPlot + 16} textAnchor="middle" fontSize={11} fill="var(--cor-texto-suave)">
              {tamanho.toLocaleString("pt-BR")}
            </text>
          ))}
          <text x={MARGEM.esquerda + larguraPlot / 2} y={altura - 3} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--cor-texto-suave)">
            itens na lista
          </text>
          <text x={4} y={11} fontSize={11} fontWeight={700} fill="var(--cor-texto-suave)">
            passos
          </text>
          {posFoco && <line x1={posFoco.cx} x2={posFoco.cx} y1={MARGEM.cima} y2={MARGEM.cima + alturaPlot} stroke="var(--cor-texto-suave)" strokeWidth={1} strokeDasharray="3 3" />}
          {series.map((serie) => {
            const pontos = serie.pontos.map(pontoDe).filter((p) => p !== null);
            return (
              <g key={serie.funcao} data-serie-grafico={serie.funcao}>
                <polyline points={pontos.map((p) => `${p.cx},${p.cy}`).join(" ")} fill="none" stroke={serie.cor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                {serie.pontos.map((ponto) => {
                  const p = pontoDe(ponto);
                  if (!p) return null;
                  return ponto.passouDoLimite ? (
                    <circle key={ponto.tamanho} cx={p.cx} cy={p.cy} r={5} fill="var(--cor-superficie)" stroke={serie.cor} strokeWidth={2} data-ponto-travou />
                  ) : (
                    <circle key={ponto.tamanho} cx={p.cx} cy={p.cy} r={4.5} fill={serie.cor} stroke="var(--cor-superficie)" strokeWidth={2} />
                  );
                })}
              </g>
            );
          })}
          {rotulosFinais.map((rotulo) => (
            <text key={rotulo.i} x={rotulo.x} y={rotulo.y + 4} fontSize={11} fontWeight={800} fill="var(--cor-texto)" data-rotulo-final={series[rotulo.i].funcao}>
              {rotulo.texto}
            </text>
          ))}
          {/* Alvos de toque maiores que os pontos: o detalhe de cada medição. */}
          {series.map((serie, i) =>
            serie.pontos.map((ponto, k) => {
              const p = pontoDe(ponto);
              if (!p) return null;
              return (
                <circle
                  key={`${serie.funcao}-${ponto.tamanho}`}
                  cx={p.cx}
                  cy={p.cy}
                  r={14}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${serie.funcao} com ${ponto.tamanho} itens: ${textoDoPonto(ponto)}`}
                  data-ponto-grafico={`${serie.funcao}:${ponto.tamanho}`}
                  onPointerEnter={() => setFoco({ serie: i, ponto: k })}
                  onClick={() => setFoco({ serie: i, ponto: k })}
                  onFocus={() => setFoco({ serie: i, ponto: k })}
                  onBlur={() => setFoco(null)}
                  className="cursor-pointer outline-none"
                />
              );
            }),
          )}
        </svg>
      )}
      {focado && posFoco && foco && (
        <div
          className="pointer-events-none absolute z-10 w-max max-w-[220px] rounded-lg border-2 border-borda bg-superficie px-2 py-1 text-xs text-texto shadow-[0_4px_0_var(--cor-sombra)]"
          style={{
            left: Math.min(Math.max(posFoco.cx - 70, 0), Math.max(0, largura - 220)),
            top: posFoco.cy > altura / 2 ? posFoco.cy - 58 : posFoco.cy + 14,
          }}
          data-detalhe-grafico
        >
          <span className="flex items-center gap-1.5 font-mono font-bold">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: series[foco.serie].cor }} />
            {series[foco.serie].funcao}
          </span>
          <span className="block">
            lista de {focado.tamanho.toLocaleString("pt-BR")}: <b>{textoDoPonto(focado)}</b>
          </span>
        </div>
      )}
    </div>
  );
}

function Tabela({ series, tamanhos }: { series: Serie[]; tamanhos: number[] }) {
  return (
    <table className="w-full border-collapse text-left text-xs text-texto" data-tabela-desempenho>
      <thead>
        <tr className="border-b-2 border-borda">
          <th className="py-1 pr-2 font-black">Itens</th>
          {series.map((serie) => (
            <th key={serie.funcao} className="py-1 pr-2 font-mono font-black">
              {serie.funcao}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tamanhos.map((tamanho) => (
          <tr key={tamanho} className="border-b border-borda">
            <td className="py-1 pr-2 font-bold">{tamanho.toLocaleString("pt-BR")}</td>
            {series.map((serie) => {
              const ponto = serie.pontos.find((p) => p.tamanho === tamanho);
              return (
                <td key={serie.funcao} className="py-1 pr-2">
                  {ponto ? textoDoPonto(ponto) : "-"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** "de 10 para 500 itens, os passos ficaram 50 vezes maiores". */
function frase(serie: Serie): string | null {
  const vezes = crescimento(serie.pontos);
  const validos = serie.pontos.filter((p) => !p.erro && p.passos > 0);
  if (vezes === null) return serie.pontos.some((p) => p.passouDoLimite) ? `${serie.funcao}: com a lista grande, passou do limite (travaria a página).` : null;
  const primeiro = validos[0];
  const ultimo = validos[validos.length - 1];
  const itens = ultimo.tamanho / primeiro.tamanho;
  const travou = serie.pontos.some((p) => p.passouDoLimite) ? " Na maior, passou do limite (travaria a página)." : "";
  return `${serie.funcao}: a lista ficou ${Math.round(itens).toLocaleString("pt-BR")} vezes maior e os passos, ${Math.round(vezes).toLocaleString("pt-BR")} vezes.${travou}`;
}

export function PainelDesempenho({ config, medicoes, ocupado, aoMedir, aoAbrirCard }: Props) {
  const [verTabela, setVerTabela] = useState(false);
  const series: Serie[] = config.funcoes.slice(0, CORES.length).map((funcao, i) => ({
    funcao: funcao.nome,
    cor: CORES[i],
    pontos: (medicoes ?? []).filter((m) => m.funcao === funcao.nome).sort((a, b) => a.tamanho - b.tamanho),
  }));
  const tamanhos = [...new Set((medicoes ?? []).map((m) => m.tamanho))].sort((a, b) => a - b);
  const erros = (medicoes ?? []).filter((m) => m.erro);

  return (
    <div className="flex h-full min-h-0 flex-col bg-superficie" data-painel-desempenho>
      <p className="flex shrink-0 items-start gap-1.5 border-b-2 border-borda bg-painel px-3 py-2 text-xs font-bold leading-snug text-texto-suave">
        <IconeGraficoPassos className="mt-0.5 shrink-0 text-primaria" tamanho={16} />
        Passos x tamanho: o jogo roda a sua função com listas de vários tamanhos e conta os passos (cada linha executada é um passo). A aba
        Desempenho do Chrome mede tempo; contar passos mostra o crescimento sem depender da velocidade do computador.
      </p>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        <AlvoFerramenta ids={["grafico-passos"]} marcador="grafico-passos" aoAbrirCard={aoAbrirCard} classeMarcador="right-1 top-1">
          <section className="flex flex-col gap-2 rounded-2xl border-2 border-borda bg-fundo p-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={aoMedir}
                disabled={ocupado}
                data-medir-desempenho
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border-2 border-borda bg-primaria px-3 text-sm font-black text-sobre-primaria shadow-[0_3px_0_var(--cor-sombra)] disabled:opacity-60 pointer-coarse:h-11"
              >
                <IconeGraficoPassos tamanho={16} />
                {medicoes ? "Medir de novo" : "Medir"}
              </button>
              {medicoes && (
                <button
                  type="button"
                  onClick={() => setVerTabela((v) => !v)}
                  aria-pressed={verTabela}
                  data-ver-tabela-desempenho
                  className="inline-flex h-9 items-center rounded-xl border-2 border-borda bg-superficie px-3 text-xs font-bold text-texto pointer-coarse:h-11"
                >
                  {verTabela ? "Ver gráfico" : "Ver tabela"}
                </button>
              )}
            </div>
            {/* A legenda: cada função com a cor da linha dela. */}
            <ul className="flex flex-wrap gap-x-4 gap-y-1" data-legenda-desempenho>
              {series.map((serie) => (
                <li key={serie.funcao} className="flex items-center gap-1.5 font-mono text-xs font-bold text-texto">
                  <svg width={22} height={10} aria-hidden="true">
                    <line x1={1} x2={21} y1={5} y2={5} stroke={serie.cor} strokeWidth={2} />
                    <circle cx={11} cy={5} r={4} fill={serie.cor} stroke="var(--cor-fundo)" strokeWidth={2} />
                  </svg>
                  {serie.funcao}
                </li>
              ))}
            </ul>
            {!medicoes ? (
              <p className="text-xs text-texto-suave" data-desempenho-vazio>
                Rode o Snippet (para as funções existirem) e toque em Medir.
              </p>
            ) : verTabela ? (
              <Tabela series={series} tamanhos={tamanhos} />
            ) : (
              <Grafico series={series} tamanhos={tamanhos} />
            )}
            {medicoes && (
              <ul className="flex flex-col gap-1 text-xs leading-snug text-texto" data-frases-desempenho>
                {series.map((serie) => {
                  const texto = frase(serie);
                  return texto ? <li key={serie.funcao}>{texto}</li> : null;
                })}
                {erros.length > 0 && <li className="font-bold text-erro">{`${erros[0].funcao}: ${erros[0].erro}`}</li>}
              </ul>
            )}
          </section>
        </AlvoFerramenta>
      </div>
    </div>
  );
}

/** O contador de passos do palco: quantos passos a última execução deu. */
export function ContadorPassos({ passos }: { passos: number | null }) {
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-2.5 py-0.5 text-xs font-bold text-texto" data-contador-passos={passos ?? ""}>
      <IconeContadorPassos tamanho={14} className="text-primaria" />
      {passos === null ? "Nenhum passo ainda" : `${textoDePassos(passos)} ${passos === 1 ? "passo" : "passos"}`}
    </p>
  );
}
