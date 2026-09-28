"use client";

import { useEffect } from "react";
import { useProgresso } from "@/lib/armazemProgresso";
import { cssDoMeuTema, ID_ESTILO_MEU_TEMA } from "@/lib/meuTema";

/**
 * Mantém no <head> o <style> do Meu tema (E5) igual ao progresso: salvar
 * troca as cores na hora, apagar tira. O script de antes da pintura já pôs
 * o mesmo <style> quando o tema salvo é o Meu tema.
 */
export function EstiloMeuTema() {
  const { meuTema } = useProgresso();
  useEffect(() => {
    let estilo = document.getElementById(ID_ESTILO_MEU_TEMA);
    if (!meuTema) {
      estilo?.remove();
      return;
    }
    if (!estilo) {
      estilo = document.createElement("style");
      estilo.id = ID_ESTILO_MEU_TEMA;
      document.head.appendChild(estilo);
    }
    estilo.textContent = cssDoMeuTema(meuTema);
  }, [meuTema]);
  return null;
}
