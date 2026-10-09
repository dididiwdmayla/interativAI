import { expect, it } from 'vitest';
import { alvosDoCircuito, alvoMaisProximo, celulaDoAlvo } from '@/componentes/circuito/geometria';
import type { Peca } from '@/motor/circuito/modelo';
const pecas: Peca[] = [{ id:'e1', tipo:'e', x:120,y:80 },{id:'ou1',tipo:'ou',x:200,y:90}];
it('recorta cada alvo pelo vizinho mais próximo, inclusive no espaço entre portões', () => {
  const alvos = alvosDoCircuito(pecas);
  for(const alvo of alvos) {
    const celula = celulaDoAlvo(alvo, alvos);
    expect(celula.length).toBeGreaterThan(2);
    for(const p of celula) {
      for(const outro of alvos) expect(Math.hypot(p.x-alvo.x,p.y-alvo.y)).toBeLessThanOrEqual(Math.hypot(p.x-outro.x,p.y-outro.y)+1e-7);
    }
    expect(alvoMaisProximo(alvo, alvos)?.id).toBe(alvo.id);
  }
});
