// Escolhe a música de cada curto medindo, não por gosto. Para cada faixa do jogo
// (public/musica/<id>.wav, decodificadas pelo vozes.mjs) com a grade de batidas confiável:
// - N é o número inteiro de compassos de 4 tempos mais perto de 15 s (fora de 14 a 16 s, a faixa não serve);
// - o RMS de cada compasso (a grade do batidas.json: o compasso 1 começa no zero do arquivo);
// - a janela de N compassos seguidos com mais energia, começando num tempo forte (o primeiro tempo de um
//   compasso). O loop emenda: a janela pode atravessar o fim da faixa.
// - o adiantamento: quantos milissegundos o ataque das batidas chega antes da grade (o corte do vídeo cai
//   em cima do ataque, não da grade).
// A regra da escolha:
// - "O chefão": a janela mais intensa de todas. "O aprendiz": a mais intensa entre as faixas alegres
//   (sites, mapa, logica), numa faixa diferente.
// - As faixas do jogo têm todas quase o mesmo volume: as janelas ficam a décimos de dB umas das outras.
//   Diferença menor que EMPATE_DB não se ouve; entre as empatadas com a mais forte, vence o andamento
//   mais rápido (o bpm do batidas.json, que também é medida).
// Grava src/dados/energia.json; o roteiro dos curtos lê as janelas de lá.
// Uso: node scripts/energia.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO } from "./lib/jogo.mjs";

const TAXA = 48000;
const ALVO = 15;
const EMPATE_DB = 0.5;
const ALEGRES = ["sites", "mapa", "logica"];
const batidas = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "batidas.json"), "utf8"));
const db = (valor) => Number((20 * Math.log10(Math.max(1e-9, valor))).toFixed(2));

/** O adiantamento do ataque em relação à grade: o deslocamento (de -90 a +60 ms) em que um pente de batidas pega mais ataque. */
function adiantamentoDe(amostras, batida) {
  const salto = 48; // 1 ms
  const quadros = Math.floor(amostras.length / salto) - 8;
  const energia = new Float64Array(quadros);
  for (let i = 0; i < quadros; i++) {
    let soma = 0;
    for (let j = 0; j < salto * 8; j++) {
      const v = amostras[i * salto + j];
      soma += v * v;
    }
    energia[i] = Math.log(1e-7 + soma);
  }
  const ataque = new Float64Array(quadros);
  for (let i = 8; i < quadros; i++) ataque[i] = Math.max(0, energia[i] - energia[i - 8]);
  let melhor = { ms: 0, valor: -1 };
  for (let ms = -90; ms <= 60; ms++) {
    let valor = 0;
    for (let k = 1; k * batida * 1000 + ms + 6 < quadros; k++) {
      const centro = Math.round(k * batida * 1000 + ms);
      for (let d = -3; d <= 3; d++) valor += ataque[centro + d];
    }
    if (valor > melhor.valor) melhor = { ms, valor };
  }
  return melhor.ms;
}

const faixas = {};
for (const [id, grade] of Object.entries(batidas)) {
  if (!grade.gradeConfiavel) {
    faixas[id] = { serve: false, motivo: "a grade de batidas não é confiável" };
    continue;
  }
  const bruto = execFileSync("ffmpeg", ["-v", "error", "-i", path.join(PASTA_VIDEO, "public", "musica", `${id}.wav`), "-ac", "1", "-ar", String(TAXA), "-f", "f32le", "-"], { maxBuffer: 1 << 29 });
  const amostras = new Float32Array(bruto.buffer, bruto.byteOffset, Math.floor(bruto.byteLength / 4));
  const batida = grade.duracaoSegundos / grade.batidasNoLoop;
  const compasso = batida * 4;
  const compassosNoLoop = Math.round(grade.batidasNoLoop / 4);
  const n = Math.round(ALVO / compasso);
  const duracao = n * compasso;
  const total = amostras.length;
  const energiaDoCompasso = [];
  for (let c = 0; c < compassosNoLoop; c++) {
    const de = Math.round(c * compasso * TAXA);
    const ate = Math.min(total, Math.round((c + 1) * compasso * TAXA));
    let soma = 0;
    for (let i = de; i < ate; i++) soma += amostras[i] * amostras[i];
    energiaDoCompasso.push(soma / (ate - de));
  }
  let melhor = { compasso: 0, valor: -1 };
  const janelas = [];
  for (let c = 0; c < compassosNoLoop; c++) {
    let soma = 0;
    for (let k = 0; k < n; k++) soma += energiaDoCompasso[(c + k) % compassosNoLoop];
    const valor = Math.sqrt(soma / n);
    janelas.push(db(valor));
    if (valor > melhor.valor) melhor = { compasso: c, valor };
  }
  const inteira = Math.sqrt(energiaDoCompasso.reduce((a, b) => a + b, 0) / compassosNoLoop);
  const serve = duracao >= 14 && duracao <= 16;
  faixas[id] = {
    serve,
    ...(serve ? {} : { motivo: `com ${n} compassos dura ${duracao.toFixed(2)} s (fora de 14 a 16 s)` }),
    bpm: grade.bpm,
    batida: Number(batida.toFixed(5)),
    compasso: Number(compasso.toFixed(5)),
    compassos: n,
    duracao: Number(duracao.toFixed(4)),
    adiantamentoMs: adiantamentoDe(amostras, batida),
    janela: { compasso: melhor.compasso + 1, de: Number((melhor.compasso * compasso).toFixed(4)), rmsDb: db(melhor.valor), atravessaOFim: melhor.compasso + n > compassosNoLoop },
    faixaInteiraDb: db(inteira),
    rmsPorCompassoDb: energiaDoCompasso.map((valor) => db(Math.sqrt(valor))),
    janelasDb: janelas,
  };
}

/** A mais intensa da lista; entre as que empatam com ela (menos de EMPATE_DB), a mais rápida. */
function escolher(candidatas) {
  const ordem = [...candidatas].sort((a, b) => b[1].janela.rmsDb - a[1].janela.rmsDb);
  const empatadas = ordem.filter(([, faixa]) => ordem[0][1].janela.rmsDb - faixa.janela.rmsDb < EMPATE_DB);
  const vencedora = [...empatadas].sort((a, b) => b[1].bpm - a[1].bpm)[0];
  return { vencedora, maisForte: ordem[0], empatadas: empatadas.map(([id]) => id) };
}
const servem = Object.entries(faixas).filter(([, faixa]) => faixa.serve);
const chefao = escolher(servem);
const aprendiz = escolher(servem.filter(([id]) => ALEGRES.includes(id) && id !== chefao.vencedora[0]));
const escolha = ({ vencedora: [id, faixa], maisForte, empatadas }) => ({
  musica: id,
  compassos: faixa.compassos,
  batidas: faixa.compassos * 4,
  compassoInicial: faixa.janela.compasso,
  de: faixa.janela.de,
  duracao: faixa.duracao,
  batida: faixa.batida,
  bpm: faixa.bpm,
  rmsDb: faixa.janela.rmsDb,
  adiantamentoMs: faixa.adiantamentoMs,
  maisFortePorRms: { musica: maisForte[0], rmsDb: maisForte[1].janela.rmsDb, bpm: maisForte[1].bpm },
  empatadas,
});
const saida = { alvoSegundos: ALVO, empateDb: EMPATE_DB, alegres: ALEGRES, escolhas: { aprendiz: escolha(aprendiz), chefao: escolha(chefao) }, faixas };
writeFileSync(path.join(PASTA_VIDEO, "src", "dados", "energia.json"), `${JSON.stringify(saida, null, 1)}\n`);

console.log("faixa           bpm      compassos  duração    janela (início)      RMS da janela   faixa inteira   ataque antes da grade");
for (const [id, faixa] of Object.entries(faixas)) {
  if (!faixa.janela) console.log(`${id.padEnd(15)} ${faixa.motivo}`);
  else console.log(`${id.padEnd(15)} ${String(faixa.bpm).padEnd(8)} ${String(faixa.compassos).padStart(5)}    ${faixa.duracao.toFixed(2).padStart(6)} s   compasso ${String(faixa.janela.compasso).padStart(2)} (${faixa.janela.de.toFixed(2).padStart(6)} s)   ${faixa.janela.rmsDb.toFixed(2).padStart(7)} dB     ${faixa.faixaInteiraDb.toFixed(2)} dB       ${-faixa.adiantamentoMs} ms${faixa.serve ? "" : `   NÃO SERVE: ${faixa.motivo}`}`);
}
for (const [nome, item] of Object.entries(saida.escolhas)) {
  console.log(`\n${nome}: ${item.musica}, ${item.compassos} compassos (${item.batidas} batidas) a partir do compasso ${item.compassoInicial} (${item.de} s), ${item.duracao} s, ${item.rmsDb} dB`);
  console.log(`  a mais forte por RMS: ${item.maisFortePorRms.musica} (${item.maisFortePorRms.rmsDb} dB, ${item.maisFortePorRms.bpm} bpm); empatadas a menos de ${EMPATE_DB} dB: ${item.empatadas.join(", ")}; vence a mais rápida`);
}
