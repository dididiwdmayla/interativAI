// Áudio: ajustes de som (mudam, ficam salvos, funcionam no toque) e a
// navegação mapa -> ilha -> fase -> mapa -> museu com o AudioContext real
// do Chromium, trocando a música certa e tocando os efeitos gravados, sem
// erro no console.
import { abrir, conferir, errosRelevantes, pularMeta } from "./util.mjs";

const faixaTocando = (pagina) => pagina.evaluate(() => document.documentElement.dataset.faixaMusica ?? null);
const esperarFaixa = (pagina, faixa) =>
  pagina.waitForFunction((alvo) => (document.documentElement.dataset.faixaMusica ?? null) === alvo, faixa, { timeout: 15000 });
const ultimoEfeito = (pagina) =>
  pagina.evaluate(() => {
    const { ultimoEfeito: id, ultimoEfeitoFonte: fonte } = document.documentElement.dataset;
    return id ? `${id}:${fonte}` : null;
  });
/** Espera um momento grande tocar e devolve de onde ele veio (arquivo ou sintetizado). */
const esperarEfeito = async (pagina, id) => {
  await pagina.waitForFunction((alvo) => document.documentElement.dataset.ultimoEfeito === alvo, id, { timeout: 10000 });
  return pagina.evaluate(() => document.documentElement.dataset.ultimoEfeitoFonte);
};

// ---------------------------------------------------------------- desktop: ajustes salvos
{
  const { navegador, pagina, erros } = await abrir({ progresso: null, rota: "/", esperar: "[data-mapa=mundo]" });
  const botao = pagina.getByRole("button", { name: "Ajustes de som" });
  await botao.click();
  const painel = pagina.locator("[data-ajustes-som]");
  await painel.waitFor();
  conferir((await botao.getAttribute("aria-expanded")) === "true", "desktop: o botão de som abre os ajustes");
  const musica = painel.getByLabel("Música");
  const efeitos = painel.getByLabel("Efeitos");
  const voz = painel.getByLabel("Voz do computadorzinho");
  conferir(
    (await musica.inputValue()) === "50" && (await efeitos.inputValue()) === "70" && (await voz.inputValue()) === "70",
    "desktop: padrões música 50%, efeitos 70%, voz 70%",
  );
  await musica.fill("30");
  await voz.fill("45");
  await efeitos.focus();
  await pagina.keyboard.press("ArrowLeft");
  conferir((await efeitos.inputValue()) === "65", "desktop: o teclado muda o volume (setas)");
  conferir((await painel.getByText("30%").count()) === 1, "desktop: o valor aparece ao lado do rótulo");
  await painel.getByRole("button", { name: "Testar voz" }).click();
  await pagina.waitForTimeout(400);
  await painel.getByRole("button", { name: "Silenciar tudo" }).click();
  const silenciar = painel.locator("[data-silenciar]");
  conferir((await silenciar.getAttribute("aria-pressed")) === "true", "desktop: Silenciar tudo liga");
  conferir(await musica.isDisabled(), "desktop: com tudo silenciado, os volumes ficam desativados");
  conferir(await painel.getByRole("button", { name: "Testar voz" }).isDisabled(), "desktop: e o Testar voz também");

  await pagina.reload();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  await pagina.getByRole("button", { name: "Ajustes de som" }).click();
  await painel.waitFor();
  conferir(
    (await musica.inputValue()) === "30" && (await efeitos.inputValue()) === "65" && (await voz.inputValue()) === "45",
    "desktop: os volumes continuam depois de recarregar",
  );
  conferir((await silenciar.getAttribute("aria-pressed")) === "true", "desktop: e o silenciar também");
  await silenciar.click();
  conferir((await silenciar.getAttribute("aria-pressed")) === "false", "desktop: religar o som");
  const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2") ?? "{}"));
  conferir(
    salvo.som === true && salvo.volumeMusica === 0.3 && salvo.volumeEfeitos === 0.65 && salvo.volumeVoz === 0.45,
    "desktop: salvo no progresso, junto das outras configurações",
  );
  await pagina.keyboard.press("Escape");
  await painel.waitFor({ state: "detached" });
  conferir(true, "desktop: Esc fecha os ajustes");
  conferir(errosRelevantes(erros).length === 0, `desktop: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ---------------------------------------------------------------- navegação com música de verdade
{
  const { navegador, pagina, erros } = await abrir({ progresso: null, rota: "/", esperar: "[data-mapa=mundo]" });
  // Nada toca antes do primeiro gesto; o primeiro gesto libera o áudio (e toca o boot).
  conferir(
    (await faixaTocando(pagina)) === null && (await ultimoEfeito(pagina)) === null,
    "navegação: nada toca antes do primeiro gesto",
  );
  // O arquivo do boot é baixado e decodificado antes do gesto, para já estar pronto nele.
  await pagina.waitForLoadState("networkidle");
  await pagina.locator("[data-total-estrelas]").click();
  const boot = await ultimoEfeito(pagina);
  conferir(boot === "boot:arquivo", `navegação: o boot toca do arquivo, já no primeiro gesto (${boot})`);
  await esperarFaixa(pagina, "mapa");
  conferir(true, "navegação: o mapa do mundo toca a faixa mapa");

  await pagina.locator('[data-ilha="sites"]').first().click();
  conferir((await esperarEfeito(pagina, "viagem-ilha")) === "arquivo", "navegação: viagem para a ilha toca o arquivo gravado");
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await esperarFaixa(pagina, "sites");
  conferir(true, "navegação: a ilha Sites toca a faixa sites (decodificada de verdade, com crossfade)");
  // A partir daqui, qualquer recomeço da faixa marcaria a página de novo.
  await pagina.evaluate(() => {
    window.__trocasDeFaixa = 0;
    new MutationObserver(() => window.__trocasDeFaixa++).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-faixa-musica"],
    });
  });

  await pagina.locator('[data-unidade="sites-elementos-u1"]').click();
  await pagina.getByRole("dialog").getByRole("button", { name: "Jogar" }).click();
  await pagina.waitForSelector("section[data-previa] iframe");
  await pularMeta(pagina);
  // A conversa inicial fala com a voz de modem; Enter avança (interrompe a fala anterior).
  await pagina.waitForTimeout(500);
  await pagina.keyboard.press("Enter");
  await pagina.waitForTimeout(300);
  await pagina.keyboard.press("Enter");
  await pagina.waitForTimeout(300);
  conferir((await faixaTocando(pagina)) === "sites", "navegação: a fase da ilha Sites continua na faixa sites");
  conferir((await pagina.evaluate(() => window.__trocasDeFaixa)) === 0, "navegação: a música não reinicia entre ilha e fase");

  await pagina.locator("[data-botao-mapa]").first().click();
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await pagina.waitForTimeout(300);
  conferir((await pagina.evaluate(() => window.__trocasDeFaixa)) === 0, "navegação: voltar para a ilha também não reinicia");

  await pagina.getByRole("link", { name: /mundo/i }).first().click();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  conferir((await esperarEfeito(pagina, "entrar-mapa")) === "arquivo", "navegação: voltar ao mundo toca o arquivo de chegada");
  await esperarFaixa(pagina, "mapa");
  conferir(true, "navegação: de volta ao mundo, a faixa mapa entra no lugar da sites");

  await pagina.locator('[data-ilha="origens"]').first().click();
  await pagina.locator("[data-mapa=museu]").waitFor();
  conferir((await esperarEfeito(pagina, "abrir-museu")) === "arquivo", "navegação: o museu abre com a porta gravada");
  await esperarFaixa(pagina, "origens");
  conferir(true, "navegação: o Museu das Origens toca a faixa origens");

  // Voltar ao mapa e entrar numa ilha em construção (que já tem faixa): troca direto.
  await pagina.goBack();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  await pagina.locator('[data-ilha="logica"]').first().click();
  await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
  await esperarFaixa(pagina, "logica");
  conferir(true, "navegação: a ilha Lógica toca a faixa logica");
  await pagina.goBack();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  await pagina.locator('[data-ilha="frameworks"]').first().click();
  await pagina.locator("[data-mapa=ilha][data-ilha=frameworks]").waitFor();
  await esperarFaixa(pagina, null);
  conferir(true, "navegação: ilha sem faixa (Frameworks) fica em silêncio, sem erro");

  conferir(errosRelevantes(erros).length === 0, `navegação: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ---------------------------------------------------------------- efeito gravado que não carrega
{
  const { navegador, contexto, pagina, erros } = await abrir({ progresso: null, rota: "/", esperar: "[data-mapa=mundo]" });
  // Os arquivos de efeito somem (404): cada momento grande cai na versão sintetizada.
  await contexto.route(/\/audio\/efeitos\/[^/]+\.(webm|m4a)$/, (rota) => rota.fulfill({ status: 404, body: "" }));
  await pagina.reload();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  await pagina.waitForLoadState("networkidle");
  await pagina.locator("[data-total-estrelas]").click();
  const boot = await ultimoEfeito(pagina);
  conferir(boot === "boot:sintetizado", `sem arquivo: o boot toca a versão sintetizada (${boot})`);
  await pagina.locator('[data-ilha="sites"]').first().click();
  conferir(
    (await esperarEfeito(pagina, "viagem-ilha")) === "sintetizado",
    "sem arquivo: a viagem para a ilha toca a versão sintetizada",
  );
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await esperarFaixa(pagina, "sites");
  conferir(true, "sem arquivo: a música segue normal");
  // O 404 aparece no console pelo próprio navegador; fora ele, nada.
  const outros = errosRelevantes(erros).filter((texto) => !/Failed to load resource/.test(texto));
  conferir(outros.length === 0, `sem arquivo: console limpo ${JSON.stringify(outros)}`);
  await navegador.close();
}

// ---------------------------------------------------------------- celular em pé: toque
{
  const { navegador, pagina, erros } = await abrir({
    largura: 390,
    altura: 844,
    toque: true,
    progresso: null,
    rota: "/",
    esperar: "[data-mapa=mundo]",
  });
  const menu = pagina.getByRole("button", { name: "Mais opções" });
  await menu.tap();
  const painel = pagina.locator("[data-ajustes-som]");
  await painel.waitFor({ state: "visible" });
  conferir(true, "retrato: os ajustes de som estão no menu");
  const voz = painel.getByLabel("Voz do computadorzinho");
  const caixa = await voz.boundingBox();
  conferir(caixa.height >= 44, `retrato: controle de volume com área de toque de 44 px (${caixa.height})`);
  await pagina.touchscreen.tap(caixa.x + caixa.width * 0.1, caixa.y + caixa.height / 2);
  const valor = Number(await voz.inputValue());
  conferir(valor <= 25, `retrato: tocar no controle muda o volume (voz em ${valor}%)`);

  const silenciar = painel.locator("[data-silenciar]");
  const alvo = await silenciar.boundingBox();
  conferir(alvo.height >= 44, "retrato: botão Silenciar tudo com 44 px");
  await silenciar.tap();
  conferir((await silenciar.getAttribute("aria-pressed")) === "true", "retrato: Silenciar tudo liga com um toque");
  conferir(await painel.isVisible(), "retrato: o menu continua aberto depois de mexer no som");
  await silenciar.tap();
  conferir((await silenciar.getAttribute("aria-pressed")) === "false", "retrato: e desliga com outro toque");
  await painel.getByRole("button", { name: "Testar voz" }).tap();
  await pagina.waitForTimeout(300);

  await pagina.reload();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  await pagina.getByRole("button", { name: "Mais opções" }).tap();
  await painel.waitFor({ state: "visible" });
  conferir(Number(await voz.inputValue()) === valor, "retrato: o volume tocado continua depois de recarregar");

  // Dentro da fase, os ajustes também estão no menu.
  await pagina.locator('[data-ilha="sites"]').first().tap().catch(async () => {
    await pagina.keyboard.press("Escape");
    await pagina.locator('[data-ilha="sites"]').first().tap();
  });
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await pagina.locator('[data-unidade="sites-elementos-u1"]').tap();
  await pagina.getByRole("dialog").getByRole("button", { name: "Jogar" }).tap();
  await pagina.waitForSelector("section[data-previa] iframe");
  await pularMeta(pagina);
  await pagina.getByRole("button", { name: "Mais opções" }).tap();
  await painel.waitFor({ state: "visible" });
  conferir(Number(await voz.inputValue()) === valor, "retrato: a fase mostra os mesmos ajustes no menu");

  conferir(errosRelevantes(erros).length === 0, `retrato: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
