import type { Circuito, Fio, Peca } from "@/motor/circuito/modelo";
import { ehIdFerramenta, type IdFerramenta } from "@/ferramentas/ids";
import { lerMeuTema, type MeuTema } from "@/lib/meuTema";
import { type EstadoRevisao, lerEstadoRevisao, REVISAO_PADRAO } from "@/lib/estadoRevisao";
import { ehTemaId, TEMA_PADRAO, TEMAS_INICIAIS, type TemaId } from "@/tema/temas";

export const CHAVE_PROGRESSO = "ilha-sites:progresso:v2";

/** Chave antiga. Lida uma vez, migrada para a v2 e deixada intacta como cópia de segurança. */
export const CHAVE_PROGRESSO_V1 = "ilha-sites:progresso:v1";

/** Ids de fase que mudaram da v1 para a v2 (a Fase 1 virou a Unidade 1). */
export const IDS_FASES_V1: Readonly<Record<string, string>> = {
  "sites-elementos-1": "sites-elementos-u1-f1",
};

export type EstadoFaseSalvo = {
  /** Objetivos concluídos (índice do ativo). Igual ao total quando a fase acabou. */
  objetivoAtual: number;
  /** HTML do body do site-alvo, para retomar de onde parou. */
  htmlAtual: string | null;
  /** Texto da folha editável (fases com CSS), para retomar de onde parou. */
  cssAtual: string | null;
  estrelas: number;
  introducaoVista: boolean;
  /** A meta (antes/depois) já foi mostrada. */
  metaVista: boolean;
  /**
   * HTML de quando o objetivo atual começou. Se ele tem um momento
   * roteirizado, retomar volta para este HTML e roda o momento de novo
   * (assim o Desafazer continua funcionando depois de recarregar).
   */
  htmlInicioObjetivo: string | null;
  /** O CSS de quando o objetivo atual começou (par do htmlInicioObjetivo). */
  cssInicioObjetivo: string | null;
  /** Resposta do card de previsão do objetivo atual, se já respondeu. */
  previsaoRespondida: number | null;
  /** Desafio: partes já marcadas no checklist. */
  partesFeitas: string[];
  /** Desafio: quantas vezes o "Rever" foi usado. */
  reveres: number;
  /**
   * (Fase de programa, Ilha Lógica) O que rodou no Console e no Snippet e o
   * texto do Snippet: ao voltar, as entradas rodam de novo em silêncio e a
   * memória volta como estava. null nas outras fases.
   */
  programa: ProgramaSalvo | null;
  /** (Circuito lógico) O circuito montado na bancada. null nas outras fases. */
  circuito: Circuito | null;
};

export type ProgramaSalvo = {
  entradas: { codigo: string; origem: "console" | "snippet" }[];
  snippet: string | null;
  /** (Depurador) Os pontos de parada (linhas do Snippet), como o Chrome guarda. */
  pontos?: number[];
  /** (Depurador) As expressões do painel Observar. */
  observacoes?: string[];
};

/** Quantas entradas do Console e do Snippet ficam guardadas por fase. */
export const MAXIMO_ENTRADAS_SALVAS = 200;

export type Progresso = {
  versao: 2;
  fasesConcluidas: string[];
  estrelasPorFase: Record<string, number>;
  fasesEmAndamento: Record<string, EstadoFaseSalvo>;
  /** Última fase aberta, para voltar direto nela. */
  faseAtual: string | null;
  tema: TemaId;
  temasDesbloqueados: TemaId[];
  /** Som ligado. Desligado é o "Silenciar tudo" dos ajustes de som. */
  som: boolean;
  /** Volumes de 0 a 1 (ajustes de som): música, efeitos e voz do computadorzinho. */
  volumeMusica: number;
  volumeEfeitos: number;
  volumeVoz: number;
  missoesDeCampo: Record<string, boolean>;
  /** Ferramentas já apresentadas (vistas ou puladas); não repetem sozinhas. */
  apresentacoesVistas: IdFerramenta[];
  /**
   * Unidades cuja meta (antes/depois) já foi vista na entrada. A meta da
   * entrada aparece uma vez só por unidade; a do desafio continua.
   */
  metasVistas: string[];
  /** Mapa: unidades cuja conclusão já foi comemorada na ilha (o ponto acende uma vez). */
  unidadesComemoradas: string[];
  /** Mapa: onde o computadorzinho parou em cada ilha (id da unidade), para andar dali. */
  posicaoNoMapa: Record<string, string>;
  /** Só /lab/mapa: abre todas as ilhas, zonas, unidades e fases que têm conteúdo. */
  mapaDesbloqueado: boolean;
  /** Fração da altura para a prévia no celular em pé (0,25 a 0,6). */
  proporcaoPrevia: number;
  /** Trilha escolhida (src/curriculo/trilhas.ts); id desconhecido vale a padrão. */
  trilha: string;
  /** A lente acesa no mapa (um tema ou uma profissão), ou nenhuma. */
  lente: LenteMapa | null;
  /** Insígnias: o último marco (25, 50, 75, 100) já comemorado de cada tema. */
  marcosInsignias: Record<string, number>;
  /** (E5) As cores do "Meu tema", salvas da maquete do jogo; null enquanto não existe. */
  meuTema: MeuTema | null;
  /** Projetos-ponte (Meus projetos), por id da fase: o site do jogador e a publicação dele. */
  projetos: Record<string, ProjetoSalvo>;
  /** Mapa: ilhas cuja conclusão (todas as unidades publicadas) já foi comemorada. */
  ilhasComemoradas: string[];
  /**
   * Revisão do dia: o agendamento por conceito e a sequência de dias
   * (src/lib/revisao.ts). Progresso antigo nasce vazio e os conceitos das
   * fases já concluídas entram na fila na primeira visita ao mapa.
   */
  revisao: EstadoRevisao;
};

/**
 * O site de um projeto-ponte, guardado fora do "em andamento": sobrevive
 * ao "Jogar de novo" da ilha (o site é do jogador) e só zera no Recomeçar
 * da própria fase. O guia e o link ficam mesmo depois de recomeçar (o
 * site publicado continua no ar).
 */
export type ProjetoSalvo = {
  /** O documento inteiro (index.html) como o jogador deixou; null antes de começar ou depois de recomeçar. */
  html: string | null;
  /** O style.css. */
  css: string | null;
  /** Quando o site mudou pela última vez (ms desde 1970), ou null. */
  atualizadoEm: number | null;
  /** Passos do guia de publicação já marcados (ids de src/conteudo/publicacao.ts). */
  guia: string[];
  /** O endereço publicado, colado no fim do guia (formato conferido), ou null. */
  link: string | null;
};

export const PROJETO_VAZIO: ProjetoSalvo = { html: null, css: null, atualizadoEm: null, guia: [], link: null };

/** Lente sobre o mapa: acende as unidades de um tema, ou dos temas de uma profissão. */
export type LenteMapa = { tipo: "tema" | "profissao"; id: string };

export const PROPORCAO_PREVIA = { minima: 0.25, padrao: 0.4, maxima: 0.6 } as const;

/** Volumes padrão dos ajustes de som. */
export const VOLUMES_PADRAO = { musica: 0.5, efeitos: 0.7, voz: 0.7 } as const;

export const PROGRESSO_PADRAO: Progresso = {
  versao: 2,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: TEMA_PADRAO,
  temasDesbloqueados: [...TEMAS_INICIAIS],
  som: true,
  volumeMusica: VOLUMES_PADRAO.musica,
  volumeEfeitos: VOLUMES_PADRAO.efeitos,
  volumeVoz: VOLUMES_PADRAO.voz,
  missoesDeCampo: {},
  apresentacoesVistas: [],
  metasVistas: [],
  unidadesComemoradas: [],
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: PROPORCAO_PREVIA.padrao,
  trilha: "web",
  lente: null,
  marcosInsignias: {},
  meuTema: null,
  projetos: {},
  ilhasComemoradas: [],
  revisao: REVISAO_PADRAO,
};

export const ESTADO_FASE_PADRAO: EstadoFaseSalvo = {
  objetivoAtual: 0,
  htmlAtual: null,
  cssAtual: null,
  estrelas: 3,
  introducaoVista: false,
  metaVista: false,
  htmlInicioObjetivo: null,
  cssInicioObjetivo: null,
  previsaoRespondida: null,
  partesFeitas: [],
  reveres: 0,
  programa: null,
  circuito: null,
};

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function lerRegistro<T>(valor: unknown, ler: (item: unknown) => T | null): Record<string, T> {
  const saida: Record<string, T> = {};
  if (!ehObjeto(valor)) return saida;
  for (const [chave, item] of Object.entries(valor)) {
    const lido = ler(item);
    if (lido !== null) saida[chave] = lido;
  }
  return saida;
}

function ehNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

/** Volume salvo (0 a 1) ou o padrão, se não for número. */
function lerVolume(valor: unknown, padrao: number): number {
  return ehNumero(valor) ? Math.min(1, Math.max(0, valor)) : padrao;
}

function ehBooleano(valor: unknown): valor is boolean {
  return typeof valor === "boolean";
}

function ehTextoOuNulo(valor: unknown): valor is string | null {
  return valor === null || typeof valor === "string";
}

function listaDeTextos(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.filter((item): item is string => typeof item === "string") : [];
}

/** Estado de uma fase. Os campos da v1 são obrigatórios; os novos ganham padrão. */
function lerEstadoFase(valor: unknown): EstadoFaseSalvo | null {
  if (!ehObjeto(valor)) return null;
  if (
    !ehNumero(valor.objetivoAtual) ||
    !ehTextoOuNulo(valor.htmlAtual) ||
    !ehNumero(valor.estrelas) ||
    !ehBooleano(valor.introducaoVista)
  ) {
    return null;
  }
  return {
    objetivoAtual: valor.objetivoAtual,
    htmlAtual: valor.htmlAtual,
    cssAtual: ehTextoOuNulo(valor.cssAtual) ? valor.cssAtual : null,
    estrelas: valor.estrelas,
    introducaoVista: valor.introducaoVista,
    metaVista: ehBooleano(valor.metaVista) ? valor.metaVista : valor.introducaoVista,
    htmlInicioObjetivo: ehTextoOuNulo(valor.htmlInicioObjetivo) ? valor.htmlInicioObjetivo : null,
    cssInicioObjetivo: ehTextoOuNulo(valor.cssInicioObjetivo) ? valor.cssInicioObjetivo : null,
    previsaoRespondida: ehNumero(valor.previsaoRespondida) ? valor.previsaoRespondida : null,
    partesFeitas: [...new Set(listaDeTextos(valor.partesFeitas))],
    reveres: ehNumero(valor.reveres) ? Math.max(0, Math.round(valor.reveres)) : 0,
    programa: lerProgramaSalvo(valor.programa),
    circuito: lerCircuitoSalvo(valor.circuito),
  };
}

const TIPOS_DE_PECA = ["entrada", "saida", "e", "ou", "nao", "xou"];

function lerCircuitoSalvo(valor: unknown): Circuito | null {
  if (!ehObjeto(valor) || !Array.isArray(valor.pecas) || !Array.isArray(valor.fios)) return null;
  const pecas: Peca[] = valor.pecas.flatMap((item) => {
    if (!ehObjeto(item) || typeof item.id !== "string" || typeof item.tipo !== "string" || !TIPOS_DE_PECA.includes(item.tipo) || !ehNumero(item.x) || !ehNumero(item.y)) return [];
    return [
      {
        id: item.id,
        tipo: item.tipo as Peca["tipo"],
        x: item.x,
        y: item.y,
        ...(typeof item.nome === "string" ? { nome: item.nome } : {}),
        ...(typeof item.rotulo === "string" ? { rotulo: item.rotulo } : {}),
        ...(item.forma === "lampada" || item.forma === "porta" || item.forma === "alarme" ? { forma: item.forma } : {}),
        ...(typeof item.ligada === "boolean" ? { ligada: item.ligada } : {}),
        ...(item.fixa === true ? { fixa: true } : {}),
      },
    ];
  });
  const fios: Fio[] = valor.fios.flatMap((item) =>
    ehObjeto(item) && typeof item.de === "string" && typeof item.para === "string" && ehNumero(item.porta) ? [{ de: item.de, para: item.para, porta: item.porta }] : [],
  );
  return { pecas, fios };
}

function lerProgramaSalvo(valor: unknown): ProgramaSalvo | null {
  if (!ehObjeto(valor)) return null;
  const entradas = Array.isArray(valor.entradas)
    ? valor.entradas.flatMap((item) =>
        ehObjeto(item) && typeof item.codigo === "string" && (item.origem === "console" || item.origem === "snippet")
          ? [{ codigo: item.codigo, origem: item.origem as "console" | "snippet" }]
          : [],
      )
    : [];
  const pontos = Array.isArray(valor.pontos) ? [...new Set(valor.pontos.filter((n): n is number => Number.isInteger(n) && (n as number) >= 1))].slice(0, 200) : [];
  const observacoes = listaDeTextos(valor.observacoes).filter((texto) => texto.length <= 200).slice(0, 30);
  return {
    entradas: entradas.slice(-MAXIMO_ENTRADAS_SALVAS),
    snippet: typeof valor.snippet === "string" ? valor.snippet : null,
    ...(pontos.length ? { pontos } : {}),
    ...(observacoes.length ? { observacoes } : {}),
  };
}

function lerProjeto(valor: unknown): ProjetoSalvo | null {
  if (!ehObjeto(valor)) return null;
  return {
    html: typeof valor.html === "string" ? valor.html : null,
    css: typeof valor.css === "string" ? valor.css : null,
    atualizadoEm: ehNumero(valor.atualizadoEm) ? valor.atualizadoEm : null,
    guia: [...new Set(listaDeTextos(valor.guia))],
    link: typeof valor.link === "string" && valor.link.length <= 300 ? valor.link : null,
  };
}

function lerLente(valor: unknown): LenteMapa | null {
  if (!ehObjeto(valor)) return null;
  if ((valor.tipo !== "tema" && valor.tipo !== "profissao") || typeof valor.id !== "string") return null;
  return { tipo: valor.tipo, id: valor.id };
}

/** Converte qualquer coisa vinda do localStorage num Progresso v2 válido. */
export function normalizarProgresso(bruto: unknown): Progresso {
  if (!ehObjeto(bruto)) return PROGRESSO_PADRAO;

  const meuTema = lerMeuTema(bruto.meuTema);
  // O Meu tema só vale enquanto as cores dele existem (apagado, some do seletor).
  const temasDesbloqueados = Array.isArray(bruto.temasDesbloqueados)
    ? bruto.temasDesbloqueados.filter((tema): tema is TemaId => ehTemaId(tema) && (tema !== "meu" || meuTema !== null))
    : [];
  for (const tema of TEMAS_INICIAIS) {
    if (!temasDesbloqueados.includes(tema)) temasDesbloqueados.push(tema);
  }

  const tema = ehTemaId(bruto.tema) && temasDesbloqueados.includes(bruto.tema) ? bruto.tema : TEMA_PADRAO;

  return {
    versao: 2,
    fasesConcluidas: [...new Set(listaDeTextos(bruto.fasesConcluidas))],
    estrelasPorFase: lerRegistro(bruto.estrelasPorFase, (item) => (ehNumero(item) ? item : null)),
    fasesEmAndamento: lerRegistro(bruto.fasesEmAndamento, lerEstadoFase),
    faseAtual: typeof bruto.faseAtual === "string" ? bruto.faseAtual : null,
    tema,
    temasDesbloqueados,
    som: ehBooleano(bruto.som) ? bruto.som : PROGRESSO_PADRAO.som,
    volumeMusica: lerVolume(bruto.volumeMusica, VOLUMES_PADRAO.musica),
    volumeEfeitos: lerVolume(bruto.volumeEfeitos, VOLUMES_PADRAO.efeitos),
    volumeVoz: lerVolume(bruto.volumeVoz, VOLUMES_PADRAO.voz),
    missoesDeCampo: lerRegistro(bruto.missoesDeCampo, (item) => (ehBooleano(item) ? item : null)),
    apresentacoesVistas: Array.isArray(bruto.apresentacoesVistas)
      ? [...new Set(bruto.apresentacoesVistas.filter(ehIdFerramenta))]
      : [],
    metasVistas: [...new Set(listaDeTextos(bruto.metasVistas))],
    unidadesComemoradas: [...new Set(listaDeTextos(bruto.unidadesComemoradas))],
    posicaoNoMapa: lerRegistro(bruto.posicaoNoMapa, (item) => (typeof item === "string" ? item : null)),
    mapaDesbloqueado: ehBooleano(bruto.mapaDesbloqueado) ? bruto.mapaDesbloqueado : false,
    proporcaoPrevia: ehNumero(bruto.proporcaoPrevia)
      ? Math.min(PROPORCAO_PREVIA.maxima, Math.max(PROPORCAO_PREVIA.minima, bruto.proporcaoPrevia))
      : PROPORCAO_PREVIA.padrao,
    trilha: typeof bruto.trilha === "string" && bruto.trilha.length > 0 ? bruto.trilha : PROGRESSO_PADRAO.trilha,
    lente: lerLente(bruto.lente),
    marcosInsignias: lerRegistro(bruto.marcosInsignias, (item) => (ehNumero(item) ? Math.max(0, Math.min(100, item)) : null)),
    meuTema,
    projetos: lerRegistro(bruto.projetos, lerProjeto),
    ilhasComemoradas: [...new Set(listaDeTextos(bruto.ilhasComemoradas))],
    revisao: lerEstadoRevisao(bruto.revisao),
  };
}

function renomearChaves(valor: unknown): unknown {
  if (!ehObjeto(valor)) return valor;
  const saida: Record<string, unknown> = {};
  for (const [chave, item] of Object.entries(valor)) saida[IDS_FASES_V1[chave] ?? chave] = item;
  return saida;
}

/**
 * Migra o progresso da v1: os ids de fase antigos viram os novos (em
 * fases concluídas, estrelas, fases em andamento e missões) e a fase que
 * estava em andamento vira a fase atual. Nada da v1 se perde.
 */
export function migrarProgressoV1(bruto: unknown): Progresso {
  if (!ehObjeto(bruto)) return PROGRESSO_PADRAO;
  const renomeado: Record<string, unknown> = {
    ...bruto,
    versao: 2,
    fasesConcluidas: listaDeTextos(bruto.fasesConcluidas).map((id) => IDS_FASES_V1[id] ?? id),
    estrelasPorFase: renomearChaves(bruto.estrelasPorFase),
    fasesEmAndamento: renomearChaves(bruto.fasesEmAndamento),
    missoesDeCampo: renomearChaves(bruto.missoesDeCampo),
  };
  const progresso = normalizarProgresso(renomeado);
  const emAndamento = Object.keys(progresso.fasesEmAndamento)[0] ?? null;
  return { ...progresso, faseAtual: emAndamento };
}

function lerJson(chave: string): unknown {
  try {
    const texto = window.localStorage.getItem(chave);
    return texto ? JSON.parse(texto) : undefined;
  } catch {
    return undefined;
  }
}

export function lerProgressoDoArmazenamento(): Progresso {
  const atual = lerJson(CHAVE_PROGRESSO);
  if (atual !== undefined) return normalizarProgresso(atual);
  const antigo = lerJson(CHAVE_PROGRESSO_V1);
  if (antigo === undefined) return PROGRESSO_PADRAO;
  const migrado = migrarProgressoV1(antigo);
  gravarProgressoNoArmazenamento(migrado);
  return migrado;
}

export function gravarProgressoNoArmazenamento(progresso: Progresso): void {
  try {
    window.localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso));
  } catch {
    // Sem armazenamento (aba anônima, cota cheia): o jogo segue só na memória.
  }
}
