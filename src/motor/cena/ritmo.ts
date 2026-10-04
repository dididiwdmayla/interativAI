/*
 * A regra de ritmo das cenas (guia, seção 30): a partir das cenas
 * programáveis, toda unidade NOVA da Lógica tem pelo menos uma fase com
 * cena (as publicadas antes ficam isentas), e cada cena nova é diferente
 * das anteriores: outro ambiente, outro dispositivo ou outra missão. Uma
 * cena que repete outra não quebra a checagem: vira aviso, para quem
 * produz o conteúdo decidir.
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
