// O circuito lógico, na demonstração (/lab/fases?fase=lab-logica-u1-f2):
// tirar um portão E da paleta, ligar os fios tocando na bolinha da direita e
// depois na peça de destino, arrastar uma peça, ligar e desligar as chaves
// (fios e porta acendendo), a tabela verdade marcando as linhas testadas, o
// "Ver como código" batendo com a tabela e o NÃO trocando um fio. Mouse e toque.
// Uso: node testes/circuito.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-logica-u1-f2", esperar: "[data-bancada-circuito]" });
const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
await esperarPronto(pagina, 30000);

async function tocar(localizador, opcoes = {}) {
  if (movel) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap(opcoes);
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
const opcao = pagina.locator("[data-previsao] button").nth(1);
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

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`circuito.mjs ${MODO}: ok`);
