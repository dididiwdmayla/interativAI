// Roda a bateria inteira de navegador (testes/todos.mjs: desktop, retrato e
// paisagem) várias vezes seguidas, para pegar instabilidade. Critério da
// estabilidade: 5 rodadas seguidas sem nenhuma falha, no build de produção.
// Uso (com o jogo no ar em URL_JOGO, de preferência npm run build && npm start):
//   npm run bateria:repetir            5 rodadas
//   RODADAS=2 npm run bateria:repetir  outra quantidade
import { spawnSync } from "node:child_process";

const RODADAS = Number(process.env.RODADAS ?? 5);
const resultados = [];

for (let rodada = 1; rodada <= RODADAS; rodada++) {
  console.log(`\n======== Rodada ${rodada} de ${RODADAS} ========`);
  const inicio = Date.now();
  const execucao = spawnSync(process.execPath, [new URL("todos.mjs", import.meta.url).pathname], { stdio: "inherit" });
  const minutos = ((Date.now() - inicio) / 60000).toFixed(1);
  const passou = execucao.status === 0;
  resultados.push({ rodada, passou, minutos });
  console.log(`\n======== Rodada ${rodada}: ${passou ? "verde" : "FALHOU"} (${minutos} min) ========`);
}

console.log("\nResumo:");
for (const { rodada, passou, minutos } of resultados) console.log(`  rodada ${rodada}: ${passou ? "verde" : "falhou"} (${minutos} min)`);
const falhas = resultados.filter((item) => !item.passou).length;
console.log(falhas === 0 ? `\n${RODADAS} rodadas seguidas verdes.` : `\n${falhas} de ${RODADAS} rodadas falharam.`);
process.exit(falhas === 0 ? 0 : 1);
