/*
 * O estilo do kit de cenas: cores só por tokens (--cor-cena-*, em
 * src/tema/tokens.css), contorno fino e suave, luz e sombra por camadas
 * (uma cor de base e a "-sombra" dela no lado de baixo ou da direita).
 * Toda peça nova segue isto: ver o guia, seção 30 ("Como acrescentar
 * peças ao kit").
 */
/** var(--cor-cena-<nome>). */
export function cor(nome: string): string {
  return `var(--cor-cena-${nome})`;
}

/** O contorno de toda peça: fino, arredondado e transparente (não pesa no desenho). */
export const CONTORNO = {
  stroke: "var(--cor-cena-contorno)",
  strokeOpacity: 0.3,
  strokeWidth: 1.1,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

/** A sombra no chão, embaixo de um móvel ou de uma pessoa. */
export function SombraNoChao({ x, y, largura }: { x: number; y: number; largura: number }) {
  return <ellipse cx={x} cy={y} rx={largura / 2} ry={Math.max(1.5, largura / 14)} fill="var(--cor-cena-escuro)" opacity={0.18} />;
}
