// O aluno pode ler o Experimente com calma sem perder o campo do tutor.
import { abrir, conferir, esperarPronto, passarApresentacao, progressoComFase } from './util.mjs';
const modo = process.argv[2] ?? 'paisagem';
const [largura, altura] = modo === 'paisagem' ? [844,390] : modo === 'retrato' ? [390,844] : [1440,900];
const {pagina,navegador}=await abrir({largura,altura,toque:modo !== 'desktop', progresso:progressoComFase('sites-elementos-u1-f1',{}, {metasVistas:['sites-elementos-u1'],apresentacoesVistas:['painel','previa','me-ajuda']})});
await esperarPronto(pagina);
await passarApresentacao(pagina,'tutor',async()=>{
 const fala = await pagina.locator('[data-fala-mascote]').textContent();
 // Espera o prazo real do balão e a animação de saída; é a condição da prova,
 // não folga no timeout de uma ação.
 await pagina.waitForTimeout(3500 + fala.length * 55 + 1600);
 const campo=pagina.getByPlaceholder('Pergunte ao computadorzinho...').first();
 conferir(await campo.isVisible(), `${modo}: apresentação mantém o campo depois do tempo de leitura`);
 await campo.fill('o que é uma tag?'); await campo.press('Enter');
});
await navegador.close();
