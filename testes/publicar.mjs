// A P2 "Do jogo pro mundo", jogada pelo mapa como um jogador que acabou o
// resto da Ilha Sites: Fase 1 (modo dispositivo, Lighthouse e Levar pro
// mundo apresentados; o .zip baixado de verdade e aberto aqui, com o
// index.html ligando o style.css; o sozinho leva um .zip novo com a cor
// nova) e Fase 2, o projeto-ponte (o site escrito do zero, o checklist de
// requisitos marcando sozinho, "Projeto pronto!", a volta pra ilha que
// acende inteira e o mundo marcando a ilha completa). Depois, Meus
// projetos: o cartão "Meu primeiro site" com a miniatura, o guia de
// publicação (passos marcados e o link, com o formato conferido) e o
// projeto reaberto do jeito que ficou.
// Uso: node testes/publicar.mjs [desktop|retrato|paisagem]
import { readFileSync } from "node:fs";
import { strFromU8, unzipSync } from "fflate";
import { PUBLICADAS, prontasDaIlha } from "./curriculo.mjs";
import { abaDaArvore, abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, passarApresentacao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";
const P2 = "sites-publicar-u2";

// O jogador acabou tudo o que a ilha tem antes da P2 e já viu as ferramentas de antes.
const antes = prontasDaIlha("sites").filter((unidade) => unidade.id !== P2).map((unidade) => unidade.id);
const IDS_FERRAMENTAS = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
// Modo dispositivo e Lighthouse são apresentados pela R1 e pela P1: a P2 só apresenta o Levar pro mundo.
const NOVAS = ["levar-pro-mundo"];
const progresso = {
  versao: 2,
  fasesConcluidas: antes.flatMap((id) => PUBLICADAS[id]),
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: IDS_FERRAMENTAS.filter((id) => !NOVAS.includes(id)),
  metasVistas: antes,
  unidadesComemoradas: antes,
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
};

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/ilha/sites", esperar: "[data-mapa=ilha]" });
const assentar = () => esperarPronto(pagina);

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
}
/** Toca algo do painel ou da prévia: no celular, o balão sai da frente antes. */
async function tocarNoJogo(localizador) {
  if (movel) await fecharBalao(pagina);
  await tocar(localizador);
  await assentar();
}
async function botaoConversa(nome) {
  if (movel) await abrirBalao(pagina);
  else await assentar();
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 8000 });
  await tocar(botao);
  await assentar();
}
async function introducao() {
  for (let i = 0; i < 6; i++) {
    // Depois do "Vamos lá!", a apresentação da ferramenta nova toma a frente.
    if ((await pagina.locator("[data-apresentacao]").count()) > 0) return;
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) return;
    await tocar(botao);
    await assentar();
  }
}
const objetivoAtual = () => pagina.locator("[data-jogo-fase]").getAttribute("data-objetivo-atual");
async function esperarObjetivo(id) {
  await pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 8000 });
}

/** Mostra o editor (no celular, o segmento Código) na aba pedida e devolve o conteúdo dele. */
async function editor(aba) {
  if (movel) {
    await fecharBalao(pagina);
    const codigo = pagina.getByRole("tab", { name: "Código", exact: true });
    if ((await codigo.getAttribute("aria-selected")) !== "true") await tocar(codigo);
  }
  const botaoAba = pagina.locator(`[data-aba-editor="${aba}"]`);
  if ((await botaoAba.getAttribute("aria-selected")) !== "true") await tocar(botaoAba);
  await assentar();
  return aba === "css" ? pagina.locator("[data-editor-css] .cm-content") : pagina.locator(".cm-content").first();
}
async function trocarTexto(aba, texto) {
  const conteudo = await editor(aba);
  await conteudo.click();
  await pagina.keyboard.press("ControlOrMeta+A");
  await pagina.keyboard.insertText(texto);
  await assentar();
}
async function voltarParaArvore() {
  if (movel) {
    await fecharBalao(pagina);
    await tocar(abaDaArvore(pagina));
    await assentar();
  }
}

/** Levar pro mundo: abre a janela, confere os dois arquivos, baixa e abre o .zip. */
async function levarProMundo(nome) {
  const botao = pagina.locator("[data-levar-pro-mundo]").first();
  if (!(await pagina.locator("[data-dialogo-levar-pro-mundo]").isVisible().catch(() => false))) await tocarNoJogo(botao);
  const janela = pagina.locator("[data-dialogo-levar-pro-mundo]");
  await janela.waitFor();
  await pagina.locator('[role=dialog][data-modal-assentado="sim"]').waitFor();
  const arquivos = await janela.locator("[data-arquivo-exportado]").evaluateAll((lista) => lista.map((el) => el.getAttribute("data-arquivo-exportado")));
  conferir(arquivos.join(",") === "index.html,style.css", `${nome}: a janela mostra os dois arquivos (${arquivos.join(", ")})`);
  const [download] = await Promise.all([pagina.waitForEvent("download"), tocar(pagina.locator("[data-baixar-zip]"))]);
  const caminho = await download.path();
  const zip = unzipSync(new Uint8Array(readFileSync(caminho)));
  const html = strFromU8(zip["index.html"]);
  const css = strFromU8(zip["style.css"]);
  conferir(Object.keys(zip).sort().join(",") === "index.html,style.css", `${nome}: o .zip (${download.suggestedFilename()}) tem só index.html e style.css`);
  conferir(/^<!DOCTYPE html>/i.test(html) && /<link rel="stylesheet" href="style.css">\s*<\/head>/.test(html), `${nome}: o index.html liga o style.css no head`);
  conferir(!html.includes("data-jogo-injetado") && !html.includes("data-folha-jogo") && !html.includes("<style"), `${nome}: e não leva nada do jogo nem o CSS dentro`);
  await pagina.keyboard.press("Escape");
  await janela.waitFor({ state: "detached" });
  await assentar();
  return { html, css, nomeDoArquivo: download.suggestedFilename() };
}

// ---------------------------------------------------------------- do mapa até a P2
const ponto = pagina.locator(`[data-unidade="${P2}"]`);
conferir((await ponto.getAttribute("data-estado")) === "disponivel", `${MODO}: com o resto da ilha feito, a P2 está aberta no mapa`);
conferir((await pagina.locator("[data-mapa=ilha]").getAttribute("data-ilha-completa")) === "nao", `${MODO}: a ilha ainda não está completa`);
await tocar(ponto);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar", exact: true }));
await pagina.locator(`[data-jogo-fase="${P2}-f1"]`).waitFor();
await assentar();

// ---------------------------------------------------------------- Fase 1: Arquivos de verdade
await introducao();
await tocarNoJogo(pagina.locator("[data-botao-dispositivo]"));
await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 390);
conferir(true, `${MODO}: o modo dispositivo liga no Celular 390`);
await botaoConversa("Próximo objetivo");

await esperarObjetivo("analisar");
await tocarNoJogo(pagina.getByRole("tab", { name: "Lighthouse", exact: true }));
await tocarNoJogo(pagina.locator("[data-analisar-auditoria]"));
await pagina.locator("[data-notas-auditoria]").waitFor();
const notaA11y = Number(await pagina.locator('[data-nota-auditoria="acessibilidade"]').getAttribute("data-nota"));
conferir(notaA11y >= 90, `${MODO}: o site da Bia tem Acessibilidade ${notaA11y}`);
await botaoConversa("Próximo objetivo");

await esperarObjetivo("levar-pro-mundo");
if (movel) await abrirBalao(pagina);
await tocar(pagina.getByRole("button", { name: "Liga a página ao arquivo do visual" }));
await assentar();
await passarApresentacao(pagina, "levar-pro-mundo", async () => {
  if (movel) await fecharBalao(pagina);
  await tocar(pagina.locator("[data-levar-pro-mundo]").first());
});
const primeiro = await levarProMundo(`${MODO} F1`);
conferir(primeiro.nomeDoArquivo === "cantinho-da-bia.zip", `${MODO}: o .zip leva o nome do site (${primeiro.nomeDoArquivo})`);
conferir(primeiro.css.includes("#8a3b12") && primeiro.css.includes("@media (max-width: 600px)"), `${MODO}: o style.css é a folha do jogo`);
conferir(primeiro.html.includes("<h1>Cantinho da Bia</h1>"), `${MODO}: o index.html é a página da Bia`);
await botaoConversa("Próximo objetivo");

await esperarObjetivo("mudar-e-levar-de-novo");
await voltarParaArvore();
const css = await editor("css");
await css.locator(".cm-line", { hasText: "color: #8a3b12;" }).click();
await pagina.keyboard.press("End");
for (let i = 0; i < "8a3b12;".length; i++) await pagina.keyboard.press("Backspace");
await pagina.keyboard.type("1d5c8a;");
await assentar();
const segundo = await levarProMundo(`${MODO} F1 de novo`);
conferir(segundo.css.includes("#1d5c8a") && !segundo.css.includes("#8a3b12"), `${MODO}: o .zip novo leva a cor nova`);
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
for (let i = 0; i < 4; i++) {
  const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
  if (!(await continuar.isVisible().catch(() => false))) break;
  await tocar(continuar);
  await assentar();
}
await tocar(pagina.getByRole("button", { name: "Próxima fase" }));
await pagina.locator(`[data-jogo-fase="${P2}-f2"]`).waitFor();
await assentar();

// ---------------------------------------------------------------- Fase 2: o projeto-ponte
await introducao();
conferir((await objetivoAtual()) === "projeto", `${MODO}: o projeto começa sem passo a passo`);
const checklist = movel ? null : pagina.locator("[data-checklist]");
if (checklist) conferir((await checklist.textContent()).includes("Requisitos do projeto"), `${MODO}: o checklist se chama Requisitos do projeto`);
if (movel) await abrirBalao(pagina);
await tocar(pagina.locator("[data-pergunta-projeto]"));
await assentar();
conferir(await pagina.evaluate(() => document.body.innerText.includes("vinte")), `${MODO}: o Me faz uma pergunta só pergunta (a do título da aba)`);

const MEU_SITE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Site do Leo</title>
</head>
<body>
  <header>
    <h1>Leo</h1>
  </header>
  <main>
    <h2>Sobre mim</h2>
    <p>Eu gosto de montar robôs de sucata.</p>
  </main>
  <footer>
    <p>Feito por mim.</p>
  </footer>
</body>
</html>`;
await voltarParaArvore();
await trocarTexto("html", MEU_SITE);
await trocarTexto("css", "body {\n  margin: 0;\n  font-family: Verdana, sans-serif;\n}\n\n@media (max-width: 600px) {\n  h1 {\n    font-size: 1.6rem;\n  }\n}\n");
const feitas = () => pagina.locator('[data-parte][data-feita="true"]').evaluateAll((lista) => lista.map((el) => el.getAttribute("data-parte")));
if (!movel) {
  await pagina.waitForFunction(() => document.querySelectorAll('[data-checklist] [data-feita="true"]').length === 4);
  conferir(true, `${MODO}: título, estrutura, conteúdo e @media marcam sozinhos (${(await feitas()).join(", ")})`);
}
await tocarNoJogo(pagina.getByRole("tab", { name: "Lighthouse", exact: true }));
await tocarNoJogo(pagina.locator("[data-analisar-auditoria]"));
await tocarNoJogo(pagina.getByRole("tab", { name: "Elementos", exact: true }));
await tocarNoJogo(pagina.locator("[data-botao-dispositivo]"));
await pagina.waitForFunction(() => document.querySelector("[data-jogo-fase]")?.getAttribute("data-etapa") !== "objetivos" || document.body.innerText.includes("Todos os requisitos"), null, { timeout: 8000 });
conferir(true, `${MODO}: com o Lighthouse e o Celular 390, todos os requisitos ficam prontos`);
await botaoConversa("Ver resultado");
const conclusao = pagina.locator("[data-conclusao]");
await conclusao.waitFor();
conferir((await conclusao.textContent()).includes("Projeto pronto!"), `${MODO}: a conclusão diz Projeto pronto!`);
for (let i = 0; i < 4; i++) {
  const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
  if (!(await continuar.isVisible().catch(() => false))) break;
  await tocar(continuar);
  await assentar();
}
conferir(await pagina.locator("[data-levar-pro-mundo-conclusao]").isVisible(), `${MODO}: o fim do projeto oferece o Levar pro mundo`);
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")).projetos["sites-publicar-u2-f2"]);
conferir(salvo?.html?.includes("Sobre mim") && salvo.css.includes("@media"), `${MODO}: o projeto fica salvo em Meus projetos`);

// ---------------------------------------------------------------- a ilha inteira acende
await tocar(pagina.getByRole("button", { name: "Voltar pra ilha" }));
await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
conferir((await pagina.locator("[data-mapa=ilha]").getAttribute("data-ilha-completa")) === "sim", `${MODO}: a ilha fica completa`);
conferir((await pagina.locator("[data-borda-acesa]").count()) === 1, `${MODO}: a borda da ilha acende`);
await pagina.locator(`[data-festa-ilha="sites"]`).waitFor({ timeout: 8000 });
conferir(true, `${MODO}: o computadorzinho comemora a ilha inteira`);
await tocar(pagina.locator("[data-festa-projetos]"));
await pagina.locator("[data-tela=projetos]").waitFor();

// ---------------------------------------------------------------- Meus projetos
const cartao = pagina.locator(`[data-cartao-projeto="${P2}-f2"]`);
conferir((await cartao.getAttribute("data-situacao")) === "pronto", `${MODO}: o cartão Meu primeiro site está pronto`);
conferir((await cartao.locator("iframe").count()) === 1, `${MODO}: com a miniatura do site`);
await tocar(cartao.locator("[data-abrir-guia]"));
const guia = pagina.locator("[data-guia-publicacao]");
await guia.waitFor();
await pagina.locator('[role=dialog][data-modal-assentado="sim"]').waitFor();
await tocar(guia.locator('[data-passo-guia="baixar-zip"]'));
await tocar(guia.locator('[data-passo-guia="descompactar"]'));
const campo = guia.locator("[data-link-publicado]");
await campo.fill("meu-site.netlify");
await tocar(guia.locator("[data-salvar-link]"));
await guia.locator("[data-erro-link]").waitFor();
conferir(true, `${MODO}: endereço sem https:// é recusado, com a explicação`);
await campo.fill("https://site-do-leo.netlify.app");
await tocar(guia.locator("[data-salvar-link]"));
await guia.locator("[data-link-guardado]").waitFor();
await pagina.keyboard.press("Escape");
await guia.waitFor({ state: "detached" });
conferir((await cartao.locator("[data-link-do-projeto]").getAttribute("href")) === "https://site-do-leo.netlify.app", `${MODO}: o link aparece no cartão`);
await pagina.reload();
await pagina.locator("[data-tela=projetos]").waitFor();
const guardado = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")).projetos["sites-publicar-u2-f2"]);
conferir(guardado.link === "https://site-do-leo.netlify.app" && guardado.guia.join(",") === "baixar-zip,descompactar", `${MODO}: o guia e o link ficam guardados`);

// Reabrir o projeto: ele volta do jeito que ficou.
await tocar(cartao.locator("[data-abrir-projeto]"));
await pagina.locator(`[data-jogo-fase="${P2}-f2"]`).waitFor();
await assentar();
const texto = await pagina.locator("section[data-previa] iframe").evaluate((el) => el.contentDocument.body.innerText);
conferir(texto.includes("Eu gosto de montar robôs de sucata."), `${MODO}: reabrir o projeto traz o site como ficou`);

// ---------------------------------------------------------------- o mundo marca a ilha completa
await pagina.goto(`${process.env.URL_JOGO ?? "http://localhost:3000"}/`);
await pagina.locator("[data-mapa=mundo]").waitFor();
conferir((await pagina.locator("[data-ilha=sites]").getAttribute("data-completa")) === "sim", `${MODO}: no mundo, a Ilha Sites aparece completa`);
conferir((await pagina.locator("[data-ilha-acesa]").count()) === 1, `${MODO}: com o anel aceso`);
const barraProjetos = pagina.locator("[data-link-projetos]");
conferir((await barraProjetos.count()) > 0 || movel, `${MODO}: Meus projetos fica na barra do mapa`);

conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
