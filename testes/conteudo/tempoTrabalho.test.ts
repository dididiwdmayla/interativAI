import { expect, it } from 'vitest';
import { INATIVIDADE_MS, TempoTrabalho } from '@/motor/contrato/tempoTrabalho';

it('pausa na aba oculta e retoma sem somar o intervalo esquecido', () => {
  const t = new TempoTrabalho(0);
  t.atualizar(0, { trabalhando: true });
  t.atualizar(10_000, { visivel: false });
  expect(t.tempo(500_000)).toBe(10_000);
  t.atualizar(500_000, { visivel: true });
  expect(t.tempo(510_000)).toBe(20_000);
  t.atualizar(510_000, { trabalhando: false });
  expect(t.tempo(900_000)).toBe(20_000);
});

it('limita inatividade mesmo sem tick, e retoma por interação', () => {
  const t = new TempoTrabalho(0);
  t.atualizar(0, { trabalhando: true });
  expect(t.tempo(10 * INATIVIDADE_MS)).toBe(INATIVIDADE_MS);
  t.atualizar(10 * INATIVIDADE_MS, { interacao: true });
  expect(t.tempo(10 * INATIVIDADE_MS + 1000)).toBe(INATIVIDADE_MS + 1000);
  expect(t.tempo(10 * INATIVIDADE_MS + 1000)).toBe(INATIVIDADE_MS + 1000);
  t.atualizar(10 * INATIVIDADE_MS + 2000, { interacao: true });
  expect(t.tempo(10 * INATIVIDADE_MS + 3000)).toBe(INATIVIDADE_MS + 3000);
});
