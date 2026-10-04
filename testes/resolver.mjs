// Resolução de problemas no /lab (lab-resolver-u1-f1): a fase composta com
// o plano, o código e o palco na mesma tela. Monta o plano tocando nos
// cartões, leva o plano pro código, acende um passo no código, troca a ordem
// (os comentários acompanham e o código escrito fica), escreve a função
// embaixo do plano, mexe no plano de novo sem perder o código e escreve os
// próprios casos de teste (um errado de propósito, corrigido na linha).
// Uso: node testes/resolver.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const CODIGO_MEDIA = [
  "function media(notas) {",
  "  if (notas.length === 0) return 0;",
  "  let soma = 0;",
  "  for (const nota of notas) soma = soma + nota;",
  "  return soma / notas.length;",
  "}",
].join("\n");

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
  /** No celular, troca a aba das áreas (em pé: Plano | Código | Testes; deitado: Plano | Palco | Testes). */
  const area = async (id) => {
    if (!movel) return;
    const aba = pagina.locator(`[data-abas-composicao] [data-segmento="${id}"]`);
    if (!(await aba.count())) return;
    if ((await aba.getAttribute("aria-selected")) !== "true") await tocar(aba);
  };
  const naConversa = async (nome) => {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: nome }).first();
    await botao.waitFor({ timeout: 10000 });
    if (toque) await botao.tap();
    else await botao.click();
    await esperarPronto(pagina);
  };
  const concluido = async () => {
    if (movel) await abrirBalao(pagina);
    return pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first().isVisible();
  };
  const esperarObjetivo = (id) =>
    pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });
  const plano = () => pagina.locator('[data-lista-ordenar="plano"] [data-item-ordenar]').evaluateAll((els) => els.map((e) => e.dataset.itemOrdenar));
  /** O texto do Snippet (as linhas do CodeMirror, mesmo com a área escondida). */
  const snippet = () => pagina.locator("[data-editor-snippet] .cm-line").evaluateAll((linhas) => linhas.map((l) => l.textContent).join("\n"));
  /** Escreve no fim do Snippet, pelo teclado, como o aluno. */
  const escreverNoFim = async (texto) => {
    await area("snippet");
    if (movel) {
      const snippetAba = pagina.getByRole("tab", { name: "Snippet", exact: true });
      if (await snippetAba.isVisible().catch(() => false)) await tocar(snippetAba);
      await fecharBalao(pagina);
    }
    const editor = pagina.locator("[data-editor-snippet] .cm-content");
    await editor.click();
    await pagina.keyboard.press("ControlOrMeta+End");
    await pagina.keyboard.insertText(texto);
    await esperarPronto(pagina);
  };
  return { tocar, area, naConversa, concluido, esperarObjetivo, plano, snippet, escreverNoFim };
}

// ---------------------------------------------------------------- a média das notas, do plano ao código
{
  const aberto = await abrirFase("lab-resolver-u1-f1");
  const { pagina, navegador, erros } = aberto;
  const { tocar, area, naConversa, concluido, esperarObjetivo, plano, snippet, escreverNoFim } = ferramentas(aberto);
  conferir((await pagina.locator("[data-composicao]").getAttribute("data-composicao")) === "plano snippet palco testes", `${MODO}: a tela é composta pelas áreas da fase`);

  // 1. O plano, tocando no cartão e depois em "Pôr no fim".
  await esperarObjetivo("planejar");
  await area("plano");
  for (const passo of ["vazia", "zerar", "somar", "dividir", "devolver"]) {
    await tocar(pagina.locator(`[data-pilha-ordenar] [data-escolher-passo="${passo}"]`));
    await tocar(pagina.locator('[data-por-aqui="plano:fim"]'));
  }
  conferir(JSON.stringify(await plano()) === '["vazia","zerar","somar","dividir","devolver"]', `${MODO}: o plano montado na tela composta`);
  conferir(await concluido(), `${MODO}: ordemValida passa na área plano`);
  await naConversa(/Próximo objetivo/);

  // 2. Levar o plano pro código (no celular em pé, a aba Código aparece).
  await esperarObjetivo("levar");
  await area("plano");
  await escreverNoFim("let rascunho = 1;");
  await area("plano");
  await tocar(pagina.locator("[data-levar-plano]"));
  if (MODO === "retrato") conferir((await pagina.locator("[data-composicao]").getAttribute("data-aba-composta")) === "snippet", `${MODO}: levar o plano mostra o código`);
  const comPlano = await snippet();
  conferir(comPlano.startsWith("// Plano: Calcular a média das notas\n// 1. Se não tiver nenhuma nota, devolver 0\n// 2. Começar a soma em zero"), `${MODO}: o plano entrou no topo do Snippet como comentários`);
  conferir(comPlano.endsWith("let rascunho = 1;"), `${MODO}: o código que já existia ficou`);
  conferir(await concluido(), `${MODO}: planoComentado passa`);
  await naConversa(/Próximo objetivo/);

  // 3. Tocar num passo do plano acende o comentário dele no código.
  await esperarObjetivo("acender");
  await area("plano");
  conferir((await pagina.locator("[data-lista-ordenar='plano'] [data-no-codigo]").count()) === 5, `${MODO}: os cinco passos ganham o selo de que estão no código`);
  await tocar(pagina.locator('[data-lista-ordenar="plano"] [data-escolher-passo="dividir"]'));
  conferir((await pagina.locator("[data-passo-no-codigo]").getAttribute("data-passo-no-codigo")) === "5", `${MODO}: o rodapé diz a linha do passo`);
  const acesa = await pagina.locator("[data-editor-snippet] .cm-linha-destacada").evaluateAll((linhas) => linhas.map((l) => l.textContent));
  conferir(acesa.length === 1 && acesa[0].includes("4. Dividir a soma"), `${MODO}: o comentário do passo acende no código (${acesa})`);
  if (MODO === "retrato") {
    await tocar(pagina.locator("[data-ver-no-codigo]"));
    conferir(await pagina.locator("[data-editor-snippet] .cm-linha-destacada").isVisible(), `${MODO}: Ver no código mostra a linha acesa`);
    await area("plano");
  }
  conferir(await concluido(), `${MODO}: tocar no passo gera apontouPasso`);
  await tocar(pagina.locator('[data-lista-ordenar="plano"] [data-escolher-passo="dividir"]'));
  await naConversa(/Próximo objetivo/);

  // 4. Trocar a ordem no plano: os comentários acompanham e o código escrito fica.
  await esperarObjetivo("reordenar");
  if (movel) await abrirBalao(pagina);
  const opcao = await opcaoDaPrevisao(pagina);
  if (toque) await opcao.tap();
  else await opcao.click();
  await esperarPronto(pagina);
  await area("plano");
  await tocar(pagina.locator('[data-descer-passo="vazia"]'));
  const trocado = await snippet();
  conferir(trocado.includes("// 1. Começar a soma em zero\n// 2. Se não tiver nenhuma nota, devolver 0"), `${MODO}: os comentários trocaram de ordem junto com o plano`);
  conferir(trocado.endsWith("let rascunho = 1;"), `${MODO}: mexer no plano não apagou o código`);
  conferir(await concluido(), `${MODO}: passoAntes + planoComentado passam`);
  await naConversa(/Próximo objetivo/);

  // 5. A função embaixo do plano, com o Executar.
  await esperarObjetivo("programar");
  await escreverNoFim(`\n${CODIGO_MEDIA}`);
  await tocar(pagina.locator("[data-executar-snippet]"));
  conferir(await concluido(), `${MODO}: funcaoPassa passa com a função escrita embaixo do plano`);
  // Mexer no plano depois do código: o bloco muda, a função continua.
  await area("plano");
  await tocar(pagina.locator('[data-tirar-passo="devolver"]'));
  const depois = await snippet();
  conferir(!depois.includes("Devolver a média") && depois.includes("return soma / notas.length;") && depois.includes("let rascunho = 1;"), `${MODO}: tirar um passo do plano tira só o comentário dele`);

  await naConversa(/Próximo objetivo/);

  // 6. Os casos de teste: um errado de propósito, corrigido na própria linha, e a lista vazia.
  await esperarObjetivo("testar");
  await area("testes");
  const escreverCaso = async (entrada, esperado) => {
    if (movel) await fecharBalao(pagina);
    const campoEntrada = pagina.locator("[data-entrada-nova]");
    await campoEntrada.click();
    await campoEntrada.fill(entrada);
    const campoEsperado = pagina.locator("[data-esperado-novo]");
    await campoEsperado.click();
    await campoEsperado.fill(esperado);
    await tocar(pagina.locator("[data-adicionar-caso]"));
  };
  await escreverCaso("[8, 6]", "8");
  if (toque) {
    // No toque, a barra de símbolos aparece com o campo em foco e escreve nele.
    await pagina.locator("[data-entrada-nova]").focus();
    await esperarPronto(pagina);
    conferir(await pagina.locator("[data-casos-de-teste] [data-barra-simbolos]").isVisible(), `${MODO}: a barra de símbolos aparece nos casos`);
    await pagina.locator("[data-casos-de-teste] [data-barra-simbolos] button", { hasText: "[" }).dispatchEvent("click");
    await pagina.locator("[data-casos-de-teste] [data-barra-simbolos] button", { hasText: "]" }).dispatchEvent("click");
    conferir((await pagina.locator("[data-entrada-nova]").inputValue()) === "[]", `${MODO}: a barra escreve no campo do caso`);
    await pagina.locator("[data-esperado-novo]").fill("0");
    await tocar(pagina.locator("[data-adicionar-caso]"));
  } else {
    await escreverCaso("[]", "0");
  }
  await tocar(pagina.locator("[data-rodar-casos]"));
  conferir((await pagina.locator('[data-caso="0"]').getAttribute("data-situacao-caso")) === "falhou", `${MODO}: o caso com a saída errada falha`);
  conferir((await pagina.locator('[data-resultado-caso="0"]').innerText()).includes("veio 7"), `${MODO}: o caso mostra o que veio de fato`);
  conferir((await pagina.locator('[data-caso="1"]').getAttribute("data-situacao-caso")) === "passou", `${MODO}: a lista vazia passa`);
  conferir(!(await concluido()), `${MODO}: com um caso falhando e só dois casos, o objetivo não passa`);
  // Corrigir a saída esperada na própria linha: o resultado apaga até rodar de novo.
  if (movel) await fecharBalao(pagina);
  await pagina.locator('[data-esperado-caso="0"]').fill("7");
  conferir((await pagina.locator('[data-caso="0"]').getAttribute("data-situacao-caso")) === "sem-resultado", `${MODO}: mudar o caso apaga o resultado dele`);
  await escreverCaso("[10]", "10");
  await tocar(pagina.locator("[data-rodar-casos]"));
  const situacoes = await pagina.locator("[data-situacao-caso]").evaluateAll((els) => els.map((e) => e.dataset.situacaoCaso));
  conferir(JSON.stringify(situacoes) === '["passou","passou","passou"]', `${MODO}: os três casos passam (${situacoes})`);
  conferir((await pagina.locator("[data-resumo-casos]").innerText()).includes("3 de 3 passando"), `${MODO}: o resumo diz quantos passam`);
  conferir(await concluido(), `${MODO}: casosDoAluno com a lista vazia e passando`);

  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} média: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}
// ---------------------------------------------------------------- o desafio composto, como no jogo
{
  const aberto = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-resolver-u1-f2&modo=jogo", esperar: "[data-jogo-fase]" });
  const { pagina, navegador, erros } = aberto;
  const { tocar, area, naConversa, plano, snippet, escreverNoFim } = ferramentas(aberto);
  await esperarPronto(pagina, 30000);
  /** Partes marcadas no checklist (em pé, ele abre na barra; deitado, no balão). */
  const partesFeitas = async () => {
    const barra = pagina.locator("button[aria-expanded]").filter({ hasText: /Checklist|Desafio/ }).first();
    if (MODO === "retrato") {
      await fecharBalao(pagina);
      await tocar(barra);
    }
    if (MODO === "paisagem") await abrirBalao(pagina);
    const feitas = await pagina.locator('[data-parte][data-feita="true"]').evaluateAll((els) => els.map((e) => e.dataset.parte));
    if (MODO === "retrato") await tocar(barra);
    return feitas.join(",");
  };

  // A meta: o antes e o depois das áreas (plano, código e casos).
  await pagina.locator("[data-meta]").waitFor({ timeout: 15000 });
  const depois = pagina.locator('[data-mini-composicao="Depois"]');
  conferir((await depois.locator("[data-mini-plano] li").count()) === 4, `${MODO}: a meta mostra o plano do depois`);
  conferir((await depois.locator("[data-mini-codigo]").innerText()).includes("// Plano: Contar quantos passaram"), `${MODO}: a meta mostra o código com o plano nos comentários`);
  conferir((await depois.locator("[data-mini-casos] li").count()) === 3, `${MODO}: a meta mostra os casos passando`);
  conferir((await pagina.locator('[data-mini-composicao="Antes"] [data-mini-plano]').innerText()).includes("Vazio"), `${MODO}: no antes, o plano está vazio`);
  const comecar = pagina.getByRole("button", { name: "Começar o desafio" });
  if (toque) await comecar.tap();
  else await comecar.click();
  await esperarPronto(pagina);
  for (let i = 0; i < 3; i++) {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) break;
    if (toque) await botao.tap();
    else await botao.click();
    await esperarPronto(pagina);
  }
  await pagina.waitForFunction(() => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === "desafio");

  // Plano, plano no código e código: três partes, sem passo a passo.
  await area("plano");
  for (const passo of ["zerar", "olhar", "contar", "devolver"]) {
    await tocar(pagina.locator(`[data-pilha-ordenar] [data-escolher-passo="${passo}"]`));
    await tocar(pagina.locator('[data-por-aqui="plano:fim"]'));
  }
  conferir((await partesFeitas()) === "plano", `${MODO}: a parte do plano se marca`);
  await area("plano");
  await tocar(pagina.locator("[data-levar-plano]"));
  conferir((await partesFeitas()) === "plano,plano-no-codigo", `${MODO}: a parte do plano no código se marca`);
  await escreverNoFim("\nfunction aprovados(notas) {\n  let contagem = 0;\n  for (const nota of notas) if (nota >= 6) contagem = contagem + 1;\n  return contagem;\n}");
  await tocar(pagina.locator("[data-executar-snippet]"));
  conferir((await partesFeitas()) === "plano,plano-no-codigo,codigo", `${MODO}: a parte do código se marca (funcaoPassa com bordas escondidas)`);

  // Um caso antes do Rever, para ver que ele também fica salvo.
  await area("testes");
  if (movel) await fecharBalao(pagina);
  await pagina.locator("[data-entrada-nova]").fill("[7, 4, 9]");
  await pagina.locator("[data-esperado-novo]").fill("2");
  await tocar(pagina.locator("[data-adicionar-caso]"));

  // Rever: a parte dos testes abre a prática composta em revisão, e a volta traz tudo de novo.
  // O Rever e a lista dele moram no balão: toca sem fechar o balão.
  await naConversa(/^Rever/);
  await pagina.locator("[data-lista-rever]").waitFor();
  const reverTestes = pagina.locator("[data-lista-rever] li").filter({ hasText: "casos seus passando" }).getByRole("button", { name: "Rever este passo" });
  if (toque) await reverTestes.tap();
  else await reverTestes.click();
  await esperarPronto(pagina);
  await pagina.waitForFunction(() => document.querySelector("[data-jogo-fase]")?.getAttribute("data-jogo-fase") === "lab-resolver-u1-f1");
  conferir((await pagina.getByText("Revisão", { exact: true }).count()) > 0, `${MODO}: o Rever abre a prática composta em revisão`);
  await tocar(pagina.getByRole("button", { name: "Voltar ao desafio" }).first());
  await pagina.waitForFunction(() => document.querySelector("[data-jogo-fase]")?.getAttribute("data-jogo-fase") === "lab-resolver-u1-f2");
  await esperarPronto(pagina, 30000);
  const conferirSalvo = async (quando) => {
    conferir(JSON.stringify(await plano()) === '["zerar","olhar","contar","devolver"]', `${MODO}: ${quando}, o plano continua`);
    const codigo = await snippet();
    conferir(codigo.startsWith("// Plano: Contar quantos passaram") && codigo.includes("return contagem;"), `${MODO}: ${quando}, o código continua`);
    conferir((await pagina.locator('[data-entrada-caso="0"]').inputValue()) === "[7, 4, 9]", `${MODO}: ${quando}, o caso continua`);
    conferir((await partesFeitas()) === "plano,plano-no-codigo,codigo", `${MODO}: ${quando}, o checklist continua`);
  };
  await conferirSalvo("depois do Rever");
  // Recarregar a página: o progresso traz plano, código e casos.
  await pagina.reload();
  await pagina.locator("[data-composicao]").waitFor();
  await esperarPronto(pagina, 30000);
  await conferirSalvo("depois de recarregar");

  // Os testes: mais dois casos, um deles a lista vazia, e o desafio termina.
  await area("testes");
  for (const [entrada, esperado] of [["[]", "0"], ["[6]", "1"]]) {
    if (movel) await fecharBalao(pagina);
    await pagina.locator("[data-entrada-nova]").fill(entrada);
    await pagina.locator("[data-esperado-novo]").fill(esperado);
    await tocar(pagina.locator("[data-adicionar-caso]"));
  }
  await tocar(pagina.locator("[data-rodar-casos]"));
  if (movel) await abrirBalao(pagina);
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 10000 });
  conferir(true, `${MODO}: com plano, código e testes, o desafio composto termina`);

  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} desafio: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}
console.log(`resolver.mjs ${MODO}: ok`);
