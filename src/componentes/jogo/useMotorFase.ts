"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { DestaqueArvore } from "@/componentes/painel/arvore/tipos";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import type { AjudaLinha, FasePratica, ViaSelecao } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import { atualizarProgresso } from "@/lib/armazemProgresso";
import { alvoDoElemento } from "@/lib/caminhoElementos";
import { caminhoDoNo } from "@/lib/dom";
import { criarDocumentoSolto } from "@/lib/documentoSiteAlvo";
import { ESTADO_FASE_PADRAO, type EstadoFaseSalvo } from "@/lib/progresso";
import type { Barramento } from "@/motor/barramento";
import { criarEstadoInicial, type EstadoMotor, falaDoObjetivo, falaFinalDe } from "@/motor/estadoMotor";
import type { EventoFase } from "@/motor/eventos";
import { executarAcoes, type PainelDasAcoes } from "@/motor/executarAcao";
import { type DegrauAjuda, ESTRELAS_MINIMAS, type Fala } from "@/motor/tipos";
import { avaliarValidador, consultar } from "@/motor/validadores";

type Opcoes = {
  fase: FasePratica;
  salvo: EstadoFaseSalvo | undefined;
  barramento: Barramento;
  htmlAtual: string;
  editorRef: RefObject<ApiEditor | null>;
  obterDocumento: () => Document | null;
  /** Nó selecionado agora e por onde foi escolhido. */
  obterSelecao: () => { no: Node; via: ViaSelecao | null } | null;
  /** As mesmas funções que a interface usa: a solução passa por elas. */
  painel: PainelDasAcoes;
  destacarNaArvore: (destaque: DestaqueArvore | null) => void;
  /** Tela de toque: os enunciados usam "toque" em vez de "clique". */
  toque: boolean;
};

const ESPERA_VERIFICAR_MS = 700;

/**
 * Motor genérico de fases: introdução, objetivos em sequência, validação a
 * cada mudança, escada de ajuda, estrelas, conclusão e persistência.
 */
export function useMotorFase({
  fase,
  salvo,
  barramento,
  htmlAtual,
  editorRef,
  obterDocumento,
  obterSelecao,
  painel,
  destacarNaArvore,
  toque,
}: Opcoes) {
  const [estado, setEstado] = useState<EstadoMotor>(() => criarEstadoInicial(fase, salvo, toque));
  const [pulsarFerramenta, setPulsarFerramenta] = useState<IdFerramenta | null>(null);
  const [documentoInicial] = useState(() => criarDocumentoSolto(fase.siteAlvo.head, fase.siteAlvo.body));
  const eventosObjetivo = useRef<EventoFase[]>([]);
  const aplicandoSolucao = useRef(false);

  const total = fase.objetivos.length;
  const objetivo = estado.etapa === "objetivos" ? fase.objetivos[estado.objetivoAtual] : null;

  const limparAjudasVisuais = useCallback(() => {
    destacarNaArvore(null);
    editorRef.current?.destacarLinhas([]);
    setPulsarFerramenta(null);
  }, [destacarNaArvore, editorRef]);

  const concluirObjetivo = useCallback(
    (indice: number) => {
      setEstado((atual) => {
        if (atual.etapa !== "objetivos" || atual.objetivoAtual !== indice || atual.pausa !== null) {
          return atual;
        }
        return {
          ...atual,
          concluidos: indice + 1,
          pausa: "objetivoConcluido",
          confirmandoSolucao: false,
          fala: fase.objetivos[indice].falaAoConcluir,
          acertos: atual.acertos + 1,
        };
      });
      limparAjudasVisuais();
    },
    [fase, limparAjudasVisuais],
  );

  /** Roda o validador do objetivo ativo contra o documento vivo. */
  const verificar = useCallback(() => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null || aplicandoSolucao.current) return;
    const documento = obterDocumento();
    if (!documento?.body) return;
    const atual = fase.objetivos[estado.objetivoAtual];
    const passou = avaliarValidador(atual.validador, {
      documento,
      inicial: documentoInicial,
      selecao: obterSelecao(),
      eventos: eventosObjetivo.current,
    });
    if (passou) concluirObjetivo(estado.objetivoAtual);
  }, [
    estado.etapa,
    estado.pausa,
    estado.objetivoAtual,
    obterDocumento,
    obterSelecao,
    fase,
    documentoInicial,
    concluirObjetivo,
  ]);

  const verificarAtual = useRef(verificar);
  useEffect(() => {
    verificarAtual.current = verificar;
  }, [verificar]);

  // Eventos do painel: registra e valida.
  useEffect(
    () =>
      barramento.assinar((evento) => {
        eventosObjetivo.current.push(evento);
        if (evento.tipo !== "editouCodigo") verificarAtual.current();
      }),
    [barramento],
  );

  // Quando um objetivo fica ativo, confere logo se ele já está feito.
  useEffect(() => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null) return;
    const temporizador = setTimeout(() => verificarAtual.current(), ESPERA_VERIFICAR_MS);
    return () => clearTimeout(temporizador);
  }, [estado.etapa, estado.objetivoAtual, estado.pausa]);

  // Persistência: tudo o que precisa para retomar a fase.
  useEffect(() => {
    atualizarProgresso((progresso) => {
      const concluida = estado.etapa === "concluida";
      return {
        ...progresso,
        fasesEmAndamento: {
          ...progresso.fasesEmAndamento,
          [fase.id]: {
            ...ESTADO_FASE_PADRAO,
            objetivoAtual: estado.concluidos,
            htmlAtual,
            estrelas: estado.estrelas,
            introducaoVista: estado.etapa !== "introducao",
            metaVista: true,
          },
        },
        fasesConcluidas:
          concluida && !progresso.fasesConcluidas.includes(fase.id)
            ? [...progresso.fasesConcluidas, fase.id]
            : progresso.fasesConcluidas,
        estrelasPorFase: concluida
          ? {
              ...progresso.estrelasPorFase,
              [fase.id]: Math.max(progresso.estrelasPorFase[fase.id] ?? 0, estado.estrelas),
            }
          : progresso.estrelasPorFase,
      };
    });
  }, [fase.id, estado.etapa, estado.concluidos, estado.estrelas, htmlAtual]);

  /** Avança falas da introdução e da conclusão. */
  const avancarFala = () => {
    if (estado.etapa === "introducao") {
      const proxima = estado.indiceFala + 1;
      if (proxima < fase.introducao.length) {
        setEstado({ ...estado, indiceFala: proxima, fala: fase.introducao[proxima] });
      } else {
        eventosObjetivo.current = [];
        setEstado({ ...estado, etapa: "objetivos", indiceFala: 0, fala: falaDoObjetivo(fase, 0, toque) });
      }
      return;
    }
    if (estado.etapa === "concluida" && estado.conclusaoAberta) {
      const proxima = Math.min(estado.indiceFala + 1, fase.conclusao.length);
      setEstado({
        ...estado,
        indiceFala: proxima,
        fala: proxima < fase.conclusao.length ? fase.conclusao[proxima] : falaFinalDe(fase),
      });
    }
  };

  /** Sai da pausa depois de um objetivo: ativa o próximo ou conclui a fase. */
  const seguir = () => {
    if (estado.pausa === null) return;
    eventosObjetivo.current = [];
    if (estado.concluidos >= total) {
      setEstado({
        ...estado,
        etapa: "concluida",
        objetivoAtual: total,
        pausa: null,
        degrau: 0,
        indiceFala: 0,
        conclusaoAberta: true,
        fala: fase.conclusao[0],
      });
      return;
    }
    setEstado({
      ...estado,
      objetivoAtual: estado.concluidos,
      pausa: null,
      degrau: 0,
      confirmandoSolucao: false,
      fala: falaDoObjetivo(fase, estado.concluidos, toque),
    });
  };

  const aplicarLinha = (linha: AjudaLinha) => {
    const documento = obterDocumento();
    if (linha.alvo === "arvore") {
      const elemento = documento ? consultar(documento, linha.seletor)[0] : undefined;
      const caminho = documento && elemento ? caminhoDoNo(documento.body, elemento) : null;
      if (caminho) destacarNaArvore({ caminho, parte: linha.parte ?? "no" });
    } else if (linha.alvo === "editor") {
      const editor = editorRef.current;
      if (!editor || !documento?.body) return;
      const linhas = consultar(documento, linha.seletor).flatMap((elemento) => {
        const alvo = alvoDoElemento(documento.body, elemento);
        return alvo ? editor.linhasDoAlvo(alvo) : [];
      });
      editor.destacarLinhas(linhas);
    } else {
      setPulsarFerramenta(linha.ferramenta);
    }
  };

  /** Botão "Me ajuda": sobe um degrau por clique. */
  const ajudar = () => {
    if (!objetivo || estado.pausa !== null) return;
    if (objetivo.modo !== "guiado") return;
    const { ajudas } = objetivo;
    const proximo = Math.min(estado.degrau + 1, 4) as DegrauAjuda;
    if (proximo === 1) {
      setEstado({ ...estado, degrau: 1, fala: { texto: ajudas.pergunta, expressao: "curioso" } });
    } else if (proximo === 2) {
      setEstado({ ...estado, degrau: 2, fala: { texto: ajudas.dica, expressao: "pensativo" } });
    } else if (proximo === 3) {
      aplicarLinha(ajudas.linha);
      setEstado({ ...estado, degrau: 3, fala: { texto: ajudas.linha.fala, expressao: "apontando" } });
    } else {
      const gratis = estado.estrelas <= ESTRELAS_MINIMAS;
      setEstado({
        ...estado,
        confirmandoSolucao: true,
        fala: {
          texto: gratis
            ? "Você já está com a estrela mínima, então essa sai de graça. Quer ver a solução?"
            : "Isso custa 1 estrela. Quer ver a solução?",
          expressao: "pensativo",
        },
      });
    }
  };

  const cancelarSolucao = () => {
    if (!objetivo) return;
    setEstado({
      ...estado,
      confirmandoSolucao: false,
      fala: { texto: "Boa! Tenta mais um pouquinho, você consegue.", expressao: "feliz" },
    });
  };

  /** Degrau 4: aplica a solução pelas funções da interface, explica e cobra 1 estrela. */
  const confirmarSolucao = () => {
    if (!objetivo || objetivo.modo !== "guiado" || !obterDocumento()?.body) return;
    aplicandoSolucao.current = true;
    try {
      executarAcoes(objetivo.ajudas.solucao.acoes, painel);
    } catch {
      // Conteúdo quebrado é pego pelo npm run testar:conteudo; aqui o jogo segue.
    } finally {
      aplicandoSolucao.current = false;
    }
    limparAjudasVisuais();
    setEstado({
      ...estado,
      degrau: 4,
      confirmandoSolucao: false,
      concluidos: estado.objetivoAtual + 1,
      pausa: "solucao",
      estrelas: Math.max(ESTRELAS_MINIMAS, estado.estrelas - 1),
      fala: { texto: objetivo.ajudas.solucao.fala, expressao: "apontando" },
    });
  };

  /** Fala vinda de fora do roteiro (tutor, easter egg). */
  const falar = useCallback((fala: Fala) => {
    setEstado((atual) => ({ ...atual, fala }));
  }, []);

  const abrirConclusao = () => setEstado({ ...estado, conclusaoAberta: true });
  const fecharConclusao = () =>
    setEstado({ ...estado, conclusaoAberta: false, indiceFala: fase.conclusao.length, fala: falaFinalDe(fase) });

  return {
    estado,
    objetivo,
    pulsarFerramenta,
    verificar,
    avancarFala,
    seguir,
    ajudar,
    cancelarSolucao,
    confirmarSolucao,
    falar,
    abrirConclusao,
    fecharConclusao,
  };
}
