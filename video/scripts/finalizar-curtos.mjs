// Fecha a entrega dos curtos em saida/, sempre com a versão no nome (nunca sobrescreve uma versão que já existe):
// - a mixagem final de cada um: alvo de -14 LUFS integrado e pico real de -1 dBTP no arquivo, áudio AAC
//   192 kbps 48 kHz estéreo, o vídeo copiado sem recodificar, +faststart;
// - a capa de cada um: o quadro 0 em PNG (é o que o feed mostra).
//
// A mixagem não usa o loudnorm dinâmico da apresentação: ele varia o volume ao longo do tempo (e começa cada
// arquivo "do zero"), e num vídeo em laço o fim tem que emendar no começo. Aqui o loudnorm só mede (a
// primeira passagem); a segunda aplica UM ganho, igual do começo ao fim, e um limitador que só segura os
// picos dos efeitos. O som é processado em três cópias coladas e a do meio é a que vale: o limitador chega
// na emenda já no estado em que vai sair dela. O ganho é ajustado até o arquivo medido bater o alvo.
//
// O som sai direto da composição (só a trilha, sem a imagem), então mexer na mixagem não pede render novo.
// Antes: node scripts/renderizar.mjs CurtoAprendiz CurtoChefao   (gera out/CurtoAprendiz.mp4 e out/CurtoChefao.mp4)
// Uso: node scripts/finalizar-curtos.mjs [v1]
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { audio, quadro } from "./lib/remotion.mjs";

const versao = process.argv[2] ?? "v1";
if (!/^v\d+$/.test(versao)) throw new Error('a versão é "v1", "v2"...');
const SAIDA = path.join(PASTA_VIDEO, "saida");
const OUT = path.join(PASTA_VIDEO, "out");
const MIXAGEM = path.join(OUT, "mixagem-curtos");
mkdirSync(SAIDA, { recursive: true });
mkdirSync(MIXAGEM, { recursive: true });

const CURTOS = [
  { id: "aprendiz", composicao: "CurtoAprendiz" },
  { id: "chefao", composicao: "CurtoChefao" },
];
const destinos = CURTOS.flatMap((curto) => [`interativai-curto-${curto.id}-9x16-${versao}.mp4`, `capa-curto-${curto.id}-${versao}.png`]);
const jaExistem = destinos.filter((nome) => existsSync(path.join(SAIDA, nome)));
if (jaExistem.length && !process.env.SOBRESCREVER) throw new Error(`a versão ${versao} dos curtos já existe em saida/ (${jaExistem[0]}...). Use a próxima versão; uma entrega nunca é sobrescrita.`);

const ffmpeg = (args) => {
  const saida = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-y", ...args], { encoding: "utf8", maxBuffer: 1 << 28 });
  if (saida.status !== 0) throw new Error(`ffmpeg falhou: ${saida.stderr.split("\n").slice(-4).join(" ")}`);
  return saida;
};
const ALVO_LUFS = -14;
const PICO_MAXIMO = -1;
/** O teto do limitador: o codificador AAC sobe o pico real em até ~1 dB, então ele segura um pouco antes. */
const TETO_DO_LIMITADOR = -2.2;
const TAMANHO_MAXIMO_MB = 15;
const duracaoDe = (arquivo) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arquivo]).toString().trim());

function medir(arquivo) {
  const saida = ffmpeg(["-i", arquivo, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"]).stderr;
  const integrado = [...saida.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].map((m) => Number(m[1])).at(-1);
  const pico = [...saida.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].map((m) => Number(m[1])).at(-1);
  return { integrado, pico };
}

for (const curto of CURTOS) {
  const imagem = path.join(OUT, `${curto.composicao}.mp4`);
  if (!existsSync(imagem)) throw new Error(`falta ${path.relative(PASTA_VIDEO, imagem)}: rode node scripts/renderizar.mjs ${curto.composicao}`);
  const destino = path.join(SAIDA, `interativai-curto-${curto.id}-9x16-${versao}.mp4`);

  // O som da composição, sem a imagem, cortado no número exato de amostras do vídeo (o render do áudio
  // sobra algumas amostras no fim; num laço, qualquer sobra vira um soluço na emenda).
  const renderizado = path.join(MIXAGEM, `${curto.id}-renderizado.wav`);
  const composicao = await audio(curto.composicao, renderizado, "tudo");
  const amostras = Math.round((composicao.durationInFrames / composicao.fps) * 48000);
  const cru = path.join(MIXAGEM, `${curto.id}-cru.wav`);
  ffmpeg(["-i", renderizado, "-af", `aresample=48000,atrim=end_sample=${amostras}`, "-ac", "2", "-c:a", "pcm_s24le", cru]);
  const primeira = ffmpeg(["-i", cru, "-af", `loudnorm=I=${ALVO_LUFS}:TP=${PICO_MAXIMO}:LRA=11:print_format=json`, "-f", "null", "-"]).stderr;
  const medida = JSON.parse(primeira.slice(primeira.lastIndexOf("{"), primeira.lastIndexOf("}") + 1));

  // Ganho fixo + limitador, em três cópias coladas; a do meio vira o som do vídeo. Ajusta o ganho até bater o alvo.
  let ganho = ALVO_LUFS - Number(medida.input_i);
  let resultado = null;
  const teto = (10 ** (TETO_DO_LIMITADOR / 20)).toFixed(4);
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    const mixado = path.join(MIXAGEM, `${curto.id}-mixado.wav`);
    ffmpeg(["-stream_loop", "2", "-i", cru, "-af", `volume=${ganho.toFixed(2)}dB,alimiter=limit=${teto}:attack=4:release=60:level=false:latency=true,atrim=start_sample=${amostras}:end_sample=${amostras * 2},asetpts=PTS-STARTPTS`, "-ar", "48000", "-ac", "2", "-c:a", "pcm_s24le", mixado]);
    ffmpeg(["-i", imagem, "-i", mixado, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-shortest", "-movflags", "+faststart", destino]);
    resultado = medir(destino);
    const erro = ALVO_LUFS - resultado.integrado;
    if (Math.abs(erro) <= 0.3) break;
    ganho += erro;
  }

  const mb = statSync(destino).size / 1e6;
  console.log(`${path.basename(destino)}: ${duracaoDe(destino).toFixed(2)} s, ${mb.toFixed(1)} MB, ${resultado.integrado} LUFS, pico real ${resultado.pico} dBTP (antes: ${medida.input_i} LUFS, pico ${medida.input_tp} dBTP; ganho fixo de ${ganho.toFixed(1)} dB com limitador em ${TETO_DO_LIMITADOR} dB)`);
  if (resultado.pico > PICO_MAXIMO + 0.05) console.log(`  ATENÇÃO: o pico real ficou em ${resultado.pico} dBTP (o limite é ${PICO_MAXIMO}).`);
  if (Math.abs(resultado.integrado - ALVO_LUFS) > 0.5) console.log(`  ATENÇÃO: o volume ficou a ${(resultado.integrado - ALVO_LUFS).toFixed(1)} LU do alvo.`);
  if (mb > TAMANHO_MAXIMO_MB) console.log(`  ATENÇÃO: passou de ${TAMANHO_MAXIMO_MB} MB. Renderize de novo com o CRF mais alto (CRF=20 node scripts/renderizar.mjs ${curto.composicao}) e finalize outra vez.`);

  // A capa é o quadro 0 (o gancho já é imagem e texto).
  const capa = path.join(SAIDA, `capa-curto-${curto.id}-${versao}.png`);
  await quadro(curto.composicao, 0, capa, 1);
  console.log(`${path.basename(capa)}: pronta (o quadro 0)`);
}
process.exit(0);
