/*
 * Regras de DADOS dos itens da Revisão do dia (as de simulação são as
 * mesmas das fases, rodadas sobre `faseDoItem`: ver
 * `checarItensDeRevisao` em src/conteudo/checagens.ts).
 */
import { ehIdConceito } from "../conceitos";
import type { Fase, ItemRevisao } from "../tipos";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Mínimo de variações por conceito (menos que isso vira decoreba). */
export const VARIACOES_MINIMAS = 2;

function normalizar(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}

/**
 * Ids únicos e em kebab-case; conceito do catálogo e ensinado por alguma
 * fase; tipo coerente (ação com validador, previsão com previsão); pelo
 * menos 2 variações por conceito; mini-site diferente dos sites das fases.
 */
export function conferirItensDeRevisao(itens: readonly ItemRevisao[], fases: readonly Fase[]): string[] {
  const problemas: string[] = [];
  const vistos = new Set<string>();
  const ensinados = new Set(fases.flatMap((fase) => (fase.tipo === "pratica" ? fase.conceitos : [])));
  const corpos = new Map(fases.map((fase) => [normalizar(fase.siteAlvo.body), fase.id]));
  const urls = new Map(fases.map((fase) => [fase.siteAlvo.url, fase.id]));
  const porConceito = new Map<string, number>();
  for (const item of itens) {
    const onde = `item de revisão "${item.id}"`;
    if (vistos.has(item.id)) problemas.push(`${onde}: id repetido`);
    vistos.add(item.id);
    if (!KEBAB.test(item.id)) problemas.push(`${onde}: o id não está em kebab-case`);
    if (!ehIdConceito(item.conceito)) {
      problemas.push(`${onde}: o conceito "${item.conceito}" não existe em src/conteudo/conceitos.ts`);
    } else if (!ensinados.has(item.conceito)) {
      problemas.push(`${onde}: nenhuma fase ensina "${item.conceito}" (conceitos de uma fase de prática), então ele nunca entra na revisão`);
    }
    porConceito.set(item.conceito, (porConceito.get(item.conceito) ?? 0) + 1);
    if (item.tipo === "acao" && !item.validador) problemas.push(`${onde}: item de ação precisa de validador`);
    if (item.tipo === "acao" && item.previsao) problemas.push(`${onde}: item de ação não tem previsao (use tipo "previsao")`);
    if (item.tipo === "previsao" && !item.previsao) problemas.push(`${onde}: item de previsão precisa de previsao`);
    const ajudas: Record<string, unknown> = item.ajudas;
    if ("linha" in ajudas || "solucao" in ajudas) {
      problemas.push(`${onde}: a revisão é sozinho, então as ajudas são só pergunta e dica (sem linha e sem solução)`);
    }
    const mesmoCorpo = corpos.get(normalizar(item.siteAlvo.body));
    if (mesmoCorpo) problemas.push(`${onde}: o mini-site é igual ao da fase "${mesmoCorpo}"; use uma situação diferente`);
    const mesmaUrl = item.siteAlvo.url ? urls.get(item.siteAlvo.url) : undefined;
    if (mesmaUrl) problemas.push(`${onde}: o endereço "${item.siteAlvo.url}" é o da fase "${mesmaUrl}"; use um site diferente`);
  }
  for (const [conceito, quantos] of porConceito) {
    if (quantos < VARIACOES_MINIMAS) {
      problemas.push(`o conceito "${conceito}" tem ${quantos} item de revisão; são pelo menos ${VARIACOES_MINIMAS} variações`);
    }
  }
  return problemas;
}
