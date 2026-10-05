// A jornada lê dados publicados: conferir o vínculo evita testar uma solução
// desatualizada. As sabotagens distinguem resultado correto de eficiência.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FASES } from '@/conteudo';
import type { Fase } from '@/conteudo/tipos';
import { criarSimulacao } from '@/motor/simulacao';
import { criarNucleoNode } from '@/motor/executor/node';

const fases = FASES.filter(f => f.unidadeId.startsWith('logica-algoritmos-essenciais-'));
const jornadas = JSON.parse(readFileSync('testes/algoritmos-jornadas.json', 'utf8')) as Record<string, Fase[]>;
it('os orçamentos separam algoritmos com folga para variáveis intermediárias', () => {
  const nucleo = criarNucleoNode();
  nucleo.executar(`
    function binaria(lista, alvo) {
      let inicio = 0;
      let fim = lista.length - 1;
      while (inicio <= fim) {
        const meio = Math.floor((inicio + fim) / 2);
        const item = lista[meio];
        const encontrou = item === alvo;
        if (encontrou) return true;
        if (item < alvo) inicio = meio + 1;
        else fim = meio - 1;
      }
      return false;
    }
    function linear(lista, alvo) {
      let i = 0;
      while (i < lista.length) {
        if (lista[i] === alvo) return true;
        i++;
      }
      return false;
    }
    function vizinhos(lista) {
      for (let i = 1; i < lista.length; i++) {
        const anterior = lista[i - 1];
        const atual = lista[i];
        const repetiu = anterior === atual;
        if (repetiu) return true;
      }
      return false;
    }
    function pares(lista) {
      for (let i = 0; i < lista.length; i++) {
        for (let j = i + 1; j < lista.length; j++) {
          if (lista[i] === lista[j]) return true;
        }
      }
      return false;
    }
  `, 'snippet');
  for (const fase of fases) {
    const alvos = fase.tipo === 'pratica' ? fase.objetivos : fase.tipo === 'desafio' ? fase.partes : [];
    for (const alvo of alvos) {
      if (alvo.validador.tipo !== 'todos') continue;
      for (const limite of alvo.validador.validadores) {
        if (limite.tipo !== 'passosNoMaximo' || !limite.tamanho) continue;
        const busca = fase.unidadeId.endsWith('u1');
        const lista = Array.from({ length: limite.tamanho }, (_, i) => i + 1);
        // Alvo ausente e lista sem repetidos: ambos percorrem o pior caminho.
        const chamada = [{ tamanho: limite.tamanho, args: [lista, limite.tamanho + 1] }];
        const [eficiente] = nucleo.medirPassos(busca ? 'binaria' : 'vizinhos', chamada);
        const [ingenua] = nucleo.medirPassos(busca ? 'linear' : 'pares', chamada);
        expect(eficiente.erro).toBeNull();
        expect(ingenua.erro).toBeNull();
        expect(limite.valor).toBeGreaterThanOrEqual(3 * eficiente.passos);
        expect(limite.valor).toBeLessThanOrEqual(ingenua.passos / 10);
      }
    }
  }
});
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
