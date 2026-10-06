import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { FASES, UNIDADES } from '@/conteudo';
import { CURRICULO } from '@/curriculo/curriculo';
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
it('listas de nomes diferentes rejeitam consertos que invertem a ordem', () => {
  for (const [id, codigo] of [
    ['logica-depuracao-u1-f3', 'function etiquetas(itens) { return itens.map(item => item.nome).reverse(); }'],
    ['logica-depuracao-u4-f3', 'function ativos(itens) { return itens.filter(item => item.ativo).map(item => item.nome).reverse(); }'],
  ]) {
    const fase = fases.find(f => f.id === id);
    if (!fase) throw new Error(`fase ${id} não registrada`);
    if (fase.tipo !== 'desafio') throw new Error('Desafio esperado');
    const sim = criarSimulacao(fase);
    sim.executar([{tipo:'definirSnippet',codigo}, {tipo:'executarSnippet'}]);
    expect(sim.avaliar(fase.partes.find(p => p.id === 'codigo')!.validador).passou, id).toBe(false);
  }
});

it('a U4 está registrada, sem requerMotor, e o contrato permanece no fim da Ilha Lógica', () => {
  const ilha = CURRICULO.find(i => i.id === 'logica')!;
  const registradas = new Set(UNIDADES.map(u => u.id));
  const percurso = ilha.zonas.flatMap(z => z.unidades);
  const u4 = percurso.find(u => u.id === "logica-depuracao-u4")!;
  expect(u4.requerMotor).toBeUndefined();
  expect(registradas.has(u4.id)).toBe(true);
  expect(percurso.filter(u => !u.requerMotor).every(u => registradas.has(u.id))).toBe(true);
  expect(ilha.zonas.find(z => z.id === 'depuracao')!.unidades.map(u => u.id)).toEqual([1,2,3,4].map(n => `logica-depuracao-u${n}`));
  expect(percurso.at(-1)!.id).toBe('logica-programa-de-verdade-u1');
});
