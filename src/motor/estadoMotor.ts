import type { EstadoFaseSalvo } from "@/lib/progresso";
import { type DegrauAjuda, ESTRELAS_INICIAIS, ESTRELAS_MINIMAS, type Fala, type Fase } from "./tipos";

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

export function falaDoObjetivo(fase: Fase, indice: number): Fala {
  return { texto: fase.objetivos[indice].enunciado, expressao: "feliz" };
}

export function criarEstadoInicial(fase: Fase, salvo: EstadoFaseSalvo | undefined): EstadoMotor {
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
      fala: fase.falaFinal,
    };
  }
  return {
    ...base,
    etapa: "objetivos",
    objetivoAtual: concluidos,
    concluidos,
    estrelas,
    fala: {
      texto: `Que bom te ver de novo! Continuando: ${fase.objetivos[concluidos].enunciado}`,
      expressao: "feliz",
    },
  };
}
