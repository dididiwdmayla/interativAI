// E5: o próprio jogo como site-alvo e o Meu tema, na Bancada do tema
// (/lab/fases?fase=lab-motor-u1-f4): a maquete com as cores reais do tema
// aberto, a variável do :root editada pelo "Herdado de html" repintando a
// maquete ao vivo, o aviso de contraste (lista os pares ruins e deixa
// salvar mesmo assim), o Meu tema salvo valendo no jogo inteiro (e depois
// de recarregar, sem piscar), no seletor de tema, na oficina /meu-tema
// (editar e apagar) e o link do card na Caixa de Ferramentas.
// Uso: node testes/tema.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, esperarPronto, fecharBalao, selecionarNo, URL_JOGO } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-motor-u1-f4", esperar: "section[data-previa] iframe" });
const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
await esperarPronto(pagina);
const iframe = pagina.locator("section[data-previa] iframe");
const corNaMaquete = (seletor, propriedade) =>
  iframe.evaluate((el, [s, p]) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector(s)).getPropertyValue(p).trim(), [seletor, propriedade]);
/** A cor de um token no próprio jogo (no <html>), já como rgb. */
const corNoJogo = (token) =>
  pagina.evaluate((nome) => {
    const sonda = document.createElement("span");
    sonda.style.color = `var(${nome})`;
    document.body.append(sonda);
    const cor = getComputedStyle(sonda).color;
    sonda.remove();
    return cor;
  }, token);

async function tocar(localizador) {
  // No celular, a conversa aberta cobre o painel: fecha antes.
  if (toque && (await pagina.locator("[data-jogo-fase]").count()) > 0) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
}

async function mostrarEstilos() {
  if (!toque) return;
  const segmento = pagina.getByRole("tab", { name: "Estilos", exact: true }).first();
  if ((await segmento.getAttribute("aria-selected")) !== "true") await tocar(segmento);
  await esperarPronto(pagina);
}

/** Troca o valor de uma variável do :root pelo "Herdado de html" do painel Estilos. */
async function trocarVariavel(nome, valor) {
  await mostrarEstilos();
  const linha = pagina.locator(`[data-herdado-de="html"] section[aria-label="Regra :root"] [data-declaracao="${nome}"] [data-valor-propriedade]`);
  await tocar(linha);
  const campo = pagina.locator("[data-campo-estilo=valor]");
  await campo.fill(valor);
  await campo.press("Enter");
  await esperarPronto(pagina);
}

// ---------------------------------------------------------------- a maquete com as cores reais
const primariaDoce = await corNoJogo("--cor-primaria");
conferir((await corNaMaquete("#botao", "background-color")) === primariaDoce, `${MODO}: o botão da maquete tem a --cor-primaria real do tema (${primariaDoce})`);
conferir((await corNaMaquete("body", "background-color")) === (await corNoJogo("--cor-fundo")), `${MODO}: e o fundo, a --cor-fundo`);
const botaoSalvar = pagina.locator("[data-salvar-tema]");
conferir((await pagina.locator('[data-ferramenta~="salvar-tema"]').count()) === 1, `${MODO}: o botão Salvar como Meu tema é o alvo da ferramenta salvar-tema`);
if (toque) {
  const caixa = await botaoSalvar.boundingBox();
  conferir(caixa.width >= 44 && caixa.height >= 44, `${MODO}: o botão de salvar tem 44 px no toque (${caixa.width}x${caixa.height})`);
}

// ---------------------------------------------------------------- editar a variável repinta ao vivo
await selecionarNo(pagina, "#botao");
await mostrarEstilos();
const regraBotao = pagina.locator('[data-lista-estilos] section[aria-label="Regra .botao"]').first();
conferir((await regraBotao.locator('[data-declaracao="background"] [data-var-link="--cor-primaria"]').count()) === 1, `${MODO}: a regra .botao mostra o var(--cor-primaria)`);
await iframe.evaluate((el) => {
  el.contentWindow.__marca = "viva";
});
await trocarVariavel("--cor-primaria", "#1d4ed8");
conferir((await corNaMaquete("#botao", "background-color")) === "rgb(29, 78, 216)", `${MODO}: trocar --cor-primaria no :root repinta o botão da maquete`);
conferir((await iframe.evaluate((el) => el.contentWindow.__marca)) === "viva", `${MODO}: ao vivo, sem recarregar a maquete`);

// ---------------------------------------------------------------- contraste ruim: o aviso deixa salvar mesmo assim (mas aqui voltamos)
await trocarVariavel("--cor-texto-sobre-primaria", "#3b6ef0");
await tocar(botaoSalvar);
const aviso = pagina.locator("[data-aviso-contraste]");
await aviso.waitFor();
conferir((await aviso.locator('[data-par-ruim="--cor-texto-sobre-primaria --cor-primaria"]').count()) === 1, `${MODO}: o computadorzinho aponta o par ruim (texto no botão principal)`);
await tocar(pagina.getByRole("button", { name: "Voltar e ajustar" }));
await aviso.waitFor({ state: "detached" });
conferir((await pagina.evaluate(() => document.documentElement.dataset.theme)) === "doce", `${MODO}: voltar não salva nada`);
await trocarVariavel("--cor-texto-sobre-primaria", "#ffffff");

// ---------------------------------------------------------------- salvar: vale no jogo inteiro
await tocar(botaoSalvar);
await pagina.waitForFunction(() => document.documentElement.dataset.theme === "meu");
conferir(true, `${MODO}: com contraste bom, salva direto e liga o Meu tema`);
conferir((await corNoJogo("--cor-primaria")) === "rgb(29, 78, 216)", `${MODO}: a --cor-primaria do jogo virou a nova`);
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
conferir(salvo.tema === "meu" && salvo.meuTema.cores["--cor-primaria"] === "#1d4ed8" && salvo.meuTema.base === "doce", `${MODO}: salvo no progresso (base Doce)`);
conferir(Object.keys(salvo.meuTema.cores).length > 40, `${MODO}: com o conjunto inteiro de cores (${Object.keys(salvo.meuTema.cores).length})`);
await esperarPronto(pagina);

// Recarregar: o script de antes da pintura já põe o Meu tema.
await pagina.reload();
await pagina.waitForSelector("section[data-previa] iframe");
conferir((await pagina.evaluate(() => document.documentElement.dataset.theme)) === "meu", `${MODO}: depois de recarregar, continua o Meu tema`);
conferir((await pagina.locator("style#estilo-meu-tema").count()) === 1, `${MODO}: com um <style> só do Meu tema`);
// A maquete abre agora com as cores do Meu tema.
conferir((await corNaMaquete("#botao", "background-color")) === "rgb(29, 78, 216)", `${MODO}: a maquete abre com as cores do Meu tema`);

// ---------------------------------------------------------------- oficina /meu-tema: seletor, editar e apagar
await pagina.goto(`${URL_JOGO}/meu-tema`);
await pagina.locator("[data-tela=meu-tema]").waitFor();
if (toque) await tocar(pagina.getByRole("button", { name: "Mais opções" }));
conferir((await pagina.getByRole("radio", { name: /Tema Meu tema/ }).count()) === 1, `${MODO}: o Meu tema aparece no seletor de tema`);
if (toque) await pagina.keyboard.press("Escape");
const campoFundo = pagina.getByRole("textbox", { name: "Valor de --cor-fundo" });
await campoFundo.fill("#fffbe6");
await tocar(pagina.locator("[data-salvar-oficina]"));
await pagina.getByRole("status").filter({ hasText: "Salvo!" }).waitFor();
conferir((await corNoJogo("--cor-fundo")) === "rgb(255, 251, 230)", `${MODO}: a oficina edita e salva o Meu tema`);
await tocar(pagina.locator("[data-apagar-meu-tema]"));
await tocar(pagina.locator("[data-confirmar-apagar]"));
await pagina.waitForFunction(() => document.documentElement.dataset.theme === "doce");
conferir((await pagina.locator("style#estilo-meu-tema").count()) === 0, `${MODO}: apagar tira o Meu tema e volta ao Doce`);
const depois = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
conferir(depois.meuTema === null && !depois.temasDesbloqueados.includes("meu"), `${MODO}: e sai do progresso`);
conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();

// ---------------------------------------------------------------- o card na Caixa leva à oficina
{
  const { navegador: nav, pagina: pag, erros: errosCaixa } = await abrir({
    ...TAMANHOS[MODO],
    progresso: { versao: 2, apresentacoesVistas: ["salvar-tema"] },
    rota: "/",
    esperar: "[data-mapa=mundo]",
  });
  if (toque) await pag.getByRole("button", { name: "Mais opções" }).tap();
  const botaoCaixa = pag.getByRole("button", { name: /Caixa de Ferramentas|Ferramentas/ }).first();
  await (toque ? botaoCaixa.tap() : botaoCaixa.click());
  const link = pag.locator('[data-lugar-ferramenta="salvar-tema"]');
  await link.waitFor();
  await (toque ? link.tap() : link.click());
  await pag.locator("[data-tela=meu-tema]").waitFor();
  conferir(true, `${MODO}: o card Salvar como Meu tema da Caixa leva à oficina`);
  conferir(errosRelevantes(errosCaixa).length === 0, `${MODO}: console limpo na Caixa ${JSON.stringify(errosRelevantes(errosCaixa))}`);
  await nav.close();
}
