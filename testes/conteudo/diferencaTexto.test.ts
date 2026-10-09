import { expect, it } from 'vitest';
import { diferencaTexto, textoComDiferenca } from '@/motor/contrato/diferencaTexto';
it.each([['CLIENTES: 4','CLIENTES:4',' '], ['CLIENTES: 4','clientes: 4','CLIENTES'], ['CAFÉ','CAFE','É']])('destaca a diferença exata em %s / %s', (esperado, recebido, diferente) => {
  const d = diferencaTexto(esperado, recebido);
  expect(d.esperado.slice(d.inicio, d.fimEsperado)).toBe(diferente);
  expect(textoComDiferenca(d)).toContain('Esperado:');
  expect(textoComDiferenca(d)).toContain('recebido:');
});
