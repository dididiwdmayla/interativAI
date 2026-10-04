// Cenas programáveis no /lab (lab-cenas-u1): a área cena na tela composta,
// nos três layouts. No quarto, a lâmpada pisca no ritmo do código (a cena
// toca, a barra de tempo volta e avança, e a linha do tempo da execução anda
// junto), a ficha da lâmpada abre com o Por dentro e a velocidade troca. Na
// vitrine, o sensor é lido no Console andando no tempo, o loop de controle
// acende a luz quando a pessoa chega (na linha do tempo da cena e nas de
// teste), termina com o fim da simulação, e um loop sem esperar cai na
// proteção de sempre.
// Uso: node testes/cenas.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao, passarApresentacao, pularMeta } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const PISCAR = ["for (let vez = 1; vez <= 3; vez++) {", "  lampada.ligar();", "  esperar(500);", "  lampada.desligar();", "  esperar(500);", "}"].join("\n");
const VITRINE = ["while (true) {", "  if (sensor.temGente) {", "    luz.ligar();", "  } else {", "    luz.desligar();", "  }", "  esperar(100);", "}"].join("\n");

async function abrirFase(id) {
  const aberto = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: `/lab/fases?fase=${id}`, esperar: "[data-composicao]" });
  const { pagina } = aberto;
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
  await esperarPronto(pagina, 30000);
  for (let i = 0; i < 4; i++) {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) break;
    if (toque) await botao.tap();
    else await botao.click();
    await esperarPronto(pagina);
  }
  return aberto;
}

function ferramentas({ pagina }) {
  const tocar = async (localizador) => {
    if (movel) await fecharBalao(pagina);
    await localizador.scrollIntoViewIfNeeded();
    if (toque) await localizador.tap();
    else await localizador.click();
    await esperarPronto(pagina);
  };
  /** No celular, troca a aba das áreas (em pé: Código | Palco; deitado: Cena | Palco). */
  const area = async (id) => {
    if (!movel) return;
    const aba = pagina.locator(`[data-abas-composicao] [data-segmento="${id}"]`);
    if (!(await aba.count())) return;
    if ((await aba.getAttribute("aria-selected")) !== "true") await tocar(aba);
  };
  /** A cena à vista: em pé ela mora em cima (aberta); deitado, é a aba Cena. */
  const verCena = async () => {
    if (MODO === "paisagem") await area("cena");
    if (MODO === "retrato" && !(await pagina.locator('[data-area-trabalho="cena"]').isVisible())) await tocar(pagina.locator("[data-alternar-cena]"));
  };
  const escrever = async (codigo) => {
    await area("snippet");
    if (movel) {
      const snippetAba = pagina.getByRole("tab", { name: "Snippet", exact: true });
      if (await snippetAba.isVisible().catch(() => false)) await tocar(snippetAba);
      await fecharBalao(pagina);
    }
    const editor = pagina.locator("[data-editor-snippet] .cm-content");
    await editor.click();
    await pagina.keyboard.press("ControlOrMeta+A");
    await pagina.keyboard.press("Delete");
    // O código entra colado, inteiro (as chaves já vêm fechadas).
    await pagina.keyboard.insertText(codigo);
    await esperarPronto(pagina);
  };
  const executar = async () => {
    await area("snippet");
    await tocar(pagina.locator("[data-executar-snippet]"));
  };
  /** Pausa a cena e vai para o instante, pela barra de tempo dela. */
  const irPara = async (ms) => {
    await verCena();
    await pagina.evaluate((valor) => {
      const barra = document.querySelector("[data-barra-cena]");
      const definir = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      definir.call(barra, String(valor));
      barra.dispatchEvent(new Event("input", { bubbles: true }));
    }, ms);
    await pagina.waitForFunction((valor) => document.querySelector("[data-cena]")?.getAttribute("data-tempo") === String(valor), ms);
  };
  const atributo = (dispositivo, nome) => pagina.locator(`[data-dispositivo="${dispositivo}"]`).getAttribute(`data-${nome}`);
  const esperarCenaParar = () => pagina.waitForFunction(() => document.querySelector("[data-area-cena]")?.getAttribute("data-tocando") === "nao", null, { timeout: 30000 });
  /** O objetivo de agora passou: aparece o Próximo objetivo (ou o Ver resultado), que é tocado. */
  const proximo = async () => {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first();
    const passou = await botao.waitFor({ timeout: 10000 }).then(() => true).catch(() => false);
    if (passou && (await botao.textContent())?.includes("Próximo")) {
      if (toque) await botao.tap();
      else await botao.click();
      await esperarPronto(pagina);
    }
    if (movel) await fecharBalao(pagina);
    return passou;
  };
  const objetivoAtual = () => pagina.locator("[data-jogo-fase]").getAttribute("data-objetivo-atual");
  /** Escreve e roda no Console (no toque, com o botão Rodar). */
  const noConsole = async (codigo) => {
    await area("snippet");
    if (movel) {
      // No celular, a aba Fontes mostra o Snippet ou o Console (o seletor embaixo do cabeçalho).
      const consoleAba = pagina.locator('[data-segmento="baixo"]:visible').first();
      if ((await consoleAba.count()) && (await consoleAba.getAttribute("aria-selected")) !== "true") await tocar(consoleAba);
      await fecharBalao(pagina);
    }
    const entrada = pagina.locator("[data-console]:visible [data-entrada-console]").first();
    await entrada.click();
    await pagina.keyboard.insertText(codigo);
    if (toque) await pagina.locator("[data-console]:visible [data-rodar-console]").first().tap();
    else await pagina.keyboard.press("Enter");
    await esperarPronto(pagina);
  };
  const preverCerto = async () => {
    if (movel) await abrirBalao(pagina);
    await pagina.locator("[data-previsao]").waitFor();
    const opcao = await opcaoDaPrevisao(pagina);
    if (toque) await opcao.tap();
    else await opcao.click();
    await esperarPronto(pagina);
    if (movel) await fecharBalao(pagina);
  };
  return { tocar, area, verCena, escrever, executar, irPara, atributo, esperarCenaParar, proximo, objetivoAtual, noConsole, preverCerto };
}

// ---------------------------------------------------------------- o quarto: a lâmpada pisca no ritmo do código
{
  const aberto = await abrirFase("lab-cenas-u1-f1");
  const { pagina, navegador, erros } = aberto;
  const { tocar, verCena, escrever, executar, irPara, atributo, esperarCenaParar } = ferramentas(aberto);
  conferir((await pagina.locator("[data-composicao]").getAttribute("data-composicao")) === "cena snippet palco", `${MODO}: a tela é composta pela cena, o código e o palco`);
  await verCena();
  conferir(await pagina.locator('[data-cena="quarto-noite"]').isVisible(), `${MODO}: a cena do quarto aparece`);
  conferir((await atributo("lampada", "ligada")) === "false", `${MODO}: a lâmpada começa apagada`);

  await escrever(PISCAR);
  await executar();
  await verCena();
  // A cena toca sozinha depois do Executar e termina no fim (6 s): em 4x, rapidinho.
  await tocar(pagina.locator('[data-velocidade="4"]'));
  await esperarCenaParar();
  conferir((await pagina.locator("[data-cena]").getAttribute("data-tempo")) === "6000", `${MODO}: a cena tocou até o fim`);
  conferir((await pagina.locator("[data-velocidade-cena]").getAttribute("data-velocidade-cena")) === "4", `${MODO}: a velocidade da simulação trocou para 4x`);
  // O ritmo: acesa nos meios segundos pares, apagada nos ímpares.
  const ritmo = [];
  for (const ms of [250, 750, 1250, 1750, 2250, 2750, 3250]) {
    await irPara(ms);
    ritmo.push(await atributo("lampada", "ligada"));
  }
  conferir(ritmo.join(",") === "true,false,true,false,true,false,false", `${MODO}: a lâmpada pisca no ritmo do código (${ritmo.join(",")})`);
  // A linha do tempo da execução anda junto com a cena.
  await irPara(1250);
  const descricao = await pagina.locator("[data-descricao-passo]").textContent();
  conferir(/linha 3: esperar\(500\)/.test(descricao ?? ""), `${MODO}: no segundo 1,25 a linha do tempo está no esperar da segunda volta (${descricao})`);
  // A luz clareia o quarto: a máscara do escuro tem a área da lâmpada.
  conferir((await pagina.locator("[data-cena]").getAttribute("data-luzes")) === "1", `${MODO}: com a lâmpada acesa, a luz entra no desenho`);

  // A ficha da lâmpada, com o Por dentro.
  await tocar(pagina.locator('[data-dispositivo="lampada"]'));
  await pagina.waitForSelector('[data-modal-assentado="sim"]');
  conferir(((await pagina.locator("[data-exemplo-ficha]").textContent()) ?? "").includes("lampada.ligar();"), `${MODO}: a ficha mostra o exemplo com o nome da cena`);
  await tocar(pagina.locator("[data-ver-por-dentro]"));
  await pagina.locator("[data-fim-por-dentro]").waitFor();
  const etapas = await pagina.locator("[data-por-dentro] [data-etapa]").count();
  conferir(etapas === 4, `${MODO}: o Por dentro mostra o caminho do comando e a ponte com a Automação (${etapas} etapas)`);
  await pagina.keyboard.press("Escape");
  await pagina.waitForSelector("[data-ficha-dispositivo]", { state: "detached" });

  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo no quarto (${errosRelevantes(erros).join(" | ")})`);
  await navegador.close();
}

// ---------------------------------------------------------------- a vitrine: o loop de controle acende quando a pessoa chega
{
  const aberto = await abrirFase("lab-cenas-u1-f2");
  const { pagina, navegador, erros } = aberto;
  const { tocar, verCena, escrever, executar, irPara, atributo, esperarCenaParar, proximo, objetivoAtual, noConsole, preverCerto } = ferramentas(aberto);

  // 1. O sensor lê o mundo no instante de agora: no Console, o tempo anda com esperar.
  await noConsole("sensor.temGente");
  await noConsole("esperar(3500)");
  await noConsole("sensor.temGente");
  const respostas = await pagina.locator("[data-console]:visible [data-linha-console='resposta']").allInnerTexts();
  conferir(respostas[0]?.trim() === "false" && respostas[respostas.length - 1]?.trim() === "true", `${MODO}: no Console, o sensor responde false no começo e true depois de esperar(3500) (${respostas.join(" | ")})`);
  conferir(await proximo(), `${MODO}: ler o sensor andando no tempo passa`);

  // 2. Um if sozinho roda uma vez só: a pessoa chega e a vitrine fica apagada.
  await preverCerto();
  await escrever("if (sensor.temGente) luz.ligar();");
  await executar();
  conferir(await proximo(), `${MODO}: o if sozinho não acende a vitrine (roda no segundo 0)`);

  // Um loop sem esperar continua protegido (passos demais), com a dica da cena.
  await escrever("while (true) {\n  if (sensor.temGente) luz.ligar();\n}");
  await executar();
  const texto = (await pagina.locator("body").textContent()) ?? "";
  conferir(/Loop que nunca termina\?/.test(texto) && /o relógio só anda com esperar/.test(texto), `${MODO}: sem esperar, o loop cai na proteção com a dica da cena`);

  // 3. O loop de controle: o while (true) com esperar termina com o fim da simulação.
  await escrever(VITRINE);
  await executar();
  conferir(/A simulação terminou/.test((await pagina.locator("body").textContent()) ?? ""), `${MODO}: o while (true) com esperar termina com o fim da simulação`);
  await verCena();
  await tocar(pagina.locator('[data-velocidade="4"]'));
  await esperarCenaParar();
  await irPara(2000);
  conferir((await atributo("luz", "ligada")) === "false" && (await atributo("sensor", "tem-gente")) === "false", `${MODO}: antes da pessoa chegar, a vitrine fica apagada`);
  await irPara(4000);
  conferir((await atributo("luz", "ligada")) === "true" && (await atributo("sensor", "tem-gente")) === "true", `${MODO}: a pessoa chegou e a vitrine acendeu`);
  conferir((await pagina.locator('[data-pessoa][data-presente="sim"]').count()) === 1, `${MODO}: a pessoa está na frente da vitrine`);
  await irPara(8000);
  conferir((await atributo("luz", "ligada")) === "false", `${MODO}: a pessoa foi embora e a vitrine apagou`);

  // As outras linhas do tempo (variosCenarios): a mesma regra vale com gente chegando em outras horas.
  const testes = await pagina.locator("[data-variante]").count();
  conferir(testes === 4, `${MODO}: a cena mostra a linha do tempo dela e as 3 de teste (${testes})`);
  await tocar(pagina.locator('[data-variante="2"]'));
  await esperarCenaParar();
  await irPara(5000);
  conferir((await atributo("luz", "ligada")) === "false", `${MODO}: no teste 2, às 5 s ainda não chegou ninguém`);
  await irPara(6000);
  conferir((await atributo("luz", "ligada")) === "true", `${MODO}: no teste 2, a vitrine acende quando a pessoa chega (5,5 s)`);
  conferir(await proximo(), `${MODO}: o loop de controle passa nas várias linhas do tempo`);

  // 4. O mesmo código apaga quando a pessoa vai embora, inclusive com duas pessoas.
  conferir((await objetivoAtual()) === "apagar", `${MODO}: o último objetivo é apagar quando a pessoa vai embora`);
  await executar();
  conferir(await proximo(), `${MODO}: acender e apagar passam com idas e vindas`);

  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo na vitrine (${errosRelevantes(erros).join(" | ")})`);
  await navegador.close();
}

// ---------------------------------------------------------------- no modo jogo: as três apresentações (cena, ficha e velocidade)
{
  const aberto = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-cenas-u1-f1&modo=jogo", esperar: "[data-jogo-fase]" });
  const { pagina, navegador, erros } = aberto;
  const { tocar, verCena, escrever, executar, proximo, objetivoAtual, preverCerto } = ferramentas(aberto);
  await esperarPronto(pagina, 30000);
  await pularMeta(pagina);
  for (let i = 0; i < 4; i++) {
    // A apresentação da cena começa logo depois da introdução: aí a conversa espera.
    if (await pagina.locator("[data-apresentacao]").count()) break;
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) break;
    if (toque) await botao.tap();
    else await botao.click();
    await esperarPronto(pagina);
  }
  const clicar = async (seletor) => {
    const alvo = pagina.locator(seletor).first();
    if (toque) await alvo.tap();
    else await alvo.click();
  };
  // A cena é apresentada logo depois da introdução: o Experimente é tocar nela.
  await passarApresentacao(pagina, "cena", () => clicar("[data-area-cena] [data-barra-cena]"));
  conferir(true, `${MODO}: a apresentação da cena passa`);

  await escrever("lampada.ligar();");
  await executar();
  conferir(await proximo(), `${MODO}: lampada.ligar() acende a lâmpada (estadoNaCena)`);

  // A ficha é apresentada no objetivo dela: o Experimente é tocar na lâmpada (a ficha abre).
  await verCena();
  await passarApresentacao(pagina, "ficha-dispositivo", () => clicar('[data-dispositivo="lampada"]'));
  await pagina.waitForSelector('[data-ficha-dispositivo="lampada"]');
  await tocar(pagina.locator("[data-ver-por-dentro]"));
  await pagina.keyboard.press("Escape");
  await pagina.waitForSelector("[data-ficha-dispositivo]", { state: "detached" });
  conferir(await proximo(), `${MODO}: abrir a ficha e o Por dentro passa`);

  await preverCerto();
  await escrever("lampada.ligar();\nlampada.desligar();");
  await executar();
  conferir(await proximo(), `${MODO}: ligar e desligar sem esperar acontecem no mesmo instante`);

  await escrever(PISCAR);
  await executar();
  conferir(await proximo(), `${MODO}: piscar 3 vezes no ritmo passa (sequenciaNaCena)`);

  // A velocidade é apresentada no último objetivo: o Experimente é tocar em 2x.
  conferir((await objetivoAtual()) === "velocidade", `${MODO}: o último objetivo é a velocidade`);
  await verCena();
  await passarApresentacao(pagina, "velocidade-simulacao", () => clicar('[data-velocidade="2"]'));
  conferir(await proximo(), `${MODO}: trocar a velocidade passa (mudouVelocidade)`);

  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo no modo jogo (${errosRelevantes(erros).join(" | ")})`);
  await navegador.close();
}
