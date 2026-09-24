// Retomar no meio de um momento roteirizado: a página volta para antes do
// esbarrão, o computadorzinho esbarra de novo e o Desfazer continua valendo.
// Também confere a Lista de fases e o custo das soluções.
import { abrir, conferir, errosRelevantes, progressoComFase } from "./util.mjs";
const TODAS = ["painel","previa","me-ajuda","tutor","arvore","inspecionar","editar-duplo-clique","editor","sincronia","trilha","esconder","apagar","desfazer","duplicar"];
const concl = ["sites-elementos-u1-f1","sites-elementos-u2-f1"];
const { navegador, pagina, erros } = await abrir({ progresso: progressoComFase("sites-elementos-u2-f1", {}, { apresentacoesVistas: TODAS, fasesConcluidas: concl, faseAtual: "sites-elementos-u2-f1" }) });
const iframe = pagina.frameLocator("iframe[title^='Site']").first();
// Vai para a fase 2 pela lista de fases.
await pagina.getByRole("button", { name: "Abrir a lista de fases" }).click();
await pagina.locator('[data-fase="sites-elementos-u2-f2"]').click();
await pagina.waitForTimeout(800);
conferir((await iframe.locator("#popup-cookies").count()) === 1, "lista de fases abre a fase 2");
// Pula a introdução e faz os objetivos 1 e 2 pela solução do Me ajuda.
for (let i = 0; i < 3; i++) { await pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first().click(); await pagina.waitForTimeout(150); }
for (const previsao of [false, true]) {
  await pagina.waitForTimeout(900);
  if (previsao) { await pagina.locator("[data-previsao] button").nth(1).click(); await pagina.waitForTimeout(300); }
  for (let d = 0; d < 4; d++) { await pagina.getByRole("button", { name: /^Me ajuda\. Próxima/ }).click(); await pagina.waitForTimeout(120); }
  await pagina.getByRole("button", { name: "Sim, mostrar a solução" }).click();
  await pagina.getByRole("button", { name: "Próximo objetivo" }).click();
}
await pagina.waitForTimeout(1600);
conferir((await iframe.locator("#rodape").count()) === 0, "esbarrão apagou o rodapé");
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")).fasesEmAndamento["sites-elementos-u2-f2"]);
conferir(salvo.htmlInicioObjetivo?.includes("rodape") && !salvo.htmlAtual.includes('id="rodape"'), "salva o HTML de antes do esbarrão");
conferir(salvo.estrelas === 1, `duas soluções: 1 estrela (${salvo.estrelas})`);
await pagina.reload();
await pagina.waitForSelector("iframe");
await pagina.waitForTimeout(500);
conferir((await iframe.locator("#rodape").count()) === 1, "ao retomar, a página volta para antes do esbarrão");
await pagina.waitForTimeout(1600);
conferir((await iframe.locator("#rodape").count()) === 0, "e o esbarrão acontece de novo");
await pagina.getByRole("button", { name: /^Desfazer a última mudança/ }).click();
await pagina.getByRole("button", { name: "Próximo objetivo" }).waitFor({ timeout: 4000 });
conferir((await iframe.locator("#rodape").count()) === 1, "Desfazer funciona depois de recarregar");
conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
