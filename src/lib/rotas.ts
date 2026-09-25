/** Endereços do jogo, num lugar só. */

/** O mundo (mapa das ilhas). */
export const ROTA_MUNDO = "/mapa";

export function rotaDaIlha(ilhaId: string): string {
  return `/ilha/${ilhaId}`;
}

/**
 * Onde uma fase abre. Por enquanto o jogo mora na raiz e abre a fase
 * salva em faseAtual (quem chama grava a fase antes de ir).
 */
export function rotaDaFase(faseId: string): string {
  void faseId;
  return "/";
}
