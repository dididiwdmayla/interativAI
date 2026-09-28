export type TemaId = "doce" | "fliperama" | "segredo" | "meu";

export type Tema = {
  id: TemaId;
  nome: string;
  descricao: string;
  /** Temas secretos só aparecem no seletor depois de desbloqueados. */
  secreto: boolean;
  /**
   * O tema que o jogador cria na E5 ("Salvar como Meu tema"). As cores não
   * moram no tokens.css: vêm do progresso (src/lib/meuTema.ts). Só aparece
   * no seletor depois de salvo.
   */
  doJogador?: boolean;
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
  {
    id: "meu",
    nome: "Meu tema",
    descricao: "As cores que você escolheu no próprio jogo",
    secreto: false,
    doJogador: true,
  },
];

export const TEMA_PADRAO: TemaId = "doce";

export const TEMAS_INICIAIS: readonly TemaId[] = ["doce", "fliperama"];

export function ehTemaId(valor: unknown): valor is TemaId {
  return TEMAS.some((tema) => tema.id === valor);
}
