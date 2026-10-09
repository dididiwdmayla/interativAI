// A revisão dos curtos verticais ("O aprendiz" e "O chefão"), antes de entregar. Para cada um:
// 1) folhas de contato em revisao/curtos/: um quadro a cada 0,5 s (folha-<id>.jpg), o primeiro segundo
//    (quadros 0, 5, 10... 30: folha-<id>-primeiro-segundo.jpg, porque é ele que decide se a pessoa fica),
//    a mesma folha em tamanho de celular (polegar-<id>.jpg, cada quadro com 360 px de largura) e as duas
//    folhas lado a lado (lado-a-lado.jpg), para conferir se parecem dois vídeos diferentes;
// 2) a lista proibida: OCR (tesseract, português) em um quadro a cada 0,25 s, atrás de "construção",
//    "Em breve", "chegando", "grátis" e "R$". Qualquer achado reprova. Antes, o OCR lê um quadro de
//    controle que TEM "Em construção" (uma tomada da apresentação), para provar que enxerga;
// 3) o laço: o primeiro quadro contra o último (diferença média por pixel abaixo de 2%) e a emenda do
//    som (duas cópias coladas: o degrau na emenda contra os degraus vizinhos, e a onda em emenda-<id>.png);
// 4) duração (14 a 16 s, igual à janela da música), preto, imagem parada, volume e pico, e a voz do
//    computadorzinho contra a música;
// 5) os textos: nenhum emoji, nenhuma cor fora dos tokens, nenhuma palavra da lista proibida, o número
//    de fases contra o numeros.json, e os cortes em cima das batidas.
// A leitura no mudo, o teste do polegar e a diferença entre os dois são de olhar as folhas.
// Uso: node scripts/revisar-curtos.mjs   (ou node scripts/revisar.mjs --curtos)
//      Revisa os arquivos de saida/ (a versão mais nova); sem eles, os de out/ (render ou rascunho).
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { folha } from "./lib/folha.mjs";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { audio } from "./lib/remotion.mjs";
import { carregarRoteiroDosCurtos } from "./lib/roteiro.mjs";

const R = await carregarRoteiroDosCurtos();
const REVISAO = path.join(PASTA_VIDEO, "revisao", "curtos");
const TEMPORARIO = path.join(PASTA_VIDEO, "out", "revisao-curtos");
mkdirSync(REVISAO, { recursive: true });
rmSync(TEMPORARIO, { recursive: true, force: true });
mkdirSync(TEMPORARIO, { recursive: true });

const CURTOS = [
  { id: "aprendiz", composicao: "CurtoAprendiz", prefixo: "interativai-curto-aprendiz-9x16" },
  { id: "chefao", composicao: "CurtoChefao", prefixo: "interativai-curto-chefao-9x16" },
];
const achar = (curto) => {
  const saida = path.join(PASTA_VIDEO, "saida");
  const finais = existsSync(saida) ? readdirSync(saida).filter((nome) => nome.startsWith(curto.prefixo) && nome.endsWith(".mp4")).sort((a, b) => Number(a.match(/-v(\d+)\./)[1]) - Number(b.match(/-v(\d+)\./)[1])) : [];
  if (finais.length) return path.join(saida, finais.at(-1));
  for (const nome of [`${curto.composicao}.mp4`, `rascunho-${curto.composicao}.mp4`]) if (existsSync(path.join(PASTA_VIDEO, "out", nome))) return path.join(PASTA_VIDEO, "out", nome);
  return null;
};

const ffmpeg = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8", maxBuffer: 1 << 29 });
const sonda = (arquivo, campo) => execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries", campo, "-of", "csv=p=0", arquivo]).toString().trim().replace(/,+$/, "");
const numeros = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "numeros.json"), "utf8"));
const vozes = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "vozes.json"), "utf8"));
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

// ---------------------------------------------------------------- o OCR
// "R$" só vale com o número do preço junto ("R$ 4", como o jogo escreve): o OCR às vezes lê "R$" num pedaço de
// palavra coberto por um efeito. Essas leituras sem número saem no relatório como "a conferir", sem reprovar.
const PROIBIDAS = [/constru[cç][aã]o/i, /em\s+breve/i, /chegando/i, /gr[aá]tis/i, /R\s?\$\s{0,2}\d/];
const DUVIDOSA = /R\s?\$(?!\s{0,2}\d)/;
const NOMES = ["construção", "Em breve", "chegando", "grátis", "R$"];
/** Onde o tesseract acha o português: o do sistema ou uma cópia em .cache/tessdata (baixada do repositório tessdata_fast). */
function pastaDoTesseract() {
  if (spawnSync("tesseract", ["--version"]).status !== 0) return { ok: false, motivo: "o tesseract não está instalado" };
  if (/^por$/m.test(spawnSync("tesseract", ["--list-langs"], { encoding: "utf8" }).stdout ?? "")) return { ok: true, env: {} };
  const local = path.join(PASTA_VIDEO, ".cache", "tessdata");
  if (!existsSync(path.join(local, "por.traineddata"))) {
    mkdirSync(local, { recursive: true });
    spawnSync("curl", ["-sS", "-L", "--max-time", "120", "-o", path.join(local, "por.traineddata"), "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/por.traineddata"]);
  }
  if (existsSync(path.join(local, "por.traineddata"))) return { ok: true, env: { TESSDATA_PREFIX: local } };
  return { ok: false, motivo: "o pacote de português do tesseract não instalou" };
}
const tesseract = pastaDoTesseract();
/**
 * O texto que o OCR lê num quadro. O tesseract se perde num quadro inteiro cheio de desenho, e letra miúda
 * (a etiqueta "Em construção" de uma ilha tem uns 26 px no quadro) escapa no tamanho original. O que deu
 * certo nos quadros de controle (dia, noite e Fliperama): cinco faixas horizontais de um terço da altura,
 * uma por cima da outra pela metade, em tons de cinza e ampliadas 3 vezes, lidas como texto solto (--psm 11).
 */
function ler(imagem, largura, altura) {
  const faixa = Math.round(altura / 3);
  const amplia = (3 * 1080) / largura;
  const leituras = [0, 1, 2, 3, 4].map(
    (n) =>
      new Promise((resolver) => {
        const recorte = imagem.replace(/\.png$/, `-faixa${n}.png`);
        const corta = spawn("ffmpeg", ["-v", "error", "-y", "-i", imagem, "-vf", `crop=iw:${faixa}:0:${Math.min(altura - faixa, Math.round((n * faixa) / 2))},scale=iw*${amplia}:ih*${amplia}:flags=lanczos,format=gray`, recorte], { stdio: "ignore" });
        corta.on("close", () => {
          let texto = "";
          const processo = spawn("tesseract", [recorte, "stdout", "-l", "por", "--psm", "11"], { env: { ...process.env, ...tesseract.env, OMP_THREAD_LIMIT: "1" }, stdio: ["ignore", "pipe", "ignore"] });
          processo.stdout.on("data", (pedaco) => (texto += pedaco));
          processo.on("close", () => resolver(texto));
        });
      }),
  );
  return leituras.reduce(async (antes, leitura) => `${await antes}\n${await leitura}`, Promise.resolve(""));
}
const achadosEm = (texto) => PROIBIDAS.flatMap((regra, i) => (regra.test(texto) ? [NOMES[i]] : []));

dizer("== A lista proibida (OCR) ==");
if (!tesseract.ok) dizer(`  SEM OCR: ${tesseract.motivo}. A conferência da lista proibida tem que ser feita olhando as folhas.`);
else {
  // Os quadros de controle: o mundo da apresentação no celular, com a ilha Páginas vivas e o "Em construção" dela na tela.
  const controle = path.join(PASTA_VIDEO, "public", "takes", "V02-mundo-celular.mp4");
  if (existsSync(controle)) {
    const vistos = [];
    for (const instante of [10, 12]) {
      const quadro = path.join(TEMPORARIO, `controle-${instante}.png`);
      ffmpeg(["-v", "error", "-y", "-ss", String(instante), "-i", controle, "-frames:v", "1", quadro]);
      vistos.push(achadosEm(await ler(quadro, 1080, 1920)).includes("construção"));
    }
    if (vistos.every(Boolean)) dizer('  o OCR enxerga: achou "construção" nos dois quadros de controle (a tomada V02 da apresentação, com a ilha Páginas vivas "Em construção" na tela)');
    else problema(`o OCR só achou "construção" em ${vistos.filter(Boolean).length} dos ${vistos.length} quadros de controle: o resultado dele não vale`);
  } else dizer("  (sem os quadros de controle: a tomada V02 não está em public/takes)");
}

// ---------------------------------------------------------------- cada curto
const folhas = [];
for (const curto of CURTOS) {
  const arquivo = achar(curto);
  if (!arquivo) {
    dizer(`\n${R.TITULOS[curto.id]}: nenhum vídeo para revisar (renderize antes).`);
    continue;
  }
  const quadros = Number(sonda(arquivo, "stream=nb_read_frames"));
  const [largura, altura] = sonda(arquivo, "stream=width,height").split(",").map(Number);
  const duracao = quadros / R.FPS;
  const janela = R.JANELAS[curto.id];
  dizer(`\n== ${R.TITULOS[curto.id]}: ${path.relative(PASTA_VIDEO, arquivo)} (${largura} x ${altura}, ${quadros} quadros, ${duracao.toFixed(2)} s) ==`);
  if (quadros !== R.QUADROS[curto.id]) problema(`o arquivo tem ${quadros} quadros e o roteiro pede ${R.QUADROS[curto.id]}`);
  if (duracao < 14 || duracao > 16) problema(`a duração (${duracao.toFixed(2)} s) está fora de 14 a 16 s`);
  dizer(`  música: ${janela.musica}, ${janela.compassos} compassos (${janela.batidas} batidas de ${janela.batida} s) a partir do compasso ${janela.compassoInicial} (${janela.de} s), ${janela.rmsDb} dB RMS`);

  // 1) As folhas.
  const pasta = path.join(TEMPORARIO, curto.id);
  mkdirSync(pasta, { recursive: true });
  const inteiro = (nome, filtro, extra = []) => ffmpeg(["-v", "error", "-y", "-i", arquivo, "-vf", filtro, ...extra, path.join(pasta, nome)]);
  // Os quadros exatos: o quadro `n` está em n / 30 s. Um a cada 0,5 s (0, 15, 30...) para as folhas e o polegar.
  const cadaMeio = Array.from({ length: Math.ceil(quadros / 15) }, (_, i) => i * 15);
  const cadaQuarto = [...new Set(Array.from({ length: Math.ceil(quadros / 7.5) }, (_, i) => Math.round(i * 7.5)).filter((n) => n < quadros))];
  const escolher = (lista) => `select='${lista.map((n) => `eq(n\\,${n})`).join("+")}'`;
  inteiro("meio-%03d.png", escolher(cadaMeio), ["-vsync", "0"]);
  const meios = readdirSync(pasta).filter((nome) => nome.startsWith("meio-")).sort().map((nome) => path.join(pasta, nome));
  const folhaDoCurto = path.join(REVISAO, `folha-${curto.id}.jpg`);
  folha(meios, folhaDoCurto, { colunas: 8, largura: 270 });
  folhas.push(folhaDoCurto);
  folha(meios, path.join(REVISAO, `polegar-${curto.id}.jpg`), { colunas: 6, largura: 360 });
  inteiro("um-%02d.png", "select='not(mod(n\\,5))*lte(n\\,30)'", ["-vsync", "0"]);
  const primeiros = readdirSync(pasta).filter((nome) => nome.startsWith("um-")).sort().map((nome) => path.join(pasta, nome));
  folha(primeiros, path.join(REVISAO, `folha-${curto.id}-primeiro-segundo.jpg`), { colunas: 7, largura: 300 });
  dizer(`  folhas: revisao/curtos/folha-${curto.id}.jpg (${meios.length} quadros, um a cada 0,5 s), folha-${curto.id}-primeiro-segundo.jpg (${primeiros.length} quadros) e polegar-${curto.id}.jpg (360 px por quadro)`);

  // 2) A lista proibida, em um quadro a cada 0,25 s.
  if (tesseract.ok) {
    inteiro("ocr-%03d.png", escolher(cadaQuarto), ["-vsync", "0"]);
    const lidos = readdirSync(pasta).filter((nome) => /^ocr-\d+\.png$/.test(nome)).sort();
    const achados = [];
    const duvidosas = [];
    for (let i = 0; i < lidos.length; i += 1) {
      const textos = await Promise.all(lidos.slice(i, i + 1).map((nome) => ler(path.join(pasta, nome), largura, altura)));
      textos.forEach((texto, j) => {
        for (const palavra of achadosEm(texto)) achados.push(`"${palavra}" em ${(cadaQuarto[i + j] / R.FPS).toFixed(2)} s`);
        const duvida = DUVIDOSA.exec(texto);
        if (duvida) duvidosas.push(`"${texto.slice(Math.max(0, duvida.index - 14), duvida.index + 4).replace(/\s+/g, " ").trim()}" em ${(cadaQuarto[i + j] / R.FPS).toFixed(2)} s`);
      });
    }
    if (duvidosas.length) dizer(`  a conferir no olho (o OCR leu "R$" sem número de preço junto): ${duvidosas.join(", ")}`);
    if (achados.length) problema(`lista proibida: ${achados.join(", ")}`);
    else dizer(`  lista proibida: nada em ${lidos.length} quadros (um a cada 0,25 s, cada um lido em cinco faixas ampliadas): ${NOMES.map((nome) => `"${nome}"`).join(", ")}`);
  }

  // 3) O laço: o primeiro quadro contra o último.
  const cru = (n) => spawnSync("ffmpeg", ["-v", "error", "-i", arquivo, "-vf", `select='eq(n\\,${n})',scale=540:960`, "-vsync", "0", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 26 }).stdout;
  const [primeiro, ultimo] = [cru(0), cru(quadros - 1)];
  let soma = 0;
  for (let i = 0; i < primeiro.length; i++) soma += Math.abs(primeiro[i] - ultimo[i]);
  const diferenca = (soma / primeiro.length / 255) * 100;
  if (diferenca >= 2) problema(`laço da imagem: o último quadro difere ${diferenca.toFixed(2)}% do primeiro (o limite é 2%)`);
  else dizer(`  laço da imagem: o último quadro difere ${diferenca.toFixed(2)}% do primeiro (diferença média por pixel; o limite é 2%)`);

  // A emenda do som: duas cópias coladas, o degrau na emenda contra os degraus de perto.
  const som = spawnSync("ffmpeg", ["-v", "error", "-i", arquivo, "-vn", "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], { maxBuffer: 1 << 28 }).stdout;
  const amostras = new Float32Array(som.buffer, som.byteOffset, Math.floor(som.byteLength / 4));
  if (amostras.length > 9600) {
    const n = amostras.length;
    const degrau = Math.abs(amostras[0] - amostras[n - 1]);
    let vizinho = 0;
    for (let i = n - 2400; i < n - 1; i++) vizinho = Math.max(vizinho, Math.abs(amostras[i + 1] - amostras[i]));
    for (let i = 0; i < 2400; i++) vizinho = Math.max(vizinho, Math.abs(amostras[i + 1] - amostras[i]));
    const rms = (de, ate) => Math.sqrt(amostras.slice(de, ate).reduce((s, v) => s + v * v, 0) / (ate - de));
    const antes = 20 * Math.log10(Math.max(1e-6, rms(n - 2400, n)));
    const depois = 20 * Math.log10(Math.max(1e-6, rms(0, 2400)));
    const colado = path.join(pasta, "colado.wav");
    ffmpeg(["-v", "error", "-y", "-i", arquivo, "-i", arquivo, "-filter_complex", "[0:a][1:a]concat=n=2:v=0:a=1", colado]);
    const coladoDura = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", colado]).toString().trim());
    ffmpeg(["-v", "error", "-y", "-ss", String(coladoDura / 2 - 0.1), "-t", "0.2", "-i", colado, "-filter_complex", "showwavespic=s=1200x300:colors=white,format=rgb24", "-frames:v", "1", path.join(REVISAO, `emenda-${curto.id}.png`)]);
    const linha = `laço do som: degrau de ${degrau.toFixed(4)} na emenda (o maior degrau entre amostras vizinhas nos 50 ms de cada lado é ${vizinho.toFixed(4)}); volume ${antes.toFixed(1)} dB antes e ${depois.toFixed(1)} dB depois; a onda da emenda está em revisao/curtos/emenda-${curto.id}.png`;
    if (degrau > Math.max(0.02, vizinho * 1.5)) problema(linha);
    else dizer(`  ${linha}`);
  } else problema("o arquivo não tem áudio para conferir a emenda");

  // 4) Preto, parado, volume.
  const preto = ffmpeg(["-i", arquivo, "-vf", "blackdetect=d=0.1:pix_th=0.06", "-an", "-f", "null", "-"]).stderr;
  const pretos = [...preto.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => `${Number(m[1]).toFixed(2)} a ${Number(m[2]).toFixed(2)} s`);
  if (pretos.length) problema(`tela preta: ${pretos.join(", ")}`);
  else dizer("  sem tela preta (o quadro 0 já é imagem e texto: é a capa)");
  const congelado = ffmpeg(["-i", arquivo, "-vf", "freezedetect=n=-50dB:d=0.9", "-an", "-f", "null", "-"]).stderr;
  const congelados = [...congelado.matchAll(/freeze_start: ([\d.]+)[\s\S]*?freeze_duration: ([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  if (congelados.some(([, dura]) => dura > 2.2)) problema(`imagem parada por mais de 2,2 s: ${congelados.map(([de, dura]) => `em ${de.toFixed(1)} s por ${dura.toFixed(1)} s`).join(", ")}`);
  else dizer(congelados.length ? `  imagem quase parada (mais de 0,9 s; o limite é 2,2 s): ${congelados.map(([de, dura]) => `em ${de.toFixed(1)} s por ${dura.toFixed(1)} s`).join(", ")}` : "  nenhum trecho com a imagem parada por mais de 0,9 s");
  const medida = ffmpeg(["-i", arquivo, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"]).stderr;
  const lufs = [...medida.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].map((m) => Number(m[1])).at(-1);
  const pico = [...medida.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].map((m) => Number(m[1])).at(-1);
  dizer(`  volume integrado: ${lufs} LUFS; pico real: ${pico} dBTP; tamanho: ${(readFileSync(arquivo).length / 1e6).toFixed(1)} MB`);

  // A voz do computadorzinho contra a música (renderizadas em separado, do mesmo roteiro).
  const wavVoz = path.join(pasta, "voz.wav");
  const wavMusica = path.join(pasta, "musica.wav");
  await audio(curto.composicao, wavVoz, "voz");
  await audio(curto.composicao, wavMusica, "musica");
  const rms = (wav, de, ate) => {
    const saida = ffmpeg(["-ss", String(de), "-t", String(Math.max(0.05, ate - de)), "-i", wav, "-af", "astats=metadata=0:measure_overall=RMS_level:measure_perchannel=none", "-f", "null", "-"]).stderr;
    const achado = /RMS level dB:\s*(-?[\d.]+|-inf)/.exec(saida);
    return achado ? (achado[1] === "-inf" ? -120 : Number(achado[1])) : NaN;
  };
  for (const item of R.falasDo(curto.id)) {
    const inicio = R.segundoDa(curto.id, item.em);
    const dura = vozes[item.fala.id].duracao;
    const voz = rms(wavVoz, inicio, inicio + dura);
    const musica = rms(wavMusica, inicio, inicio + dura);
    const antes = rms(wavMusica, Math.max(0, inicio - 1), inicio - 0.25);
    const linha = `fala "${item.fala.texto}" em ${inicio.toFixed(2)} s: voz ${voz.toFixed(1)} dB, música ${musica.toFixed(1)} dB (antes da fala: ${antes.toFixed(1)} dB), voz ${(voz - musica).toFixed(1)} dB acima`;
    if (voz - musica < 6) problema(linha);
    else dizer(`  ${linha}`);
  }
}

// As duas folhas lado a lado: têm que parecer dois vídeos diferentes.
if (folhas.length === 2) {
  ffmpeg(["-v", "error", "-y", "-i", folhas[0], "-i", folhas[1], "-filter_complex", "[0:v]pad=iw+24:ih:0:0:white[a];[a][1:v]hstack=inputs=2", "-q:v", "3", path.join(REVISAO, "lado-a-lado.jpg")]);
  dizer("\n  as duas folhas lado a lado: revisao/curtos/lado-a-lado.jpg");
}

// ---------------------------------------------------------------- textos e ritmo
dizer("\n== Textos, afirmações e ritmo ==");
const textos = Object.values(R.PLANOS).flatMap((planos) => planos.flatMap((plano) => plano.texto));
const pastaDosCurtos = path.join(PASTA_VIDEO, "src", "curtos");
const fontes = [...readdirSync(pastaDosCurtos), ...readdirSync(path.join(pastaDosCurtos, "pecas")).map((nome) => `pecas/${nome}`)].filter((nome) => /\.tsx?$/.test(nome));
const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
const comEmoji = [...textos.filter((texto) => emoji.test(texto)), ...fontes.filter((arquivo) => emoji.test(readFileSync(path.join(pastaDosCurtos, arquivo), "utf8")))];
if (comEmoji.length) problema(`emoji em: ${comEmoji.join(", ")}`);
else dizer(`  nenhum emoji em ${textos.length} textos nem em ${fontes.length} arquivos de src/curtos`);
const hex = fontes.filter((arquivo) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(path.join(pastaDosCurtos, arquivo), "utf8").replace(/url\(#[^)]+\)/g, "")));
if (hex.length) problema(`cor em hexadecimal fora dos tokens em: ${hex.join(", ")}`);
else dizer("  nenhuma cor em hexadecimal em src/curtos (só tokens de src/tema/tokens.css)");
const proibidoNoTexto = /constru[cç][aã]o|em breve|chegando|gr[áa]tis|gratuit[oa]|R\$|pre[çc]o|assinatura|certificado|emprego/i;
const ruins = textos.filter((texto) => proibidoNoTexto.test(texto));
if (ruins.length) problema(`texto fora do combinado: ${ruins.join(" | ")}`);
else dizer('  nenhum texto com "em construção", "em breve", "chegando", preço, grátis, assinatura, certificado ou emprego');
if (numeros.maisDeFases >= numeros.fasesPublicadas) problema(`o número mostrado ("${R.NUMERO_DE_FASES} fases") não bate com o código (${numeros.fasesPublicadas} fases publicadas)`);
else dizer(`  número mostrado: "${R.NUMERO_DE_FASES} fases" (o código tem ${numeros.fasesPublicadas} fases publicadas: confere)`);
for (const curto of CURTOS) {
  const cortes = R.cortesDo(curto.id);
  const foraDaGrade = cortes.filter((corte) => !Number.isInteger(corte.de * 2) || !Number.isInteger(corte.ate * 2));
  const maisLongo = Math.max(...cortes.map((corte) => R.segundoDa(curto.id, corte.ate) - R.segundoDa(curto.id, corte.de)));
  if (foraDaGrade.length) problema(`${R.TITULOS[curto.id]}: corte fora da grade de batidas: ${foraDaGrade.map((corte) => `${corte.tomada} (${corte.de} a ${corte.ate})`).join(", ")}`);
  else dizer(`  ${R.TITULOS[curto.id]}: os ${cortes.length} cortes caem em batidas (ou meias batidas) da música; a gravação mais longa sem corte dura ${maisLongo.toFixed(2)} s`);
}

writeFileSync(path.join(REVISAO, "revisao-curtos.txt"), `${relatorio.join("\n")}\n`);
console.log(`\n${problemas ? `${problemas} problema(s).` : "Revisão automática sem problemas."} O resumo ficou em revisao/curtos/revisao-curtos.txt; falta olhar as folhas.`);
process.exit(0);
