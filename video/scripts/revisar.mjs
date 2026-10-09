// A revisão antes de entregar. Para cada versão do vídeo:
// 1) folhas de contato, um quadro a cada 2 s, em revisao/ (para olhar todas);
// 2) quadros pretos e imagem congelada fora de propósito (blackdetect e freezedetect do ffmpeg);
// 3) áudio: o volume integrado e o pico real (ebur128) e, falas por falas, quanto a voz do
//    computadorzinho fica acima da música (a voz e a música renderizadas em separado e medidas
//    em janelas com o astats do ffmpeg);
// 4) as afirmações: os números do vídeo contra o numeros.json, e nenhum emoji nos textos.
// Uso: node scripts/revisar.mjs [arquivo16x9.mp4] [arquivo9x16.mp4]   (padrão: os de saida/, senão os de out/)
//      node scripts/revisar.mjs --curtos   revisa os dois curtos verticais (scripts/revisar-curtos.mjs: folhas a cada
//      0,5 s, o primeiro segundo, a lista proibida por OCR, o laço da imagem e do som, o teste do polegar)
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { folha } from "./lib/folha.mjs";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { audio } from "./lib/remotion.mjs";
import { carregarRoteiro } from "./lib/roteiro.mjs";

// Os curtos têm a revisão deles (com as checagens próprias de vídeo curto em laço).
if (process.argv.includes("--curtos")) {
  await import("./revisar-curtos.mjs");
  process.exit(0);
}

const R = await carregarRoteiro();
const REVISAO = path.join(PASTA_VIDEO, "revisao");
const TEMPORARIO = path.join(PASTA_VIDEO, "out", "revisao");
mkdirSync(REVISAO, { recursive: true });
mkdirSync(TEMPORARIO, { recursive: true });

const achar = (prefixo, reserva) => {
  const saida = path.join(PASTA_VIDEO, "saida");
  const finais = existsSync(saida) ? readdirSync(saida).filter((nome) => nome.startsWith(prefixo) && nome.endsWith(".mp4")).sort() : [];
  if (finais.length) return path.join(saida, finais.at(-1));
  for (const nome of reserva) if (existsSync(path.join(PASTA_VIDEO, "out", nome))) return path.join(PASTA_VIDEO, "out", nome);
  return null;
};
const VERSOES = [
  { nome: "16x9", id: "Apresentacao169", blocos: R.BLOCOS_169, arquivo: process.argv[2] ?? achar("interativai-apresentacao-16x9", ["Apresentacao169.mp4", "rascunho-Apresentacao169.mp4"]), colunas: 4, largura: 480 },
  { nome: "9x16", id: "Apresentacao916", blocos: R.BLOCOS_916, arquivo: process.argv[3] ?? achar("interativai-apresentacao-9x16", ["Apresentacao916.mp4", "rascunho-Apresentacao916.mp4"]), colunas: 6, largura: 270 },
];

const ffmpeg = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8", maxBuffer: 1 << 28 });
const duracaoDe = (arquivo) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arquivo]).toString().trim());
const vozes = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "vozes.json"), "utf8"));
const numeros = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "numeros.json"), "utf8"));
const relatorio = [];
let problemas = 0;
const dizer = (linha) => {
  relatorio.push(linha);
  console.log(linha);
};
const problema = (linha) => {
  problemas += 1;
  dizer(`  PROBLEMA: ${linha}`);
};

/** O volume (RMS, dB) de um trecho de um arquivo de áudio, pelo astats. */
function rms(arquivo, de, ate) {
  const saida = ffmpeg(["-ss", String(de), "-t", String(Math.max(0.05, ate - de)), "-i", arquivo, "-af", "astats=metadata=0:measure_overall=RMS_level:measure_perchannel=none", "-f", "null", "-"]).stderr;
  const achado = /RMS level dB:\s*(-?[\d.]+|-inf)/.exec(saida);
  return achado ? (achado[1] === "-inf" ? -120 : Number(achado[1])) : NaN;
}

for (const versao of VERSOES) {
  if (!versao.arquivo || !existsSync(versao.arquivo)) {
    dizer(`\n${versao.nome}: nenhum vídeo para revisar (renderize antes).`);
    continue;
  }
  const duracao = duracaoDe(versao.arquivo);
  const previsto = R.duracaoTotal(versao.blocos);
  dizer(`\n== ${versao.nome}: ${path.relative(PASTA_VIDEO, versao.arquivo)} (${duracao.toFixed(2)} s) ==`);
  if (Math.abs(duracao - previsto) > 0.2) problema(`a duração do arquivo (${duracao.toFixed(2)} s) não bate com o roteiro (${previsto.toFixed(2)} s)`);

  // 1) Folhas de contato: um quadro a cada 2 s (em 1 s, 3 s, 5 s...), com o primeiro instante no nome da folha.
  for (const antiga of readdirSync(REVISAO).filter((nome) => nome.startsWith(`folha-${versao.nome}-`))) rmSync(path.join(REVISAO, antiga));
  const porFolha = versao.colunas * (versao.nome === "16x9" ? 4 : 2);
  const instantes = [];
  for (let t = 1; t < duracao; t += 2) instantes.push(t);
  let folhas = 0;
  for (let inicio = 0; inicio < instantes.length; inicio += porFolha) {
    const grupo = instantes.slice(inicio, inicio + porFolha);
    const arquivos = grupo.map((t) => {
      const quadro = path.join(TEMPORARIO, `${versao.nome}-${String(t).padStart(3, "0")}.jpg`);
      ffmpeg(["-v", "error", "-y", "-ss", String(t), "-i", versao.arquivo, "-frames:v", "1", "-q:v", "3", "-vf", `scale=${versao.largura}:-2`, quadro]);
      return quadro;
    });
    folha(arquivos, path.join(REVISAO, `folha-${versao.nome}-${String(++folhas).padStart(2, "0")}-${String(grupo[0]).padStart(3, "0")}s.jpg`), { colunas: versao.colunas, largura: versao.largura });
  }
  dizer(`  folhas de contato: ${folhas} em revisao/folha-${versao.nome}-*.jpg (um quadro a cada 2 s: 1 s, 3 s, 5 s...)`);

  // 2) Preto e congelado: só valem a abertura e o fim (o monitor ligando e desligando).
  const preto = ffmpeg(["-i", versao.arquivo, "-vf", "blackdetect=d=0.4:pix_th=0.12", "-an", "-f", "null", "-"]).stderr;
  const pretos = [...preto.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const pretosNoMeio = pretos.filter(([de, ate]) => de > 2 && ate < duracao - 2.5);
  if (pretosNoMeio.length) problema(`quadros pretos no meio do vídeo: ${pretosNoMeio.map(([de, ate]) => `${de.toFixed(1)} a ${ate.toFixed(1)} s`).join(", ")}`);
  else dizer(`  sem quadros pretos no meio (preto só ${pretos.map(([de, ate]) => `${de.toFixed(1)}-${ate.toFixed(1)} s`).join(" e ") || "em lugar nenhum"})`);
  const congelado = ffmpeg(["-i", versao.arquivo, "-vf", "freezedetect=n=-55dB:d=1.2", "-an", "-f", "null", "-"]).stderr;
  const congelados = [...congelado.matchAll(/freeze_start: ([\d.]+)[\s\S]*?freeze_duration: ([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  // A regra do roteiro: nenhum plano parado por mais de 4 s. Os trechos quase parados mais curtos ficam anotados.
  const longos = congelados.filter(([, dura]) => dura > 4);
  if (longos.length) problema(`imagem parada por mais de 4 s: ${longos.map(([de, dura]) => `em ${de.toFixed(1)} s por ${dura.toFixed(1)} s`).join(", ")}`);
  dizer(congelados.length ? `  trechos quase parados (mais de 1,2 s, o limite é 4 s): ${congelados.map(([de, dura]) => `${de.toFixed(1)} s por ${dura.toFixed(1)} s`).join(", ")}` : "  nenhum trecho com a imagem parada por mais de 1,2 s");

  // 3) Áudio.
  const medida = ffmpeg(["-i", versao.arquivo, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"]).stderr;
  const integrado = /I:\s+(-?[\d.]+) LUFS/g;
  let lufs = null;
  for (let achado; (achado = integrado.exec(medida)); ) lufs = Number(achado[1]);
  const pico = [...medida.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].map((m) => Number(m[1])).at(-1);
  dizer(`  volume integrado: ${lufs} LUFS; pico real: ${pico} dBTP`);

  // A voz e a música em separado, renderizadas do mesmo roteiro.
  const wavVoz = path.join(TEMPORARIO, `${versao.nome}-voz.wav`);
  const wavMusica = path.join(TEMPORARIO, `${versao.nome}-musica.wav`);
  await audio(versao.id, wavVoz, "voz");
  await audio(versao.id, wavMusica, "musica");
  const falas = R.falasNoTempo(versao.blocos);
  const partes = (id) => (R.FALAS[id].vozes ? R.FALAS[id].vozes.map((parte) => parte.id) : [id]);
  let menor = Infinity;
  const linhas = [];
  for (const fala of falas) {
    const dura = partes(fala.fala).reduce((soma, parte, indice) => soma + vozes[parte].duracao + (indice ? 0.12 : 0), 0);
    const voz = rms(wavVoz, fala.inicio, fala.inicio + dura);
    const musica = rms(wavMusica, fala.inicio, fala.inicio + dura);
    const antes = rms(wavMusica, Math.max(0, fala.inicio - 1.2), Math.max(0.1, fala.inicio - 0.3));
    const folga = musica < -100 ? Infinity : voz - musica;
    if (folga < menor) menor = folga;
    linhas.push(`    ${fala.inicio.toFixed(2).padStart(6)} s  ${fala.fala.padEnd(12)} voz ${voz.toFixed(1)} dB  música ${musica < -100 ? "(sem música)" : `${musica.toFixed(1)} dB (antes da fala: ${antes < -100 ? "silêncio" : `${antes.toFixed(1)} dB`})`}  voz acima da música: ${Number.isFinite(folga) ? `${folga.toFixed(1)} dB` : "sem música"}`);
  }
  dizer(`  voz e música em cada fala (RMS, astats):`);
  for (const linha of linhas) dizer(linha);
  if (menor < 6) problema(`a voz fica só ${menor.toFixed(1)} dB acima da música numa fala`);
  else dizer(`  a voz fica pelo menos ${menor.toFixed(1)} dB acima da música em todas as falas`);
}

// 4) As afirmações e os textos.
dizer("\n== Textos e afirmações ==");
const textos = [...Object.values(R.FALAS).map((fala) => fala.texto), ...R.OBJETIVOS, R.TITULO_DA_FASE, ...R.CHAMADA, ...R.CONVITE, R.ASSINATURA, R.ENDERECO, ...R.ILHAS_CHEGANDO.map((ilha) => ilha.nome)];
const fontes = ["src/roteiro.ts", ...readdirSync(path.join(PASTA_VIDEO, "src", "pecas")).map((nome) => `src/pecas/${nome}`), ...readdirSync(path.join(PASTA_VIDEO, "src", "composicoes", "blocos")).map((nome) => `src/composicoes/blocos/${nome}`)];
const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
const comEmoji = [...textos.filter((texto) => emoji.test(texto)), ...fontes.filter((arquivo) => emoji.test(readFileSync(path.join(PASTA_VIDEO, arquivo), "utf8")))];
if (comEmoji.length) problema(`emoji em: ${comEmoji.join(", ")}`);
else dizer(`  nenhum emoji em ${textos.length} textos nem em ${fontes.length} arquivos de peças`);
const hex = fontes.filter((arquivo) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(path.join(PASTA_VIDEO, arquivo), "utf8").replace(/url\(#[^)]+\)/g, "")));
if (hex.length) problema(`cor em hexadecimal fora dos tokens em: ${hex.join(", ")}`);
else dizer("  nenhuma cor em hexadecimal nas peças (só tokens de src/tema/tokens.css)");
const proibidas = /\b(gr[áa]tis|gratuit[oa]|pre[çc]o|assinatura mensal|certificado|emprego garantido)\b/i;
const promessas = textos.filter((texto) => proibidas.test(texto));
if (promessas.length) problema(`promessa fora do combinado: ${promessas.join(" | ")}`);
else dizer("  nenhuma fala sobre preço, grátis, assinatura, certificado ou emprego");
dizer(`  número mostrado no título: "Mais de ${numeros.maisDeFases} fases" (o código tem ${numeros.fasesPublicadas} fases publicadas em ${numeros.ilhasComConteudo} ilhas: ${numeros.maisDeFases < numeros.fasesPublicadas ? "confere" : "NÃO CONFERE"})`);
if (numeros.maisDeFases >= numeros.fasesPublicadas) problemas += 1;
const emConstrucao = new Set(numeros.ilhasEmConstrucao);
const chegando = R.ILHAS_CHEGANDO.filter((ilha) => !emConstrucao.has(ilha.nome));
if (chegando.length) problema(`ilha anunciada como "chegando" que já tem conteúdo (ou mudou de nome): ${chegando.map((ilha) => ilha.nome).join(", ")}`);
else dizer(`  as ${R.ILHAS_CHEGANDO.length} ilhas do bloco "Chegando" estão sem unidade publicada no código (em construção)`);

writeFileSync(path.join(REVISAO, "revisao.txt"), `${relatorio.join("\n")}\n`);
console.log(`\n${problemas ? `${problemas} problema(s).` : "Revisão automática sem problemas."} O resumo ficou em revisao/revisao.txt; falta olhar as folhas.`);
process.exit(0);
