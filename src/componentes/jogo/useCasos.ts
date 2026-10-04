"use client";

/*
 * Os casos de teste do aluno (área testes de uma fase composta): a lista
 * (a fonte única de verdade, como o quadro no plano), escrever, mudar,
 * apagar e o "Rodar os casos", que roda o Snippet e chama a função com cada
 * caso. As mudanças passam pelo modelo (src/motor/casos/modelo.ts), as
 * mesmas funções que as soluções e a simulação dos testes usam.
 */
import { useCallback, useRef, useState } from "react";
import type { Fase } from "@/conteudo/tipos";
import { comecarPendencia } from "@/lib/pendencias";
import type { Barramento } from "@/motor/barramento";
import * as modelo from "@/motor/casos/modelo";
import { casosDaFase } from "@/motor/composicao";
import type { Programa } from "./usePrograma";

type Opcoes = {
  fase: Fase;
  barramento: Barramento;
  programa: Programa;
  /** O que foi salvo da última vez (null: começa com os exemplos da fase, se houver). */
  salvo: modelo.EstadoCasos | null;
  aoUsar?: (ferramenta: "casos-de-teste") => void;
};

export function useCasos({ fase, barramento, programa, salvo, aoUsar }: Opcoes) {
  const dados = casosDaFase(fase);
  const [estado, setEstado] = useState<modelo.EstadoCasos | null>(() => (dados ? (salvo ?? modelo.estadoInicialCasos(dados)) : null));
  /** O mesmo estado, lido na hora (as soluções fazem várias ações seguidas). */
  const atual = useRef(estado);
  const [rodando, setRodando] = useState(false);
  const { executarSnippetEsperando, testarFuncao } = programa;

  const trocar = useCallback(
    (novo: modelo.EstadoCasos) => {
      atual.current = novo;
      setEstado(novo);
      barramento.emitir({ tipo: "editouCasos", total: novo.casos.length });
    },
    [barramento],
  );

  const escrever = useCallback(
    (entrada: string, esperado: string): boolean => {
      const agora = atual.current;
      if (!agora) return false;
      const novo = modelo.adicionarCaso(agora, entrada, esperado);
      if (novo === agora) return false;
      aoUsar?.("casos-de-teste");
      trocar(novo);
      return true;
    },
    [aoUsar, trocar],
  );

  const editar = useCallback(
    (id: number, mudanca: Partial<Pick<modelo.CasoDoAluno, "entrada" | "esperado">>) => {
      const agora = atual.current;
      if (!agora) return;
      trocar(modelo.editarCaso(agora, id, mudanca));
    },
    [trocar],
  );

  const apagarPorId = useCallback(
    (id: number): boolean => {
      const agora = atual.current;
      if (!agora || !agora.casos.some((caso) => caso.id === id)) return false;
      trocar(modelo.apagarCaso(agora, id));
      return true;
    },
    [trocar],
  );

  const apagar = useCallback((indice: number): boolean => {
    const caso = atual.current?.casos[indice];
    return caso ? apagarPorId(caso.id) : false;
  }, [apagarPorId]);

  /** "Rodar os casos": roda o Snippet (a função de agora) e chama a função com cada caso que dá para ler. */
  const rodarAgora = useCallback(async () => {
    if (!dados || !atual.current) return;
    aoUsar?.("casos-de-teste");
    const encerrar = comecarPendencia();
    setRodando(true);
    try {
      const execucao = await executarSnippetEsperando(`Rodou ${programa.nomeSnippet} para os casos de teste`);
      const erro = execucao?.erro;
      const erroDoCodigo = erro ? `${erro.nome ? `${erro.nome}: ` : ""}${erro.mensagem}` : null;
      const agora = atual.current;
      if (!agora) return;
      const rodados = modelo.casosParaRodar(agora);
      const teste = erroDoCodigo || rodados.length === 0 ? null : await testarFuncao(dados.funcao, rodados.map((r) => r.caso));
      // Enquanto rodava, o aluno pode ter mexido num caso: vale a lista de agora (resultados pelo id).
      const depois = modelo.resultadosDaRodada(atual.current ?? agora, dados, rodados, teste, erroDoCodigo);
      atual.current = depois;
      setEstado(depois);
      barramento.emitir({ tipo: "rodouCasos", total: rodados.length, passaram: rodados.filter((r) => depois.resultados[r.id]?.passou).length });
    } finally {
      setRodando(false);
      encerrar();
    }
  }, [aoUsar, barramento, dados, executarSnippetEsperando, programa.nomeSnippet, testarFuncao]);

  const rodar = useCallback((): boolean => {
    if (!dados || !atual.current) return false;
    void rodarAgora();
    return true;
  }, [dados, rodarAgora]);

  const casosAgora = useCallback(() => (dados && atual.current ? { dados, estado: atual.current } : null), [dados]);

  return { ativo: dados !== null, dados, estado, rodando, escrever, editar, apagar, apagarPorId, rodar, casosAgora };
}

export type CasosDeTeste = ReturnType<typeof useCasos>;
