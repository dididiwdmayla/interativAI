// Fecha a entrega em saida/, sempre com a versão no nome (nunca sobrescreve uma versão que já existe):
// - a mixagem final de cada vídeo: loudnorm do ffmpeg em duas passagens (alvo -14 LUFS integrado,
//   pico real -1 dBTP), áudio AAC 192 kbps 48 kHz estéreo, o vídeo copiado sem recodificar, +faststart;
// - as capas (composições estáticas do Remotion) e o .srt com as falas e os tempos.
// Antes: node scripts/renderizar.mjs (gera out/Apresentacao169.mp4 e out/Apresentacao916.mp4).
// Uso: node scripts/finalizar.mjs [v1]
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { quadro } from "./lib/remotion.mjs";
import { carregarRoteiro } from "./lib/roteiro.mjs";

const versao = process.argv[2] ?? "v1";
if (!/^v\d+$/.test(versao)) throw new Error('a versão é "v1", "v2"...');
const SAIDA = path.join(PASTA_VIDEO, "saida");
const OUT = path.join(PASTA_VIDEO, "out");
mkdirSync(SAIDA, { recursive: true });
const R = await carregarRoteiro();
const vozes = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "vozes.json"), "utf8"));

const ENTREGAS = [
  { formato: "16x9", id: "Apresentacao169", capa: "Capa169", blocos: R.BLOCOS_169 },
  { formato: "9x16", id: "Apresentacao916", capa: "Capa916", blocos: R.BLOCOS_916 },
];
const destinos = ENTREGAS.flatMap((entrega) => [`interativai-apresentacao-${entrega.formato}-${versao}.mp4`, `capa-${entrega.formato}-${versao}.png`]).concat(`interativai-apresentacao-16x9-${versao}.srt`);
const jaExistem = destinos.filter((nome) => existsSync(path.join(SAIDA, nome)));
if (jaExistem.length && !process.env.SOBRESCREVER) throw new Error(`a versão ${versao} já existe em saida/ (${jaExistem[0]}...). Use a próxima versão; uma entrega nunca é sobrescrita.`);

const ffmpeg = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-y", ...args], { encoding: "utf8", maxBuffer: 1 << 28 });
// O alvo é -14 LUFS com pico real de -1 dBTP NO ARQUIVO FINAL. O codificador AAC sobe o pico real em
// até ~1 dB depois do loudnorm, então o filtro mira -2 dBTP e o script confere o resultado medido.
const ALVO = "I=-14:TP=-2:LRA=11";
const PICO_MAXIMO = -1;

function medir(arquivo) {
  const saida = ffmpeg(["-i", arquivo, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"]).stderr;
  const integrado = [...saida.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].map((m) => Number(m[1])).at(-1);
  const pico = [...saida.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].map((m) => Number(m[1])).at(-1);
  return { integrado, pico };
}

for (const entrega of ENTREGAS) {
  const entrada = path.join(OUT, `${entrega.id}.mp4`);
  if (!existsSync(entrada)) throw new Error(`falta ${path.relative(PASTA_VIDEO, entrada)}: rode node scripts/renderizar.mjs`);
  const destino = path.join(SAIDA, `interativai-apresentacao-${entrega.formato}-${versao}.mp4`);

  // Primeira passagem: mede. Segunda: aplica com as medidas (linear quando cabe no pico).
  const primeira = ffmpeg(["-i", entrada, "-af", `loudnorm=${ALVO}:print_format=json`, "-vn", "-f", "null", "-"]).stderr;
  const medida = JSON.parse(primeira.slice(primeira.lastIndexOf("{"), primeira.lastIndexOf("}") + 1));
  const filtro = `loudnorm=${ALVO}:measured_I=${medida.input_i}:measured_TP=${medida.input_tp}:measured_LRA=${medida.input_lra}:measured_thresh=${medida.input_thresh}:offset=${medida.target_offset}:linear=true`;
  const segunda = ffmpeg(["-i", entrada, "-map", "0:v:0", "-map", "0:a:0", "-c:v", "copy", "-af", filtro, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", destino]);
  if (segunda.status !== 0) throw new Error(`a mixagem de ${entrega.formato} falhou: ${segunda.stderr.split("\n").slice(-4).join(" ")}`);

  const { integrado, pico } = medir(destino);
  const mb = statSync(destino).size / 1e6;
  const duracao = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", destino]).toString().trim());
  console.log(`${path.basename(destino)}: ${duracao.toFixed(2)} s, ${mb.toFixed(1)} MB, ${integrado} LUFS, pico real ${pico} dBTP (antes: ${medida.input_i} LUFS)`);
  if (pico > PICO_MAXIMO + 0.05) console.log(`  ATENÇÃO: o pico real ficou em ${pico} dBTP (o limite é ${PICO_MAXIMO}).`);
  if (mb > 40) console.log(`  ATENÇÃO: passou de 40 MB. Renderize de novo com o CRF mais alto (CRF=20 node scripts/renderizar.mjs ${entrega.id}, até 21) e finalize outra vez.`);

  // A capa: um quadro do mundo de noite (T03) vira o fundo, e o Remotion renderiza a composição estática.
  mkdirSync(path.join(PASTA_VIDEO, "public", "capa"), { recursive: true });
  ffmpeg(["-v", "error", "-ss", "2.5", "-i", path.join(PASTA_VIDEO, "public", "takes", "T03-mundo-noite.mp4"), "-frames:v", "1", "-q:v", "2", path.join(PASTA_VIDEO, "public", "capa", "mundo-noite.jpg")]);
  const capa = path.join(SAIDA, `capa-${entrega.formato}-${versao}.png`);
  await quadro(entrega.capa, 0, capa, 1);
  console.log(`${path.basename(capa)}: pronta`);
}

// As legendas: cada balão vira uma entrada, com o tempo em que ele fica na tela.
const carimbo = (segundos) => {
  const ms = Math.round(segundos * 1000);
  const pad = (n, casas = 2) => String(n).padStart(casas, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};
const duracaoDaVoz = (id) => (R.FALAS[id].vozes ? R.FALAS[id].vozes.map((parte) => parte.id) : [id]).reduce((soma, parte, indice) => soma + vozes[parte].duracao + (indice ? 0.12 : 0), 0);
const falas = R.falasNoTempo(R.BLOCOS_169);
const srt = falas
  .map((fala, indice) => {
    const fim = Math.min(fala.inicio + Math.max(R.tempoDoBalao(fala.texto), duracaoDaVoz(fala.fala) + 0.5), falas[indice + 1]?.inicio ?? Infinity);
    return `${indice + 1}\n${carimbo(fala.inicio)} --> ${carimbo(fim)}\n${fala.texto}\n`;
  })
  .join("\n");
const legenda = path.join(SAIDA, `interativai-apresentacao-16x9-${versao}.srt`);
writeFileSync(legenda, srt);
console.log(`${path.basename(legenda)}: ${falas.length} falas`);
process.exit(0);
