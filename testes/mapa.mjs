// O mapa das ilhas: mundo (estados das ilhas, rota, computadorzinho),
// ilha (pontos, card, Jogar), museu das Origens, comemoração ao concluir
// uma unidade e os três layouts.
// Uso: node testes/mapa.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, progressoComFase, pularMeta, URL_JOGO } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const ROTA_MUNDO = "/mapa";
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
  for (const id of ["origens", "logica", "paginas-vivas", "rede-servidor", "oficio", "frameworks"]) {
    conferir((await ilha(id).getAttribute("data-estado")) === "construcao", `${MODO}: ${id} em construção (sem unidade pronta)`);
  }
  conferir((await ilha("frameworks").textContent()).includes("Opcional"), `${MODO}: Frameworks marcada como Opcional`);
  conferir((await pagina.locator("[data-mascote-no-mapa=sites]").count()) === 1, `${MODO}: o computadorzinho está em Sites`);
  conferir((await pagina.locator("[data-total-estrelas]").getAttribute("data-total-estrelas")) === "0", `${MODO}: 0 estrelas no total`);
  const area = pagina.getByRole("region", { name: /Mapa do mundo/ });
  const medidas = await area.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight }));
  if (MODO !== "desktop") conferir(medidas.sw > medidas.cw, `${MODO}: o mundo rola de lado (${medidas.sw} > ${medidas.cw})`);

  // Ilha em construção: dá para entrar e ver o percurso planejado.
  await tocar(ilha("logica"));
  await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
  conferir((await pagina.getByText("Em construção").count()) >= 6, `${MODO}: as zonas da Lógica têm a placa Em construção`);
  conferir(
    (await pagina.locator("[data-unidade][data-estado=planejada]").count()) === (await pagina.locator("[data-unidade]").count()),
    `${MODO}: na Lógica, todas as unidades aparecem como planejadas`,
  );
  conferir((await pagina.getByText("Console interativo").count()) === 0, `${MODO}: o texto técnico do motor não aparece`);
  await pagina.goBack();
  await pagina.locator("[data-mapa=mundo]").waitFor();
  conferir(true, `${MODO}: o voltar do navegador volta ao mundo`);

  // Sites: U1 disponível, U2 bloqueada, U3 em diante planejadas.
  await tocar(ilha("sites"));
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  const ponto = (id) => pagina.locator(`[data-unidade="${id}"]`);
  conferir((await ponto("sites-elementos-u1").getAttribute("data-estado")) === "disponivel", `${MODO}: U1 disponível`);
  conferir((await ponto("sites-elementos-u2").getAttribute("data-estado")) === "bloqueada", `${MODO}: U2 bloqueada`);
  conferir((await ponto("sites-elementos-u3").getAttribute("data-estado")) === "planejada", `${MODO}: U3 planejada`);
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
  await tocar(ponto("sites-elementos-u3"));
  await card.waitFor();
  conferir((await card.textContent()).includes("Em breve"), `${MODO}: card da planejada diz Em breve`);
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Fechar" }));

  await tocar(ponto("sites-elementos-u1"));
  await card.waitFor();
  conferir((await card.textContent()).includes("Mexer em qualquer site sozinho"), `${MODO}: card mostra a meta da U1`);
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar" }));
  await pagina.waitForSelector("section[data-previa] iframe");
  conferir(await pularMeta(pagina), `${MODO}: Jogar abre a primeira fase da U1, com a meta`);

  // Museu das Origens.
  await pagina.goto(`${URL_JOGO}/ilha/origens`);
  await pagina.locator("[data-mapa=museu]").waitFor();
  conferir((await pagina.locator("[data-sala]").count()) === 5, `${MODO}: museu com as 5 salas`);
  conferir((await pagina.locator("[data-antepassado]").count()) === 3, `${MODO}: os 3 antepassados na entrada`);
  conferir((await pagina.getByText("Em breve").count()) >= 5, `${MODO}: as portas dizem Em breve`);

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
