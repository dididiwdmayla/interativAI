/*
 * Um personagem montado com o kit de clientes do jogo (src/componentes/contrato/kit):
 * o corpo com a roupa, o cabelo (atrás e na frente), o rosto com a expressão e os
 * acessórios. As peças do kit são SVG puro e vêm direto do jogo; a montagem, o
 * piscar, o respiro, a cabeça que inclina e pula e os enfeites de cada expressão
 * são recriados aqui, pelo quadro.
 *
 * Original: src/componentes/contrato/Cliente.tsx (anima com Framer Motion, que no
 * render sai fora de sincronia; por isso não é importado).
 *
 * Serve para o aprendiz de "O aprendiz" (uma combinação do kit que nenhum cliente
 * do jogo usa) e para a Dona Zélia de "O chefão" (a aparência dela, de
 * src/motor/contrato/clientes.ts).
 */
import { Acessorios } from "@jogo/componentes/contrato/kit/Acessorios";
import { CabeloAtras, CabeloFrente } from "@jogo/componentes/contrato/kit/Cabelo";
import { CABECA, CONTORNO, coresDe, cor, SOMBRA } from "@jogo/componentes/contrato/kit/estilo";
import { RostoCliente } from "@jogo/componentes/contrato/kit/Rosto";
import { Corpo } from "@jogo/componentes/contrato/kit/Roupa";
import type { Acessorio, AparenciaCliente } from "@jogo/motor/contrato/clientes";
import { formaDaLetra, type ExpressaoCliente } from "@jogo/motor/contrato/expressoes";
import { FPS } from "../../roteiro";
import { mistura } from "../../lib/tempo";
import { piscada } from "../../pecas/MascoteVideo";

export type { ExpressaoCliente };

/** O viewBox do retrato do jogo. */
export const VISTA_DO_RETRATO = { x: 0, y: -12, l: 140, a: 162 } as const;

const INCLINACAO: Record<ExpressaoCliente, number> = { feliz: 0, pensativo: -6, preocupado: 0, empolgado: 0, satisfeito: 4 };

/** Vai e volta suave (0 -> 1 -> 0) num ciclo de `periodo` segundos. */
const onda = (segundos: number, periodo: number, atraso = 0): number => 0.5 - 0.5 * Math.cos(((segundos - atraso) / periodo) * Math.PI * 2);

/** Os enfeites de cada expressão, fora do rosto: a mão no queixo, a gota, os brilhos e os risquinhos (os do Cliente.tsx). */
function Enfeites({ expressao, segundos, pele }: { expressao: ExpressaoCliente; segundos: number; pele: string }) {
  const { x, y, rx } = CABECA;
  switch (expressao) {
    case "pensativo":
      return (
        <g>
          <path d="M80 96 Q84 86 92 86 Q100 87 98 96 Q96 106 86 106 Q80 104 80 96 Z" fill={pele} {...CONTORNO} />
          <path d="M86 88 Q90 82 94 84" fill="none" stroke="var(--cor-cliente-rosto)" strokeOpacity={0.3} strokeWidth={1.4} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={x + rx + 8 + i * 7} cy={y - 30 - i * 8} r={2 + i} fill={cor("branco")} {...CONTORNO} opacity={0.3 + 0.7 * onda(segundos, 1.6, i * 0.25)} />
          ))}
        </g>
      );
    case "preocupado": {
      const p = onda(segundos, 1.8);
      return <path d={`M${x + rx - 2} ${y - 22} q4 7 0 10 q-4 -3 0 -10 z`} fill="var(--cor-cliente-lente-vidro)" stroke="var(--cor-secundaria)" strokeWidth={1.4} transform={`translate(0 ${6 * p})`} opacity={1 - 0.4 * p} />;
    }
    case "empolgado":
      return (
        <g fill="var(--cor-cliente-roupa-amarelo)">
          {[
            [18, 40, 0],
            [118, 30, 0.3],
            [124, 74, 0.6],
          ].map(([cx, cy, atraso]) => {
            const p = onda(segundos, 1.1, atraso);
            return (
              <path
                key={cx}
                d={`M${cx} ${cy - 7} L${cx + 2} ${cy - 2} L${cx + 7} ${cy} L${cx + 2} ${cy + 2} L${cx} ${cy + 7} L${cx - 2} ${cy + 2} L${cx - 7} ${cy} L${cx - 2} ${cy - 2} Z`}
                transform={`translate(${cx} ${cy}) scale(${0.6 + 0.5 * p}) translate(${-cx} ${-cy})`}
                opacity={0.5 + 0.5 * p}
              />
            );
          })}
        </g>
      );
    case "satisfeito":
      return (
        <g stroke="var(--cor-cliente-roupa-amarelo)" strokeWidth={2.4} strokeLinecap="round">
          <path d="M20 54 L28 58 M18 66 L27 66 M20 78 L28 74" />
          <path d="M120 54 L112 58 M122 66 L113 66 M120 78 L112 74" />
        </g>
      );
    default:
      return null;
  }
}

/** Um brilho de quatro pontas (o prêmio chegando ou sumindo). */
function Brilho({ x, y, raio, opacidade }: { x: number; y: number; raio: number; opacidade: number }) {
  if (opacidade <= 0.01 || raio <= 0) return null;
  const f = raio * 0.26;
  return <path d={`M${x} ${y - raio} L${x + f} ${y - f} L${x + raio} ${y} L${x + f} ${y + f} L${x} ${y + raio} L${x - f} ${y + f} L${x - raio} ${y} L${x - f} ${y - f} Z`} fill="var(--cor-destaque)" stroke={cor("branco")} strokeWidth={1.2} strokeLinejoin="round" opacity={opacidade} />;
}

/** Onde fica o meio de cada acessório na cabeça (unidades do retrato), para o brilho. */
const MEIO_DO_ACESSORIO: Partial<Record<Acessorio, { x: number; y: number }>> = { bone: { x: 78, y: 40 }, oculos: { x: 70, y: 68 } };

export type PremioVoando = {
  item: Acessorio;
  /** 0: saindo de `de`; 1: no lugar. */
  p: number;
  /** De onde ele vem, em unidades do retrato (em relação ao lugar dele na cabeça). */
  de: { x: number; y: number };
};

type Props = {
  aparencia: AparenciaCliente;
  /** Largura em px (a altura segue o viewBox do retrato, 140 x 162). */
  tamanho: number;
  /** O quadro atual (para piscar, respirar e animar os enfeites). */
  quadro: number;
  expressao: ExpressaoCliente;
  /** A expressão anterior e quanto da troca já passou (0 a 1): o rosto troca num fundido curto, como no jogo. */
  anterior?: ExpressaoCliente;
  troca?: number;
  /** Falando: a última letra que apareceu no balão (a boca abre nas vogais). */
  letra?: string;
  /** Os acessórios que ele usa agora (no lugar dos da aparência). */
  acessorios?: readonly Acessorio[];
  /** Um prêmio chegando voando. */
  voando?: PremioVoando;
  /** Os acessórios sumindo num brilho: 0 (ainda aí) a 1 (sumiram). */
  sumindo?: number;
  /** Um pulo a mais (0 a 1), além do da expressão empolgada. */
  pulo?: number;
  /** Fecha os olhos (uma piscada de propósito). */
  piscando?: boolean;
  semente?: number;
  enfeites?: boolean;
  /** A duração do vídeo em laço (s): o respiro e os enfeites fecham ciclos inteiros nesse tempo, para o último quadro emendar no primeiro. */
  laco?: number;
};

export function Personagem({ aparencia, tamanho, quadro, expressao, anterior, troca = 1, letra, acessorios, voando, sumindo = 0, pulo = 0, piscando = false, semente = 11, enfeites = true, laco }: Props) {
  const cores = coresDe(aparencia);
  const segundos = quadro / FPS;
  /** Um período perto do pedido que cabe um número inteiro de vezes no laço. */
  const periodo = (pedido: number): number => (laco ? laco / Math.max(1, Math.round(laco / pedido)) : pedido);
  const respiro = onda(segundos, periodo(3.6));
  const olhosFechados = piscando || (expressao !== "satisfeito" && piscada(segundos, semente) < 0.6);
  const boca = letra === undefined ? null : formaDaLetra(letra);
  const inclinacao = mistura(anterior ? INCLINACAO[anterior] : INCLINACAO[expressao], INCLINACAO[expressao], troca);
  const empolgacao = (expressao === "empolgado" ? troca : anterior === "empolgado" ? 1 - troca : 0) * Math.abs(Math.sin((segundos / 0.5) * Math.PI));
  const falando = letra !== undefined ? Math.abs(Math.sin((segundos / 0.32) * Math.PI)) : 0;
  const sobe = -5 * empolgacao - 1.2 * falando - 9 * pulo;
  const usados = acessorios ?? aparencia.acessorios ?? [];
  const v = VISTA_DO_RETRATO;
  return (
    <svg viewBox={`${v.x} ${v.y} ${v.l} ${v.a}`} width={tamanho} height={(tamanho * v.a) / v.l} overflow="visible" style={{ display: "block" }}>
      {/* Respira: o corpo inteiro cresce um tiquinho e volta, devagar. */}
      <g transform={`translate(70 150) scale(${1 + 0.006 * respiro} ${1 + 0.018 * respiro}) translate(-70 -150)`}>
        <Corpo roupa={aparencia.roupa} cores={cores} />
        {/* A cabeça: inclina para pensar, pula de empolgação e balança um pouco falando. */}
        <g transform={`translate(0 ${sobe}) rotate(${inclinacao} 70 100)`}>
          <CabeloAtras cabelo={aparencia.cabelo} cor={cores.cabelo} />
          <circle cx={CABECA.x - CABECA.rx} cy={CABECA.y + 4} r={7} fill={cores.pele} {...CONTORNO} />
          <circle cx={CABECA.x + CABECA.rx} cy={CABECA.y + 4} r={7} fill={cores.pele} {...CONTORNO} />
          <ellipse cx={CABECA.x} cy={CABECA.y} rx={CABECA.rx} ry={CABECA.ry} fill={cores.pele} {...CONTORNO} />
          <path d={`M${CABECA.x - CABECA.rx + 4} ${CABECA.y + 14} Q${CABECA.x} ${CABECA.y + CABECA.ry + 8} ${CABECA.x + CABECA.rx - 4} ${CABECA.y + 14} Q${CABECA.x} ${CABECA.y + CABECA.ry - 2} ${CABECA.x - CABECA.rx + 4} ${CABECA.y + 14} Z`} {...SOMBRA} />
          {anterior && troca < 1 ? (
            <g opacity={1 - troca}>
              <RostoCliente expressao={anterior} piscando={false} boca={null} />
            </g>
          ) : null}
          <g opacity={anterior ? troca : 1}>
            <RostoCliente expressao={expressao} piscando={olhosFechados} boca={boca} />
          </g>
          <CabeloFrente cabelo={aparencia.cabelo} cor={cores.cabelo} />
          <g opacity={1 - sumindo}>
            <Acessorios lista={usados} corRoupa={cores.roupa} />
          </g>
          {sumindo > 0 && sumindo < 1
            ? usados.map((item, indice) => {
                const meio = MEIO_DO_ACESSORIO[item];
                return meio ? <Brilho key={item} x={meio.x} y={meio.y} raio={(14 + indice * 4) * Math.sin(sumindo * Math.PI)} opacidade={Math.sin(sumindo * Math.PI)} /> : null;
              })
            : null}
          {voando ? (
            <g>
              <g transform={`translate(${voando.de.x * (1 - voando.p)} ${voando.de.y * (1 - voando.p) - 26 * Math.sin(voando.p * Math.PI)}) rotate(${-50 * (1 - voando.p)} 70 60) translate(70 60) scale(${mistura(1.9, 1, voando.p)}) translate(-70 -60)`}>
                <Acessorios lista={[voando.item]} corRoupa={cores.roupa} />
              </g>
              {(() => {
                const meio = MEIO_DO_ACESSORIO[voando.item] ?? { x: 70, y: 60 };
                const chegada = Math.max(0, (voando.p - 0.8) / 0.2);
                return <Brilho x={meio.x + 22} y={meio.y - 14} raio={16 * Math.sin(chegada * Math.PI)} opacidade={Math.sin(chegada * Math.PI)} />;
              })()}
            </g>
          ) : null}
        </g>
      </g>
      {enfeites ? (
        <g opacity={anterior ? troca : 1}>
          <Enfeites expressao={expressao} segundos={laco ? (segundos * Math.max(1, Math.round(laco / 1.8))) / (laco / 1.8) : segundos} pele={cores.pele} />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * Um prêmio no ar, por cima de tudo: o acessório voando até o lugar dele na cabeça do personagem.
 * Fica no mesmo lugar e no mesmo tamanho do Personagem (o mesmo viewBox), mas fora do recorte da
 * câmera de streamer, para aparecer chegando de longe. `de`: de onde ele sai, em unidades do retrato,
 * em relação ao meio do retrato.
 */
export function PremioNoAr({ aparencia, tamanho, item, p, de }: { aparencia: AparenciaCliente; tamanho: number; item: Acessorio; p: number; de: { x: number; y: number } }) {
  const cores = coresDe(aparencia);
  const v = VISTA_DO_RETRATO;
  const meio = MEIO_DO_ACESSORIO[item] ?? { x: 70, y: 60 };
  // A posição de saída, em relação ao lugar do acessório (o meio do retrato é 70, 69).
  const dx = (70 + de.x - meio.x) * (1 - p);
  const dy = (v.y + v.a / 2 + de.y - meio.y) * (1 - p) - 34 * Math.sin(p * Math.PI);
  const escala = mistura(2.4, 1, p);
  const chegada = Math.max(0, (p - 0.75) / 0.25);
  return (
    <svg viewBox={`${v.x} ${v.y} ${v.l} ${v.a}`} width={tamanho} height={(tamanho * v.a) / v.l} overflow="visible" style={{ display: "block" }}>
      <g transform={`translate(${dx} ${dy}) translate(${meio.x} ${meio.y}) rotate(${-70 * (1 - p)}) scale(${escala}) translate(${-meio.x} ${-meio.y})`}>
        <Acessorios lista={[item]} corRoupa={cores.roupa} />
      </g>
      {[0, 1, 2].map((i) => {
        const atras = Math.max(0, p - 0.08 * (i + 1));
        return <Brilho key={i} x={meio.x + (70 + de.x - meio.x) * (1 - atras) + (i - 1) * 9} y={meio.y + (v.y + v.a / 2 + de.y - meio.y) * (1 - atras) - 34 * Math.sin(atras * Math.PI) + 10} raio={(9 - i * 2) * Math.sin(Math.min(1, p * 1.1) * Math.PI) + 3} opacidade={0.9 * (1 - chegada)} />;
      })}
      <Brilho x={meio.x + 24} y={meio.y - 16} raio={20 * Math.sin(chegada * Math.PI)} opacidade={Math.sin(chegada * Math.PI)} />
    </svg>
  );
}
