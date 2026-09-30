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
  // Rodada 9: modo documento e atributo novo (fases futuras)
  "adicionar-atributo",
  // Zona Estilos
  "editor-css",
  "painel-estilos",
  "editar-valor-css",
  "ligar-desligar-declaracao",
  "setas-numericas",
  "seletor-de-cor",
  "nova-regra",
  "painel-calculado",
  "modelo-de-caixa",
  // E5: o próprio jogo como site-alvo
  "salvar-tema",
  // Zona Responsivo: modo dispositivo
  "modo-dispositivo",
  "girar-dispositivo",
  // Zona Publicar: auditoria
  "lighthouse",
  "levar-pro-mundo",
  // Zona Ser encontrado (opcional): a aba Busca
  "resultado-busca",
  "dados-estruturados",
] as const;

export type IdFerramenta = (typeof IDS_FERRAMENTAS)[number];

export function ehIdFerramenta(valor: unknown): valor is IdFerramenta {
  return typeof valor === "string" && (IDS_FERRAMENTAS as readonly string[]).includes(valor);
}

/** Seletor do elemento real da ferramenta na interface. */
export function seletorFerramenta(id: IdFerramenta): string {
  return `[data-ferramenta~="${id}"]`;
}
