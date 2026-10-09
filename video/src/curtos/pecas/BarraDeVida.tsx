/*
 * A barra de vida do chefão, com o nome. A VIDA só cai quando um teste de
 * verdade fica verde na gravação (um quarto por teste: são quatro casos); o
 * ESCUDO, de três pedaços, quebra nos três golpes da investigação (pausar,
 * achar, consertar). Um cartão de superfície por trás: o texto nunca fica
 * solto sobre a gravação.
 */
import { spring } from "remotion";
import { FONTE_UI } from "../../fontes";
import { FPS } from "../../roteiro";
import { rampa, sai } from "../../lib/tempo";

type Props = {
  /** "CHEFÃO: O HORÁRIO REPETIDO": antes dos dois-pontos vira a etiqueta; depois, o nome. */
  nome: string;
  largura: number;
  t: number;
  /** Os instantes (s) em que cada pedaço do escudo quebra. */
  golpes: number[];
  /** Os instantes (s) em que cada teste fica verde. */
  testes: number[];
  /** O rótulo do escudo. */
  escudo: string;
};

export function BarraDeVida({ nome, largura, t, golpes, testes, escudo }: Props) {
  const [etiqueta, titulo] = nome.split(": ");
  const partes = testes.length;
  const perdidas = testes.filter((quando) => t >= quando).length;
  const ultima = testes.filter((quando) => t >= quando).at(-1);
  const vida = (partes - perdidas) / partes;
  // O pedaço que acabou de sair fica claro por um instante e some (como nos jogos de luta).
  const fantasma = ultima === undefined ? 0 : 1 - rampa(t, ultima + 0.12, ultima + 0.4, sai);
  const tranco = ultima === undefined ? 0 : 1 - spring({ frame: Math.round((t - ultima) * FPS), fps: FPS, config: { damping: 9, stiffness: 320, mass: 0.5 } });
  const interno = largura - 40 - 12;
  return (
    <div style={{ width: largura, boxSizing: "border-box", padding: "14px 20px 20px", borderRadius: 30, border: "6px solid var(--cor-secundaria)", background: "var(--cor-superficie)", boxShadow: "0 10px 0 var(--cor-primaria)", fontFamily: FONTE_UI, fontWeight: 900, lineHeight: 1, transform: `translateX(${Math.sin(tranco * Math.PI * 3) * 10 * tranco}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ padding: "4px 20px 7px", borderRadius: 14, background: "var(--cor-primaria)", color: "var(--cor-texto-sobre-primaria)", fontSize: 60, letterSpacing: "0.03em" }}>{etiqueta}</span>
        <span style={{ flex: 1 }} />
        <span aria-label={escudo} style={{ display: "flex", gap: 10 }}>
          {golpes.map((quando, i) => {
            const quebrou = t >= quando;
            const estilhaco = quebrou ? rampa(t, quando, quando + 0.3, sai) : 0;
            return (
              <svg key={quando} viewBox="0 0 40 46" width={50} height={58} overflow="visible">
                <path d="M20 3 L36 9 V23 Q36 36 20 43 Q4 36 4 23 V9 Z" fill={quebrou ? "var(--cor-fundo)" : "var(--cor-secundaria)"} stroke={quebrou ? "var(--cor-borda)" : "var(--cor-texto)"} strokeWidth={4} strokeLinejoin="round" />
                {quebrou ? <path d="M22 5 L15 19 L24 24 L16 41" fill="none" stroke="var(--cor-borda)" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /> : null}
                {estilhaco > 0 && estilhaco < 1
                  ? [0, 1, 2, 3].map((n) => {
                      const angulo = (n / 4) * Math.PI * 2 + i;
                      return <rect key={n} x={20 + Math.cos(angulo) * 34 * estilhaco - 4} y={23 + Math.sin(angulo) * 34 * estilhaco - 4} width={8} height={8} fill="var(--cor-secundaria)" opacity={1 - estilhaco} transform={`rotate(${estilhaco * 200} ${20 + Math.cos(angulo) * 34 * estilhaco} ${23 + Math.sin(angulo) * 34 * estilhaco})`} />;
                    })
                  : null}
              </svg>
            );
          })}
        </span>
      </div>
      <div style={{ marginTop: 10, fontSize: 60, letterSpacing: "0.01em", color: "var(--cor-destaque)", whiteSpace: "nowrap" }}>{titulo}</div>
      <div style={{ position: "relative", marginTop: 12, height: 44, boxSizing: "border-box", borderRadius: 14, border: "6px solid var(--cor-texto)", background: "var(--cor-fundo)", overflow: "hidden" }}>
        {fantasma > 0 ? <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: interno * ((partes - perdidas + 1) / partes), background: "var(--cor-texto)", opacity: fantasma }} /> : null}
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: interno * vida, background: vida <= 0.25 ? "var(--cor-erro)" : "var(--cor-primaria)" }} />
        {Array.from({ length: partes - 1 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: (interno * (i + 1)) / partes - 3, top: 0, width: 6, height: "100%", background: "var(--cor-fundo)" }} />
        ))}
      </div>
    </div>
  );
}

/** Um número de dano saltando (o "-1" do escudo, o "-25" da vida), em cima do cartão da barra. */
export function Dano({ texto, t, x, y, letra = 84 }: { texto: string; t: number; x: number; y: number; letra?: number }) {
  if (t < 0 || t > 0.75) return null;
  const sobe = spring({ frame: Math.round(t * FPS), fps: FPS, config: { damping: 12, stiffness: 240, mass: 0.5 } });
  const some = 1 - rampa(t, 0.5, 0.75, sai);
  return (
    <div style={{ position: "absolute", left: x, top: y - 90 * sobe, padding: `2px ${letra * 0.2}px 6px`, borderRadius: letra * 0.24, border: "6px solid var(--cor-fundo)", background: "var(--cor-destaque)", color: "var(--cor-texto-sobre-destaque)", fontFamily: FONTE_UI, fontSize: letra, fontWeight: 900, lineHeight: 1, whiteSpace: "nowrap", opacity: some, transform: `translateX(-50%) rotate(-6deg) scale(${0.5 + 0.5 * sobe})` }}>
      {texto}
    </div>
  );
}
