// Estruturas e desempenho no palco, nas demonstrações do /lab:
// - lab-logica-u1-f8: push e pop (o vagão entra e sai pela direita), push e
//   shift (entra pela direita, sai pela esquerda), "Ver como árvore" na
//   caixinha de um objeto com filhos (com a ponte para Elementos) e o bolha.js
//   na linha do tempo (o vagão lido acende e a troca pisca);
// - lab-logica-u1-f9: o contador de passos no palco e a aba Desempenho (Medir,
//   as duas linhas com legenda e o valor no fim, o detalhe de um ponto, a
//   tabela), com a lenta (quadrática) disparando e a rápida (linear) deitada;
// - lab-logica-u1-f10 e f11: o custo escondido dos métodos nativos. O contador
//   mostra "+ escondidos em shift", o trem desliza na linha do tempo e o
//   gráfico (o total) põe shift acima do índice e includes acima do Map.has.
// Uso: node testes/estruturas.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const PROGRESSO = {
  versao: 2,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: ["painel", "previa", "me-ajuda", "tutor", "console", "snippet", "palco-memoria", "linha-do-tempo", "arvore-palco", "contador-passos", "grafico-passos"],
};

async function abrirFase(fase) {
  const aberto = await abrir({ ...TAMANHOS[MODO], progresso: PROGRESSO, rota: `/lab/fases?fase=${fase}`, esperar: "[data-jogo-fase]" });
  const recolher = aberto.pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
  await esperarPronto(aberto.pagina, 30000);
  return aberto;
}

function ferramentas(pagina) {
  const tocar = async (localizador) => {
    if (movel) await fecharBalao(pagina);
    await localizador.scrollIntoViewIfNeeded();
    if (toque) await localizador.tap();
    else await localizador.click();
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
  const pularIntroducao = async () => {
    for (let i = 0; i < 4; i++) {
      if (movel) await abrirBalao(pagina);
      const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
      if (!(await botao.isVisible().catch(() => false))) break;
      await naConversa(/^(Continuar|Vamos lá!)$/);
    }
  };
  const esperarObjetivo = (id) =>
    pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });
  const objetivoConcluido = async () => {
    if (movel) await abrirBalao(pagina);
    return pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first().isVisible();
  };
  const rodar = async (codigo) => {
    if (movel) await fecharBalao(pagina);
    await pagina.locator("[data-console]:visible [data-entrada-console]").first().click();
    await pagina.keyboard.insertText(codigo);
    if (toque) await pagina.locator("[data-console]:visible [data-rodar-console]").first().tap();
    else await pagina.keyboard.press("Enter");
    await esperarPronto(pagina);
  };
  const aba = (nome) => tocar(pagina.getByRole("tablist", { name: "Painéis do DevTools" }).getByRole("tab", { name: nome, exact: true }));
  const prever = async () => {
    if (movel) await abrirBalao(pagina);
    await pagina.locator("[data-previsao]").waitFor();
    const opcao = await opcaoDaPrevisao(pagina);
    if (toque) await opcao.tap();
    else await opcao.click();
    await esperarPronto(pagina);
  };
  return { tocar, naConversa, pularIntroducao, esperarObjetivo, objetivoConcluido, rodar, aba, prever };
}

const caixinha = (pagina, nome) => pagina.locator(`[data-palco] [data-caixinha="${nome}"]`).first();

// ================================================================ f8: pilha, fila e árvore
{
  const { navegador, pagina, erros } = await abrirFase("lab-logica-u1-f8");
  const { tocar, naConversa, pularIntroducao, esperarObjetivo, objetivoConcluido, rodar, aba, prever } = ferramentas(pagina);
  await pularIntroducao();

  // ---------------------------------------------------------------- pilha: push e pop pelo fim
  await esperarObjetivo("pilha");
  await rodar('pilha.push("prato 3")');
  const pilha = caixinha(pagina, "pilha");
  conferir((await pilha.locator("[data-vagao]").count()) === 3, `${MODO}: push põe um terceiro vagão`);
  conferir(((await pilha.locator('[data-vagao="2"]').getAttribute("class")) ?? "").includes("palco-entrar-direita"), `${MODO}: o vagão do push entra pela direita`);
  await rodar("pilha.pop()");
  conferir((await pilha.locator("[data-vagao]").count()) === 2, `${MODO}: pop tira um vagão`);
  conferir(((await pilha.locator('[data-vagao-saindo="2"]').getAttribute("class")) ?? "").includes("palco-sair-direita"), `${MODO}: o vagão do pop sai pela direita`);
  conferir(await objetivoConcluido(), `${MODO}: formaDaEstrutura pilha passa`);
  await naConversa(/Próximo objetivo/);

  // ---------------------------------------------------------------- fila: push no fim, shift no começo
  await esperarObjetivo("fila");
  await prever();
  await rodar('fila.push("Caio")');
  await rodar("fila.shift()");
  const fila = caixinha(pagina, "fila");
  conferir(((await fila.locator('[data-vagao-saindo="0"]').getAttribute("class")) ?? "").includes("palco-sair-esquerda"), `${MODO}: o shift tira o vagão pela esquerda`);
  conferir((await fila.innerText()).includes("Caio") && (await fila.locator("[data-vagao]").count()) === 2, `${MODO}: a fila fica com Bia e Caio`);
  conferir(await objetivoConcluido(), `${MODO}: formaDaEstrutura fila passa`);
  await naConversa(/Próximo objetivo/);

  // ---------------------------------------------------------------- ver como árvore
  await esperarObjetivo("arvore");
  const pasta = caixinha(pagina, "pasta");
  conferir((await caixinha(pagina, "pilha").locator("[data-ver-como-arvore]").count()) === 0, `${MODO}: uma lista não ganha o botão de árvore`);
  await tocar(pasta.locator('[data-ver-como-arvore="pasta"]'));
  const arvore = pasta.locator("[data-arvore-palco]");
  await arvore.waitFor({ timeout: 5000 });
  const nos = await arvore.locator("[data-no-arvore]").evaluateAll((els) => els.map((el) => el.getAttribute("data-no-arvore")));
  conferir(["site", "index.html", "fotos", "praia.jpg", "bolo.jpg"].every((n) => nos.includes(n)), `${MODO}: a árvore tem os 5 nós (${nos.join(", ")})`);
  conferir(await arvore.locator("[data-ponte-elementos]").isVisible(), `${MODO}: a ponte para a árvore de Elementos aparece`);
  const larguraArvore = await arvore.evaluate((el) => el.getBoundingClientRect().right);
  const larguraTela = await pagina.evaluate(() => window.innerWidth);
  conferir(larguraArvore <= larguraTela + 1, `${MODO}: a árvore cabe na tela (rola por dentro)`);
  conferir(await objetivoConcluido(), `${MODO}: formaDaEstrutura arvore + viuComoArvore passam`);
  await tocar(pasta.locator('[data-ver-como-arvore="pasta"]'));
  conferir((await pasta.locator("[data-arvore-palco]").count()) === 0, `${MODO}: tocar de novo volta para as fichas`);
  await naConversa(/Próximo objetivo/);

  // ---------------------------------------------------------------- bolha.js: leituras e trocas
  await esperarObjetivo("bolha");
  await aba("Fontes");
  if (movel) await tocar(pagina.getByRole("tab", { name: "Snippet", exact: true }));
  await tocar(pagina.locator("[data-executar-snippet]"));
  conferir(await objetivoConcluido(), `${MODO}: o bolha.js ordena as cartas`);
  const tempo = pagina.locator("[data-linha-do-tempo]");
  const total = Number(await tempo.getAttribute("data-total-passos"));
  const barra = tempo.locator("[data-barra-tempo]");
  if (movel) await fecharBalao(pagina);
  await barra.focus();
  await pagina.keyboard.press("Home");
  let viuLido = false;
  let viuTroca = false;
  for (let k = 0; k < total && !(viuLido && viuTroca); k++) {
    const cartas = caixinha(pagina, "cartas");
    if ((await cartas.locator('[data-lido="sim"]').count()) > 0) viuLido = true;
    if ((await cartas.locator('[data-trocou="sim"]').count()) === 2) viuTroca = true;
    await pagina.keyboard.press("ArrowRight");
  }
  conferir(viuLido, `${MODO}: andando pela linha do tempo, o vagão lido acende`);
  conferir(viuTroca, `${MODO}: e a troca acende os dois vagões`);

  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} f8: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}

// ================================================================ f9: contador e gráfico de passos
{
  const { navegador, pagina, erros } = await abrirFase("lab-logica-u1-f9");
  const { tocar, naConversa, pularIntroducao, esperarObjetivo, objetivoConcluido, aba, prever } = ferramentas(pagina);
  await pularIntroducao();

  // ---------------------------------------------------------------- o contador de passos
  await esperarObjetivo("contar");
  conferir((await pagina.locator("[data-contador-passos]").first().innerText()).includes("Nenhum passo ainda"), `${MODO}: antes de rodar, o contador diz que não houve passo`);
  await aba("Fontes");
  if (movel) await tocar(pagina.getByRole("tab", { name: "Snippet", exact: true }));
  await tocar(pagina.locator("[data-executar-snippet]"));
  const contador = pagina.locator("[data-contador-passos]").first();
  await pagina.waitForFunction(() => Number(document.querySelector("[data-contador-passos]")?.getAttribute("data-contador-passos")) > 0, null, { timeout: 8000 });
  const passos = Number(await contador.getAttribute("data-contador-passos"));
  conferir(passos > 5 && passos <= 100 && (await contador.innerText()).includes(`${passos} passos`), `${MODO}: o contador mostra os passos da execução (${passos})`);
  conferir(await objetivoConcluido(), `${MODO}: passosNoMaximo sem tamanho passa`);
  await naConversa(/Próximo objetivo/);

  // ---------------------------------------------------------------- Medir na aba Desempenho
  await esperarObjetivo("medir");
  await prever();
  await aba("Desempenho");
  await tocar(pagina.locator("[data-medir-desempenho]"));
  const grafico = pagina.locator("[data-grafico-passos]");
  await grafico.locator("[data-serie-grafico]").nth(1).waitFor({ timeout: 15000 });
  conferir((await pagina.locator("[data-legenda-desempenho] li").count()) === 2, `${MODO}: a legenda tem as duas funções`);
  const rotulo = (funcao) => grafico.locator(`[data-rotulo-final="${funcao}"]`).textContent();
  const lenta = (await rotulo("temRepetidoLento")) ?? "";
  const rapida = (await rotulo("temRepetidoRapido")) ?? "";
  conferir(lenta.includes("mil") && !rapida.includes("mil"), `${MODO}: com 500 itens, a lenta passa de mil passos e a rápida não (${lenta} x ${rapida})`);
  const alturaDe = (funcao) =>
    grafico.locator(`[data-ponto-grafico="${funcao}:500"]`).evaluate((el) => Number(el.getAttribute("cy")));
  conferir((await alturaDe("temRepetidoLento")) < (await alturaDe("temRepetidoRapido")) - 50, `${MODO}: no gráfico, a curva da lenta sobe muito acima da reta da rápida`);
  const frases = await pagina.locator("[data-frases-desempenho]").innerText();
  conferir(/temRepetidoLento: a lista ficou 50 vezes maior e os passos, [\d.]+ vezes/.test(frases), `${MODO}: a frase diz quanto a lenta cresceu (${frases.split("\n")[0]})`);
  conferir(await objetivoConcluido(), `${MODO}: mediuDesempenho passa`);
  const svg = await grafico.locator("svg").first().evaluate((el) => ({ direita: el.getBoundingClientRect().right, largura: window.innerWidth }));
  conferir(svg.direita <= svg.largura + 1, `${MODO}: o gráfico cabe na largura da tela`);

  // O detalhe de um ponto (mouse por cima, ou o toque) e a tabela.
  const ponto = grafico.locator('[data-ponto-grafico="temRepetidoLento:250"]');
  if (movel) await fecharBalao(pagina);
  if (toque) await ponto.tap();
  else await ponto.hover();
  const detalhe = pagina.locator("[data-detalhe-grafico]");
  await detalhe.waitFor({ timeout: 5000 });
  conferir((await detalhe.innerText()).includes("lista de 250"), `${MODO}: o detalhe do ponto diz o tamanho e os passos`);
  await tocar(pagina.locator("[data-ver-tabela-desempenho]"));
  const linhasTabela = await pagina.locator("[data-tabela-desempenho] tbody tr").count();
  conferir(linhasTabela === 4, `${MODO}: a tabela tem uma linha por tamanho (${linhasTabela})`);
  await tocar(pagina.locator("[data-ver-tabela-desempenho]"));
  await naConversa(/Próximo objetivo/);

  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} f9: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}
// ================================================================ f10 e f11: o custo escondido
for (const demo of [
  { fase: "lab-logica-u1-f10", metodo: "shift", cara: "consumirComShift", barata: "consumirPorIndice", lista: "pedidos" },
  { fase: "lab-logica-u1-f11", metodo: "includes", cara: "procurarNaLista", barata: "procurarNoMapa", lista: null },
]) {
  const { navegador, pagina, erros } = await abrirFase(demo.fase);
  const { tocar, naConversa, pularIntroducao, esperarObjetivo, objetivoConcluido, aba, prever } = ferramentas(pagina);
  await pularIntroducao();

  await esperarObjetivo("contar");
  await aba("Fontes");
  if (movel) await tocar(pagina.getByRole("tab", { name: "Snippet", exact: true }));
  await tocar(pagina.locator("[data-executar-snippet]"));
  await pagina.waitForFunction(() => Number(document.querySelector("[data-contador-passos]")?.getAttribute("data-contador-escondidos")) > 0, null, { timeout: 8000 });
  const textoContador = await pagina.locator("[data-contador-passos]").first().innerText();
  conferir(new RegExp(`[\\d.]+ passos \\+ [\\d.]+ escondidos em\\s+${demo.metodo}`).test(textoContador.replace(/\s+/g, " ")), `${MODO} ${demo.fase}: o contador separa os passos do código e os escondidos em ${demo.metodo} (${textoContador.replace(/\s+/g, " ")})`);
  conferir(await objetivoConcluido(), `${MODO} ${demo.fase}: passosNoMaximo da execução passa`);

  if (demo.lista) {
    // Na linha do tempo, depois de cada shift os vagões que ficaram deslizam.
    const tempo = pagina.locator("[data-linha-do-tempo]");
    const total = Number(await tempo.getAttribute("data-total-passos"));
    const barra = tempo.locator("[data-barra-tempo]");
    if (movel) await fecharBalao(pagina);
    await barra.focus();
    await pagina.keyboard.press("Home");
    let deslizou = 0;
    for (let k = 0; k < total && !deslizou; k++) {
      deslizou = await caixinha(pagina, demo.lista).locator("[data-deslizou]").count();
      await pagina.keyboard.press("ArrowRight");
    }
    conferir(deslizou >= 2, `${MODO} ${demo.fase}: depois do shift, todos os vagões que ficaram deslizam (${deslizou})`);
  }
  await naConversa(/Próximo objetivo/);

  await esperarObjetivo("medir");
  await prever();
  await aba("Desempenho");
  await tocar(pagina.locator("[data-medir-desempenho]"));
  const grafico = pagina.locator("[data-grafico-passos]");
  await grafico.locator("[data-serie-grafico]").nth(1).waitFor({ timeout: 15000 });
  const rotulo = async (funcao) => (await grafico.locator(`[data-rotulo-final="${funcao}"]`).textContent()) ?? "";
  const cara = await rotulo(demo.cara);
  const barata = await rotulo(demo.barata);
  conferir(cara.includes("mil") && !barata.includes("mil"), `${MODO} ${demo.fase}: com 1.000 itens, ${demo.cara} passa de 10 mil passos e ${demo.barata} não (${cara} x ${barata})`);
  const alturaDe = (funcao) => grafico.locator(`[data-ponto-grafico="${funcao}:1000"]`).evaluate((el) => Number(el.getAttribute("cy")));
  conferir((await alturaDe(demo.cara)) < (await alturaDe(demo.barata)) - 50, `${MODO} ${demo.fase}: no gráfico, ${demo.cara} sobe muito acima de ${demo.barata}`);
  conferir((await pagina.locator("[data-legenda-escondidos]").getAttribute("data-legenda-escondidos")) === "sim", `${MODO} ${demo.fase}: a legenda explica que o ponto é o total com os escondidos`);
  conferir(await objetivoConcluido(), `${MODO} ${demo.fase}: mediuDesempenho passa`);

  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} ${demo.fase}: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}
console.log(`estruturas.mjs ${MODO}: ok`);
