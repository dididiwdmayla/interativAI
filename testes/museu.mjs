// O Museu das Origens (rodadas 36 e 38), nos três layouts: o corredor de
// épocas (as silhuetas acordam conforme o aluno chega perto, as portas das
// salas), as seis salas jogadas de verdade pela interface, a partir da
// porta no corredor (as soluções vêm dos dados reais das fases: o
// comparador roda JavaScript e o Python de verdade, no Pyodide servido pelo
// jogo; o coral canta; os cabos do gigante, os portões, as simulações), a
// árvore da família (terminando a sala 2, o aluno monta o retrato e entra
// para a família) e, com as seis salas, a insígnia da história no retrato.
// Uso: node testes/museu.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao, passarApresentacao, pularMeta } from "./util.mjs";
import { faseDoConteudo } from "./previsoes.mjs";
import { PUBLICADAS } from "./curriculo.mjs";

const modo = process.argv[2] ?? "desktop";
const [largura, altura] = { desktop: [1440, 900], retrato: [390, 844], paisagem: [844, 390] }[modo];
const toque = modo !== "desktop";
const SALAS = ["origens-museu-u1", "origens-museu-u2", "origens-museu-u3", "origens-museu-u4", "origens-museu-u5", "origens-museu-u6"];
const progresso = {
  versao: 2, fasesConcluidas: [], estrelasPorFase: {}, fasesEmAndamento: {}, faseAtual: null, tema: "doce", temasDesbloqueados: ["doce", "fliperama"],
  som: false, missoesDeCampo: {}, apresentacoesVistas: [], metasVistas: [], unidadesComemoradas: [], posicaoNoMapa: {}, mapaDesbloqueado: false, proporcaoPrevia: 0.4,
};
const { navegador, contexto, pagina, erros } = await abrir({ largura, altura, toque, progresso, rota: "/ilha/origens", esperar: "[data-trilho-museu]" });
const cdpToque = toque ? await contexto.newCDPSession(pagina) : null;
if (cdpToque) await cdpToque.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 2 });
const pronto = () => esperarPronto(pagina, 30000);
async function tocar(el) {
  await el.scrollIntoViewIfNeeded();
  await (toque ? el.tap() : el.click());
  await pronto();
}
/**
 * Uma peça da bancada de portões, no toque: como em circuito.mjs, o jogador amplia (150%) e arrasta o
 * enquadramento com dois dedos até a peça, e toca nela (na posição dada, ou no meio).
 */
async function tocarNaBancada(estacao, el, posicao) {
  if (!toque) return tocar(el);
  await fecharBalao(pagina);
  await el.scrollIntoViewIfNeeded();
  const area = estacao.getByRole("application", { name: "Bancada do circuito" });
  while (parseInt(await estacao.locator("[data-zoom-circuito]").innerText()) < 150) {
    await estacao.getByRole("button", { name: "Aumentar zoom do circuito" }).tap();
    await pronto();
  }
  for (let i = 0; i < 20; i++) {
    const a = await area.boundingBox();
    const caixa = await el.boundingBox();
    const x = caixa.x + (posicao?.x ?? 0.5) * caixa.width;
    const y = caixa.y + (posicao?.y ?? 0.5) * caixa.height;
    if (x > a.x + 25 && x < a.x + a.width - 25 && y > a.y + 25 && y < a.y + a.height - 25) {
      await pagina.touchscreen.tap(x, y);
      break;
    }
    const mx = a.x + a.width / 2, my = a.y + a.height / 2;
    const dx = Math.max(-a.width / 4, Math.min(a.width / 4, mx - x));
    const dy = Math.max(-a.height / 4, Math.min(a.height / 4, my - y));
    const dedos = [{ x: mx - 20, y: my, id: 1 }, { x: mx + 20, y: my, id: 2 }];
    await cdpToque.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: dedos });
    await cdpToque.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: dedos.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy })) });
    await cdpToque.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await pronto();
  }
  await pronto();
}

// ---------------------------------------------------------------- o corredor
conferir((await pagina.locator("[data-epoca]").count()) === 8, `${modo}: o corredor tem as oito épocas`);
conferir((await pagina.locator('[data-epoca="celular"]').getAttribute("data-acordado")) === "nao", `${modo}: lá no fim, o celular ainda dorme (silhueta)`);
for (const id of ["tecela", "engrenagens", "valvulas", "terminal", "pc", "internet", "celular", "computadorzinho"]) {
  await pagina.locator(`[data-epoca="${id}"]`).scrollIntoViewIfNeeded();
  await pagina.locator(`[data-epoca="${id}"][data-acordado="sim"]`).waitFor({ timeout: 8000 });
}
conferir(true, `${modo}: chegando perto, cada antepassado acorda`);
await pagina.locator('[data-fala-antepassado="terminal"][data-fala-completa="sim"]').waitFor({ timeout: 15000 });
const terminal = await pagina.locator('[data-epoca="terminal"] [data-texto-antepassado]').textContent();
conferir(terminal === terminal.toUpperCase() && !/[ÁÃÉÊÍÓÕÚÇ]/.test(terminal), `${modo}: o terminal fala em maiúsculas, sem acento ("${terminal.slice(0, 30)}...")`);
conferir((await pagina.locator('[data-estado-sala="planejada"]').count()) === 0, `${modo}: nenhuma sala diz Em breve (as seis têm conteúdo)`);
conferir((await pagina.locator('[data-porta-sala="origens-museu-u3"] [data-entrar-sala]').count()) === 0, `${modo}: a sala 3 começa trancada`);
conferir((await pagina.locator('[data-porta-sala="origens-museu-u2"] [data-entrar-sala]').count()) === 0, `${modo}: a sala 2 começa trancada`);
conferir((await pagina.locator("[data-arvore]").getAttribute("data-proxima-geracao")) === "vazia", `${modo}: o lugar da próxima geração está vazio e fechado`);

// ---------------------------------------------------------------- jogar uma fase pela interface
async function abrirEstacao(id) {
  if (toque) await fecharBalao(pagina);
  const aba = pagina.locator(`[data-aba-estacao="${id}"]`);
  if ((await aba.count()) && (await aba.getAttribute("aria-selected")) !== "true") await tocar(aba);
}
async function acao(a) {
  if (a.tipo === "responderPrevisao") {
    if (toque) await abrirBalao(pagina);
    await tocar(await opcaoDaPrevisao(pagina));
    return;
  }
  await abrirEstacao(a.estacao);
  const estacao = pagina.locator(`[data-estacao="${a.estacao}"]`);
  if (a.tipo === "furarCartao") {
    const furo = estacao.locator(`[data-furo="${a.linha}-${a.coluna}"]`);
    if (a.furado !== undefined && ((await furo.getAttribute("data-furado")) === "sim") === a.furado) return;
    await tocar(furo);
  } else if (a.tipo === "alternarBit") {
    const bit = estacao.locator(`[data-bit="${a.indice}"]`);
    if (a.ligado !== undefined && ((await bit.getAttribute("data-aceso")) === "sim") === a.ligado) return;
    await tocar(bit);
  } else if (a.tipo === "descerCamada") await tocar(estacao.locator("[data-descer-camada]"));
  else if (a.tipo === "escolherLinha") await tocar(estacao.locator(`[data-linha-camada="${a.linha}"]`));
  else if (a.tipo === "definirCor") {
    const alvo = a.valor.toLowerCase().replace("#", "");
    for (let posicao = 0; posicao < 6; posicao++) {
      const agora = parseInt((await estacao.locator(`[data-digito="${posicao}"]`).textContent()).trim(), 16);
      const subir = (parseInt(alvo[posicao], 16) - agora + 16) % 16;
      const botao = subir <= 8 ? estacao.locator(`[data-subir-digito="${posicao}"]`) : estacao.locator(`[data-descer-digito="${posicao}"]`);
      for (let i = 0; i < (subir <= 8 ? subir : 16 - subir); i++) await tocar(botao);
    }
  } else if (a.tipo === "porNaLinha") {
    await tocar(estacao.locator(`[data-cartao-caixa="${a.evento}"]`));
    const naLinha = await estacao.locator("[data-cartao-linha]").count();
    const lugar = a.posicao === undefined || a.posicao >= naLinha ? "fim" : String(a.posicao);
    await tocar(estacao.locator(`[data-por-aqui="${lugar}"]`));
  } else if (a.tipo === "pendurarPlaquinha") {
    await tocar(estacao.locator(`[data-plaquinha="${a.plaquinha}"]`));
    await tocar(estacao.locator(`[data-pendurar-em="${a.evento}"]`));
  } else if (a.tipo === "rodarLinguagem") {
    // O Python baixa e acorda na primeira vez: a barra de carga aparece, e a saída chega depois.
    await tocar(estacao.locator(`[data-rodar="${a.linguagem}"]`));
    await estacao.locator(`[data-saida-linguagem="${a.linguagem}"][data-pronta="sim"]`).waitFor({ timeout: 120000 });
    await pronto();
  } else if (a.tipo === "cantarCoral") {
    await tocar(estacao.locator("[data-cantar-coral]"));
    await estacao.locator('[data-coral-terminou="sim"]').waitFor({ timeout: 120000 });
    await pronto();
  } else if (a.tipo === "tocarParte") {
    const editor = estacao.locator(`[data-editor-linguagem="${a.linguagem}"]`);
    if (await editor.count()) await tocar(estacao.locator(`[data-editar-linguagem="${a.linguagem}"]`));
    await tocar(estacao.locator(`[data-programa-linguagem="${a.linguagem}"] [data-parte="${a.parte}"]`).first());
  } else if (a.tipo === "escreverNaLinguagem") {
    const editor = estacao.locator(`[data-editor-linguagem="${a.linguagem}"]`);
    if (!(await editor.count())) await tocar(estacao.locator(`[data-editar-linguagem="${a.linguagem}"]`));
    await editor.fill(a.codigo);
    await pronto();
  } else if (a.tipo === "ligarCartao") {
    await tocar(estacao.locator(`[data-cartao-ligar="${a.cartao}"]`));
    await tocar(estacao.locator(`[data-alvo-ligar="${a.alvo}"]`));
  } else if (a.tipo === "porNaOrdem") {
    await tocar(estacao.locator(`[data-item-caixa="${a.item}"]`));
    const naFila = await estacao.locator("[data-item-fila]").count();
    await tocar(estacao.locator(`[data-por-na-ordem="${a.posicao ?? naFila}"]`));
  } else if (a.tipo === "mexerNoCircuito") {
    const m = a.mudanca;
    const cabos = (await estacao.locator("[data-estacao-circuito]").getAttribute("data-aparencia")) === "cabos";
    if (m.tipo === "portao") await tocar(estacao.locator(`[data-portao-paleta="${m.portao}"]`));
    else if (m.tipo === "fio" && cabos) {
      await tocar(estacao.locator(`[data-tomada-saida="${m.de}"]`));
      await tocar(estacao.locator(`[data-tomada-entrada="${m.para}:${m.porta ?? 0}"]`));
    } else if (m.tipo === "fio") {
      await tocarNaBancada(estacao, estacao.locator(`[data-porta-saida="${m.de}"]`));
      // No toque, o dedo vai perto da porta, sobre o corpo: quem recebe é a área ampliada da porta.
      if (toque) await tocarNaBancada(estacao, estacao.locator(`[data-corpo-peca="${m.para}"]`), { x: 0.35, y: (m.porta ?? 0) === 0 ? 0.25 : 0.75 });
      else await tocar(estacao.locator(`[data-porta-entrada="${m.para}:${m.porta ?? 0}"]`));
    } else if (m.tipo === "chave" && cabos) {
      const chave = estacao.locator(`[data-chave="${m.entrada}"]`);
      if (m.ligada === undefined || ((await chave.getAttribute("data-ligada")) === "sim") !== m.ligada) await tocar(chave);
    } else if (m.tipo === "chave") {
      const peca = estacao.locator(`[data-peca="${m.entrada}"]`);
      if (m.ligada === undefined || ((await peca.getAttribute("data-acesa")) === "sim") !== m.ligada) await tocarNaBancada(estacao, estacao.locator(`[data-corpo-peca="${m.entrada}"]`));
    } else throw new Error(`Mudança de circuito sem UI: ${m.tipo}`);
  } else if (a.tipo === "comandoNaEstacao") {
    const [verbo, resto] = a.comando.includes(":") ? [a.comando.slice(0, a.comando.indexOf(":")), a.comando.slice(a.comando.indexOf(":") + 1)] : [a.comando, ""];
    const memoria = await estacao.locator("[data-estacao-memoria]").count();
    if (memoria && verbo === "guardar") {
      const [onde, valor] = resto.split("=");
      await tocar(estacao.locator(`[data-ficha="${valor}"]`));
      await tocar(estacao.locator(`[data-caixa="${onde}"]`));
    } else if (memoria && verbo === "escolher") await tocar(estacao.locator(`[data-caixa="${resto}"]`));
    else await tocar(estacao.locator(`[data-comando="${a.comando}"]`).first());
  } else throw new Error(`Ação sem UI: ${a.tipo}`);
}
async function conversa(nome) {
  if (toque) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 15000 }).catch(async (erro) => {
    await pagina.screenshot({ path: `testes-falha-museu-${modo}.png` });
    throw erro;
  });
  await tocar(botao);
}
async function introducao() {
  for (let i = 0; i < 8; i++) {
    // A apresentação da ferramenta começa logo depois da introdução: quem passa por ela é o objetivo.
    if (await pagina.locator("[data-apresentacao]").isVisible().catch(() => false)) return;
    if (toque) await abrirBalao(pagina);
    const b = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await b.isVisible().catch(() => false))) return;
    await tocar(b);
  }
}
async function conclusao(fase, botao) {
  if (!(await pagina.locator("[data-conclusao]").isVisible().catch(() => false))) await conversa(/^Ver resultado$/);
  await pagina.locator("[data-conclusao]").waitFor();
  await pagina.waitForSelector('[data-modal-assentado="sim"]');
  for (let i = 0; i < fase.conclusao.length; i++) {
    const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
  }
  await tocar(pagina.getByRole("button", { name: botao, exact: true }));
}
async function jogarFase(id, ultima) {
  const fase = faseDoConteudo(id);
  await pagina.locator(`[data-jogo-fase="${id}"]`).waitFor({ timeout: 30000 });
  await pronto();
  conferir((await pagina.locator("[data-sala-exposicao]").getAttribute("data-anfitriao")) === fase.exposicao.anfitriao, `${modo} ${id}: a sala recebe com ${fase.exposicao.anfitriao}`);
  if (await pularMeta(pagina, 1500)) conferir(true, `${modo} ${id}: a meta da sala aparece (antes e depois)`);
  await introducao();
  if (fase.tipo === "desafio") {
    for (const parte of fase.partes) for (const a of parte.solucaoDeTeste) await acao(a);
  } else {
    for (const [i, objetivo] of fase.objetivos.entries()) {
      await pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, objetivo.id, { timeout: 20000 });
      // A apresentação da ferramenta nova: o Experimente é o primeiro gesto da solução (depois do palpite).
      let apresentar = [...(objetivo.apresentar ?? [])];
      for (const a of objetivo.solucaoDeTeste) {
        if (apresentar.length && a.tipo !== "responderPrevisao") {
          const ferramenta = apresentar.shift();
          if (toque) await fecharBalao(pagina);
          apresentar = [];
          // Ferramenta já apresentada antes não aparece de novo.
          const camada = pagina.locator(`[data-apresentacao="${ferramenta}"]`);
          if (await camada.waitFor({ timeout: 4000 }).then(() => true, () => false)) {
            await passarApresentacao(pagina, ferramenta, () => acao(a));
            continue;
          }
        }
        await acao(a);
      }
      if (i < fase.objetivos.length - 1) await conversa("Próximo objetivo");
    }
  }
  await conclusao(fase, ultima ? "Voltar pra ilha" : "Próxima fase");
  conferir(true, `${modo} ${id}: jogada pela interface até a conclusão`);
}

// ---------------------------------------------------------------- as salas 1 e 2, pela porta do corredor
for (const sala of SALAS) {
  const porta = pagina.locator(`[data-porta-sala="${sala}"] [data-entrar-sala]`);
  await porta.waitFor({ timeout: 15000 });
  await tocar(porta);
  const fases = PUBLICADAS[sala] ?? [];
  conferir(fases.length > 0, `${modo} ${sala}: publicada, com ${fases.length} fases`);
  for (const [i, id] of fases.entries()) await jogarFase(id, i === fases.length - 1);
  await pagina.locator("[data-trilho-museu]").waitFor();
  conferir((await pagina.locator(`[data-porta-sala="${sala}"]`).getAttribute("data-estado-sala")) === "concluida", `${modo} ${sala}: concluída no corredor`);
}

// ---------------------------------------------------------------- a próxima geração
await pagina.locator('[data-arvore][data-proxima-geracao="aberta"]').waitFor({ timeout: 10000 });
conferir(true, `${modo}: com a sala 2 concluída, o lugar da próxima geração abre`);
await tocar(pagina.locator("[data-ocupar-lugar]"));
await pagina.locator("[data-criador-retrato]").waitFor();
await pagina.waitForSelector('[data-modal-assentado="sim"]');
await tocar(pagina.locator('[data-opcao-retrato="Cabelo:longo"]'));
await pagina.locator("[data-nome-retrato]").fill("Ada");
await tocar(pagina.locator("[data-confirmar-retrato]"));
await pagina.locator('[data-arvore][data-proxima-geracao="ocupada"]').waitFor();
conferir((await pagina.locator("[data-placa-proxima-geracao]").textContent()).includes("Ada"), `${modo}: a placa da próxima geração tem o nome do aluno`);
await pagina.locator('[data-boas-vindas="computadorzinho"]').waitFor({ timeout: 20000 });
conferir((await pagina.locator("[data-boas-vindas]").count()) === 8, `${modo}: a família inteira deu as boas-vindas`);
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2") ?? "{}").proximaGeracao);
conferir(salvo?.nome === "Ada" && salvo?.aparencia?.cabelo === "longo", `${modo}: o retrato fica salvo no progresso`);
await pagina.reload();
await pagina.locator('[data-arvore][data-proxima-geracao="ocupada"]').waitFor();
conferir(true, `${modo}: voltando ao museu, o aluno continua na árvore`);

// ---------------------------------------------------------------- a insígnia da história (as seis salas)
await pagina.locator('[data-arvore][data-museu-completo="sim"] [data-insignia-museu]').waitFor({ timeout: 15000 });
conferir((await pagina.locator("[data-placa-insignia]").textContent()).includes("história"), `${modo}: com as seis salas, o retrato ganha a insígnia da história`);
// A medalha aparece na hora; a revelação (e o registro no progresso) vem um pouco depois.
const viu = await pagina
  .waitForFunction(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2") ?? "{}").insigniaDoMuseu === true, null, { timeout: 20000 })
  .then(() => true, () => false);
conferir(viu === true, `${modo}: a revelação da insígnia fica guardada (toca uma vez só)`);

conferir(errosRelevantes(erros).length === 0, `${modo}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
// O motion avisa no console que o aparelho pediu menos movimento: isso é esperado aqui, depois da conferência do console.
// ---------------------------------------------------------------- menos movimento
await pagina.emulateMedia({ reducedMotion: "reduce" });
await pagina.reload();
await pagina.locator('[data-epoca="tecela"]').scrollIntoViewIfNeeded();
await pagina.locator('[data-epoca="tecela"] [data-fala-completa="sim"]').waitFor({ timeout: 5000 });
conferir(true, `${modo}: com menos movimento, eles acordam e a fala aparece inteira de uma vez`);

await navegador.close();
