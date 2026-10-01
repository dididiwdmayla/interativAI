// Retomar no meio de um momento roteirizado: a página volta para antes do
// esbarrão, o computadorzinho esbarra de novo e o Desfazer continua valendo.
// Também confere o custo das soluções. A fase abre direto pelo endereço
// (/fase/sites-elementos-u2-f2), sem introdução vista.
import { abrir, conferir, errosRelevantes, esperarPronto, progressoComFase, opcaoDaPrevisao } from "./util.mjs";
const TODAS = ["painel","previa","me-ajuda","tutor","arvore","inspecionar","editar-duplo-clique","editor","sincronia","trilha","esconder","apagar","desfazer","duplicar"];
const concl = ["sites-elementos-u1-f1","sites-elementos-u2-f1"];
const { navegador, pagina, erros } = await abrir({
  progresso: progressoComFase("sites-elementos-u2-f1", {}, { apresentacoesVistas: TODAS, fasesConcluidas: concl, faseAtual: "sites-elementos-u2-f2" }),
});
const iframe = pagina.frameLocator("section[data-previa] iframe");
await esperarPronto(pagina);
conferir((await iframe.locator("#popup-cookies").count()) === 1, "o endereço abre a fase 2");
// Pula a introdução e faz os objetivos 1 e 2 pela solução do Me ajuda.
for (let i = 0; i < 3; i++) { await pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first().click(); await esperarPronto(pagina); }
for (const previsao of [false, true]) {
  await esperarPronto(pagina);
  if (previsao) { await (await opcaoDaPrevisao(pagina)).click(); await esperarPronto(pagina); }
  for (let d = 0; d < 4; d++) { await pagina.getByRole("button", { name: /^Me ajuda\. Próxima/ }).click(); await esperarPronto(pagina); }
  await pagina.getByRole("button", { name: "Sim, mostrar a solução" }).click();
  await pagina.getByRole("button", { name: "Próximo objetivo" }).click();
}
await esperarPronto(pagina);
conferir((await iframe.locator("#rodape").count()) === 0, "esbarrão apagou o rodapé");
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")).fasesEmAndamento["sites-elementos-u2-f2"]);
conferir(salvo.htmlInicioObjetivo?.includes("rodape") && !salvo.htmlAtual.includes('id="rodape"'), "salva o HTML de antes do esbarrão");
conferir(salvo.estrelas === 1, `duas soluções: 1 estrela (${salvo.estrelas})`);
await pagina.reload();
// O momento roda de novo: enquanto o esbarrão está em cena, a página é a de antes dele.
await pagina.locator('[data-jogo-fase][data-roteiro="esbarrao"]').waitFor({ timeout: 8000 });
await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentDocument?.querySelector("#rodape"));
conferir((await iframe.locator("#rodape").count()) === 1, "ao retomar, a página volta para antes do esbarrão");
await esperarPronto(pagina);
conferir((await iframe.locator("#rodape").count()) === 0, "e o esbarrão acontece de novo");
await pagina.getByRole("button", { name: /^Desfazer a última mudança/ }).click();
await pagina.getByRole("button", { name: "Próximo objetivo" }).waitFor({ timeout: 4000 });
conferir((await iframe.locator("#rodape").count()) === 1, "Desfazer funciona depois de recarregar");
conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
