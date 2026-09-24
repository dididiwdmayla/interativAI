/*
 * Índice de conceitos: para cada conceito, onde ele é ensinado, praticado
 * e revisado. Vai alimentar o computadorzinho navegador ("não sei o que é
 * div, onde vejo?"); por enquanto aparece no /lab/fases.
 */
import { FASES } from "./index";
import { CONCEITOS, type Conceito, type IdConceito } from "./conceitos";
import type { Fase } from "./tipos";

export type EntradaIndice = {
  conceito: Conceito;
  /** Fases de prática que ensinam o conceito (campo `conceitos`). */
  ensinam: string[];
  /** Desafios que praticam o conceito (campo `conceitos` do desafio). */
  praticam: string[];
  /** Fases que revisitam o conceito (campo `revisa`). */
  revisam: string[];
  /** Fases que pedem o conceito como pré-requisito. */
  pedem: string[];
};

/**
 * Monta o índice na ordem do catálogo. Só entram conceitos usados por
 * alguma fase; os ids das fases seguem a ordem do jogo.
 */
export function montarIndice(fases: readonly Fase[] = FASES): EntradaIndice[] {
  const porConceito = new Map<IdConceito, EntradaIndice>();
  const entrada = (id: IdConceito): EntradaIndice => {
    let atual = porConceito.get(id);
    if (!atual) {
      const conceito = CONCEITOS.find((item) => item.id === id) ?? { id, nome: id, resumo: "" };
      atual = { conceito, ensinam: [], praticam: [], revisam: [], pedem: [] };
      porConceito.set(id, atual);
    }
    return atual;
  };
  for (const fase of fases) {
    for (const id of fase.conceitos) {
      if (fase.tipo === "desafio") entrada(id).praticam.push(fase.id);
      else entrada(id).ensinam.push(fase.id);
    }
    for (const id of fase.revisa) entrada(id).revisam.push(fase.id);
    for (const id of fase.prerequisitos) entrada(id).pedem.push(fase.id);
  }
  return CONCEITOS.map((conceito) => porConceito.get(conceito.id)).filter(
    (item): item is EntradaIndice => item !== undefined,
  );
}
