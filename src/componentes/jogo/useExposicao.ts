"use client";

/*
 * A exposição de uma fase do museu (área exposicao): o estado de cada
 * estação (a fonte única de verdade, como o circuito na bancada), a estação
 * aberta, o destaque do "onde olhar" e o mexer, que passa pelo modelo
 * (src/motor/exposicao/modelo.ts): as mesmas funções que as soluções e a
 * simulação dos testes usam.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { codigoDaLinguagem, programaDa } from "@/motor/exposicao/comparador";
import { caboEntre } from "@/motor/exposicao/simulacoes/pacote";
import { executarNaLinguagem } from "@/motor/linguagens/executor";
import { resumoDaLinguagem } from "@/motor/linguagens/sincrono";
import type { CargaPython, Linguagem, ResultadoLinguagem } from "@/motor/linguagens/tipos";
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
  tocarParte: "clique",
  ligarCartao: "encaixar-cartao",
  porNaOrdem: "encaixar-cartao",
  tirarDaOrdem: "fechar-painel",
  mexerNoCircuito: "plugar-cabo",
  comandoNaEstacao: "clique",
};

/** O coral cantando: a vez de cada linguagem, na ordem do comparador. */
export type CoralNoJogo = { estacao: string; linguagens: Linguagem[]; vez: number; terminou: boolean };

/** O que o comparador mostra além do estado: as saídas desta visita, a carga do Python e o coral. */
export type ExtrasComparador = {
  /** Por estação e linguagem: o último resultado, ou "rodando". */
  saidas: Record<string, Partial<Record<Linguagem, ResultadoLinguagem | "rodando">>>;
  cargaPython: CargaPython | null;
  coral: CoralNoJogo | null;
  fecharCoral: () => void;
};

/** O som de algumas ações depende da estação (o passo do processador, o pulo do pacote, a chave do painel). */
function somDaAcao(dados: modelo.DadosExposicao, antes: modelo.EstadoExposicao, acao: modelo.AcaoExposicao): IdEfeito | null {
  if (acao.tipo === "mexerNoCircuito" && acao.mudanca.tipo === "chave") return "acender-bit";
  if (acao.tipo !== "comandoNaEstacao") return null;
  const estacao = modelo.estacaoDo(dados, acao.estacao);
  if (estacao?.tipo === "processador") return "ciclo-processador";
  if (estacao?.tipo === "pacote" && acao.comando.startsWith("pular:")) {
    const estado = antes.estacoes[estacao.id];
    const aqui = estado?.tipo === "pacote" ? estado.caminho[estado.caminho.length - 1] : "";
    return caboEntre(estacao, aqui, acao.comando.slice(6))?.submarino ? "pacote-oceano" : "pacote-pulo";
  }
  return null;
}

/** Quanto cada antepassado canta no coral (com menos movimento, mais rápido). */
const VEZ_NO_CORAL_MS = 2600;

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

  const [saidas, setSaidas] = useState<ExtrasComparador["saidas"]>({});
  const [cargaPython, setCargaPython] = useState<CargaPython | null>(null);
  const [coral, setCoral] = useState<CoralNoJogo | null>(null);
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const guardarSaida = useCallback((estacao: string, linguagem: Linguagem, resultado: ResultadoLinguagem | "rodando") => {
    setSaidas((antes) => ({ ...antes, [estacao]: { ...antes[estacao], [linguagem]: resultado } }));
  }, []);

  /**
   * Aplica a ação no modelo: o estado novo, o evento, o uso da ferramenta
   * (o "Experimente" das apresentações) e o som (as soluções e os roteiros
   * também passam aqui, com som: é o computadorzinho mexendo na frente do
   * aluno).
   */
  const aplicar = useCallback(
    (acao: modelo.AcaoExposicao): boolean => {
      const agora = atual.current;
      if (!dados || !agora) return false;
      const novo = modelo.aplicarAcaoExposicao(dados, agora, acao);
      if (!novo) return false;
      atual.current = novo;
      setEstado(novo);
      const som = somDaAcao(dados, agora, acao) ?? SOM_DA_ACAO[acao.tipo];
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

  /** Roda uma linguagem de verdade (ou a simulada) e devolve o resultado, já com o evento executouCodigo. */
  const rodar = useCallback(
    async (estacaoId: string, linguagem: Linguagem): Promise<ResultadoLinguagem | null> => {
      const agora = atual.current;
      const estacao = dados ? modelo.estacaoDo(dados, estacaoId) : null;
      const estado = agora?.estacoes[estacaoId];
      if (!estacao || estacao.tipo !== "comparador" || estado?.tipo !== "comparador") return null;
      const programa = programaDa(estacao, linguagem);
      if (!programa) return null;
      guardarSaida(estacaoId, linguagem, "rodando");
      const resultado = await executarNaLinguagem(linguagem, codigoDaLinguagem(estacao, estado, linguagem), {
        saidaDeclarada: programa.saida,
        aoCarregar: (carga) => {
          if (montado.current) setCargaPython(carga);
        },
      });
      if (!montado.current) return null;
      guardarSaida(estacaoId, linguagem, resultado);
      barramento.emitir({ tipo: "executouCodigo", execucao: resumoDaLinguagem(resultado) });
      return resultado;
    },
    [barramento, dados, guardarSaida],
  );

  /**
   * Mexe numa estação. No comparador, Rodar e o coral são assíncronos (o
   * Python pode estar baixando): a ação vale na hora (devolve true), e o
   * modelo marca a linguagem como rodada quando a saída chega.
   */
  const mexer = useCallback(
    (acao: modelo.AcaoExposicao): boolean => {
      const agora = atual.current;
      if (!dados || !agora) return false;
      if (acao.tipo === "rodarLinguagem") {
        if (!modelo.aplicarAcaoExposicao(dados, agora, acao)) return false;
        if (atual.current?.aberta !== acao.estacao) abrir(acao.estacao);
        tocarEfeito("rodar-programa");
        void rodar(acao.estacao, acao.linguagem).then((resultado) => {
          if (resultado) aplicar(acao);
        });
        return true;
      }
      if (acao.tipo === "cantarCoral") {
        const estacao = modelo.estacaoDo(dados, acao.estacao);
        if (!estacao || estacao.tipo !== "comparador" || !modelo.aplicarAcaoExposicao(dados, agora, acao)) return false;
        const linguagens = estacao.programas.map((p) => p.linguagem);
        const pausa = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 900 : VEZ_NO_CORAL_MS;
        setCoral({ estacao: acao.estacao, linguagens, vez: 0, terminou: false });
        void (async () => {
          for (const [vez, linguagem] of linguagens.entries()) {
            if (!montado.current) return;
            setCoral((antes) => (antes ? { ...antes, vez } : antes));
            const [resultado] = await Promise.all([rodar(acao.estacao, linguagem), new Promise((fim) => setTimeout(fim, pausa))]);
            if (!resultado) return;
          }
          if (!montado.current) return;
          setCoral((antes) => (antes ? { ...antes, vez: linguagens.length, terminou: true } : antes));
          tocarEfeito("coral");
          aplicar(acao);
        })();
        return true;
      }
      return aplicar(acao);
    },
    [abrir, aplicar, dados, rodar],
  );


  const exposicaoAgora = useCallback(() => (dados && atual.current ? { dados, estado: atual.current } : null), [dados]);

  const fecharCoral = useCallback(() => setCoral((antes) => (antes?.terminou ? null : antes)), []);
  const extras: ExtrasComparador = { saidas, cargaPython, coral, fecharCoral };

  return { ativo: dados !== null, dados, estado, mexer, abrir, destaque, setDestaque, exposicaoAgora, extras };
}

export type ExposicaoNoJogo = ReturnType<typeof useExposicao>;
