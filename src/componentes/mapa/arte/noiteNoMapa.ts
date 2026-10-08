"use client";

import { createContext, useContext } from "react";

/**
 * É de noite no mundo? As artes das ilhas mudam um pouco de noite (os
 * operários cochilam, a luz da obra acende); o padrão é dia (fora do mundo,
 * como na tela da ilha).
 */
export const NoiteNoMapa = createContext(false);

export function useNoiteNoMapa(): boolean {
  return useContext(NoiteNoMapa);
}
