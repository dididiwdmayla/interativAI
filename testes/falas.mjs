// A fila de falas do computadorzinho: a fala de conclusão de um objetivo
// continua na tela até o jogador avançar (sem piscar, sem o balão fechar
// sozinho, sem a próxima fala atropelar), e o que um momento roteirizado
// conta espera o Continuar antes do enunciado e da apresentação.
// Uso: node testes/falas.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, opcaoDaPrevisao, progressoComFase, selecionarNo } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";
const DA_UNIDADE_1 = ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"];

async function tocar(pagina, localizador) {
  if (toque) await localizador.tap();
  else await localizador.click();
  await esperarPronto(pagina);
}

/** O texto da fala do computadorzinho (no celular, abre o balão antes). */
async function falaNaTela(pagina) {
  if (movel) await abrirBalao(pagina);
  return (await pagina.locator("[data-fala-mascote]").first().textContent())?.trim() ?? "";
}

// ------------------------------------------------ 1. A conclusão de um objetivo fica na tela.
{
  const { navegador, pagina, erros } = await abrir({
    ...TAMANHOS[MODO],
    progresso: progressoComFase("sites-elementos-u1-f1", {}, { apresentacoesVistas: DA_UNIDADE_1 }),
  });
  await esperarPronto(pagina);
  await selecionarNo(pagina, "h1");
  const conclusao = "Isso! Essa é a manchete, a tag h1. Viu como ela acendeu lá na tela?";
  conferir((await falaNaTela(pagina)) === conclusao, `${MODO}: a fala de conclusão aparece`);
  // Mais que o tempo de leitura de qualquer fala: nada troca nem fecha sozinho.
  await pagina.waitForTimeout(9000);
  if (movel) conferir((await pagina.locator("[data-balao]").getAttribute("data-balao")) === "aberto", `${MODO}: o balão da conclusão não fecha sozinho`);
  conferir((await pagina.locator("[data-fala-mascote]").first().textContent())?.trim() === conclusao, `${MODO}: a conclusão continua na tela até o jogador avançar`);
  const proximo = pagina.getByRole("button", { name: "Próximo objetivo" });
  conferir(await proximo.isVisible(), `${MODO}: a indicação de continuar (Próximo objetivo) está no balão`);
  if (toque) await tocar(pagina, proximo);
  else {
    // Enter também avança (fora de um campo).
    await pagina.locator("body").click({ position: { x: 5, y: 5 } }).catch(() => {});
    await pagina.keyboard.press("Enter");
    await esperarPronto(pagina);
  }
  conferir((await falaNaTela(pagina)) !== conclusao, `${MODO}: o jogador avança e vem o próximo objetivo`);
  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo (${JSON.stringify(errosRelevantes(erros))})`);
  await navegador.close();
}

// ------------------------------------------------ 2. O roteiro conta, espera o Continuar, e só depois vêm o enunciado e a apresentação.
{
  const vistas = [...DA_UNIDADE_1, "trilha", "esconder", "apagar", "duplicar"];
  const { navegador, pagina, erros } = await abrir({
    ...TAMANHOS[MODO],
    progresso: progressoComFase("sites-elementos-u2-f2", {}, { apresentacoesVistas: vistas, fasesConcluidas: ["sites-elementos-u1-f1", "sites-elementos-u2-f1"] }),
  });
  await esperarPronto(pagina);
  // Os objetivos 1 e 2 pela solução do Me ajuda (o 2 é uma previsão).
  for (const previsao of [false, true]) {
    if (movel) await abrirBalao(pagina);
    if (previsao) await tocar(pagina, await opcaoDaPrevisao(pagina));
    for (let degrau = 0; degrau < 4; degrau++) {
      if (movel) await abrirBalao(pagina);
      await tocar(pagina, pagina.getByRole("button", { name: /^Me ajuda\. Próxima/ }));
    }
    if (movel) await abrirBalao(pagina);
    await tocar(pagina, pagina.getByRole("button", { name: "Sim, mostrar a solução" }));
    if (movel) await abrirBalao(pagina);
    await tocar(pagina, pagina.getByRole("button", { name: "Próximo objetivo" }));
  }
  const contado = "Ops! Tropecei no painel e apaguei o rodapé sem querer. Me ajuda a desfazer?";
  await pagina.locator("[data-continuar-fala]").first().waitFor({ state: "attached", timeout: 8000 });
  conferir((await falaNaTela(pagina)) === contado, `${MODO}: o que o esbarrão conta aparece`);
  conferir((await pagina.locator("[data-apresentacao]").count()) === 0, `${MODO}: a apresentação do Desfazer espera a fila de falas`);
  await pagina.waitForTimeout(4000);
  conferir((await falaNaTela(pagina)) === contado, `${MODO}: a fala do esbarrão espera o Continuar`);
  conferir((await pagina.locator("[data-falas-na-fila]").first().getAttribute("data-falas-na-fila")) === "1", `${MODO}: o balão avisa que há mais um recado`);
  await tocar(pagina, pagina.locator("[data-continuar-fala]").first());
  // Depois do Continuar, a apresentação do Desfazer entra (com a fila vazia) e o enunciado fica no balão.
  await pagina.locator('[data-apresentacao="desfazer"]').waitFor({ timeout: 8000 });
  conferir(true, `${MODO}: com a fila vazia, a apresentação do Desfazer começa`);
  await tocar(pagina, pagina.getByRole("button", { name: /^Pular/ }).first());
  await pagina.locator("[data-apresentacao]").waitFor({ state: "detached", timeout: 8000 });
  conferir((await falaNaTela(pagina)).startsWith("Desfaça o meu esbarrão"), `${MODO}: o enunciado vem depois do que o roteiro contou`);
  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo (${JSON.stringify(errosRelevantes(erros))})`);
  await navegador.close();
}
