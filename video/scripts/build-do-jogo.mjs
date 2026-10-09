// Build de produção do jogo numa máquina sem acesso ao Google Fonts.
// Sobe um servidor local com a Nunito e a JetBrains Mono (as mesmas do jogo,
// dos pacotes @fontsource-variable de video/node_modules), aponta o
// next/font/google para ele (gancho NEXT_FONT_GOOGLE_MOCKED_RESPONSES, do
// próprio Next) e roda `npm run build` na raiz. Nada do jogo é alterado.
// Com acesso ao Google Fonts, basta `npm run build` na raiz.
// Uso: node video/scripts/build-do-jogo.mjs
import { spawn } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, "..", "..");
const fontes = path.resolve(aqui, "..", "node_modules", "@fontsource-variable");

const servidor = createServer((pedido, resposta) => {
  const [, pacote, arquivo] = decodeURIComponent(pedido.url ?? "").split("/");
  const caminho = path.join(fontes, path.basename(pacote ?? ""), "files", path.basename(arquivo ?? ""));
  if (!arquivo || !existsSync(caminho)) {
    resposta.writeHead(404).end();
    return;
  }
  resposta.writeHead(200, { "content-type": "font/woff2" });
  createReadStream(caminho).pipe(resposta);
});
await new Promise((resolver) => servidor.listen(0, "127.0.0.1", resolver));
const porta = servidor.address().port;

const build = spawn("npm", ["run", "build"], {
  cwd: raiz,
  stdio: "inherit",
  env: {
    ...process.env,
    FONTES_URL: `http://127.0.0.1:${porta}`,
    NEXT_FONT_GOOGLE_MOCKED_RESPONSES: path.join(aqui, "fontes-do-build.cjs"),
  },
});
const codigo = await new Promise((resolver) => build.on("close", resolver));
servidor.close();
process.exit(codigo ?? 1);
