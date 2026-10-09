// Gera o ROTEIRO-CURTOS.md a partir do roteiro em dados (src/curtos/roteiro.ts) e confere o que dá para
// conferir sem renderizar: cada corte dentro da tomada, os cortes em cima das batidas, os planos em fila
// (sem buraco nem sobra) e a duração do vídeo igual à janela da música.
// Uso: node scripts/roteiro-curtos-md.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PASTA_VIDEO } from "./lib/jogo.mjs";
import { carregarRoteiroDosCurtos } from "./lib/roteiro.mjs";

const R = await carregarRoteiroDosCurtos();
const energia = JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "energia.json"), "utf8"));
const take = (id) => JSON.parse(readFileSync(path.join(PASTA_VIDEO, "src", "dados", "takes", `${id}.json`), "utf8"));
const s = (n) => n.toFixed(2).replace(".", ",");
const instante = (registro, valor) => (typeof valor === "number" ? valor : registro.eventos.find((evento) => evento.tipo === "marca" && evento.nome === valor.marca).t + (valor.mais ?? 0));
const comoComeca = (valor) => (typeof valor === "number" ? `${s(valor)} s` : `marca "${valor.marca}"${valor.mais ? ` ${valor.mais > 0 ? "+" : "-"} ${s(Math.abs(valor.mais))} s` : ""}`);
const problemas = [];

const linhas = [
  "# Roteiro dos curtos verticais",
  "",
  "Gerado por `node scripts/roteiro-curtos-md.mjs` a partir de `src/curtos/roteiro.ts` (a fonte única dos dois curtos). Não edite este arquivo: mude o roteiro e gere de novo.",
  "",
  "Os dois vendem a mesma ideia, \"Programe jogando.\", de jeitos opostos. Formato: 1080 x 1920, 30 fps, em laço (o último quadro é o primeiro).",
  "",
  "A unidade de tempo é a batida da música. A música de cada curto é uma janela de compassos inteiros escolhida por medida (`scripts/energia.mjs`); o vídeo dura exatamente a janela e todo corte cai numa batida.",
  "",
];

for (const curto of ["aprendiz", "chefao"]) {
  const janela = R.JANELAS[curto];
  const escolha = energia.escolhas[curto];
  const planos = R.PLANOS[curto];
  linhas.push(`## ${R.TITULOS[curto]} (tema ${R.TEMAS[curto] === "doce" ? "Doce" : "Fliperama"})`, "");
  linhas.push(`- **Duração:** ${R.QUADROS[curto]} quadros, ${s(R.DURACAO[curto])} s (${janela.batidas} batidas de ${String(janela.batida).replace(".", ",")} s, ${String(janela.bpm).replace(".", ",")} bpm).`);
  linhas.push(`- **Música:** \`${janela.musica}\`, janela de ${janela.compassos} compassos a partir do compasso ${janela.compassoInicial} (${s(janela.de)} s da faixa), ${String(janela.rmsDb).replace(".", ",")} dB RMS. Por RMS puro, a mais forte das candidatas era \`${escolha.maisFortePorRms.musica}\` (${String(escolha.maisFortePorRms.rmsDb).replace(".", ",")} dB, ${String(escolha.maisFortePorRms.bpm).replace(".", ",")} bpm); as janelas a menos de ${String(energia.empateDb).replace(".", ",")} dB dela (${escolha.empatadas.map((id) => `\`${id}\``).join(", ")}) empatam, e vence a mais rápida.`);
  linhas.push(`- **Laço do som:** os últimos 120 ms cruzam com os 120 ms que vêm antes do começo da janela; a música não entra nem sai (o vídeo repete).`, "");
  linhas.push("| Tempo | Batidas | Plano | Tomada | Texto na tela | Som | O que acontece |", "| --- | --- | --- | --- | --- | --- | --- |");
  let esperado = 0;
  for (const plano of planos) {
    if (Math.abs(plano.de - esperado) > 1e-6) problemas.push(`${R.TITULOS[curto]}: o plano "${plano.titulo}" começa na batida ${plano.de} e o anterior acabou na ${esperado}`);
    esperado = plano.ate;
    const tomadas = [...new Set(plano.cortes.map((corte) => corte.tomada.split("-")[0]))].join(", ") || "desenhado";
    const sons = [...plano.sons.map((som) => `\`${som.id}\` (batida ${String(som.em).replace(".", ",")})`), ...(plano.falas ?? []).map((item) => `voz: "${item.fala.texto}" (batida ${String(item.em).replace(".", ",")})`)];
    linhas.push(`| ${s(R.segundoDa(curto, plano.de))} a ${s(R.segundoDa(curto, plano.ate))} s | ${plano.de} a ${plano.ate} | ${plano.titulo} | ${tomadas} | ${plano.texto.map((texto) => `"${texto}"`).join("; ")} | ${sons.join("; ") || "a música"} | ${plano.acao} |`);
  }
  if (Math.abs(esperado - janela.batidas) > 1e-6) problemas.push(`${R.TITULOS[curto]}: os planos acabam na batida ${esperado} e a música tem ${janela.batidas}`);
  if (curto === "aprendiz") {
    const sons = R.sonsDasVitorias();
    linhas.push("", `Em cada fase vencida (o momento real da gravação): a fanfarra \`fase-concluida\` do jogo, três \`sint-estrela\` (uma por estrela que entra no placar), o \`sint-acerto\` do jogo quando o número fecha e, nas fases 1 e 3, o prêmio voando (\`sint-voa\` e \`desbloqueio\`). As vitórias caem nas batidas ${R.MOMENTOS_DO_APRENDIZ.vitorias.map((batida) => s(batida)).join(", ")} (${sons.length} sons ao todo).`);
  } else {
    linhas.push("", `A barra de vida do chefão tem ${R.MOMENTOS_DO_CHEFAO.testes.length} partes: uma por caso de teste que fica verde na gravação (batidas ${R.MOMENTOS_DO_CHEFAO.testes.join(", ")}). O escudo, de ${R.MOMENTOS_DO_CHEFAO.golpes.length} pedaços, quebra nos golpes da investigação (batidas ${R.MOMENTOS_DO_CHEFAO.golpes.join(", ")}). No nocaute (batida ${R.MOMENTOS_DO_CHEFAO.nocaute}), a imagem congela e a música some por ${R.MOMENTOS_DO_CHEFAO.quadrosCongelados} quadros.`);
  }
  linhas.push("", "### Cortes", "", "| Tempo | Batidas | Tomada | Começa em | Velocidade | Câmera |", "| --- | --- | --- | --- | --- | --- |");
  for (const corte of R.cortesDo(curto)) {
    const registro = take(corte.tomada);
    const de = instante(registro, corte.inicio);
    const usa = (R.segundoDa(curto, corte.ate) - R.segundoDa(curto, corte.de)) * (corte.velocidade ?? 1);
    if (de < -0.001 || de + usa > registro.duracao + 0.05) problemas.push(`${R.TITULOS[curto]}: o corte de ${corte.tomada} (batidas ${corte.de} a ${corte.ate}) usa de ${de.toFixed(2)} a ${(de + usa).toFixed(2)} s e a tomada tem ${registro.duracao.toFixed(2)} s`);
    if (!Number.isInteger(corte.de * 2) || !Number.isInteger(corte.ate * 2)) problemas.push(`${R.TITULOS[curto]}: o corte de ${corte.tomada} não cai em batida (${corte.de} a ${corte.ate})`);
    const zooms = corte.camera.map((quadro) => String(quadro.zoom).replace(".", ","));
    linhas.push(`| ${s(R.segundoDa(curto, corte.de))} a ${s(R.segundoDa(curto, corte.ate))} s | ${String(corte.de).replace(".", ",")} a ${String(corte.ate).replace(".", ",")} | \`${corte.tomada}\` | ${comoComeca(corte.inicio)} (${s(de)} s) | ${String(corte.velocidade ?? 1).replace(".", ",")}x | zoom ${zooms.length > 1 ? `${zooms[0]} a ${zooms.at(-1)}` : zooms[0]} |`);
  }
  linhas.push("");
}

linhas.push("## Tomadas novas", "", "| Tomada | Tema | O que mostra |", "| --- | --- | --- |");
for (const id of ["V05-estilos-celular", "V06-chamado-celular", "V07-mundo-noite-celular", "V08-insignias-celular", "V09-vitrine-de-perto", "F01-missao-fliperama", "F02-luta-fliperama", "F03-mundo-fliperama", "F04-museu-fliperama", "F05-python-fliperama", "F06-insignias-fliperama"]) {
  const registro = take(id);
  linhas.push(`| \`${id}\` | ${id.startsWith("F") ? "Fliperama" : "Doce"} | ${registro.descricao}${registro.janela ? " (janela aproximada)" : ""} |`);
}
linhas.push("", "As tomadas V01 e V04 são as da apresentação v1. A V03 (a padaria no celular inteiro) não foi usada: no celular em pé o desenho da cena fica pequeno, e a solução do contrato escreve preços no letreiro.", "");

writeFileSync(path.join(PASTA_VIDEO, "ROTEIRO-CURTOS.md"), `${linhas.join("\n")}`);
for (const curto of ["aprendiz", "chefao"]) console.log(`${R.TITULOS[curto]}: ${R.QUADROS[curto]} quadros (${R.DURACAO[curto].toFixed(2)} s), ${R.PLANOS[curto].length} planos, ${R.cortesDo(curto).length} cortes`);
if (problemas.length) {
  console.error(`\n${problemas.length} problema(s) no roteiro dos curtos:`);
  for (const item of problemas) console.error(`  ${item}`);
  process.exit(1);
}
console.log("Roteiro dos curtos conferido: os planos fecham com a música e nenhum corte passa do fim da tomada nem sai da batida.");
