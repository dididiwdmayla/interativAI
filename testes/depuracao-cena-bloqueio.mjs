// Reprodução do bloqueio: a cena visual deve usar a mesma foto da pausa.
// Hoje falha; não integra a bateria de conteúdo. Promover junto ao conserto do motor.
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
 const linha = await pagina.locator('[data-editor-snippet] .cm-linha-pausada').innerText();
 const cena = pagina.locator('[data-cena="depuracao-esquina"]');
 const tempo = await cena.getAttribute('data-tempo');
 const cor = await cena.locator('[data-dispositivo="sinal"]').getAttribute('data-cor');
 console.log(`Pausado antes de: ${linha.trim()}. Cena: ${tempo} ms, sinal=${cor}. Esperado: 0 ms, sinal=verde.`);
 conferir(tempo==='0'&&cor==='verde','desenho da cena corresponde ao instante anterior à chamada; ainda não executou sinal.mudar(cor)');
} finally { await navegador.close(); }
