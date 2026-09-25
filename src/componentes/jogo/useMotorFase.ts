"use client";

import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DestaqueArvore } from "@/componentes/painel/arvore/tipos";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import type { AjudaLinha, EventoRoteirizado, Fase, ViaSelecao } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import { atualizarProgresso } from "@/lib/armazemProgresso";
import { alvoDoElemento } from "@/lib/caminhoElementos";
import { caminhoDoNo } from "@/lib/dom";
import { criarDocumentoSolto } from "@/lib/documentoSiteAlvo";
import type { EstadoFaseSalvo } from "@/lib/progresso";
import type { Barramento } from "@/motor/barramento";
import {
  criarEstadoInicial,
  enunciadoDe,
  type EstadoMotor,
  estrelasDoDesafio,
  falaDeInicio,
  falaDoObjetivo,
  falaFinalDe,
  type ModoJogo,
} from "@/motor/estadoMotor";
import type { EventoFase } from "@/motor/eventos";
import { executarAcoes, type PainelDasAcoes } from "@/motor/executarAcao";
import { type DegrauAjuda, ESTRELAS_MINIMAS, type Fala } from "@/motor/tipos";
import { avaliarValidador, consultar, type ContextoValidacao, recalcularPartesFeitas } from "@/motor/validadores";

type Opcoes = {
  fase: Fase;
  modo: ModoJogo;
  /** Mostrar a meta com antes/depois antes da introdução. */
  mostrarMeta: boolean;
  salvo: EstadoFaseSalvo | undefined;
  barramento: Barramento;
  htmlAtual: string;
  editorRef: RefObject<ApiEditor | null>;
  obterDocumento: () => Document | null;
  /** Nó selecionado agora e por onde foi escolhido. */
  obterSelecao: () => { no: Node; via: ViaSelecao | null } | null;
  /** As mesmas funções que a interface usa: soluções e roteiros passam por elas. */
  painel: Omit<PainelDasAcoes, "responderPrevisao">;
  destacarNaArvore: (destaque: DestaqueArvore | null) => void;
  /** Tela de toque: os enunciados usam "toque" em vez de "clique". */
  toque: boolean;
};

const ESPERA_VERIFICAR_MS = 700;
/** Tempo da animação de esbarrão antes das ações acontecerem. */
const ESPERA_ESBARRAO_MS = 1100;
const ESPERA_ROTEIRO_MS = 250;

const FALA_TROPECO: Fala = { texto: "Opa, opa, opa... segura aí!", expressao: "preocupado" };

/**
 * Motor genérico de fases: meta, introdução, objetivos (guiado, sozinho,
 * previsão, momentos roteirizados) ou checklist do desafio, validação a
 * cada mudança, escada de ajuda, "Rever", estrelas, conclusão e
 * persistência.
 */
export function useMotorFase({
  fase,
  modo,
  mostrarMeta,
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
  const [estado, setEstado] = useState<EstadoMotor>(() =>
    criarEstadoInicial(fase, salvo, toque, { modo, mostrarMeta }),
  );
  const [pulsarFerramenta, setPulsarFerramenta] = useState<IdFerramenta | null>(null);
  const [documentoInicial] = useState(() => criarDocumentoSolto(fase.siteAlvo.head, fase.siteAlvo.body));
  const eventosObjetivo = useRef<EventoFase[]>([]);
  /** Soluções e roteiros sendo aplicados: a validação espera. */
  const aplicando = useRef(false);
  const temporizadores = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pratica = fase.tipo === "pratica" ? fase : null;
  const desafio = fase.tipo === "desafio" ? fase : null;
  const total = pratica ? pratica.objetivos.length : (desafio?.partes.length ?? 0);
  const objetivo = pratica && estado.etapa === "objetivos" ? (pratica.objetivos[estado.objetivoAtual] ?? null) : null;
  const previsaoPendente = objetivo?.tipo === "previsao" && estado.previsao === null;
  const degrauMaximo: DegrauAjuda = objetivo?.modo === "sozinho" ? 2 : 4;

  useEffect(() => () => temporizadores.current.forEach(clearTimeout), []);

  const agendar = useCallback((fazer: () => void, espera: number) => {
    temporizadores.current.push(setTimeout(fazer, espera));
  }, []);

  /** Card de previsão: guarda a resposta, mostra se acertou e passa para a ação. */
  const responderPrevisao = useCallback(
    (opcao: number) => {
      if (!pratica || estado.etapa !== "objetivos" || estado.pausa !== null) return;
      const atual = pratica.objetivos[estado.objetivoAtual];
      if (atual.tipo !== "previsao" || estado.previsao !== null) return;
      const acertou = opcao === atual.previsao.correta;
      setEstado((anterior) =>
        anterior.objetivoAtual !== estado.objetivoAtual || anterior.previsao !== null
          ? anterior
          : {
              ...anterior,
              previsao: opcao,
              fala: { texto: enunciadoDe(atual, toque), expressao: acertou ? "comemorando" : "pensativo" },
            },
      );
      barramento.emitir({ tipo: "respondeuPrevisao", opcao, acertou });
    },
    [barramento, estado.etapa, estado.objetivoAtual, estado.pausa, estado.previsao, pratica, toque],
  );

  const painelCompleto = useMemo<PainelDasAcoes>(() => ({ ...painel, responderPrevisao }), [painel, responderPrevisao]);

  const limparAjudasVisuais = useCallback(() => {
    destacarNaArvore(null);
    editorRef.current?.destacarLinhas([]);
    setPulsarFerramenta(null);
  }, [destacarNaArvore, editorRef]);

  /** O que os validadores olham agora: documento vivo, inicial, seleção e eventos. */
  const contextoValidacao = useCallback((): ContextoValidacao | null => {
    const documento = obterDocumento();
    if (!documento?.body) return null;
    return { documento, inicial: documentoInicial, selecao: obterSelecao(), eventos: eventosObjetivo.current };
  }, [documentoInicial, obterDocumento, obterSelecao]);

  /* ---------------------------------------------------------------- */
  /* Persistência                                                      */
  /* ---------------------------------------------------------------- */

  const salvar = useCallback(
    (atual: EstadoMotor) => {
      if (modo !== "jogo") return;
      atualizarProgresso((progresso) => {
        const concluida = atual.etapa === "concluida";
        return {
          ...progresso,
          fasesEmAndamento: {
            ...progresso.fasesEmAndamento,
            [fase.id]: {
              objetivoAtual: atual.concluidos,
              htmlAtual,
              estrelas: atual.estrelas,
              introducaoVista: atual.etapa === "objetivos" || atual.etapa === "concluida",
              metaVista: atual.etapa !== "meta",
              htmlInicioObjetivo: atual.htmlInicioObjetivo,
              previsaoRespondida: atual.previsao,
              partesFeitas: atual.partesFeitas,
              reveres: atual.reveres,
            },
          },
          // Passou da meta: a da entrada da unidade não aparece de novo.
          metasVistas:
            mostrarMeta && atual.etapa !== "meta" && !progresso.metasVistas.includes(fase.unidadeId)
              ? [...progresso.metasVistas, fase.unidadeId]
              : progresso.metasVistas,
          fasesConcluidas:
            concluida && !progresso.fasesConcluidas.includes(fase.id)
              ? [...progresso.fasesConcluidas, fase.id]
              : progresso.fasesConcluidas,
          estrelasPorFase: concluida
            ? {
                ...progresso.estrelasPorFase,
                [fase.id]: Math.max(progresso.estrelasPorFase[fase.id] ?? 0, atual.estrelas),
              }
            : progresso.estrelasPorFase,
        };
      });
    },
    [fase.id, fase.unidadeId, htmlAtual, modo, mostrarMeta],
  );

  useEffect(() => {
    salvar(estado);
  }, [salvar, estado]);

  /* ---------------------------------------------------------------- */
  /* Roteiros e ativação de objetivos                                 */
  /* ---------------------------------------------------------------- */

  /** Roda um momento roteirizado: animação, ações pelo painel e a fala. */
  const rodarEvento = useCallback(
    (evento: EventoRoteirizado, depois: () => void) => {
      const esbarrao = evento.animacao === "esbarrao";
      setEstado((atual) => ({
        ...atual,
        roteiro: esbarrao ? "esbarrao" : "roteiro",
        fala: esbarrao ? FALA_TROPECO : atual.fala,
      }));
      agendar(
        () => {
          aplicando.current = true;
          try {
            executarAcoes(evento.acoes, painelCompleto);
          } catch {
            // Roteiro quebrado é pego pelo npm run testar:conteudo; aqui o jogo segue.
          } finally {
            aplicando.current = false;
          }
          // O que o computadorzinho fez não conta como ação do jogador.
          eventosObjetivo.current = [];
          setEstado((atual) => ({ ...atual, roteiro: null, fala: evento.fala ?? atual.fala }));
          depois();
        },
        esbarrao ? ESPERA_ESBARRAO_MS : ESPERA_ROTEIRO_MS,
      );
    },
    [agendar, painelCompleto],
  );

  /** Roda os roteiros em fila, um depois do outro. */
  const rodarEventos = useCallback(
    (eventos: readonly EventoRoteirizado[], depois: () => void) => {
      const rodarDaqui = (indice: number) => {
        const evento = eventos[indice];
        if (!evento) depois();
        else rodarEvento(evento, () => rodarDaqui(indice + 1));
      };
      rodarDaqui(0);
    },
    [rodarEvento],
  );

  /**
   * Liga um objetivo da prática: fala, previsão zerada e o momento
   * roteirizado dele. `falaMantida` segura a fala de um roteiro anterior.
   */
  const ativarObjetivo = useCallback(
    (indice: number, falaMantida?: Fala) => {
      if (!pratica) return;
      const alvo = pratica.objetivos[indice];
      eventosObjetivo.current = [];
      setEstado((atual) => ({
        ...atual,
        etapa: "objetivos",
        objetivoAtual: indice,
        pausa: null,
        degrau: 0,
        confirmandoSolucao: false,
        previsao: null,
        fala: falaMantida ?? falaDoObjetivo(pratica, indice, toque),
        htmlInicioObjetivo: alvo.eventoAoComecar ? htmlAtual : null,
      }));
      if (alvo.eventoAoComecar) rodarEvento(alvo.eventoAoComecar, () => {});
    },
    [htmlAtual, pratica, rodarEvento, toque],
  );

  /**
   * Roteiros que só podem rodar quando a página carregar: fase aberta
   * direto nos objetivos (revisão, lab) ou retomada no meio de um objetivo
   * com momento roteirizado (a página volta ao HTML de antes dele).
   */
  const [roteiroInicial] = useState<readonly EventoRoteirizado[] | null>(() => {
    if (estado.etapa !== "objetivos") return null;
    if (modo !== "jogo") {
      const primeiro = pratica?.objetivos[0].eventoAoComecar;
      const lista = [...(fase.eventosIniciais ?? []), ...(primeiro ? [primeiro] : [])];
      return lista.length > 0 ? lista : null;
    }
    const atual = pratica?.objetivos[estado.objetivoAtual];
    return atual?.eventoAoComecar && estado.htmlInicioObjetivo !== null ? [atual.eventoAoComecar] : null;
  });
  const roteiroInicialRodou = useRef(false);

  /** Chamado a cada carga da página; roda o roteiro pendente uma vez. */
  const aoDocumentoPronto = useCallback(() => {
    if (roteiroInicialRodou.current || !roteiroInicial) return;
    roteiroInicialRodou.current = true;
    rodarEventos(roteiroInicial, () => {});
  }, [rodarEventos, roteiroInicial]);

  /* ---------------------------------------------------------------- */
  /* Validação                                                         */
  /* ---------------------------------------------------------------- */

  const concluirObjetivo = useCallback(
    (indice: number) => {
      if (!pratica) return;
      const concluido = pratica.objetivos[indice];
      setEstado((atual) => {
        if (atual.etapa !== "objetivos" || atual.objetivoAtual !== indice || atual.pausa !== null) return atual;
        return {
          ...atual,
          concluidos: indice + 1,
          pausa: "objetivoConcluido",
          confirmandoSolucao: false,
          fala: concluido.falaAoConcluir,
          acertos: atual.acertos + 1,
          comemoracoesSozinho: atual.comemoracoesSozinho + (concluido.modo === "sozinho" ? 1 : 0),
        };
      });
      limparAjudasVisuais();
    },
    [limparAjudasVisuais, pratica],
  );

  /**
   * Desafio: recalcula o checklist. Partes travadas (seleção ou evento)
   * ficam marcadas para sempre; as demais são avaliadas ao vivo e desmarcam
   * se o jogador desfizer a ação (ver `validadorTravado` no motor).
   */
  const atualizarChecklist = useCallback(
    (contexto: ContextoValidacao) => {
      if (!desafio) return;
      setEstado((atual) => {
        if (atual.pausa !== null) return atual;
        const partesFeitas = recalcularPartesFeitas(desafio, atual.partesFeitas, contexto);
        const novas = partesFeitas.filter((id) => !atual.partesFeitas.includes(id));
        const mesmas = partesFeitas.length === atual.partesFeitas.length && novas.length === 0;
        if (mesmas) return atual;
        const todas = partesFeitas.length >= desafio.partes.length;
        const parte = desafio.partes.find((item) => item.id === novas[novas.length - 1]);
        return {
          ...atual,
          partesFeitas,
          concluidos: partesFeitas.length,
          acertos: novas.length > 0 ? atual.acertos + 1 : atual.acertos,
          listaRever: novas.length > 0 ? false : atual.listaRever,
          pausa: todas ? "desafioConcluido" : null,
          fala: todas
            ? { texto: "Desafio completo! Todas as partes marcadas, sem passo a passo. Que orgulho!", expressao: "comemorando" }
            : novas.length > 0
              ? { texto: `Isso! Parte feita: ${parte?.descricao ?? ""}`, expressao: "comemorando" }
              : atual.fala,
        };
      });
    },
    [desafio],
  );

  /** Roda a validação contra o documento vivo. */
  const verificar = useCallback(() => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null || estado.roteiro !== null || aplicando.current) return;
    const contexto = contextoValidacao();
    if (!contexto) return;
    if (pratica) {
      const atual = pratica.objetivos[estado.objetivoAtual];
      if (atual.tipo === "previsao" && estado.previsao === null) return;
      if (avaliarValidador(atual.validador, contexto)) concluirObjetivo(estado.objetivoAtual);
    } else if (desafio) {
      atualizarChecklist(contexto);
    }
  }, [
    estado.etapa,
    estado.pausa,
    estado.roteiro,
    estado.objetivoAtual,
    estado.previsao,
    contextoValidacao,
    pratica,
    desafio,
    concluirObjetivo,
    atualizarChecklist,
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

  // Quando algo começa (objetivo, resposta da previsão, fim do roteiro), confere se já está feito.
  useEffect(() => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null || estado.roteiro !== null) return;
    const temporizador = setTimeout(() => verificarAtual.current(), ESPERA_VERIFICAR_MS);
    return () => clearTimeout(temporizador);
  }, [estado.etapa, estado.objetivoAtual, estado.pausa, estado.roteiro, estado.previsao]);

  /* ---------------------------------------------------------------- */
  /* Conversa                                                          */
  /* ---------------------------------------------------------------- */

  const entrarNosObjetivos = () => {
    eventosObjetivo.current = [];
    setEstado({ ...estado, etapa: "objetivos", indiceFala: 0, fala: falaDeInicio(fase, toque) });
    const iniciais = fase.eventosIniciais ?? [];
    rodarEventos(iniciais, () => {
      if (pratica) ativarObjetivo(0, iniciais[iniciais.length - 1]?.fala);
    });
  };

  /** Avança a meta, as falas da introdução e as da conclusão. */
  const avancarFala = () => {
    if (estado.etapa === "meta") {
      setEstado({ ...estado, etapa: "introducao", indiceFala: 0, fala: fase.introducao[0] });
      return;
    }
    if (estado.etapa === "introducao") {
      const proxima = estado.indiceFala + 1;
      if (proxima < fase.introducao.length) setEstado({ ...estado, indiceFala: proxima, fala: fase.introducao[proxima] });
      else entrarNosObjetivos();
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

  /** Sai da pausa: ativa o próximo objetivo ou conclui a fase. */
  const seguir = () => {
    if (estado.pausa === null) return;
    eventosObjetivo.current = [];
    if (estado.pausa === "desafioConcluido" || estado.concluidos >= total) {
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
    ativarObjetivo(estado.concluidos);
  };

  /* ---------------------------------------------------------------- */
  /* Ajuda                                                             */
  /* ---------------------------------------------------------------- */

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

  /** "Me ajuda": sobe um degrau por clique (sozinho para no 2). No desafio, abre o "Rever". */
  const ajudar = () => {
    if (estado.pausa !== null || estado.roteiro !== null || estado.etapa !== "objetivos") return;
    if (desafio) {
      setEstado({ ...estado, listaRever: !estado.listaRever });
      return;
    }
    if (!objetivo || previsaoPendente) return;
    const proximo = Math.min(estado.degrau + 1, degrauMaximo) as DegrauAjuda;
    if (proximo === estado.degrau) return;
    const { ajudas } = objetivo;
    if (proximo === 1) {
      setEstado({ ...estado, degrau: 1, fala: { texto: ajudas.pergunta, expressao: "curioso" } });
    } else if (proximo === 2) {
      setEstado({ ...estado, degrau: 2, fala: { texto: ajudas.dica, expressao: "pensativo" } });
    } else if (objetivo.modo === "guiado" && proximo === 3) {
      aplicarLinha(objetivo.ajudas.linha);
      setEstado({ ...estado, degrau: 3, fala: { texto: objetivo.ajudas.linha.fala, expressao: "apontando" } });
    } else if (objetivo.modo === "guiado") {
      const gratis = modo !== "jogo" || estado.estrelas <= ESTRELAS_MINIMAS;
      setEstado({
        ...estado,
        confirmandoSolucao: true,
        fala: {
          texto:
            modo === "revisao"
              ? "Na revisão a solução é de graça. Quer ver?"
              : gratis
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
    aplicando.current = true;
    try {
      executarAcoes(objetivo.ajudas.solucao.acoes, painelCompleto);
    } catch {
      // Conteúdo quebrado é pego pelo npm run testar:conteudo; aqui o jogo segue.
    } finally {
      aplicando.current = false;
    }
    limparAjudasVisuais();
    setEstado({
      ...estado,
      degrau: 4,
      confirmandoSolucao: false,
      concluidos: estado.objetivoAtual + 1,
      pausa: "solucao",
      estrelas: modo === "jogo" ? Math.max(ESTRELAS_MINIMAS, estado.estrelas - 1) : estado.estrelas,
      fala: { texto: objetivo.ajudas.solucao.fala, expressao: "apontando" },
    });
  };

  /**
   * Desafio: "Rever este passo". Custa 1 estrela (mínimo 1), salva o
   * desafio na hora e devolve a fase que vai abrir em modo revisão.
   */
  const rever = (parteId: string): string | null => {
    const parte = desafio?.partes.find((item) => item.id === parteId);
    if (!parte) return null;
    const reveres = estado.reveres + 1;
    const novo: EstadoMotor = { ...estado, reveres, estrelas: estrelasDoDesafio(reveres), listaRever: false };
    setEstado(novo);
    salvar(novo);
    return parte.revisarEm;
  };

  const fecharListaRever = () => setEstado({ ...estado, listaRever: false });

  /** Lab: aplica a solução de teste do objetivo (ou da próxima parte) pelas funções da interface. */
  const aplicarSolucaoDeTeste = (): string | null => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null) return "Nenhum objetivo ativo agora (pausa ou fase concluída).";
    const acoes = pratica
      ? objetivo?.solucaoDeTeste
      : desafio?.partes.find((parte) => !estado.partesFeitas.includes(parte.id))?.solucaoDeTeste;
    if (!acoes) return "Nada para aplicar.";
    try {
      executarAcoes(acoes, painelCompleto);
      return null;
    } catch (erro) {
      return erro instanceof Error ? erro.message : String(erro);
    }
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
    total,
    previsaoPendente,
    degrauMaximo,
    pulsarFerramenta,
    contextoValidacao,
    verificar,
    aoDocumentoPronto,
    avancarFala,
    seguir,
    ajudar,
    cancelarSolucao,
    confirmarSolucao,
    responderPrevisao,
    rever,
    fecharListaRever,
    aplicarSolucaoDeTeste,
    falar,
    abrirConclusao,
    fecharConclusao,
  };
}
