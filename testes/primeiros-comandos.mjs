// Jornada pelo mapa de U2/U3: Console real, previsões por dados, mini-palcos,
// negativas pedagógicas e linha do tempo. Uso: node testes/primeiros-comandos.mjs [layout] [unidade]
import { readFileSync } from "node:fs";
import { PUBLICADAS, obrigatoriasProntasDaIlha } from "./curriculo.mjs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";
const UNIDADE = process.argv[3] ?? "logica-primeiros-comandos-u2";
const numero = Number(UNIDADE.at(-1));
if (![2, 3].includes(numero)) throw new Error("Informe U2 ou U3");

// A Ilha Sites inteira feita (as zonas obrigatórias); as ferramentas de antes já vistas.
const sites = obrigatoriasProntasDaIlha("sites").map((unidade) => unidade.id);
const IDS_FERRAMENTAS = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
const anteriores = Array.from({ length: numero - 1 }, (_, i) => `logica-primeiros-comandos-u${i + 1}`);
const prontas = [...sites, ...anteriores];
const NOVAS = [];
const progresso = {
  versao: 2,
  fasesConcluidas: prontas.flatMap((id) => PUBLICADAS[id]),
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: IDS_FERRAMENTAS.filter((id) => !NOVAS.includes(id)),
  metasVistas: prontas,
  unidadesComemoradas: prontas,
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

const PASSOS_U2 = [
  [["nome-guiado", 'let cliente = "Lia"'], ["aspas-esquecidas", 'Visitante'], ["corrigir-aspas", "let apelido = 'Visitante'"], ["crase-simples", 'let modalidade = `entrega`'], ["crase-sozinho", 'let outraModalidade = `retirada`']],
  [["juntar-guiado", '"Lia" + "Costa"'], ["prever-juncao", "'oi' + 'tchau'"], ["espaco-guiado", 'let nomeCompleto = cliente + " " + sobrenome'], ["juntar-sozinho", 'let etiqueta = "Pedido: " + nomeCompleto + " - retirada"']],
  [["template-guiado", 'let mensagem = `Olá, ${cliente}! Seu pedido tem ${quantidade} pizzas.`'], ["aspas-nao-interpolam", '"Olá, ${cliente}"'], ["template-sozinho", 'let aviso = `${cliente}, retirada em ${minutos} minutos.`']],
  [["tamanho-guiado", '"Lia Costa".length'], ["tamanho-sozinho", 'let tamanhoEtiqueta = "Pizza pronta".length'], ["log-guiado", 'console.log("Pedido recebido")'], ["log-previsao", 'console.log("Saiu para entrega")'], ["log-sozinho", 'console.log("Retirada liberada")']],
];
const DESAFIO_U2 = ['let cliente = "Bia"\nlet quantidade = 3\nlet minutos = 40', 'let mensagem = `${cliente}, seus ${quantidade} vasos chegam em ${minutos} minutos.`', 'let tamanhoMensagem = mensagem.length', 'console.log(mensagem)'];
const PASSOS_U3 = [
  [["tipo-numero", 'typeof numero'], ["tipo-texto", 'typeof codigo'], ["tipo-booleano", 'typeof aberta'], ["tipo-undefined", 'typeof pendente'], ["null-previsao", 'typeof reserva'], ["tipo-proprio", 'let vagas = 12\nlet tipoVagas = typeof vagas']],
  [["comparar-guiado", 'codigo === 2'], ["comparar-sozinho", 'codigo === "2"'], ["guardar-previsao", 'codigo = 2'], ["comparar-apos-troca", 'codigo === "2"']],
  [["mais-texto", '"2" + 2'], ["mais-sozinho", '"10" + 3'], ["vezes-guiado", '"2" * 2'], ["menos-previsao", "'5' - 2"], ["vezes-sozinho", '"7" * 3']],
  [["total-guiado", 'let total = Number(precoTexto) + taxa'], ["total-sozinho", 'let outroTotal = Number(valorTexto) + extra'], ["string-guiado", 'let totalTexto = String(total)'], ["string-previsao", 'typeof String(8)'], ["string-sozinho", 'let reciboTexto = String(outroTotal)']],
  [["comentario-guiado", 'let saldo = 10\n// saldo = 999\nsaldo = saldo + 2'], ["comentario-previsao", '3 + 4 // conta das vagas'], ["bloco-guiado", 'let caixa = 6\n/* caixa = 900 */\ncaixa = caixa + 1'], ["comentario-sozinho", 'let estoque = 8\n/*\nestoque = 500\n*/\nestoque = estoque + 3']],
];
const DESAFIO_U3 = ['let contaTexto = "80"\nlet percentual = 10', 'let conta = Number(contaTexto)', 'let gorjeta = conta * percentual / 100', 'let total = conta + gorjeta', 'typeof total', 'let totalTexto = String(total)\nconsole.log("Total: R$ " + totalTexto)'];

const PASSOS = numero === 2 ? PASSOS_U2 : PASSOS_U3;
const DESAFIO = numero === 2 ? DESAFIO_U2 : DESAFIO_U3;

const ilha = pagina.locator('[data-ilha="logica"]').first();
conferir((await ilha.getAttribute("data-estado")) === "disponivel", `${MODO}: Lógica disponível`);
await tocar(ilha);
await pagina.goto(new URL("/ilha/logica", pagina.url()).toString());
await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
const ponto = pagina.locator(`[data-unidade="${UNIDADE}"]`);
conferir((await ponto.getAttribute("data-estado")) === "disponivel", `${MODO}: unidade disponível na ordem curricular`);
await tocar(ponto);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar", exact: true }));
await pagina.locator(`[data-jogo-fase="${UNIDADE}-f1"]`).waitFor({ state: "attached" });
await pagina.locator("[data-meta]").waitFor();
await pagina.locator(`[data-mini-palco="Depois"] [data-caixinha="${numero === 2 ? "mensagem" : "total"}"]`).waitFor({ timeout: 15000 });
conferir((await pagina.locator('[data-mini-palco="Antes"] [data-palco-vazio]').count()) === 1, `${MODO}: meta mostra memória antes e depois`);
await tocar(pagina.getByRole("button", { name: "Bora!" }));

for (const [f, passos] of PASSOS.entries()) {
  await pagina.locator(`[data-jogo-fase="${UNIDADE}-f${f + 1}"]`).waitFor();
  await introducao();
  for (const [i, [id, codigo]] of passos.entries()) {
    await esperarObjetivo(id);
    if (movel) await abrirBalao(pagina);
    if ((await pagina.locator("[data-previsao]").count()) > 0) {
      await tocar(await opcaoDaPrevisao(pagina));
      await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
    }
    // Sem espaço e sem template produzem valores/sintaxes que não atendem à tarefa.
    if (id === "espaco-guiado") {
      await rodar('let nomeCompleto = cliente + sobrenome');
      if (movel) await abrirBalao(pagina);
      conferir(!(await pagina.getByRole("button", { name: "Próximo objetivo", exact: true }).isVisible()), `${MODO}: juntar sem espaço não passa`);
    }
    if (id === "template-sozinho") {
      await rodar('let aviso = cliente + ", retirada em " + minutos + " minutos."');
      if (movel) await abrirBalao(pagina);
      conferir(!(await pagina.getByRole("button", { name: "Ver resultado", exact: true }).isVisible()), `${MODO}: resultado sem template não passa quando a forma importa`);
    }
    if (id === "total-guiado") {
      await rodar('let total = precoTexto + taxa');
      if (movel) await abrirBalao(pagina);
      conferir(!(await pagina.getByRole("button", { name: "Próximo objetivo", exact: true }).isVisible()), `${MODO}: soma que concatena não passa`);
    }
    await rodar(codigo);
    if (id === "tipo-numero") {
      for (const [nome, tipo] of [["numero", "numero"], ["codigo", "texto"], ["aberta", "booleano"], ["pendente", "undefined"], ["reserva", "null"]]) {
        conferir((await caixinha(nome).getAttribute("data-tipo")) === tipo, `${MODO}: ${nome} mostra tipo ${tipo} no palco`);
      }
    }
    if (id === "guardar-previsao") conferir((await caixinha("codigo").getAttribute("data-tipo")) === "numero", `${MODO}: = troca o tipo guardado; === não troca`);
    if (id === "aspas-esquecidas") conferir((await pagina.locator("[data-console]:visible [data-linha-console='erro']").last().getAttribute("data-erro")) === "ReferenceError", `${MODO}: aspas esquecidas dão erro real`);
    if (id === "comentario-sozinho") {
      if (movel) await fecharBalao(pagina);
      await tocar(pagina.locator("[data-passo-anterior]"));
      conferir((await caixinha("estoque").innerText()).includes("8"), `${MODO}: linha do tempo mostra estoque antes da soma`);
      await tocar(pagina.locator("[data-passo-proximo]"));
    }
    if (i < passos.length - 1) await naConversa("Próximo objetivo");
  }
  await conclusao("Próxima fase");
}
await pagina.locator(`[data-jogo-fase="${UNIDADE}-f${PASSOS.length + 1}"]`).waitFor();
await pagina.locator("[data-meta]").waitFor();
await tocar(pagina.getByRole("button", { name: "Começar o desafio" }));
await introducao();
for (const codigo of DESAFIO) await rodar(codigo);
await conclusao("Voltar pra ilha");
await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
conferir((await pagina.locator(`[data-unidade="${UNIDADE}"]`).getAttribute("data-estado")) === "concluida", `${MODO}: unidade concluída na ilha`);
const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`primeiros-comandos.mjs ${MODO} ${UNIDADE}: ok`);
