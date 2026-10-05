// Jornada real pelo mapa: cartões, edição, previsões, casos e publicação do progresso.
// Uso: node testes/estruturas-zona.mjs [desktop|retrato|paisagem] [1|2|3|4]
import { readFileSync } from 'node:fs';
import { abrir, abrirBalao, fecharBalao, esperarPronto, conferir, errosRelevantes, opcaoDaPrevisao } from './util.mjs';
import { PUBLICADAS, obrigatoriasProntasDaIlha } from './curriculo.mjs';
const modo = process.argv[2] ?? 'desktop', n = process.argv[3] ?? '1';
const id = `logica-estruturas-de-dados-u${n}`;
const fases = JSON.parse(readFileSync(new URL('./estruturas-jornadas.json', import.meta.url)))[n];
const tamanhos = { desktop: [1440,900], retrato: [390,844], paisagem: [844,390] };
const [largura,altura] = tamanhos[modo], toque = modo !== 'desktop';
const prontas = [...obrigatoriasProntasDaIlha('sites'), ...obrigatoriasProntasDaIlha('logica').filter(u => !u.id.startsWith('logica-estruturas-de-dados-') || Number(u.id.at(-1)) < Number(n))].map(u=>u.id);
const ferramentas = [...readFileSync(new URL('../src/ferramentas/ids.ts', import.meta.url),'utf8').matchAll(/^ {2}"([a-z-]+)",$/gm)].map(m=>m[1]);
const progresso = { versao:2, fasesConcluidas:prontas.flatMap(u=>PUBLICADAS[u] ?? []), estrelasPorFase:{}, fasesEmAndamento:{}, faseAtual:null, tema:'doce', temasDesbloqueados:['doce','fliperama'], som:false, missoesDeCampo:{}, apresentacoesVistas:ferramentas, metasVistas:prontas, unidadesComemoradas:prontas, ilhasComemoradas:['sites'], posicaoNoMapa:{}, mapaDesbloqueado:false, proporcaoPrevia:0.4 };
const {pagina,navegador,erros} = await abrir({largura,altura,toque,progresso,rota:'/ilha/logica',esperar:'[data-mapa=ilha]'});
const pronto = () => esperarPronto(pagina,30000);
async function tocar(el) { await el.scrollIntoViewIfNeeded(); await (toque ? el.tap() : el.click()); await pronto(); }
async function conversa(nome) { if(toque) await abrirBalao(pagina); await tocar(pagina.getByRole('button',{name:nome}).first()); }
async function area(a) { if(toque) await fecharBalao(pagina); const aba=pagina.locator(`[data-abas-composicao] [data-segmento="${a}"]`); if(await aba.count() && await aba.getAttribute('aria-selected')!=='true') await tocar(aba); }
async function introducao() { for(let i=0;i<7;i++){if(toque)await abrirBalao(pagina); const b=pagina.getByRole('button',{name:/^(Continuar|Vamos lá!)$/}).first(); if(!await b.isVisible().catch(()=>false))break;await tocar(b);} }
async function edit(codigo){if(toque)await fecharBalao(pagina);await area('snippet');const fontes=pagina.getByRole('tab',{name:'Fontes',exact:true});if(await fontes.isVisible().catch(()=>false))await tocar(fontes);const aba=pagina.getByRole('tab',{name:'Snippet',exact:true});if(await aba.isVisible().catch(()=>false))await tocar(aba);if(toque)await fecharBalao(pagina);const ed=pagina.locator('[data-editor-snippet] .cm-content');if(toque)await ed.focus();else await ed.click();await pagina.keyboard.press('ControlOrMeta+A');await pagina.keyboard.insertText(codigo);await pronto();}
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
  else if(a.tipo==='abrirFicha'){
   if(modo==='paisagem')await area('cena');
   if(modo==='retrato'&&!await pagina.locator('[data-area-trabalho="cena"]').isVisible()){await fecharBalao(pagina);await tocar(pagina.locator('[data-alternar-cena]'));}
   if(toque)await fecharBalao(pagina);await tocar(pagina.locator(`[data-dispositivo="${a.dispositivo}"]`));await pagina.locator('[data-modal-assentado="sim"]').waitFor();await pagina.keyboard.press('Escape');await pronto();
  }
  else if(a.tipo==='verComoArvore'){
   await mostrarPalco();
   const tempo=pagina.locator('[data-linha-do-tempo]');await tempo.locator('[data-barra-tempo]').focus();await pagina.keyboard.press('End');
   await pagina.waitForFunction(()=>{const t=document.querySelector('[data-linha-do-tempo]');return Number(t?.getAttribute('data-passo-atual'))===Number(t?.getAttribute('data-total-passos'))-1;});
   const arvore=pagina.locator(`[data-caixinha="${a.nome}"] [data-arvore-palco]`);
   const botao=pagina.locator(`[data-ver-como-arvore="${a.nome}"]`);
   if(await arvore.count())await tocar(botao);
   await tocar(botao);
   conferir(await arvore.locator('[data-no-arvore]').count()>=5,'árvore mostra raiz, cômodos e folhas');
   conferir(await arvore.locator('[data-ponte-elementos]').isVisible(),'ponte com Elementos aparece');
  }
  else if(a.tipo==='medirDesempenho'){if(toque)await fecharBalao(pagina);await tocar(pagina.getByRole('tab',{name:'Desempenho',exact:true}));await tocar(pagina.locator('[data-medir-desempenho]'));await pagina.locator('[data-grafico-passos]').waitFor();conferir(await pagina.locator('[data-ponto-grafico]').count()>=3,'gráfico medido com vários tamanhos');
   const [cara,barata]=n==='2'?['comShift','porIndice']:['naLista','noMapa'];
   const grafico=pagina.locator('[data-grafico-passos]');
   await grafico.locator('[data-serie-grafico]').nth(1).waitFor();
   const altura=nome=>grafico.locator(`[data-ponto-grafico="${nome}:1000"]`).evaluate(el=>Number(el.getAttribute('cy')));
   conferir(await altura(cara)<await altura(barata)-50,'trabalho escondido faz a curva ingênua crescer muito mais');
   conferir(await pagina.locator('[data-legenda-escondidos]').getAttribute('data-legenda-escondidos')==='sim','gráfico explica que os pontos somam código e escondidos');
}
  else if(a.tipo==='executarNoConsole'){if(toque)await fecharBalao(pagina);await tocar(pagina.getByRole('tab',{name:'Console',exact:true}));const ed=pagina.locator('[data-console]:visible [data-entrada-console]').first();await ed.click();await pagina.keyboard.insertText(a.codigo);if(toque)await tocar(pagina.locator('[data-console]:visible [data-rodar-console]').first());else{await pagina.keyboard.press('Enter');await pronto();}}
  else if(a.tipo==='velocidadeCena'){if(modo==='paisagem')await area('cena');if(toque)await fecharBalao(pagina);await tocar(pagina.locator(`[data-velocidade-cena="${a.velocidade}"]`));}
  else throw Error(`Ação sem UI: ${a.tipo}`);
 }
}

async function mostrarPalco(){
 if(toque)await fecharBalao(pagina);
 if(await pagina.locator('[data-composicao]').count()){
  if(modo==='paisagem')await area('palco');
  if(modo==='retrato'){if(await pagina.locator('[data-alternar-palco]').count()){if(!await pagina.locator('[data-area-trabalho="palco"]').isVisible())await tocar(pagina.locator('[data-alternar-palco]'));}else await area('palco');}
 }
 await pagina.locator('[data-palco]').waitFor({state:'visible'});
}

async function conferirRastro(habilidade){
 await mostrarPalco();
 const tempo=pagina.locator('[data-linha-do-tempo]');
 const total=Number(await tempo.getAttribute('data-total-passos'));
 const barra=tempo.locator('[data-barra-tempo]');
 const comCena=await pagina.locator('[data-area-cena]').count()>0;
 async function passo(i){
  await barra.focus();await pagina.keyboard.press(i===0?'Home':'ArrowRight');
  await pagina.waitForFunction(alvo=>Number(document.querySelector('[data-linha-do-tempo]')?.getAttribute('data-passo-atual'))===alvo,i);
  if(comCena)await pagina.locator('[data-area-cena][data-tocando="nao"]').waitFor({state:'attached'});
 }
 await passo(0);
 let entrou=false,saiu=false,deslizou=false,quadros=0;
 const visitados=new Set();
 for(let i=0;i<total;i++){
  entrou ||= await pagina.locator('.palco-entrar-direita').count()>0;
  saiu ||= await pagina.locator(habilidade==='fila-sozinho'?'.palco-sair-esquerda':'.palco-sair-direita').count()>0;
  deslizou ||= await pagina.locator('.palco-deslizar').count()>0;
  for(const nome of await pagina.locator('[data-no-visitado="sim"]').evaluateAll(els=>els.map(el=>el.getAttribute('data-no-arvore'))))visitados.add(nome);
  quadros=Math.max(quadros,await pagina.locator('[data-quadro]').count());
  if(i<total-1)await passo(i+1);
 }
 if(habilidade==='pilha-sozinho')conferir(entrou&&saiu,'pilha entra e sai pelo mesmo lado');
 if(habilidade==='fila-sozinho')conferir(entrou&&saiu&&deslizou,'fila entra pelo fim, sai pelo começo e desliza');
 if(habilidade==='percurso-sozinho')conferir(quadros>=3&&visitados.size>=3,'recursão destaca vários nós e abre molduras ao visitar os filhos');
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
    const feliz = casos.at(-1).esperado;
    const nome = parte.validador.validadores.find(v => v.tipo === "funcaoPassa").nome;
    await edit(`function ${nome}() { return ${JSON.stringify(feliz)}; }`);await acoes([{tipo:'executarSnippet'}]);
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
   // Uma conclusão sozinha não pode nascer pronta com a solução guiada.
   if(o.modo==='sozinho'){if(toque)await abrirBalao(pagina);conferir(!await pagina.getByRole('button',{name:/^(Próximo objetivo|Ver resultado)$/}).first().isVisible().catch(()=>false),`${o.id}: treino ainda exige trabalho`);}
   await acoes(o.solucaoDeTeste);
   if(['pilha-sozinho','fila-sozinho','percurso-sozinho'].includes(o.id))await conferirRastro(o.id);
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
await navegador.close();console.log(`estruturas-zona.mjs ${modo} U${n}: ok`);
