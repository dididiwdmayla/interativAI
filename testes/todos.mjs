// Roda os testes de navegador que não dependem de configuração do tutor.
// Precisa do jogo no ar (npm run dev ou npm start) em URL_JOGO (padrão :3000).
// PARALELO=n roda n arquivos ao mesmo tempo (padrão 1, um atrás do outro).
import { spawn } from "node:child_process";

const TESTES = [
  ["sincronia.mjs"],
  ["ferramentas.mjs"],
  ["fase-completa.mjs", "desktop"],
  ["fase-completa.mjs", "retrato"],
  ["fase-completa.mjs", "paisagem"],
  ["movel.mjs"],
  ["ferramentas-novas.mjs"],
  ["apresentacao-movimento.mjs"],
  ["unidades.mjs", "desktop"],
  ["unidades.mjs", "retrato"],
  ["unidades.mjs", "paisagem"],
  ["renomear-links.mjs"],
  ["css.mjs"],
  ["estilos.mjs"],
  ["calculado.mjs"],
  ["documento.mjs"],
  ["variaveis.mjs", "desktop"],
  ["variaveis.mjs", "retrato"],
  ["variaveis.mjs", "paisagem"],
  ["tema.mjs", "desktop"],
  ["tema.mjs", "retrato"],
  ["tema.mjs", "paisagem"],
  ["dispositivo.mjs", "desktop"],
  ["dispositivo.mjs", "retrato"],
  ["dispositivo.mjs", "paisagem"],
  ["lighthouse.mjs", "desktop"],
  ["lighthouse.mjs", "retrato"],
  ["lighthouse.mjs", "paisagem"],
  ["publicar.mjs", "desktop"],
  ["publicar.mjs", "retrato"],
  ["publicar.mjs", "paisagem"],
  ["layout.mjs", "desktop"],
  ["layout.mjs", "retrato"],
  ["layout.mjs", "paisagem"],
  ["mapa.mjs", "desktop"],
  ["mapa.mjs", "retrato"],
  ["mapa.mjs", "paisagem"],
  ["explorar.mjs", "desktop"],
  ["explorar.mjs", "retrato"],
  ["explorar.mjs", "paisagem"],
  ["busca.mjs", "desktop"],
  ["busca.mjs", "retrato"],
  ["busca.mjs", "paisagem"],
  ["ser-encontrado.mjs", "desktop"],
  ["ser-encontrado.mjs", "retrato"],
  ["ser-encontrado.mjs", "paisagem"],
  ["campanha.mjs", "desktop"],
  ["campanha.mjs", "retrato"],
  ["campanha.mjs", "paisagem"],
  ["revisao.mjs", "desktop"],
  ["revisao.mjs", "retrato"],
  ["revisao.mjs", "paisagem"],
  ["console.mjs", "desktop"],
  ["console.mjs", "retrato"],
  ["console.mjs", "paisagem"],
  ["palco.mjs", "desktop"],
  ["palco.mjs", "retrato"],
  ["palco.mjs", "paisagem"],
  ["circuito.mjs", "desktop"],
  ["circuito.mjs", "retrato"],
  ["circuito.mjs", "paisagem"],
  ["logica.mjs", "desktop"],
  ["logica.mjs", "retrato"],
  ["logica.mjs", "paisagem"],
  ["primeiros-comandos.mjs", "desktop", "logica-primeiros-comandos-u2"],
  ["primeiros-comandos.mjs", "retrato", "logica-primeiros-comandos-u2"],
  ["primeiros-comandos.mjs", "paisagem", "logica-primeiros-comandos-u2"],
  ["primeiros-comandos.mjs", "desktop", "logica-primeiros-comandos-u3"],
  ["primeiros-comandos.mjs", "retrato", "logica-primeiros-comandos-u3"],
  ["primeiros-comandos.mjs", "paisagem", "logica-primeiros-comandos-u3"],
  ["decisoes.mjs", "desktop", "logica-decisoes-u1"],
  ["decisoes.mjs", "retrato", "logica-decisoes-u1"],
  ["decisoes.mjs", "paisagem", "logica-decisoes-u1"],
  ["retomar.mjs"],
  ["migracao.mjs"],
  ["audio.mjs"],
];

const PARALELO = Math.max(1, Number(process.env.PARALELO ?? 1));

/** Roda um arquivo; em paralelo, a saída de cada um sai inteira no fim, sem misturar. */
function rodar([arquivo, ...argumentos]) {
  return new Promise((resolver) => {
    const titulo = `\n# ${arquivo} ${argumentos.join(" ")}`;
    if (PARALELO === 1) console.log(titulo);
    const filho = spawn(process.execPath, [new URL(arquivo, import.meta.url).pathname, ...argumentos], {
      stdio: PARALELO === 1 ? "inherit" : "pipe",
    });
    let saida = "";
    filho.stdout?.on("data", (pedaco) => (saida += pedaco));
    filho.stderr?.on("data", (pedaco) => (saida += pedaco));
    filho.on("close", (codigo) => {
      if (PARALELO > 1) console.log(`${titulo}\n${saida.trimEnd()}`);
      resolver(codigo === 0);
    });
  });
}

const falhas = [];
const fila = [...TESTES];
await Promise.all(
  Array.from({ length: PARALELO }, async () => {
    while (fila.length > 0) {
      const teste = fila.shift();
      if (!(await rodar(teste))) falhas.push(teste.join(" "));
    }
  }),
);
console.log(falhas.length === 0 ? "\nTudo certo." : `\n${falhas.length} teste(s) falharam: ${falhas.join("; ")}`);
process.exit(falhas.length === 0 ? 0 : 1);
