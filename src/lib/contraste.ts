/*
 * Contraste entre duas cores, do jeito das diretrizes de acessibilidade
 * (WCAG 2): a luminância relativa de cada cor e a razão (L1 + 0,05) /
 * (L2 + 0,05), de 1:1 (igual) a 21:1 (preto no branco). Texto comum pede
 * pelo menos 4,5:1 (critério 1.4.3, nível AA).
 *
 * Serve o "Salvar como Meu tema" (os pares principais do jogo) e a
 * auditoria do painel Lighthouse (texto contra o fundo).
 */
import { lerCor, type Rgba } from "@/motor/css/valores";

/** O mínimo para texto comum (WCAG 1.4.3, AA). */
export const CONTRASTE_MINIMO = 4.5;

function canalLinear(canal: number): number {
  const valor = canal / 255;
  return valor <= 0.04045 ? valor / 12.92 : ((valor + 0.055) / 1.055) ** 2.4;
}

/** Luminância relativa (0 a 1) de uma cor opaca. */
export function luminancia(cor: Rgba): number {
  return 0.2126 * canalLinear(cor[0]) + 0.7152 * canalLinear(cor[1]) + 0.0722 * canalLinear(cor[2]);
}

/** Uma cor com transparência pintada por cima de outra (o que o olho vê). */
export function misturar(frente: Rgba, fundo: Rgba): Rgba {
  const alfa = frente[3];
  const canal = (indice: number) => frente[indice] * alfa + fundo[indice] * (1 - alfa);
  return [canal(0), canal(1), canal(2), 1];
}

/** A razão de contraste (1 a 21). O texto com transparência é misturado ao fundo (opaco) antes. */
export function razaoDeContraste(texto: Rgba, fundo: Rgba): number {
  const fundoOpaco: Rgba = fundo[3] < 1 ? misturar(fundo, [255, 255, 255, 1]) : fundo;
  const textoVisto = texto[3] < 1 ? misturar(texto, fundoOpaco) : texto;
  const a = luminancia(textoVisto);
  const b = luminancia(fundoOpaco);
  const [claro, escuro] = a > b ? [a, b] : [b, a];
  return (claro + 0.05) / (escuro + 0.05);
}

/** Razão de contraste de dois valores de cor do CSS, ou null se algum não é uma cor que o motor lê. */
export function contrasteEntre(texto: string, fundo: string): number | null {
  const corTexto = lerCor(texto);
  const corFundo = lerCor(fundo);
  return corTexto && corFundo ? razaoDeContraste(corTexto, corFundo) : null;
}

/** "4,5:1", com uma casa, em PT-BR. */
export function formatarContraste(razao: number): string {
  return `${(Math.floor(razao * 10) / 10).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}:1`;
}
