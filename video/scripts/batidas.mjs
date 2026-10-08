// Acha o andamento e a grade de batidas de cada música (o musicas.json não
// traz BPM): energia dos ataques por janela, autocorrelação para o andamento
// e um pente para a fase. Grava src/dados/batidas.json; o roteiro usa a
// grade para a música entrar com uma batida forte em cima de cada corte.
// Uso: node scripts/batidas.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO, RAIZ } from "./lib/jogo.mjs";

const TAXA = 11025;
const SALTO = 128; // ~86 medidas por segundo
const musicas = JSON.parse(readFileSync(path.join(RAIZ, "public", "audio", "musica", "musicas.json"), "utf8")).faixas;

function analisar(arquivo) {
  const bruto = execFileSync("ffmpeg", ["-v", "error", "-i", arquivo, "-ac", "1", "-ar", String(TAXA), "-f", "s16le", "-"], { maxBuffer: 1 << 28 });
  const amostras = new Int16Array(bruto.buffer, bruto.byteOffset, bruto.byteLength / 2);
  const quadros = Math.floor(amostras.length / SALTO) - 2;
  const energia = new Float64Array(quadros);
  for (let i = 0; i < quadros; i++) {
    let soma = 0;
    for (let j = 0; j < SALTO * 2; j++) {
      const v = amostras[i * SALTO + j] / 32768;
      soma += v * v;
    }
    energia[i] = Math.log(1e-6 + soma);
  }
  // Ataque: quanto a energia subiu de uma janela para a outra (só subidas).
  const ataque = new Float64Array(quadros);
  for (let i = 1; i < quadros; i++) ataque[i] = Math.max(0, energia[i] - energia[i - 1]);
  const porSegundo = TAXA / SALTO;
  let melhor = { bpm: 0, valor: -1 };
  for (let bpm = 70; bpm <= 180; bpm += 0.25) {
    const atraso = (60 / bpm) * porSegundo;
    let valor = 0;
    for (let i = 0; i + atraso * 4 < quadros; i++) {
      const a = ataque[i];
      if (a === 0) continue;
      valor += a * (ataque[Math.round(i + atraso)] + 0.5 * ataque[Math.round(i + atraso * 2)] + 0.25 * ataque[Math.round(i + atraso * 4)]);
    }
    if (valor > melhor.valor) melhor = { bpm, valor };
  }
  // Fase: o deslocamento em que um pente de batidas pega mais ataque.
  const passo = (60 / melhor.bpm) * porSegundo;
  let fase = { inicio: 0, valor: -1 };
  for (let inicio = 0; inicio < passo; inicio += 0.5) {
    let valor = 0;
    for (let k = 0; inicio + k * passo < quadros; k++) valor += ataque[Math.round(inicio + k * passo)];
    if (valor > fase.valor) fase = { inicio, valor };
  }
  // Tempo forte: das 4 batidas do compasso, a que soma mais energia.
  let forte = { indice: 0, valor: -1 };
  for (let indice = 0; indice < 4; indice++) {
    let valor = 0;
    for (let k = indice; fase.inicio + k * passo < quadros; k += 4) valor += Math.exp(energia[Math.round(fase.inicio + k * passo)]) + ataque[Math.round(fase.inicio + k * passo)];
    if (valor > forte.valor) forte = { indice, valor };
  }
  return { bpmMedido: melhor.bpm, primeiraBatida: Number((fase.inicio / porSegundo).toFixed(3)), primeiroTempoForte: Number(((fase.inicio + forte.indice * passo) / porSegundo).toFixed(3)) };
}

// Os loops fecham em compassos inteiros: com a medida perto de um múltiplo de 8
// batidas, vale o número redondo, e o andamento exato sai da duração do loop.
// A grade adotada começa no zero do arquivo (o compasso 1 do loop).
const batidas = {};
for (const [id, faixa] of Object.entries(musicas)) {
  const medida = analisar(path.join(RAIZ, "public", faixa.arquivos.m4a));
  const medidas = (faixa.duracaoSegundos * medida.bpmMedido) / 60;
  const redondas = Math.round(medidas / 8) * 8;
  const confiavel = Math.abs(medidas - redondas) / redondas < 0.012;
  const batidasNoLoop = confiavel ? redondas : Number(medidas.toFixed(2));
  const bpm = Number(((batidasNoLoop * 60) / faixa.duracaoSegundos).toFixed(3));
  batidas[id] = { bpm, batida: Number((60 / bpm).toFixed(4)), batidasNoLoop, duracaoSegundos: faixa.duracaoSegundos, gradeConfiavel: confiavel, ...medida };
  console.log(`${id}: ${bpm} bpm (medido ${medida.bpmMedido}), ${batidasNoLoop} batidas no loop${confiavel ? "" : " (grade não confiável: cortar por duração)"}`);
}
writeFileSync(path.join(PASTA_VIDEO, "src", "dados", "batidas.json"), `${JSON.stringify(batidas, null, 2)}\n`);
