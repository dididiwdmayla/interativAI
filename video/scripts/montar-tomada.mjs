// Transforma os quadros de uma tomada (captura/brutos/<id>/) num mp4 de 30 fps
// constantes em public/takes/<id>.mp4, com o registro (src/dados/takes/<id>.json,
// versionado) e uma folha de contato de 12 quadros em revisao/tomadas/<id>.jpg.
// O screencast só manda quadro quando a tela muda: cada quadro dura até o
// próximo, e o último dura até o fim da tomada (concat do ffmpeg com duração).
// Uso: node scripts/montar-tomada.mjs [id ...]   (sem ids: todas as gravadas)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PASTA_VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRUTOS = path.join(PASTA_VIDEO, "captura", "brutos");
const TAKES = path.join(PASTA_VIDEO, "public", "takes");
const FOLHAS = path.join(PASTA_VIDEO, "revisao", "tomadas");
/** O registro de cada tomada (marcas, caixas, cursor) fica versionado: o roteiro e as composições dependem dele. */
const REGISTROS = path.join(PASTA_VIDEO, "src", "dados", "takes");
export const FPS = 30;

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "inherit", "inherit"] });
}

export function montarTomada(id) {
  const pasta = path.join(BRUTOS, id);
  const take = JSON.parse(readFileSync(path.join(pasta, "take.json"), "utf8"));
  const { quadros: recebidos, ...registro } = take;
  if (recebidos.length === 0) throw new Error(`${id}: nenhum quadro gravado`);
  // O screencast às vezes entrega dois quadros vizinhos fora de ordem (alguns ms): a ordem que vale é a
  // do carimbo de tempo. Sem isto, cada inversão esticava a tomada e as marcas do take.json saíam do lugar.
  const quadros = [...recebidos].sort((a, b) => a.t - b.t);
  const invertidos = recebidos.filter((quadro, indice) => indice > 0 && quadro.t < recebidos[indice - 1].t).length;
  mkdirSync(TAKES, { recursive: true });
  mkdirSync(FOLHAS, { recursive: true });

  const linhas = ["ffconcat version 1.0"];
  for (let i = 0; i < quadros.length; i++) {
    const inicio = i === 0 ? 0 : quadros[i].t;
    const fim = i + 1 < quadros.length ? quadros[i + 1].t : Math.max(take.duracao, quadros[i].t + 1 / FPS);
    linhas.push(`file '${quadros[i].arquivo}'`, `duration ${Math.max(0.001, fim - inicio).toFixed(4)}`);
  }
  linhas.push(`file '${quadros[quadros.length - 1].arquivo}'`);
  const lista = path.join(pasta, "lista.txt");
  writeFileSync(lista, linhas.join("\n"));

  const [largura, altura] = [take.saida.largura, take.saida.altura];
  const saida = path.join(TAKES, `${id}.mp4`);
  ffmpeg([
    "-f", "concat", "-safe", "0", "-i", lista,
    "-vf", `fps=${FPS},scale=${largura}:${altura}:flags=lanczos:force_original_aspect_ratio=decrease,pad=${largura}:${altura}:(ow-iw)/2:(oh-ih)/2,format=yuv420p`,
    "-t", String(take.duracao),
    "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-g", "15", "-bf", "0", "-movflags", "+faststart", "-an", saida,
  ]);

  // Os intervalos entre quadros dizem se a gravação ficou fluida.
  const intervalos = quadros.slice(1).map((q, i) => q.t - quadros[i].t);
  const longos = intervalos.filter((d) => d > 0.12).length;
  registro.quadrosPorSegundo = Number((quadros.length / take.duracao).toFixed(1));
  mkdirSync(REGISTROS, { recursive: true });
  writeFileSync(path.join(REGISTROS, `${id}.json`), `${JSON.stringify(registro)}\n`);

  const colunas = take.formato === "celular" ? 6 : 4;
  const linhasFolha = take.formato === "celular" ? 2 : 3;
  const passo = take.duracao / 12;
  ffmpeg([
    "-i", saida,
    "-vf", `fps=1/${passo.toFixed(3)},scale=${take.formato === "celular" ? 270 : 480}:-1,tile=${colunas}x${linhasFolha}:padding=6:margin=6`,
    "-frames:v", "1", "-q:v", "3", path.join(FOLHAS, `${id}.jpg`),
  ]);
  return { id, duracao: take.duracao, quadros: quadros.length, qps: registro.quadrosPorSegundo, pausasLongas: longos, invertidos };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(BRUTOS).filter((nome) => existsSync(path.join(BRUTOS, nome, "take.json")));
  for (const id of ids) {
    const r = montarTomada(id);
    console.log(`${r.id}: ${r.duracao.toFixed(1)} s, ${r.quadros} quadros (${r.qps}/s), ${r.pausasLongas} pausas acima de 120 ms, ${r.invertidos} quadros reordenados`);
  }
}
