/* A versão 16:9 (1920 x 1080, 30 fps): a montagem com o roteiro largo. */
import { BLOCOS_169, duracaoTotal, FPS } from "../roteiro";
import { Apresentacao } from "./Apresentacao";

export const QUADROS_169 = Math.round(duracaoTotal(BLOCOS_169) * FPS);

/** `so`: só para a revisão medir a voz e a música em separado. */
export function Apresentacao169({ so }: { so?: "musica" | "voz" | "efeitos" }) {
  return <Apresentacao blocos={BLOCOS_169} formato="16x9" so={so} />;
}
