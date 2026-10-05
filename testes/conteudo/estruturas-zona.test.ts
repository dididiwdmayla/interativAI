// Impede que a jornada se afaste do conteúdo e que uma borda feliz esconda uma troca de ordem.
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { FASES } from '@/conteudo';
import type { Fase } from '@/conteudo/tipos';
import { criarSimulacao } from '@/motor/simulacao';
const fases = FASES.filter(f => f.unidadeId.startsWith('logica-estruturas-de-dados-'));
const jornadas = JSON.parse(readFileSync('testes/estruturas-jornadas.json', 'utf8')) as Record<string, Fase[]>;
it('jornadas reproduzem os objetivos e as partes do conteúdo', () => {
  for (const fase of fases) expect(jornadas[fase.unidadeId.at(-1)!].find(f => f.id === fase.id)).toEqual(fase);
});
it('desfazer com shift acerta vazio e um item, mas falha na ordem da pilha', () => {
  const fase = fases.find(f => f.id === 'logica-estruturas-de-dados-u1-f2')!;
  if (fase.tipo !== 'pratica') throw new Error('Prática esperada');
  const sim = criarSimulacao(fase);
  sim.executar([{tipo:'definirSnippet', codigo:'function desfazer(lista) { if (!lista.length) return null; return lista.shift(); } const r="pintar";'}, {tipo:'executarSnippet'}]);
  expect(sim.avaliar(fase.objetivos[0].validador).passou).toBe(true); // Vazio e um item não distinguem shift de pop.
  expect(sim.avaliar(fase.objetivos[1].validador).passou).toBe(false);
  sim.executar(fase.objetivos[1].solucaoDeTeste);
  expect(sim.avaliar(fase.objetivos[1].validador).passou).toBe(true);
});
