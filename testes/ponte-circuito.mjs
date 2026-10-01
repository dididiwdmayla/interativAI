// Desafio com circuito, na ponte circuito/Console (/lab/fases?fase=lab-logica-u1-f3):
// a bancada é a tela, o painel tem a tabela verdade e o Console (no celular,
// um seletor entre os dois), e o checklist marca a parte do circuito (montar
// o E) e a do código (o mesmo E no Console). O toque na bancada em si é
// conferido em testes/circuito.mjs; aqui o circuito é montado pelas bolinhas.
// Uso: node testes/ponte-circuito.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-logica-u1-f3", esperar: "[data-bancada-circuito]" });
const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
await esperarPronto(pagina, 30000);

async function tocar(localizador) {
  if (movel) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
  await esperarPronto(pagina);
}
/** As bolinhas pelo clique (o gesto de toque na bancada tem teste próprio). */
async function clicar(localizador) {
  if (movel) await fecharBalao(pagina);
  await localizador.click();
  await esperarPronto(pagina);
}
for (let i = 0; i < 4; i++) {
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
  if (!(await botao.isVisible().catch(() => false))) break;
  await (toque ? botao.tap() : botao.click());
  await esperarPronto(pagina);
}
/** A parte está marcada (no celular em pé o checklist abre na barra; deitado, fica no balão). */
async function feita(id) {
  const barra = pagina.locator("button[aria-expanded]").filter({ hasText: /Checklist|Desafio/ }).first();
  if (MODO === "retrato") {
    await fecharBalao(pagina);
    await barra.tap();
    await esperarPronto(pagina);
  }
  if (MODO === "paisagem") await abrirBalao(pagina);
  const marcada = (await pagina.locator(`[data-parte="${id}"][data-feita="true"]`).count()) > 0;
  if (MODO === "retrato") {
    await barra.tap();
    await esperarPronto(pagina);
  }
  return marcada;
}
/** Espera a parte marcar (até 8 s). */
async function esperarParte(id) {
  for (let i = 0; i < 16; i++) {
    if (await feita(id)) return true;
    await pagina.waitForTimeout(500);
  }
  return false;
}

conferir((await pagina.locator("[data-ponte-circuito-console]").count()) === 1, `${MODO}: o painel da ponte aparece`);
conferir(await pagina.locator("[data-bancada-circuito]").isVisible(), `${MODO}: a bancada é a tela`);
if (movel) {
  await tocar(pagina.getByRole("tab", { name: "Tabela verdade" }));
  conferir(await pagina.locator("[data-tabela-verdade]").isVisible(), `${MODO}: o seletor mostra a tabela verdade`);
} else {
  conferir(await pagina.locator("[data-tabela-verdade]").isVisible(), `${MODO}: a tabela verdade fica em cima`);
  conferir(await pagina.locator("[data-console]").first().isVisible(), `${MODO}: o Console fica embaixo`);
}

// Parte 1: o E na bancada.
await tocar(pagina.locator("[data-portao-paleta='e']"));
for (const [de, para, porta] of [["cartao", "e1", 0], ["livre", "e1", 1], ["e1", "gira", 0]]) {
  await clicar(pagina.locator(`[data-porta-saida="${de}"]`));
  await clicar(pagina.locator(`[data-porta-entrada="${para}:${porta}"]`));
}
conferir((await pagina.locator("[data-fio]").count()) === 3, `${MODO}: três fios na bancada`);
conferir(await esperarParte("monta-a-catraca"), `${MODO}: a parte da bancada marca`);

// Parte 2: o mesmo E no Console.
if (movel) await tocar(pagina.getByRole("tab", { name: "Console" }));
const consoleVisivel = pagina.locator("[data-console]:visible").first();
if (movel) await fecharBalao(pagina);
await consoleVisivel.locator("[data-entrada-console]").click();
await pagina.keyboard.insertText("let gira = temCartao && catracaLivre");
if (toque) await consoleVisivel.locator("[data-rodar-console]").tap();
else await pagina.keyboard.press("Enter");
await esperarPronto(pagina);
conferir(await esperarParte("no-console"), `${MODO}: a parte do Console marca`);
if (movel) await abrirBalao(pagina);
conferir(await pagina.getByRole("button", { name: /Ver resultado/ }).first().isVisible().catch(() => false), `${MODO}: com as duas partes, o desafio fecha`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`ponte-circuito.mjs ${MODO}: ok`);
