"use client";

/*
 * Estruturas e desempenho no palco (zonas Estruturas de dados e Algoritmos
 * essenciais): quais objetos estão abertos "como árvore", o contador de
 * passos da última execução e as medições do gráfico passos x tamanho (aba
 * Desempenho). Os eventos viuComoArvore e mediuDesempenho saem daqui.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { ArvoresDoPalco } from "@/componentes/palco/QuadroPalco";
import type { Fase } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import type { Barramento } from "@/motor/barramento";
import { ehArvore } from "@/motor/estruturas";
import type { MedicaoPassos } from "@/motor/executor/tipos";
import type { Programa } from "./usePrograma";

type Opcoes = {
  fase: Fase;
  barramento: Barramento;
  programa: Programa;
  aoUsar: (id: IdFerramenta) => void;
};

export function useEstruturas({ fase, barramento, programa, aoUsar }: Opcoes) {
  const comArvore = fase.programa !== undefined && fase.usaFerramentas.includes("arvore-palco");
  const comGrafico = fase.programa?.desempenho !== undefined && fase.usaFerramentas.includes("grafico-passos");
  const comContador = fase.programa !== undefined && fase.usaFerramentas.includes("contador-passos");
  const [abertas, setAbertas] = useState<ReadonlySet<string>>(() => new Set());
  const [medicoes, setMedicoes] = useState<MedicaoPassos[] | null>(null);
  const aoUsarAtual = useRef(aoUsar);
  useEffect(() => {
    aoUsarAtual.current = aoUsar;
  }, [aoUsar]);

  const abrirArvore = useCallback(
    (nome: string) => {
      setAbertas((atual) => new Set(atual).add(nome));
      aoUsarAtual.current("arvore-palco");
      barramento.emitir({ tipo: "viuComoArvore", nome });
    },
    [barramento],
  );

  const alternarArvore = useCallback(
    (nome: string) => {
      if (abertas.has(nome)) {
        setAbertas((atual) => {
          const nova = new Set(atual);
          nova.delete(nome);
          return nova;
        });
      } else abrirArvore(nome);
    },
    [abertas, abrirArvore],
  );

  /** (Ação do roteiro) Ver como árvore: só se a variável já guarda um objeto com filhos objetos. */
  const memoria = programa.ultimo?.memoriaFinal ?? null;
  const verComoArvore = useCallback(
    (nome: string) => {
      if (!ehArvore(memoria, nome)) return false;
      abrirArvore(nome);
      return true;
    },
    [abrirArvore, memoria],
  );

  const { medirDesempenho: medirNoExecutor } = programa;
  const medir = useCallback(() => {
    void medirNoExecutor().then((lista) => {
      if (!lista.length) return;
      setMedicoes(lista);
      aoUsarAtual.current("grafico-passos");
      barramento.emitir({ tipo: "mediuDesempenho", medicoes: lista });
    });
    return true;
  }, [barramento, medirNoExecutor]);

  const arvores: ArvoresDoPalco = comArvore ? { abertas, aoAlternar: alternarArvore } : null;
  return {
    comArvore,
    comGrafico,
    comContador,
    arvores,
    medicoes,
    medir,
    verComoArvore,
    /** O contador do palco (com a ferramenta): os passos da última execução, null antes de rodar. */
    // A abertura roda um código vazio (para a memória do preparo aparecer): não conta como execução.
    contador: comContador
      ? programa.ultimo?.codigo.trim()
        ? { passos: programa.ultimo.totalPassos, escondidos: programa.ultimo.passosEscondidos, porMetodo: programa.ultimo.escondidosPorMetodo }
        : { passos: null, escondidos: 0, porMetodo: {} }
      : null,
  };
}
