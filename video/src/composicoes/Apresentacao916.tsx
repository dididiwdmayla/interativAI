/* A versão vertical 9:16 (1080 x 1920, 30 fps): edição própria, com as tomadas de celular e o roteiro alto. */
import { BLOCOS_916, duracaoTotal, FPS } from "../roteiro";
import { Apresentacao } from "./Apresentacao";

export const QUADROS_916 = Math.round(duracaoTotal(BLOCOS_916) * FPS);

/** `so`: só para a revisão medir a voz e a música em separado. */
export function Apresentacao916({ so }: { so?: "musica" | "voz" | "efeitos" }) {
  return <Apresentacao blocos={BLOCOS_916} formato="9x16" so={so} />;
}
