// O Museu das Origens (rodada 36), nos três layouts: o corredor de épocas
// (as silhuetas acordam conforme o aluno chega perto, as portas das salas),
// as salas 1 e 2 jogadas de verdade pela interface, a partir da porta no
// corredor (as soluções vêm dos dados reais das fases), e a árvore da
// família: terminando a sala 2, o lugar da próxima geração abre, o aluno
// monta o retrato e a família inteira dá as boas-vindas.
// Uso: node testes/museu.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao, passarApresentacao, pularMeta } from "./util.mjs";
import { faseDoConteudo } from "./previsoes.mjs";
import { PUBLICADAS } from "./curriculo.mjs";

const modo = process.argv[2] ?? "desktop";
const [largura, altura] = { desktop: [1440, 900], retrato: [390, 844], paisagem: [844, 390] }[modo];
const toque = modo !== "desktop";
const SALAS = ["origens-museu-u1", "origens-museu-u2"];
const progresso = {
  versao: 2, fasesConcluidas: [], estrelasPorFase: {}, fasesEmAndamento: {}, faseAtual: null, tema: "doce", temasDesbloqueados: ["doce", "fliperama"],
  som: false, missoesDeCampo: {}, apresentacoesVistas: [], metasVistas: [], unidadesComemoradas: [], posicaoNoMapa: {}, mapaDesbloqueado: false, proporcaoPrevia: 0.4,
};
const { navegador, pagina, erros } = await abrir({ largura, altura, toque, progresso, rota: "/ilha/origens", esperar: "[data-trilho-museu]" });
const pronto = () => esperarPronto(pagina, 30000);
async function tocar(el) {
  await el.scrollIntoViewIfNeeded();
  await (toque ? el.tap() : el.click());
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
conferir((await pagina.locator('[data-porta-sala="origens-museu-u3"]').getAttribute("data-estado-sala")) === "planejada", `${modo}: a sala 3 diz Em breve`);
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
  } else throw new Error(`Ação sem UI: ${a.tipo}`);
}
async function conversa(nome) {
  if (toque) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 15000 });
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

conferir(errosRelevantes(erros).length === 0, `${modo}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
// O motion avisa no console que o aparelho pediu menos movimento: isso é esperado aqui, depois da conferência do console.
// ---------------------------------------------------------------- menos movimento
await pagina.emulateMedia({ reducedMotion: "reduce" });
await pagina.reload();
await pagina.locator('[data-epoca="tecela"]').scrollIntoViewIfNeeded();
await pagina.locator('[data-epoca="tecela"] [data-fala-completa="sim"]').waitFor({ timeout: 5000 });
conferir(true, `${modo}: com menos movimento, eles acordam e a fala aparece inteira de uma vez`);

await navegador.close();
