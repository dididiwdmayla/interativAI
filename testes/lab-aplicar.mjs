import { abrir, esperarPronto, conferir } from './util.mjs';
const modo=process.argv[2]??'desktop';
const [largura,altura]=modo==='retrato'?[390,844]:modo==='paisagem'?[844,390]:[1440,900];
const {pagina,navegador}=await abrir({largura,altura,toque:modo!=='desktop',rota:'/lab/fases?fase=sites-elementos-u6-f3',esperar:'[data-jogo-fase]'});
const aplicar=pagina.getByRole('button',{name:'Aplicar solução do objetivo atual'});
await esperarPronto(pagina);
const itens=pagina.locator('[data-checklist] [data-parte]');
for(let i=0;i<await itens.count();i++){
  await aplicar.click();
  await esperarPronto(pagina);
  await pagina.waitForFunction(quantidade => document.querySelectorAll('[data-checklist] [data-parte][data-feita="true"]').length >= quantidade, i + 1, { timeout: 5000 });
}
conferir(await pagina.locator('[data-checklist] [data-parte][data-feita="false"]').count()===0,'Aplicar solução recalcula o checklist sem gesto intermediário');
await navegador.close();
