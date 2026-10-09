// Toques perto das entradas conectam a porta mais próxima, sem ampliar.
import { abrir, abrirBalao, conferir, esperarPronto, fecharBalao, progressoComFase } from './util.mjs';
import { faseDoConteudo } from './previsoes.mjs';
const fase = faseDoConteudo('origens-museu-u4-f6');
const modo = process.argv[2] ?? 'paisagem';
const [largura, altura] = modo === 'retrato' ? [390,844] : modo === 'paisagem' ? [844,390] : [1440,900];
const toque = modo !== 'desktop';
const { pagina, navegador } = await abrir({ largura, altura, toque, esperar: '[data-jogo-fase]', progresso: progressoComFase('origens-museu-u4-f6', {}, { apresentacoesVistas: ['painel-de-cabos'], metasVistas: ['origens-museu-u4'] }) });
const pronto = () => esperarPronto(pagina);
await pronto(); if (toque) await fecharBalao(pagina);
const cdpToque = toque ? await pagina.context().newCDPSession(pagina) : null;
const tocar = async el => { await el.scrollIntoViewIfNeeded(); await (toque ? el.tap() : el.click()); await pronto(); };
async function tocarNaBancada(estacao, el, posicao) {
  if (!toque) { const c = await el.boundingBox(); await pagina.mouse.click(c.x + c.width / 2, c.y + c.height / 2); return pronto(); }
  await fecharBalao(pagina);
  await el.scrollIntoViewIfNeeded();
  const area = estacao.getByRole("application", { name: "Bancada do circuito" });
  for (let i = 0; i < 20; i++) {
    const a = await area.boundingBox();
    const caixa = await el.boundingBox();
    const x = caixa.x + (posicao?.x ?? 0.5) * caixa.width;
    const y = caixa.y + (posicao?.y ?? 0.5) * caixa.height;
    if (x > a.x + 25 && x < a.x + a.width - 25 && y > a.y + 25 && y < a.y + a.height - 25) {
      await pagina.touchscreen.tap(x, y);
      break;
    }
    const mx = a.x + a.width / 2, my = a.y + a.height / 2;
    const dx = Math.max(-a.width / 4, Math.min(a.width / 4, mx - x));
    const dy = Math.max(-a.height / 4, Math.min(a.height / 4, my - y));
    const dedos = [{ x: mx - 20, y: my, id: 1 }, { x: mx + 20, y: my, id: 2 }];
    await cdpToque.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: dedos });
    await cdpToque.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: dedos.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy })) });
    await cdpToque.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await pronto();
  }
  await pronto();
}

for (const objetivo of fase.objetivos.slice(0,3)) {
  await pagina.waitForFunction(id => document.querySelector('[data-jogo-fase]')?.getAttribute('data-objetivo-atual') === id, objetivo.id);
  for (const a of objetivo.solucaoDeTeste) {
    if (toque) await fecharBalao(pagina);
    const aba = pagina.locator(`[data-aba-estacao="${a.estacao}"]`);
    if (await aba.getAttribute('aria-selected') !== 'true') await tocar(aba);
    const estacao = pagina.locator(`[data-estacao="${a.estacao}"]`);
    const m = a.mudanca;
    if (m.tipo === 'portao') await tocar(estacao.locator(`[data-portao-paleta="${m.portao}"]`));
    else {
      await tocarNaBancada(estacao, estacao.locator(`[data-porta-saida="${m.de}"]`));
      if (toque) await tocarNaBancada(estacao, estacao.locator(`[data-corpo-peca="${m.para}"]`), {x:0.35,y:m.porta === 0 ? 0.25 : 0.75});
      else await tocarNaBancada(estacao, estacao.locator(`[data-porta-entrada="${m.para}:${m.porta}"] circle`));
    }
  }
  conferir(await pagina.locator('[data-jogo-fase]').getAttribute('data-objetivo-atual') === objetivo.id, `${modo}: o toque conecta e deixa Próximo objetivo para o aluno`);
  if (toque) await abrirBalao(pagina);
  await tocar(pagina.getByRole('button',{name:'Próximo objetivo',exact:true}));
}
await navegador.close();
