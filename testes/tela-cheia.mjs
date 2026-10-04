// API simulada: entrada, saída, Esc externo, suporte, rejeição e navegação interna.
// O Chromium real também entra em tela cheia para conferir o layout e o teclado.
import { readFileSync } from 'node:fs';
import { abrir, conferir, progressoComFase } from './util.mjs';
const ferramentas = [...readFileSync(new URL('../src/ferramentas/ids.ts', import.meta.url), 'utf8').matchAll(/^ {2}"([a-z-]+)",$/gm)].map(m => m[1]);
const modo = process.argv[2] ?? 'desktop';
const tamanhos = {desktop: [1440, 900], retrato: [390, 844], paisagem: [844, 390]};
const [largura, altura] = tamanhos[modo];
const { navegador, pagina, contexto } = await abrir({largura, altura, toque: modo !== 'desktop', progresso: progressoComFase('sites-elementos-u1-f1', {}, {mapaDesbloqueado: true, apresentacoesVistas: ferramentas, revisao: {conceitos: {tag: {nivel: 1, proxima: "2020-01-01", vezes: 0, ultima: null}}, sequencia: {atual: 0, melhor: 0, ultimoDia: null}}}), esperar: '[data-jogo-fase]'});
await pagina.evaluate(() => {
  window.testeTelaCheia = {ativa: null, entradas: 0, saidas: 0, rejeitar: false};
  Object.defineProperty(document, 'fullscreenEnabled', {configurable: true, get: () => true});
  Object.defineProperty(document, 'fullscreenElement', {configurable: true, get: () => window.testeTelaCheia.ativa});
  document.documentElement.requestFullscreen = async function () {
    if (window.testeTelaCheia.rejeitar) throw new Error('negado');
    window.testeTelaCheia.entradas++;
    window.testeTelaCheia.ativa = this;
    document.dispatchEvent(new Event('fullscreenchange'));
  };
  document.exitFullscreen = async () => {
    window.testeTelaCheia.saidas++;
    window.testeTelaCheia.ativa = null;
    document.dispatchEvent(new Event('fullscreenchange'));
  };
  document.dispatchEvent(new Event('fullscreenchange'));
});
const entrar = () => pagina.getByRole('button', {name: 'Entrar em tela cheia', exact: true}).click();
await entrar();
await pagina.getByRole('button', {name: 'Sair da tela cheia', exact: true}).waitFor();
conferir(await pagina.evaluate(() => document.fullscreenElement === document.documentElement), 'entra no documento inteiro');
await pagina.getByRole('button', {name: 'Sair da tela cheia', exact: true}).click();
await entrar();
await pagina.evaluate(() => document.exitFullscreen()); // simula saída do navegador por Esc
await pagina.getByRole('button', {name: 'Entrar em tela cheia', exact: true}).waitFor();
conferir(await pagina.evaluate(() => window.testeTelaCheia.entradas === 2 && window.testeTelaCheia.saidas === 2), 'API alternou e saída externa sincronizou');
await pagina.evaluate(() => { window.testeTelaCheia.rejeitar = true; });
await entrar();
await pagina.getByRole('status').filter({hasText: 'O navegador não permitiu'}).waitFor();
await pagina.evaluate(() => {window.testeTelaCheia.rejeitar = false;});
await entrar();
await pagina.getByRole('button', {name: 'Sair da tela cheia', exact: true}).waitFor();
// Link Next, sem recarregar o documento.
await pagina.getByRole('link', {name: /Voltar.*(mapa|ilha)|Mapa/i}).first().click();
await pagina.locator('[data-mapa]').waitFor();
conferir(await pagina.evaluate(() => !!document.fullscreenElement), 'navegar não sai da tela cheia');
await pagina.getByRole('button', {name: 'Sair da tela cheia', exact: true}).waitFor();
await pagina.evaluate(() => {
  Object.defineProperty(document, 'fullscreenEnabled', {configurable: true, value: false});
  document.dispatchEvent(new Event('fullscreenchange'));
});
await pagina.locator('[data-tela-cheia]').waitFor({state: 'detached'});
// Contexto novo, API REAL, com tela da fase e teclado simulado por visualViewport.
const real = await contexto.newPage();
await real.goto(new URL('/fase/sites-elementos-u1-f1', pagina.url()).toString());
await real.getByRole('button', {name: 'Entrar em tela cheia', exact: true}).click();
await real.getByRole('button', {name: 'Sair da tela cheia', exact: true}).waitFor();
const medir = () => real.evaluate(() => {
  const raiz = document.querySelector('[data-jogo-fase]');
  const previa = document.querySelector('[data-preview]') ?? document.querySelector('iframe');
  const r = raiz.getBoundingClientRect();
  const p = previa.getBoundingClientRect();
  return {layout: raiz.dataset.layout, largura: r.width, altura: r.height, previa: p.height, janela: innerHeight, transborda: document.documentElement.scrollWidth > innerWidth};
});
// Insets simulados: a altura e os alvos continuam dentro da área segura.
await real.evaluate(() => {
  document.documentElement.style.setProperty('--tela-cheia-inset', '36px');
  document.documentElement.style.paddingTop = '20px';
  document.documentElement.style.paddingBottom = '16px';
});
let medidas = await medir();
conferir(medidas.layout === modo && medidas.altura <= medidas.janela - 35 && medidas.previa > 0 && !medidas.transborda, `${modo}: layout e prévia em tela cheia: ${JSON.stringify(medidas)}`);
if (modo === 'retrato') {
  await real.locator('.cm-content').first().focus();
  await real.evaluate(() => {
    Object.defineProperty(window.visualViewport, 'height', {configurable: true, value: 460});
    window.visualViewport.dispatchEvent(new Event('resize'));
  });
  await real.waitForFunction(() => document.querySelector('[data-jogo-fase]').getBoundingClientRect().height <= 461);
  medidas = await medir();
  conferir(medidas.previa > 0 && medidas.altura <= 461, 'teclado mantém prévia visível');
}
if (modo === 'retrato') {
  await real.evaluate(() => {
    delete window.visualViewport.height;
    document.activeElement.blur();
    window.visualViewport.dispatchEvent(new Event('resize'));
  });
}
async function conferirCabecalho(tela) {
  await real.getByRole('button', {name: 'Sair da tela cheia', exact: true}).waitFor();
  const bounds = await real.locator('[data-tela-cheia]').evaluate(b => {
    const r = b.getBoundingClientRect();
    return {top: r.top, left: r.left, right: r.right, largura: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, ativa: document.fullscreenElement === document.documentElement};
  });
  conferir(bounds.ativa && bounds.top >= 20 && bounds.left >= 0 && bounds.right <= bounds.largura && !bounds.overflow, `${modo}: ${tela} mantém tela cheia e botão dentro da área visível: ${JSON.stringify(bounds)}`);
}
await conferirCabecalho('fase');
await real.locator('[data-botao-mapa]').click();
await real.locator('[data-mapa=ilha]').waitFor();
await conferirCabecalho('ilha');
if (modo !== 'desktop') await real.getByRole('button', {name: 'Mais opções', exact: true}).click();
await real.getByRole('link', {name: 'Glossário', exact: true}).click();
await real.locator('[data-tela=glossario]').waitFor();
await conferirCabecalho('glossário');
await real.getByRole('button', {name: 'Voltar', exact: true}).click();
await real.locator('[data-mapa=ilha]').waitFor();
await real.getByRole('link', {name: 'Mundo', exact: true}).click();
await real.locator('[data-mapa=mundo]').waitFor();
await conferirCabecalho('mundo');
await real.locator('[data-porto]').click();
await real.locator('[data-tela=revisao]').waitFor();
await conferirCabecalho('revisão');
await navegador.close();
console.log(`tela-cheia.mjs ${modo}: ok`);
