/** Endereços do jogo, num lugar só. */

/** O mundo (mapa das ilhas). */
export const ROTA_MUNDO = "/";

export function rotaDaIlha(ilhaId: string): string {
  return `/ilha/${ilhaId}`;
}

/** A fase, direto (deep link): recarregar volta nela. */
export function rotaDaFase(faseId: string): string {
  return `/fase/${faseId}`;
}

/** Só para testes: desbloquear tudo, resetar o mapa e a Lista de fases. */
export const ROTA_LAB_MAPA = "/lab/mapa";
