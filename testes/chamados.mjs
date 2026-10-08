// Jornada real pelo mapa dos chamados da Depuração (U5 e U6), nos três layouts:
// o aquecimento (com a cena no instante da pausa) e o contrato inteiro, do
// briefing ao relatório, com o diagnóstico por cartões, a mudança de pedido no
// meio e a entrega sem comemoração de fim de ilha. As soluções vêm de
// testes/chamados-jornadas.json (o teste de conteúdo confere que ele acompanha o TS).
// Uso: node testes/chamados.mjs [desktop|retrato|paisagem] [5|6]
import { readFileSync } from 'node:fs';
import { abrir, abrirBalao, continuarFalas, fecharBalao, esperarPronto, conferir, errosRelevantes, opcaoDaPrevisao } from './util.mjs';
import { PUBLICADAS, obrigatoriasProntasDaIlha } from './curriculo.mjs';
const modo = process.argv[2] ?? 'desktop', n = process.argv[3] ?? '5';
const UNIDADE = `logica-depuracao-u${n}`;
const JORNADA = JSON.parse(readFileSync(new URL('./chamados-jornadas.json', import.meta.url)))[n];
const [largura, altura] = { desktop: [1440,900], retrato: [390,844], paisagem: [844,390] }[modo];
const toque = modo !== 'desktop';
// O que a cena do aquecimento deve mostrar no instante da pausa e no fim do conserto: o visor da
// registradora do mercadinho (U5) e a tela do aplicativo do salão (U6).
const CENA = {
 5: { dispositivo: 'caixa', nome: 'o visor', pausa: ['1000', 'R$ 45'], fim: 'R$ 25', guiado: 'reproduzir-guiado', conserto: 'conserto-guiado' },
 6: { dispositivo: 'tela', nome: 'a tela', pausa: ['1000', 'Taxa R$ 10'], fim: 'Taxa R$ 10', guiado: 'regressao-guiado', conserto: 'conserto-guiado' },
}[n];
const depoisDeste = Number(n) === 5 ? ['logica-depuracao-u5', 'logica-depuracao-u6'] : ['logica-depuracao-u6'];
const prontas = [...obrigatoriasProntasDaIlha('sites'), ...obrigatoriasProntasDaIlha('logica')].map(u => u.id).filter(id => !depoisDeste.includes(id) && id !== 'logica-programa-de-verdade-u1');
const ferramentas = [...readFileSync(new URL('../src/ferramentas/ids.ts', import.meta.url), 'utf8').matchAll(/^ {2}"([a-z-]+)",$/gm)].map(m => m[1]);
const progresso = { versao:2, fasesConcluidas:prontas.flatMap(u => PUBLICADAS[u] ?? []), estrelasPorFase:{}, fasesEmAndamento:{}, faseAtual:null, tema:'doce', temasDesbloqueados:['doce','fliperama'], som:false, missoesDeCampo:{}, apresentacoesVistas:ferramentas, metasVistas:prontas, unidadesComemoradas:prontas, ilhasComemoradas:['sites'], posicaoNoMapa:{}, mapaDesbloqueado:false, proporcaoPrevia:0.4 };
const { pagina, navegador, erros } = await abrir({ largura, altura, toque, progresso, rota:'/ilha/logica', esperar:'[data-mapa=ilha]' });
const pronto = () => esperarPronto(pagina, 30000);
async function tocar(el) { await el.scrollIntoViewIfNeeded(); await (toque ? el.tap() : el.click()); await pronto(); }
const modalAssentado = () => pagina.waitForSelector('[data-modal-assentado="sim"]');
async function conversa(nome) { if (toque) await abrirBalao(pagina); const b = pagina.getByRole('button', { name: nome }).first(); await b.waitFor({ timeout: 15000 }); await tocar(b); }
async function area(a) { if (toque) await fecharBalao(pagina); const aba = pagina.locator(`[data-abas-composicao] [data-segmento="${a}"]`); if (await aba.count() && await aba.getAttribute('aria-selected') !== 'true') await tocar(aba); }
async function verCena() {
 if (modo === 'paisagem') await area('cena');
 if (modo === 'retrato' && !await pagina.locator('[data-area-trabalho="cena"]').isVisible()) { await fecharBalao(pagina); await tocar(pagina.locator('[data-alternar-cena]')); }
 if (toque) await fecharBalao(pagina);
}
/** Em pé, a cena aberta em cima aperta o código: recolhe antes de mexer no editor. */
async function recolherCena() {
 if (modo !== 'retrato' || !await pagina.locator('[data-area-trabalho="cena"]').isVisible().catch(() => false)) return;
 await fecharBalao(pagina); await tocar(pagina.locator('[data-alternar-cena]'));
}
async function fontes(nome = 'Snippet') {
 if (modo === 'retrato' && nome === 'Depurador') await recolherCena();
 await area('snippet');
 const tab = pagina.getByRole('tab', { name: 'Fontes', exact: true }); if (await tab.isVisible().catch(() => false)) await tocar(tab);
 const aba = pagina.getByRole('tablist', { name: 'Mostrar na aba Fontes' }).getByRole('tab', { name: nome, exact: true }); if (await aba.isVisible().catch(() => false)) await tocar(aba);
}
async function edit(codigo) {
 await recolherCena(); await fontes(); if (toque) await fecharBalao(pagina);
 const ed = pagina.locator('[data-editor-snippet] .cm-content'); await ed.focus();
 await pagina.keyboard.press('ControlOrMeta+A'); await pagina.keyboard.insertText(codigo); await pronto();
}
let observados = new Map();
async function capturarObservados() {
 const valores = await pagina.locator('[data-observacao]').evaluateAll(els => els.flatMap(el => { const v = el.querySelector('[data-valor-observado=valor]'); return v ? [[el.getAttribute('data-observacao'), v.textContent.trim()]] : []; }));
 for (const [expressao, valor] of valores) observados.set(expressao, [...(observados.get(expressao) ?? []), valor]);
}
async function acoes(lista) {
 for (const a of lista) {
  if (process.env.DEPURAR) console.log('acao', a.tipo, a.passo ?? a.linha ?? a.controle ?? '');
  if (a.tipo === 'responderPrevisao') { if (toque) await abrirBalao(pagina); await tocar(await opcaoDaPrevisao(pagina)); }
  else if (a.tipo === 'definirSnippet') await edit(a.codigo);
  else if (a.tipo === 'executarSnippet') { await fontes(); await tocar(pagina.locator('[data-executar-snippet]')); }
  else if (a.tipo === 'alternarPontoDeParada') { await recolherCena(); await fontes(); await tocar(pagina.locator('[data-editor-snippet] .cm-lineNumbers .cm-gutterElement', { hasText: new RegExp(`^${a.linha}$`) })); }
  else if (a.tipo === 'controlarDepurador') { await fontes('Depurador'); if (toque) await fecharBalao(pagina); await tocar(pagina.locator(`[data-controle-depurador="${a.controle}"]:visible`).first()); }
  else if (a.tipo === 'observar') {
   await fontes('Depurador');
   const aba = pagina.getByRole('tablist', { name: 'Painéis do depurador' }).getByRole('tab', { name: 'Observar', exact: true }); if (await aba.isVisible().catch(() => false)) await tocar(aba);
   if (toque) await fecharBalao(pagina);
   await pagina.locator('[data-campo-observar]:visible').first().fill(a.expressao);
   await tocar(pagina.locator('[data-adicionar-observacao]:visible').first());
  }
  else if (a.tipo === 'porPasso') { await area('plano'); await tocar(pagina.locator(`[data-escolher-passo="${a.passo}"]`).first()); await tocar(pagina.locator(`[data-por-aqui="${a.grupo ?? 'plano'}:fim"]`)); }
  else if (a.tipo === 'levarPlanoProCodigo') { await area('plano'); await tocar(pagina.locator('[data-levar-plano]')); }
  else if (a.tipo === 'escreverCaso') { await area('testes'); await pagina.locator('[data-entrada-nova]').fill(a.entrada); await pagina.locator('[data-esperado-novo]').fill(a.esperado); await tocar(pagina.locator('[data-adicionar-caso]')); }
  else if (a.tipo === 'rodarCasos') { await area('testes'); await tocar(pagina.locator('[data-rodar-casos]')); }
  else throw Error(`Ação sem UI: ${a.tipo}`);
  if (['executarSnippet', 'controlarDepurador', 'observar'].includes(a.tipo) && !await pagina.locator('[data-conversa-cliente]').isVisible().catch(() => false)) {
   const depurador = pagina.getByRole('tablist', { name: 'Mostrar na aba Fontes' }).getByRole('tab', { name: 'Depurador', exact: true });
   if (await depurador.isVisible().catch(() => false)) await fontes('Depurador');
   const aba = pagina.getByRole('tablist', { name: 'Painéis do depurador' }).getByRole('tab', { name: 'Observar', exact: true });
   if (await aba.isVisible().catch(() => false)) await tocar(aba);
   await pagina.waitForFunction(() => [...document.querySelectorAll('[data-observacao]')].every(el => el.querySelector('[data-valor-observado]')), null, { timeout: 10000 });
   await capturarObservados();
  }
 }
}
/** Valores com número ou texto precisam ter sido vistos numa pausa real, não só na lista do Observar. */
function conferirObservados(rotulo, validador) {
 const vs = validador.tipo === 'todos' ? validador.validadores : [validador];
 for (const v of vs.filter(v => v.tipo === 'observou' && v.valor !== undefined)) {
  conferir((observados.get(v.expressao) ?? []).some(valor => valor.includes(String(v.valor))), `${modo} U${n} ${rotulo}: Observar mostrou ${v.expressao} = ${v.valor} durante a investigação`);
 }
}
async function introducao() { for (let i = 0; i < 8; i++) { if (await pagina.locator('[data-conversa-cliente]').isVisible().catch(() => false)) return; if (toque) await abrirBalao(pagina); const b = pagina.getByRole('button', { name: /^(Continuar|Vamos lá!)$/ }).first(); if (!await b.isVisible().catch(() => false)) return; await tocar(b); } }
async function ouvirCliente() {
 await pagina.locator('[data-conversa-cliente]').waitFor(); await modalAssentado();
 for (let i = 0; i < 12; i++) {
  const fim = pagina.locator('[data-conversa-fim]');
  if (await fim.isVisible().catch(() => false)) { await tocar(fim); break; }
  const continuar = pagina.locator('[data-conversa-continuar]');
  if (!await continuar.isVisible().catch(() => false)) break;
  await tocar(continuar);
 }
 await pagina.locator('[data-conversa-cliente]').waitFor({ state: 'detached' }); await pronto();
}
async function conclusao(botao, antesDeSair = async () => {}) {
 await pagina.locator('[data-conclusao]').waitFor(); await modalAssentado();
 const continuar = pagina.getByRole('dialog').getByRole('button', { name: 'Continuar', exact: true });
 for (let i = 0; i < 6 && await continuar.isVisible().catch(() => false); i++) await tocar(continuar);
 await antesDeSair();
 await tocar(pagina.getByRole('button', { name: botao, exact: true }));
}
const objetivoAtual = () => pagina.locator('[data-jogo-fase]').getAttribute('data-objetivo-atual');
async function lerCena(id, dispositivo = CENA.dispositivo) {
 await verCena();
 const cena = pagina.locator(`[data-cena="${id}"]`); await cena.waitFor({ state: 'visible' });
 await pagina.locator('[data-area-cena][data-tocando="nao"]').waitFor({ timeout: 15000 });
 const aparelho = cena.locator(`[data-dispositivo="${dispositivo}"]`);
 return { tempo: await cena.getAttribute('data-tempo'), texto: await aparelho.getAttribute('data-texto'), conflitos: await aparelho.getAttribute('data-conflitos') };
}

// ---------------------------------------------------------------- pelo mapa
const ponto = pagina.locator(`[data-unidade="${UNIDADE}"]`);
conferir(await ponto.getAttribute('data-estado') === 'disponivel', `${modo} U${n}: o chamado está disponível no mapa`);
await tocar(ponto);
await tocar(pagina.getByRole('dialog').getByRole('button', { name: 'Jogar', exact: true }));

// ---------------------------------------------------------------- fase 1: o aquecimento, com a cena
await pagina.locator(`[data-jogo-fase="${JORNADA.pratica.id}"]`).waitFor(); await pronto();
const meta = pagina.locator('[data-meta]');
conferir(await meta.isVisible().catch(() => false), `${modo} U${n}: a unidade abre com a meta`);
// A meta tem antes e depois de verdade: a saída do programa do estoque (U5) e a cena da agenda (U6), nunca caixas vazias.
const antesDepois = pagina.locator('[data-meta-antes-depois]');
conferir(await antesDepois.getAttribute('data-meta-antes-depois') === (Number(n) === 5 ? 'saida' : 'cena'), `${modo} U${n}: a meta mostra o antes e o depois (${await antesDepois.getAttribute('data-meta-antes-depois')})`);
if (Number(n) === 5) {
 conferir(await pagina.locator('[data-mini-saida="Antes"] [data-mudou="sim"]').textContent() === "sexta: {arroz: 10, feijao: '64'}", `${modo} U5: no antes, a sexta com o feijão "64" em destaque`);
 conferir(await pagina.locator('[data-mini-saida="Depois"] [data-mudou="sim"]').textContent() === 'sexta: {arroz: 10, feijao: 10}', `${modo} U5: no depois, a sexta certa em destaque`);
} else {
 conferir(await pagina.locator('[data-mini-composicao="Antes"] [data-dispositivo="tela"]').getAttribute('data-conflitos') === '1', `${modo} U6: no antes, a terça com um horário repetido`);
 conferir(await pagina.locator('[data-mini-composicao="Depois"] [data-dispositivo="tela"]').getAttribute('data-conflitos') === '0', `${modo} U6: no depois, nenhum`);
}
await tocar(pagina.getByRole('button', { name: 'Bora!' }));
await introducao();
for (const [i, o] of JORNADA.pratica.objetivos.entries()) {
 await pagina.waitForFunction(alvo => document.querySelector('[data-jogo-fase]')?.getAttribute('data-objetivo-atual') === alvo, o.id);
 if (o.modo === 'sozinho') { if (toque) await abrirBalao(pagina); conferir(!await pagina.getByRole('button', { name: /^(Próximo objetivo|Ver resultado)$/ }).first().isVisible().catch(() => false), `${modo} U${n} ${o.id}: sozinho exige trabalho`); }
 observados = new Map();
 await acoes(o.solucaoDeTeste);
 conferirObservados(o.id, o.validador);
 if (o.id === CENA.guiado) {
  const cena = await lerCena(JORNADA.pratica.cena);
  conferir(cena.tempo === CENA.pausa[0] && cena.texto === CENA.pausa[1], `${modo} U${n}: a cena mostra o instante da pausa: ${cena.tempo} ms, ${CENA.nome} com "${cena.texto}" (esperado ${CENA.pausa[0]} ms, "${CENA.pausa[1]}")`);
 }
 if (o.id === CENA.conserto) {
  const cena = await lerCena(JORNADA.pratica.cena);
  conferir(cena.texto === CENA.fim, `${modo} U${n}: depois do conserto, a cena termina com ${CENA.nome} mostrando "${cena.texto}" (esperado "${CENA.fim}")`);
 }
 if (i < JORNADA.pratica.objetivos.length - 1) await conversa('Próximo objetivo');
}
await conversa('Ver resultado');
await pagina.locator('[data-conclusao]').waitFor(); await modalAssentado();
for (let i = 0; i < 6; i++) {
 const proxima = pagina.getByRole('button', { name: 'Próxima fase', exact: true });
 if (await proxima.isVisible().catch(() => false)) { await tocar(proxima); break; }
 await tocar(pagina.getByRole('dialog').getByRole('button', { name: 'Continuar', exact: true }));
}
conferir(true, `${modo} U${n}: o aquecimento concluído`);

// ---------------------------------------------------------------- fase 2: o contrato
await pagina.locator(`[data-jogo-fase="${JORNADA.contrato.id}"]`).waitFor(); await pronto();
await introducao(); await ouvirCliente();
conferir(await objetivoAtual() === 'contrato-requisitos', `${modo} U${n}: depois do cliente falar, a etapa de requisitos`);
for (const id of JORNADA.contrato.escolha.cartoes) {
 const cartao = pagina.locator(`[data-cartao-requisito="${id}"]`);
 await tocar(cartao.locator('button').first());
 const respostas = JORNADA.contrato.escolha.lacunas[id] ?? [];
 for (const [lacuna, opcao] of respostas.entries()) await tocar(cartao.locator(`[data-lacuna="${lacuna}"]`).nth(opcao));
}
await tocar(pagina.locator('[data-conferir-requisitos]'));
await pagina.locator('[data-requisitos]').waitFor({ state: 'detached' }); await pronto();
conferir(await objetivoAtual() === 'contrato-trabalho', `${modo} U${n}: a lista certa começa o trabalho`);

let mudou = false;
// U6: o contrato tem a tela do aplicativo no balcão; depois do conserto, a terça sai sem horário repetido
// (o antes, com o horário em vermelho, a meta já conferiu: na jornada o programa com defeito fica pausado).
const telaDoContrato = Number(n) === 6 ? { agenda: '0' } : null;
for (const parte of JORNADA.contrato.partes) {
 observados = new Map();
 await acoes(parte.solucaoDeTeste);
 conferirObservados(parte.id, parte.validador);
 // A fila de falas: o conserto que trouxe a mensagem do cliente é comemorado antes dela.
 if (!mudou) await continuarFalas(pagina);
 if (!mudou && await pagina.locator('[data-conversa-cliente]').isVisible().catch(() => false)) {
  mudou = true;
  conferir(JORNADA.contrato.depoisDe.every(id => JORNADA.contrato.partes.findIndex(p => p.id === id) <= JORNADA.contrato.partes.indexOf(parte)), `${modo} U${n}: a mensagem de mudança chega depois do conserto pronto`);
  await ouvirCliente();
 }
 // Depois da mensagem do cliente (que chega logo depois do conserto), a tela.
 if (telaDoContrato && parte.id in telaDoContrato) {
  const cena = await lerCena('salao-recepcao', 'tela');
  conferir(cena.conflitos === telaDoContrato[parte.id], `${modo} U${n} ${parte.id}: a tela do aplicativo mostra ${cena.conflitos} horário(s) repetido(s) na terça (esperado ${telaDoContrato[parte.id]}): "${cena.texto}"`);
 }
}
conferir(mudou, `${modo} U${n}: o cliente mudou o pedido no meio do trabalho`);
await conversa('Ver resultado');

// ---------------------------------------------------------------- a entrega, sem comemoração de fim de ilha
await pagina.locator('[data-relatorio]').waitFor(); await modalAssentado();
const relatorio = (await pagina.locator('[data-relatorio]').textContent()) ?? '';
conferir(relatorio.includes('Requisitos atendidos: 3 de 3') && relatorio.includes('Pedido novo'), `${modo} U${n}: o relatório mostra os 3 pedidos, com o que mudou`);
const casos = (await pagina.locator('[data-relatorio-casos]').textContent()) ?? '';
const [passando, total] = (/(\d+) de (\d+)/.exec(casos) ?? []).slice(1).map(Number);
conferir(total >= 4 && passando === total, `${modo} U${n}: o relatório conta os casos do aluno passando (${passando} de ${total})`);
await tocar(pagina.locator('[data-enviar-relatorio]'));
for (let i = 0; i < 2; i++) await tocar(pagina.locator('[data-reacao-continuar]'));
await pagina.getByLabel('Entrega do trabalho').waitFor({ state: 'detached' });
await pagina.locator('[data-conclusao]').waitFor();
conferir(await pagina.locator('[data-comemoracao-ilha]').count() === 0, `${modo} U${n}: um chamado no meio da ilha não tem a comemoração de fim de ilha`);
await conclusao('Voltar pra ilha', async () => {
 // O Levar pro mundo só aparece quando o arquivo leva todos os aparelhos da cena: a agenda (U6) sim; o estoque, sem cena, não.
 const levar = await pagina.locator('[data-levar-programa]').isVisible().catch(() => false);
 conferir(levar === (Number(n) === 6), `${modo} U${n}: o Levar pro mundo ${Number(n) === 6 ? 'aparece (a agenda sai do jogo)' : 'não aparece (sem cena)'}`);
});
await pagina.locator('[data-mapa=ilha]').waitFor();
conferir(await pagina.locator(`[data-unidade="${UNIDADE}"]`).getAttribute('data-estado') === 'concluida', `${modo} U${n}: chamado concluído e salvo`);
conferir(errosRelevantes(erros).length === 0, `${modo} U${n}: console limpo (${errosRelevantes(erros).join(' | ')})`);
await navegador.close();
console.log(`chamados.mjs ${modo} U${n}: ok`);
