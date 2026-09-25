/*
 * Consistência entre o currículo (src/curriculo/curriculo.ts) e o conteúdo
 * registrado (src/conteudo/index.ts). Viram regras gerais do
 * npm run testar:conteudo (src/conteudo/checagens.ts).
 */
import type { Unidade } from "@/conteudo/tipos";
import { localNoCurriculo, motorQueFalta } from "./index";
import type { IlhaCurriculo } from "./tipos";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function repetidos(ids: readonly string[]): string[] {
  const vistos = new Set<string>();
  const repetidos = new Set<string>();
  for (const id of ids) {
    if (vistos.has(id)) repetidos.add(id);
    vistos.add(id);
  }
  return [...repetidos];
}

/** Ids únicos (ilhas; zonas dentro da ilha; unidades no currículo inteiro) e em kebab-case. */
export function conferirIdsDoCurriculo(curriculo: readonly IlhaCurriculo[]): string[] {
  const problemas: string[] = [];
  const ilhas = curriculo.map((ilha) => ilha.id);
  const unidades = curriculo.flatMap((ilha) => ilha.zonas.flatMap((zona) => zona.unidades.map((unidade) => unidade.id)));
  problemas.push(...repetidos(ilhas).map((id) => `ilha com id repetido no currículo: "${id}"`));
  problemas.push(...repetidos(unidades).map((id) => `unidade com id repetido no currículo: "${id}"`));
  for (const ilha of curriculo) {
    problemas.push(
      ...repetidos(ilha.zonas.map((zona) => zona.id)).map((id) => `zona com id repetido na ilha "${ilha.id}": "${id}"`),
    );
    if (ilha.zonas.length === 0) problemas.push(`a ilha "${ilha.id}" não tem zonas`);
    for (const zona of ilha.zonas) {
      if (zona.unidades.length === 0) problemas.push(`a zona "${ilha.id}/${zona.id}" não tem unidades`);
    }
  }
  for (const id of [...ilhas, ...curriculo.flatMap((ilha) => ilha.zonas.map((zona) => zona.id)), ...unidades]) {
    if (!KEBAB.test(id)) problemas.push(`id "${id}" do currículo não está em kebab-case`);
  }
  return problemas;
}

/**
 * Toda unidade de conteúdo existe no currículo, na ilha e na zona certas:
 * id "<ilha>-<zona>-u<numero>", com o número da posição na zona, os nomes
 * de ilha e zona e o título iguais aos do currículo, e na mesma ordem.
 */
export function conferirConteudoNoCurriculo(curriculo: readonly IlhaCurriculo[], unidades: readonly Unidade[]): string[] {
  const problemas: string[] = [];
  const posicoes: number[] = [];
  const ordem = curriculo.flatMap((ilha) => ilha.zonas.flatMap((zona) => zona.unidades.map((unidade) => unidade.id)));
  for (const unidade of unidades) {
    const local = localNoCurriculo(unidade.id, curriculo);
    if (!local) {
      problemas.push(
        `a unidade de conteúdo "${unidade.id}" não está no currículo (src/curriculo/curriculo.ts): ` +
          "use o id da unidade planejada no docs/MAPA-CURRICULAR.md",
      );
      continue;
    }
    const { ilha, zona, indice } = local;
    const idEsperado = `${ilha.id}-${zona.id}-u${indice + 1}`;
    if (unidade.id !== idEsperado) {
      problemas.push(`a unidade "${unidade.id}" está em ${ilha.id}/${zona.id} na posição ${indice + 1}: o id seria "${idEsperado}"`);
    }
    if (unidade.numero !== indice + 1) {
      problemas.push(`a unidade "${unidade.id}" tem numero ${unidade.numero}, mas é a ${indice + 1}ª da zona "${zona.nome}"`);
    }
    if (unidade.ilha !== `Ilha ${ilha.nome}`) {
      problemas.push(`a unidade "${unidade.id}" diz ilha "${unidade.ilha}", mas no currículo ela é da "Ilha ${ilha.nome}"`);
    }
    if (unidade.zona !== zona.nome) {
      problemas.push(`a unidade "${unidade.id}" diz zona "${unidade.zona}", mas no currículo ela é da zona "${zona.nome}"`);
    }
    if (unidade.titulo !== local.unidade.titulo) {
      problemas.push(`a unidade "${unidade.id}" tem o título "${unidade.titulo}", e no currículo é "${local.unidade.titulo}"`);
    }
    posicoes.push(ordem.indexOf(unidade.id));
  }
  if (posicoes.some((posicao, indice) => indice > 0 && posicao < posicoes[indice - 1])) {
    problemas.push("as unidades de UNIDADES (src/conteudo/index.ts) não seguem a ordem do currículo");
  }
  return problemas;
}

/** Nenhuma unidade de conteúdo mora numa zona (ou é uma unidade) com requerMotor. */
export function conferirMotorDoConteudo(curriculo: readonly IlhaCurriculo[], unidades: readonly Unidade[]): string[] {
  const problemas: string[] = [];
  for (const unidade of unidades) {
    const local = localNoCurriculo(unidade.id, curriculo);
    if (!local) continue;
    const falta = motorQueFalta(local.zona, local.unidade);
    if (falta) {
      problemas.push(
        `a unidade "${unidade.id}" tem conteúdo, mas ${local.unidade.requerMotor ? "ela" : `a zona "${local.zona.nome}"`} ` +
          `ainda requer motor: ${falta}. Não produza essa unidade: relate o que falta.`,
      );
    }
  }
  return problemas;
}
