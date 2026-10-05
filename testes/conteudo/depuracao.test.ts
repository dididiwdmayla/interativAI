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
it('um conserto correto sem investigação não cumpre a caça ao bug', () => {
  for (const fase of fases) {
    if (fase.tipo !== 'desafio') continue;
    const investigar = fase.partes.find(p => p.id === 'investigar');
    if (!investigar) continue;
    const codigo = fase.partes.find(p => p.id === 'codigo')!.solucaoDeTeste.find(a => a.tipo === 'definirSnippet');
    if (codigo?.tipo !== 'definirSnippet') throw new Error('Código de conserto esperado');
    const sim = criarSimulacao(fase);
    sim.executar([codigo, {tipo:'executarSnippet'}]);
    expect(sim.avaliar(investigar.validador).passou, fase.id).toBe(false);
    expect(sim.avaliar(fase.partes.find(p => p.id === 'codigo')!.validador).passou, fase.id).toBe(true);
  }
});
it('as execuções investigadas cabem nas primeiras mil fotos da memória', () => {
  for (const fase of fases) {
    const sim = criarSimulacao(fase);
    const alvos = fase.tipo === 'pratica' ? fase.objetivos : fase.tipo === 'desafio' ? fase.partes : [];
    for (const alvo of alvos) {
      sim.executar(alvo.solucaoDeTeste);
      const execucao = sim.programa().ultimaExecucao;
      if (execucao) expect(execucao.rastroCortado, `${fase.id}/${alvo.id}`).toBe(false);
    }
  }
});
