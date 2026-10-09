import "@jogo/tema/tokens.css";
import "./fontes";
import { Composition, Still } from "remotion";
import { Apresentacao169, QUADROS_169 } from "./composicoes/Apresentacao169";
import { Apresentacao916, QUADROS_916 } from "./composicoes/Apresentacao916";
import { Capa } from "./composicoes/Capa";
import { CurtoAprendiz, QUADROS_DO_APRENDIZ } from "./curtos/CurtoAprendiz";
import { CurtoChefao, QUADROS_DO_CHEFAO } from "./curtos/CurtoChefao";
import { ProvaDeFogo } from "./pecas/ProvaDeFogo";
import { FPS } from "./roteiro";

export function Raiz() {
  return (
    <>
      <Composition id="Apresentacao169" component={Apresentacao169} defaultProps={{}} durationInFrames={QUADROS_169} fps={FPS} width={1920} height={1080} />
      <Composition id="Apresentacao916" component={Apresentacao916} defaultProps={{}} durationInFrames={QUADROS_916} fps={FPS} width={1080} height={1920} />
      <Still id="Capa169" component={Capa} defaultProps={{ formato: "16x9" as const }} width={1280} height={720} />
      <Still id="Capa916" component={Capa} defaultProps={{ formato: "9x16" as const }} width={1080} height={1920} />
      {/* Os curtos verticais (src/curtos): "O aprendiz", no tema Doce, e "O chefão", no Fliperama. */}
      <Composition id="CurtoAprendiz" component={CurtoAprendiz} defaultProps={{}} durationInFrames={QUADROS_DO_APRENDIZ} fps={FPS} width={1080} height={1920} />
      <Composition id="CurtoChefao" component={CurtoChefao} defaultProps={{}} durationInFrames={QUADROS_DO_CHEFAO} fps={FPS} width={1080} height={1920} />
      {/* A prova de fogo do começo do projeto: o corpo do computadorzinho importado do jogo, os tokens e as duas fontes. */}
      <Composition id="ProvaDeFogo" component={ProvaDeFogo} durationInFrames={60} fps={FPS} width={1920} height={1080} />
    </>
  );
}
