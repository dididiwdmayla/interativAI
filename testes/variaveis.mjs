// Variáveis CSS e @media no painel Estilos, na Bancada de variáveis
// (/lab/fases?fase=lab-motor-u1-f3): as variáveis aparecem nas regras que
// as declaram (e no "Herdado de"), o var() mostra o valor resolvido e o
// clique no nome leva até a declaração; a regra da @media tem o cabeçalho
// "@media (...)" acima do seletor e só aparece quando a prévia é estreita,
// concordando com o matchMedia e com o getComputedStyle do próprio iframe.
// Uso: node testes/variaveis.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, esperarPronto, selecionarNo } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], rota: "/lab/fases?fase=lab-motor-u1-f3", esperar: "section[data-previa] iframe" });
const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
const iframe = pagina.locator("section[data-previa] iframe");
const estiloDe = (seletor, propriedade) =>
  iframe.evaluate((el, [s, p]) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector(s)).getPropertyValue(p).trim(), [seletor, propriedade]);

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
}

async function mostrarEstilos() {
  if (!toque) return;
  const segmento = pagina.getByRole("tab", { name: "Estilos", exact: true }).first();
  if ((await segmento.count()) > 0 && (await segmento.getAttribute("aria-selected")) !== "true") await tocar(segmento);
  await esperarPronto(pagina);
}

// ---------------------------------------------------------------- var() no painel
await selecionarNo(pagina, ".card h2");
await mostrarEstilos();
const regraH2 = pagina.locator('[data-lista-estilos] section[aria-label="Regra .card h2"]').first();
const linkDestaque = regraH2.locator('[data-declaracao="color"] [data-var-link="--destaque"]');
await linkDestaque.waitFor();
conferir((await linkDestaque.getAttribute("data-definida")) === "sim", `${MODO}: o var(--destaque) aparece como link de variável definida`);
const resolvido = await regraH2.locator('[data-declaracao="color"] [data-valor-resolvido]').textContent();
conferir(resolvido === "#7b2cbf", `${MODO}: ao lado, o valor resolvido (encadeado: --destaque vem de --cor-marca): ${resolvido}`);
conferir((await estiloDe(".card h2", "color")) === "rgb(123, 44, 191)", `${MODO}: e a prévia concorda (${await estiloDe(".card h2", "color")})`);
// As variáveis aparecem onde são declaradas: no :root, pelo "Herdado de html".
const raiz = pagina.locator('[data-herdado-de="html"] section[aria-label="Regra :root"]');
conferir((await raiz.locator('[data-declaracao="--cor-marca"]').count()) === 1, `${MODO}: --cor-marca aparece na regra :root (Herdado de html)`);
await tocar(linkDestaque);
await pagina.locator('[data-apontada="sim"] [data-declaracao="--destaque"]').waitFor();
conferir(true, `${MODO}: clicar no nome leva até a declaração de --destaque no :root`);
await esperarPronto(pagina);

// Reserva: --cor-alerta não existe, vale a reserva.
await selecionarNo(pagina, ".aviso");
await mostrarEstilos();
const aviso = pagina.locator('[data-lista-estilos] section[aria-label="Regra .aviso"] [data-declaracao="color"]');
conferir((await aviso.locator('[data-var-link="--cor-alerta"]').getAttribute("data-definida")) === "nao", `${MODO}: variável que não existe aparece apagada`);
conferir((await aviso.locator("[data-valor-resolvido]").textContent()) === "#b00020", `${MODO}: e o valor resolvido é a reserva`);

// Variável sobrescrita numa regra (.promo): o card do meio usa a dele.
await selecionarNo(pagina, "#pilates h2");
await mostrarEstilos();
const doPilates = pagina.locator('[data-lista-estilos] section[aria-label="Regra .card h2"] [data-declaracao="color"] [data-valor-resolvido]').first();
conferir((await doPilates.textContent()) === "#e85d04", `${MODO}: no card .promo, --destaque vem da regra .promo (${await doPilates.textContent()})`);
conferir((await estiloDe("#pilates h2", "color")) === "rgb(232, 93, 4)", `${MODO}: e a prévia concorda`);

// ---------------------------------------------------------------- @media contra a largura da prévia
await selecionarNo(pagina, ".cards");
await mostrarEstilos();
const largura = await iframe.evaluate((el) => el.contentWindow.innerWidth);
const estreita = await iframe.evaluate((el) => el.contentWindow.matchMedia("(max-width: 600px)").matches);
const cabecalhos = pagina.locator('[data-lista-estilos] [data-condicao-regra="media"]');
conferir(
  ((await cabecalhos.count()) > 0) === estreita,
  `${MODO}: com a prévia em ${largura} px, a regra da @media ${estreita ? "aparece" : "não aparece"} no painel (como o matchMedia do iframe)`,
);
if (estreita) {
  conferir((await cabecalhos.first().textContent()).trim() === "@media (max-width: 600px)", `${MODO}: com o cabeçalho @media acima do seletor`);
  conferir((await estiloDe(".cards", "grid-template-columns")).split(" ").length === 1, `${MODO}: e a prévia mostra uma coluna`);
} else {
  conferir((await estiloDe(".cards", "grid-template-columns")).split(" ").length === 3, `${MODO}: e a prévia mostra três colunas`);
}

conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
