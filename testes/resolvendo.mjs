// Jornada real pelo mapa: cartões, edição, previsões, casos e publicação do progresso.
// Uso: node testes/resolvendo.mjs [desktop|retrato|paisagem] [1|2|3|4]
import { readFileSync } from 'node:fs';
import { abrir, abrirBalao, fecharBalao, esperarPronto, conferir, errosRelevantes, opcaoDaPrevisao } from './util.mjs';
import { PUBLICADAS, obrigatoriasProntasDaIlha } from './curriculo.mjs';
const modo = process.argv[2] ?? 'desktop', n = process.argv[3] ?? '1';
const id = `logica-resolvendo-problemas-u${n}`;
const fases = JSON.parse(readFileSync(new URL('./resolvendo-jornadas.json', import.meta.url)))[n];
const tamanhos = { desktop: [1440,900], retrato: [390,844], paisagem: [844,390] };
const [largura,altura] = tamanhos[modo], toque = modo !== 'desktop';
const prontas = [...obrigatoriasProntasDaIlha('sites'), ...obrigatoriasProntasDaIlha('logica').filter(u => !u.id.startsWith('logica-resolvendo-problemas-') || Number(u.id.at(-1)) < Number(n))].map(u=>u.id);
const ferramentas = [...readFileSync(new URL('../src/ferramentas/ids.ts', import.meta.url),'utf8').matchAll(/^ {2}"([a-z-]+)",$/gm)].map(m=>m[1]);
const progresso = { versao:2, fasesConcluidas:prontas.flatMap(u=>PUBLICADAS[u] ?? []), estrelasPorFase:{}, fasesEmAndamento:{}, faseAtual:null, tema:'doce', temasDesbloqueados:['doce','fliperama'], som:false, missoesDeCampo:{}, apresentacoesVistas:ferramentas, metasVistas:prontas, unidadesComemoradas:prontas, ilhasComemoradas:['sites'], posicaoNoMapa:{}, mapaDesbloqueado:false, proporcaoPrevia:0.4 };
const {pagina,navegador,erros} = await abrir({largura,altura,toque,progresso,rota:'/ilha/logica',esperar:'[data-mapa=ilha]'});
const pronto = () => esperarPronto(pagina,30000);
async function tocar(el) { await el.scrollIntoViewIfNeeded(); await (toque ? el.tap() : el.click()); await pronto(); }
async function conversa(nome) { if(toque) await abrirBalao(pagina); await tocar(pagina.getByRole('button',{name:nome}).first()); }
async function area(a) { if(toque) await fecharBalao(pagina); const aba=pagina.locator(`[data-abas-composicao] [data-segmento="${a}"]`); if(await aba.count() && await aba.getAttribute('aria-selected')!=='true') await tocar(aba); }
async function introducao() { for(let i=0;i<7;i++){if(toque)await abrirBalao(pagina); const b=pagina.getByRole('button',{name:/^(Continuar|Vamos lá!)$/}).first(); if(!await b.isVisible().catch(()=>false))break;await tocar(b);} }
async function edit(codigo){await area('snippet');const aba=pagina.getByRole('tab',{name:'Snippet',exact:true});if(await aba.isVisible().catch(()=>false))await tocar(aba);if(toque)await fecharBalao(pagina);const ed=pagina.locator('[data-editor-snippet] .cm-content');await ed.click();await pagina.keyboard.press('ControlOrMeta+A');await pagina.keyboard.insertText(codigo);await pronto();}
async function acoes(lista) {
 for(const a of lista){
  if(a.tipo==='responderPrevisao'){if(toque)await abrirBalao(pagina);await tocar(await opcaoDaPrevisao(pagina));}
  else if(a.tipo==='porPasso'){await area('plano');await tocar(pagina.locator(`[data-escolher-passo="${a.passo}"]`).first());if(a.posicao===0)await tocar(pagina.locator(`[data-por-aqui="${a.grupo??'plano'}:0"]`));else await tocar(pagina.locator(`[data-por-aqui="${a.grupo??'plano'}:fim"]`));}
  else if(a.tipo==='tirarPasso'){await area('plano');await tocar(pagina.locator(`[data-tirar-passo="${a.passo}"]`));}
  else if(a.tipo==='rodarPlano'){if(toque)await fecharBalao(pagina);await tocar(pagina.locator('[data-rodar-plano]'));}
  else if(a.tipo==='levarPlanoProCodigo'){await area('plano');await tocar(pagina.locator('[data-levar-plano]'));}
  else if(a.tipo==='definirSnippet')await edit(a.codigo);
  else if(a.tipo==='executarSnippet'){await area('snippet');await tocar(pagina.locator('[data-executar-snippet]'));}
  else if(a.tipo==='escreverCaso'){await area('testes');await pagina.locator('[data-entrada-nova]').fill(a.entrada);await pagina.locator('[data-esperado-novo]').fill(a.esperado);await tocar(pagina.locator('[data-adicionar-caso]'));}
  else if(a.tipo==='rodarCasos'){await area('testes');await tocar(pagina.locator('[data-rodar-casos]'));}
  else throw Error(`Ação sem UI: ${a.tipo}`);
 }
}
const ponto=pagina.locator(`[data-unidade="${id}"]`);conferir(await ponto.getAttribute('data-estado')==='disponivel','unidade disponível no mapa');await tocar(ponto);await tocar(pagina.getByRole('dialog').getByRole('button',{name:'Jogar',exact:true}));
for(const fase of fases){
 await pagina.locator(`[data-jogo-fase="${fase.id}"]`).waitFor();await pronto();
 const meta=pagina.locator('[data-meta]');if(await meta.isVisible().catch(()=>false))await tocar(pagina.getByRole('button',{name:fase.tipo==='desafio'?'Começar o desafio':'Bora!'}));
 await introducao();
 if(fase.tipo==='desafio'){
  for(const parte of fase.partes){
   if(parte.id==='codigo'){
    // Constante que acerta apenas o caso feliz não pode cumprir funcaoPassa.
    const casos = parte.validador.validadores.find(v => v.tipo === "funcaoPassa").casos;
    const feliz = casos.find(c => typeof c.esperado === "number" && c.esperado !== 0).esperado;
    await edit(`function ${fase.testes.funcao}() { return ${feliz}; }`);await acoes([{tipo:'executarSnippet'}]);
    const barra = pagina.locator('button[aria-expanded]').filter({hasText:/Checklist|Desafio/}).first();
    if(modo==='retrato'){await fecharBalao(pagina);await tocar(barra);}
    if(modo==='paisagem') await abrirBalao(pagina);
    const feita=await pagina.locator('[data-parte="codigo"]').first().getAttribute('data-feita');conferir(feita!=='true','bordas escondidas rejeitam função constante');
    if(modo==='retrato') await tocar(barra);
   }
   await acoes(parte.solucaoDeTeste);
  }
 } else {
  for(const [i,o] of fase.objetivos.entries()){
   await pagina.waitForFunction(alvo=>document.querySelector('[data-jogo-fase]')?.getAttribute('data-objetivo-atual')===alvo,o.id);
   if(o.id==='teste-sozinho'){
    // Um caso comum já passou; a unidade deve continuar exigindo os casos de borda.
    if(toque)await abrirBalao(pagina);conferir(!await pagina.getByRole('button',{name:/^(Próximo objetivo|Ver resultado)$/}).first().isVisible().catch(()=>false),'um caso feliz não encerra a fase');
   }
   await acoes(o.solucaoDeTeste);
   if(i<fase.objetivos.length-1)await conversa('Próximo objetivo');
  }
 }
 await conversa('Ver resultado');await pagina.locator('[data-conclusao]').waitFor();
 await pagina.locator('[data-modal-assentado="sim"]').waitFor();
 for(let i=0;i<fase.conclusao.length;i++) await tocar(pagina.getByRole('dialog').getByRole('button',{name:'Continuar',exact:true}));
 await tocar(pagina.getByRole('button',{name:fase.tipo==='desafio'?'Voltar pra ilha':'Próxima fase',exact:true}));
}
await pagina.locator('[data-mapa=ilha]').waitFor();conferir(await pagina.locator(`[data-unidade="${id}"]`).getAttribute('data-estado')==='concluida','unidade concluída e salva');
conferir(errosRelevantes(erros).length===0,`console limpo: ${errosRelevantes(erros).join(' | ')}`);
await navegador.close();console.log(`resolvendo.mjs ${modo} U${n}: ok`);
