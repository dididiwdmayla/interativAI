// Roda os testes de navegador que não dependem de configuração do tutor.
// Precisa do jogo no ar (npm run dev ou npm start) em URL_JOGO (padrão :3000).
import { execFileSync } from "node:child_process";

const TESTES = [
  ["sincronia.mjs"],
  ["ferramentas.mjs"],
  ["fase-completa.mjs", "desktop"],
  ["fase-completa.mjs", "retrato"],
  ["fase-completa.mjs", "paisagem"],
  ["movel.mjs"],
  ["ferramentas-novas.mjs"],
  ["unidades.mjs", "desktop"],
  ["unidades.mjs", "retrato"],
  ["unidades.mjs", "paisagem"],
  ["renomear-links.mjs"],
  ["mapa.mjs", "desktop"],
  ["mapa.mjs", "retrato"],
  ["mapa.mjs", "paisagem"],
  ["retomar.mjs"],
  ["migracao.mjs"],
  ["audio.mjs"],
];

let falhas = 0;
for (const [arquivo, ...argumentos] of TESTES) {
  console.log(`\n# ${arquivo} ${argumentos.join(" ")}`);
  try {
    execFileSync(process.execPath, [new URL(arquivo, import.meta.url).pathname, ...argumentos], { stdio: "inherit" });
  } catch {
    falhas++;
  }
}
console.log(falhas === 0 ? "\nTudo certo." : `\n${falhas} teste(s) falharam.`);
process.exit(falhas === 0 ? 0 : 1);
