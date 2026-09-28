/*
 * Consistência entre o currículo (src/curriculo/curriculo.ts) e o conteúdo
 * registrado (src/conteudo/index.ts). Viram regras gerais do
 * npm run testar:conteudo (src/conteudo/checagens.ts).
 */
import type { Unidade } from "@/conteudo/tipos";
import { localNoCurriculo, motorQueFalta } from "./index";
import type { MotorPlanejado } from "./motores";
import type { Trilha } from "./trilhas";
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

/**
 * Trilhas (src/curriculo/trilhas.ts): ids únicos; toda trilha referencia
 * ilhas que existem (no currículo ou nas ilhas futuras), sem repetir, e
 * passa pelo núcleo comum; a padrão existe e está ativa; toda ilha com
 * conteúdo pertence a pelo menos uma trilha; ilhas futuras não têm zonas
 * nem ids que batem com o currículo.
 */
export function conferirTrilhas(
  trilhas: readonly Trilha[],
  curriculo: readonly IlhaCurriculo[],
  futuras: readonly IlhaCurriculo[],
  unidades: readonly Unidade[],
  nucleo: readonly string[],
  padrao: string,
): string[] {
  const problemas: string[] = [];
  const todas = [...curriculo, ...futuras];
  problemas.push(...repetidos(trilhas.map((trilha) => trilha.id)).map((id) => `trilha com id repetido: "${id}"`));
  problemas.push(...repetidos(todas.map((ilha) => ilha.id)).map((id) => `ilha futura com o mesmo id de outra ilha: "${id}"`));
  const trilhaPadrao = trilhas.find((trilha) => trilha.id === padrao);
  if (!trilhaPadrao) problemas.push(`a trilha padrão "${padrao}" não existe`);
  else if (trilhaPadrao.status !== "ativa") problemas.push(`a trilha padrão "${padrao}" precisa estar ativa`);
  for (const trilha of trilhas) {
    if (!KEBAB.test(trilha.id)) problemas.push(`id de trilha "${trilha.id}" não está em kebab-case`);
    if (trilha.descricao.trim().length === 0) problemas.push(`a trilha "${trilha.id}" não tem descrição`);
    problemas.push(...repetidos(trilha.ilhas).map((id) => `a trilha "${trilha.id}" repete a ilha "${id}"`));
    for (const id of trilha.ilhas) {
      if (!todas.some((ilha) => ilha.id === id)) problemas.push(`a trilha "${trilha.id}" cita a ilha "${id}", que não existe no currículo`);
    }
    for (const id of nucleo) {
      if (!trilha.ilhas.includes(id)) problemas.push(`a trilha "${trilha.id}" não passa pela ilha "${id}" do núcleo comum`);
    }
  }
  for (const ilha of curriculo) {
    const temConteudo = ilha.zonas.some((zona) => zona.unidades.some((item) => unidades.some((unidade) => unidade.id === item.id)));
    if (temConteudo && !trilhas.some((trilha) => trilha.ilhas.includes(ilha.id))) {
      problemas.push(`a ilha "${ilha.id}" tem conteúdo, mas não pertence a nenhuma trilha`);
    }
  }
  for (const ilha of futuras) {
    if (ilha.zonas.length > 0) problemas.push(`a ilha futura "${ilha.id}" tem zonas: mova ela para o CURRICULO`);
    if (!KEBAB.test(ilha.id)) problemas.push(`id de ilha "${ilha.id}" não está em kebab-case`);
  }
  return problemas;
}

/**
 * Motores planejados (src/curriculo/motores.ts): ids únicos; toda unidade
 * citada existe no currículo e continua travada por um `requerMotor` (dela
 * ou da zona) que nomeia o tipo de fase; as trilhas e as ilhas futuras
 * citadas existem.
 */
export function conferirMotoresPlanejados(
  motores: readonly MotorPlanejado[],
  curriculo: readonly IlhaCurriculo[],
  futuras: readonly IlhaCurriculo[],
  trilhas: readonly Trilha[],
): string[] {
  const problemas: string[] = [];
  problemas.push(...repetidos(motores.map((motor) => motor.id)).map((id) => `motor planejado com id repetido: "${id}"`));
  for (const motor of motores) {
    if (motor.usadoEm.length === 0) problemas.push(`o motor planejado "${motor.id}" não diz onde vai ser usado`);
    for (const uso of motor.usadoEm) {
      const local = localNoCurriculo(uso.unidadeId, curriculo);
      if (!local) {
        problemas.push(`o motor planejado "${motor.id}" cita a unidade "${uso.unidadeId}", que não está no currículo`);
        continue;
      }
      const falta = motorQueFalta(local.zona, local.unidade);
      if (!falta?.includes(motor.id)) {
        problemas.push(
          `a unidade "${uso.unidadeId}" usa o motor planejado "${motor.id}", mas o requerMotor dela (ou da zona) não cita "${motor.id}"`,
        );
      }
    }
    for (const id of motor.trilhas) {
      if (!trilhas.some((trilha) => trilha.id === id)) problemas.push(`o motor planejado "${motor.id}" cita a trilha "${id}", que não existe`);
    }
    for (const id of motor.ilhasFuturas) {
      if (!futuras.some((ilha) => ilha.id === id)) problemas.push(`o motor planejado "${motor.id}" cita a ilha futura "${id}", que não existe`);
    }
  }
  return problemas;
}
