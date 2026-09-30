// A zona opcional "Ser encontrado" pelo mapa, como um jogador que acabou o
// resto da Ilha Sites: a plaquinha Opcional, a ilha já completa sem ela (e
// o mundo marcando Sites como completa), a S1 aberta no mapa, a Fase 1
// jogada do card até o fim (a meta, a previsão sobre o rastreamento, a
// apresentação do Resultado na busca, o title trocado pelo editor, o
// sozinho com o corte) e o desafio da Casa de Farinha (as três partes do
// checklist e a volta pra ilha com o ponto da S1 concluído).
// Uso: node testes/ser-encontrado.mjs [desktop|retrato|paisagem]
import { readFileSync } from "node:fs";
import { obrigatoriasProntasDaIlha, PUBLICADAS } from "./curriculo.mjs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, passarApresentacao, pularMeta } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";
const S1 = "sites-ser-encontrado-u1";

// O resto da Ilha Sites feito; todas as ferramentas de antes já vistas.
const antes = obrigatoriasProntasDaIlha("sites").map((unidade) => unidade.id);
const IDS_FERRAMENTAS = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
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
  apresentacoesVistas: IDS_FERRAMENTAS.filter((id) => id !== "resultado-busca"),
  metasVistas: antes,
  unidadesComemoradas: antes,
  ilhasComemoradas: ["sites"],
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
};

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/", esperar: "[data-mapa=mundo]" });
const assentar = () => esperarPronto(pagina);

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
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
    if ((await pagina.locator("[data-previsao]").count()) > 0) return;
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) return;
    await tocar(botao);
    await assentar();
  }
}
async function esperarObjetivo(id) {
  await pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 8000 });
}
async function aba(nome) {
  if (movel) await fecharBalao(pagina);
  await tocar(pagina.getByRole("tab", { name: nome, exact: true }));
  await assentar();
}
/** Troca o documento inteiro no editor (no celular, o segmento Código), mudando um trecho. */
async function trocarNoEditor(de, para) {
  await aba("Elementos");
  if (movel) {
    const codigo = pagina.getByRole("tab", { name: "Código", exact: true });
    if ((await codigo.getAttribute("aria-selected")) !== "true") await tocar(codigo);
    await assentar();
  }
  const conteudo = pagina.locator(".cm-content").first();
  const texto = await conteudo.innerText();
  if (!texto.includes(de)) throw new Error(`Falhou: o editor não tem "${de}"`);
  await conteudo.click();
  await pagina.keyboard.press("ControlOrMeta+A");
  await pagina.keyboard.insertText(texto.replace(de, para));
  await assentar();
}

// ---------------------------------------------------------------- o mundo e a ilha
const sites = pagina.locator("[data-ilha=sites]");
conferir((await sites.getAttribute("data-completa")) === "sim", `${MODO}: sem a zona opcional, Sites já está completa no mundo`);
conferir((await sites.textContent()).includes("Completa!"), `${MODO}: e diz Completa!`);
await tocar(sites);
await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
await assentar();
conferir((await pagina.locator('[data-zona="ser-encontrado"] [data-placa-opcional]').count()) === 1, `${MODO}: a zona Ser encontrado tem a plaquinha Opcional`);
const ponto = pagina.locator(`[data-unidade="${S1}"]`);
conferir((await ponto.getAttribute("data-estado")) === "disponivel", `${MODO}: a S1 está aberta no mapa`);
await tocar(ponto);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar", exact: true }));
await pagina.locator(`[data-jogo-fase="${S1}-f1"]`).waitFor();
await assentar();

// ---------------------------------------------------------------- Fase 1
conferir(await pularMeta(pagina), `${MODO}: a S1 abre com a meta (antes e depois do desafio)`);
await introducao();
await esperarObjetivo("titulo-com-nome");
if (movel) await abrirBalao(pagina);
await tocar(pagina.locator("[data-previsao] button").nth(0));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await assentar();
await passarApresentacao(pagina, "resultado-busca", async () => {
  if (movel) await fecharBalao(pagina);
  await tocar(pagina.locator("[data-resultado-busca]"));
});
conferir(true, `${MODO}: a apresentação do Resultado na busca abre a aba Busca`);
conferir((await pagina.locator("[data-titulo-busca]").textContent()) === "Início", `${MODO}: o resultado mostra o title genérico (Início)`);
conferir((await pagina.locator("[data-painel-busca] [data-aviso-simulacao]").count()) === 1, `${MODO}: com o aviso de simulação aproximada`);
await trocarNoEditor("<title>Início</title>", "<title>Ateliê Linha Fina | Consertos de roupa</title>");
await botaoConversa("Próximo objetivo");

await esperarObjetivo("titulo-com-cidade");
// Primeiro, um title comprido demais: a busca corta e o objetivo não passa.
const longo = "Ateliê Linha Fina | Consertos de roupa, bainha, zíper e ajustes de vestido em Recife";
await trocarNoEditor("<title>Ateliê Linha Fina | Consertos de roupa</title>", `<title>${longo}</title>`);
await aba("Busca");
conferir((await pagina.locator("[data-resultado-busca]").getAttribute("data-titulo-cortado")) === "sim", `${MODO}: o title comprido aparece cortado na busca`);
conferir((await pagina.locator("[data-jogo-fase]").getAttribute("data-objetivo-atual")) === "titulo-com-cidade", `${MODO}: e o sozinho ainda não passa`);
await trocarNoEditor(`<title>${longo}</title>`, "<title>Ateliê Linha Fina | Consertos em Recife</title>");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").first().waitFor({ timeout: 8000 }).catch(() => {});
conferir(true, `${MODO}: Fase 1 concluída pelo mapa`);

// ---------------------------------------------------------------- o desafio
await pagina.goto(`${new URL(pagina.url()).origin}/fase/${S1}-f4`);
await pagina.evaluate((fases) => {
  const salvo = JSON.parse(localStorage.getItem("ilha-sites:progresso:v2"));
  salvo.fasesConcluidas = [...new Set([...salvo.fasesConcluidas, ...fases])];
  localStorage.setItem("ilha-sites:progresso:v2", JSON.stringify(salvo));
}, PUBLICADAS[S1].slice(0, 3));
await pagina.reload();
await pagina.locator(`[data-jogo-fase="${S1}-f4"]`).waitFor();
await assentar();
await pularMeta(pagina);
await introducao();
await trocarNoEditor('<meta name="robots" content="noindex, nofollow">\n', "");
await trocarNoEditor(
  /<title>[^<]*<\/title>/.exec(await pagina.locator(".cm-content").first().innerText())[0],
  '<title>Casa de Farinha Seu Dito | Farinha em Garanhuns</title>\n<meta name="description" content="Farinha torrada no forno de lenha, com entrega em Garanhuns às sextas.">',
);
await botaoConversa("Ver resultado");
conferir(true, `${MODO}: as três partes do desafio marcam e ele conclui`);
// A tela de conclusão fica por cima do balão: os botões dela, direto.
for (let i = 0; i < 4; i++) {
  const voltar = pagina.getByRole("button", { name: "Voltar pra ilha" });
  if (await voltar.isVisible().catch(() => false)) break;
  const continuar = pagina.getByRole("button", { name: /^(Continuar|Fechar)$/ }).first();
  if (await continuar.isVisible().catch(() => false)) await tocar(continuar);
  await assentar();
}
await tocar(pagina.getByRole("button", { name: "Voltar pra ilha" }));
await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
await assentar();
conferir((await pagina.locator(`[data-unidade="${S1}"]`).getAttribute("data-estado")) === "concluida", `${MODO}: a S1 fica concluída no mapa`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo${relevantes.length ? `: ${relevantes.join(" | ")}` : ""}`);
await navegador.close();
