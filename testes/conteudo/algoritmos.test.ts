// A jornada lê dados publicados: conferir o vínculo evita testar uma solução
// desatualizada. As sabotagens distinguem resultado correto de eficiência.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FASES } from '@/conteudo';
import type { Fase } from '@/conteudo/tipos';
import { criarSimulacao } from '@/motor/simulacao';

const fases = FASES.filter(f => f.unidadeId.startsWith('logica-algoritmos-essenciais-'));
const jornadas = JSON.parse(readFileSync('testes/algoritmos-jornadas.json', 'utf8')) as Record<string, Fase[]>;
describe('Algoritmos essenciais: provas pedagógicas', () => {
  it('a jornada usa as mesmas ações, previsões e validadores do conteúdo', () => {
    for (const fase of fases) {
      const copia = jornadas[fase.unidadeId.at(-1)!].find(f => f.id === fase.id);
      expect(copia).toBeDefined();
      if (fase.tipo === 'pratica' && copia?.tipo === 'pratica') expect(copia.objetivos).toEqual(fase.objetivos);
      if (fase.tipo === 'desafio' && copia?.tipo === 'desafio') expect(copia.partes).toEqual(fase.partes);
    }
  });
  it('buscar linearmente acerta os casos, mas não cabe no orçamento da binária', () => {
    const fase = fases.find(f => f.id === 'logica-algoritmos-essenciais-u1-f2')!;
    if (fase.tipo !== 'pratica') throw new Error('Fase de prática esperada');
    const sim = criarSimulacao(fase);
    sim.executar([{ tipo: 'definirSnippet', codigo: `function binaria(lista, alvo) {
      let i = 0;
      while (i < lista.length) {
        if (lista[i] === alvo) return true;
        i++;
      }
      return false;
    }` }, { tipo: 'executarSnippet' }]);
    const val = fase.objetivos.find(o => o.id === 'binaria-sozinho')!.validador;
    if (val.tipo !== 'todos') throw new Error('Validação conjunta esperada');
    expect(sim.avaliar(val.validadores[0]).passou).toBe(true);
    expect(sim.avaliar(val).passou).toBe(false);
    sim.executar(fase.objetivos.find(o => o.id === 'binaria-sozinho')!.solucaoDeTeste!);
    expect(sim.avaliar(val).passou).toBe(true);
  });
});


it('comparar cada par acerta a resposta, mas reprova no orçamento de desempenho', () => {
  const fase = fases.find(f => f.id === 'logica-algoritmos-essenciais-u4-f2')!;
  if (fase.tipo !== 'pratica') throw new Error('Fase de prática esperada');
  const sim = criarSimulacao(fase);
  sim.executar([{ tipo: 'definirSnippet', codigo: `function conferir(lista) {
    for (let i = 0; i < lista.length; i++) {
      for (let j = i + 1; j < lista.length; j++) {
        if (lista[i] === lista[j]) return true;
      }
    }
    return false;
  }` }, { tipo: 'executarSnippet' }]);
  const objetivo = fase.objetivos.find(o => o.id === 'eficiente-sozinho')!;
  const val = objetivo.validador;
  if (val.tipo !== 'todos') throw new Error('Validação conjunta esperada');
  expect(sim.avaliar(val.validadores[0]).passou).toBe(true);
  expect(sim.avaliar(val).passou).toBe(false);
  sim.executar(objetivo.solucaoDeTeste!);
  expect(sim.avaliar(val).passou).toBe(true);
});
