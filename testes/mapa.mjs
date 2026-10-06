// O mapa das ilhas: mundo (estados das ilhas, rota, computadorzinho),
// ilha (pontos, card, Jogar), museu das Origens, comemoração ao concluir
// uma unidade e os três layouts.
// Uso: node testes/mapa.mjs [desktop|retrato|paisagem]
import { CURRICULO, ehPronta, planejadasDaIlha, prontasDaIlha, unidadesDaIlha } from "./curriculo.mjs";
import { abrir, conferir, errosRelevantes, progressoComFase, pularMeta, URL_JOGO } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const ROTA_MUNDO = "/";
const U1 = ["sites-elementos-u1-f1", "sites-elementos-u1-f2", "sites-elementos-u1-f3"];

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
}

// ---------------------------------------------------------------- do zero
{
  const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: ROTA_MUNDO, esperar: "[data-mapa=mundo]" });
  const ilha = (id) => pagina.locator(`[data-ilha="${id}"]`).first();
  conferir((await ilha("sites").getAttribute("data-estado")) === "disponivel", `${MODO}: Sites aberta`);
  // Toda ilha sem unidade pronta aparece em construção (derivado do conteúdo publicado).
  for (const { id } of CURRICULO.filter((item) => item.id !== "sites" && prontasDaIlha(item.id).length === 0)) {
    conferir((await ilha(id).getAttribute("data-estado")) === "construcao", `${MODO}: ${id} em construção (sem unidade pronta)`);
  }
  conferir((await ilha("frameworks").textContent()).includes("Opcional"), `${MODO}: Frameworks marcada como Opcional`);
  conferir((await pagina.locator("[data-mascote-no-mapa=sites]").count()) === 1, `${MODO}: o computadorzinho está em Sites`);
  conferir((await pagina.locator("[data-total-estrelas]").getAttribute("data-total-estrelas")) === "0", `${MODO}: 0 estrelas no total`);
  const area = pagina.getByRole("region", { name: /Mapa do mundo/ });
  const medidas = await area.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight }));
  if (MODO !== "desktop") conferir(medidas.sw > medidas.cw, `${MODO}: o mundo rola de lado (${medidas.sw} > ${medidas.cw})`);

  // Ilha em construção: dá para entrar e ver o percurso planejado. A
  // primeira da rota sem nenhuma unidade pronta (hoje, a Lógica).
  const emConstrucao = CURRICULO.find((item) => !item.sempreAberta && !item.opcional && prontasDaIlha(item.id).length === 0);
  await tocar(ilha(emConstrucao.id));
  await pagina.locator(`[data-mapa=ilha][data-ilha=${emConstrucao.id}]`).waitFor();
  const zonasComMotor = emConstrucao.zonas.filter((zona) => zona.requerMotor);
  conferir(
    (await pagina.getByText("Em construção").count()) >= zonasComMotor.length,
    `${MODO}: as ${zonasComMotor.length} zonas de ${emConstrucao.id} que esperam motor têm a placa Em construção`,
  );
  conferir(
    (await pagina.locator("[data-unidade][data-estado=planejada]").count()) === unidadesDaIlha(emConstrucao.id).length,
    `${MODO}: em ${emConstrucao.id}, todas as unidades aparecem como planejadas`,
  );
  const textoDoMotor = zonasComMotor[0].requerMotor.slice(0, 18);
  conferir((await pagina.getByText(textoDoMotor).count()) === 0, `${MODO}: o texto técnico do motor não aparece ("${textoDoMotor}")`);
  const primeiraPlanejada = unidadesDaIlha(emConstrucao.id)[0];
  await tocar(pagina.locator(`[data-unidade="${primeiraPlanejada.id}"]`));
  await pagina.locator("[data-card-unidade]").waitFor();
  conferir((await pagina.locator("[data-card-unidade]").textContent()).includes("Em breve"), `${MODO}: card da planejada ${primeiraPlanejada.id} diz Em breve`);
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Fechar" }));
  await pagina.goBack();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  conferir(true, `${MODO}: o voltar do navegador volta ao mundo`);

  // Sites: a primeira pronta disponível, as outras prontas bloqueadas
  // (esperando a anterior) e as sem conteúdo planejadas. Tudo derivado do
  // currículo e do conteúdo publicado (testes/curriculo.mjs).
  await tocar(ilha("sites"));
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  const ponto = (id) => pagina.locator(`[data-unidade="${id}"]`);
  const [primeira, ...outrasProntas] = prontasDaIlha("sites");
  conferir((await ponto(primeira.id).getAttribute("data-estado")) === "disponivel", `${MODO}: ${primeira.id} disponível`);
  for (const unidade of outrasProntas) {
    conferir((await ponto(unidade.id).getAttribute("data-estado")) === "bloqueada", `${MODO}: ${unidade.id} bloqueada (pronta, esperando a anterior)`);
  }
  const planejadaSites = planejadasDaIlha("sites")[0];
  for (const unidade of planejadasDaIlha("sites")) {
    conferir((await ponto(unidade.id).getAttribute("data-estado")) === "planejada", `${MODO}: ${unidade.id} planejada`);
  }
  const tamanhoPonto = await ponto("sites-elementos-u1").boundingBox();
  conferir(tamanhoPonto.width >= 44 && tamanhoPonto.height >= 44, `${MODO}: pontos com pelo menos 44 px`);
  if (MODO === "retrato") {
    const [a, b] = await Promise.all([ponto("sites-elementos-u1").boundingBox(), ponto("sites-elementos-u3").boundingBox()]);
    conferir(b.y - a.y > Math.abs(b.x - a.x), "retrato: o caminho da ilha corre na vertical");
  } else {
    const [a, b] = await Promise.all([ponto("sites-elementos-u1").boundingBox(), ponto("sites-elementos-u3").boundingBox()]);
    conferir(b.x - a.x > Math.abs(b.y - a.y), `${MODO}: o caminho da ilha corre na horizontal`);
  }

  await tocar(ponto("sites-elementos-u2"));
  const card = pagina.locator("[data-card-unidade]");
  await card.waitFor();
  conferir((await card.textContent()).includes("Termine a unidade O site é seu para abrir"), `${MODO}: card da U2 diz o que falta`);
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Fechar" }));
  if (planejadaSites) {
    await tocar(ponto(planejadaSites.id));
    await card.waitFor();
    conferir((await card.textContent()).includes("Em breve"), `${MODO}: card da planejada (${planejadaSites.id}) diz Em breve`);
    await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Fechar" }));
  } else {
    console.log(`${MODO}: Sites não tem unidade planejada (o card "Em breve" foi conferido na ilha em construção)`);
  }

  await tocar(ponto("sites-elementos-u1"));
  await card.waitFor();
  conferir((await card.textContent()).includes("Mexer em qualquer site sozinho"), `${MODO}: card mostra a meta da U1`);
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar" }));
  await pagina.waitForSelector("section[data-previa] iframe");
  conferir(new URL(pagina.url()).pathname === "/fase/sites-elementos-u1-f1", `${MODO}: Jogar abre /fase/sites-elementos-u1-f1`);
  conferir(await pularMeta(pagina), `${MODO}: a primeira fase da U1 abre com a meta`);

  // Recarregar mantém o lugar; o voltar do navegador faz fase -> ilha -> mundo.
  await pagina.reload();
  await pagina.waitForSelector("section[data-previa] iframe");
  conferir(new URL(pagina.url()).pathname === "/fase/sites-elementos-u1-f1", `${MODO}: recarregar mantém a fase`);
  conferir((await pagina.locator("[data-meta]").count()) === 0, `${MODO}: e a meta não volta`);
  await pagina.goBack();
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  conferir(true, `${MODO}: voltar do navegador: da fase para a ilha`);
  await pagina.reload();
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  conferir(true, `${MODO}: recarregar mantém a ilha`);
  conferir(
    (await pagina.locator("[data-mascote-no-ponto]").getAttribute("data-mascote-no-ponto")) === "sites-elementos-u1",
    `${MODO}: o computadorzinho está na U1`,
  );
  await pagina.goBack();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  conferir(true, `${MODO}: voltar do navegador: da ilha para o mundo`);
  await pagina.goForward();
  await pagina.locator("[data-mapa=ilha]").waitFor();
  await pagina.goForward();
  await pagina.waitForSelector("section[data-previa] iframe");
  // O botão Mapa, dentro da fase, volta para a ilha.
  await tocar(pagina.locator("[data-botao-mapa]").first());
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  conferir(true, `${MODO}: o botão Mapa da fase volta para a ilha`);
  // Fase trancada digitada no endereço: não abre.
  await pagina.goto(`${URL_JOGO}/fase/sites-elementos-u2-f1`);
  await pagina.locator("[data-fase-trancada]").waitFor();
  conferir(true, `${MODO}: fase trancada pelo endereço mostra o aviso e o caminho de volta`);

  // Museu das Origens.
  await pagina.goto(`${URL_JOGO}/ilha/origens`);
  await pagina.locator("[data-mapa=museu]").waitFor();
  // O corredor de épocas (rodada 36): oito épocas, uma porta para cada sala; as planejadas dizem Em breve.
  const salas = unidadesDaIlha("origens");
  conferir((await pagina.locator("[data-epoca]").count()) === 8, `${MODO}: o corredor tem as oito épocas`);
  conferir((await pagina.locator('[data-porta-sala^="origens-museu-"]').count()) === salas.length, `${MODO}: museu com as ${salas.length} salas`);
  const planejadas = salas.filter((sala) => !ehPronta(sala.id)).length;
  conferir((await pagina.locator('[data-estado-sala="planejada"]').count()) === planejadas, `${MODO}: as ${planejadas} salas sem conteúdo dizem Em breve`);

  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ---------------------------------------------------------------- comemoração
{
  const progresso = progressoComFase("sites-elementos-u1-f3", { objetivoAtual: 4, partesFeitas: [] }, {
    fasesConcluidas: U1,
    estrelasPorFase: { [U1[0]]: 3, [U1[1]]: 3, [U1[2]]: 3 },
  });
  const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/ilha/sites", esperar: "[data-mapa=ilha]" });
  await pagina.locator("[data-comemoracao]").waitFor({ timeout: 5000 });
  conferir(true, `${MODO}: ao voltar com a U1 concluída, a ilha comemora`);
  conferir((await pagina.locator('[data-unidade="sites-elementos-u1"]').getAttribute("data-estado")) === "concluida", `${MODO}: U1 concluída`);
  conferir((await pagina.locator('[data-unidade="sites-elementos-u2"]').getAttribute("data-estado")) === "disponivel", `${MODO}: U2 disponível`);
  conferir((await pagina.locator("[data-trecho-andado]").count()) === 1, `${MODO}: o caminho até a U2 está desenhado`);
  await pagina.waitForTimeout(2600);
  const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
  conferir(salvo.unidadesComemoradas.includes("sites-elementos-u1"), `${MODO}: a comemoração fica registrada`);
  conferir(salvo.posicaoNoMapa.sites === "sites-elementos-u2", `${MODO}: o computadorzinho andou até a U2`);
  await pagina.reload();
  await pagina.locator("[data-mapa=ilha]").waitFor();
  await pagina.waitForTimeout(800);
  conferir((await pagina.locator("[data-comemoracao]").count()) === 0, `${MODO}: recarregar não comemora de novo`);
  conferir((await pagina.locator("[data-total-estrelas]").getAttribute("data-total-estrelas")) === "9", `${MODO}: 9 estrelas no total`);
  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo na comemoração ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ---------------------------------------------------------------- /lab/mapa
if (MODO === "desktop") {
  const { navegador, pagina, erros } = await abrir({ progresso: null, rota: "/lab/mapa", esperar: "[data-lab-mapa]" });
  await pagina.getByRole("button", { name: "Desbloquear tudo" }).click();
  conferir((await pagina.locator("[data-desbloqueado=true]").count()) === 1, "lab: desbloquear tudo");
  await pagina.goto(`${URL_JOGO}/ilha/sites`);
  await pagina.locator("[data-mapa=ilha]").waitFor();
  conferir((await pagina.locator('[data-unidade="sites-elementos-u2"]').getAttribute("data-estado")) === "disponivel", "lab: com tudo desbloqueado, a U2 abre");
  await pagina.goto(`${URL_JOGO}/fase/sites-elementos-u2-f4`);
  await pagina.waitForSelector("section[data-previa] iframe");
  conferir((await pagina.locator("[data-fase-trancada]").count()) === 0, "lab: o desafio da U2 abre direto pelo endereço");
  await pagina.goto(`${URL_JOGO}/lab/mapa`);
  await pagina.locator("[data-lab-mapa]").waitFor();
  await pagina.getByRole("button", { name: "Abrir a Lista de fases" }).click();
  await pagina.getByRole("dialog", { name: "Lista de fases" }).waitFor();
  await pagina.locator('[data-fase="sites-elementos-u1-f2"]').click();
  await pagina.waitForURL("**/fase/sites-elementos-u1-f2");
  conferir(true, "lab: a Lista de fases mora no /lab/mapa e abre a fase escolhida");
  await pagina.goto(`${URL_JOGO}/lab/mapa`);
  await pagina.locator("[data-lab-mapa]").waitFor();
  await pagina.getByRole("button", { name: "Resetar o progresso do mapa" }).click();
  await pagina.getByRole("button", { name: "Sim, resetar" }).click();
  const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
  conferir(
    !salvo.mapaDesbloqueado && salvo.fasesConcluidas.length === 0 && Object.keys(salvo.fasesEmAndamento).length === 0,
    "lab: resetar limpa o progresso do mapa",
  );
  conferir(errosRelevantes(erros).length === 0, `lab: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
