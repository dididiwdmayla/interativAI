// Explorar o jogo por outros ângulos: trilhas, lentes de tema e de
// profissão (no mundo e na ilha, com unidades planejadas), insígnias
// (painel e comemoração de marco) e o glossário vivo (busca, links para a
// fase liberada e para o ponto no mapa, botão dentro da fase).
// Uso: node testes/explorar.mjs [desktop|retrato|paisagem]
import { readFileSync } from "node:fs";
import { planejadaComTema } from "./curriculo.mjs";
import { abrir, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";

/** As unidades publicadas e as fases de cada uma (src/conteudo/publicados.json). */
const PUBLICADAS = JSON.parse(readFileSync(new URL("../src/conteudo/publicados.json", import.meta.url), "utf8")).unidades;
const SITES_CONCLUIDAS = Object.keys(PUBLICADAS).filter((id) => id.startsWith("sites-"));

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/", esperar: "[data-mapa=mundo]" });

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
}

/** Um item da barra do mapa (no celular, dentro do menu). */
async function itemDaBarra(nome) {
  if (movel) {
    await tocar(pagina.getByRole("button", { name: "Mais opções" }));
  }
  const alvo = pagina.getByRole(nome === "Abrir o painel Insígnias" ? "button" : "link", { name: nome }).first();
  await tocar(alvo);
}

const ilha = (id) => pagina.locator(`[data-ilha="${id}"]`).first();
const ponto = (id) => pagina.locator(`[data-unidade="${id}"]`);

// ---------------------------------------------------------------- lente de tema no mundo
await pagina.locator("[data-barra-lentes]").waitFor();
conferir((await pagina.locator("[data-barra-lentes] [data-tema]").count()) === 12, `${MODO}: barra de temas com os 12 temas`);
await tocar(pagina.locator('[data-barra-lentes] [data-tema="seguranca"]'));
const progressoLente = pagina.locator("[data-progresso-lente]");
await progressoLente.waitFor();
const textoLente = await progressoLente.textContent();
conferir(/^Segurança: 0 de \d+ unidades/.test(textoLente), `${MODO}: lente mostra o progresso contando as planejadas (${textoLente})`);
conferir((await ilha("sites").getAttribute("data-lente")) === "apagada", `${MODO}: Sites, sem Segurança, fica apagada`);
conferir((await ilha("rede-servidor").getAttribute("data-lente")) === "acesa", `${MODO}: Rede e Servidor acende`);
conferir(Number(await pagina.locator('[data-ilha="rede-servidor"] [data-lente-conta]').getAttribute("data-lente-conta")) >= 4, `${MODO}: a ilha diz quantas unidades do tema tem`);

// ---------------------------------------------------------------- lente na ilha (planejadas também)
await tocar(pagina.locator('[data-barra-lentes] [data-tema="acessibilidade"]'));
await tocar(ilha("sites"));
await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
conferir((await ponto("sites-elementos-u3").getAttribute("data-lente")) === "acesa", `${MODO}: na ilha, a U3 (Acessibilidade) acende`);
conferir((await ponto("sites-elementos-u1").getAttribute("data-lente")) === "apagada", `${MODO}: e a U1 apaga`);
const planejadaAcessivel = planejadaComTema("acessibilidade", ["sites"]);
if (planejadaAcessivel) {
  conferir((await ponto(planejadaAcessivel.unidade.id).getAttribute("data-lente")) === "acesa", `${MODO}: a planejada ${planejadaAcessivel.unidade.id} acende`);
}
await tocar(pagina.getByRole("button", { name: /Apagar a lente/ }));
await pagina.locator("[data-progresso-lente]").waitFor({ state: "detached" });
conferir((await ponto("sites-elementos-u1").getAttribute("data-lente")) === null, `${MODO}: o X apaga a lente`);
await tocar(ponto("sites-elementos-u3"));
await pagina.locator('[data-card-unidade] [data-tema-da-unidade="acessibilidade"]').waitFor();
conferir(true, `${MODO}: o card da unidade mostra os temas dela`);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Fechar" }));

// ---------------------------------------------------------------- trilhas
await itemDaBarra(/^Trilhas/);
await pagina.locator("[data-tela=trilhas]").waitFor();
conferir((await pagina.locator("[data-card-trilha]").count()) === 3, `${MODO}: três trilhas`);
conferir((await pagina.locator('[data-card-trilha="web"]').getAttribute("data-atual")) === "sim", `${MODO}: Web é a padrão`);
conferir((await pagina.locator('[data-card-trilha="automacao"]').textContent()).includes("Em construção"), `${MODO}: Automação em construção`);
await tocar(pagina.locator('[data-card-trilha="automacao"]').getByRole("button", { name: /Escolher/ }));
await pagina.locator("[data-mapa=mundo][data-trilha=automacao]").waitFor();
conferir((await ilha("sites").count()) === 0, `${MODO}: na Automação, Sites não aparece no mundo`);
conferir((await ilha("clp-e-ladder").getAttribute("data-estado")) === "construcao", `${MODO}: CLP e Ladder aparece em construção`);
conferir((await pagina.locator("[data-mascote-no-mapa=eletronica]").count()) === 1, `${MODO}: o computadorzinho vai para a primeira ilha própria`);
await tocar(ilha("eletronica"));
await pagina.locator("[data-ilha-em-construcao]").waitFor();
conferir((await pagina.locator("[data-ilha-em-construcao]").textContent()).includes("Automação industrial"), `${MODO}: a ilha só nomeada diz de que trilha é`);
await pagina.goto(new URL("/trilhas", pagina.url()).href);
await tocar(pagina.locator('[data-card-trilha="web"]').getByRole("button", { name: /Escolher/ }));
await pagina.locator("[data-mapa=mundo][data-trilha=web]").waitFor();
const salvoTrilha = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")).trilha);
conferir(salvoTrilha === "web", `${MODO}: a escolha da trilha fica salva (${salvoTrilha})`);

// ---------------------------------------------------------------- profissões
await itemDaBarra("Profissões");
await pagina.locator("[data-tela=profissoes]").waitFor();
conferir((await pagina.locator("[data-card-profissao]").count()) === 6, `${MODO}: seis profissões`);
const front = pagina.locator('[data-card-profissao="front-end"]');
conferir((await front.textContent()).includes("Um dia de trabalho"), `${MODO}: o card tem um dia de trabalho`);
await tocar(front.getByRole("button", { name: /Acender Front-end/ }));
await pagina.locator("[data-mapa=mundo]").waitFor();
conferir((await pagina.locator("[data-progresso-lente]").textContent()).startsWith("Front-end: 0% do caminho"), `${MODO}: a lente da profissão mostra o caminho`);
conferir((await ilha("sites").getAttribute("data-lente")) === "acesa", `${MODO}: Front-end acende Sites`);
await tocar(pagina.getByRole("button", { name: /Apagar a lente/ }));

// ---------------------------------------------------------------- insígnias (painel)
await itemDaBarra("Abrir o painel Insígnias");
await pagina.locator("[data-painel-insignias]").waitFor();
conferir((await pagina.locator("[data-insignia-tema]").count()) === 12, `${MODO}: uma insígnia por tema`);
conferir((await pagina.locator('[data-insignia-tema="interfaces"] [data-marco="25"]').getAttribute("data-atingido")) === "nao", `${MODO}: do zero, nenhum marco aceso`);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Fechar" }));

// ---------------------------------------------------------------- glossário
await itemDaBarra("Glossário");
await pagina.locator("[data-tela=glossario]").waitFor();
const total = Number(await pagina.locator("[data-glossario-contagem]").getAttribute("data-glossario-contagem"));
conferir(total >= 60, `${MODO}: o glossário tem todos os conceitos (${total})`);
await pagina.getByRole("searchbox", { name: "Buscar no glossário" }).fill("ARRAY");
const listaBilingue = pagina.locator('[data-verbete="array-js"]');
await listaBilingue.waitFor();
conferir((await listaBilingue.textContent()).includes("Lista de valores"), `${MODO}: array encontra a lista pelo inglês`);
conferir((await listaBilingue.locator('[data-termo-ingles] [lang="en"]').textContent()) === "array", `${MODO}: verbete exibe o termo inglês junto do nome`);
await pagina.getByRole("searchbox", { name: "Buscar no glossário" }).fill("MÁRGIN");
await pagina.locator('[data-verbete="margin-css"]').waitFor();
conferir((await pagina.locator("[data-verbete]").count()) < total, `${MODO}: a busca ignora acento e maiúscula`);
const verbete = pagina.locator('[data-verbete="margin-css"]');
const trancada = verbete.locator('[data-liberada="nao"] a').first();
conferir((await trancada.textContent()).includes("Você chega lá na Ilha Sites"), `${MODO}: fase trancada avisa onde fica`);
conferir((await trancada.getAttribute("href")) === "/ilha/sites#sites-estilos-u3", `${MODO}: e leva ao ponto da unidade`);
await tocar(trancada);
await pagina.locator('[data-card-unidade="sites-estilos-u3"]').waitFor();
conferir(true, `${MODO}: a ilha abre com o card da unidade`);
await navegador.close();

// ---------------------------------------------------------------- glossário dentro da fase e fase liberada
{
  const fases = PUBLICADAS["sites-elementos-u1"];
  const { navegador: nav, pagina: pag, erros: errosFase } = await abrir({
    ...TAMANHOS[MODO],
    progresso: {
      versao: 2,
      fasesConcluidas: fases,
      faseAtual: "sites-elementos-u2-f1",
      apresentacoesVistas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia", "trilha"],
      metasVistas: ["sites-elementos-u1", "sites-elementos-u2"],
    },
  });
  await pag.locator("[data-jogo-fase]").waitFor();
  await esperarPronto(pag);
  if (movel) {
    await fecharBalao(pag);
    await pag.getByRole("button", { name: "Mais opções" }).tap();
    await pag.getByRole("link", { name: "Glossário" }).tap();
  } else {
    await pag.getByRole("link", { name: "Glossário" }).click();
  }
  await pag.locator("[data-tela=glossario]").waitFor();
  const liberada = pag.locator('[data-verbete="elemento"] [data-liberada="sim"] a').first();
  conferir((await liberada.getAttribute("href")).startsWith("/fase/sites-elementos-u1"), `${MODO}: fase liberada leva direto à fase`);
  await (toque ? pag.getByRole("button", { name: "Voltar" }).tap() : pag.getByRole("button", { name: "Voltar" }).click());
  await pag.locator('[data-jogo-fase="sites-elementos-u2-f1"]').waitFor();
  conferir(true, `${MODO}: Voltar do glossário traz de volta à fase`);
  conferir(errosRelevantes(errosFase).length === 0, `${MODO}: console limpo na fase ${JSON.stringify(errosRelevantes(errosFase))}`);
  await nav.close();
}

// ---------------------------------------------------------------- comemoração de insígnia
{
  const fases = SITES_CONCLUIDAS.flatMap((id) => PUBLICADAS[id]);
  const { navegador: nav, pagina: pag, erros: errosInsignia } = await abrir({
    ...TAMANHOS[MODO],
    progresso: { versao: 2, mapaDesbloqueado: false, fasesConcluidas: fases, unidadesComemoradas: SITES_CONCLUIDAS },
    rota: "/",
    esperar: "[data-mapa=mundo]",
  });
  const festa = pag.locator("[data-comemoracao-insignia]");
  await festa.waitFor({ timeout: 8000 });
  conferir(true, `${MODO}: marco novo de insígnia comemora (${await festa.getAttribute("data-comemoracao-insignia")})`);
  const marcos = await pag.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")).marcosInsignias);
  conferir((marcos.interfaces ?? 0) >= 25, `${MODO}: o marco fica salvo (${JSON.stringify(marcos)})`);
  await pag.reload();
  await pag.locator("[data-mapa=mundo]").waitFor();
  await pag.waitForTimeout(3000);
  conferir((await festa.count()) === 0, `${MODO}: o mesmo marco não comemora de novo`);
  conferir(errosRelevantes(errosInsignia).length === 0, `${MODO}: console limpo nas insígnias ${JSON.stringify(errosRelevantes(errosInsignia))}`);
  await nav.close();
}

conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
