// Jornada pelo mapa, com interação real no editor, depurador e casos de teste.
// Uso: node testes/depuracao.mjs [desktop|retrato|paisagem] [1|2|3|4]
import { readFileSync } from 'node:fs';
import { abrir, abrirBalao, fecharBalao, esperarPronto, conferir, errosRelevantes, opcaoDaPrevisao } from './util.mjs';
import { PUBLICADAS, obrigatoriasProntasDaIlha } from './curriculo.mjs';
const modo = process.argv[2] ?? 'desktop', n = process.argv[3] ?? '1';
const id = `logica-depuracao-u${n}`;
const fases = JSON.parse(readFileSync(new URL('./depuracao-jornadas.json', import.meta.url)))[n];
const [largura, altura] = { desktop: [1440,900], retrato: [390,844], paisagem: [844,390] }[modo];
const toque = modo !== 'desktop';
const prontas = [...obrigatoriasProntasDaIlha('sites'), ...obrigatoriasProntasDaIlha('logica').filter(u => !u.id.startsWith('logica-depuracao-') || Number(u.id.at(-1)) < Number(n))].map(u=>u.id);
const ferramentas = [...readFileSync(new URL('../src/ferramentas/ids.ts', import.meta.url),'utf8').matchAll(/^ {2}"([a-z-]+)",$/gm)].map(m=>m[1]);
const progresso = { versao:2, fasesConcluidas:prontas.flatMap(u=>PUBLICADAS[u] ?? []), estrelasPorFase:{}, fasesEmAndamento:{}, faseAtual:null, tema:'doce', temasDesbloqueados:['doce','fliperama'], som:false, missoesDeCampo:{}, apresentacoesVistas:ferramentas, metasVistas:prontas, unidadesComemoradas:prontas, ilhasComemoradas:['sites'], posicaoNoMapa:{}, mapaDesbloqueado:false, proporcaoPrevia:0.4 };
const {pagina,navegador,erros} = await abrir({largura,altura,toque,progresso,rota:'/ilha/logica',esperar:'[data-mapa=ilha]'});
const pronto = () => esperarPronto(pagina,30000);
async function tocar(el) { await el.scrollIntoViewIfNeeded(); await (toque ? el.tap() : el.click()); await pronto(); }
async function conversa(nome) { if(toque) await abrirBalao(pagina); await tocar(pagina.getByRole('button',{name:nome}).first()); }
async function area(a) { if(toque) await fecharBalao(pagina); const aba=pagina.locator(`[data-abas-composicao] [data-segmento="${a}"]`); if(await aba.count() && await aba.getAttribute('aria-selected')!=='true') await tocar(aba); }
async function fontes(nome='Snippet') {
 if (modo==='retrato' && nome==='Depurador' && await pagina.locator('[data-alternar-cena]').count() && await pagina.locator('[data-area-trabalho="cena"]').isVisible()) {
  await fecharBalao(pagina);await tocar(pagina.locator('[data-alternar-cena]'));
 }
 await area('snippet');
 const tab=pagina.getByRole('tab',{name:'Fontes',exact:true});if(await tab.isVisible().catch(()=>false))await tocar(tab);
 const aba=pagina.getByRole('tablist',{name:'Mostrar na aba Fontes'}).getByRole('tab',{name:nome,exact:true});if(await aba.isVisible().catch(()=>false))await tocar(aba);
}
async function edit(codigo) {
 await fontes();if(toque)await fecharBalao(pagina);
 const ed=pagina.locator('[data-editor-snippet] .cm-content');await ed.focus();
 await pagina.keyboard.press('ControlOrMeta+A');await pagina.keyboard.insertText(codigo);await pronto();
}
let observados = new Map();
async function capturarObservados() {
 const valores = await pagina.locator('[data-observacao]').evaluateAll(els => els.flatMap(el => { const v = el.querySelector('[data-valor-observado=valor]'); return v ? [[el.getAttribute('data-observacao'), v.textContent.trim()]] : []; }));
 for (const [expressao, valor] of valores) observados.set(expressao, [...(observados.get(expressao) ?? []), valor]);
}
async function acoes(lista) {
 for(const a of lista){
  if(a.tipo==='responderPrevisao'){if(toque)await abrirBalao(pagina);await tocar(await opcaoDaPrevisao(pagina));}
  else if(a.tipo==='definirSnippet')await edit(a.codigo);
  else if(a.tipo==='executarSnippet'){await fontes();await tocar(pagina.locator('[data-executar-snippet]'));}
  else if(a.tipo==='alternarPontoDeParada'){
   await fontes();await tocar(pagina.locator('[data-editor-snippet] .cm-lineNumbers .cm-gutterElement',{hasText:new RegExp(`^${a.linha}$`)}));
  }
  else if(a.tipo==='controlarDepurador'){
   await fontes('Depurador');if(toque)await fecharBalao(pagina);
   await tocar(pagina.locator(`[data-controle-depurador="${a.controle}"]:visible`).first());
   if (a.controle==='entrar') {
    const pilha=pagina.getByRole('tablist',{name:'Painéis do depurador'}).getByRole('tab',{name:'Pilha',exact:true});
    if (await pilha.isVisible().catch(()=>false)) await tocar(pilha);
    conferir(await pagina.locator('[data-quadro-pilha]').count()>=2,'Entrar abriu a chamada sobre quem chamou');
   }
  }
  else if(a.tipo==='observar'){
   await fontes('Depurador');
   const aba=pagina.getByRole('tablist',{name:'Painéis do depurador'}).getByRole('tab',{name:'Observar',exact:true});if(await aba.isVisible().catch(()=>false))await tocar(aba);
   if(toque)await fecharBalao(pagina);
   await pagina.locator('[data-campo-observar]:visible').first().fill(a.expressao);
   await tocar(pagina.locator('[data-adicionar-observacao]:visible').first());
  }
  else if(a.tipo==='rodarCasos'){await area('testes');await tocar(pagina.locator('[data-rodar-casos]'));}
  else if(a.tipo==='escreverCaso'){await area('testes');await pagina.locator('[data-entrada-nova]').fill(a.entrada);await pagina.locator('[data-esperado-novo]').fill(a.esperado);await tocar(pagina.locator('[data-adicionar-caso]'));}
  else throw Error(`Ação sem UI: ${a.tipo}`);
  if (['executarSnippet','controlarDepurador','observar'].includes(a.tipo)) {
   const depurador = pagina.getByRole('tablist',{name:'Mostrar na aba Fontes'}).getByRole('tab',{name:'Depurador',exact:true});
   if (await depurador.isVisible().catch(()=>false)) await fontes('Depurador');
   const aba = pagina.getByRole('tablist',{name:'Painéis do depurador'}).getByRole('tab',{name:'Observar',exact:true});
   if (await aba.isVisible().catch(()=>false)) await tocar(aba);
   await pagina.waitForFunction(() => [...document.querySelectorAll('[data-observacao]')].every(el => el.querySelector('[data-valor-observado]')), null, {timeout:10000});
   await capturarObservados();
  }
 }
}
async function introducao(){for(let i=0;i<8;i++){if(toque)await abrirBalao(pagina);const b=pagina.getByRole('button',{name:/^(Continuar|Vamos lá!)$/}).first();if(!await b.isVisible().catch(()=>false))break;await tocar(b);}}
const ponto=pagina.locator(`[data-unidade="${id}"]`);
conferir(await ponto.getAttribute('data-estado')==='disponivel','unidade disponível no mapa');await tocar(ponto);await tocar(pagina.getByRole('dialog').getByRole('button',{name:'Jogar',exact:true}));
for(const fase of fases){
 await pagina.locator(`[data-jogo-fase="${fase.id}"]`).waitFor();await pronto();
 const meta=pagina.locator('[data-meta]');if(await meta.isVisible().catch(()=>false))await tocar(pagina.getByRole('button',{name:fase.tipo==='desafio'?'Começar o desafio':'Bora!'}));
 await introducao();
 if(fase.tipo==='desafio'){
  for(const parte of fase.partes)await acoes(parte.solucaoDeTeste);
 }else{
  for(const [i,o] of fase.objetivos.entries()){
   await pagina.waitForFunction(alvo=>document.querySelector('[data-jogo-fase]')?.getAttribute('data-objetivo-atual')===alvo,o.id);
   if(o.modo==='sozinho'){if(toque)await abrirBalao(pagina);conferir(!await pagina.getByRole('button',{name:/^(Próximo objetivo|Ver resultado)$/}).first().isVisible().catch(()=>false),`${o.id}: sozinho exige trabalho`);}
   observados = new Map();
   await acoes(o.solucaoDeTeste);
   // Com valor, a observação precisa vir de uma pausa real, e não só da lista do Watch.
   const vs=o.validador.tipo==='todos'?o.validador.validadores:[o.validador];
   for(const v of vs.filter(v=>v.tipo==='observou'&&v.valor!==undefined)){
    conferir((observados.get(v.expressao) ?? []).some(valor => valor.includes(String(v.valor))),`Observar mostrou ${v.expressao} = ${v.valor} durante a investigação`);
   }
   if(n==='4' && fase.cena && vs.some(v => v.tipo==='observou' && v.expressao==='agua.ligado')) {
    if(toque)await fecharBalao(pagina);
    if(modo==='paisagem')await area('cena');
    if(modo==='retrato' && !await pagina.locator('[data-area-trabalho="cena"]').isVisible())await tocar(pagina.locator('[data-alternar-cena]'));
    const cena=pagina.locator(`[data-cena="${fase.cena.id}"]`);
    await cena.waitFor({state:'visible'});
    const tempo = await cena.getAttribute('data-tempo');
    const tocando = await pagina.locator('[data-area-cena]').getAttribute('data-tocando');
    const ligado = await cena.locator('[data-dispositivo="agua"]').getAttribute('data-ligado');
    conferir(tempo===(o.id==='observar-sozinho'?'2000':'0'),`cena mostra o instante da pausa: esperado ${o.id==='observar-sozinho'?'2000':'0'} ms; desenho em ${tempo} ms, tocando=${tocando}, agua.ligado=${ligado}`);
    for(const v of vs.filter(v=>v.tipo==='observou' && v.expressao.includes('.'))) {
     const [id,prop]=v.expressao.split('.');
     if(fase.cena.dispositivos.some(d=>d.id===id))conferir(await cena.locator(`[data-dispositivo="${id}"]`).getAttribute(`data-${prop}`)===String(v.valor),`cena e Observar concordam: ${v.expressao} = ${v.valor}`);
    }
   }
   if(i<fase.objetivos.length-1)await conversa('Próximo objetivo');
  }
 }
 await conversa('Ver resultado');await pagina.locator('[data-conclusao]').waitFor();await pagina.locator('[data-modal-assentado="sim"]').waitFor();
 for(let i=0;i<fase.conclusao.length;i++)await tocar(pagina.getByRole('dialog').getByRole('button',{name:'Continuar',exact:true}));
 await tocar(pagina.getByRole('button',{name:fase.tipo==='desafio'?'Voltar pra ilha':'Próxima fase',exact:true}));
}
await pagina.locator('[data-mapa=ilha]').waitFor();conferir(await pagina.locator(`[data-unidade="${id}"]`).getAttribute('data-estado')==='concluida','unidade concluída e salva');
conferir(errosRelevantes(erros).length===0,`console limpo: ${errosRelevantes(erros).join(' | ')}`);
await navegador.close();console.log(`depuracao.mjs ${modo} U${n}: ok`);
