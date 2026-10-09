import { readFileSync } from 'node:fs';
import { abrir, duploToque, progressoComFase, esperarPronto, fecharBalao, chaveDoSeletor, conferir } from './util.mjs';
const modo = process.argv[2] ?? 'retrato';
const [largura, altura] = modo === 'retrato' ? [390,844] : modo === 'paisagem' ? [844,390] : [1440,900];
const ferramentas = [...readFileSync(new URL('../src/ferramentas/ids.ts', import.meta.url),'utf8').matchAll(/^ {2}"([a-z-]+)",$/gm)].map(m=>m[1]);
const { pagina, navegador } = await abrir({largura, altura, toque: modo !== 'desktop', progresso: progressoComFase('sites-elementos-u4-f1', { objetivoAtual: 2 }, { apresentacoesVistas: ferramentas, metasVistas:['sites-elementos-u4'] })});
await esperarPronto(pagina);
if(modo !== 'desktop') { await fecharBalao(pagina); await pagina.getByRole('tab',{name:'Árvore',exact:true}).tap(); }
const chave = await chaveDoSeletor(pagina,'#nav-integrantes');
const alvo = pagina.locator(`[role=treeitem][data-chave="${chave}"] [title='Dois cliques para editar']`).first();
await alvo.scrollIntoViewIfNeeded(); await esperarPronto(pagina);
await pagina.evaluate(() => {
  window.gestosU4 = [];
  document.addEventListener('pointerup', e => window.gestosU4.push({ tempo: e.timeStamp, texto: e.target.textContent, x: e.clientX, y: e.clientY }), true);
});
const caixa = await alvo.boundingBox();
if(modo === 'desktop') await alvo.dblclick();
else await duploToque(pagina, caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
try { await pagina.locator('[role=tree] input').first().waitFor({timeout:5000}); } catch (e) { console.log('gestos da falha', await pagina.evaluate(() => window.gestosU4)); throw e; }
await pagina.locator('[role=tree] input').first().fill('#integrantes');
await pagina.locator('[role=tree] input').first().press('Enter');
conferir(await pagina.frameLocator('iframe[title^="Site"]').first().locator('#nav-integrantes').getAttribute('href')==='#integrantes','duplo toque edita o atributo sem selecionar previamente');
await navegador.close();
