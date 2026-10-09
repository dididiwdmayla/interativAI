// As tomadas do vídeo: o que cada uma faz no jogo, passo a passo. Cada função
// abre o jogo com o progresso certo, grava e devolve o take (ver lib/gravador.mjs).
// Regras: mouse sempre com moverSuave, digitação com ritmo de gente, nada de
// cursor injetado na página, e uma marca (t.marcar) em cada momento que o
// roteiro do vídeo usa.
import { readFileSync } from "node:fs";
import path from "node:path";
import { abrirTomada } from "./lib/gravador.mjs";
import { progressoDeQuemJogou, progressoNaFase, RAIZ, semAceno, util } from "./lib/jogo.mjs";

const { esperarPronto, continuarFalas, chaveDoSeletor, selecionarNo, opcaoDaPrevisao, fecharBalao, doisQuadros } = util;

/** Quem está no meio da Lógica: a Sites inteira, a Lógica quase toda e as duas primeiras salas do museu. */
const FALTA_NA_LOGICA = ["logica-depuracao-u5", "logica-depuracao-u6", "logica-programa-de-verdade-u1"];
const alunoNoMeio = (extra = {}) =>
  progressoDeQuemJogou(["origens", "sites", "logica"], { faseAtual: "logica-depuracao-u5-f1", ...extra }, { menos: [...FALTA_NA_LOGICA, "origens-museu-u3", "origens-museu-u4", "origens-museu-u5", "origens-museu-u6"] });

/** As soluções do contrato da padaria, as mesmas que a jornada dos testes usa. */
const CONTRATO = JSON.parse(readFileSync(path.join(RAIZ, "testes", "contrato-jornadas.json"), "utf8")).contrato;
const CODIGO_DA_VITRINE = CONTRATO.partes.find((parte) => parte.id === "contador").solucaoDeTeste.find((acao) => acao.tipo === "definirSnippet").codigo;
/**
 * A mesma solução, com as promoções do letreiro sem o preço ("SONHO" no lugar de "SONHO R$ 4"): os curtos
 * não podem mostrar "R$" em quadro nenhum. É código que o aluno escreveria igual; só o texto do letreiro muda.
 */
const CODIGO_DA_VITRINE_SEM_PRECO = CODIGO_DA_VITRINE.replace(/ R\$ \d+/g, "");
if (/R\$/.test(CODIGO_DA_VITRINE_SEM_PRECO) || CODIGO_DA_VITRINE_SEM_PRECO === CODIGO_DA_VITRINE) throw new Error("as promoções da vitrine mudaram de formato: confira o CODIGO_DA_VITRINE_SEM_PRECO");
/** O contrato já na etapa de trabalho, com a lista de requisitos certa (a que a jornada dos testes monta). */
const CONTRATO_NO_TRABALHO = { contrato: { etapa: "trabalho", escolha: CONTRATO.escolha, tentativas: 0, mudou: false, tempoMs: 0, entregue: false } };

const MUNDO = "[data-area-arrastavel]";

/** As caixas das etiquetas das ilhas (nome e estado), para o vídeo realçar. */
async function caixasDasIlhas(t) {
  const caixas = await t.pagina.evaluate(() =>
    [...document.querySelectorAll("[data-etiqueta-ilha]")].map((el) => {
      const etiqueta = el.getBoundingClientRect();
      const arte = document.querySelector(`[data-ilha-arte="${el.dataset.etiquetaIlha}"]`)?.getBoundingClientRect();
      return { ilha: el.dataset.etiquetaIlha, nome: el.querySelector("[data-nome-ilha]")?.textContent ?? el.textContent, x: Math.round(etiqueta.x), y: Math.round(etiqueta.y), l: Math.round(etiqueta.width), a: Math.round(etiqueta.height), arte: arte ? { x: Math.round(arte.x), y: Math.round(arte.y), l: Math.round(arte.width), a: Math.round(arte.height) } : null };
    }),
  );
  t.marcar("ilhas", { caixas });
  return caixas;
}

/** Passa as falas de entrada de uma fase (Continuar, Vamos lá!) até a conversa ficar livre. */
async function passarIntroducao(pagina, ate = null) {
  for (let i = 0; i < 8; i++) {
    if (ate && (await pagina.locator(ate).isVisible().catch(() => false))) return;
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) return;
    await botao.click();
    await esperarPronto(pagina);
  }
}

/** Responde a previsão aberta (a opção certa, pelos dados da fase), se houver uma. */
async function responderPrevisao(pagina) {
  if (!(await pagina.locator("[data-previsao]").first().isVisible().catch(() => false))) return false;
  await (await opcaoDaPrevisao(pagina)).click();
  await esperarPronto(pagina);
  return true;
}

/** Vigia, enquanto `promessa` não termina, os elementos que passam a casar com o seletor, e marca cada um uma vez. */
async function vigiar(t, promessa, seletor, atributo, nomeDaMarca) {
  const vistos = new Set();
  let acabou = false;
  promessa.finally(() => (acabou = true));
  while (!acabou) {
    const agora = await t.pagina.evaluate(([s, a]) => [...document.querySelectorAll(s)].map((el) => el.getAttribute(a)), [seletor, atributo]).catch(() => []);
    for (const id of agora) {
      if (!vistos.has(id)) {
        vistos.add(id);
        t.marcar(`${nomeDaMarca}:${id}`);
      }
    }
    await t.esperar(60);
  }
  await promessa;
}

/** O mundo de dia ou de noite, com o mesmo caminho e a mesma velocidade (T02 e T03). */
async function mundo(id, hora, descricao) {
  const t = await abrirTomada({ id, formato: "computador", descricao, progresso: alunoNoMeio(), rota: `/?hora=${hora}&baleia`, esperar: "[data-mapa=mundo]", armazenamento: semAceno() });
  const { pagina } = t;
  await pagina.locator("[data-mascote-no-mapa]").first().waitFor();
  await t.esperar(1800);
  await t.iniciar();
  await caixasDasIlhas(t);
  await t.caixa("mapa", pagina.locator(MUNDO));
  await t.esperar(3500);
  const largura = await pagina.evaluate((s) => { const el = document.querySelector(s); return el.scrollWidth - el.clientWidth; }, MUNDO);
  t.marcar("rolar", { dx: largura, ms: 8000 });
  await t.rolarSuave(MUNDO, { dx: largura, ms: 8000, linear: false });
  t.marcar("parou");
  await t.esperar(4000);
  return t.terminar({ periodo: await pagina.locator("[data-mundo-desenho]").getAttribute("data-periodo") });
}

/** A caixa, em px da página, de um elemento de dentro da prévia (o iframe do site-alvo). */
async function caixaNaPrevia(t, nome, seletor) {
  const moldura = t.pagina.locator("section[data-previa] iframe").first();
  const fora = await moldura.boundingBox();
  const dentro = await moldura.contentFrame().locator(seletor).first().boundingBox();
  if (!fora || !dentro) return null;
  // boundingBox de dentro do iframe já vem em coordenadas da página.
  t.marcar(`caixa:${nome}`, { x: Math.round(dentro.x), y: Math.round(dentro.y), l: Math.round(dentro.width), a: Math.round(dentro.height) });
  return dentro;
}

export const TOMADAS = {
  // T01: o gancho. Inspecionar a manchete na prévia, o nó acende na árvore, editar o texto, a prévia muda.
  async T01(formato = "perto") {
    const fase = "sites-elementos-u1-f1";
    const t = await abrirTomada({
      id: "T01-sites-u1",
      formato,
      descricao: "Inspecionar a manchete na prévia, o nó acende na árvore, editar o texto e a prévia muda",
      progresso: progressoNaFase(fase, [], { objetivoAtual: 2 }),
      rota: `/fase/${fase}`,
      esperar: "section[data-previa] iframe",
    });
    const { pagina } = t;
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    const chave = await chaveDoSeletor(pagina, "h1");
    const linha = pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first();
    const previa = pagina.locator("section[data-previa] iframe").first();
    const manchete = previa.contentFrame().locator("h1");
    await t.esperar(600);
    await t.iniciar();
    await t.caixa("painel", pagina.locator("[data-ferramenta='painel']").first());
    await t.caixa("previa", pagina.locator("section[data-previa]").first());
    await t.caixa("arvore", pagina.locator("[role=tree]").first());
    await t.esperar(900);
    t.marcar("inspecionar");
    await t.clicar(pagina.getByRole("button", { name: /Modo inspecionar/ }).first(), { ms: 700 });
    await t.esperar(350);
    await t.moverSuave({ x: (await manchete.boundingBox()).x + 380, y: (await manchete.boundingBox()).y + 30 }, 900);
    await t.esperar(500);
    await caixaNaPrevia(t, "manchete", "h1");
    t.marcar("clique-na-manchete");
    await t.clicar({ x: (await manchete.boundingBox()).x + 380, y: (await manchete.boundingBox()).y + 30 }, { ms: 60 });
    await esperarPronto(pagina);
    await t.esperar(250);
    t.marcar("no-aceso");
    await t.caixa("no", linha);
    await t.esperar(1100);
    t.marcar("editar");
    await t.clicar(linha.locator("[title='Dois cliques para editar']").first(), { ms: 800, duplo: true });
    const campo = pagina.locator("[role=tree] input").first();
    await campo.waitFor({ timeout: 5000 });
    await t.caixa("campo", campo);
    await pagina.keyboard.press("Control+A");
    await t.esperar(250);
    t.marcar("digitar");
    await t.digitar("Este site agora é meu");
    await t.esperar(450);
    t.marcar("enter");
    await t.tecla("Enter");
    await esperarPronto(pagina);
    t.marcar("previa-mudou");
    await caixaNaPrevia(t, "manchete-nova", "h1");
    await t.caixa("no-novo", linha);
    await t.esperar(3200);
    return t.terminar();
  },

  // T02 e T03: o mundo de dia e de noite, no mesmo enquadramento.
  T02: () => mundo("T02-mundo-dia", 10, "O mundo de dia, das Origens à Rede e Servidor, com a baleia"),
  T03: () => mundo("T03-mundo-noite", 22, "O mesmo caminho da T02, de noite"),

  // T04: a ilha Sites por dentro, concluída: o passeio pelas zonas, o card de uma unidade e a zona Publicar.
  async T04() {
    const t = await abrirTomada({ id: "T04-ilha-sites", formato: "computador", descricao: "A ilha Sites por dentro, com a Sites concluída: o passeio pelas zonas, o card da unidade Grid e a zona Publicar", progresso: progressoDeQuemJogou(["sites"]), rota: "/ilha/sites", esperar: "[data-mapa=ilha]" });
    const { pagina } = t;
    const ponto = pagina.locator('[data-unidade="sites-layout-u3"]');
    const xDe = (seletor, naTela) => pagina.evaluate(([s, area, x]) => { const a = document.querySelector(area); const p = document.querySelector(s).getBoundingClientRect(); return Math.round(a.scrollLeft + p.x + p.width / 2 - x); }, [seletor, MUNDO, naTela]);
    const alvo = await xDe('[data-unidade="sites-layout-u3"]', 1150);
    await pagina.evaluate(([s, x]) => { document.querySelector(s).scrollLeft = x; }, [MUNDO, alvo - 1700]);
    await t.esperar(1500);
    await t.iniciar();
    await t.esperar(900);
    // O passeio é gravado na metade da velocidade (a ilha é um desenho grande e o
    // navegador sem placa de vídeo entrega poucos quadros rolando): o vídeo toca este trecho em 2x.
    t.marcar("rolar", { dx: 1700, ms: 10400, tocarEm: 2 });
    await t.rolarSuave(MUNDO, { dx: 1700, ms: 10400, linear: false });
    t.marcar("parou");
    await t.esperar(700);
    await t.caixa("ponto", ponto);
    await t.moverSuave(ponto, 800);
    await t.esperar(150);
    t.marcar("clique-na-unidade");
    await t.clicar(ponto, { ms: 30 });
    const card = pagina.getByRole("dialog").first();
    await card.waitFor();
    t.marcar("card-aberto");
    await t.esperar(700);
    await t.caixa("card", card);
    await t.esperar(2600);
    // Fecha o card e vai para a zona Publicar (um corte no vídeo).
    await pagina.keyboard.press("Escape");
    await card.waitFor({ state: "detached" }).catch(() => {});
    const publicar = await xDe('[data-unidade="sites-publicar-u1"]', 900);
    await pagina.evaluate(([s, x]) => { document.querySelector(s).scrollLeft = x; }, [MUNDO, publicar - 240]);
    await pagina.mouse.move(1500, 900);
    await t.esperar(1600);
    t.marcar("publicar", { dx: 240, ms: 4800, tocarEm: 2 });
    await t.rolarSuave(MUNDO, { dx: 240, ms: 4800, linear: true });
    await t.caixa("placa-publicar", pagina.locator('[data-placa-zona]').filter({ hasText: "Publicar" }).first());
    await t.esperar(800);
    return t.terminar();
  },

  // T05: o painel Estilos, trocando a cor do cabeçalho pelo seletor de cor.
  async T05() {
    const fase = "sites-estilos-u1-f3";
    const t = await abrirTomada({ id: "T05-estilos-cor", formato: "medio", descricao: "Painel Estilos: a cor de fundo do cabeçalho trocada pelo seletor de cor, e a prévia muda", progresso: progressoNaFase(fase, [], { objetivoAtual: 1 }), rota: `/fase/${fase}`, esperar: "section[data-previa] iframe" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    const chave = await chaveDoSeletor(pagina, "header");
    const linha = pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first();
    const cor = pagina.locator("[data-seletor-cor]").first();
    await t.esperar(500);
    await t.iniciar();
    await t.caixa("previa", pagina.locator("section[data-previa]").first());
    await t.esperar(700);
    await t.clicar(linha, { ms: 700 });
    await esperarPronto(pagina);
    await cor.waitFor();
    await t.caixa("estilos", pagina.locator("[data-lista-estilos]").first());
    await t.caixa("regra", pagina.locator('[data-declaracao="background-color"]').first());
    await caixaNaPrevia(t, "cabecalho", "header");
    await t.esperar(900);
    t.marcar("clique-no-quadradinho");
    await t.clicar(cor, { ms: 800 });
    await t.esperar(350);
    // O seletor de cor do sistema não aparece no navegador sem tela: as cores entram no campo uma a uma, como quem arrasta o seletor.
    const cores = ["#7a9e9a", "#7a93b0", "#7a82c4", "#8a74d4", "#a866d6", "#c558c8", "#d647a6", "#d6337f"];
    for (const [indice, valor] of cores.entries()) {
      await cor.fill(valor);
      if (indice === 0) t.marcar("cor-mudou");
      await t.esperar(150);
    }
    await esperarPronto(pagina);
    t.marcar("cor-final");
    await t.esperar(3200);
    return t.terminar();
  },

  // T06: flexbox. O justify-content entra na regra e os cards se espalham na prévia.
  async T06() {
    const fase = "sites-layout-u2-f2";
    const t = await abrirTomada({ id: "T06-flexbox", formato: "medio", descricao: "Flexbox: justify-content: space-between na regra .cards e os livros se espalham", progresso: progressoNaFase(fase, [], { objetivoAtual: 0 }), rota: `/fase/${fase}`, esperar: "section[data-previa] iframe" });
    const { pagina } = t;
    const regra = pagina.locator('[data-lista-estilos] > section[aria-label="Regra .cards"]').first();
    const campo = (qual) => pagina.locator(`[data-campo-estilo=${qual}]`);
    await esperarPronto(pagina);
    await passarIntroducao(pagina);
    await continuarFalas(pagina);
    // Fora da gravação: o objetivo anterior (display: flex) e a previsão deste.
    await selecionarNo(pagina, ".cards");
    await regra.hover();
    await regra.locator("[data-adicionar-declaracao]").click();
    await campo("nome").fill("display");
    await campo("nome").press("Tab");
    await campo("valor").fill("flex");
    await campo("valor").press("Enter");
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    const proximo = pagina.getByRole("button", { name: /Próximo objetivo/ }).first();
    if (await proximo.isVisible().catch(() => false)) await proximo.click();
    await esperarPronto(pagina);
    await responderPrevisao(pagina);
    await continuarFalas(pagina);
    await selecionarNo(pagina, ".cards");
    await esperarPronto(pagina);
    await pagina.mouse.move(900, 500);
    await t.esperar(500);
    await t.iniciar();
    await t.caixa("previa", pagina.locator("section[data-previa]").first());
    await t.caixa("estilos", pagina.locator("[data-lista-estilos]").first());
    await caixaNaPrevia(t, "cards", ".cards");
    await t.esperar(900);
    await t.moverSuave(regra, 700);
    await t.clicar(regra.locator("[data-adicionar-declaracao]"), { ms: 500 });
    await campo("nome").waitFor();
    t.marcar("digitar-propriedade");
    await t.digitar("justify-content");
    await t.tecla("Tab");
    await t.esperar(200);
    await t.digitar("space-between", { semente: 11 });
    await t.caixa("declaracao", regra);
    await t.esperar(400);
    t.marcar("enter");
    await t.tecla("Enter");
    await esperarPronto(pagina);
    t.marcar("espalhou");
    await caixaNaPrevia(t, "cards-depois", ".cards");
    await t.esperar(3200);
    return t.terminar();
  },

  // T07: o Console calcula.
  async T07() {
    const fase = "logica-primeiros-comandos-u1-f1";
    const t = await abrirTomada({ id: "T07-console", formato: "perto", descricao: "Lógica, primeiros comandos: uma conta no Console", progresso: progressoNaFase(fase, ["sites"], { objetivoAtual: 0 }), rota: `/fase/${fase}`, esperar: "[data-console]" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await passarIntroducao(pagina);
    await continuarFalas(pagina);
    const entrada = pagina.locator("[data-console]:visible [data-entrada-console]").first();
    await t.esperar(400);
    await t.iniciar();
    await t.caixa("console", pagina.locator("[data-console]:visible").first());
    await t.esperar(600);
    await t.clicar(entrada, { ms: 600 });
    await t.esperar(200);
    t.marcar("digitar");
    await t.digitar("3 + 4");
    await t.esperar(350);
    t.marcar("enter");
    await t.tecla("Enter");
    await esperarPronto(pagina);
    t.marcar("resposta");
    await t.caixa("resposta", pagina.locator("[data-linha-console]").last());
    await t.esperar(900);
    await t.digitar("3 * 0.80 + 2 * 4.50", { semente: 5 });
    await t.esperar(300);
    await t.tecla("Enter");
    await esperarPronto(pagina);
    t.marcar("segunda-resposta");
    await t.esperar(2600);
    return t.terminar();
  },

  // T08: a vitrine da Padaria Pão de Mel rodando o código certo em 2x.
  async T08() {
    const fase = "logica-programa-de-verdade-u1-f2";
    const t = await abrirTomada({
      id: "T08-padaria-vitrine",
      formato: "medio",
      descricao: "O contrato da padaria: a cena da vitrine rodando o código certo em 2x (a luz acende, o letreiro troca, o forno esquenta)",
      progresso: progressoNaFase(fase, ["sites", "logica"], { objetivoAtual: 0, ...CONTRATO_NO_TRABALHO }),
      rota: `/fase/${fase}`,
      esperar: "[data-editor-snippet]",
    });
    const { pagina } = t;
    await esperarPronto(pagina);
    await passarIntroducao(pagina);
    await continuarFalas(pagina);
    // Fora da gravação: o código certo (o mesmo da jornada dos testes) e a cena maior (o divisor é arrastável).
    await pagina.locator("[data-editor-snippet] .cm-content").click();
    await pagina.keyboard.press("ControlOrMeta+A");
    await pagina.keyboard.press("Delete");
    await pagina.keyboard.insertText(CODIGO_DA_VITRINE);
    await esperarPronto(pagina);
    const divisor = pagina.getByRole("separator", { name: "Redimensionar a cena e o palco" });
    const d = await divisor.boundingBox();
    await pagina.mouse.move(d.x + d.width / 2, d.y + d.height / 2);
    await pagina.mouse.down();
    await pagina.mouse.move(d.x + d.width / 2, d.y + 230, { steps: 12 });
    await pagina.mouse.up();
    await esperarPronto(pagina);
    const cena = pagina.locator('[data-area-trabalho="cena"]').first();
    const executar = pagina.locator("[data-executar-snippet]");
    await pagina.mouse.move(820, 300);
    await t.esperar(500);
    await t.iniciar();
    await t.caixa("cena", cena);
    await t.caixa("desenho", pagina.locator("[data-cena]").first());
    await t.caixa("codigo", pagina.locator("[data-editor-snippet]").first());
    await t.esperar(800);
    await t.clicar(pagina.locator('[data-velocidade="2"]').first(), { ms: 700 });
    await t.esperar(400);
    t.marcar("executar");
    await t.clicar(executar, { ms: 700 });
    // Marca o instante em que a luz da vitrine acende.
    await pagina.waitForFunction(() => document.querySelector('[data-dispositivo="luz"]')?.getAttribute("data-ligada") === "true" || document.querySelector('[data-desenho="luz"]')?.getAttribute("data-ligada") === "true", null, { timeout: 15000, polling: 50 }).then(() => t.marcar("luz-acesa")).catch(() => t.marcar("luz-nao-vista"));
    await t.caixa("cena-rodando", cena);
    await t.esperar(9000);
    return t.terminar();
  },

  // T09: o briefing da Dona Celeste e o documento do pedido (a etapa de requisitos).
  async T09() {
    const fase = "logica-programa-de-verdade-u1-f2";
    const t = await abrirTomada({ id: "T09-contrato-cliente", formato: "medio", descricao: "O contrato: a Dona Celeste fala, e a lista do que o cliente pediu de verdade", progresso: progressoNaFase(fase, ["sites", "logica"], { objetivoAtual: 0 }), rota: `/fase/${fase}`, esperar: "[data-jogo-fase]" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await passarIntroducao(pagina, "[data-conversa-cliente]");
    const conversa = pagina.locator("[data-conversa-cliente]");
    await conversa.waitFor();
    await pagina.waitForSelector('[data-modal-assentado="sim"]');
    await pagina.mouse.move(1200, 700);
    await t.esperar(300);
    await t.iniciar();
    await t.caixa("conversa", conversa);
    t.marcar("fala-1");
    await t.esperar(3000);
    for (let fala = 2; fala <= 3; fala++) {
      await t.clicar(pagina.locator("[data-conversa-continuar]"), { ms: 600 });
      t.marcar(`fala-${fala}`);
      await t.esperar(2600);
    }
    // O resto da conversa passa rápido até o documento do pedido.
    for (let i = 0; i < 12; i++) {
      const fim = pagina.locator("[data-conversa-fim]");
      if (await fim.isVisible().catch(() => false)) {
        await t.clicar(fim, { ms: 300 });
        break;
      }
      const continuar = pagina.locator("[data-conversa-continuar]");
      if (!(await continuar.isVisible().catch(() => false))) break;
      await t.clicar(continuar, { ms: 250, pausa: 60 });
      await t.esperar(350);
    }
    await pagina.locator("[data-requisitos]").waitFor();
    await esperarPronto(pagina);
    await t.esperar(500);
    t.marcar("requisitos");
    await t.caixa("requisitos", pagina.locator("[data-requisitos]"));
    await t.esperar(1200);
    for (const id of ["luz", "letreiro"]) {
      await t.clicar(pagina.locator(`[data-cartao-requisito="${id}"] button`).first(), { ms: 600 });
      t.marcar(`cartao:${id}`);
      await t.esperar(700);
    }
    await t.esperar(2200);
    return t.terminar();
  },

  // T10: o depurador pausado num ponto de parada, com o Observar mostrando o valor.
  async T10() {
    const fase = "logica-depuracao-u2-f1";
    const t = await abrirTomada({ id: "T10-depurador", formato: "medio", descricao: "Depuração: ponto de parada na linha 7, deveFechar no Observar e o programa pausado", progresso: progressoNaFase(fase, ["sites", "logica"], { objetivoAtual: 0 }), rota: `/fase/${fase}`, esperar: "[data-editor-snippet]" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await passarIntroducao(pagina);
    await continuarFalas(pagina);
    await responderPrevisao(pagina);
    await continuarFalas(pagina);
    const linha7 = pagina.locator("[data-editor-snippet] .cm-lineNumbers .cm-gutterElement", { hasText: /^7$/ });
    const observar = pagina.locator("[data-campo-observar]:visible").first();
    await pagina.mouse.move(700, 480);
    await t.esperar(400);
    await t.iniciar();
    await t.caixa("codigo", pagina.locator("[data-editor-snippet]").first());
    await t.caixa("cena", pagina.locator('[data-area-trabalho="cena"]').first());
    await t.esperar(800);
    t.marcar("ponto");
    await t.clicar(linha7, { ms: 700 });
    await t.esperar(600);
    await t.clicar(observar, { ms: 700 });
    t.marcar("observar");
    await t.digitar("deveFechar");
    await t.tecla("Enter");
    await esperarPronto(pagina);
    await t.esperar(500);
    t.marcar("executar");
    await t.clicar(pagina.locator("[data-executar-snippet]"), { ms: 700 });
    await pagina.locator("[data-aviso-pausado]").first().waitFor({ timeout: 15000 });
    t.marcar("pausou");
    await t.caixa("aviso", pagina.locator("[data-aviso-pausado]").first());
    await t.caixa("observado", pagina.locator('[data-observacao="deveFechar"]').first());
    await t.caixa("depurador", pagina.locator("[data-painel-escopo]").first());
    await t.esperar(1500);
    await t.moverSuave(pagina.locator('[data-observacao="deveFechar"]').first(), 700);
    await t.esperar(3500);
    return t.terminar();
  },

  // T11: o corredor do museu, com os antepassados acordando um a um, até a árvore da família.
  async T11() {
    const t = await abrirTomada({ id: "T11-museu-corredor", formato: "computador", descricao: "O corredor do Museu das Origens: os antepassados acordam um a um, até a árvore da família", progresso: progressoDeQuemJogou([]), rota: "/ilha/origens", esperar: "[data-trilho-museu]" });
    const { pagina } = t;
    const TRILHO = "[data-trilho-museu]";
    await t.esperar(2500);
    await t.iniciar();
    await t.esperar(1500);
    const medida = await pagina.evaluate((s) => { const el = document.querySelector(s); return { dx: el.scrollWidth - el.clientWidth, dy: el.scrollHeight - el.clientHeight }; }, TRILHO);
    t.marcar("rolar", { dx: medida.dx, ms: 17000 });
    await vigiar(t, t.rolarSuave(TRILHO, { dx: medida.dx, ms: 17000, linear: true }), '[data-epoca][data-acordado="sim"]', "data-epoca", "acordou");
    t.marcar("arvore");
    await t.caixa("arvore", pagina.locator("[data-arvore]").first());
    await t.esperar(3000);
    return t.terminar();
  },

  // T12: o comparador de linguagens rodando o Python de verdade (Pyodide).
  async T12() {
    const fase = "origens-museu-u3-f1";
    const t = await abrirTomada({ id: "T12-comparador", formato: "medio", descricao: "Museu, sala 3: o comparador de linguagens roda o Python de verdade no navegador", progresso: progressoNaFase(fase, ["origens"], { objetivoAtual: 1 }), rota: `/fase/${fase}`, esperar: "[data-estacao]" });
    const { pagina } = t;
    await esperarPronto(pagina, 30000);
    await passarIntroducao(pagina);
    await continuarFalas(pagina);
    await responderPrevisao(pagina);
    await continuarFalas(pagina);
    const rodar = pagina.locator('[data-rodar="python"]').first();
    // A fileira de baixo (Java, JavaScript e Python) na tela. A área da exposição rola; a marca
    // data-video-rola só existe nesta sessão de gravação, para o rolarSuave achar o elemento.
    await rodar.evaluate((el) => {
      let no = el.parentElement;
      while (no && !(no.scrollHeight > no.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(no).overflowY))) no = no.parentElement;
      if (no) {
        no.setAttribute("data-video-rola", "");
        no.scrollTop = no.scrollHeight;
      }
    });
    await esperarPronto(pagina);
    await pagina.mouse.move(700, 300);
    await t.esperar(600);
    await t.iniciar();
    await t.caixa("estacao", pagina.locator("[data-estacao]").first());
    await t.caixa("python", pagina.locator('[data-programa-linguagem="python"]').first());
    await t.esperar(900);
    t.marcar("rodar-python");
    await t.clicar(rodar, { ms: 800 });
    await t.esperar(250);
    // A barra de carga e a saída aparecem embaixo do botão: rola um pouco para elas caberem.
    await t.rolarSuave("[data-video-rola]", { dy: 200, ms: 500, linear: false });
    await t.caixa("python-rodando", pagina.locator('[data-programa-linguagem="python"]').first());
    await pagina.locator('[data-saida-linguagem="python"][data-pronta="sim"]').first().waitFor({ timeout: 120000 });
    // A marca é o instante em que o resultado aparece PINTADO na tela: o estado fica pronto antes, e a
    // página ainda leva um tempo para desenhar (dois quadros de animação garantem que a pintura saiu).
    await doisQuadros(pagina);
    t.marcar("python-rodou");
    await t.esperar(150);
    await pagina.evaluate(() => { const el = document.querySelector("[data-video-rola]"); if (el) el.scrollTop = el.scrollHeight; });
    await t.caixa("saida", pagina.locator('[data-saida-linguagem="python"]').first());
    await t.caixa("python-depois", pagina.locator('[data-programa-linguagem="python"]').first());
    await t.esperar(4500);
    return t.terminar();
  },

  // T13: a mesa de cores em hexadecimal montando o laranja.
  async T13() {
    const fase = "origens-museu-u1-f4";
    const t = await abrirTomada({ id: "T13-mesa-de-cores", formato: "medio", descricao: "Museu, sala 1: a mesa de cores monta o laranja #ff8800 em hexadecimal", progresso: progressoNaFase(fase, [], { objetivoAtual: 2 }), rota: `/fase/${fase}`, esperar: "[data-estacao]" });
    const { pagina } = t;
    await esperarPronto(pagina, 30000);
    await passarIntroducao(pagina);
    await continuarFalas(pagina);
    const mesa = pagina.locator('[data-estacao="mesa"]').last();
    await pagina.mouse.move(1300, 520);
    await t.esperar(500);
    await t.iniciar();
    await t.caixa("mesa", mesa);
    await t.esperar(800);
    const passos = [["descer", 0, 1], ["descer", 1, 1], ["subir", 2, 8], ["subir", 3, 8]];
    for (const [sentido, digito, vezes] of passos) {
      const botao = mesa.locator(`[data-${sentido}-digito="${digito}"]`);
      await t.clicar(botao, { ms: 450 });
      for (let i = 1; i < vezes; i++) {
        await t.esperar(95);
        await t.clicar(botao, { ms: 20, pausa: 20 });
      }
      t.marcar(`digito:${digito}`);
      await t.esperar(350);
    }
    await esperarPronto(pagina);
    t.marcar("laranja");
    await t.esperar(3200);
    return t.terminar();
  },

  // T14: o glossário, buscando "flexbox".
  async T14() {
    const t = await abrirTomada({ id: "T14-glossario", formato: "perto", descricao: "O glossário, com a busca por flexbox", progresso: alunoNoMeio(), rota: "/glossario", esperar: 'input[aria-label="Buscar no glossário"]' });
    const { pagina } = t;
    const busca = pagina.locator('input[aria-label="Buscar no glossário"]');
    await t.esperar(800);
    await t.iniciar();
    await t.esperar(700);
    await t.clicar(busca, { ms: 600 });
    t.marcar("digitar");
    await t.digitar("flexbox");
    await t.esperar(500);
    t.marcar("resultado");
    await t.caixa("resultado", pagina.locator("main article, main li, main section").first());
    await t.esperar(3200);
    return t.terminar();
  },

  // T15: as profissões.
  async T15() {
    const t = await abrirTomada({ id: "T15-profissoes", formato: "perto", descricao: "A tela de profissões: o que faz cada tipo de programador", progresso: alunoNoMeio(), rota: "/profissoes", esperar: "main" });
    await t.esperar(900);
    await t.iniciar();
    await t.esperar(1300);
    t.marcar("rolar");
    await t.rolarSuave("main", { dy: 520, ms: 4200, linear: false });
    await t.esperar(1500);
    return t.terminar();
  },

  // T16: a lente de um tema no mundo e o painel de insígnias.
  async T16() {
    const t = await abrirTomada({ id: "T16-lente-tema", formato: "computador", descricao: "O mundo com a lente do tema Lógica ligada e o painel de insígnias", progresso: alunoNoMeio(), rota: "/?hora=10", esperar: "[data-mapa=mundo]", armazenamento: semAceno() });
    const { pagina } = t;
    await pagina.locator("[data-mascote-no-mapa]").first().waitFor();
    await t.esperar(1500);
    await t.iniciar();
    await t.esperar(800);
    t.marcar("lente");
    await t.clicar(pagina.locator("[data-barra-lentes]").getByRole("button", { name: "Lógica" }).first(), { ms: 800 });
    await t.esperar(2200);
    t.marcar("insignias");
    await t.clicar(pagina.getByRole("button", { name: /Abrir o painel Insígnias|Insígnias/ }).first(), { ms: 800 });
    await pagina.locator("[data-painel-insignias]").waitFor();
    await t.esperar(400);
    await t.caixa("painel", pagina.locator("[data-painel-insignias]").first());
    t.marcar("painel-aberto");
    await t.esperar(3500);
    return t.terminar();
  },

  // T17: dentro de uma fase, trocar o tema Doce pelo Fliperama.
  async T17() {
    const fase = "sites-elementos-u1-f1";
    const t = await abrirTomada({ id: "T17-troca-tema", formato: "perto", descricao: "Dentro da fase, o tema Doce vira Fliperama pelo seletor", progresso: progressoNaFase(fase, [], { objetivoAtual: 2 }), rota: `/fase/${fase}`, esperar: "section[data-previa] iframe" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    const botao = pagina.getByRole("radio", { name: /Tema Fliperama/ }).first();
    await pagina.mouse.move(700, 420);
    await t.esperar(500);
    await t.iniciar();
    await t.esperar(1200);
    await t.caixa("botao", botao);
    await t.caixa("cadeado", pagina.getByRole("radio", { name: /Tema secreto/ }).first());
    await t.moverSuave(botao, 900);
    await t.esperar(250);
    t.marcar("trocar");
    await t.clicar(botao, { ms: 60 });
    await t.esperar(400);
    t.marcar("fliperama");
    await t.moverSuave({ x: 760, y: 430 }, 900);
    await t.esperar(3200);
    return t.terminar({ tema: await pagina.evaluate(() => document.documentElement.getAttribute("data-theme")) });
  },

  // T18: as ilhas em construção, com os operários de capacete.
  async T18() {
    const t = await abrirTomada({ id: "T18-em-construcao", formato: "computador", descricao: "O fim do mundo, com as ilhas em construção e os operários de capacete", progresso: alunoNoMeio(), rota: "/?hora=10", esperar: "[data-mapa=mundo]", armazenamento: semAceno() });
    const { pagina } = t;
    await pagina.evaluate((s) => { const el = document.querySelector(s); el.scrollLeft = el.scrollWidth; }, MUNDO);
    await t.esperar(2500);
    await t.iniciar();
    await caixasDasIlhas(t);
    await t.esperar(9000);
    return t.terminar();
  },

  // V01: a mesma ação da T01 no celular em pé (inspecionar arrastando o dedo, editar).
  async V01() {
    const fase = "sites-elementos-u1-f1";
    // Com o último objetivo ativo (o do código), editar a manchete pela árvore não conclui objetivo nenhum:
    // o balão do computadorzinho do jogo, que no celular abre sozinho a cada fala nova, não cobre a ação.
    const t = await abrirTomada({ id: "V01-sites-u1-celular", formato: "celular", descricao: "No celular em pé: inspecionar a manchete arrastando o dedo, editar o texto e a prévia muda", progresso: progressoNaFase(fase, [], { objetivoAtual: 3 }), rota: `/fase/${fase}`, esperar: "section[data-previa] iframe" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    await fecharBalao(pagina);
    const chave = await chaveDoSeletor(pagina, "h1");
    const linha = pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first();
    const manchete = pagina.locator("section[data-previa] iframe").first().contentFrame().locator("h1");
    await t.esperar(600);
    await t.iniciar();
    await t.caixa("previa", pagina.locator("section[data-previa]").first());
    await t.esperar(900);
    t.marcar("inspecionar");
    await t.tocar(pagina.getByRole("button", { name: /Modo inspecionar/ }).first(), { pausa: 250 });
    await t.esperar(700);
    const alvo = await manchete.boundingBox();
    const previa = await pagina.locator("section[data-previa] iframe").first().boundingBox();
    t.marcar("arrastar-o-dedo");
    await t.arrastarDedo({ x: previa.x + previa.width * 0.55, y: previa.y + 26 }, { x: alvo.x + alvo.width * 0.45, y: alvo.y + alvo.height * 0.5 }, 1300);
    await esperarPronto(pagina);
    await t.esperar(350);
    t.marcar("no-aceso");
    await t.caixa("no", linha);
    await t.esperar(1000);
    t.marcar("editar");
    await t.tocar(pagina.locator("[data-barra-acoes] [data-acao=editar]").first(), { pausa: 250 });
    const campo = pagina.locator("[role=tree] input").first();
    await campo.waitFor({ timeout: 5000 });
    await pagina.keyboard.press("Control+A");
    await t.esperar(300);
    t.marcar("digitar");
    await t.digitar("Este site agora é meu");
    await t.esperar(400);
    t.marcar("enter");
    await t.tecla("Enter");
    await esperarPronto(pagina);
    t.marcar("previa-mudou");
    await t.esperar(3500);
    return t.terminar();
  },

  // V02: o mundo no celular em pé, de dia, com o dedo.
  async V02() {
    const t = await abrirTomada({ id: "V02-mundo-celular", formato: "celular", descricao: "O mundo no celular em pé, de dia, rolado com o dedo", progresso: alunoNoMeio(), rota: "/?hora=10&baleia", esperar: "[data-mapa=mundo]", armazenamento: semAceno() });
    const { pagina } = t;
    await pagina.locator("[data-mascote-no-mapa]").first().waitFor();
    // Começa no início do mundo (o jogo abre na ilha do computadorzinho) e anda com arrastos calmos.
    await pagina.evaluate((s) => { document.querySelector(s).scrollLeft = 0; }, MUNDO);
    await t.esperar(2200);
    await t.iniciar();
    await t.esperar(1600);
    for (let i = 0; i < 7; i++) {
      t.marcar(`arrasto:${i + 1}`);
      await t.arrastarDedo({ x: 330, y: 430 + (i % 2) * 40 }, { x: 130, y: 430 + (i % 2) * 40 }, 620);
      await t.esperar(1300);
    }
    await t.esperar(1500);
    return t.terminar();
  },

  // V03: a vitrine da padaria no celular.
  async V03() {
    const fase = "logica-programa-de-verdade-u1-f2";
    const t = await abrirTomada({ id: "V03-padaria-celular", formato: "celular", descricao: "O contrato da padaria no celular: a cena da vitrine rodando o código certo em 2x", progresso: progressoNaFase(fase, ["sites", "logica"], { objetivoAtual: 0, contrato: { ...CONTRATO_NO_TRABALHO.contrato, mudou: true } }), rota: `/fase/${fase}`, esperar: "[data-jogo-fase]" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    await fecharBalao(pagina);
    await pagina.locator('[data-abas-composicao] [data-segmento="snippet"]').tap();
    await esperarPronto(pagina);
    await pagina.locator("[data-editor-snippet] .cm-content").click();
    await pagina.keyboard.press("ControlOrMeta+A");
    await pagina.keyboard.press("Delete");
    await pagina.keyboard.insertText(CODIGO_DA_VITRINE);
    await esperarPronto(pagina);
    await fecharBalao(pagina);
    if (!(await pagina.locator('[data-area-trabalho="cena"]').isVisible())) {
      await pagina.locator("[data-alternar-cena]").tap();
      await esperarPronto(pagina);
    }
    await pagina.locator("[data-editor-snippet] .cm-scroller").evaluate((el) => { el.scrollTop = 0; }).catch(() => {});
    await pagina.evaluate(() => document.activeElement?.blur());
    // Fora da gravação: uma primeira rodada, para o computadorzinho comemorar os requisitos agora
    // (o balão do celular abre sozinho a cada fala nova e cobriria a cena no meio da tomada).
    await pagina.locator("[data-executar-snippet]").tap();
    await esperarPronto(pagina, 30000);
    await continuarFalas(pagina, 12);
    // Se a Dona Celeste aparecer com a mudança de pedido, ouve até o fim.
    for (let i = 0; i < 14 && (await pagina.locator("[data-conversa-cliente]").isVisible().catch(() => false)); i++) {
      const fim = pagina.locator("[data-conversa-fim]");
      if (await fim.isVisible().catch(() => false)) await fim.tap();
      else await pagina.locator("[data-conversa-continuar]").tap().catch(() => {});
      await t.esperar(300);
    }
    await esperarPronto(pagina, 30000);
    await continuarFalas(pagina, 12);
    await fecharBalao(pagina);
    // De volta ao Snippet (depois de rodar, o jogo mostra o Console) e à velocidade normal.
    const snippet = pagina.getByRole("tab", { name: "Snippet", exact: true });
    if (await snippet.isVisible().catch(() => false)) await snippet.tap();
    await pagina.locator('[data-velocidade="1"]').first().tap().catch(() => {});
    await pagina.evaluate(() => document.activeElement?.blur());
    await t.esperar(800);
    await t.iniciar();
    await t.caixa("cena", pagina.locator('[data-area-trabalho="cena"]').first());
    await t.caixa("desenho", pagina.locator("[data-cena]").first());
    await t.esperar(900);
    await t.tocar(pagina.locator('[data-velocidade="2"]').first(), { pausa: 250 });
    await t.esperar(600);
    t.marcar("executar");
    await t.tocar(pagina.locator("[data-executar-snippet]"), { pausa: 250 });
    await pagina.waitForFunction(() => document.querySelector('[data-dispositivo="luz"]')?.getAttribute("data-ligada") === "true" || document.querySelector('[data-desenho="luz"]')?.getAttribute("data-ligada") === "true", null, { timeout: 15000, polling: 50 }).then(() => t.marcar("luz-acesa")).catch(() => t.marcar("luz-nao-vista"));
    await t.esperar(9000);
    return t.terminar();
  },

  // V04: o corredor do museu descendo no celular.
  async V04() {
    const t = await abrirTomada({ id: "V04-museu-celular", formato: "celular", descricao: "O Museu das Origens no celular: o corredor descendo e os antepassados acordando", progresso: progressoDeQuemJogou([]), rota: "/ilha/origens", esperar: "[data-trilho-museu]" });
    const { pagina } = t;
    const TRILHO = "[data-trilho-museu]";
    await t.esperar(2500);
    await t.iniciar();
    await t.esperar(1500);
    const medida = await pagina.evaluate((s) => { const el = document.querySelector(s); return el.scrollHeight - el.clientHeight; }, TRILHO);
    t.marcar("rolar", { dy: medida, ms: 17000 });
    await vigiar(t, t.rolarSuave(TRILHO, { dy: medida, ms: 17000, linear: true }), '[data-epoca][data-acordado="sim"]', "data-epoca", "acordou");
    t.marcar("fim");
    await t.esperar(2500);
    return t.terminar();
  },

  /* ---------------------------------------------------------------- */
  /* Tomadas dos curtos ("O aprendiz", tema Doce, e "O chefão",       */
  /* tema Fliperama). Todas no celular em pé.                         */
  /* ---------------------------------------------------------------- */

  // V05: o painel Estilos no celular, trocando a cor do cabeçalho; a prévia muda.
  async V05() {
    const fase = "sites-estilos-u1-f3";
    // Com o último objetivo ativo, trocar a cor não conclui objetivo nenhum: o balão do computadorzinho do jogo não abre em cima da ação.
    const t = await abrirTomada({ id: "V05-estilos-celular", formato: "celular", descricao: "No celular em pé: o painel Estilos, a cor de fundo do cabeçalho trocada pelo seletor e a prévia mudando", progresso: progressoNaFase(fase, [], { objetivoAtual: 3 }), rota: `/fase/${fase}`, esperar: "section[data-previa] iframe" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    await fecharBalao(pagina);
    const chave = await chaveDoSeletor(pagina, "header");
    const linha = pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first();
    await linha.scrollIntoViewIfNeeded();
    await t.esperar(600);
    await t.iniciar();
    await t.caixa("previa", pagina.locator("section[data-previa]").first());
    await caixaNaPrevia(t, "cabecalho", "header");
    await t.esperar(700);
    t.marcar("selecionar");
    await t.tocar(linha, { pausa: 250 });
    await esperarPronto(pagina);
    await t.esperar(500);
    t.marcar("estilos");
    await t.tocar(pagina.getByRole("tab", { name: "Estilos", exact: true }).first(), { pausa: 250 });
    await esperarPronto(pagina);
    await fecharBalao(pagina);
    const cor = pagina.locator("[data-seletor-cor]:visible").first();
    await cor.waitFor();
    // A regra do cabeçalho sobe para o meio do painel (embaixo, o computadorzinho do jogo cobre o quadradinho da cor).
    await cor.evaluate((el) => {
      let no = el.parentElement;
      while (no && !(no.scrollHeight > no.clientHeight + 10 && /(auto|scroll)/.test(getComputedStyle(no).overflowY))) no = no.parentElement;
      if (no) no.setAttribute("data-video-rola", "");
    });
    const antes = await cor.boundingBox();
    await t.rolarSuave("[data-video-rola]", { dy: Math.max(0, antes.y - 600), ms: 450, linear: false });
    await t.esperar(350);
    await t.caixa("regra", pagina.locator('[data-declaracao="background-color"]:visible').first());
    await t.caixa("quadradinho", cor);
    t.marcar("clique-no-quadradinho");
    await t.tocar(cor, { pausa: 250 });
    await t.esperar(300);
    // O seletor de cor do sistema não aparece no navegador sem tela: as cores entram no campo uma a uma, como quem arrasta o seletor.
    const cores = ["#7a9e9a", "#7a93b0", "#7a82c4", "#8a74d4", "#a866d6", "#c558c8", "#d647a6", "#d6337f"];
    for (const [indice, valor] of cores.entries()) {
      await cor.fill(valor);
      if (indice === 0) {
        await doisQuadros(pagina);
        t.marcar("cor-mudou");
      }
      await t.esperar(150);
    }
    await esperarPronto(pagina);
    t.marcar("cor-final");
    await t.esperar(3200);
    return t.terminar();
  },

  // V06: o chamado da agenda do salão no celular (Doce): pausa, Observar, conserto e os testes ficando verdes.
  V06: () => chamadoDaAgenda("V06-chamado-celular", "doce"),

  // V07: o mundo de noite no celular (Doce), só pelas ilhas com conteúdo.
  V07: () => mundoDeNoiteNoCelular("V07-mundo-noite-celular", "doce"),

  // V08: o painel de insígnias no celular (Doce).
  V08: () => insigniasNoCelular("V08-insignias-celular", "doce"),

  // V09: a vitrine da padaria de perto (a cena do contrato no celular, gravada numa janela aproximada).
  async V09() {
    const fase = "logica-programa-de-verdade-u1-f2";
    const t = await abrirTomada({ id: "V09-vitrine-de-perto", formato: "celular", descricao: "O contrato da padaria no celular, com a gravação aproximada na cena: o código acende a luz, o letreiro (com as promoções sem o preço) e o forno da vitrine", progresso: progressoNaFase(fase, ["sites", "logica"], { objetivoAtual: 0, contrato: { ...CONTRATO_NO_TRABALHO.contrato, mudou: true } }), rota: `/fase/${fase}`, esperar: "[data-jogo-fase]" });
    const { pagina } = t;
    await esperarPronto(pagina);
    await continuarFalas(pagina);
    await fecharBalao(pagina);
    await pagina.locator('[data-abas-composicao] [data-segmento="snippet"]').tap();
    await esperarPronto(pagina);
    await pagina.locator("[data-editor-snippet] .cm-content").click();
    await pagina.keyboard.press("ControlOrMeta+A");
    await pagina.keyboard.press("Delete");
    // A solução do contrato com as promoções sem o preço (ver CODIGO_DA_VITRINE_SEM_PRECO).
    await pagina.keyboard.insertText(CODIGO_DA_VITRINE_SEM_PRECO);
    await esperarPronto(pagina);
    await fecharBalao(pagina);
    if (!(await pagina.locator('[data-area-trabalho="cena"]').isVisible())) {
      await pagina.locator("[data-alternar-cena]").tap();
      await esperarPronto(pagina);
    }
    await pagina.evaluate(() => document.activeElement?.blur());
    // Fora da gravação: uma primeira rodada (o computadorzinho comemora os requisitos agora) e a conversa da cliente, se vier.
    await pagina.locator("[data-executar-snippet]").tap();
    await esperarPronto(pagina, 30000);
    await continuarFalas(pagina, 12);
    for (let i = 0; i < 14 && (await pagina.locator("[data-conversa-cliente]").isVisible().catch(() => false)); i++) {
      const fim = pagina.locator("[data-conversa-fim]");
      if (await fim.isVisible().catch(() => false)) await fim.tap();
      else await pagina.locator("[data-conversa-continuar]").tap().catch(() => {});
      await t.esperar(300);
    }
    await esperarPronto(pagina, 30000);
    await continuarFalas(pagina, 12);
    await fecharBalao(pagina);
    await pagina.locator('[data-velocidade="2"]').first().tap().catch(() => {});
    await pagina.evaluate(() => document.activeElement?.blur());
    await t.esperar(600);
    // A janela: o desenho da cena ocupa a largura do quadro (no celular ele tem uns 100 px de largura).
    const desenho = await desenhoDaCena(pagina);
    await t.janela(desenho, { folga: 0.06 });
    await t.esperar(400);
    await t.iniciar();
    t.marcar("caixa:desenho", { x: Math.round(desenho.x), y: Math.round(desenho.y), l: Math.round(desenho.width), a: Math.round(desenho.height) });
    await t.esperar(900);
    t.marcar("executar");
    await t.tocarPorDentro(pagina.locator("[data-executar-snippet]"));
    await pagina.waitForFunction(() => document.querySelector('[data-dispositivo="luz"]')?.getAttribute("data-ligada") === "true" || document.querySelector('[data-desenho="luz"]')?.getAttribute("data-ligada") === "true", null, { timeout: 15000, polling: 50 }).then(() => t.marcar("luz-acesa")).catch(() => t.marcar("luz-nao-vista"));
    await t.esperar(8000);
    return t.terminar();
  },

  // F01: a missão do chefão: a tela do aplicativo do salão, com o horário repetido em vermelho (janela aproximada).
  async F01() {
    const t = await abrirChamadoDaAgenda("F01-missao-fliperama", "fliperama", "O chamado da agenda do Salão Girassol no Fliperama, com a gravação aproximada na tela do aplicativo: a terça aparece com o horário das 10h marcado duas vezes, em vermelho");
    const { pagina } = t;
    await pagina.locator('[data-abas-composicao] [data-segmento="snippet"]').tap();
    await esperarPronto(pagina);
    await fecharBalao(pagina);
    await pagina.locator('[data-area-cena][data-tocando="nao"]').waitFor({ timeout: 15000 }).catch(() => {});
    const aparelho = pagina.locator('[data-cena] [data-dispositivo="tela"]').first();
    const caixaDoAparelho = await aparelho.boundingBox();
    // A janela tem 150 px de página, com a tela do aplicativo (uns 68 px) do meio para a direita: o texto da agenda
    // fica com uns 28 px no quadro, e sobra o lado esquerdo para o cartão da cliente que o vídeo desenha por cima.
    await t.janela({ x: caixaDoAparelho.x - 70, y: caixaDoAparelho.y, width: 150, height: caixaDoAparelho.height }, { folga: 0, centroY: caixaDoAparelho.y + caixaDoAparelho.height / 2 + 20 });
    await t.esperar(400);
    await t.iniciar();
    await t.caixa("tela", aparelho);
    await t.esperar(700);
    t.marcar("executar");
    await t.tocarPorDentro(pagina.locator("[data-executar-snippet]"));
    await pagina.waitForFunction(() => document.querySelector('[data-cena] [data-dispositivo="tela"]')?.getAttribute("data-conflitos") === "1" && document.querySelector('[data-cena] [data-linha-agenda="repetido"]'), null, { timeout: 15000, polling: 40 }).then(() => t.marcar("horario-repetido")).catch(() => t.marcar("horario-nao-visto"));
    await doisQuadros(pagina);
    await t.caixa("tela-acesa", aparelho);
    await t.esperar(5000);
    return t.terminar({ texto: await aparelho.getAttribute("data-texto"), conflitos: await aparelho.getAttribute("data-conflitos") });
  },

  // F02: a luta: o mesmo chamado no Fliperama, com as mesmas marcas da V06.
  F02: () => chamadoDaAgenda("F02-luta-fliperama", "fliperama"),

  // F03: o mundo de noite no celular (Fliperama), só pelas ilhas com conteúdo.
  F03: () => mundoDeNoiteNoCelular("F03-mundo-fliperama", "fliperama"),

  // F04: o corredor do museu no celular (Fliperama), com os primeiros antepassados acordando.
  async F04() {
    const t = await abrirTomada({ id: "F04-museu-fliperama", formato: "celular", descricao: "O Museu das Origens no celular, no Fliperama: o corredor descendo e os primeiros antepassados acordando", progresso: progressoDeQuemJogou([], { tema: "fliperama" }), rota: "/ilha/origens", esperar: "[data-trilho-museu]" });
    const { pagina } = t;
    const TRILHO = "[data-trilho-museu]";
    await t.esperar(2500);
    await t.iniciar();
    await t.esperar(1200);
    const medida = await pagina.evaluate((s) => { const el = document.querySelector(s); return el.scrollHeight - el.clientHeight; }, TRILHO);
    const dy = Math.min(medida, 1500);
    t.marcar("rolar", { dy, ms: 6500 });
    await vigiar(t, t.rolarSuave(TRILHO, { dy, ms: 6500, linear: true }), '[data-epoca][data-acordado="sim"]', "data-epoca", "acordou");
    t.marcar("fim");
    await t.esperar(2000);
    return t.terminar();
  },

  // F05: a sala 3 do museu no celular (Fliperama): o Python rodando de verdade no navegador.
  async F05() {
    const fase = "origens-museu-u3-f1";
    const t = await abrirTomada({ id: "F05-python-fliperama", formato: "celular", descricao: "Museu, sala 3, no celular e no Fliperama: o comparador roda o Python de verdade no navegador",
      // Com o último objetivo ativo, rodar o Python não conclui objetivo nenhum: o balão do computadorzinho do jogo não abre em cima do cartão.
      progresso: progressoNaFase(fase, ["origens"], { objetivoAtual: 4 }, { tema: "fliperama" }), rota: `/fase/${fase}`, esperar: "[data-estacao]" });
    const { pagina } = t;
    await esperarPronto(pagina, 30000);
    for (let i = 0; i < 8; i++) {
      const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
      if (!(await botao.isVisible().catch(() => false))) break;
      await botao.tap();
      await esperarPronto(pagina);
    }
    await continuarFalas(pagina);
    if (await pagina.locator("[data-previsao]").first().isVisible().catch(() => false)) {
      await (await opcaoDaPrevisao(pagina)).tap();
      await esperarPronto(pagina);
    }
    await continuarFalas(pagina);
    await fecharBalao(pagina);
    const rodar = pagina.locator('[data-rodar="python"]').first();
    const cartao = pagina.locator('[data-programa-linguagem="python"]').first();
    // O cartão do Python no alto da tela, com espaço embaixo para a saída.
    await cartao.evaluate((el) => {
      let no = el.parentElement;
      while (no && !(no.scrollHeight > no.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(no).overflowY))) no = no.parentElement;
      if (no) {
        no.setAttribute("data-video-rola", "");
        no.scrollTop += el.getBoundingClientRect().top - 118;
      }
    });
    await esperarPronto(pagina);
    await fecharBalao(pagina);
    await t.esperar(600);
    await t.iniciar();
    await t.caixa("python", cartao);
    await t.esperar(800);
    t.marcar("rodar-python");
    await t.tocar(rodar, { pausa: 250 });
    await pagina.locator('[data-saida-linguagem="python"][data-pronta="sim"]').first().waitFor({ timeout: 120000 });
    await doisQuadros(pagina);
    t.marcar("python-rodou");
    await t.caixa("saida", pagina.locator('[data-saida-linguagem="python"]').first());
    await t.caixa("python-depois", cartao);
    await t.esperar(4000);
    return t.terminar();
  },

  // F06: o painel de insígnias no celular (Fliperama).
  F06: () => insigniasNoCelular("F06-insignias-fliperama", "fliperama"),
};

/** A área do desenho da cena (o SVG tem a proporção do painel; o desenho, 320 x 200, fica centrado nele). */
async function desenhoDaCena(pagina) {
  return pagina.locator("[data-cena]").first().evaluate((el) => {
    const svg = el.tagName.toLowerCase() === "svg" ? el : el.querySelector("svg");
    const caixa = svg.getBoundingClientRect();
    const vista = svg.viewBox.baseVal;
    const proporcao = vista && vista.width ? vista.width / vista.height : 1.6;
    const largura = Math.min(caixa.width, caixa.height * proporcao);
    const altura = largura / proporcao;
    return { x: caixa.x + (caixa.width - largura) / 2, y: caixa.y + (caixa.height - altura) / 2, width: largura, height: altura };
  });
}

/** As soluções dos chamados da Depuração, as mesmas que a jornada dos testes usa. */
const CHAMADO_DA_AGENDA = JSON.parse(readFileSync(path.join(RAIZ, "testes", "chamados-jornadas.json"), "utf8"))["6"].contrato;

/** Abre o chamado da agenda do Salão Girassol (Depuração, U6, fase 2) no celular, já na etapa de trabalho, com as falas de entrada passadas. */
async function abrirChamadoDaAgenda(id, tema, descricao) {
  const fase = "logica-depuracao-u6-f2";
  // `mudou: true`: a mensagem de mudança de pedido da cliente não aparece no meio da tomada (e o conserto simples não fecha requisito nenhum).
  const t = await abrirTomada({ id, formato: "celular", descricao, progresso: progressoNaFase(fase, ["sites", "logica"], { objetivoAtual: 0, contrato: { etapa: "trabalho", escolha: CHAMADO_DA_AGENDA.escolha, tentativas: 0, mudou: true, tempoMs: 0, entregue: false } }, { tema }), rota: `/fase/${fase}`, esperar: "[data-jogo-fase]" });
  await esperarPronto(t.pagina);
  await continuarFalas(t.pagina, 12);
  await fecharBalao(t.pagina);
  return t;
}

/**
 * A investigação e o conserto do chamado da agenda, no celular (V06 no Doce, F02 no Fliperama).
 * Marcas: `pausou` (o programa parado na linha 3), `pausou-2` (a segunda pausa, no pedido das 10h),
 * `observou` (o Observar com os valores da segunda pausa), `selecionou` e `consertou` (o trecho errado
 * selecionado e apagado) e `teste-verde-1`... (cada caso de teste que fica verde).
 * Os casos entram um por vez (escrever, adicionar, rodar): assim cada teste fica verde num momento seu.
 */
async function chamadoDaAgenda(id, tema) {
  const t = await abrirChamadoDaAgenda(id, tema, `O chamado da agenda do Salão Girassol no celular (${tema === "doce" ? "Doce" : "Fliperama"}): ponto de parada, o programa pausado, o Observar, o conserto e os casos de teste ficando verdes, um por vez`);
  const { pagina } = t;
  const pronto = () => esperarPronto(pagina, 30000);
  const mudo = async (alvo) => {
    await alvo.tap({ timeout: 8000 });
    await pronto();
  };
  const linha3 = pagina.locator("[data-editor-snippet] .cm-lineNumbers .cm-gutterElement", { hasText: /^3$/ });
  const abaDeFontes = (nome) => pagina.getByRole("tablist", { name: "Mostrar na aba Fontes" }).getByRole("tab", { name: nome, exact: true });
  const retomar = pagina.locator('[data-controle-depurador="retomar"]:visible').first();
  const pausado = pagina.getByText("Pausado: o código fica só para ler", { exact: false }).first();
  const executar = pagina.locator("[data-executar-snippet]");
  const esperarPausa = async () => {
    await abaDeFontes("Snippet").waitFor();
    await pagina.waitForFunction(() => { const b = document.querySelector('[data-controle-depurador="retomar"]'); return b && !b.disabled; }, null, { timeout: 15000, polling: 40 });
    await doisQuadros(pagina);
  };
  const estaPausado = () => pagina.evaluate(() => { const b = [...document.querySelectorAll('[data-controle-depurador="retomar"]')].find((el) => el.getBoundingClientRect().width > 0); return Boolean(b && !b.disabled); });
  const ateOFim = async (toque) => {
    for (let i = 0; i < 8 && (await estaPausado()); i++) {
      // O balão do computadorzinho do jogo abre em cima dos controles quando um requisito é cumprido.
      await continuarFalas(pagina, 12);
      await fecharBalao(pagina);
      if (toque) await t.tocar(retomar, { pausa: 150 });
      else await retomar.tap({ timeout: 8000 });
      await t.esperar(350);
    }
    await pronto();
  };

  // A cena recolhida deixa espaço para o código (em pé, a cena aberta aperta o editor).
  if (await pagina.locator('[data-area-trabalho="cena"]').isVisible().catch(() => false)) await mudo(pagina.locator("[data-alternar-cena]"));
  await mudo(pagina.locator('[data-abas-composicao] [data-segmento="snippet"]'));
  await fecharBalao(pagina);

  // Fora da gravação: a investigação inteira uma vez. O requisito "reproduzir o defeito" fica cumprido e o
  // computadorzinho do jogo comemora agora (no celular o balão dele abre sozinho, em cima do código).
  await mudo(linha3);
  await mudo(abaDeFontes("Depurador"));
  const abaObservar = pagina.getByRole("tablist", { name: "Painéis do depurador" }).getByRole("tab", { name: "Observar", exact: true });
  if (await abaObservar.isVisible().catch(() => false)) await mudo(abaObservar);
  for (const expressao of ["pedido.horario", "agenda[i].horario === pedido.horario"]) {
    await pagina.locator("[data-campo-observar]:visible").first().fill(expressao);
    await mudo(pagina.locator("[data-adicionar-observacao]:visible").first());
  }
  await pagina.evaluate(() => document.activeElement?.blur());
  await mudo(executar);
  await t.esperar(600);
  await ateOFim(false);
  await continuarFalas(pagina, 12);
  await fecharBalao(pagina);
  // Tira o ponto de parada e volta ao Snippet: a tomada começa com o código limpo.
  await mudo(abaDeFontes("Snippet"));
  await mudo(linha3);
  await pagina.locator("[data-editor-snippet] .cm-scroller").evaluate((el) => { el.scrollTop = 0; el.setAttribute("data-video-rola", ""); });
  await pagina.evaluate(() => document.activeElement?.blur());
  await fecharBalao(pagina);
  await t.esperar(700);

  await t.iniciar();
  await t.caixa("codigo", pagina.locator("[data-editor-snippet]").first());
  await t.esperar(800);
  // 1) O ponto de parada e a pausa.
  t.marcar("ponto");
  await t.tocar(linha3, { pausa: 250 });
  await pronto();
  await t.esperar(600);
  t.marcar("executar");
  await t.tocar(executar, { pausa: 250 });
  await esperarPausa();
  t.marcar("pausou");
  await t.caixa("linha-pausada", pagina.locator("[data-editor-snippet] .cm-line").nth(2));
  await t.caixa("aviso", pausado);
  await t.esperar(1600);
  // A segunda pausa: o pedido das 10h (a agenda já tem a Bia às 10h, na segunda posição).
  await t.tocar(retomar, { pausa: 250 });
  await t.esperar(300);
  await esperarPausa();
  t.marcar("pausou-2");
  await t.esperar(900);
  // 2) O Observar: o horário pedido é 10 e a comparação deu false (o programa só olhou a primeira marcação).
  await t.tocar(abaDeFontes("Depurador"), { pausa: 250 });
  await pronto();
  if (await abaObservar.isVisible().catch(() => false) && (await abaObservar.getAttribute("aria-selected")) !== "true") await t.tocar(abaObservar, { pausa: 200 });
  await pagina.waitForFunction(() => [...document.querySelectorAll("[data-observacao]")].filter((el) => el.getBoundingClientRect().width > 0).every((el) => el.querySelector("[data-valor-observado=valor]")), null, { timeout: 10000, polling: 40 });
  await doisQuadros(pagina);
  t.marcar("observou");
  await t.caixa("observado", pagina.locator('[data-observacao="agenda[i].horario === pedido.horario"]:visible').first());
  await t.caixa("observados", pagina.locator("[data-observacao]:visible").first().locator(".."));
  const valores = await pagina.locator("[data-observacao]:visible").evaluateAll((els) => els.map((el) => `${el.getAttribute("data-observacao")} = ${el.querySelector("[data-valor-observado=valor]")?.textContent.trim()}`));
  await t.esperar(1800);
  await ateOFim(true);
  await continuarFalas(pagina, 12);
  await fecharBalao(pagina);
  // 3) O conserto: o trecho do "else" que marca a cliente já na primeira volta sai do código.
  await t.tocar(abaDeFontes("Snippet"), { pausa: 250 });
  await pronto();
  await t.tocar(linha3, { pausa: 200 });
  await pronto();
  await t.esperar(400);
  const pontos = await pagina.evaluate(() => {
    const linhas = [...document.querySelectorAll("[data-editor-snippet] .cm-content .cm-line")];
    const rolo = document.querySelector("[data-video-rola]");
    const quinta = linhas[4];
    const oitava = linhas[7];
    if (rolo && quinta) rolo.scrollTop += quinta.getBoundingClientRect().top - rolo.getBoundingClientRect().top - 70;
    const ponto = (linha, depoisDe) => {
      const andador = document.createTreeWalker(linha, NodeFilter.SHOW_TEXT);
      let resto = depoisDe === null ? linha.textContent.length : linha.textContent.indexOf(depoisDe) + depoisDe.length;
      let no = andador.nextNode();
      let ultimo = no;
      while (no) {
        if (resto <= no.textContent.length) break;
        resto -= no.textContent.length;
        ultimo = no;
        no = andador.nextNode();
      }
      const alvo = no ?? ultimo;
      const faixa = document.createRange();
      faixa.setStart(alvo, Math.min(resto, alvo.textContent.length));
      faixa.collapse(true);
      const caixa = faixa.getBoundingClientRect();
      return { x: caixa.x, y: caixa.y + caixa.height / 2 };
    };
    return { textos: [quinta.textContent, oitava.textContent], de: ponto(quinta, "}"), ate: ponto(oitava, null) };
  });
  if (!/else/.test(pontos.textos[0])) throw new Error(`${id}: a linha 5 não é a do else (${pontos.textos[0]})`);
  await t.esperar(500);
  await pagina.mouse.click(pontos.de.x + 1, pontos.de.y);
  await pagina.keyboard.down("Shift");
  await pagina.mouse.click(pontos.ate.x + 1, pontos.ate.y);
  await pagina.keyboard.up("Shift");
  await doisQuadros(pagina);
  t.marcar("selecionou");
  await t.caixa("trecho", pagina.locator("[data-editor-snippet] .cm-line").nth(5));
  await t.esperar(900);
  await t.tecla("Backspace");
  await pronto();
  await doisQuadros(pagina);
  t.marcar("consertou");
  await pagina.evaluate(() => document.activeElement?.blur());
  const codigo = await pagina.locator("[data-editor-snippet] .cm-content").evaluate((el) => [...el.querySelectorAll(".cm-line")].map((linha) => linha.textContent).join("\n"));
  await t.esperar(1500);
  await fecharBalao(pagina);
  // 4) Os testes: o caso que já vinha na lista e mais três, um por vez; o último é o do horário repetido.
  await t.tocar(pagina.locator('[data-abas-composicao] [data-segmento="testes"]'), { pausa: 250 });
  await pronto();
  await fecharBalao(pagina);
  await t.caixa("casos", pagina.locator("[data-casos-de-teste]").first());
  const lista = pagina.locator("[data-lista-casos]").first().locator("..");
  await lista.evaluate((el) => el.setAttribute("data-video-casos", ""));
  const rodar = pagina.locator("[data-rodar-casos]");
  const verde = async (indice) => {
    await pagina.locator(`[data-caso="${indice}"][data-situacao-caso="passou"]`).waitFor({ timeout: 15000 });
    await doisQuadros(pagina);
    t.marcar(`teste-verde-${indice + 1}`);
    await t.caixa(`caso-${indice + 1}`, pagina.locator(`[data-caso="${indice}"]`).first());
  };
  const ana = '{ horario: 9, cliente: "Ana" }';
  const bia = '{ horario: 10, cliente: "Bia" }';
  const novos = [
    { entrada: `[${ana}, ${bia}], { horario: 9, cliente: "Caio" }`, esperado: `[${ana}, ${bia}]` },
    { entrada: `[${ana}, ${bia}], { horario: 11, cliente: "Cris" }`, esperado: `[${ana}, ${bia}, { horario: 11, cliente: "Cris" }]` },
    // O defeito do chamado: a terça, com as 10h já ocupadas pela Bia na segunda posição.
    { entrada: `[${ana}, ${bia}], { horario: 10, cliente: "Dani" }`, esperado: `[${ana}, ${bia}]` },
  ];
  await t.esperar(700);
  t.marcar("rodar-1");
  await t.tocar(rodar, { pausa: 250 });
  await verde(0);
  await t.esperar(1100);
  for (const [n, caso] of novos.entries()) {
    await pagina.locator("[data-entrada-nova]").fill(caso.entrada);
    await pagina.locator("[data-esperado-novo]").fill(caso.esperado);
    await t.esperar(250);
    await t.tocar(pagina.locator("[data-adicionar-caso]"), { pausa: 200 });
    await pronto();
    await pagina.evaluate(() => document.activeElement?.blur());
    // O caso novo entra no fim da lista: ela desce para ele aparecer.
    await t.rolarSuave("[data-video-casos]", { dy: 400, ms: 350, linear: false });
    await t.esperar(450);
    t.marcar(`pendente-${n + 2}`);
    await t.caixa(`caso-pendente-${n + 2}`, pagina.locator(`[data-caso="${n + 1}"]`).first());
    await t.esperar(500);
    t.marcar(`rodar-${n + 2}`);
    await t.tocar(rodar, { pausa: 250 });
    await verde(n + 1);
    await t.esperar(1100);
  }
  await t.esperar(1500);
  const situacoes = await pagina.locator("[data-caso]").evaluateAll((els) => els.map((el) => el.getAttribute("data-situacao-caso")));
  return t.terminar({ tema, valoresObservados: valores, codigoDepoisDoConserto: codigo, situacoesDosCasos: situacoes });
}

/** O mundo de noite no celular, do começo até a Ilha Lógica, sem chegar nas ilhas em construção. */
async function mundoDeNoiteNoCelular(id, tema) {
  const t = await abrirTomada({ id, formato: "celular", descricao: `O mundo de noite no celular em pé (${tema === "doce" ? "Doce" : "Fliperama"}): Porto da revisão, Origens, Sites e Lógica, rolado com o dedo, sem chegar nas ilhas em construção`, progresso: alunoNoMeio({ tema }), rota: "/?hora=22", esperar: "[data-mapa=mundo]", armazenamento: semAceno() });
  const { pagina } = t;
  await pagina.locator("[data-mascote-no-mapa]").first().waitFor();
  await pagina.evaluate((s) => { document.querySelector(s).scrollLeft = 0; }, MUNDO);
  await t.esperar(2200);
  // Até onde dá para rolar sem a primeira ilha em construção (Páginas vivas) entrar na tela.
  const limite = await pagina.evaluate(() => {
    const arte = document.querySelector('[data-ilha-arte="paginas-vivas"]')?.getBoundingClientRect();
    return arte ? arte.x - window.innerWidth - 40 : 300;
  });
  await t.iniciar();
  await caixasDasIlhas(t);
  await t.esperar(1500);
  for (let arrasto = 1; arrasto <= 5; arrasto++) {
    const sobra = limite - (await pagina.evaluate((s) => document.querySelector(s).scrollLeft, MUNDO));
    if (sobra < 50) break;
    t.marcar(`arrasto:${arrasto}`);
    const y = 440 + (arrasto % 2) * 40;
    await t.arrastarDedo({ x: 330, y }, { x: 330 - Math.min(170, sobra * 0.42), y }, 700);
    await t.esperar(1400);
  }
  // Se o embalo passou do limite, a tomada não serve: o gravar.mjs tenta de novo.
  const rolado = await pagina.evaluate((s) => document.querySelector(s).scrollLeft, MUNDO);
  if (rolado > limite + 30) throw new Error(`${id}: o mundo rolou até ${Math.round(rolado)} px e uma ilha em construção entrou na tela (limite ${Math.round(limite)})`);
  await caixasDasIlhas(t);
  t.marcar("parou");
  await t.esperar(2500);
  return t.terminar({ tema, rolado: Math.round(rolado), limite: Math.round(limite), periodo: await pagina.locator("[data-mundo-desenho]").getAttribute("data-periodo") });
}

/** O painel de insígnias aberto pelo menu do celular, a partir do mundo. */
async function insigniasNoCelular(id, tema) {
  const t = await abrirTomada({ id, formato: "celular", descricao: `O painel de insígnias no celular em pé (${tema === "doce" ? "Doce" : "Fliperama"})`, progresso: alunoNoMeio({ tema }), rota: "/?hora=22", esperar: "[data-mapa=mundo]", armazenamento: semAceno() });
  const { pagina } = t;
  await pagina.locator("[data-mascote-no-mapa]").first().waitFor();
  await pagina.evaluate((s) => { document.querySelector(s).scrollLeft = 0; }, MUNDO);
  await t.esperar(2000);
  await t.iniciar();
  await t.esperar(700);
  t.marcar("menu");
  await t.tocar(pagina.getByRole("button", { name: "Mais opções" }).first(), { pausa: 250 });
  const item = pagina.getByRole("button", { name: /Insígnias/ }).or(pagina.getByRole("link", { name: /Insígnias/ })).or(pagina.getByRole("menuitem", { name: /Insígnias/ })).first();
  await item.waitFor({ timeout: 5000 });
  await t.esperar(500);
  t.marcar("insignias");
  await t.tocar(item, { pausa: 250 });
  await pagina.locator("[data-painel-insignias]").waitFor();
  await t.esperar(500);
  await t.caixa("painel", pagina.locator("[data-painel-insignias]").first());
  t.marcar("painel-aberto");
  await t.esperar(1500);
  // Desce a lista devagar, para mostrar os selos.
  await pagina.locator("[data-painel-insignias]").first().evaluate((el) => {
    let no = el;
    const rola = (candidato) => candidato.scrollHeight > candidato.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(candidato).overflowY);
    const dentro = [el, ...el.querySelectorAll("*")].find(rola);
    while (!dentro && no && !rola(no)) no = no.parentElement;
    (dentro ?? no)?.setAttribute("data-video-rola", "");
  });
  if (await pagina.locator("[data-video-rola]").count()) await t.rolarSuave("[data-video-rola]", { dy: 260, ms: 2500, linear: false });
  await t.esperar(2000);
  return t.terminar({ tema });
}
