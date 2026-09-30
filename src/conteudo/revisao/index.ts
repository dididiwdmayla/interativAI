/*
 * Registro dos itens da Revisão do dia: um arquivo por conceito
 * (src/conteudo/revisao/<conceito>.ts), cada um com pelo menos 2 variações.
 * Item novo: crie o arquivo, importe aqui e acrescente na lista.
 *
 * Guia: docs/GUIA-DE-CONTEUDO.md, "Itens de revisão".
 */
import type { IdConceito, ItemRevisao } from "../tipos";

export const ITENS_REVISAO: readonly ItemRevisao[] = [];

/** Os itens de um conceito, na ordem do arquivo. */
export function itensDoConceito(conceito: IdConceito, itens: readonly ItemRevisao[] = ITENS_REVISAO): ItemRevisao[] {
  return itens.filter((item) => item.conceito === conceito);
}

export function itemDoId(id: string, itens: readonly ItemRevisao[] = ITENS_REVISAO): ItemRevisao | undefined {
  return itens.find((item) => item.id === id);
}
