/*
 * Bloco 3: o título. Dois sinais, < e >, vêm um de cada lado e se encaixam
 * (como os prédios da arte da ilha Sites); o > vira o sinal do ícone do jogo
 * (src/app/icon.svg) e o nome aparece ao lado, nas cores do cabeçalho.
 */
import { useCurrentFrame } from "remotion";
import numeros from "../../dados/numeros.json";
import { FONTE_UI } from "../../fontes";
import { CHAMADA, TITULO } from "../../roteiro";
import { elastico, mistura, rampa, sai, vaiEVolta } from "../../lib/tempo";
import { Fundo, medidas, tempoDoBloco, type PropsDoBloco } from "./comum";

/** O ícone do jogo, com a geometria de src/app/icon.svg (viewBox 0 0 20 20). `p` desenha a moldura e o tracinho. */
export function Icone({ tamanho, p = 1, sinal = 1 }: { tamanho: number; p?: number; sinal?: number }) {
  const moldura = 56;
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} fill="none" stroke="var(--cor-primaria)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <rect x="2" y="3.5" width="16" height="13" rx="2.5" strokeDasharray={moldura} strokeDashoffset={moldura * (1 - p)} />
      <path d="M5.5 8l2.5 2-2.5 2" opacity={sinal} />
      <path d="M10 12.5h4" strokeDasharray={4} strokeDashoffset={4 * (1 - rampa(p, 0.6, 1))} />
    </svg>
  );
}

function Sinal({ lado, tamanho, cor }: { lado: "<" | ">"; tamanho: number; cor: string }) {
  return (
    <svg viewBox="0 0 60 100" width={tamanho * 0.6} height={tamanho} fill="none" stroke={cor} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" overflow="visible" style={{ display: "block" }}>
      <path d={lado === "<" ? "M46 12 L14 50 L46 88" : "M14 12 L46 50 L14 88"} />
    </svg>
  );
}

export function Titulo({ bloco, formato }: PropsDoBloco) {
  const quadro = useCurrentFrame();
  const t = tempoDoBloco(quadro);
  const m = bloco.momentos ?? {};
  const { l } = medidas(formato);
  const vertical = formato === "9x16";
  // 9:16: o centro útil fica à esquerda dos 120 px dos botões.
  const centroX = vertical ? (l - 120) / 2 + 20 : l / 2;
  const icone = vertical ? 250 : 210;
  const letra = vertical ? 150 : 172;
  // 16:9: o ícone e o nome numa linha só, centralizada (o nome mede ~825 px em Nunito 800 de 172 px).
  const esquerda = (l - (icone + 44 + 825)) / 2;
  const linha = vertical ? { x: centroX, y: 640 } : { x: esquerda + icone / 2, y: 430 };
  const centro = vertical ? { x: centroX, y: 640 } : { x: l / 2, y: 430 };
  const tamanhoDoSinal = vertical ? 300 : 330;

  // 1) Os sinais chegam e se encaixam, com uma batidinha.
  const chega = rampa(t, m.sinais, m.encaixe, sai);
  const batida = 1 + 0.12 * Math.sin(rampa(t, m.encaixe, m.encaixe + 0.22) * Math.PI);
  // 2) O par encolhe e vai para o lugar do ícone; o ícone se desenha.
  const vira = rampa(t, m.nome, m.nome + 0.5, vaiEVolta);
  const parX = mistura(centro.x, linha.x, vira);
  const parY = mistura(centro.y, linha.y, vira);
  const parEscala = batida * mistura(1, (icone / tamanhoDoSinal) * 0.42, vira);
  const afastamento = mistura(l * 0.62, tamanhoDoSinal * 0.34, chega);
  const desenho = rampa(t, m.nome + 0.12, m.nome + 0.62, vaiEVolta);
  const letras = [...TITULO];
  // Depois de montado, o título continua chegando devagar (nenhum plano fica parado).
  const deriva = 1 + 0.035 * rampa(t, m.nome, bloco.fim - bloco.inicio);
  return (
    <Fundo>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${deriva})`, transformOrigin: vertical ? `${centroX}px 45%` : "50% 50%" }}>
      {/* Os dois sinais */}
      <div style={{ position: "absolute", left: parX, top: parY, width: 0, height: 0, transform: `scale(${parEscala})`, opacity: 1 - rampa(vira, 0.75, 1) }}>
        <div style={{ position: "absolute", left: -afastamento - tamanhoDoSinal * 0.3, top: -tamanhoDoSinal / 2 }}>
          <Sinal lado="<" tamanho={tamanhoDoSinal} cor="var(--cor-primaria)" />
        </div>
        <div style={{ position: "absolute", left: afastamento - tamanhoDoSinal * 0.3, top: -tamanhoDoSinal / 2 }}>
          <Sinal lado=">" tamanho={tamanhoDoSinal} cor="var(--cor-secundaria)" />
        </div>
      </div>
      {/* O ícone e o nome */}
      <div style={{ position: "absolute", left: linha.x - icone / 2, top: linha.y - icone / 2, opacity: rampa(vira, 0.55, 0.95) }}>
        <Icone tamanho={icone} p={desenho} />
      </div>
      <div
        style={
          vertical
            ? { position: "absolute", left: 0, width: centroX * 2, top: 780, textAlign: "center", fontFamily: FONTE_UI, fontSize: letra, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--cor-primaria)" }
            : { position: "absolute", left: esquerda + icone + 44, top: linha.y - letra * 0.58, fontFamily: FONTE_UI, fontSize: letra, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--cor-primaria)", whiteSpace: "nowrap" }
        }
      >
        {letras.map((caractere, indice) => {
          const p = rampa(t, m.nome + 0.2 + indice * 0.035, m.nome + 0.46 + indice * 0.035, elastico);
          return (
            <span key={indice} style={{ display: "inline-block", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * letra * 0.3}px) scale(${0.7 + 0.3 * p})` }}>
              {caractere}
            </span>
          );
        })}
      </div>
      {/* A chamada */}
      <div style={{ position: "absolute", left: 0, width: vertical ? centroX * 2 : l, top: vertical ? 1000 : 610, display: "flex", flexDirection: "column", alignItems: "center", gap: vertical ? 14 : 10, fontFamily: FONTE_UI, fontSize: vertical ? 60 : 62, fontWeight: 800, lineHeight: 1.15, color: "var(--cor-texto)", textAlign: "center" }}>
        {CHAMADA.map((frase, indice) => {
          const p = rampa(t, m.chamada + indice * 0.32, m.chamada + 0.34 + indice * 0.32, sai);
          return (
            <div key={frase} style={{ opacity: p, transform: `translateY(${(1 - p) * 34}px)`, maxWidth: vertical ? 880 : undefined, color: indice === 0 ? "var(--cor-texto)" : "var(--cor-texto-suave)" }}>
              {frase}
            </div>
          );
        })}
      </div>
      {/* O número vem do código (scripts/contar.mjs), nunca escrito à mão. */}
      <div style={{ position: "absolute", left: 0, width: vertical ? centroX * 2 : l, top: vertical ? 1250 : 810, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: vertical ? "20px 40px" : "18px 40px",
            borderRadius: 999,
            border: "5px solid var(--cor-borda)",
            background: "var(--cor-superficie)",
            boxShadow: "0 8px 0 var(--cor-sombra)",
            fontFamily: FONTE_UI,
            fontSize: vertical ? 44 : 42,
            fontWeight: 800,
            color: "var(--cor-texto)",
            transform: `scale(${rampa(t, m.numeros, m.numeros + 0.34, elastico)})`,
          }}
        >
          Mais de <span style={{ color: "var(--cor-primaria)", fontWeight: 900 }}>{numeros.maisDeFases} fases</span> para jogar hoje
        </div>
      </div>
      </div>
    </Fundo>
  );
}
