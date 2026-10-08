"use client";

import { useEffect, useState } from "react";
import { horaDoEndereco, type Periodo, periodoDaHora } from "./periodo";

/** De quanto em quanto tempo o mundo confere o relógio. */
const CONFERIR_MS = 5 * 60 * 1000;

/**
 * O período do dia pelo relógio do aparelho (ou pelo `?hora=` do endereço),
 * conferido de 5 em 5 minutos. Antes de montar, dia (o servidor não sabe a
 * hora de quem joga).
 */
export function usePeriodoDoDia(): Periodo {
  const [periodo, setPeriodo] = useState<Periodo>("dia");
  useEffect(() => {
    const conferir = () => setPeriodo(periodoDaHora(horaDoEndereco(window.location.search) ?? new Date().getHours()));
    conferir();
    const intervalo = setInterval(conferir, CONFERIR_MS);
    return () => clearInterval(intervalo);
  }, []);
  return periodo;
}
