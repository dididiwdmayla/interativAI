/*
 * A montagem do vídeo: os blocos do roteiro em sequência, o narrador e a
 * lista da Fase 0 por cima das tomadas, e a trilha. Vale para os dois
 * formatos; o roteiro de cada um diz o que entra.
 */
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { FPS, noTempo, objetivosNoTempo, type Bloco, type BlocoNoTempo } from "../roteiro";
import { q } from "../lib/tempo";
import { ChecklistDoCanto, type Marcado } from "../pecas/Checklist";
import { Narrador, type FalaAtiva } from "../pecas/Narrador";
import { DURACAO_DO_MERGULHO } from "../pecas/Tomada";
import { Trilha } from "../pecas/Trilha";
import { Abertura } from "./blocos/Abertura";
import { Chegando } from "./blocos/Chegando";
import { FalasDoVideo, type Formato } from "./blocos/comum";
import { Convite } from "./blocos/Convite";
import { Cortes } from "./blocos/Cortes";
import { Mundo } from "./blocos/Mundo";
import { Titulo } from "./blocos/Titulo";
import { Truque } from "./blocos/Truque";

type Props = { blocos: Bloco[]; formato: Formato; /** Só para a revisão: toca uma parte só da trilha. */ so?: "musica" | "voz" | "efeitos" };

/** O narrador do canto aparece durante as tomadas (depois do mergulho) e some nos blocos desenhados. */
function janelasDoNarrador(blocos: BlocoNoTempo[]): { de: number; ate: number }[] {
  const janelas: { de: number; ate: number }[] = [];
  for (const bloco of blocos) {
    for (const corte of bloco.cortes) {
      const de = bloco.inicio + corte.em + (corte.mergulho ? DURACAO_DO_MERGULHO : 0);
      const ate = bloco.inicio + corte.em + corte.duracao;
      const anterior = janelas.at(-1);
      if (anterior && de - anterior.ate < 0.08) anterior.ate = ate;
      else janelas.push({ de, ate });
    }
  }
  return janelas;
}

function Listas({ blocos, formato }: { blocos: BlocoNoTempo[]; formato: Formato }) {
  const t = useCurrentFrame() / FPS;
  const abertura = blocos.find((bloco) => bloco.id === "abertura");
  const convite = blocos.find((bloco) => bloco.id === "convite");
  const de = (abertura?.inicio ?? 0) + (abertura?.momentos?.lista ?? 0);
  const ate = (convite?.inicio ?? blocos.at(-1)?.fim ?? 0) - 0.15;
  const escondida = blocos.flatMap((bloco) => (bloco.semLista ? [{ de: bloco.inicio + bloco.semLista.de, ate: bloco.inicio + bloco.semLista.ate }] : []));
  return <ChecklistDoCanto t={t} marcados={objetivosNoTempo(blocos)} de={de} ate={ate} formato={formato} escondida={escondida} />;
}

export function Apresentacao({ blocos: roteiro, formato, so }: Props) {
  const blocos = noTempo(roteiro);
  const marcados = objetivosNoTempo(roteiro);
  const falas: FalaAtiva[] = blocos.flatMap((bloco) => bloco.falas.map((item) => ({ fala: item.fala, inicio: bloco.inicio + item.em, depois: item.depois })));
  const convite = blocos.find((bloco) => bloco.id === "convite");
  // A revisão mede a voz e a música em separado: aí só a trilha é montada (sem imagem, o render sai rápido).
  if (so) return <Trilha blocos={blocos} so={so} />;
  return (
    <FalasDoVideo.Provider value={falas}>
    <AbsoluteFill data-theme="doce" style={{ background: "var(--cor-fundo)" }}>
      {blocos.map((bloco) => {
        const props = { bloco, formato };
        return (
          <Sequence key={bloco.id} name={bloco.titulo} from={q(bloco.inicio)} durationInFrames={q(bloco.fim) - q(bloco.inicio)}>
            {bloco.id === "abertura" ? (
              <Abertura {...props} />
            ) : bloco.id === "truque" ? (
              <Truque {...props} />
            ) : bloco.id === "titulo" ? (
              <Titulo {...props} />
            ) : bloco.id === "mundo" && formato === "16x9" ? (
              <Mundo {...props} />
            ) : bloco.id === "chegando" ? (
              <Chegando {...props} />
            ) : bloco.id === "convite" ? (
              <Convite {...props} marcados={marcados} />
            ) : bloco.id === "pos-creditos" && convite ? (
              <PosCreditos convite={convite} fim={bloco} formato={formato} marcados={marcados} />
            ) : (
              <Cortes {...props} />
            )}
          </Sequence>
        );
      })}
      <Narrador falas={falas} janelas={janelasDoNarrador(blocos)} formato={formato} />
      <Listas blocos={blocos} formato={formato} />
      <Trilha blocos={blocos} />
    </AbsoluteFill>
    </FalasDoVideo.Provider>
  );
}

/** O pós-créditos é a tela final do convite, parada, com o computadorzinho dormindo e o monitor desligando. */
function PosCreditos({ convite, fim, formato, marcados }: { convite: BlocoNoTempo; fim: BlocoNoTempo; formato: Formato; marcados: Marcado[] }) {
  const t = useCurrentFrame() / FPS;
  return <Convite bloco={convite} formato={formato} marcados={marcados} fim={{ t, momentos: fim.momentos ?? {} }} />;
}
