import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TIPOS_DISPOSITIVO, CATALOGO_DISPOSITIVOS } from '@/motor/cena/catalogo';
import { programaParaLevar } from '@/motor/contrato/levarProMundo';
import { FASE_DEMO_CONTRATO } from '@/conteudo/laboratorio/bancadaContrato';
import type { DadosCena } from '@/motor/cena/modelo';

it.each(TIPOS_DISPOSITIVO)('exporta %s do catálogo e roda todos os comandos no Node', (tipo) => {
  const ficha = CATALOGO_DISPOSITIVOS[tipo];
  const cena: DadosCena = { ...FASE_DEMO_CONTRATO.cena!, dispositivos: [{ id: 'aparelho', tipo, x: 0, y: 0 }], linhaDoTempo: [], duracaoMs: 10_000 };
  const codigo = ficha.exemplo('aparelho') + '\n' + ficha.comandos.map(c => `aparelho.${c.assinatura.replace("texto", '"Teste"').replace("lista, titulo", '[{horario:9,cliente:"Ana"}], "Agenda"').replace("ms", "100")};`).join('\n') + '\nconsole.log("propriedades", ' + ficha.propriedades.map(p => `aparelho.${p.nome}`).join(', ') + ');';
  const pasta = mkdtempSync(join(tmpdir(), 'kit-'));
  try {
    const caminho = join(pasta, 'programa.js');
    writeFileSync(caminho, programaParaLevar({ contrato: FASE_DEMO_CONTRATO.contrato!, cena, codigo }));
    const saida = execFileSync(process.execPath, [caminho], { encoding: 'utf8' });
    expect(saida).toContain('propriedades');
    expect(saida).not.toContain('undefined');
    if (ficha.comandos.length) expect(saida.split('\n').length).toBeGreaterThan(4);
  } finally { rmSync(pasta, { recursive: true, force: true }); }
});

it('entradas instantâneas, rampas e ações de atores aparecem fora do jogo', () => {
  const cena: DadosCena = { ...FASE_DEMO_CONTRATO.cena!, dispositivos: [{ id: 'umidade', tipo: 'sensorUmidade', x: 0, y: 0 }, { id: 'rega', tipo: 'aspersor', x: 100, y: 0 }], duracaoMs: 5000,
    linhaDoTempo: [{ dispositivo: 'umidade', propriedade: 'valor', de: 0, ate: 4000, valorInicial: 10, valorFinal: 50 }],
    atores: [{ id: 'pessoa', desenho: 'pessoa', x: 0, y: 0, acoes: { entrar: { duracaoMs: 1000, destino: { x: 20, y: 20 }, aoConcluir: [{ dispositivo: 'umidade', propriedade: 'valor', valor: 90 }] } } }],
    reacoes: [{ quando: { dispositivo: 'rega', propriedade: 'ligado', valor: true }, entao: { ator: 'pessoa', acao: 'entrar' } }] };
  const pasta = mkdtempSync(join(tmpdir(), 'atores-'));
  try {
    const caminho = join(pasta, 'mundo.js');
    writeFileSync(caminho, programaParaLevar({ contrato: FASE_DEMO_CONTRATO.contrato!, cena, codigo: 'console.log(umidade.valor); esperar(500); console.log(umidade.valor); rega.ligar(); esperar(1000); console.log(umidade.valor); esperar(9000);' }));
    const saida = execFileSync(process.execPath, [caminho], { encoding: 'utf8' });
    expect(saida).toContain('\n10\n'); expect(saida).toContain('\n15\n'); expect(saida).toContain('\n90\n'); expect(saida).toContain('pessoa: entrar');
  } finally { rmSync(pasta, { recursive: true, force: true }); }
});
