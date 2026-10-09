/*
 * A câmera das tomadas: aproxima até uma caixa registrada no take.json (ou
 * uma área, ou o quadro inteiro) e volta, sempre por quadro.
 */
import type { Area, Foco, QuadroDaCamera } from "../roteiro";
import { caixa, escalaDa, type Take } from "./tomadas";
import { mistura, rampa, vaiEVolta } from "./tempo";

/** O teto da aproximação no 16:9 (acima disso a gravação pixela). */
export const ZOOM_MAXIMO = 1.8;

export type Vista = { zoom: number; cx: number; cy: number };

/** A vista (zoom e centro, em px do vídeo da tomada) de um foco. */
export function vistaDoFoco(take: Take, foco: Foco, largura: number, altura: number, teto = ZOOM_MAXIMO): Vista {
  let zoom: number;
  let cx: number;
  let cy: number;
  if ("tudo" in foco) {
    zoom = foco.zoom ?? 1;
    cx = (foco.cx ?? 0.5) * largura;
    cy = (foco.cy ?? 0.5) * altura;
  } else {
    const area: Area = "caixa" in foco ? caixa(take, foco.caixa) : foco.area;
    const k = escalaDa(take);
    const margem = foco.margem ?? 60;
    const l = area.l * k + margem * 2;
    const a = area.a * k + margem * 2;
    zoom = Math.max(1, Math.min(foco.zoom ?? teto, teto, largura / l, altura / a));
    cx = (area.x + area.l / 2) * k;
    cy = (area.y + area.a / 2) * k;
  }
  // A vista nunca sai do quadro gravado.
  const meiaL = largura / (2 * zoom);
  const meiaA = altura / (2 * zoom);
  return { zoom, cx: Math.min(largura - meiaL, Math.max(meiaL, cx)), cy: Math.min(altura - meiaA, Math.max(meiaA, cy)) };
}

/** A vista no instante `t` do corte (s), entre os quadros da câmera. */
export function vistaEm(take: Take, quadros: QuadroDaCamera[] | undefined, t: number, largura: number, altura: number, teto = ZOOM_MAXIMO): Vista {
  if (!quadros || quadros.length === 0) return { zoom: 1, cx: largura / 2, cy: altura / 2 };
  let vista = vistaDoFoco(take, quadros[0].foco, largura, altura, teto);
  for (let i = 1; i < quadros.length; i++) {
    const quadro = quadros[i];
    const leva = quadro.leva ?? 0.6;
    const p = rampa(t, quadro.em - leva, quadro.em, vaiEVolta);
    if (p <= 0) break;
    const alvo = vistaDoFoco(take, quadro.foco, largura, altura, teto);
    // O zoom anda em escala logarítmica: a aproximação parece constante.
    vista = { zoom: Math.exp(mistura(Math.log(vista.zoom), Math.log(alvo.zoom), p)), cx: mistura(vista.cx, alvo.cx, p), cy: mistura(vista.cy, alvo.cy, p) };
  }
  return vista;
}

/** O transform CSS que mostra a vista num quadro de `largura` x `altura`. */
export function transformDaVista(vista: Vista, largura: number, altura: number): string {
  return `translate(${largura / 2 - vista.cx * vista.zoom}px, ${altura / 2 - vista.cy * vista.zoom}px) scale(${vista.zoom})`;
}
