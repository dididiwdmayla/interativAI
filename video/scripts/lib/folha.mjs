// Junta imagens numa folha de contato (grade) com o ffmpeg.
import { execFileSync } from "node:child_process";

export function folha(arquivos, saida, { colunas = 2, largura = 960 } = {}) {
  const linhas = Math.ceil(arquivos.length / colunas);
  const entradas = arquivos.flatMap((arquivo) => ["-i", arquivo]);
  const escalas = arquivos.map((_, i) => `[${i}:v]scale=${largura}:-2,setsar=1[v${i}]`).join(";");
  const juntar = `${arquivos.map((_, i) => `[v${i}]`).join("")}xstack=inputs=${arquivos.length}:layout=${arquivos.map((_, i) => `${i % colunas === 0 ? "0" : Array.from({ length: i % colunas }, (_, c) => `w${c}`).join("+")}_${Math.floor(i / colunas) === 0 ? "0" : Array.from({ length: Math.floor(i / colunas) }, (_, r) => `h${r * colunas}`).join("+")}`).join("|")}:fill=black`;
  const filtro = arquivos.length === 1 ? `[0:v]scale=${largura}:-2` : `${escalas};${juntar}`;
  execFileSync("ffmpeg", ["-v", "error", "-y", ...entradas, "-filter_complex", filtro, "-frames:v", "1", "-q:v", "3", saida]);
  return { linhas };
}
