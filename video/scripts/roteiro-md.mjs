// Gera o ROTEIRO.md a partir do src/roteiro.ts (tempo, bloco, tomada, fala,
// música) e confere o roteiro: corte que passa do fim da tomada, falas que se
// atropelam, balão abaixo do tempo mínimo e a duração total.
// Uso: node scripts/roteiro-md.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { carregarRoteiro } from "./lib/roteiro.mjs";

const R = await carregarRoteiro();
const vozes = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "vozes.json"), "utf8"));
const numeros = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "numeros.json"), "utf8"));
const take = (id) => JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "takes", `${id}.json`), "utf8"));
const marca = (t, nome) => {
  const evento = t.eventos.find((item) => item.tipo === "marca" && item.nome === nome);
  if (!evento) throw new Error(`a tomada ${t.id} não tem a marca "${nome}"`);
  return evento.t;
};
const instante = (t, valor) => (typeof valor === "number" ? valor : marca(t, valor.marca) + (valor.mais ?? 0));
const tempo = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
const duracaoDaVoz = (id) => {
  const fala = R.FALAS[id];
  const ids = fala.vozes ? fala.vozes.map((parte) => parte.id) : [id];
  return ids.reduce((soma, parte, indice) => soma + vozes[parte].duracao + (indice ? 0.12 : 0), 0);
};
const duracaoDoBalao = (id) => Math.max(R.tempoDoBalao(R.FALAS[id].texto), duracaoDaVoz(id) + 0.5);

const avisos = [];
function versao(titulo, blocos, limite) {
  const noTempo = R.noTempo(blocos);
  const total = R.duracaoTotal(blocos);
  const linhas = [`## ${titulo}`, "", `Duração: ${total.toFixed(2)} s (${Math.round(total * R.FPS)} quadros a ${R.FPS} por segundo).`, ""];
  if (total > limite) avisos.push(`${titulo}: ${total.toFixed(1)} s passa do limite de ${limite} s`);
  let fimDaUltimaFala = -1;
  for (const bloco of noTempo) {
    linhas.push(`### ${tempo(bloco.inicio)} · ${bloco.titulo} (${(bloco.fim - bloco.inicio).toFixed(2)} s)`, "");
    linhas.push(`Música: ${bloco.musica ?? "sem música"}${[bloco.objetivo, ...(bloco.maisObjetivos ?? [])].filter(Boolean).map((objetivo) => ` · Objetivo ${objetivo.indice + 1} marcado em ${tempo(bloco.inicio + objetivo.em)}: "${R.OBJETIVOS[objetivo.indice]}"`).join("")}`, "");
    const itens = [];
    for (const corte of bloco.cortes) {
      const t = take(corte.tomada);
      const de = instante(t, corte.de);
      const velocidade = corte.velocidade ?? 1;
      const ate = de + corte.duracao * velocidade;
      if (de < 0 || ate > t.duracao + 0.02) avisos.push(`${titulo}, ${bloco.titulo}: o corte da ${corte.tomada} usa ${de.toFixed(2)} a ${ate.toFixed(2)} s e a tomada tem ${t.duracao.toFixed(2)} s`);
      itens.push({ em: bloco.inicio + corte.em, texto: `Tomada ${corte.tomada}, de ${de.toFixed(1)} a ${ate.toFixed(1)} s${velocidade !== 1 ? ` (em ${String(velocidade).replace(".", ",")}x)` : ""}${corte.mergulho ? ", com o mergulho na tela" : ""}${corte.palavra ? `, palavra "${corte.palavra}"` : ""}${corte.recorte ? ", num cartão" : ""}` });
    }
    for (const item of bloco.falas) {
      const inicio = bloco.inicio + item.em;
      const balao = duracaoDoBalao(item.fala);
      if (inicio < fimDaUltimaFala - 0.01) avisos.push(`${titulo}, ${bloco.titulo}: a fala "${item.fala}" começa em ${tempo(inicio)} com o balão anterior ainda na tela (até ${tempo(fimDaUltimaFala)})`);
      fimDaUltimaFala = inicio + balao;
      itens.push({ em: inicio, texto: `Fala (${R.FALAS[item.fala].expressao}): "${R.FALAS[item.fala].texto}" · voz de ${duracaoDaVoz(item.fala).toFixed(2)} s, balão por ${balao.toFixed(2)} s` });
    }
    for (const efeito of bloco.efeitos) itens.push({ em: bloco.inicio + efeito.em, texto: `Efeito: ${efeito.id}` });
    itens.sort((a, b) => a.em - b.em);
    if (itens.length) {
      linhas.push("| Tempo | O que acontece |", "| --- | --- |");
      for (const item of itens) linhas.push(`| ${tempo(Math.max(0, item.em))} | ${item.texto} |`);
      linhas.push("");
    }
  }
  return { linhas, total, noTempo };
}

const larga = versao("Versão 16:9 (1920 x 1080)", R.BLOCOS_169, 110);
const alta = versao("Versão 9:16 (1080 x 1920)", R.BLOCOS_916, 50);

const md = [
  "# Roteiro do vídeo de apresentação",
  "",
  "Gerado por `node scripts/roteiro-md.mjs` a partir de `src/roteiro.ts`. Não edite à mão: mude o `roteiro.ts` e gere de novo.",
  "",
  `A lista da "${R.TITULO_DA_FASE}": ${R.OBJETIVOS.map((objetivo, indice) => `${indice + 1}. ${objetivo}`).join("; ")}. O último nunca é marcado.`,
  "",
  `Números do jogo usados no vídeo (de \`src/dados/numeros.json\`, contados por \`scripts/contar.mjs\`): ${numeros.fasesPublicadas} fases e ${numeros.unidadesPublicadas} unidades publicadas em ${numeros.ilhasComConteudo} ilhas; o vídeo diz "mais de ${numeros.maisDeFases} fases".`,
  "",
  ...larga.linhas,
  ...alta.linhas,
].join("\n");
writeFileSync(path.join(PASTA_VIDEO, "ROTEIRO.md"), md);

for (const [nome, v] of [["16:9", larga], ["9:16", alta]]) console.log(`${nome}: ${v.total.toFixed(2)} s · ${v.noTempo.map((bloco) => `${bloco.id} ${bloco.inicio.toFixed(2)}`).join(" | ")}`);
if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const aviso of avisos) console.log(`  - ${aviso}`);
  process.exitCode = 1;
} else console.log("Roteiro conferido: nenhum corte passa do fim da tomada e nenhuma fala atropela a outra.");
