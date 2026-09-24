import type { FasePratica, Objetivo } from "@/conteudo/tipos";
import type { EstadoFaseSalvo } from "@/lib/progresso";
import { type DegrauAjuda, ESTRELAS_INICIAIS, ESTRELAS_MINIMAS, type Fala } from "./tipos";

export type EtapaFase = "introducao" | "objetivos" | "concluida";

/** Pausa entre objetivos: a fala fica na tela até o jogador seguir. */
export type PausaMotor = "objetivoConcluido" | "solucao" | null;

export type EstadoMotor = {
  etapa: EtapaFase;
  /** Índice da fala na introdução ou na conclusão. */
  indiceFala: number;
  objetivoAtual: number;
  /** Quantos objetivos já foram concluídos. */
  concluidos: number;
  degrau: DegrauAjuda;
  estrelas: number;
  pausa: PausaMotor;
  confirmandoSolucao: boolean;
  fala: Fala;
  conclusaoAberta: boolean;
  /** Sobe a cada acerto; serve para disparar som e animação. */
  acertos: number;
};

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, Math.round(valor)));
}

/** Enunciado certo para o jeito de apontar do jogador (mouse ou toque). */
export function enunciadoDe(objetivo: Objetivo, toque: boolean): string {
  return toque ? objetivo.enunciado.toque : objetivo.enunciado.mouse;
}

export function falaDoObjetivo(fase: FasePratica, indice: number, toque: boolean): Fala {
  return { texto: enunciadoDe(fase.objetivos[indice], toque), expressao: "feliz" };
}

/** Fala final da fase (depois da missão de campo). */
export function falaFinalDe(fase: FasePratica): Fala {
  return fase.falaFinal ?? fase.conclusao[fase.conclusao.length - 1];
}

export function criarEstadoInicial(fase: FasePratica, salvo: EstadoFaseSalvo | undefined, toque: boolean): EstadoMotor {
  const total = fase.objetivos.length;
  const base: EstadoMotor = {
    etapa: "introducao",
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
  };
  if (!salvo || !salvo.introducaoVista) return base;

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
  return {
    ...base,
    etapa: "objetivos",
    objetivoAtual: concluidos,
    concluidos,
    estrelas,
    fala: {
      texto: `Que bom te ver de novo! Continuando: ${enunciadoDe(fase.objetivos[concluidos], toque)}`,
      expressao: "feliz",
    },
  };
}
