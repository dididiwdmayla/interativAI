/*
 * A regra de ritmo das cenas (guia, seção 30): a partir das cenas
 * programáveis, toda unidade NOVA da Lógica tem pelo menos uma fase com
 * cena (as publicadas antes ficam isentas), e cada cena nova é diferente
 * das anteriores: outro ambiente, outro dispositivo ou outra missão.
 *
 * Dentro de uma unidade, repetir a cena com outra missão é o normal (a
 * fase 1 apresenta o lugar, o desafio usa): uma repetição exata vira aviso.
 * Entre unidades diferentes, a mesma cena reprova (rodada 37: os dois
 * chamados usavam a mesma vitrine, que não combinava com nenhum deles).
 */
import type { Fase, Unidade, Validador } from "@/conteudo/tipos";
import { cenaDaFase } from "../composicao";
import { validadoresDentro } from "../programa";

/** A unidade é da Ilha Lógica (do currículo, não do laboratório). */
export function unidadeDaLogica(unidade: Unidade): boolean {
  return unidade.id.startsWith("logica-");
}

/** Unidades novas da Lógica (fora do publicados.json) sem nenhuma fase com cena. */
export function unidadesSemCena(unidades: readonly Unidade[], fases: readonly Fase[], publicadas: ReadonlySet<string>): string[] {
  return unidades
    .filter((unidade) => unidadeDaLogica(unidade) && !publicadas.has(unidade.id))
    .filter((unidade) => !fases.some((fase) => fase.unidadeId === unidade.id && cenaDaFase(fase) !== null))
    .map(
      (unidade) =>
        `a unidade "${unidade.id}" é nova na Lógica e não tem nenhuma fase com cena (regra de ritmo: pelo menos uma fase com a área "cena"; ver o guia, seção 30)`,
    );
}

/** A missão de uma fase com cena: o que os validadores de cena dela cobram, em texto, sem repetir. */
export function missaoDaFase(fase: Fase): string[] {
  const raizes: Validador[] =
    fase.tipo === "desafio" ? fase.partes.map((p) => p.validador) : fase.tipo === "projeto-ponte" ? fase.requisitos.map((r) => r.validador) : "objetivos" in fase ? fase.objetivos.map((o) => o.validador) : [];
  const partes = new Set<string>();
  for (const v of raizes.flatMap(validadoresDentro)) {
    if (v.tipo === "estadoNaCena") partes.add(`estado ${v.dispositivo}.${v.propriedade}`);
    if (v.tipo === "sequenciaNaCena") partes.add(`sequência ${v.dispositivo}: ${v.eventos.map((e) => e.acao).join(" ")}`);
    if (v.tipo === "reagiu") partes.add(`reação ${v.quando.dispositivo}.${v.quando.propriedade} -> ${v.entao.dispositivo}.${v.entao.acao}`);
  }
  return [...partes].sort();
}

/** O que torna uma cena diferente: o ambiente, os tipos de dispositivo e a missão. */
function assinatura(fase: Fase): { ambiente: string; dispositivos: string; missao: string } | null {
  const cena = cenaDaFase(fase);
  if (!cena) return null;
  return {
    ambiente: cena.ambiente,
    dispositivos: cena.dispositivos.map((d) => d.tipo).sort().join(", "),
    missao: missaoDaFase(fase).join("; "),
  };
}

/**
 * Avisos: cada fase com cena que repete uma anterior (mesmo ambiente, os
 * mesmos tipos de dispositivo e a mesma missão).
 */
export function cenasRepetidas(fases: readonly Fase[]): string[] {
  const vistas: { fase: Fase; chave: string }[] = [];
  const avisos: string[] = [];
  for (const fase of fases) {
    const dados = assinatura(fase);
    if (!dados) continue;
    const chave = `${dados.ambiente} | ${dados.dispositivos} | ${dados.missao}`;
    const anterior = vistas.find((vista) => vista.chave === chave);
    if (anterior) {
      avisos.push(
        `a cena da fase "${fase.id}" repete a da fase "${anterior.fase.id}" (ambiente ${dados.ambiente}, dispositivos ${dados.dispositivos} e a mesma missão): mude o ambiente, um dispositivo ou a missão`,
      );
    } else vistas.push({ fase, chave });
  }
  return avisos;
}

/**
 * A cena de uma fase, para comparar entre unidades: o ambiente e os tipos dos
 * aparelhos que a missão usa (sem missão de cena, todos os da cena). Duas
 * fases de unidades diferentes com a mesma chave mostram o mesmo lugar
 * fazendo a mesma coisa.
 */
function chaveEntreUnidades(fase: Fase): string | null {
  const cena = cenaDaFase(fase);
  if (!cena) return null;
  const tipoDe = new Map(cena.dispositivos.map((d) => [d.id, d.tipo]));
  const usados = new Set<string>();
  for (const parte of missaoDaFase(fase)) {
    const id = /^(?:estado|sequência|reação) ([A-Za-z_$][\w$]*)/.exec(parte)?.[1];
    const tipo = id ? tipoDe.get(id) : undefined;
    if (tipo) usados.add(tipo);
  }
  const tipos = usados.size ? [...usados] : cena.dispositivos.map((d) => d.tipo);
  return `${cena.ambiente} | ${[...new Set(tipos)].sort().join(", ")}`;
}

/**
 * Problemas: a mesma cena (o mesmo ambiente, com os mesmos tipos de aparelho
 * na missão) em unidades diferentes. `excecoes` são pares já publicados e
 * conferidos ("faseA|faseB"), que seguem valendo.
 */
export function cenasRepetidasEntreUnidades(fases: readonly Fase[], excecoes: ReadonlySet<string> = new Set()): string[] {
  const vistas = new Map<string, Fase>();
  const problemas: string[] = [];
  for (const fase of fases) {
    if (!fase.unidadeId.startsWith("logica-")) continue;
    const chave = chaveEntreUnidades(fase);
    if (!chave) continue;
    const anterior = vistas.get(chave);
    if (anterior && anterior.unidadeId !== fase.unidadeId && !excecoes.has(`${anterior.id}|${fase.id}`)) {
      problemas.push(
        `a cena da fase "${fase.id}" repete a da fase "${anterior.id}", de outra unidade (ambiente e aparelhos da missão: ${chave}): monte um lugar que combine com o caso (guia, seção 30.6)`,
      );
    }
    if (!anterior) vistas.set(chave, fase);
  }
  return problemas;
}
