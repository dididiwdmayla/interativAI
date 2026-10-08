// Ajudantes para abrir o jogo com progresso injetado, reaproveitando os dos
// testes de navegador (testes/util.mjs e testes/curriculo.mjs), sem alterá-los.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PASTA_VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const RAIZ = path.resolve(PASTA_VIDEO, "..");

export const util = await import(path.join(RAIZ, "testes", "util.mjs"));
export const curriculo = await import(path.join(RAIZ, "testes", "curriculo.mjs"));

/** Todos os ids de ferramenta: com eles em apresentacoesVistas, nenhuma apresentação abre no meio da tomada. */
export const FERRAMENTAS = [...readFileSync(path.join(RAIZ, "src", "ferramentas", "ids.ts"), "utf8").matchAll(/^ {2}"([a-z0-9-]+)",$/gm)].map((m) => m[1]);

/** Os temas das insígnias: com o marco em 100, o aviso de insígnia nova não aparece no meio da tomada. */
export const TEMAS = ["fundamentos", "interfaces", "acessibilidade", "logica", "dados", "apis", "servidores", "seguranca", "desempenho", "ia", "ferramentas", "presenca-digital"];
export const SEM_AVISO_DE_INSIGNIA = Object.fromEntries(TEMAS.map((tema) => [tema, 100]));
/** Com a última visita agora, o computadorzinho não acena ao abrir o mundo. */
export const semAceno = () => ({ "ilha-sites:mundo:ultima-visita": String(Date.now()) });

const { PUBLICADAS, obrigatoriasProntasDaIlha, prontasDaIlha } = curriculo;

/** Fases de todas as unidades prontas das ilhas dadas. */
export function fasesDasIlhas(ilhas, { opcionais = true, menos = [] } = {}) {
  const unidades = ilhas.flatMap((ilha) => (opcionais ? prontasDaIlha(ilha) : obrigatoriasProntasDaIlha(ilha))).map((u) => u.id).filter((id) => !menos.includes(id));
  return { unidades, fases: unidades.flatMap((id) => PUBLICADAS[id] ?? []) };
}

/** Progresso v2 de quem já jogou as ilhas dadas (três estrelas em tudo), com o que mais vier em `extra`. */
export function progressoDeQuemJogou(ilhas, extra = {}, opcoes = {}) {
  const { unidades, fases } = fasesDasIlhas(ilhas, opcoes);
  return {
    versao: 2,
    fasesConcluidas: fases,
    estrelasPorFase: Object.fromEntries(fases.map((fase) => [fase, 3])),
    fasesEmAndamento: {},
    faseAtual: null,
    tema: "doce",
    temasDesbloqueados: ["doce", "fliperama"],
    som: false,
    missoesDeCampo: {},
    apresentacoesVistas: FERRAMENTAS,
    metasVistas: unidades,
    unidadesComemoradas: unidades,
    ilhasComemoradas: ilhas,
    posicaoNoMapa: {},
    mapaDesbloqueado: false,
    proporcaoPrevia: 0.4,
    animacoes: "completas",
    marcosInsignias: SEM_AVISO_DE_INSIGNIA,
    ...extra,
  };
}

/** O mesmo, com uma fase aberta (introdução e meta já vistas). */
export function progressoNaFase(faseId, ilhas = [], estadoFase = {}, extra = {}) {
  return progressoDeQuemJogou(ilhas, {
    faseAtual: faseId,
    fasesEmAndamento: { [faseId]: { objetivoAtual: 0, htmlAtual: null, estrelas: 3, introducaoVista: true, metaVista: true, ...estadoFase } },
    ...extra,
  });
}
