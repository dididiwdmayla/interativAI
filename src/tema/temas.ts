export type TemaId = "doce" | "fliperama" | "segredo";

export type Tema = {
  id: TemaId;
  nome: string;
  descricao: string;
  /** Temas secretos só aparecem no seletor depois de desbloqueados. */
  secreto: boolean;
};

export const TEMAS: readonly Tema[] = [
  {
    id: "doce",
    nome: "Doce",
    descricao: "Claro, alegre e cheio de cor",
    secreto: false,
  },
  {
    id: "fliperama",
    nome: "Fliperama",
    descricao: "Escuro, com luzes neon",
    secreto: false,
  },
  {
    id: "segredo",
    nome: "Segredo",
    descricao: "Tela de fósforo verde, só para quem investiga",
    secreto: true,
  },
];

export const TEMA_PADRAO: TemaId = "doce";

export const TEMAS_INICIAIS: readonly TemaId[] = ["doce", "fliperama"];

export function ehTemaId(valor: unknown): valor is TemaId {
  return TEMAS.some((tema) => tema.id === valor);
}
