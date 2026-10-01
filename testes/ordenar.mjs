// Ordenar passos nas demonstrações do /lab: o café (lab-logica-u1-f5: tirar o
// cartão que sobra, arrastar pela alça com o mouse ou com o dedo, tocar no
// cartão e depois em "Pôr aqui", as setas e a ordem validada pelas
// dependências), o agrupar (lab-logica-u1-f6: subpassos dentro dos passos
// grandes) e o plano de código (lab-logica-u1-f7: Rodar mostra o erro da
// ordem errada e o 18 da certa).
// Uso: node testes/ordenar.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

async function abrirFase(id) {
  const aberto = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: `/lab/fases?fase=${id}`, esperar: "[data-plano-ordenar]" });
  const { pagina } = aberto;
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
  await esperarPronto(pagina, 30000);
  for (let i = 0; i < 4; i++) {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) break;
    if (toque) await botao.tap();
    else await botao.click();
    await esperarPronto(pagina);
  }
  const cdp = toque ? await aberto.contexto.newCDPSession(pagina) : null;
  if (cdp) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 2 });
  return { ...aberto, cdp };
}

function ferramentas({ pagina, cdp }) {
  const tocar = async (localizador) => {
    if (movel) await fecharBalao(pagina);
    await localizador.scrollIntoViewIfNeeded();
    if (toque) await localizador.tap();
    else await localizador.click();
    await esperarPronto(pagina);
  };
  /** Arrasta o cartão pela alça até perto do fim do alvo (mouse, ou o dedo de verdade pelo CDP). */
  const arrastar = async (passo, alvo, { naPilha = false } = {}) => {
    if (movel) await fecharBalao(pagina);
    const alca = pagina.locator(`[data-alca-passo="${passo}"]`).first();
    await alca.scrollIntoViewIfNeeded();
    const a = await alca.boundingBox();
    const b = await alvo.boundingBox();
    const [x1, y1] = [a.x + a.width / 2, a.y + a.height / 2];
    const [x2, y2] = [b.x + b.width / 2, b.y + b.height - 6];
    if (!cdp) {
      await pagina.mouse.move(x1, y1);
      await pagina.mouse.down();
      await pagina.mouse.move(x2, y2, { steps: 10 });
      if (naPilha) conferir((await pagina.locator("[data-pilha-ordenar].border-primaria").count()) === 1, `${MODO}: arrastando para a pilha, ela acende`);
      else conferir((await pagina.locator("[data-indicador-soltar]").count()) === 1, `${MODO}: arrastando, uma linha mostra onde o cartão cai`);
      await pagina.mouse.up();
    } else {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x1, y: y1, id: 1 }] });
      for (let i = 1; i <= 10; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x1 + ((x2 - x1) * i) / 10, y: y1 + ((y2 - y1) * i) / 10, id: 1 }] });
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    }
    await esperarPronto(pagina);
  };
  const naConversa = async (nome) => {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: nome }).first();
    await botao.waitFor({ timeout: 10000 });
    if (toque) await botao.tap();
    else await botao.click();
    await esperarPronto(pagina);
  };
  const concluido = async () => {
    if (movel) await abrirBalao(pagina);
    return pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first().isVisible();
  };
  const esperarObjetivo = (id) =>
    pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });
  const plano = (destino = "plano") => pagina.locator(`[data-lista-ordenar="${destino}"] [data-item-ordenar]`).evaluateAll((els) => els.map((e) => e.dataset.itemOrdenar));
  return { tocar, arrastar, naConversa, concluido, esperarObjetivo, plano };
}

// ---------------------------------------------------------------- 1. o café (ordenar)
{
  const aberto = await abrirFase("lab-logica-u1-f5");
  const { pagina, navegador, erros } = aberto;
  const { tocar, arrastar, naConversa, concluido, esperarObjetivo, plano } = ferramentas(aberto);
  await esperarObjetivo("tirar-sobra");
  conferir(JSON.stringify(await plano()) === '["gelo"]', `${MODO}: o cartão que sobra já começa no plano`);
  await tocar(pagina.locator('[data-tirar-passo="gelo"]'));
  conferir((await plano()).length === 0 && (await pagina.locator('[data-pilha-ordenar] [data-cartao-passo="gelo"]').count()) === 1, `${MODO}: o x devolve o cartão para a pilha`);
  conferir(await concluido(), `${MODO}: semSobras passa`);
  await naConversa(/Próximo objetivo/);

  await esperarObjetivo("primeiro");
  if (movel) await abrirBalao(pagina);
  const opcao = await opcaoDaPrevisao(pagina);
  if (toque) await opcao.tap();
  else await opcao.click();
  await esperarPronto(pagina);
  await arrastar("filtro", pagina.locator('[data-lista-ordenar="plano"]'));
  conferir(JSON.stringify(await plano()) === '["filtro"]', `${MODO}: arrastar pela alça põe o cartão no plano`);
  conferir(await concluido(), `${MODO}: passoNoPlano passa`);
  await naConversa(/Próximo objetivo/);

  await esperarObjetivo("completar");
  // Tocar no cartão e depois em "Pôr aqui" (no fim).
  for (const passo of ["po", "despejar", "servir"]) {
    await tocar(pagina.locator(`[data-escolher-passo="${passo}"]`).first());
    await tocar(pagina.locator('[data-por-aqui="plano:fim"]'));
  }
  conferir(JSON.stringify(await plano()) === '["filtro","po","despejar","servir"]', `${MODO}: tocar e pôr no fim monta o plano`);
  conferir(!(await concluido()), `${MODO}: sem ferver a água, o plano ainda não vale`);
  // Ferver no fim (inválido) e depois sobe com a seta até antes de despejar.
  await tocar(pagina.locator('[data-escolher-passo="ferver"]').first());
  await tocar(pagina.locator('[data-por-aqui="plano:fim"]'));
  conferir(!(await concluido()), `${MODO}: ferver depois de servir não vale`);
  await tocar(pagina.locator('[data-subir-passo="ferver"]'));
  await tocar(pagina.locator('[data-subir-passo="ferver"]'));
  conferir(JSON.stringify(await plano()) === '["filtro","po","ferver","despejar","servir"]', `${MODO}: as setas sobem o cartão`);
  conferir(await concluido(), `${MODO}: ordemValida aceita esta ordem (o filtro antes da água)`);
  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} café: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}

// ---------------------------------------------------------------- 2. a festa (agrupar)
{
  const aberto = await abrirFase("lab-logica-u1-f6");
  const { pagina, navegador, erros } = aberto;
  const { tocar, arrastar, naConversa, concluido, esperarObjetivo, plano } = ferramentas(aberto);
  await esperarObjetivo("um-no-lugar");
  await arrastar("lista", pagina.locator('[data-lista-ordenar="convidar"]'));
  conferir(JSON.stringify(await plano("convidar")) === '["lista"]', `${MODO}: o subpasso cai dentro do passo grande`);
  conferir(await concluido(), `${MODO}: passoNoPlano com grupo passa`);
  await naConversa(/Próximo objetivo/);
  await esperarObjetivo("decompor");
  for (const [passo, grupo] of [["mensagem", "convidar"], ["bolo", "preparar"], ["enfeitar", "preparar"], ["parabens", "festejar"], ["cortar", "festejar"]]) {
    await tocar(pagina.locator(`[data-escolher-passo="${passo}"]`).first());
    await tocar(pagina.locator(`[data-por-aqui="${grupo}:fim"]`));
  }
  conferir(await concluido(), `${MODO}: agrupar com cada subpasso no seu passo grande vale`);
  conferir((await pagina.locator('[data-pilha-ordenar] [data-cartao-passo="imposto"]').count()) === 1, `${MODO}: o cartão que sobra ficou na pilha`);
  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} festa: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}

// ---------------------------------------------------------------- 3. o plano de código (Rodar)
{
  const aberto = await abrirFase("lab-logica-u1-f7");
  const { pagina, navegador, erros } = aberto;
  const { tocar, arrastar, naConversa, concluido, esperarObjetivo, plano } = ferramentas(aberto);
  await esperarObjetivo("quebrar");
  await tocar(pagina.locator("[data-rodar-plano]"));
  const erro = await pagina.locator("[data-resultado-plano]").innerText();
  conferir(erro.includes("ReferenceError"), `${MODO}: na ordem errada, Rodar mostra o ReferenceError`);
  conferir(await concluido(), `${MODO}: erroDoTipo passa`);
  await naConversa(/Próximo objetivo/);
  await esperarObjetivo("consertar");
  // preco para o começo (arrastando para cima do console.log) e o resto no lugar.
  await tocar(pagina.locator('[data-escolher-passo="preco"]').first());
  await tocar(pagina.locator('[data-por-aqui="plano:0"]'));
  for (const passo of ["desconto", "total"]) {
    await tocar(pagina.locator(`[data-escolher-passo="${passo}"]`).first());
    await tocar(pagina.locator('[data-por-aqui="plano:1"]').last());
  }
  // total caiu antes de desconto: a seta desce.
  if (JSON.stringify(await plano()) !== '["preco","desconto","total","mostrar"]') await tocar(pagina.locator('[data-descer-passo="total"]'));
  conferir(JSON.stringify(await plano()) === '["preco","desconto","total","mostrar"]', `${MODO}: o plano de código na ordem certa (${await plano()})`);
  // Arrastar o cartão que sobra para o plano e de volta para a pilha.
  await arrastar("errado", pagina.locator('[data-lista-ordenar="plano"]'));
  await arrastar("errado", pagina.locator("[data-pilha-ordenar]"), { naPilha: true });
  conferir((await pagina.locator('[data-pilha-ordenar] [data-cartao-passo="errado"]').count()) === 1, `${MODO}: soltar na pilha tira o cartão do plano`);
  await tocar(pagina.locator("[data-rodar-plano]"));
  const saida = pagina.locator("[data-resultado-plano] [data-linha-console='saida-log']").last();
  conferir((await saida.getAttribute("data-texto")) === "18", `${MODO}: na ordem certa, Rodar mostra 18`);
  conferir(await concluido(), `${MODO}: ordemValida + saida passam`);
  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} código: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}
console.log(`ordenar.mjs ${MODO}: ok`);
