// A voz do computadorzinho e os sons do vídeo.
// 1) Cada fala do roteiro vira um .wav gerado com o CÓDIGO DO JOGO, não com uma
//    imitação: gerarFala (src/audio/vozModem.ts) produz os eventos e
//    tocarEventosVoz (src/audio/tocadorVoz.ts) toca num OfflineAudioContext
//    (48 kHz, mono) dentro do Chromium sem tela, com o passa-baixa do jogo.
//    Os eventos de cada fala vão para src/dados/vozes.json: é por eles que a
//    boca do computadorzinho mexe no vídeo.
// 2) Os sons pequenos (o tique do objetivo, o clique, as teclas) saem das
//    receitas sintetizadas do jogo (src/audio/receitas.ts), pelo mesmo caminho.
// 3) As músicas e os efeitos gravados vêm de public/audio do jogo (os .m4a),
//    decodificados para .wav: o Chromium do render não toca AAC. A música é
//    cortada no ponto exato do loop (as amostras do musicas.json).
// Uso: node scripts/vozes.mjs
import { execFileSync, execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { PASTA_VIDEO, RAIZ } from "./lib/jogo.mjs";
import { carregarRoteiro } from "./lib/roteiro.mjs";

const exigir = createRequire(import.meta.url);
function carregarPlaywright() {
  try {
    return exigir("playwright");
  } catch {
    return exigir(path.join(execSync("npm root -g").toString().trim(), "playwright"));
  }
}
const { chromium } = carregarPlaywright();
const esbuild = exigir("esbuild");

const TAXA = 48000;
const PUBLICO = path.join(PASTA_VIDEO, "public");
for (const pasta of ["vozes", "efeitos", "musica"]) mkdirSync(path.join(PUBLICO, pasta), { recursive: true });

// ---------------------------------------------------------------- o código do jogo, empacotado
const entrada = `
  import { gerarFala, duracaoDaFala, HUMOR_DA_EXPRESSAO, PASSA_BAIXA_VOZ, DURACAO_MAXIMA_VOZ } from "@/audio/vozModem";
  import { tocarEventosVoz } from "@/audio/tocadorVoz";
  import { criarSintetizador } from "@/audio/sintese";
  import { RECEITAS } from "@/audio/receitas";
  window.Jogo = { gerarFala, duracaoDaFala, HUMOR_DA_EXPRESSAO, PASSA_BAIXA_VOZ, DURACAO_MAXIMA_VOZ, tocarEventosVoz, criarSintetizador, RECEITAS };
`;
const pacote = await esbuild.build({
  stdin: { contents: entrada, resolveDir: path.join(RAIZ, "src"), loader: "ts" },
  bundle: true,
  format: "iife",
  write: false,
  alias: { "@": path.join(RAIZ, "src") },
  logLevel: "silent",
});

const { FALAS } = await carregarRoteiro();

/** As vozes a gerar: uma por fala, ou uma por parte quando a fala muda de humor no meio. */
const pedidos = Object.entries(FALAS).flatMap(([id, fala]) => (fala.vozes ? fala.vozes.map((parte) => ({ ...parte, fala: id })) : [{ id, texto: fala.texto, expressao: fala.expressao, fala: id }]));

/** Os sons sintetizados pelas receitas do jogo (id da receita -> arquivo). As teclas ganham variações, como no jogo. */
const SINTETIZADOS = [
  { id: "sint-acerto", receita: "acerto", semente: 3 },
  { id: "sint-clique", receita: "clique", semente: 5 },
  { id: "sint-inspecionar", receita: "inspecionar", semente: 7 },
  { id: "sint-tecla-enter", receita: "tecla-enter", semente: 9 },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ id: `sint-tecla-${n}`, receita: n === 4 ? "tecla-espaco" : "tecla", semente: 20 + n })),
];

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.addScriptTag({ content: pacote.outputFiles[0].text });

/** Renderiza no navegador e devolve as amostras (Float32, mono) e o que mais a página informar. */
async function renderizar(pedido) {
  return pagina.evaluate(
    async ({ pedido, taxa }) => {
      // Sorteio determinístico: a mesma semente, o mesmo som (o ruído e as variações das receitas usam Math.random).
      let estado = pedido.semente >>> 0;
      Math.random = () => {
        estado = (estado + 0x6d2b79f5) >>> 0;
        let v = estado;
        v = Math.imul(v ^ (v >>> 15), v | 1);
        v ^= v + Math.imul(v ^ (v >>> 7), v | 61);
        return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
      };
      const J = window.Jogo;
      const margem = 0.02;
      let eventos = null;
      let duracao;
      if (pedido.tipo === "voz") {
        eventos = J.gerarFala(pedido.texto, J.HUMOR_DA_EXPRESSAO[pedido.expressao]);
        duracao = J.duracaoDaFala(eventos);
      } else {
        duracao = pedido.duracao;
      }
      const ctx = new OfflineAudioContext(1, Math.ceil((duracao + margem + 0.12) * taxa), taxa);
      if (pedido.tipo === "voz") {
        // O mesmo caminho do jogo: voz -> passa-baixa -> saída.
        const filtro = ctx.createBiquadFilter();
        filtro.type = "lowpass";
        filtro.frequency.value = J.PASSA_BAIXA_VOZ;
        filtro.connect(ctx.destination);
        J.tocarEventosVoz(ctx, filtro, margem, eventos);
      } else {
        J.RECEITAS[pedido.receita](J.criarSintetizador(ctx, ctx.destination, margem));
      }
      const buffer = await ctx.startRendering();
      return { amostras: Array.from(buffer.getChannelData(0)), eventos, duracao, margem, teto: J.DURACAO_MAXIMA_VOZ };
    },
    { pedido, taxa: TAXA },
  );
}

function wav(amostras, ganho) {
  const dados = Buffer.alloc(44 + amostras.length * 2);
  dados.write("RIFF", 0);
  dados.writeUInt32LE(36 + amostras.length * 2, 4);
  dados.write("WAVEfmt ", 8);
  dados.writeUInt32LE(16, 16);
  dados.writeUInt16LE(1, 20);
  dados.writeUInt16LE(1, 22);
  dados.writeUInt32LE(TAXA, 24);
  dados.writeUInt32LE(TAXA * 2, 28);
  dados.writeUInt16LE(2, 32);
  dados.writeUInt16LE(16, 34);
  dados.write("data", 36);
  dados.writeUInt32LE(amostras.length * 2, 40);
  for (let i = 0; i < amostras.length; i++) dados.writeInt16LE(Math.round(Math.max(-1, Math.min(1, amostras[i] * ganho)) * 32767), 44 + i * 2);
  return dados;
}
const pico = (lista) => lista.reduce((maior, r) => Math.max(maior, r.amostras.reduce((m, v) => Math.max(m, Math.abs(v)), 0)), 0);

// ---------------------------------------------------------------- vozes
const vozes = [];
for (const [indice, pedido] of pedidos.entries()) vozes.push({ pedido, ...(await renderizar({ ...pedido, tipo: "voz", semente: 100 + indice })) });
// Um ganho só para todas (a voz do jogo sai baixinha e o barramento sobe): o pico mais alto vai a 0,7.
const ganhoVoz = 0.7 / pico(vozes);
const indiceVozes = {};
for (const voz of vozes) {
  writeFileSync(path.join(PUBLICO, "vozes", `${voz.pedido.id}.wav`), wav(voz.amostras, ganhoVoz));
  indiceVozes[voz.pedido.id] = {
    fala: voz.pedido.fala,
    texto: voz.pedido.texto,
    expressao: voz.pedido.expressao,
    duracao: Number((voz.duracao + voz.margem).toFixed(3)),
    // Só o que a boca precisa: quando começa, quanto dura e o tipo de cada som (com a margem do começo do arquivo).
    eventos: voz.eventos.map((evento) => ({ t: Number((evento.tempo + voz.margem).toFixed(3)), d: Number(evento.duracao.toFixed(3)), tipo: evento.tipo })),
  };
  if (voz.duracao > voz.teto + 0.001) throw new Error(`a voz "${voz.pedido.id}" passou do teto do jogo (${voz.duracao.toFixed(2)} s)`);
}
writeFileSync(path.join(PASTA_VIDEO, "src", "dados", "vozes.json"), `${JSON.stringify(indiceVozes, null, 1)}\n`);

// ---------------------------------------------------------------- sons sintetizados
const sons = [];
for (const som of SINTETIZADOS) sons.push({ som, ...(await renderizar({ tipo: "receita", receita: som.receita, semente: som.semente, duracao: 0.9 })) });
const ganhoSons = 0.5 / pico(sons);
for (const item of sons) {
  // Corta o silêncio do fim (as receitas duram bem menos que a janela).
  let fim = item.amostras.length - 1;
  while (fim > 0 && Math.abs(item.amostras[fim]) < 0.00002) fim--;
  writeFileSync(path.join(PUBLICO, "efeitos", `${item.som.id}.wav`), wav(item.amostras.slice(0, Math.min(item.amostras.length, fim + 960)), ganhoSons));
}
await navegador.close();

// ---------------------------------------------------------------- músicas e efeitos gravados do jogo
const musicas = JSON.parse(readFileSync(path.join(RAIZ, "public", "audio", "musica", "musicas.json"), "utf8")).faixas;
const efeitos = JSON.parse(readFileSync(path.join(RAIZ, "public", "audio", "efeitos", "efeitos.json"), "utf8")).efeitos;
const decodificar = (origem, destino, filtros = []) => execFileSync("ffmpeg", ["-v", "error", "-y", "-i", origem, ...filtros, "-ar", String(TAXA), "-c:a", "pcm_s16le", destino]);
for (const [id, faixa] of Object.entries(musicas)) decodificar(path.join(RAIZ, "public", faixa.arquivos.m4a), path.join(PUBLICO, "musica", `${id}.wav`), ["-af", `atrim=end_sample=${Math.round((faixa.amostras * TAXA) / faixa.sampleRate)}`]);
for (const [id, efeito] of Object.entries(efeitos)) decodificar(path.join(RAIZ, "public", efeito.arquivos.m4a), path.join(PUBLICO, "efeitos", `${id}.wav`));

console.log(`${vozes.length} vozes (ganho ${ganhoVoz.toFixed(1)}x), ${sons.length} sons sintetizados, ${Object.keys(musicas).length} músicas e ${Object.keys(efeitos).length} efeitos decodificados.`);
for (const voz of vozes) console.log(`  ${voz.pedido.id.padEnd(12)} ${voz.duracao.toFixed(2)} s  ${voz.pedido.expressao.padEnd(11)} "${voz.pedido.texto}"`);
