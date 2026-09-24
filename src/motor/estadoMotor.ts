import type { Fase, FasePratica, Objetivo } from "@/conteudo/tipos";
import type { EstadoFaseSalvo } from "@/lib/progresso";
import { type DegrauAjuda, ESTRELAS_INICIAIS, ESTRELAS_MINIMAS, type Fala } from "./tipos";

/**
 * - "meta": a meta da unidade com o antes/depois (primeira fase da unidade e desafio);
 * - "introducao": as falas de abertura;
 * - "objetivos": os objetivos (prática) ou o checklist (desafio);
 * - "concluida": tela de conclusão e missão de campo.
 */
export type EtapaFase = "meta" | "introducao" | "objetivos" | "concluida";

/** Pausa: a fala fica na tela até o jogador seguir. */
export type PausaMotor = "objetivoConcluido" | "solucao" | "desafioConcluido" | null;

/**
 * Como a fase está sendo jogada:
 * - "jogo": normal, com estrelas e progresso salvo;
 * - "revisao": aberta pelo "Rever" do desafio (sem estrelas, sem salvar);
 * - "lab": o /lab/fases (sem salvar, sem apresentações).
 */
export type ModoJogo = "jogo" | "revisao" | "lab";

export type EstadoMotor = {
  etapa: EtapaFase;
  /** Índice da fala na introdução ou na conclusão. */
  indiceFala: number;
  /** Prática: objetivo ativo. */
  objetivoAtual: number;
  /** Prática: objetivos concluídos. Desafio: partes feitas. */
  concluidos: number;
  degrau: DegrauAjuda;
  estrelas: number;
  pausa: PausaMotor;
  confirmandoSolucao: boolean;
  fala: Fala;
  conclusaoAberta: boolean;
  /** Sobe a cada acerto; dispara som e animação. */
  acertos: number;
  /** Resposta do card de previsão do objetivo atual (null: ainda não respondeu). */
  previsao: number | null;
  /** Desafio: ids das partes marcadas no checklist (ficam marcadas). */
  partesFeitas: string[];
  /** Desafio: quantas vezes o "Rever" foi usado (cada uma custa 1 estrela). */
  reveres: number;
  /** Momento roteirizado rodando (animação do computadorzinho). */
  roteiro: "esbarrao" | "roteiro" | null;
  /** Sobe quando um objetivo sozinho é concluído: "Fez sozinho!". */
  comemoracoesSozinho: number;
  /** Desafio: a lista do "Rever" está aberta. */
  listaRever: boolean;
  /** HTML de quando o objetivo atual começou (só se ele tem momento roteirizado). */
  htmlInicioObjetivo: string | null;
};

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, Math.round(valor)));
}

/** Enunciado certo para o jeito de apontar do jogador (mouse ou toque). */
export function enunciadoDe(objetivo: Objetivo, toque: boolean): string {
  return toque ? objetivo.enunciado.toque : objetivo.enunciado.mouse;
}

/** Fala que apresenta um objetivo quando ele começa. */
export function falaDoObjetivo(fase: FasePratica, indice: number, toque: boolean): Fala {
  const objetivo = fase.objetivos[indice];
  if (objetivo.tipo === "previsao") return { texto: objetivo.previsao.pergunta, expressao: "curioso" };
  return { texto: enunciadoDe(objetivo, toque), expressao: "feliz" };
}

/** Fala final da fase (depois da missão de campo). */
export function falaFinalDe(fase: Fase): Fala {
  return fase.falaFinal ?? fase.conclusao[fase.conclusao.length - 1];
}

/** Estrelas do desafio: 3, menos 1 por "Rever" usado, no mínimo 1. */
export function estrelasDoDesafio(reveres: number): number {
  return Math.max(ESTRELAS_MINIMAS, ESTRELAS_INICIAIS - reveres);
}

export const FALA_DESAFIO: Fala = {
  texto: "Sem passo a passo agora. O checklist marca cada parte sozinho quando você fizer. Travou? O Rever te leva de volta.",
  expressao: "curioso",
};

export const FALA_REVISAO = "Modo revisão: sem estrelas, é só relembrar. Quando quiser, volte ao desafio.";

/** Fala do primeiro momento de objetivos (depois da introdução ou ao abrir direto). */
export function falaDeInicio(fase: Fase, toque: boolean): Fala {
  return fase.tipo === "desafio" ? FALA_DESAFIO : falaDoObjetivo(fase, 0, toque);
}

type OpcoesEstadoInicial = {
  modo: ModoJogo;
  /** Mostrar a meta com antes/depois antes da introdução. */
  mostrarMeta: boolean;
};

/**
 * Estado ao abrir a fase: do zero, de onde o jogador parou (salvo) ou,
 * na revisão e no lab, já nos objetivos.
 */
export function criarEstadoInicial(
  fase: Fase,
  salvo: EstadoFaseSalvo | undefined,
  toque: boolean,
  { modo, mostrarMeta }: OpcoesEstadoInicial,
): EstadoMotor {
  const total = fase.tipo === "pratica" ? fase.objetivos.length : fase.partes.length;
  const base: EstadoMotor = {
    etapa: mostrarMeta ? "meta" : "introducao",
    indiceFala: 0,
    objetivoAtual: 0,
    concluidos: 0,
    degrau: 0,
    estrelas: ESTRELAS_INICIAIS,
    pausa: null,
    confirmandoSolucao: false,
    fala: fase.introducao[0],
    conclusaoAberta: false,
    acertos: 0,
    previsao: null,
    partesFeitas: [],
    reveres: 0,
    roteiro: null,
    comemoracoesSozinho: 0,
    listaRever: false,
    htmlInicioObjetivo: null,
  };

  if (modo !== "jogo") {
    const fala = falaDeInicio(fase, toque);
    return {
      ...base,
      etapa: "objetivos",
      fala: modo === "revisao" ? { texto: FALA_REVISAO, expressao: "feliz" } : fala,
    };
  }
  if (!salvo) return base;
  if (!salvo.introducaoVista) {
    return { ...base, etapa: mostrarMeta && !salvo.metaVista ? "meta" : "introducao" };
  }

  if (fase.tipo === "desafio") {
    const partesFeitas = salvo.partesFeitas.filter((id) => fase.partes.some((parte) => parte.id === id));
    const reveres = Math.max(0, salvo.reveres);
    const comum = { ...base, partesFeitas, reveres, concluidos: partesFeitas.length, estrelas: estrelasDoDesafio(reveres) };
    if (partesFeitas.length >= total && salvo.objetivoAtual >= total) {
      return { ...comum, etapa: "concluida", indiceFala: fase.conclusao.length, fala: falaFinalDe(fase) };
    }
    return {
      ...comum,
      etapa: "objetivos",
      fala: { texto: "Que bom te ver de novo! O desafio está do jeitinho que você deixou.", expressao: "feliz" },
    };
  }

  const concluidos = limitar(salvo.objetivoAtual, 0, total);
  const estrelas = limitar(salvo.estrelas, ESTRELAS_MINIMAS, ESTRELAS_INICIAIS);
  if (concluidos >= total) {
    return {
      ...base,
      etapa: "concluida",
      objetivoAtual: total,
      concluidos: total,
      estrelas,
      indiceFala: fase.conclusao.length,
      fala: falaFinalDe(fase),
    };
  }
  const objetivo = fase.objetivos[concluidos];
  const previsao =
    objetivo.tipo === "previsao" && salvo.previsaoRespondida !== null && salvo.previsaoRespondida < objetivo.previsao.opcoes.length
      ? salvo.previsaoRespondida
      : null;
  const pendenteDePrevisao = objetivo.tipo === "previsao" && previsao === null;
  return {
    ...base,
    etapa: "objetivos",
    objetivoAtual: concluidos,
    concluidos,
    estrelas,
    previsao,
    htmlInicioObjetivo: objetivo.eventoAoComecar ? salvo.htmlInicioObjetivo : null,
    fala: pendenteDePrevisao
      ? falaDoObjetivo(fase, concluidos, toque)
      : { texto: `Que bom te ver de novo! Continuando: ${enunciadoDe(objetivo, toque)}`, expressao: "feliz" },
  };
}
