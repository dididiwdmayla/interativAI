/** Todas as ferramentas do jogo, na ordem em que são apresentadas. */
export const IDS_FERRAMENTAS = [
  // Unidade 1
  "painel",
  "previa",
  "me-ajuda",
  "tutor",
  "arvore",
  "inspecionar",
  "editar-duplo-clique",
  "editor",
  "sincronia",
  // Unidade 2
  "trilha",
  "esconder",
  "apagar",
  "desfazer",
  "duplicar",
  // Unidade 3 em diante
  "renomear-tag",
] as const;

export type IdFerramenta = (typeof IDS_FERRAMENTAS)[number];

export function ehIdFerramenta(valor: unknown): valor is IdFerramenta {
  return typeof valor === "string" && (IDS_FERRAMENTAS as readonly string[]).includes(valor);
}

/** Seletor do elemento real da ferramenta na interface. */
export function seletorFerramenta(id: IdFerramenta): string {
  return `[data-ferramenta~="${id}"]`;
}
