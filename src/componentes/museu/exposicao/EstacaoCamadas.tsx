"use client";

/*
 * As camadas da máquina: o mesmo programa do que a gente escreve (em cima)
 * até a linguagem de máquina (embaixo). As camadas de baixo começam
 * fechadas; "Descer uma camada" traduz e abre a próxima. Tocar numa linha
 * acende o que ela vira nas camadas de baixo e de onde ela veio nas de cima.
 */
import { AnimatePresence, motion } from "framer-motion";
import { IconeCamadas } from "@/componentes/icones/IconeCamadas";
import { type EstacaoCamadas as DadosCamadas, type EstadoCamadas, linhasLigadas } from "@/motor/exposicao/modelo";
import type { PropsEstacao } from "./tipos";

export function EstacaoCamadas({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosCamadas, EstadoCamadas>) {
  const acesas = linhasLigadas(estacao, estado.escolhida);
  const podeDescer = estado.abertas < estacao.camadas.length;
  return (
    <div className="flex flex-col gap-2" data-estacao-camadas={estacao.id}>
      {estacao.camadas.map((camada, indice) => {
        const aberta = indice < estado.abertas;
        return (
          <section
            key={camada.id}
            className={`rounded-2xl border-2 px-3 py-2 ${aberta ? "border-borda bg-superficie" : "border-dashed border-borda bg-painel"}`}
            aria-label={`Camada ${indice + 1}: ${camada.nome}${aberta ? "" : " (fechada)"}`}
            data-camada={camada.id}
            data-aberta={aberta ? "sim" : "nao"}
          >
            <p className="text-xs font-black uppercase tracking-wide text-texto-suave">
              {indice + 1}. {camada.nome}
            </p>
            <AnimatePresence initial={false}>
              {aberta ? (
                <motion.div key="aberta" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.35 }}>
                  <p className="mb-1.5 text-xs font-bold text-texto-suave">{camada.legenda}</p>
                  <ul className="flex flex-col gap-1">
                    {camada.linhas.map((linha) => {
                      const acesa = acesas.has(linha.id);
                      const escolhida = estado.escolhida === linha.id;
                      const pisca = destaque?.peca === linha.id;
                      return (
                        <li key={linha.id}>
                          <button
                            type="button"
                            aria-pressed={escolhida}
                            onClick={() => mexer({ tipo: "escolherLinha", estacao: estacao.id, linha: linha.id })}
                            className={`w-full rounded-lg border-2 px-2 py-1 text-left text-sm leading-snug pointer-coarse:min-h-11 ${camada.codigo === false ? "font-bold" : "font-codigo"} ${
                              escolhida ? "border-primaria bg-selecao" : acesa ? "border-secundaria bg-selecao" : "border-transparent hover:bg-hover"
                            } ${pisca ? "animate-pulse ring-4 ring-destaque" : ""}`}
                            data-linha-camada={linha.id}
                            data-acesa={acesa ? "sim" : "nao"}
                          >
                            {linha.texto}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ) : (
                <p key="fechada" className="py-1 text-sm font-bold text-texto-suave">
                  Ainda não traduzida.
                </p>
              )}
            </AnimatePresence>
          </section>
        );
      })}
      {podeDescer && (
        <button
          type="button"
          onClick={() => mexer({ tipo: "descerCamada", estacao: estacao.id })}
          className={`inline-flex min-h-11 items-center justify-center gap-2 self-center rounded-full border-2 border-primaria bg-primaria px-4 text-sm font-black text-sobre-primaria hover:brightness-110 ${destaque?.peca === "descer" ? "animate-pulse ring-4 ring-destaque" : ""}`}
          data-descer-camada
        >
          <IconeCamadas tamanho={16} />
          Descer uma camada
        </button>
      )}
      {!podeDescer && <p className="text-center text-xs font-bold text-texto-suave">{toque ? "Toque" : "Clique"} numa linha para ver o que ela vira lá embaixo.</p>}
    </div>
  );
}
