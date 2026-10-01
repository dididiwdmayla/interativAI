// A Ilha Lógica pelo mapa: com a Ilha Sites completa, a Lógica abre no
// mundo; a unidade-modelo "O Console calcula" (logica-primeiros-comandos-u1)
// é jogada inteira pelo Console, como um jogador: a meta com o palco antes e
// depois, as apresentações (palco, Console, linha do tempo), as previsões,
// o erro lido de propósito, o programa de várias linhas, o recarregar no
// meio de uma fase (a memória volta) e o desafio do Mercadinho do Seu Zé,
// até a unidade concluída na ilha.
// Uso: node testes/logica.mjs [desktop|retrato|paisagem]
import { readFileSync } from "node:fs";
import { PUBLICADAS, obrigatoriasProntasDaIlha } from "./curriculo.mjs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, passarApresentacao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";
const U1 = "logica-primeiros-comandos-u1";

// A Ilha Sites inteira feita (as zonas obrigatórias); as ferramentas de antes já vistas.
const sites = obrigatoriasProntasDaIlha("sites").map((unidade) => unidade.id);
const IDS_FERRAMENTAS = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
const NOVAS = ["console", "palco-memoria", "linha-do-tempo"];
const progresso = {
  versao: 2,
  fasesConcluidas: sites.flatMap((id) => PUBLICADAS[id]),
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: IDS_FERRAMENTAS.filter((id) => !NOVAS.includes(id)),
  metasVistas: sites,
  unidadesComemoradas: sites,
  ilhasComemoradas: ["sites"],
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
};

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/", esperar: "[data-mapa=mundo]" });
const assentar = () => esperarPronto(pagina, 20000);

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
  await assentar();
}
async function naConversa(nome) {
  if (movel) await abrirBalao(pagina);
  else await assentar();
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 10000 });
  await tocar(botao);
}
async function introducao() {
  for (let i = 0; i < 6; i++) {
    if ((await pagina.locator("[data-apresentacao]").count()) > 0) return;
    if ((await pagina.locator("[data-previsao]").count()) > 0) return;
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) return;
    await tocar(botao);
  }
}
const esperarObjetivo = (id) =>
  pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });
const caixinha = (nome) => pagina.locator(`[data-palco] [data-caixinha="${nome}"]`);

/** Escreve e roda no Console (no toque, o botão Rodar; várias linhas vão como texto colado). */
async function rodar(codigo) {
  if (movel) await fecharBalao(pagina);
  const entrada = pagina.locator("[data-console]:visible [data-entrada-console]").first();
  await entrada.click();
  if (!toque && codigo.includes("\n")) {
    const linhas = codigo.split("\n");
    for (const [i, linha] of linhas.entries()) {
      await pagina.keyboard.type(linha);
      if (i < linhas.length - 1) await pagina.keyboard.press("Shift+Enter");
    }
  } else await pagina.keyboard.insertText(codigo);
  if (toque) await pagina.locator("[data-console]:visible [data-rodar-console]").first().tap();
  else await pagina.keyboard.press("Enter");
  await assentar();
}
async function preverECumprir(codigo) {
  if (movel) await abrirBalao(pagina);
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(await opcaoDaPrevisao(pagina));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await rodar(codigo);
}
async function conclusao(botao) {
  await naConversa("Ver resultado");
  await pagina.locator("[data-conclusao]").waitFor();
  for (let i = 0; i < 5; i++) {
    const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
  }
  await tocar(pagina.getByRole("button", { name: botao }));
}

// ---------------------------------------------------------------- mundo e ilha
const ilha = pagina.locator('[data-ilha="logica"]').first();
conferir((await ilha.getAttribute("data-estado")) === "disponivel", `${MODO}: com a Ilha Sites completa, a Lógica abre no mundo`);
await tocar(ilha);
await pagina.goto(new URL("/ilha/logica", pagina.url()).toString());
await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
const ponto = pagina.locator(`[data-unidade="${U1}"]`);
conferir((await ponto.getAttribute("data-estado")) === "disponivel", `${MODO}: a unidade-modelo está aberta na ilha`);
await tocar(ponto);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar", exact: true }));
await pagina.locator(`[data-jogo-fase="${U1}-f1"]`).waitFor({ state: "attached" });

// Meta: o palco antes (vazio) e depois (as caixinhas do desafio).
await pagina.locator("[data-meta]").waitFor();
await pagina.locator('[data-mini-palco="Depois"] [data-caixinha="troco"]').waitFor({ timeout: 15000 });
conferir((await pagina.locator('[data-mini-palco="Depois"] [data-caixinha]').count()) === 4, `${MODO}: a meta mostra as 4 caixinhas do desafio pronto`);
conferir((await pagina.locator('[data-mini-palco="Antes"] [data-palco-vazio]').count()) === 1, `${MODO}: e o palco vazio antes`);
await tocar(pagina.getByRole("button", { name: "Bora!" }));

// ---------------------------------------------------------------- Fase 1
await introducao();
await passarApresentacao(pagina, "palco-memoria", async () => {
  if (movel) await fecharBalao(pagina);
  await tocar(pagina.locator("[data-palco]"));
});
await passarApresentacao(pagina, "console", () => rodar("3 + 4"));
await naConversa("Próximo objetivo");
await esperarObjetivo("ordem-das-operacoes");
await preverECumprir("2 + 3 * 4");
await naConversa("Próximo objetivo");
await esperarObjetivo("conta-da-padaria");
await rodar("3 * 0.80 + 2 * 4.50");
await naConversa("Próximo objetivo");
await esperarObjetivo("parenteses");
await rodar("30 + 12 / 3");
conferir((await pagina.locator("[data-jogo-fase]").getAttribute("data-objetivo-atual")) === "parenteses", `${MODO}: sem parênteses (34) o objetivo não passa`);
await rodar("(30 + 12) / 3");
await conclusao("Próxima fase");

// ---------------------------------------------------------------- Fase 2 (com recarregar no meio)
await pagina.locator(`[data-jogo-fase="${U1}-f2"]`).waitFor();
await introducao();
await esperarObjetivo("primeira-caixinha");
await rodar("let precoDoPao = 0.80");
conferir((await caixinha("precoDoPao").getAttribute("data-declaracao")) === "let", `${MODO}: a caixinha precoDoPao nasce no palco, com let`);
await naConversa("Próximo objetivo");
await esperarObjetivo("o-undefined");
await preverECumprir("let quantidade = 3");
const ultimaResposta = await pagina.locator("[data-console]:visible [data-linha-console='resposta']").last().innerText();
conferir(ultimaResposta.trim() === "undefined", `${MODO}: depois de let, o Console responde undefined`);
await naConversa("Próximo objetivo");
await esperarObjetivo("conta-com-caixinhas");
// Recarregar a página no meio da fase: a memória volta como estava.
await pagina.reload();
await pagina.locator(`[data-jogo-fase="${U1}-f2"]`).waitFor();
await assentar();
await caixinha("quantidade").waitFor({ timeout: 15000 });
conferir((await caixinha("precoDoPao").count()) === 1 && (await caixinha("quantidade").count()) === 1, `${MODO}: depois de recarregar, as caixinhas voltam`);
await esperarObjetivo("conta-com-caixinhas");
await rodar("precoDoPao * quantidade");
await naConversa("Próximo objetivo");
await esperarObjetivo("trocar-a-quantidade");
await rodar("quantidade = 5");
conferir((await caixinha("quantidade").innerText()).includes("5"), `${MODO}: a caixinha quantidade troca para 5`);
await conclusao("Próxima fase");

// ---------------------------------------------------------------- Fase 3
await pagina.locator(`[data-jogo-fase="${U1}-f3"]`).waitFor();
await introducao();
await esperarObjetivo("criar-const");
await rodar("const taxaDeEntrega = 5");
await naConversa("Próximo objetivo");
await esperarObjetivo("ler-o-erro");
await rodar("taxaDeEntrega = 7");
conferir((await pagina.locator("[data-console]:visible [data-linha-console='erro']").last().getAttribute("data-erro")) === "TypeError", `${MODO}: o erro da const aparece`);
await naConversa("Próximo objetivo");
await esperarObjetivo("nome-bom");
await preverECumprir("let precoDoBolo = 18");
await naConversa("Próximo objetivo");
await passarApresentacao(pagina, "linha-do-tempo", async () => {
  if (movel) await fecharBalao(pagina);
  await tocar(pagina.locator("[data-passo-anterior]"));
});
await esperarObjetivo("encomenda");
await rodar("let total = 0\ntotal = total + precoDoBolo\ntotal = total + taxaDeEntrega");
conferir((await caixinha("total").innerText()).includes("23"), `${MODO}: o programa de três linhas deixa total em 23`);
// O passo mostra a memória antes da linha marcada rodar (como o depurador pausado nela).
if (movel) await fecharBalao(pagina);
await tocar(pagina.locator("[data-passo-anterior]"));
conferir((await caixinha("total").innerText()).includes("18"), `${MODO}: voltando a linha do tempo, total vale 18 naquele passo`);
await conclusao("Próxima fase");

// ---------------------------------------------------------------- Desafio
await pagina.locator(`[data-jogo-fase="${U1}-f4"]`).waitFor();
await pagina.locator("[data-meta]").waitFor();
await tocar(pagina.getByRole("button", { name: "Começar o desafio" }));
await introducao();
await rodar("const precoDoArroz = 22\nconst precoDoFeijao = 8");
await rodar("let total = 2 * precoDoArroz + 3 * precoDoFeijao");
await rodar("const troco = 100 - total");
await rodar("total / 4");
await conclusao("Voltar pra ilha");
await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
conferir((await pagina.locator(`[data-unidade="${U1}"]`).getAttribute("data-estado")) === "concluida", `${MODO}: a unidade-modelo fica concluída na ilha`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`logica.mjs ${MODO}: ok`);
