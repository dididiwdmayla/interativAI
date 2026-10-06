"use client";

/*
 * A exposição de uma fase do museu (área exposicao): o estado de cada
 * estação (a fonte única de verdade, como o circuito na bancada), a estação
 * aberta, o destaque do "onde olhar" e o mexer, que passa pelo modelo
 * (src/motor/exposicao/modelo.ts): as mesmas funções que as soluções e a
 * simulação dos testes usam.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import type { IdEfeito } from "@/audio/efeitos";
import type { Fase } from "@/conteudo/tipos";
import { sinalizarUso } from "@/ferramentas/uso";
import type { Barramento } from "@/motor/barramento";
import { exposicaoDaFase } from "@/motor/composicao";
import { FERRAMENTA_DA_ESTACAO } from "@/motor/exposicao/conferir";
import * as modelo from "@/motor/exposicao/modelo";

type Opcoes = {
  fase: Fase;
  barramento: Barramento;
  salvo: modelo.EstadoExposicao | null;
};

/** O som de cada ação feita pelo aluno. */
const SOM_DA_ACAO: Partial<Record<modelo.AcaoExposicao["tipo"], IdEfeito>> = {
  furarCartao: "furar-cartao",
  alternarBit: "acender-bit",
  descerCamada: "abrir-painel",
  escolherLinha: "clique",
  definirCor: "clique",
  porNaLinha: "encaixar-cartao",
  tirarDaLinha: "fechar-painel",
  pendurarPlaquinha: "encaixar-cartao",
  abrirEstacao: "clique",
};

export function useExposicao({ fase, barramento, salvo }: Opcoes) {
  const dados = exposicaoDaFase(fase);
  const [estado, setEstado] = useState<modelo.EstadoExposicao | null>(() => (dados ? modelo.estadoValidoExposicao(dados, salvo) : null));
  /** O mesmo estado, lido na hora (as soluções fazem várias ações seguidas). */
  const atual = useRef(estado);
  const [destaque, setDestaque] = useState<{ estacao: string; peca?: string } | null>(null);

  // Mudou de fase (o Rever do desafio abre outra fase no mesmo lugar): começa do estado salvo dela.
  useEffect(() => {
    atual.current = estado;
  }, [estado]);

  /**
   * Mexe numa estação: o estado novo, o evento, o uso da ferramenta (o
   * "Experimente" das apresentações) e o som. `silencioso`: sem som (as
   * soluções e os roteiros também passam aqui, com som: é o computadorzinho
   * mexendo na frente do aluno).
   */
  const mexer = useCallback(
    (acao: modelo.AcaoExposicao): boolean => {
      const agora = atual.current;
      if (!dados || !agora) return false;
      const novo = modelo.aplicarAcaoExposicao(dados, agora, acao);
      if (!novo) return false;
      atual.current = novo;
      setEstado(novo);
      const som = SOM_DA_ACAO[acao.tipo];
      if (som) tocarEfeito(som);
      if (acao.tipo !== "abrirEstacao") {
        const estacao = modelo.estacaoDo(dados, acao.estacao);
        if (estacao) sinalizarUso(FERRAMENTA_DA_ESTACAO[estacao.tipo]);
        barramento.emitir({ tipo: "mexeuNaExposicao", estacao: acao.estacao, acao: acao.tipo });
      }
      return true;
    },
    [barramento, dados],
  );

  /** Abre a estação sem som e sem contar como mexer (o objetivo novo mostra a estação dele). */
  const abrir = useCallback(
    (id: string) => {
      const agora = atual.current;
      if (!dados || !agora || agora.aberta === id) return;
      const novo = modelo.abrirEstacao(dados, agora, id);
      if (!novo) return;
      atual.current = novo;
      setEstado(novo);
    },
    [dados],
  );

  const exposicaoAgora = useCallback(() => (dados && atual.current ? { dados, estado: atual.current } : null), [dados]);

  return { ativo: dados !== null, dados, estado, mexer, abrir, destaque, setDestaque, exposicaoAgora };
}

export type ExposicaoNoJogo = ReturnType<typeof useExposicao>;
