import { type Peca, portasDeEntrada, temSaida } from "@/motor/circuito/modelo";

type Ponto = { x: number; y: number };

/** O tamanho de cada peça na bancada e onde ficam as bolinhas (portas). */
export function geometriaDa(peca: Peca): { largura: number; altura: number; entradas: Ponto[]; saida: Ponto | null } {
  const largura = peca.tipo === "entrada" ? 104 : peca.tipo === "saida" ? 90 : 72;
  const altura = peca.tipo === "entrada" ? 46 : peca.tipo === "saida" ? 70 : 60;
  const n = portasDeEntrada(peca.tipo);
  const entradas = Array.from({ length: n }, (_, i) => ({ x: peca.x, y: peca.y + (n === 1 ? altura / 2 : i === 0 ? 15 : altura - 15) }));
  const saida = temSaida(peca.tipo) ? { x: peca.x + largura, y: peca.y + altura / 2 } : null;
  return { largura, altura, entradas, saida };
}

/** O caminho de um fio (curva que sai reta de uma porta e chega reta na outra). */
export function caminhoDoFio(de: Ponto, para: Ponto): string {
  const dx = Math.max(30, Math.abs(para.x - de.x) / 2);
  return `M ${de.x} ${de.y} C ${de.x + dx} ${de.y}, ${para.x - dx} ${para.y}, ${para.x} ${para.y}`;
}

export type AlvoCircuito = Ponto & { id: string; peca: string; porta: number | null; saida: boolean };

export function alvosDoCircuito(pecas: readonly Peca[]): AlvoCircuito[] {
  return pecas.flatMap((peca) => {
    const g = geometriaDa(peca);
    return [
      { id: `${peca.id}-corpo`, peca: peca.id, x: peca.x + g.largura / 2, y: peca.y + g.altura / 2, porta: null, saida: false },
      ...g.entradas.map((p, i) => ({ ...p, id: `${peca.id}-entrada-${i}`, peca: peca.id, porta: i, saida: false })),
      ...(g.saida ? [{ ...g.saida, id: `${peca.id}-saida`, peca: peca.id, porta: null, saida: true }] : []),
    ];
  });
}

/** Célula de Voronoi: cada ponto pertence só ao alvo mais próximo. */
export function celulaDoAlvo(alvo: AlvoCircuito, alvos: readonly AlvoCircuito[]): Ponto[] {
  let poligono: Ponto[] = [{ x: -10000, y: -10000 }, { x: 10000, y: -10000 }, { x: 10000, y: 10000 }, { x: -10000, y: 10000 }];
  for (const outro of alvos) {
    if (outro.id === alvo.id) continue;
    const dx = outro.x - alvo.x, dy = outro.y - alvo.y;
    if (dx === 0 && dy === 0) { if (outro.id < alvo.id) return []; else continue; }
    const limite = (outro.x ** 2 + outro.y ** 2 - alvo.x ** 2 - alvo.y ** 2) / 2;
    const valor = (p: Ponto) => p.x * dx + p.y * dy - limite;
    const novo: Ponto[] = [];
    poligono.forEach((p, i) => {
      const q = poligono[(i + 1) % poligono.length], a = valor(p), b = valor(q);
      if (a <= 0) novo.push(p);
      if ((a <= 0) !== (b <= 0)) { const t = a / (a - b); novo.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) }); }
    });
    poligono = novo;
  }
  return poligono;
}

export function alvoMaisProximo(ponto: Ponto, alvos: readonly AlvoCircuito[]): AlvoCircuito | null {
  return [...alvos].sort((a, b) => Math.hypot(a.x - ponto.x, a.y - ponto.y) - Math.hypot(b.x - ponto.x, b.y - ponto.y) || a.id.localeCompare(b.id))[0] ?? null;
}
