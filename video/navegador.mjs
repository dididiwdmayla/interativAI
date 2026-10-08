// Onde está o Chromium que o Remotion e os scripts usam.
// 1) REMOTION_BROWSER, se você quiser apontar um; 2) o do próprio Remotion
// (`npx remotion browser ensure`), quando o download funciona: aí este arquivo
// devolve null e o Remotion usa o dele; 3) o headless shell do Playwright
// (o mesmo dos testes do jogo), para sessões em que a rede bloqueia o download.
import { existsSync, readdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

function doPlaywright() {
  const pastas = [process.env.PLAYWRIGHT_BROWSERS_PATH, path.join(os.homedir(), ".cache", "ms-playwright"), path.join(os.homedir(), "Library", "Caches", "ms-playwright")].filter(Boolean);
  for (const pasta of pastas) {
    if (!existsSync(pasta)) continue;
    const versoes = readdirSync(pasta).sort().reverse();
    for (const prefixo of ["chromium_headless_shell-", "chromium-"]) {
      for (const versao of versoes.filter((nome) => nome.startsWith(prefixo))) {
        for (const relativo of ["chrome-linux/headless_shell", "chrome-linux/chrome", "chrome-mac/headless_shell", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/headless_shell.exe", "chrome-win/chrome.exe"]) {
          const caminho = path.join(pasta, versao, relativo);
          if (existsSync(caminho)) return caminho;
        }
      }
    }
  }
  return null;
}

/** O download do Remotion terminou? (Uma pasta vazia fica para trás quando a rede bloqueia.) */
function temNavegadorDoRemotion(pasta, nivel = 0) {
  if (!existsSync(pasta) || nivel > 4) return false;
  return readdirSync(pasta, { withFileTypes: true }).some((item) =>
    item.isDirectory() ? temNavegadorDoRemotion(path.join(pasta, item.name), nivel + 1) : /^(chrome-headless-shell|headless_shell|chrome)(\.exe)?$/.test(item.name),
  );
}

/** `pastaDoVideo`: a pasta video/ (padrão: a pasta de onde o comando roda). */
export function navegadorDoRender(pastaDoVideo = process.cwd()) {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  if (temNavegadorDoRemotion(path.join(pastaDoVideo, "node_modules", ".remotion"))) return null;
  return doPlaywright();
}
