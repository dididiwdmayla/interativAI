"use client";

import { semPagina, temObjetivos } from "@/motor/tiposDeFase";
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DestaqueArvore } from "@/componentes/painel/arvore/tipos";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import type { AjudaLinha, EventoRoteirizado, Fase, ViaSelecao } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import { atualizarProgresso } from "@/lib/armazemProgresso";
import { alvoDoElemento, raizDoCodigo } from "@/lib/caminhoElementos";
import { caminhoDoNo, raizDaArvore } from "@/lib/dom";
import { type EstadoFaseSalvo, type Progresso, type ProgramaSalvo, PROJETO_VAZIO } from "@/lib/progresso";
import type { Circuito } from "@/motor/circuito/modelo";
import type { EstadoOrdenar } from "@/motor/ordenar/modelo";
import type { EstadoCasos } from "@/motor/casos/modelo";
import { agendarRastreado, type TemporizadorRastreado } from "@/lib/pendencias";
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
import { documentoSoltoDaFase } from "@/motor/simulacao";
import { type DegrauAjuda, ESTRELAS_INICIAIS, ESTRELAS_MINIMAS, type Fala } from "@/motor/tipos";
import { diaLocal, registrarFaseConcluida } from "@/lib/revisao";
import { clienteDe } from "@/motor/contrato/clientes";
import {
  type ConferenciaRequisitos,
  conferirRequisitos,
  ehContrato,
  type EscolhaRequisitos,
  type EstadoContrato,
  falaDaConferencia,
  mudancaPronta,
} from "@/motor/contrato/modelo";
import { avaliarValidador, consultar, type ContextoValidacao, itensDoChecklist, recalcularPartesFeitas } from "@/motor/validadores";

/** Meus projetos: o site do projeto-ponte, copiado a cada mudança (a data só anda se o texto mudou). */
function espelharProjeto(
  projetos: Progresso["projetos"],
  faseId: string,
  html: string | null,
  css: string | null,
): Progresso["projetos"] {
  const anterior = projetos[faseId] ?? PROJETO_VAZIO;
  if (html === null || (anterior.html === html && anterior.css === css)) return projetos;
  return { ...projetos, [faseId]: { ...anterior, html, css, atualizadoEm: Date.now() } };
}

type Opcoes = {
  fase: Fase;
  modo: ModoJogo;
  /** Mostrar a meta com antes/depois antes da introdução. */
  mostrarMeta: boolean;
  salvo: EstadoFaseSalvo | undefined;
  barramento: Barramento;
  htmlAtual: string;
  /** Texto da folha editável (null: a fase não tem CSS). */
  cssAtual: string | null;
  editorRef: RefObject<ApiEditor | null>;
  obterDocumento: () => Document | null;
  /** Nó selecionado agora e por onde foi escolhido. */
  obterSelecao: () => { no: Node; via: ViaSelecao | null } | null;
  /** As mesmas funções que a interface usa: soluções e roteiros passam por elas. */
  painel: Omit<PainelDasAcoes, "responderPrevisao">;
  destacarNaArvore: (destaque: DestaqueArvore | null) => void;
  /** Degrau 3 no CSS: abre a aba CSS e pisca a regra (ou só a declaração). */
  destacarNoCss: (seletorRegra: string, propriedade?: string) => void;
  /** Apaga os destaques do editor CSS. */
  limparDestaqueCss: () => void;
  /** Degrau 3 no painel Estilos: pisca a regra (ou só a declaração); null apaga. */
  destacarNoEstilos: (destaque: { seletorRegra: string; propriedade?: string } | null) => void;
  /** Tela de toque: os enunciados usam "toque" em vez de "clique". */
  toque: boolean;
  /** O resto do que os validadores olham: a tela da prévia e o modo dispositivo (lidos na hora). */
  extraValidacao?: () => Pick<ContextoValidacao, "tela" | "dispositivo" | "campanha" | "programa" | "circuito" | "ordenar" | "snippet" | "casos">;
  /** (Fase de programa) Degrau 3: pisca linhas do Snippet ou a linha do Console; null apaga. */
  destacarNoPrograma?: (alvo: number[] | "console" | null) => void;
  /** (Fase de programa) O que rodou e o Snippet, para salvar junto com a fase. */
  programaSalvo?: ProgramaSalvo | null;
  /** (Circuito) Degrau 3: pisca uma peça (ou a paleta); null apaga. */
  destacarNoCircuito?: (alvo: string | null) => void;
  /** (Circuito) O circuito de agora, para salvar junto com a fase. */
  circuitoSalvo?: Circuito | null;
  /** (Ordenar) Degrau 3: pisca um cartão (ou o plano); null apaga. */
  destacarNoOrdenar?: (alvo: string | null) => void;
  /** (Ordenar) O quadro de agora, para salvar junto com a fase. */
  ordenarSalvo?: EstadoOrdenar | null;
  /** (Área testes) Os casos do aluno de agora, para salvar junto com a fase. */
  casosSalvos?: EstadoCasos | null;
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
  cssAtual,
  editorRef,
  obterDocumento,
  obterSelecao,
  painel,
  destacarNaArvore,
  destacarNoCss,
  limparDestaqueCss,
  destacarNoEstilos,
  toque,
  extraValidacao,
  destacarNoPrograma,
  programaSalvo = null,
  destacarNoCircuito,
  circuitoSalvo = null,
  destacarNoOrdenar,
  ordenarSalvo = null,
  casosSalvos = null,
}: Opcoes) {
  const [estado, setEstado] = useState<EstadoMotor>(() =>
    criarEstadoInicial(fase, salvo, toque, { modo, mostrarMeta }),
  );
  const [pulsarFerramenta, setPulsarFerramenta] = useState<IdFerramenta | null>(null);
  const [documentoInicial] = useState(() => documentoSoltoDaFase(fase));
  const eventosObjetivo = useRef<EventoFase[]>([]);
  /** Soluções e roteiros sendo aplicados: a validação espera. */
  const aplicando = useRef(false);
  const temporizadores = useRef<TemporizadorRastreado[]>([]);

  const pratica = temObjetivos(fase) ? fase : null;
  const desafio = fase.tipo === "desafio" ? fase : null;
  const projeto = fase.tipo === "projeto-ponte" ? fase : null;
  /** Desafio e projeto-ponte: o checklist (partes ou requisitos). */
  const comChecklist = desafio ?? projeto;
  /** (Contrato) O desafio é o trabalho de um cliente: etapas, mudança de pedido e entrega. */
  const contrato = desafio && ehContrato(desafio) ? desafio : null;
  const mudou = estado.contrato?.mudou ?? false;
  const itensChecklist = comChecklist ? (itensDoChecklist(comChecklist, mudou) ?? []) : [];
  const total = pratica ? pratica.objetivos.length : itensChecklist.length;
  const objetivo = pratica && estado.etapa === "objetivos" ? (pratica.objetivos[estado.objetivoAtual] ?? null) : null;
  const previsaoPendente = objetivo?.tipo === "previsao" && estado.previsao === null;
  const degrauMaximo: DegrauAjuda = objetivo?.modo === "sozinho" ? 2 : 4;

  useEffect(() => () => temporizadores.current.forEach((temporizador) => temporizador.cancelar()), []);

  const agendar = useCallback((fazer: () => void, espera: number) => {
    temporizadores.current.push(agendarRastreado(fazer, espera));
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
    limparDestaqueCss();
    destacarNoEstilos(null);
    destacarNoPrograma?.(null);
    destacarNoCircuito?.(null);
    destacarNoOrdenar?.(null);
    setPulsarFerramenta(null);
  }, [destacarNaArvore, destacarNoCircuito, destacarNoEstilos, destacarNoOrdenar, destacarNoPrograma, editorRef, limparDestaqueCss]);

  /** O que os validadores olham agora: documento vivo, inicial, seleção e eventos. */
  const contextoValidacao = useCallback((): ContextoValidacao | null => {
    // Fase de programa: não há página (a tela é o palco); o documento é o vazio do começo.
    const documento = semPagina(fase) ? documentoInicial : obterDocumento();
    if (!documento?.body) return null;
    return { documento, inicial: documentoInicial, selecao: obterSelecao(), eventos: eventosObjetivo.current, ...extraValidacao?.() };
  }, [documentoInicial, extraValidacao, fase, obterDocumento, obterSelecao]);

  /* ---------------------------------------------------------------- */
  /* Persistência                                                      */
  /* ---------------------------------------------------------------- */

  /* (Contrato) O tempo de trabalho: conta enquanto a etapa é "trabalho" nesta visita. */
  const inicioTrabalho = useRef<number | null>(null);
  const trabalhando = estado.contrato?.etapa === "trabalho" && estado.etapa === "objetivos";
  useEffect(() => {
    if (trabalhando && inicioTrabalho.current === null) inicioTrabalho.current = Date.now();
  }, [trabalhando]);
  const comTempo = useCallback((atual: EstadoContrato): EstadoContrato => {
    const desde = inicioTrabalho.current;
    return desde === null ? atual : { ...atual, tempoMs: atual.tempoMs + Math.max(0, Date.now() - desde) };
  }, []);

  // Revisão do dia: a fase concluída agora (não a que já abriu concluída) põe os conceitos na fila, uma vez.
  const concluidaAoAbrir = useRef(estado.etapa === "concluida");
  const revisaoRegistrada = useRef(false);

  const salvar = useCallback(
    (atual: EstadoMotor) => {
      if (modo !== "jogo") return;
      // As bancadas do /lab (abertas com ?modo=jogo) não entram na Revisão do dia: não são conteúdo.
      const registrarRevisao = atual.etapa === "concluida" && !concluidaAoAbrir.current && !revisaoRegistrada.current && !fase.unidadeId.startsWith("lab-");
      if (registrarRevisao) revisaoRegistrada.current = true;
      atualizarProgresso((progresso) => {
        const concluida = atual.etapa === "concluida";
        return {
          ...progresso,
          fasesEmAndamento: {
            ...progresso.fasesEmAndamento,
            [fase.id]: {
              objetivoAtual: atual.concluidos,
              htmlAtual,
              cssAtual,
              estrelas: atual.estrelas,
              introducaoVista: atual.etapa === "objetivos" || atual.etapa === "concluida",
              metaVista: atual.etapa !== "meta",
              htmlInicioObjetivo: atual.htmlInicioObjetivo,
              cssInicioObjetivo: atual.cssInicioObjetivo,
              previsaoRespondida: atual.previsao,
              partesFeitas: atual.partesFeitas,
              reveres: atual.reveres,
              programa: programaSalvo,
              circuito: circuitoSalvo,
              ordenar: ordenarSalvo,
              casos: casosSalvos,
              contrato: atual.contrato ? comTempo(atual.contrato) : null,
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
          projetos: projeto ? espelharProjeto(progresso.projetos, fase.id, htmlAtual, cssAtual) : progresso.projetos,
          // A ajuda da fase, aproximada pelas estrelas: só a solução e o Rever tiram estrela.
          revisao: registrarRevisao
            ? registrarFaseConcluida(progresso.revisao, fase, atual.estrelas < ESTRELAS_INICIAIS, diaLocal())
            : progresso.revisao,
        };
      });
    },
    [casosSalvos, circuitoSalvo, comTempo, cssAtual, fase, htmlAtual, modo, mostrarMeta, ordenarSalvo, programaSalvo, projeto],
  );

  useEffect(() => {
    salvar(estado);
  }, [salvar, estado]);

  // (Contrato) Durante o trabalho, salva de minuto em minuto: o tempo não se perde se a aba fechar.
  const estadoAtual = useRef(estado);
  useEffect(() => {
    estadoAtual.current = estado;
  }, [estado]);
  useEffect(() => {
    if (!trabalhando || modo !== "jogo") return;
    const intervalo = setInterval(() => salvar(estadoAtual.current), 60_000);
    return () => clearInterval(intervalo);
  }, [modo, salvar, trabalhando]);

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
        cssInicioObjetivo: alvo.eventoAoComecar ? cssAtual : null,
      }));
      if (alvo.eventoAoComecar) rodarEvento(alvo.eventoAoComecar, () => {});
    },
    [cssAtual, htmlAtual, pratica, rodarEvento, toque],
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
      if (!comChecklist) return;
      setEstado((atual) => {
        if (atual.pausa !== null) return atual;
        if (atual.contrato && atual.contrato.etapa !== "trabalho") return atual;
        const jaMudou = atual.contrato?.mudou ?? false;
        const itens = itensDoChecklist(comChecklist, jaMudou) ?? [];
        const partesFeitas = recalcularPartesFeitas(comChecklist, atual.partesFeitas, contexto, jaMudou);
        // (Contrato) A mensagem do cliente chega quando as partes de depoisDe ficam prontas: o checklist muda.
        if (contrato && atual.contrato && !jaMudou && mudancaPronta(contrato.contrato, partesFeitas)) {
          const depois = recalcularPartesFeitas(comChecklist, partesFeitas, contexto, true);
          return {
            ...atual,
            partesFeitas: depois,
            concluidos: depois.length,
            acertos: atual.acertos + 1,
            listaRever: false,
            contrato: { ...atual.contrato, mudou: true },
            pausa: "mudancaDoCliente",
            fala: { texto: `Ih, chegou mensagem de ${clienteDe(contrato.contrato.cliente).nome}. Cliente de verdade muda de ideia no meio do caminho!`, expressao: "curioso" },
          };
        }
        const novas = partesFeitas.filter((id) => !atual.partesFeitas.includes(id));
        const mesmas = partesFeitas.length === atual.partesFeitas.length && novas.length === 0;
        if (mesmas) return atual;
        const todas = partesFeitas.length >= itens.length;
        const parte = itens.find((item) => item.id === novas[novas.length - 1]);
        const noProjeto = comChecklist.tipo === "projeto-ponte";
        const noContrato = atual.contrato !== null;
        return {
          ...atual,
          partesFeitas,
          concluidos: partesFeitas.length,
          acertos: novas.length > 0 ? atual.acertos + 1 : atual.acertos,
          listaRever: novas.length > 0 ? false : atual.listaRever,
          pausa: todas ? "desafioConcluido" : null,
          fala: todas
            ? noContrato
              ? { texto: "Todos os requisitos atendidos, inclusive o pedido novo! Bora montar o relatório e entregar?", expressao: "comemorando" }
              : noProjeto
              ? { texto: "Todos os requisitos! O site é seu, feito do zero, sem passo a passo. Que orgulho!", expressao: "comemorando" }
              : { texto: "Desafio completo! Todas as partes marcadas, sem passo a passo. Que orgulho!", expressao: "comemorando" }
            : novas.length > 0
              ? { texto: `Isso! ${noProjeto || noContrato ? "Requisito cumprido" : "Parte feita"}: ${parte?.descricao ?? ""}`, expressao: "comemorando" }
              : atual.fala,
        };
      });
    },
    [comChecklist, contrato],
  );

  /** Roda a validação contra o documento vivo. */
  const verificar = useCallback(() => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null || estado.roteiro !== null || aplicando.current) return;
    if (estado.contrato && estado.contrato.etapa !== "trabalho") return;
    const contexto = contextoValidacao();
    if (!contexto) return;
    if (pratica) {
      const atual = pratica.objetivos[estado.objetivoAtual];
      if (atual.tipo === "previsao" && estado.previsao === null) return;
      if (avaliarValidador(atual.validador, contexto)) concluirObjetivo(estado.objetivoAtual);
    } else if (comChecklist) {
      atualizarChecklist(contexto);
    }
  }, [
    estado.etapa,
    estado.pausa,
    estado.roteiro,
    estado.objetivoAtual,
    estado.previsao,
    estado.contrato,
    contextoValidacao,
    pratica,
    comChecklist,
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
  const etapaContrato = estado.contrato?.etapa ?? null;
  useEffect(() => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null || estado.roteiro !== null) return;
    const temporizador = agendarRastreado(() => verificarAtual.current(), ESPERA_VERIFICAR_MS);
    return () => temporizador.cancelar();
  }, [estado.etapa, estado.objetivoAtual, estado.pausa, estado.roteiro, estado.previsao, etapaContrato]);

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
    if (estado.pausa === "mudancaDoCliente") {
      // O pedido mudou: o trabalho continua (os eventos do objetivo continuam valendo).
      setEstado({ ...estado, pausa: null, fala: { texto: "O checklist já mudou. Mexer em código que já funciona é normal: confere que o resto continua passando.", expressao: "pensativo" } });
      return;
    }
    eventosObjetivo.current = [];
    if (contrato && estado.contrato && (estado.pausa === "desafioConcluido" || estado.concluidos >= total)) {
      // Contrato: antes da conclusão, a entrega (o relatório, a reação do cliente e o Levar pro mundo).
      const comTempoFinal = comTempo(estado.contrato);
      inicioTrabalho.current = null;
      setEstado({ ...estado, pausa: null, contrato: { ...comTempoFinal, etapa: "entrega" }, fala: { texto: "O relatório saiu sozinho do checklist e dos testes. Confere e entrega!", expressao: "apontando" } });
      return;
    }
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
      const raiz = documento ? raizDaArvore(documento) : null;
      const caminho = raiz && elemento ? (elemento === raiz ? [] : caminhoDoNo(raiz, elemento)) : null;
      if (caminho) destacarNaArvore({ caminho, parte: linha.parte ?? "no" });
    } else if (linha.alvo === "editor") {
      const editor = editorRef.current;
      if (!editor || !documento?.body) return;
      const linhas = consultar(documento, linha.seletor).flatMap((elemento) => {
        const alvo = alvoDoElemento(raizDoCodigo(documento), elemento);
        return alvo ? editor.linhasDoAlvo(alvo) : [];
      });
      editor.destacarLinhas(linhas);
    } else if (linha.alvo === "css") {
      destacarNoCss(linha.seletorRegra, linha.propriedade);
    } else if (linha.alvo === "estilos") {
      destacarNoEstilos({ seletorRegra: linha.seletorRegra, propriedade: linha.propriedade });
    } else if (linha.alvo === "snippet" || linha.alvo === "console") {
      destacarNoPrograma?.(linha.alvo === "snippet" ? linha.linhas : "console");
    } else if (linha.alvo === "circuito") {
      destacarNoCircuito?.(linha.peca ?? "paleta");
    } else if (linha.alvo === "ordenar") {
      destacarNoOrdenar?.(linha.passo ?? "plano");
    } else {
      setPulsarFerramenta(linha.ferramenta);
    }
  };

  /** "Me ajuda": sobe um degrau por clique (sozinho para no 2). No desafio, abre o "Rever". */
  const ajudar = () => {
    if (estado.pausa !== null || estado.roteiro !== null || estado.etapa !== "objetivos") return;
    if (contrato) {
      // No contrato, o computadorzinho é o colega de trabalho: só pergunta, uma de cada parte que falta, em rodízio.
      const pendentes = itensChecklist.filter((item) => !estado.partesFeitas.includes(item.id));
      if (pendentes.length === 0) return;
      const vez = pendentes[estado.degrau % pendentes.length];
      const pergunta = contrato.partes.find((parte) => parte.id === vez.id)?.pergunta ?? "O que o cliente pediu que ainda falta? Relê o documento dele.";
      setEstado({ ...estado, degrau: ((estado.degrau + 1) % 4) as DegrauAjuda, listaRever: false, fala: { texto: pergunta, expressao: "curioso" } });
      return;
    }
    if (desafio) {
      setEstado({ ...estado, listaRever: !estado.listaRever });
      return;
    }
    if (projeto) {
      // No projeto, o computadorzinho só pergunta: uma pergunta de cada requisito que falta, em rodízio.
      const pendentes = projeto.requisitos.filter((item) => !estado.partesFeitas.includes(item.id));
      if (pendentes.length === 0) return;
      const vez = estado.degrau % pendentes.length;
      setEstado({ ...estado, degrau: ((estado.degrau + 1) % 4) as DegrauAjuda, fala: { texto: pendentes[vez].pergunta, expressao: "curioso" } });
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
    if (!objetivo || objetivo.modo !== "guiado" || (!semPagina(fase) && !obterDocumento()?.body)) return;
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
  const alternarListaRever = () => setEstado({ ...estado, listaRever: !estado.listaRever });

  /* ---------------------------------------------------------------- */
  /* Contrato: briefing, requisitos e entrega                          */
  /* ---------------------------------------------------------------- */

  /** Do briefing (o cliente falando e o documento) para a lista de requisitos. */
  const irParaRequisitos = () => {
    if (!estado.contrato || estado.contrato.etapa !== "briefing") return;
    setEstado({ ...estado, contrato: { ...estado.contrato, etapa: "requisitos" }, fala: { texto: contrato?.contrato.requisitos.pergunta ?? "O que o cliente pediu de verdade? Escolhe os cartões e completa as lacunas.", expressao: "curioso" } });
  };

  /** Confere a lista de requisitos: certa, começa o trabalho; errada, o colega diz o que falta (sem dizer qual, nas primeiras vezes). */
  const conferirListaDeRequisitos = (escolha: EscolhaRequisitos): ConferenciaRequisitos | null => {
    if (!contrato || !estado.contrato || estado.contrato.etapa !== "requisitos") return null;
    const conferencia = conferirRequisitos(contrato.contrato, escolha);
    barramento.emitir({ tipo: "conferiuRequisitos", certo: conferencia.certo });
    if (conferencia.certo) {
      eventosObjetivo.current = [];
      setEstado({ ...estado, contrato: { ...estado.contrato, etapa: "trabalho", escolha }, fala: { texto: falaDaConferencia(conferencia), expressao: "comemorando" } });
    } else {
      setEstado({ ...estado, contrato: { ...estado.contrato, escolha, tentativas: estado.contrato.tentativas + 1 }, fala: { texto: falaDaConferencia(conferencia), expressao: "pensativo" } });
    }
    return conferencia;
  };

  /** Entregou: a fase conclui (a conclusão e o Levar pro mundo vêm depois). */
  const entregar = () => {
    if (!estado.contrato || estado.contrato.etapa !== "entrega") return;
    setEstado({
      ...estado,
      etapa: "concluida",
      objetivoAtual: total,
      pausa: null,
      degrau: 0,
      indiceFala: 0,
      conclusaoAberta: true,
      fala: fase.conclusao[0],
      contrato: { ...estado.contrato, entregue: true },
    });
  };

  /** Lab: aplica a solução de teste do objetivo (ou da próxima parte) pelas funções da interface. */
  const aplicarSolucaoDeTeste = (): string | null => {
    if (estado.etapa !== "objetivos" || estado.pausa !== null) return "Nenhum objetivo ativo agora (pausa ou fase concluída).";
    const acoes = pratica
      ? objetivo?.solucaoDeTeste
      : itensChecklist.find((parte) => !estado.partesFeitas.includes(parte.id))?.solucaoDeTeste;
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
    alternarListaRever,
    irParaRequisitos,
    conferirListaDeRequisitos,
    entregar,
    aplicarSolucaoDeTeste,
    falar,
    abrirConclusao,
    fecharConclusao,
  };
}
