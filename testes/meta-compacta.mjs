import { PUBLICADAS } from './curriculo.mjs';
import { abrir, progressoComFase, conferir } from './util.mjs';
const modo = process.argv[2] ?? 'retrato';
const [largura,altura] = modo === 'retrato' ? [390,844] : modo === 'paisagem' ? [844,390] : [1440,900];
for (const fase of ['sites-elementos-u4-f4','logica-programa-de-verdade-u1-f1']) {
  const progresso = progressoComFase(fase, { metaVista: false }); progresso.fasesEmAndamento = {}; progresso.fasesConcluidas = Object.values(PUBLICADAS).flat().filter(id => (fase.endsWith("-f1") ? !id.startsWith(fase.replace(/-f\d+$/, "")) : id !== fase));
  const {pagina,navegador} = await abrir({largura,altura,toque:modo!=='desktop',progresso,esperar:'[data-jogo-fase]'});
  await pagina.locator('[data-meta]').waitFor();
  await pagina.locator('[data-modal-assentado="sim"]').waitFor();
  const caixa = await pagina.getByRole('dialog').boundingBox();
  console.log(fase,modo,'altura',caixa.height);
  if(modo === 'retrato') conferir(caixa.height <= 610, 'meta deixa margem em retrato');
  const depois = pagina.locator('[data-mini-composicao="Depois"], figure').filter({hasText:'Depois'}).first();
  conferir(await depois.isVisible(),'depois legível na meta');
  const antes = pagina.locator('[data-mini-composicao="Antes"], figure').filter({hasText:'Antes'}).first();
  conferir(await antes.isVisible(),'antes legível na meta');
  conferir(await pagina.getByRole('button',{name:/Começar o desafio|Bora!/}).isVisible(),'ação da meta visível');
  await navegador.close();
}
