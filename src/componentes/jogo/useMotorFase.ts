"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { DestaqueArvore } from "@/componentes/painel/arvore/tipos";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import { atualizarProgresso } from "@/lib/armazemProgresso";
import { caminhoDoNo, noPeloCaminho } from "@/lib/dom";
import { criarDocumentoSolto } from "@/lib/documentoSiteAlvo";
import { linhasComTexto } from "@/lib/linhasCodigo";
import type { EstadoFaseSalvo } from "@/lib/progresso";
import type { Barramento } from "@/motor/barramento";
import { criarEstadoInicial, type EstadoMotor, falaDoObjetivo } from "@/motor/estadoMotor";
import type { EventoFase, OrigemSelecao } from "@/motor/eventos";
import {
  type AjudaLinha,
  type ContextoFase,
  type DegrauAjuda,
  ESTRELAS_MINIMAS,
  type Fala,
  type Fase,
} from "@/motor/tipos";

type Opcoes = {
  fase: Fase;
  salvo: EstadoFaseSalvo | undefined;
  barramento: Barramento;
  htmlAtual: string;
  editorRef: RefObject<ApiEditor | null>;
  obterDocumento: () => Document | null;
  selecionarCaminho: (caminho: number[], origem: OrigemSelecao) => void;
  editarTextoCaminho: (caminho: number[], texto: string) => void;
  substituirHtml: (html: string) => void;
  destacarNaArvore: (destaque: DestaqueArvore | null) => void;
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
  selecionarCaminho,
  editarTextoCaminho,
  substituirHtml,
  destacarNaArvore,
}: Opcoes) {
  const [estado, setEstado] = useState<EstadoMotor>(() => criarEstadoInicial(fase, salvo));
  const [pulsarInspecionar, setPulsarInspecionar] = useState(false);
  const [documentoInicial] = useState(() => criarDocumentoSolto(fase.headSiteAlvo, fase.bodyInicial));
  const eventosObjetivo = useRef<EventoFase[]>([]);
  const todosEventos = useRef<EventoFase[]>([]);
  const caminhoSelecionado = useRef<number[] | null>(null);
  const aplicandoSolucao = useRef(false);

  const total = fase.objetivos.length;
  const objetivo = estado.etapa === "objetivos" ? fase.objetivos[estado.objetivoAtual] : null;

  const limparAjudasVisuais = useCallback(() => {
    destacarNaArvore(null);
    editorRef.current?.destacarLinhas([]);
    setPulsarInspecionar(false);
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

  /** Roda a validação do objetivo ativo contra o documento vivo. */
  const verificar = useCallback(() => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null || aplicandoSolucao.current) return;
    const documento = obterDocumento();
    if (!documento?.body) return;
    const atual = fase.objetivos[estado.objetivoAtual];
    const caminho = caminhoSelecionado.current;
    let passou = false;
    try {
      passou = atual.validar({
        documento,
        selecionado: caminho ? noPeloCaminho(documento.body, caminho) : null,
        eventos: eventosObjetivo.current,
        todosEventos: todosEventos.current,
        inicial: documentoInicial,
      });
    } catch {
      passou = false;
    }
    if (passou) concluirObjetivo(estado.objetivoAtual);
  }, [estado.etapa, estado.pausa, estado.objetivoAtual, obterDocumento, fase, documentoInicial, concluirObjetivo]);

  const verificarAtual = useRef(verificar);
  useEffect(() => {
    verificarAtual.current = verificar;
  }, [verificar]);

  // Eventos do painel: registra e valida.
  useEffect(
    () =>
      barramento.assinar((evento) => {
        todosEventos.current.push(evento);
        eventosObjetivo.current.push(evento);
        if (evento.tipo === "selecionou" || evento.tipo === "inspecionou") {
          caminhoSelecionado.current = evento.caminho;
        }
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
            objetivoAtual: estado.concluidos,
            htmlAtual,
            estrelas: estado.estrelas,
            introducaoVista: estado.etapa !== "introducao",
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
        setEstado({ ...estado, etapa: "objetivos", indiceFala: 0, fala: falaDoObjetivo(fase, 0) });
      }
      return;
    }
    if (estado.etapa === "concluida" && estado.conclusaoAberta) {
      const proxima = Math.min(estado.indiceFala + 1, fase.conclusao.length);
      setEstado({
        ...estado,
        indiceFala: proxima,
        fala: proxima < fase.conclusao.length ? fase.conclusao[proxima] : fase.falaFinal,
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
      fala: falaDoObjetivo(fase, estado.concluidos),
    });
  };

  const aplicarLinha = (linha: AjudaLinha) => {
    if (linha.alvo === "arvore") {
      const documento = obterDocumento();
      const elemento = documento?.body.querySelector(linha.seletor);
      const caminho = documento && elemento ? caminhoDoNo(documento.body, elemento) : null;
      if (caminho) destacarNaArvore({ caminho, parte: linha.parte ?? "no" });
    } else if (linha.alvo === "editor") {
      const editor = editorRef.current;
      if (editor) editor.destacarLinhas(linhasComTexto(editor.obterTexto(), linha.buscarTexto));
    } else {
      setPulsarInspecionar(true);
    }
  };

  /** Botão "Me ajuda": sobe um degrau por clique. */
  const ajudar = () => {
    if (!objetivo || estado.pausa !== null) return;
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

  /** Degrau 4: aplica a solução, explica e cobra 1 estrela. */
  const confirmarSolucao = () => {
    const documento = obterDocumento();
    if (!objetivo || !documento?.body) return;
    const caminhoDe = (seletor: string) => {
      const elemento = documento.body.querySelector(seletor);
      return elemento ? caminhoDoNo(documento.body, elemento) : null;
    };
    const contexto: ContextoFase = {
      documento,
      selecionar(seletor, opcoes) {
        const caminho = caminhoDe(seletor);
        if (!caminho) return;
        selecionarCaminho(caminho, opcoes?.comoInspecao ? "inspecao" : "ajuda");
        if (opcoes?.comoInspecao) {
          const tag = seletor.toLowerCase();
          barramento.emitir({ tipo: "inspecionou", tag, caminho });
        }
      },
      editarTexto(seletor, texto) {
        const caminho = caminhoDe(seletor);
        if (caminho) editarTextoCaminho(caminho, texto);
      },
      editarCodigo(transformar) {
        const editor = editorRef.current;
        if (!editor) return;
        substituirHtml(transformar(editor.obterTexto()));
        barramento.emitir({ tipo: "editouCodigo" });
      },
    };

    aplicandoSolucao.current = true;
    try {
      objetivo.ajudas.solucao.aplicar(contexto);
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
    setEstado({ ...estado, conclusaoAberta: false, indiceFala: fase.conclusao.length, fala: fase.falaFinal });

  return {
    estado,
    objetivo,
    pulsarInspecionar,
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
