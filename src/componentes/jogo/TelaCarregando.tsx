import { Mascote } from "@/componentes/mascote/Mascote";

/** Aparece enquanto o progresso salvo é lido (e na página estática inicial). */
export function TelaCarregando() {
  return (
    <div className="grid h-dvh place-items-center">
      <div className="flex flex-col items-center gap-3">
        <Mascote expressao="dormindo" tamanho={140} />
        <p className="font-black text-texto-suave">Ligando o computadorzinho...</p>
      </div>
    </div>
  );
}
