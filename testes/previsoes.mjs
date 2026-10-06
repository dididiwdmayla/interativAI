// Dados reais das fases e da revisão, lidos só quando uma jornada responde
// uma previsão. Não expõe a resposta na interface nem copia índices no teste.
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const exigir = createRequire(import.meta.url);
const raiz = fileURLToPath(new URL('../src/', import.meta.url));
let dados;
function carregarDados() {
  if (dados) return dados;
  const ts = exigir('typescript');
  const cache = new Map();
  function carregar(arquivo) {
    const candidatos = [arquivo, `${arquivo}.ts`, `${arquivo}.tsx`, path.join(arquivo, 'index.ts')];
    const resolvido = candidatos.find(p => existsSync(p) && /\.(ts|tsx|json)$/.test(p));
    if (!resolvido) return exigir(arquivo);
    if (cache.has(resolvido)) return cache.get(resolvido).exports;
    const modulo = { exports: {} };
    cache.set(resolvido, modulo);
    const fonte = readFileSync(resolvido, 'utf8');
    if (resolvido.endsWith('.json')) modulo.exports = JSON.parse(fonte);
    else {
      const { outputText } = ts.transpileModule(fonte, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } });
      const importar = nome => nome.startsWith('@/') ? carregar(path.join(raiz, nome.slice(2))) : nome.startsWith('.') ? carregar(path.resolve(path.dirname(resolvido), nome)) : exigir(nome);
      new Function('require', 'module', 'exports', outputText)(importar, modulo, modulo.exports);
    }
    return modulo.exports;
  }
  const { FASES } = carregar(path.join(raiz, 'conteudo/index.ts'));
  const { FASES_LABORATORIO } = carregar(path.join(raiz, 'conteudo/laboratorio/bancadaEstilos.ts'));
  const { ITENS_REVISAO } = carregar(path.join(raiz, 'conteudo/revisao/index.ts'));
  dados = { fases: new Map([...FASES, ...FASES_LABORATORIO].map(f => [f.id, f])), itens: new Map(ITENS_REVISAO.map(i => [i.id, i])) };
  return dados;
}

/** Opção certa a partir de `correta`; nas jornadas de erro, outra opção por dado. */
export async function opcaoDaPrevisao(pagina, { acertar = true } = {}) {
  const estado = await pagina.locator('[data-jogo-fase]').first().evaluate(el => ({ fase: el.dataset.jogoFase, objetivo: el.dataset.objetivoAtual, item: el.closest('[data-item-revisao]')?.getAttribute('data-item-revisao') }));
  const registro = carregarDados();
  const fase = registro.fases.get(estado.fase);
  const previsao = estado.item ? registro.itens.get(estado.item)?.previsao : fase?.objetivos?.find(o => o.id === estado.objetivo)?.previsao;
  if (!previsao || !Number.isInteger(previsao.correta) || !previsao.opcoes[previsao.correta]) throw new Error(`Previsão não encontrada nos dados: ${estado.item ?? estado.fase}/${estado.objetivo}`);
  const indice = acertar ? previsao.correta : previsao.opcoes.findIndex((_, i) => i !== previsao.correta);
  return pagina.locator('[data-previsao] button').nth(indice);
}

/** Uma fase do conteúdo (os dados reais, transpilados do TS), pelo id. */
export function faseDoConteudo(id) {
  const fase = carregarDados().fases.get(id);
  if (!fase) throw new Error(`fase "${id}" não está no conteúdo`);
  return fase;
}
