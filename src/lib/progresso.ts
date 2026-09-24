import { ehIdFerramenta, type IdFerramenta } from "@/ferramentas/ids";
import { ehTemaId, TEMA_PADRAO, TEMAS_INICIAIS, type TemaId } from "@/tema/temas";

export const CHAVE_PROGRESSO = "ilha-sites:progresso:v1";

export type EstadoFaseSalvo = {
  /** Índice do objetivo ativo. Igual ao total de objetivos quando a fase acabou. */
  objetivoAtual: number;
  /** HTML do body do site-alvo, para retomar de onde parou. */
  htmlAtual: string | null;
  estrelas: number;
  introducaoVista: boolean;
};

export type Progresso = {
  versao: 1;
  fasesConcluidas: string[];
  estrelasPorFase: Record<string, number>;
  fasesEmAndamento: Record<string, EstadoFaseSalvo>;
  tema: TemaId;
  temasDesbloqueados: TemaId[];
  som: boolean;
  missoesDeCampo: Record<string, boolean>;
  /** Ferramentas já apresentadas (vistas ou puladas); não repetem sozinhas. */
  apresentacoesVistas: IdFerramenta[];
  /** Fração da altura para a prévia no celular em pé (0,25 a 0,6). */
  proporcaoPrevia: number;
};

export const PROPORCAO_PREVIA = { minima: 0.25, padrao: 0.4, maxima: 0.6 } as const;

export const PROGRESSO_PADRAO: Progresso = {
  versao: 1,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: {},
  tema: TEMA_PADRAO,
  temasDesbloqueados: [...TEMAS_INICIAIS],
  som: true,
  missoesDeCampo: {},
  apresentacoesVistas: [],
  proporcaoPrevia: PROPORCAO_PREVIA.padrao,
};

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function lerRegistro<T>(
  valor: unknown,
  validar: (item: unknown) => item is T,
): Record<string, T> {
  const saida: Record<string, T> = {};
  if (!ehObjeto(valor)) return saida;
  for (const [chave, item] of Object.entries(valor)) {
    if (validar(item)) saida[chave] = item;
  }
  return saida;
}

function ehNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

function ehBooleano(valor: unknown): valor is boolean {
  return typeof valor === "boolean";
}

function ehEstadoFase(valor: unknown): valor is EstadoFaseSalvo {
  if (!ehObjeto(valor)) return false;
  return (
    ehNumero(valor.objetivoAtual) &&
    (valor.htmlAtual === null || typeof valor.htmlAtual === "string") &&
    ehNumero(valor.estrelas) &&
    ehBooleano(valor.introducaoVista)
  );
}

/** Converte qualquer coisa vinda do localStorage num Progresso válido. */
export function normalizarProgresso(bruto: unknown): Progresso {
  if (!ehObjeto(bruto)) return PROGRESSO_PADRAO;

  const temasDesbloqueados = Array.isArray(bruto.temasDesbloqueados)
    ? bruto.temasDesbloqueados.filter(ehTemaId)
    : [];
  for (const tema of TEMAS_INICIAIS) {
    if (!temasDesbloqueados.includes(tema)) temasDesbloqueados.push(tema);
  }

  const tema =
    ehTemaId(bruto.tema) && temasDesbloqueados.includes(bruto.tema)
      ? bruto.tema
      : TEMA_PADRAO;

  return {
    versao: 1,
    fasesConcluidas: Array.isArray(bruto.fasesConcluidas)
      ? bruto.fasesConcluidas.filter((id): id is string => typeof id === "string")
      : [],
    estrelasPorFase: lerRegistro(bruto.estrelasPorFase, ehNumero),
    fasesEmAndamento: lerRegistro(bruto.fasesEmAndamento, ehEstadoFase),
    tema,
    temasDesbloqueados,
    som: ehBooleano(bruto.som) ? bruto.som : PROGRESSO_PADRAO.som,
    missoesDeCampo: lerRegistro(bruto.missoesDeCampo, ehBooleano),
    apresentacoesVistas: Array.isArray(bruto.apresentacoesVistas)
      ? [...new Set(bruto.apresentacoesVistas.filter(ehIdFerramenta))]
      : [],
    proporcaoPrevia: ehNumero(bruto.proporcaoPrevia)
      ? Math.min(PROPORCAO_PREVIA.maxima, Math.max(PROPORCAO_PREVIA.minima, bruto.proporcaoPrevia))
      : PROPORCAO_PREVIA.padrao,
  };
}

export function lerProgressoDoArmazenamento(): Progresso {
  try {
    const texto = window.localStorage.getItem(CHAVE_PROGRESSO);
    if (!texto) return PROGRESSO_PADRAO;
    return normalizarProgresso(JSON.parse(texto));
  } catch {
    return PROGRESSO_PADRAO;
  }
}

export function gravarProgressoNoArmazenamento(progresso: Progresso): void {
  try {
    window.localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso));
  } catch {
    // Sem armazenamento (aba anônima, cota cheia): o jogo segue só na memória.
  }
}
