// O circuito lógico, na demonstração (/lab/fases?fase=lab-logica-u1-f2):
// tirar um portão E da paleta, ligar os fios tocando na bolinha da direita e
// depois na peça de destino, arrastar uma peça, ligar e desligar as chaves
// (fios e porta acendendo), a tabela verdade marcando as linhas testadas, o
// "Ver como código" batendo com a tabela e o NÃO trocando um fio. Mouse e toque.
// Uso: node testes/circuito.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const { navegador, contexto, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-logica-u1-f2", esperar: "[data-bancada-circuito]" });
const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
await esperarPronto(pagina, 30000);
const cdpToque = toque ? await contexto.newCDPSession(pagina) : null;
if (cdpToque) await cdpToque.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 2 });

async function tocar(localizador, opcoes = {}) {
  if (movel) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque && await localizador.evaluate(el => el instanceof SVGElement)) {
    // Um jogador amplia e navega até a peça antes de tocar. Dois dedos
    // também arrastam o enquadramento, sem alterar peças sob os dedos.
    const area = pagina.getByRole("application", { name: "Bancada do circuito" });
    while (parseInt(await pagina.locator('[data-zoom-circuito]').innerText()) < 150) {
      await pagina.getByRole("button", { name: "Aumentar zoom do circuito" }).tap();
    }
    const cdp = cdpToque;
    for (let i = 0; i < 20; i++) {
      const a = await area.boundingBox();
      const caixa = await localizador.boundingBox();
      const pos = opcoes.position ?? { x: caixa.width / 2, y: caixa.height / 2 };
      const x = caixa.x + pos.x, y = caixa.y + pos.y;
      if (x > a.x + 25 && x < a.x + a.width - 25 && y > a.y + 25 && y < a.y + a.height - 25) {
        await pagina.touchscreen.tap(x, y);
        break;
      }
      const mx = a.x + a.width / 2, my = a.y + a.height / 2;
      const dx = Math.max(-a.width / 4, Math.min(a.width / 4, mx - x));
      const dy = Math.max(-a.height / 4, Math.min(a.height / 4, my - y));
      const dedos = [{ x: mx - 20, y: my, id: 1 }, { x: mx + 20, y: my, id: 2 }];
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: dedos });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: dedos.map(p => ({...p, x:p.x+dx, y:p.y+dy})) });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await esperarPronto(pagina);
    }
  } else if (toque) await localizador.tap(opcoes);
  else await localizador.click(opcoes);
  await esperarPronto(pagina);
}
async function naConversa(nome) {
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 10000 });
  if (toque) await botao.tap();
  else await botao.click();
  await esperarPronto(pagina);
}
const esperarObjetivo = (id) =>
  pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });
const objetivoConcluido = async () => {
  if (movel) await abrirBalao(pagina);
  return pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first().isVisible();
};
const peca = (id) => pagina.locator(`[data-peca="${id}"]`);
const acesa = async (id) => (await peca(id).getAttribute("data-acesa")) === "sim";
/** Liga um fio: a bolinha da direita de `de` e depois a peça `para` (no toque, o corpo; no mouse, a bolinha). */
async function ligar(de, para, porta) {
  await tocar(pagina.locator(`[data-porta-saida="${de}"]`));
  if ((await pagina.locator("svg[data-puxando]").getAttribute("data-puxando")) !== de) await pagina.screenshot({ path: `testes-falha-circuito-${MODO}.png` });
  conferir((await pagina.locator("svg[data-puxando]").getAttribute("data-puxando")) === de, `${MODO}: tocar na bolinha da direita de ${de} puxa um fio`);
  if (toque) {
    const corpo = pagina.locator(`[data-corpo-peca="${para}"]`);
    const caixa = await corpo.boundingBox();
    await tocar(corpo, { position: { x: caixa.width * 0.35, y: porta === 0 ? caixa.height * 0.25 : caixa.height * 0.75 } });
  } else {
    await tocar(pagina.locator(`[data-porta-entrada="${para}:${porta}"]`));
  }
}

// Introdução.
for (let i = 0; i < 4; i++) {
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
  if (!(await botao.isVisible().catch(() => false))) break;
  await naConversa(/^(Continuar|Vamos lá!)$/);
}

// ---------------------------------------------------------------- 1. o portão E
await esperarObjetivo("porta-com-e");
await tocar(pagina.locator("[data-portao-paleta='e']"));
conferir((await peca("e1").count()) === 1, `${MODO}: o portão E sai da paleta para a bancada`);
// Arrastar muda a peça de lugar (o circuito continua o mesmo).
const antes = await pagina.locator('[data-corpo-peca="e1"]').boundingBox();
if (movel) await fecharBalao(pagina);
await pagina.mouse.move(antes.x + antes.width / 2, antes.y + antes.height / 2);
await pagina.mouse.down();
await pagina.mouse.move(antes.x + antes.width / 2 + 40, antes.y + antes.height / 2 + 30, { steps: 6 });
await pagina.mouse.up();
await esperarPronto(pagina);
const depois = await pagina.locator('[data-corpo-peca="e1"]').boundingBox();
conferir(Math.abs(depois.x - antes.x) > 10, `${MODO}: arrastar muda o portão de lugar`);
await ligar("cliente", "e1", 0);
await ligar("aberta", "e1", 1);
await ligar("e1", "porta", 0);
conferir((await pagina.locator("[data-fio]").count()) === 3, `${MODO}: três fios ligados`);
conferir(await objetivoConcluido(), `${MODO}: o E montado cumpre a tabela pedida`);
await naConversa(/Próximo objetivo/);

// ---------------------------------------------------------------- 2. previsão e chaves
await esperarObjetivo("testar");
if (movel) await abrirBalao(pagina);
const opcao = await opcaoDaPrevisao(pagina);
if (toque) await opcao.tap();
else await opcao.click();
await esperarPronto(pagina);
await tocar(pagina.locator('[data-corpo-peca="aberta"]'));
conferir(!(await acesa("porta")), `${MODO}: só com a loja aberta, a porta continua fechada`);
conferir((await pagina.locator('[data-linha-tabela="1"]').getAttribute("data-linha-atual")) === "sim", `${MODO}: a linha de agora acende na tabela`);
conferir(await objetivoConcluido(), `${MODO}: ligar uma chave cumpre o objetivo`);
await naConversa(/Próximo objetivo/);
await tocar(pagina.locator('[data-corpo-peca="cliente"]'));
conferir(await acesa("porta"), `${MODO}: com as duas chaves, a porta abre`);
conferir((await pagina.locator('[data-fio][data-fio-aceso="sim"]').count()) === 3, `${MODO}: os três fios acendem`);
conferir(Number(await pagina.locator("[data-linhas-testadas]").getAttribute("data-linhas-testadas")) === 3, `${MODO}: três linhas testadas`);

// ---------------------------------------------------------------- 3. ver como código
await esperarObjetivo("ver-codigo");
await tocar(pagina.locator("[data-ver-como-codigo]"));
conferir((await pagina.locator("[data-codigo-circuito] pre").innerText()).trim() === "const portaAbre = temCliente && lojaAberta;", `${MODO}: o código do circuito é temCliente && lojaAberta`);
conferir(await objetivoConcluido(), `${MODO}: ver o código cumpre o objetivo`);
await naConversa(/Próximo objetivo/);

// ---------------------------------------------------------------- 4. NÃO no meio (sozinho)
await esperarObjetivo("sem-cliente");
await tocar(pagina.locator("[data-portao-paleta='nao']"));
await ligar("cliente", "nao1", 0);
await ligar("nao1", "e1", 0);
conferir((await pagina.locator("[data-codigo-circuito] pre").innerText()).trim() === "const portaAbre = !temCliente && lojaAberta;", `${MODO}: o código acompanha: !temCliente && lojaAberta`);
conferir(await objetivoConcluido(), `${MODO}: com o NÃO, a porta abre para a faxina`);

// ---------------------------------------------------------------- navegação da bancada cheia
if (MODO === "retrato") {
  for (let i = 0; i < 6; i++) await tocar(pagina.locator("[data-portao-paleta='ou']"));
  await tocar(pagina.getByRole("button", { name: "Ajustar à tela", exact: true }));
  const area = pagina.getByRole("application", { name: "Bancada do circuito" });
  const quadro = () => area.getAttribute("viewBox");
  const ajustar = await quadro();
  const alvosGrandes = async () => {
    const pequenos = await pagina.locator('[data-alvo-corpo], [data-alvo-porta]').evaluateAll(els => els.flatMap(el => {
      const r = el.getBoundingClientRect();
      return r.width >= 43.9 && r.height >= 43.9 ? [] : [{ peca: el.closest('[data-peca]')?.getAttribute('data-peca'), largura: r.width, altura: r.height, matriz: el.getScreenCTM()?.a }];
    }));
    if (pequenos.length) console.log('Alvos menores que 44 px:', pequenos);
    return pequenos.length === 0;
  };
  conferir(await alvosGrandes(), "retrato: alvos de peças e portas têm 44 px com muitos portões ajustados à tela");
  await tocar(pagina.getByRole("button", { name: "Aumentar zoom do circuito" }));
  conferir(Math.abs(Number((await quadro()).split(" ")[2]) - Number(ajustar.split(" ")[2]) / 1.25) < 0.01, "retrato: um toque no botão + amplia uma vez");
  conferir(await alvosGrandes(), "retrato: alvos mantêm 44 px ao ampliar");
  await tocar(pagina.getByRole("button", { name: "Diminuir zoom do circuito" }));
  conferir(Math.abs(Number((await quadro()).split(" ")[2]) - Number(ajustar.split(" ")[2])) < 0.01, "retrato: botão de menos desfaz a ampliação");

  // CDP envia dois dedos reais: a pinça começa sobre uma peça, não a move
  // nem alterna a chave, e conserva o ponto sob o meio dos dedos.
  const cdp = cdpToque;
  const corpoCliente = await pagina.locator('[data-corpo-peca="cliente"]').boundingBox();
  const caixaArea = await area.boundingBox();
  const x = corpoCliente.x + corpoCliente.width / 2;
  const y = corpoCliente.y + corpoCliente.height / 2;
  const segundo = Math.min(caixaArea.x + caixaArea.width - 15, x + 100);
  const antesPinca = await quadro();
  const valorAntes = await acesa("cliente");
  const posicoesAntes = await pagina.locator('[data-peca]').evaluateAll(els => els.map(el => el.getAttribute('data-posicao-peca')));
  const pontos = (deslocamento) => [
    { x, y, id: 1 },
    { x: segundo + deslocamento, y: y + deslocamento / 2, id: 2 },
  ];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pontos(0) });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pontos(50) });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await esperarPronto(pagina);
  conferir(Number((await quadro()).split(" ")[2]) < Number(antesPinca.split(" ")[2]), "retrato: pinça amplia a bancada");
  conferir(await acesa("cliente") === valorAntes, "retrato: pinça sobre uma chave não a alterna");
  conferir(await alvosGrandes(), "retrato: alvos mantêm 44 px após pinça");
  await tocar(pagina.getByRole("button", { name: "Ajustar à tela", exact: true }));
  await pagina.waitForFunction(esperado => document.querySelector('svg[data-puxando]')?.getAttribute('viewBox') === esperado, ajustar, { timeout: 5000 });
  const posicoesDepois = await pagina.locator('[data-peca]').evaluateAll(els => els.map(el => el.getAttribute('data-posicao-peca')));
  conferir(JSON.stringify(posicoesAntes) === JSON.stringify(posicoesDepois), `retrato: pinça não move peças (${posicoesAntes} / ${posicoesDepois})`);
  conferir(await quadro() === ajustar, `retrato: ajustar recupera o enquadramento de todas as peças (${ajustar} / ${await quadro()})`);
  // Arrasto no fundo livre: move só a câmera.
  const inicio = { x: caixaArea.x + caixaArea.width / 2, y: caixaArea.y + caixaArea.height - 15, id: 1 };
  const geometriaAntes = await pagina.locator('[data-peca]').evaluateAll(els => els.map(el => [el.getAttribute('data-posicao-peca'), el.getAttribute('data-acesa')]));
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [inicio] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{...inicio, x: inicio.x + 45, y: inicio.y - 10}] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await esperarPronto(pagina);
  conferir(await quadro() !== ajustar, "retrato: arrastar o fundo move a área do circuito");
  const geometriaDepois = await pagina.locator('[data-peca]').evaluateAll(els => els.map(el => [el.getAttribute('data-posicao-peca'), el.getAttribute('data-acesa')]));
  conferir(JSON.stringify(geometriaAntes) === JSON.stringify(geometriaDepois), "retrato: navegar não altera o circuito");
  await tocar(pagina.getByRole("button", { name: "Ajustar à tela", exact: true }));
}

if (cdpToque) await cdpToque.detach();
const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`circuito.mjs ${MODO}: ok`);
