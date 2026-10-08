/*
 * Onde a vida do mar mora no desenho do mundo: os lugares de mar aberto
 * (longe das ilhas, das etiquetas e do Porto), escolhidos espalhados, e a
 * viagem do barquinho pela rota, ilha por ilha, ida e volta. Tudo em
 * unidades do desenho (desenhoMundo.ts). Puro, testado em
 * testes/conteudo/mapa.test.ts.
 */
import { type Ponto, sorteioFixo } from "../geometria";

/** O que cada ilha ocupa em volta do centro: a arte em cima e a etiqueta embaixo. */
const ILHA = { raioX: 175, acima: 115, abaixo: 150 } as const;
const PORTO = { raioX: 150, raioY: 95 } as const;
const MARGEM = 34;

/** A ilha (com a etiqueta) cobre este ponto? */
function pertoDaIlha(ponto: Ponto, ilha: Ponto, folga = 1): boolean {
  const dx = (ponto.x - ilha.x) / (ILHA.raioX * folga);
  const dy = (ponto.y - ilha.y) / ((ponto.y < ilha.y ? ILHA.acima : ILHA.abaixo) * folga);
  return dx * dx + dy * dy < 1;
}

/**
 * Os lugares de mar aberto numa grade fixa (passo em unidades): longe de
 * toda ilha, da etiqueta dela e do Porto, e das bordas do desenho.
 */
export function lugaresDoMar(largura: number, altura: number, ilhas: readonly Ponto[], porto: Ponto | null, passo = 48): Ponto[] {
  const lugares: Ponto[] = [];
  for (let y = MARGEM; y <= altura - MARGEM; y += passo) {
    for (let x = MARGEM; x <= largura - MARGEM; x += passo) {
      const ponto = { x, y };
      if (ilhas.some((ilha) => pertoDaIlha(ponto, ilha))) continue;
      if (porto && ((x - porto.x) / PORTO.raioX) ** 2 + ((y - porto.y) / PORTO.raioY) ** 2 < 1) continue;
      lugares.push(ponto);
    }
  }
  return lugares;
}

/**
 * `quantos` lugares bem espalhados (o próximo é sempre o mais longe dos já
 * escolhidos), começando por um sorteado pela semente: o mesmo mundo dá
 * sempre os mesmos lugares.
 */
export function espalhados(lugares: readonly Ponto[], quantos: number, semente: number): Ponto[] {
  if (lugares.length === 0 || quantos <= 0) return [];
  const escolhidos = [lugares[Math.floor(sorteioFixo(semente) * lugares.length) % lugares.length]];
  while (escolhidos.length < Math.min(quantos, lugares.length)) {
    let melhor = lugares[0];
    let maior = -1;
    for (const lugar of lugares) {
      const menor = Math.min(...escolhidos.map((e) => (e.x - lugar.x) ** 2 + (e.y - lugar.y) ** 2));
      if (menor > maior) {
        maior = menor;
        melhor = lugar;
      }
    }
    escolhidos.push(melhor);
  }
  return escolhidos;
}

/** Um quadro da viagem do barquinho: onde ele está, a inclinação (graus), se está virado (voltando) e em que parte da viagem (0 a 1). */
export type QuadroDoBarco = { x: number; y: number; angulo: number; virado: boolean; offset: number };

type Opcoes = {
  /** Quantos pontos por trecho de rota. */
  amostras?: number;
  /** Quanto o barquinho para em cada ilha, em fração do tempo de um trecho. */
  parada?: number;
  /** A distância do centro da ilha onde ele encosta (a praia), em unidades. */
  folga?: number;
  /** O barquinho anda um pouco abaixo da linha pontilhada (não em cima dela). */
  abaixo?: number;
};

/** O ponto da curva de Bézier cúbica em t. */
function bezier(p1: Ponto, c1: Ponto, c2: Ponto, p2: Ponto, t: number): Ponto {
  const u = 1 - t;
  return {
    x: u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x,
    y: u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y,
  };
}

/**
 * A viagem do barquinho pela rota (as mesmas curvas da linha pontilhada,
 * caminhoSuave com tensão 0,5): sai da praia de uma ilha, encosta na praia
 * da próxima, para um tiquinho e segue; no fim, volta virado. Os quadros
 * viram os keyframes de uma animação só de transform (o compositor anda
 * com ela, sem repintar o mapa).
 */
export function viagemDoBarco(pontos: readonly Ponto[], { amostras = 12, parada = 0.35, folga = 108, abaixo = 24 }: Opcoes = {}): QuadroDoBarco[] {
  if (pontos.length < 2) return [];
  type Bruto = { x: number; y: number; angulo: number; virado: boolean; tempo: number };
  const ida: Ponto[][] = [];
  for (let i = 0; i < pontos.length - 1; i++) {
    const p0 = pontos[i - 1] ?? pontos[i];
    const p1 = pontos[i];
    const p2 = pontos[i + 1];
    const p3 = pontos[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    // Só o pedaço de mar: longe dos dois centros pelo menos a folga.
    const finos = Array.from({ length: 60 }, (_, k) => bezier(p1, c1, c2, p2, k / 59));
    const mar = finos.filter((p) => Math.hypot(p.x - p1.x, p.y - p1.y) >= folga && Math.hypot(p.x - p2.x, p.y - p2.y) >= folga);
    const trecho = mar.length >= 2 ? mar : [finos[20], finos[40]];
    const passo = (trecho.length - 1) / (amostras - 1);
    ida.push(Array.from({ length: amostras }, (_, k) => trecho[Math.round(k * passo)]).map((p) => ({ x: p.x, y: p.y + abaixo })));
  }
  const brutos: Bruto[] = [];
  let tempo = 0;
  const percorrer = (trechos: Ponto[][], virado: boolean) => {
    for (const trecho of trechos) {
      trecho.forEach((ponto, k) => {
        const vizinho = trecho[Math.min(k + 1, trecho.length - 1)];
        const anterior = trecho[Math.max(k - 1, 0)];
        const dx = vizinho.x - anterior.x;
        const dy = vizinho.y - anterior.y;
        // A inclinação acompanha a subida ou a descida da rota, sem exagero.
        const graus = Math.max(-22, Math.min(22, (Math.atan2(dy, Math.abs(dx) || 1) * 180) / Math.PI));
        if (k > 0) tempo += 1 / (trecho.length - 1);
        brutos.push({ x: ponto.x, y: ponto.y, angulo: virado ? -graus : graus, virado, tempo });
      });
      // Encostou: para um tiquinho na praia.
      tempo += parada;
      const ultimo = brutos[brutos.length - 1];
      brutos.push({ ...ultimo, tempo });
    }
  };
  percorrer(ida, false);
  percorrer(
    ida.map((trecho) => [...trecho].reverse()).reverse(),
    true,
  );
  const total = brutos[brutos.length - 1].tempo || 1;
  return brutos.map(({ tempo: t, ...resto }) => ({ ...resto, offset: Math.min(1, t / total) }));
}
