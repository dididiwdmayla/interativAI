"use client";

/*
 * A prévia da aba Rede (Network) do F12 (sala 5): Recarregar grava cada
 * arquivo que a página pediu, um depois do outro, com o status, o tipo, o
 * tamanho, o tempo e a cascata. Uma linha escolhida abre os detalhes. É a
 * porta da Ilha Rede e Servidor.
 */
import { motion, useReducedMotion } from "framer-motion";
import { type EstacaoAbaRede as DadosAbaRede, type EstadoAbaRede, linhasDaAba, textoDoStatus } from "@/motor/exposicao/simulacoes/abaRede";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

const NOME_DO_TIPO: Record<string, string> = { documento: "document", estilo: "stylesheet", script: "script", imagem: "png", fonte: "font", dados: "fetch" };

export function EstacaoAbaRede({ estacao, estado, mexer, destaque }: PropsEstacao<DadosAbaRede, EstadoAbaRede>) {
  const reduzir = useReducedMotion();
  const linhas = linhasDaAba(estacao, estado);
  const fimMs = Math.max(...estacao.requisicoes.map((r) => r.inicioMs + r.duracaoMs));
  const totalKb = estacao.requisicoes.reduce((soma, r) => soma + r.tamanhoKb, 0);
  const escolhida = estacao.requisicoes.find((r) => r.id === estado.escolhida);
  const comando = (texto: string) => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: texto });
  return (
    <div className="flex flex-col gap-2" data-estacao-aba-rede={estacao.id}>
      <NucleoDaEstacao tipo="aba-rede" className="flex flex-col overflow-hidden rounded-xl border-2 border-borda bg-superficie text-xs">
        {/* A barra da aba, como no F12. */}
        <div className="flex flex-wrap items-center gap-1.5 border-b-2 border-borda bg-painel px-2 py-1">
          <span className="font-black text-texto">Rede</span>
          <span className="text-texto-suave">(Network)</span>
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => comando("gravar")}
            className={`inline-flex min-h-8 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-2.5 font-black text-sobre-primaria hover:brightness-110 pointer-coarse:min-h-11 ${destaque?.peca === "gravar" ? "animate-pulse ring-4 ring-destaque" : ""}`}
            data-comando="gravar"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M10 6a4 4 0 1 1-1.2-2.8M10 1.5v2.5H7.5" />
            </svg>
            Recarregar ({estacao.pagina})
          </button>
        </div>
        {!estado.gravado ? (
          <p className="px-3 py-6 text-center text-sm font-bold text-texto-suave">A aba está aberta, mas vazia: ela só grava o que acontece depois. Recarregue a página.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse font-codigo text-[11px]" data-tabela-rede>
              <thead>
                <tr className="border-b-2 border-borda bg-painel text-left text-texto-suave">
                  <th className="px-2 py-1 font-bold">Nome</th>
                  <th className="px-2 py-1 font-bold">Status</th>
                  <th className="px-2 py-1 font-bold">Tipo</th>
                  <th className="px-2 py-1 text-right font-bold">Tamanho</th>
                  <th className="px-2 py-1 text-right font-bold">
                    <button
                      type="button"
                      onClick={() => comando(estado.ordem === "tempo" ? "ordenar:chegada" : "ordenar:tempo")}
                      className={`font-bold underline underline-offset-2 ${destaque?.peca === "ordenar" ? "animate-pulse rounded ring-4 ring-destaque" : ""}`}
                      data-comando={estado.ordem === "tempo" ? "ordenar:chegada" : "ordenar:tempo"}
                    >
                      Tempo{estado.ordem === "tempo" ? " (maior primeiro)" : ""}
                    </button>
                  </th>
                  <th className="w-1/3 px-2 py-1 font-bold">Cascata</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((r, i) => {
                  const ativa = estado.escolhida === r.id;
                  const ruim = r.status >= 400;
                  return (
                    <motion.tr
                      key={r.id}
                      initial={reduzir ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reduzir || estado.ordem === "tempo" ? 0 : (r.inicioMs / fimMs) * 1.2 }}
                      onClick={() => comando(`escolher:${r.id}`)}
                      className={`cursor-pointer border-b border-borda ${ativa ? "bg-selecao" : i % 2 ? "bg-painel" : ""} ${ruim ? "text-erro" : "text-texto"} hover:bg-hover ${destaque?.peca === r.id ? "animate-pulse" : ""}`}
                      data-comando={`escolher:${r.id}`}
                      data-requisicao={r.id}
                    >
                      <td className="px-2 py-1 font-bold">
                        <button type="button" className="text-left underline-offset-2 hover:underline pointer-coarse:min-h-8" tabIndex={0} aria-label={`Ver detalhes de ${r.nome}`}>
                          {r.nome}
                        </button>
                      </td>
                      <td className="px-2 py-1">{r.status}</td>
                      <td className="px-2 py-1">{NOME_DO_TIPO[r.tipo]}</td>
                      <td className="px-2 py-1 text-right">{r.tamanhoKb.toLocaleString("pt-BR")} kB</td>
                      <td className="px-2 py-1 text-right">{r.duracaoMs.toLocaleString("pt-BR")} ms</td>
                      <td className="px-2 py-1">
                        <div className="relative h-2.5 rounded bg-painel">
                          <motion.div
                            className={`absolute top-0 h-full rounded ${ruim ? "bg-erro" : r.tipo === "documento" ? "bg-primaria" : "bg-secundaria"}`}
                            style={{ left: `${(r.inicioMs / fimMs) * 100}%` }}
                            initial={reduzir ? false : { width: 0 }}
                            animate={{ width: `${Math.max(2, (r.duracaoMs / fimMs) * 100)}%` }}
                            transition={{ delay: reduzir ? 0 : (r.inicioMs / fimMs) * 1.2, duration: reduzir ? 0 : 0.5 }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            <p className="border-t-2 border-borda bg-painel px-2 py-1 font-codigo text-[11px] text-texto-suave">
              {estacao.requisicoes.length} requisições | {totalKb.toLocaleString("pt-BR")} kB transferidos | Terminou em {fimMs.toLocaleString("pt-BR")} ms
            </p>
          </div>
        )}
      </NucleoDaEstacao>
      {escolhida && (
        <section className="rounded-xl border-2 border-borda bg-superficie p-2 font-codigo text-[11px] text-texto" aria-label={`Detalhes de ${escolhida.nome}`} data-detalhes-requisicao={escolhida.id}>
          <p className="font-sans text-xs font-black">Cabeçalhos (Headers)</p>
          <p>
            URL: https://{estacao.pagina}/{escolhida.tipo === "documento" ? "" : escolhida.nome}
          </p>
          <p>Método: GET</p>
          <p className={escolhida.status >= 400 ? "text-erro" : ""}>
            Status: {escolhida.status} {textoDoStatus(escolhida.status)}
          </p>
          <p>
            Tempo: começou em {escolhida.inicioMs} ms e levou {escolhida.duracaoMs} ms
          </p>
        </section>
      )}
    </div>
  );
}
