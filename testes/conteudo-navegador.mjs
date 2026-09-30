// A bateria de conteúdo: só os testes de navegador que dependem do currículo e
// do conteúdo (mapa, explorar: lentes, trilhas e glossário; publicar: o fim da
// ilha; revisão), num layout só (desktop) e com saída resumida. Serve para
// prompts só de conteúdo, que não rodam a bateria completa: na rodada 13, três
// testes que dependem do currículo quebraram e ninguém viu até o prompt seguinte.
// Precisa do jogo no ar em URL_JOGO (padrão http://localhost:3000).
// Uso: npm run bateria:conteudo
import { spawn } from "node:child_process";

const TESTES = [
  ["mapa.mjs", "desktop"],
  ["explorar.mjs", "desktop"],
  ["publicar.mjs", "desktop"],
  ["revisao.mjs", "desktop"],
];

const url = process.env.URL_JOGO ?? "http://localhost:3000";
try {
  await fetch(url, { signal: AbortSignal.timeout(5000) });
} catch {
  console.error(`O jogo não está no ar em ${url}. Rode "npm run dev" (ou "npm run build && npm start") e tente de novo.`);
  process.exit(2);
}

function rodar([arquivo, ...argumentos]) {
  return new Promise((resolver) => {
    const filho = spawn(process.execPath, [new URL(arquivo, import.meta.url).pathname, ...argumentos], {
      env: { ...process.env, RESUMO: "1" },
      stdio: "pipe",
    });
    let saida = "";
    filho.stdout.on("data", (pedaco) => (saida += pedaco));
    filho.stderr.on("data", (pedaco) => (saida += pedaco));
    filho.on("close", (codigo) => resolver({ nome: `${arquivo} ${argumentos.join(" ")}`.trim(), passou: codigo === 0, saida }));
  });
}

const falhas = [];
for (const teste of TESTES) {
  const inicio = Date.now();
  const resultado = await rodar(teste);
  const segundos = ((Date.now() - inicio) / 1000).toFixed(0);
  console.log(`${resultado.passou ? "ok    " : "FALHOU"} ${resultado.nome} (${segundos} s)`);
  if (!resultado.passou) {
    falhas.push(resultado.nome);
    // Só o começo do que falhou: a mensagem do conferir() e a pilha curta.
    console.log(resultado.saida.trim().split("\n").slice(0, 8).join("\n"));
  }
}
console.log(falhas.length === 0 ? "\nBateria de conteúdo: tudo certo." : `\nBateria de conteúdo: ${falhas.length} falha(s): ${falhas.join("; ")}`);
process.exit(falhas.length === 0 ? 0 : 1);
