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

/** As trilhas (Web, Jogos, Automação industrial): escolher qual aparece no mundo. */
export const ROTA_TRILHAS = "/trilhas";

/** As profissões: o que faz cada tipo de programador, e a lente de cada uma no mapa. */
export const ROTA_PROFISSOES = "/profissoes";

/** O glossário vivo: todo conceito, onde se aprende e onde se pratica. */
export const ROTA_GLOSSARIO = "/glossario";

/** A oficina do Meu tema (E5): mexer nas cores salvas de novo, ou apagar. */
export const ROTA_MEU_TEMA = "/meu-tema";

/** Meus projetos: os sites que o jogador fez (a semente do portfólio). */
export const ROTA_PROJETOS = "/projetos";
