import type { Fase } from "@/motor/tipos";
import { FASE_SITES_ELEMENTOS_1 } from "./sites-elementos-1/fase";

/** Todas as fases do jogo. Hoje só existe a primeira. */
export const FASES: readonly Fase[] = [FASE_SITES_ELEMENTOS_1];

export const FASE_INICIAL = FASE_SITES_ELEMENTOS_1;
