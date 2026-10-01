// Retrato: toca o alvo com o cartão ainda deslizando, sem usar a espera
// do helper passarApresentacao (que continua cobrindo a jornada normal).
import { abrir, conferir, esperarPronto, fecharBalao, progressoComFase, errosRelevantes } from './util.mjs';
const vistas = ['painel', 'previa', 'me-ajuda', 'tutor', 'arvore', 'inspecionar', 'editar-duplo-clique', 'editor', 'sincronia', 'trilha'];
const { navegador, pagina, erros } = await abrir({ largura:390, altura:844, toque:true, progresso:progressoComFase('sites-elementos-u1-f1', {}, { apresentacoesVistas:vistas }) });
try {
  await esperarPronto(pagina);
  await fecharBalao(pagina);
  await pagina.getByRole('button', {name:'Mais opções'}).tap();
  await pagina.getByRole('button', {name:'Abrir a Caixa de Ferramentas'}).tap();
  await pagina.locator('[data-card="trilha"]').getByRole('button', {name:'Rever apresentação'}).tap();
  const camada=pagina.locator('[data-apresentacao="trilha"]');
  await camada.waitFor();
  // Observa a mudança no primeiro quadro do Experimente; pausa a transição
  // real para a checagem não depender da velocidade da máquina de teste.
  await pagina.evaluate(() => {
    window.__observacaoCartao = new Promise(resolve => {
      const ver=()=>{
        const cartao=document.querySelector('[data-apresentacao="trilha"][data-passo-apresentacao="experimente"] .cartao-apresentacao');
        const animacoes=cartao?.getAnimations().filter(a=>a instanceof CSSTransition && ['left','top'].includes(a.transitionProperty)) ?? [];
        if(animacoes.length){
          for(const a of animacoes){a.pause();a.currentTime=100;}
          resolve(getComputedStyle(cartao).pointerEvents);
        }else requestAnimationFrame(ver);
      };requestAnimationFrame(ver);
    });
  });
  for(let i=0;i<3;i++) {
    await camada.getByRole('button', {name:/Continuar|Quero tentar/}).tap();
    if(await camada.getAttribute('data-passo-apresentacao') !== 'fala') break;
  }
  conferir(await pagina.evaluate(()=>window.__observacaoCartao)==='none', 'retrato: cartão ignora toques antes e durante o deslize');
  const hit=await camada.locator('.cartao-apresentacao').evaluate(el=>{
    const r=el.getBoundingClientRect();
    return !el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
  });
  conferir(hit,'retrato: o cartão móvel não participa do hit-test');
  const no=pagina.locator('[role=treeitem][data-chave="5.0"] > div').first();
  await no.tap();
  await pagina.locator('[role=treeitem][data-chave="5.0"][aria-selected="true"]').waitFor();
  conferir(true,'retrato: toque na árvore chega ao alvo durante o deslize');
  await pagina.evaluate(()=>document.querySelector('.cartao-apresentacao')?.getAnimations().forEach(a=>a.play()));
  await camada.locator('[data-cartao-movendo="nao"]').waitFor();
  conferir(await camada.locator('.cartao-apresentacao').evaluate(el=>getComputedStyle(el).pointerEvents)==='auto','retrato: cartão volta a receber toques quando assenta');
  conferir(errosRelevantes(erros).length===0,'retrato: console limpo');
} finally { await navegador.close(); }
console.log('apresentacao-movimento.mjs retrato: ok');
