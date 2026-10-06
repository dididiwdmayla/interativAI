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

/** Um retângulo de cantos redondos (o chão de uma ilha). */
export type Arredondado = { x: number; y: number; largura: number; altura: number; raio: number };

/** O mesmo retângulo arredondado, para dentro (folga positiva) ou para fora (negativa). */
export function encolher(caixa: Arredondado, folga: number): Arredondado {
  return {
    x: caixa.x + folga,
    y: caixa.y + folga,
    largura: caixa.largura - 2 * folga,
    altura: caixa.altura - 2 * folga,
    raio: Math.max(0, caixa.raio - folga),
  };
}

/** O ponto está dentro do retângulo arredondado? */
export function dentroDoArredondado(caixa: Arredondado, ponto: Ponto): boolean {
  const raio = Math.min(caixa.raio, caixa.largura / 2, caixa.altura / 2);
  if (ponto.x < caixa.x || ponto.x > caixa.x + caixa.largura || ponto.y < caixa.y || ponto.y > caixa.y + caixa.altura) return false;
  const dx = Math.max(caixa.x + raio - ponto.x, 0, ponto.x - (caixa.x + caixa.largura - raio));
  const dy = Math.max(caixa.y + raio - ponto.y, 0, ponto.y - (caixa.y + caixa.altura - raio));
  return dx * dx + dy * dy <= raio * raio;
}

/**
 * Pontos em volta do retângulo arredondado (no sentido do relógio, começando
 * no alto à esquerda), cada um com a normal para fora: a base do contorno
 * orgânico das ilhas.
 */
export function amostrarContorno(caixa: Arredondado, passo: number): { ponto: Ponto; normal: Ponto }[] {
  const { x, y, largura: w, altura: h } = caixa;
  const r = Math.min(caixa.raio, w / 2, h / 2);
  const reto = (de: Ponto, ate: Ponto, normal: Ponto) => ({ comprimento: Math.hypot(ate.x - de.x, ate.y - de.y), em: (t: number) => ({ ponto: { x: de.x + (ate.x - de.x) * t, y: de.y + (ate.y - de.y) * t }, normal }) });
  const arco = (centro: Ponto, de: number) => ({
    comprimento: (Math.PI / 2) * r,
    em: (t: number) => {
      const angulo = de + (Math.PI / 2) * t;
      const normal = { x: Math.cos(angulo), y: Math.sin(angulo) };
      return { ponto: { x: centro.x + normal.x * r, y: centro.y + normal.y * r }, normal };
    },
  });
  const trechos = [
    reto({ x: x + r, y }, { x: x + w - r, y }, { x: 0, y: -1 }),
    arco({ x: x + w - r, y: y + r }, -Math.PI / 2),
    reto({ x: x + w, y: y + r }, { x: x + w, y: y + h - r }, { x: 1, y: 0 }),
    arco({ x: x + w - r, y: y + h - r }, 0),
    reto({ x: x + w - r, y: y + h }, { x: x + r, y: y + h }, { x: 0, y: 1 }),
    arco({ x: x + r, y: y + h - r }, Math.PI / 2),
    reto({ x, y: y + h - r }, { x, y: y + r }, { x: -1, y: 0 }),
    arco({ x: x + r, y: y + r }, Math.PI),
  ];
  const total = trechos.reduce((soma, trecho) => soma + trecho.comprimento, 0);
  const quantos = Math.max(12, Math.round(total / passo));
  const amostras: { ponto: Ponto; normal: Ponto }[] = [];
  for (let i = 0; i < quantos; i++) {
    let resto = (i * total) / quantos;
    for (const trecho of trechos) {
      if (resto <= trecho.comprimento || trecho === trechos[trechos.length - 1]) {
        amostras.push(trecho.em(trecho.comprimento ? Math.min(1, resto / trecho.comprimento) : 0));
        break;
      }
      resto -= trecho.comprimento;
    }
  }
  return amostras;
}

/** Caminho SVG fechado e suave passando pelos pontos (Catmull-Rom). */
export function caminhoFechado(pontos: readonly Ponto[]): string {
  const n = pontos.length;
  if (n < 3) return "";
  const p = (i: number) => pontos[(i + n) % n];
  let d = `M${p(0).x.toFixed(1)} ${p(0).y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return `${d}Z`;
}

/** Pontos ao longo do caminho suave (as mesmas curvas de `caminhoSuave`), mais ou menos a cada `passo`. */
export function amostrasDoCaminho(pontos: readonly Ponto[], passo: number, tensao = 0.5): Ponto[] {
  const amostras: Ponto[] = pontos.length ? [pontos[0]] : [];
  for (let i = 0; i < pontos.length - 1; i++) {
    const p0 = pontos[i - 1] ?? pontos[i];
    const p1 = pontos[i];
    const p2 = pontos[i + 1];
    const p3 = pontos[i + 2] ?? p2;
    const c1 = { x: p1.x + ((p2.x - p0.x) / 6) * tensao * 2, y: p1.y + ((p2.y - p0.y) / 6) * tensao * 2 };
    const c2 = { x: p2.x - ((p3.x - p1.x) / 6) * tensao * 2, y: p2.y - ((p3.y - p1.y) / 6) * tensao * 2 };
    const quantos = Math.max(2, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / passo));
    for (let k = 1; k <= quantos; k++) {
      const t = k / quantos;
      const u = 1 - t;
      amostras.push({
        x: u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x,
        y: u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y,
      });
    }
  }
  return amostras;
}
