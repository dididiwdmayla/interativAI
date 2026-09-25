/*
 * npm run publicar:conteudo
 *
 * Atualiza src/conteudo/publicados.json DE PROPÓSITO, quando uma unidade
 * nova é publicada. Antes de gravar, confere que:
 * - nenhum id já publicado sumiu ou mudou (isso apagaria progresso);
 * - todas as checagens de conteúdo passam.
 * Só então grava o registro com tudo o que está no jogo agora.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { it } from "vitest";
import { FASES, UNIDADES } from "@/conteudo";
import { checarTudo } from "@/conteudo/checagens";
import { conferirPublicados, montarPublicados, PUBLICADOS } from "@/conteudo/publicados";

// O npm roda os scripts na raiz do projeto (no jsdom, import.meta.url não é file:).
const ARQUIVO = resolve(process.cwd(), "src/conteudo/publicados.json");
const contexto = { unidades: UNIDADES, fases: FASES };

it("publica o conteúdo registrado em src/conteudo/publicados.json", () => {
  const congelados = conferirPublicados(PUBLICADOS, contexto);
  if (congelados.length > 0) {
    throw new Error(`Não publiquei: ids publicados sumiram ou mudaram.\n- ${congelados.join("\n- ")}`);
  }
  const problemas = checarTudo(contexto);
  if (problemas.length > 0) {
    const linhas = problemas.map((problema) => `[${problema.onde}] ${problema.regra}: ${problema.mensagem}`);
    throw new Error(`Não publiquei: o conteúdo tem problemas (rode npm run testar:conteudo).\n- ${linhas.join("\n- ")}`);
  }
  const novo = montarPublicados(contexto);
  const unidadesNovas = Object.keys(novo.unidades).filter((id) => !(id in PUBLICADOS.unidades));
  const fasesNovas = Object.keys(novo.fases).filter((id) => !(id in PUBLICADOS.fases));
  writeFileSync(ARQUIVO, `${JSON.stringify(novo, null, 2)}\n`);
  console.log(
    unidadesNovas.length + fasesNovas.length === 0
      ? "publicados.json regravado: nada novo para publicar."
      : `publicados.json atualizado. Unidades novas: ${unidadesNovas.join(", ") || "nenhuma"}. Fases novas: ${fasesNovas.join(", ") || "nenhuma"}.`,
  );
});
