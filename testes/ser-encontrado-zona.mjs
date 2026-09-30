// A zona opcional "Ser encontrado" pelo mapa, unidade a unidade (S2 a S5):
// como um jogador que acabou o resto da Ilha Sites e as unidades anteriores
// da zona, entra pelo mapa (mundo -> ilha -> card -> Jogar), passa a meta,
// as apresentações novas e joga cada fase do começo ao fim (previsões, o
// Me ajuda até a solução, o editor de código, as ferramentas da unidade), o
// desafio (checklist) e a volta pra ilha, com o ponto da unidade concluído.
// Os passos de cada unidade ficam na tabela PASSOS (um objeto por objetivo).
// Uso: node testes/ser-encontrado-zona.mjs [desktop|retrato|paisagem] [unidade]
//   (sem unidade: todas as que a tabela conhece)
import { readFileSync } from "node:fs";
import { obrigatoriasProntasDaIlha, PUBLICADAS, unidadesDaIlha } from "./curriculo.mjs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, passarApresentacao, pularMeta } from "./util.mjs";
import { PASSOS } from "./ser-encontrado-passos.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";
const UNIDADES = process.argv[3] ? [process.argv[3]] : Object.keys(PASSOS).filter((id) => Object.hasOwn(PUBLICADAS, id));
const IDS_FERRAMENTAS = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);

const zona = unidadesDaIlha("sites").filter((unidade) => unidade.zona.id === "ser-encontrado");

for (const unidadeId of UNIDADES) await jogarUnidade(unidadeId);

async function jogarUnidade(unidadeId) {
  const roteiro = PASSOS[unidadeId];
  const anteriores = zona.slice(0, zona.findIndex((unidade) => unidade.id === unidadeId)).map((unidade) => unidade.id);
  const feitas = [...obrigatoriasProntasDaIlha("sites").map((unidade) => unidade.id), ...anteriores];
  const novas = roteiro.ferramentasNovas ?? [];
  const progresso = {
    versao: 2,
    fasesConcluidas: feitas.flatMap((id) => PUBLICADAS[id]),
    estrelasPorFase: {},
    fasesEmAndamento: {},
    faseAtual: null,
    tema: "doce",
    temasDesbloqueados: ["doce", "fliperama"],
    som: false,
    missoesDeCampo: {},
    apresentacoesVistas: IDS_FERRAMENTAS.filter((id) => !novas.includes(id)),
    metasVistas: feitas,
    unidadesComemoradas: feitas,
    ilhasComemoradas: ["sites"],
    posicaoNoMapa: {},
    mapaDesbloqueado: false,
    proporcaoPrevia: 0.4,
  };
  const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/", esperar: "[data-mapa=mundo]" });
  const assentar = () => esperarPronto(pagina);
  const tocar = async (localizador) => {
    await localizador.scrollIntoViewIfNeeded();
    if (toque) await localizador.tap();
    else await localizador.click();
  };
  const falhar = async (nome, erro) => {
    await pagina.screenshot({ path: `testes-falha-zona-${MODO}-${unidadeId}-${nome}.png` }).catch(() => {});
    throw erro;
  };
  const botaoConversa = async (nome) => {
    if (movel) await abrirBalao(pagina);
    else await assentar();
    const botao = pagina.getByRole("button", { name: nome }).first();
    await botao.waitFor({ timeout: 8000 });
    await tocar(botao);
    await assentar();
  };
  const introducao = async () => {
    for (let i = 0; i < 6; i++) {
      if ((await pagina.locator("[data-previsao]").count()) > 0) return;
      if (movel) await abrirBalao(pagina);
      const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
      if (!(await botao.isVisible().catch(() => false))) return;
      await tocar(botao);
      await assentar();
    }
  };
  const esperarObjetivo = (id) =>
    pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 8000 });
  const aba = async (nome) => {
    if (movel) await fecharBalao(pagina);
    await tocar(pagina.getByRole("tab", { name: nome, exact: true }));
    await assentar();
  };
  /** Troca um trecho do código no editor (no celular, o segmento Código). */
  const trocarNoEditor = async (de, para) => {
    await aba("Elementos");
    if (movel) {
      const codigo = pagina.getByRole("tab", { name: "Código", exact: true });
      if ((await codigo.getAttribute("aria-selected")) !== "true") await tocar(codigo);
      await assentar();
    }
    const conteudo = pagina.locator(".cm-content").first();
    // O texto inteiro do documento (o DOM do CodeMirror só desenha as linhas visíveis).
    const texto = await conteudo.evaluate((no) => no.cmTile?.view?.state.doc.toString() ?? no.innerText);
    // O editor recua o conteúdo do head: o trecho a trocar aceita espaços no começo de cada linha.
    const escapar = (trecho) => trecho.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const padrao = new RegExp(de.split("\n").map(escapar).join("\\n\\s*"));
    if (!padrao.test(texto)) await falhar("editor", new Error(`Falhou: o editor não tem "${de}"`));
    await conteudo.click();
    await pagina.keyboard.press("ControlOrMeta+A");
    await pagina.keyboard.insertText(texto.replace(padrao, () => para));
    await assentar();
  };
  const contexto = { pagina, tocar, assentar, aba, trocarNoEditor, botaoConversa, abrirBalao: () => (movel ? abrirBalao(pagina) : assentar()), fecharBalao: () => (movel ? fecharBalao(pagina) : assentar()), movel, toque, MODO, falhar, conferir, passarApresentacao };

  // ---------------------------------------------------------------- o mapa
  await tocar(pagina.locator("[data-ilha=sites]"));
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await assentar();
  const ponto = pagina.locator(`[data-unidade="${unidadeId}"]`);
  const estadoNoMapa = await ponto.getAttribute("data-estado");
  conferir(estadoNoMapa === "disponivel" || estadoNoMapa === "atual", `${MODO} ${unidadeId}: aberta no mapa (estado: ${estadoNoMapa})`);
  await tocar(ponto);
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar", exact: true }));
  await pagina.locator(`[data-jogo-fase="${unidadeId}-f1"]`).waitFor();
  await assentar();

  // ---------------------------------------------------------------- as fases
  const fases = PUBLICADAS[unidadeId];
  for (const [indice, faseId] of fases.entries()) {
    const ultima = indice === fases.length - 1;
    const rotulo = `${MODO} ${faseId.replace("sites-ser-encontrado-", "")}`;
    if (indice > 0) await pagina.locator(`[data-jogo-fase="${faseId}"]`).waitFor({ timeout: 10000 });
    if (indice === 0 || ultima) conferir(await pularMeta(pagina), `${rotulo}: abre com a meta`);
    await introducao();
    const roteiroDaFase = roteiro.fases[indice];
    if (!Array.isArray(roteiroDaFase)) {
      // Desafio: as partes marcam ao vivo; ao fim, "Ver resultado".
      for (const passo of roteiroDaFase.desafio) {
        if (passo.editar) for (const [de, para] of passo.editar) await trocarNoEditor(de, para);
        else if (passo.fazer) await passo.fazer(contexto);
      }
      try {
        await botaoConversa("Ver resultado");
      } catch (erro) {
        await falhar(`${faseId}-desafio`, erro);
      }
      conferir(true, `${rotulo}: as partes do desafio marcam e ele conclui`);
    }
    for (const objetivo of Array.isArray(roteiroDaFase) ? roteiroDaFase : []) {
      await esperarObjetivo(objetivo.id);
      for (const passo of objetivo.passos) {
        if (passo.previsao !== undefined) {
          if (movel) await abrirBalao(pagina);
          await pagina.locator("[data-previsao]").waitFor();
          await tocar(pagina.locator("[data-previsao] button").nth(passo.previsao));
          await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
          await assentar();
        } else if (passo.editar) {
          for (const [de, para] of passo.editar) await trocarNoEditor(de, para);
        } else if (passo.ajuda) {
          // O Me ajuda até a solução (degrau 4): faz o que o objetivo pede.
          for (let degrau = 0; degrau < 4; degrau++) {
            if (movel) await abrirBalao(pagina);
            const proximo = pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first();
            if (await proximo.isVisible().catch(() => false)) break;
            const ajuda = pagina.getByRole("button", { name: /^Me ajuda/ }).first();
            await tocar(ajuda);
            await assentar();
            const confirmar = pagina.getByRole("button", { name: "Sim, mostrar a solução" });
            if (await confirmar.isVisible().catch(() => false)) {
              await tocar(confirmar);
              await assentar();
              break;
            }
          }
        } else if (passo.fazer) {
          await passo.fazer(contexto);
        }
      }
      if (movel) await abrirBalao(pagina);
      try {
        await pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first().waitFor({ timeout: 10000 });
      } catch (erro) {
        await falhar(`${faseId}-${objetivo.id}`, erro);
      }
      conferir(true, `${rotulo}: objetivo ${objetivo.id} concluído`);
      await botaoConversa(/Próximo objetivo|Ver resultado/);
    }
    // A conclusão da fase (as falas finais, a missão de campo, a próxima fase).
    await pagina.locator("[data-conclusao]").waitFor({ timeout: 10000 });
    for (let i = 0; i < 4; i++) {
      const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
      if (!(await continuar.isVisible().catch(() => false))) break;
      await tocar(continuar);
      await assentar();
    }
    if (ultima) {
      conferir((await pagina.getByRole("button", { name: "Próxima fase" }).count()) === 0, `${rotulo}: depois do desafio não tem Próxima fase`);
      await tocar(pagina.getByRole("button", { name: "Voltar pra ilha" }));
      await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
      await assentar();
      conferir((await pagina.locator(`[data-unidade="${unidadeId}"]`).getAttribute("data-estado")) === "concluida", `${MODO} ${unidadeId}: concluída no mapa`);
    } else {
      await tocar(pagina.getByRole("button", { name: "Próxima fase" }));
    }
  }
  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} ${unidadeId}: console limpo${relevantes.length ? `: ${relevantes.join(" | ")}` : ""}`);
  await navegador.close();
}
