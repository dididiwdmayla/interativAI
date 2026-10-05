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
import { criarNucleoNode } from '@/motor/executor/node';
import { chamadasDaMedicao } from '@/motor/desempenho';

it('orçamentos incluem escondidos, aceitam variáveis intermediárias e rejeitam buscas ou deslizes repetidos', () => {
  for (const fase of fases) {
    const alvos = fase.tipo === 'pratica' ? fase.objetivos : fase.tipo === 'desafio' ? fase.partes : [];
    for (const alvo of alvos) {
      if (alvo.validador.tipo !== 'todos') continue;
      const limite = alvo.validador.validadores.find(v => v.tipo === 'passosNoMaximo');
      if (!limite || limite.tipo !== 'passosNoMaximo' || !limite.tamanho || !fase.programa?.desempenho) continue;
      const nome = limite.funcao!;
      const codigo = alvo.solucaoDeTeste.find(a => a.tipo === 'definirSnippet');
      if (!codigo || codigo.tipo !== 'definirSnippet') throw new Error('Solução em Snippet esperada');
      // As soluções medidas guardam o item/existência em variáveis auxiliares.
      const eficiente = criarNucleoNode();
      eficiente.executar(codigo.codigo, 'snippet');
      const config = fase.programa.desempenho;
      const configurada = config.funcoes.find(f => f.nome === nome)!;
      const chamada = chamadasDaMedicao(config, configurada, [limite.tamanho]);
      const [boa] = eficiente.medirPassos(nome, chamada);
      const fila = fase.unidadeId.endsWith('u2');
      const desafio = fase.tipo === 'desafio';
      const lenta = criarNucleoNode();
      let ingenua: string;
      if (fila) ingenua = desafio
        ? `function ${nome}(lista) { const r=[]; while(lista.length) r.push("Entregar " + lista.shift()); return r; }`
        : `function ${nome}(lista) { let soma=0; while(lista.length) soma+=lista.shift(); return soma; }`;
      else ingenua = desafio
        ? `function ${nome}(lista) { const vistos=[]; let total=0; for(const x of lista) { if(vistos.includes(x)) total++; else vistos.push(x); } return total; }`
        : `function ${nome}(lista,pedidos) { let total=0; for(const p of pedidos) if(lista.includes(p)) total++; return total; }`;
      lenta.executar(ingenua, 'snippet');
      const [ruim] = lenta.medirPassos(nome, chamada);
      expect(boa.erro).toBeNull();
      expect(ruim.erro).toBeNull();
      expect(ruim.escondidos).toBeGreaterThan(100_000);
      expect(limite.valor).toBeGreaterThanOrEqual(3 * boa.passos);
      expect(limite.valor).toBeLessThanOrEqual(ruim.passos / 10);
      // A versão ingênua continua acertando as bordas, mas reprova na eficiência.
      const sim = criarSimulacao(fase);
      sim.executar([{tipo:'definirSnippet',codigo:ingenua},{tipo:'executarSnippet'}]);
      const bordas = alvo.validador.validadores.find(v => v.tipo === 'funcaoPassa')!;
      expect(sim.avaliar(bordas).passou).toBe(true);
      expect(sim.avaliar(limite).passou).toBe(false);
    }
  }
});
it('um percurso de níveis fixos acerta a casa, mas perde a lâmpada de um ramo mais profundo', () => {
  const fase = fases.find(f => f.id === 'logica-estruturas-de-dados-u4-f2')!;
  if (fase.tipo !== 'pratica' || fase.objetivos[0].validador.tipo !== 'todos') throw new Error('Prática esperada');
  const bordas = fase.objetivos[0].validador.validadores[0];
  if (bordas.tipo !== 'funcaoPassa') throw new Error('Função esperada');
  const codigo = `function luzes(no) {
    if (no === null) return [];
    const nomes=[];
    if(no.lampada === true) nomes.push(no.nome);
    for(const filho of no.filhos) {
      if(filho.lampada === true) nomes.push(filho.nome);
      for(const neto of filho.filhos) if(neto.lampada === true) nomes.push(neto.nome);
    }
    return nomes;
  }`;
  const nucleo = criarNucleoNode();
  nucleo.executar(codigo, 'snippet');
  expect(nucleo.testarFuncao('luzes', bordas.casos.slice(0,4)).passou).toBe(true);
  const sim = criarSimulacao(fase);
  sim.executar([{tipo:'definirSnippet',codigo},{tipo:'executarSnippet'}]);
  expect(sim.avaliar(bordas).passou).toBe(false);
  sim.executar(fase.objetivos[0].solucaoDeTeste);
  expect(sim.avaliar(bordas).passou).toBe(true);
});
