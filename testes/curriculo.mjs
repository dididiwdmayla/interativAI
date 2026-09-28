// O currículo e o conteúdo registrado, lidos pelos testes de navegador para
// derivar o que esperar do mapa (em vez de escrever à mão "a Layout está
// planejada", que quebra toda vez que uma zona vira conteúdo).
//
// - CURRICULO: src/curriculo/curriculo.ts, transpilado pelo TypeScript do
//   projeto (o arquivo só importa tipos, então roda sozinho).
// - PUBLICADAS: src/conteudo/publicados.json, as unidades prontas do jogo
//   (toda unidade registrada é publicada no fim da produção:
//   `npm run publicar:conteudo`), com as fases de cada uma, na ordem.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const exigir = createRequire(import.meta.url);

export const CURRICULO = await (async () => {
  const ts = exigir("typescript");
  const fonte = readFileSync(new URL("../src/curriculo/curriculo.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(fonte, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  const modulo = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  return modulo.CURRICULO;
})();

/** unidadeId -> fases, na ordem do jogo. */
export const PUBLICADAS = JSON.parse(readFileSync(new URL("../src/conteudo/publicados.json", import.meta.url), "utf8")).unidades;

export const ehPronta = (unidadeId) => Object.hasOwn(PUBLICADAS, unidadeId);

export function ilhaDoCurriculo(id) {
  const ilha = CURRICULO.find((item) => item.id === id);
  if (!ilha) throw new Error(`a ilha "${id}" não está no currículo`);
  return ilha;
}

/** As unidades (do currículo) de uma ilha, na ordem das zonas, com a zona de cada uma. */
export function unidadesDaIlha(id) {
  return ilhaDoCurriculo(id).zonas.flatMap((zona) => zona.unidades.map((unidade) => ({ ...unidade, zona })));
}

export const prontasDaIlha = (id) => unidadesDaIlha(id).filter((unidade) => ehPronta(unidade.id));
export const planejadasDaIlha = (id) => unidadesDaIlha(id).filter((unidade) => !ehPronta(unidade.id));

/** A primeira unidade planejada com o tema, procurando nas ilhas dadas, na ordem. */
export function planejadaComTema(tema, ilhas) {
  for (const id of ilhas) {
    const achada = planejadasDaIlha(id).find((unidade) => (unidade.temas ?? []).includes(tema));
    if (achada) return { ilha: id, unidade: achada };
  }
  return null;
}
