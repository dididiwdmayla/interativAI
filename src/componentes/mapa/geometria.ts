/** Um ponto no mapa (coordenadas do desenho, não da tela). */
export type Ponto = { x: number; y: number };

/**
 * Caminho SVG suave passando por todos os pontos (Catmull-Rom convertido
 * em curvas de Bézier). Com um ponto só, devolve um "M" parado.
 */
export function caminhoSuave(pontos: readonly Ponto[], tensao = 0.5): string {
  if (pontos.length === 0) return "";
  const [primeiro] = pontos;
  let d = `M${primeiro.x.toFixed(1)} ${primeiro.y.toFixed(1)}`;
  for (let i = 0; i < pontos.length - 1; i++) {
    const p0 = pontos[i - 1] ?? pontos[i];
    const p1 = pontos[i];
    const p2 = pontos[i + 1];
    const p3 = pontos[i + 2] ?? p2;
    const c1 = { x: p1.x + ((p2.x - p0.x) / 6) * tensao * 2, y: p1.y + ((p2.y - p0.y) / 6) * tensao * 2 };
    const c2 = { x: p2.x - ((p3.x - p1.x) / 6) * tensao * 2, y: p2.y - ((p3.y - p1.y) / 6) * tensao * 2 };
    d += `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Número "aleatório" que sempre dá o mesmo resultado para a mesma semente (0 a 1). */
export function sorteioFixo(semente: number): number {
  const x = Math.sin(semente * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/**
 * Um caminho SVG por trecho (do ponto i ao i+1), com as mesmas curvas do
 * caminho inteiro: dá para pintar cada trecho de um jeito (andado ou não).
 */
export function trechosSuaves(pontos: readonly Ponto[], tensao = 0.5): string[] {
  const trechos: string[] = [];
  for (let i = 0; i < pontos.length - 1; i++) {
    const p0 = pontos[i - 1] ?? pontos[i];
    const p1 = pontos[i];
    const p2 = pontos[i + 1];
    const p3 = pontos[i + 2] ?? p2;
    const c1 = { x: p1.x + ((p2.x - p0.x) / 6) * tensao * 2, y: p1.y + ((p2.y - p0.y) / 6) * tensao * 2 };
    const c2 = { x: p2.x - ((p3.x - p1.x) / 6) * tensao * 2, y: p2.y - ((p3.y - p1.y) / 6) * tensao * 2 };
    trechos.push(
      `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)}C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`,
    );
  }
  return trechos;
}
