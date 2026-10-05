import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { FASES } from '@/conteudo';
import type { Fase } from '@/conteudo/tipos';
import { criarSimulacao } from '@/motor/simulacao';
const fases = FASES.filter(f => f.unidadeId.startsWith('logica-depuracao-'));
const jornadas = JSON.parse(readFileSync('testes/depuracao-jornadas.json', 'utf8')) as Record<string, Fase[]>;
it('jornada usa os mesmos dados, ações e previsões das fases', () => {
  for (const fase of fases) expect(jornadas[fase.unidadeId.at(-1)!].find(f => f.id === fase.id)).toEqual(fase);
});
it('consertar só o exemplo não passa nas bordas escondidas', () => {
  for (const fase of fases) {
    if (fase.tipo !== 'desafio') continue;
    const parte = fase.partes.find(p => p.id === 'codigo')!;
    if (parte.validador.tipo !== 'todos') throw new Error('Todos esperado');
    const f = parte.validador.validadores.find(v => v.tipo === 'funcaoPassa');
    if (f?.tipo !== 'funcaoPassa') throw new Error('Casos escondidos obrigatórios');
    const sim = criarSimulacao(fase);
    sim.executar([{tipo:'definirSnippet', codigo:`function ${f.nome}() { return ${JSON.stringify(f.casos.at(-1)!.esperado)}; }`}, {tipo:'executarSnippet'}]);
    expect(sim.avaliar(f).passou, fase.id).toBe(false);
  }
});
