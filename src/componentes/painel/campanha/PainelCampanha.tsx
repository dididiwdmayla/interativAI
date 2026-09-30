"use client";

import { motion } from "framer-motion";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeAviso } from "@/componentes/icones/IconeAviso";
import type { IdFerramenta } from "@/ferramentas/ids";
import { type DadosCampanha, emReais, type EstadoCampanha, type ResultadoCampanha } from "@/motor/campanha";

type Props = {
  dados: DadosCampanha;
  estado: EstadoCampanha;
  resultado: ResultadoCampanha | null;
  aoConfigurar: (mudanca: Partial<EstadoCampanha>) => void;
  aoAbrirCard: (id: IdFerramenta) => void;
};

const CONCORRENCIA = { baixa: "baixa", media: "média", alta: "alta" } as const;

function Numero({ rotulo, valor, passo, minimo, maximo, aoMudar, nome }: { rotulo: string; valor: number; passo: number; minimo: number; maximo: number; aoMudar: (valor: number) => void; nome: string }) {
  return (
    <label className="flex min-w-0 flex-col gap-0.5 text-xs font-bold text-texto-suave">
      {rotulo}
      <input
        type="number"
        inputMode="decimal"
        value={valor}
        step={passo}
        min={minimo}
        max={maximo}
        data-campo-campanha={nome}
        onChange={(evento) => {
          const numero = Number(evento.target.value.replace(",", "."));
          if (Number.isFinite(numero)) aoMudar(Math.min(maximo, Math.max(minimo, numero)));
        }}
        className="h-9 min-w-0 rounded-lg border-2 border-borda bg-superficie px-2 font-mono text-sm text-texto outline-none focus:border-primaria pointer-coarse:h-11"
      />
    </label>
  );
}

function Metrica({ rotulo, valor, nome }: { rotulo: string; valor: string; nome: string }) {
  return (
    <div className="rounded-xl bg-painel px-2 py-1.5" data-metrica={nome}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-texto-suave">{rotulo}</p>
      <p className="font-mono text-lg font-black text-texto" data-valor-metrica>
        {valor}
      </p>
    </div>
  );
}

/**
 * A aba Campanha (fase simulador-campanha, S5): orçamento, palavra-chave e
 * lance; o leilão com 3 ou 4 anunciantes (a posição sai de lance vezes
 * qualidade) e o dia simulado (cliques, clientes, custo por cliente). A
 * página de destino é o site-alvo: a nota dela muda a qualidade e a taxa
 * de conversão. Números fictícios, e o painel diz isso.
 */
export function PainelCampanha({ dados, estado, resultado, aoConfigurar, aoAbrirCard }: Props) {
  const maior = resultado ? Math.max(...resultado.leilao.map((item) => item.pontuacao), 1) : 1;
  return (
    <div className="flex h-full min-h-0 flex-col bg-superficie" data-painel-campanha>
      <p className="flex shrink-0 items-start gap-1.5 border-b-2 border-borda bg-painel px-3 py-2 text-xs font-bold leading-snug text-texto-suave" data-aviso-simulacao>
        <IconeAviso className="mt-0.5 shrink-0 text-alerta" />
        Simulação com números fictícios: mostra como as coisas se ligam, não quanto uma campanha de verdade custaria.
      </p>
      <AlvoFerramenta ids={["simulador-campanha"]} marcador="simulador-campanha" aoAbrirCard={aoAbrirCard} classeMarcador="right-1 top-1" className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
          <section className="grid grid-cols-1 gap-2 sm:grid-cols-3" data-configuracao-campanha>
            <Numero rotulo="Orçamento do dia (R$)" nome="orcamento" valor={estado.orcamento} passo={5} minimo={0} maximo={5000} aoMudar={(orcamento) => aoConfigurar({ orcamento })} />
            <label className="flex min-w-0 flex-col gap-0.5 text-xs font-bold text-texto-suave">
              Palavra-chave
              <select
                value={estado.palavra}
                data-campo-campanha="palavra"
                onChange={(evento) => aoConfigurar({ palavra: evento.target.value })}
                className="h-9 min-w-0 rounded-lg border-2 border-borda bg-superficie px-2 text-sm text-texto outline-none focus:border-primaria pointer-coarse:h-11"
              >
                {dados.palavras.map((palavra) => (
                  <option key={palavra.id} value={palavra.id}>
                    {palavra.texto}
                  </option>
                ))}
              </select>
            </label>
            <Numero rotulo="Lance por clique (R$)" nome="lance" valor={estado.lance} passo={0.1} minimo={0.1} maximo={50} aoMudar={(lance) => aoConfigurar({ lance })} />
          </section>
          <table className="w-full text-left text-xs" data-tabela-palavras>
            <thead className="text-texto-suave">
              <tr>
                <th className="py-1 font-bold">Palavra-chave</th>
                <th className="py-1 font-bold">Buscas por dia</th>
                <th className="py-1 font-bold">Concorrência</th>
                <th className="py-1 font-bold">Clique médio</th>
              </tr>
            </thead>
            <tbody>
              {dados.palavras.map((palavra) => (
                <tr key={palavra.id} className={palavra.id === estado.palavra ? "font-black text-texto" : "text-texto"}>
                  <td className="py-0.5">{palavra.texto}</td>
                  <td className="py-0.5 font-mono">{palavra.buscasPorDia}</td>
                  <td className="py-0.5">{CONCORRENCIA[palavra.concorrencia]}</td>
                  <td className="py-0.5 font-mono">{emReais(palavra.cpcMedio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {resultado && (
            <>
              <section className="rounded-2xl border-2 border-borda bg-fundo p-3" data-leilao>
                <h3 className="text-sm font-black text-texto">O leilão desta busca</h3>
                <p className="text-xs text-texto-suave">A posição sai de lance vezes qualidade, não só do lance.</p>
                <ol className="mt-2 flex flex-col gap-1.5">
                  {resultado.leilao.map((item) => (
                    <motion.li
                      key={item.nome}
                      layout
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      className={`rounded-xl border-2 px-2 py-1.5 text-xs ${item.jogador ? "border-primaria bg-superficie" : "border-borda bg-superficie"}`}
                      data-anunciante={item.jogador ? "jogador" : item.nome}
                      data-posicao={item.posicao}
                    >
                      <p className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <span className="font-black text-texto">
                          {item.posicao}. {item.nome}
                          {item.jogador ? " (você)" : ""}
                        </span>
                        <span className="font-mono text-texto-suave">
                          {emReais(item.lance)} x {item.qualidade.toFixed(1)} = {item.pontuacao.toFixed(2)}
                        </span>
                      </p>
                      <span className="mt-1 block h-2 rounded-full bg-painel" aria-hidden="true">
                        <motion.span
                          className={`block h-2 rounded-full ${item.jogador ? "bg-primaria" : "bg-texto-suave"}`}
                          initial={false}
                          animate={{ width: `${Math.max(4, (item.pontuacao / maior) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </section>
              <section className="rounded-2xl border-2 border-borda bg-fundo p-3" data-dia-simulado>
                <h3 className="text-sm font-black text-texto">O dia simulado</h3>
                <p className="text-xs text-texto-suave" data-nota-pagina={resultado.notaPagina}>
                  Página de destino: nota {resultado.notaPagina} de 100 (auditoria e busca), qualidade {resultado.qualidade.toFixed(1)} de 10,
                  conversão de {(resultado.taxaConversao * 100).toFixed(1)}%.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Metrica rotulo="Posição" nome="posicao" valor={`${resultado.posicao}º`} />
                  <Metrica rotulo="Cliques" nome="cliques" valor={String(resultado.cliques)} />
                  <Metrica rotulo="Clientes" nome="clientes" valor={String(resultado.clientes)} />
                  <Metrica rotulo="Custo por cliente" nome="custoPorCliente" valor={resultado.custoPorCliente === null ? "sem clientes" : emReais(resultado.custoPorCliente)} />
                </div>
                <p className="mt-2 text-xs text-texto-suave">
                  Gasto de {emReais(resultado.gasto)} a {emReais(resultado.custoPorClique)} por clique.
                  {resultado.limitadoPeloOrcamento ? " O orçamento acabou antes das buscas do dia." : ""}
                </p>
              </section>
            </>
          )}
        </div>
      </AlvoFerramenta>
    </div>
  );
}
