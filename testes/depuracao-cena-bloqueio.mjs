// Cena pausada: o desenho mostra o instante da pausa (tempo e estado dos aparelhos),
// avança com Passar por cima e, ao retomar, toca dali até o fim.
// Uso: node testes/depuracao-cena-bloqueio.mjs [desktop|retrato|paisagem]
import { readFileSync } from 'node:fs';
import { abrir, abrirBalao, fecharBalao, esperarPronto, conferir, opcaoDaPrevisao } from './util.mjs';
import { PUBLICADAS } from './curriculo.mjs';
const modo = process.argv[2] ?? 'desktop';
const [largura,altura] = {desktop:[1440,900],retrato:[390,844],paisagem:[844,390]}[modo];
const toque = modo !== 'desktop', unidade = 'logica-depuracao-u3';
const ferramentas = [...readFileSync(new URL('../src/ferramentas/ids.ts',import.meta.url),'utf8').matchAll(/^ {2}"([a-z-]+)",$/gm)].map(m=>m[1]);
const progresso = {versao:2,fasesConcluidas:Object.values(PUBLICADAS).flat().filter(f=>!f.startsWith(`${unidade}-`)),estrelasPorFase:{},fasesEmAndamento:{},faseAtual:null,tema:'doce',temasDesbloqueados:['doce'],som:false,missoesDeCampo:{},apresentacoesVistas:ferramentas,metasVistas:[unidade],unidadesComemoradas:[],ilhasComemoradas:['sites'],posicaoNoMapa:{},mapaDesbloqueado:false,proporcaoPrevia:0.4};
const {pagina,navegador} = await abrir({largura,altura,toque,progresso,rota:`/fase/${unidade}-f1`,esperar:'[data-jogo-fase]'});
async function tocar(el){await el.scrollIntoViewIfNeeded();await(toque?el.tap():el.click());await esperarPronto(pagina);}
try {
 await esperarPronto(pagina);
 for(let i=0;i<8;i++){
  if(toque)await abrirBalao(pagina);
  const b=pagina.getByRole('button',{name:/^(Continuar|Vamos lá!)$/}).first();
  if(!await b.isVisible().catch(()=>false))break;
  await tocar(b);
 }
 if(toque)await abrirBalao(pagina);
 await tocar(await opcaoDaPrevisao(pagina));
 if(toque)await fecharBalao(pagina);
 await tocar(pagina.getByRole('tab',{name:'Fontes',exact:true}));
 await tocar(pagina.locator('[data-editor-snippet] .cm-lineNumbers .cm-gutterElement',{hasText:/^6$/}));
 await tocar(pagina.locator('[data-executar-snippet]'));
 await pagina.locator('[data-snippet-pausado="sim"]').waitFor({state:'attached'});
 if(toque)await fecharBalao(pagina);
 if(modo==='paisagem')await tocar(pagina.locator('[data-abas-composicao] [data-segmento="cena"]'));
 if(modo==='retrato'&&!await pagina.locator('[data-area-trabalho="cena"]').isVisible())await tocar(pagina.locator('[data-alternar-cena]'));
 await pagina.locator('[data-area-cena][data-tocando="nao"]').waitFor({timeout:10000});
 const cena = pagina.locator('[data-cena="depuracao-esquina"]');
 const ler = async()=>({tempo:await cena.getAttribute('data-tempo'),cor:await cena.locator('[data-dispositivo="sinal"]').getAttribute('data-cor'),linha:(await pagina.locator('[data-editor-snippet] .cm-linha-pausada').innerText()).trim()});
 let v = await ler();
 console.log(`Pausado antes de: ${v.linha}. Cena: ${v.tempo} ms, sinal=${v.cor}.`);
 conferir(v.tempo==='0'&&v.cor==='verde','desenho da cena corresponde ao instante anterior à chamada; ainda não executou sinal.mudar(cor)');
 const controle = async(nome)=>{await tocar(pagina.locator(`[data-controle-depurador="${nome}"]:visible`).first());await pagina.locator('[data-area-cena][data-tocando="nao"]').waitFor({timeout:10000});};
 await controle('passar-por-cima');
 v = await ler();
 conferir(/sinal\.mudar/.test(v.linha)&&v.tempo==='0'&&v.cor==='verde',`passar por cima avança a linha (${v.linha}); o comando ainda não rodou: 0 ms, verde (viu ${v.tempo} ms, ${v.cor})`);
 await controle('passar-por-cima');
 v = await ler();
 conferir(/esperar/.test(v.linha)&&v.tempo==='0'&&v.cor==='vermelho',`depois do comando a cena mostra o sinal alterado no mesmo instante: 0 ms, vermelho (viu ${v.tempo} ms, ${v.cor})`);
 // Retomar: a animação continua do instante da pausa, sem voltar a mostrar o estado antigo nem pular o fim.
 await tocar(pagina.locator('[data-controle-depurador="retomar"]:visible').first());
 await pagina.locator('[data-area-cena][data-tocando="nao"]').waitFor({timeout:15000});
 const fim = Number(await cena.getAttribute('data-tempo'));
 const corFim = await cena.locator('[data-dispositivo="sinal"]').getAttribute('data-cor');
 conferir(fim>=1000&&corFim==='vermelho',`retomar toca a cena até o fim da execução: ${fim} ms, sinal=${corFim}`);
 conferir(await pagina.locator('[data-snippet-pausado="sim"]').count()===0,'o programa terminou ao retomar');
} finally { await navegador.close(); }
