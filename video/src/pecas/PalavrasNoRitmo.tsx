/* Palavras grandes entrando no ritmo dos cortes (Nunito 800), num cartão claro para dar contraste sobre a gravação. */
import { FONTE_UI } from "../fontes";
import { elastico, rampa, sai } from "../lib/tempo";

type Props = {
  palavra: string;
  /** Segundos desde que a palavra entrou. */
  t: number;
  duracao: number;
  letra?: number;
  /** Alterna a inclinação e a cor a cada palavra. */
  indice?: number;
};

const CORES = ["var(--cor-primaria)", "var(--cor-secundaria)", "var(--cor-sucesso)", "var(--cor-primaria)", "var(--cor-secundaria)"];

export function PalavraNoRitmo({ palavra, t, duracao, letra = 112, indice = 0 }: Props) {
  if (t < 0 || t > duracao) return null;
  const entrada = rampa(t, 0, 0.26, elastico);
  const saida = 1 - rampa(t, duracao - 0.12, duracao, sai);
  const giro = (indice % 2 === 0 ? -3 : 2.5) * (0.4 + 0.6 * entrada);
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${letra * 0.1}px ${letra * 0.36}px ${letra * 0.14}px`,
        borderRadius: letra * 0.32,
        border: `${Math.round(letra * 0.055)}px solid var(--cor-borda)`,
        background: "var(--cor-superficie)",
        boxShadow: `0 ${Math.round(letra * 0.11)}px 0 var(--cor-sombra)`,
        fontFamily: FONTE_UI,
        fontSize: letra,
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: "-0.01em",
        color: CORES[indice % CORES.length],
        transform: `rotate(${giro}deg) scale(${entrada * (0.92 + 0.08 * saida)})`,
        transformOrigin: "20% 60%",
        opacity: Math.min(1, entrada * 1.5) * saida,
      }}
    >
      {palavra}
    </div>
  );
}
