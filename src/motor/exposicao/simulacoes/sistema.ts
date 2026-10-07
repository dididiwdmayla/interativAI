/*
 * O sistema operacional, o gerente (sala 4): vários programas querem o
 * processador ao mesmo tempo, e ele só faz uma coisa por vez. O gerente
 * divide o tempo em fatias e dá a vez a um de cada vez, tão rápido que
 * parece tudo junto; e divide a memória, cada programa no seu pedaço.
 *
 * Um programa com `ritmo` (a música) não pode ficar mais que `ritmo`
 * fatias seguidas sem a vez dele enquanto não termina: senão, engasga.
 *
 * Comandos: "vez:<programa>", "automatico" (o gerente termina sozinho, sem
 * deixar ninguém engasgar), "reiniciar".
 * Marcos: "vez:<programa>", "terminou:<programa>", "engasgou",
 * "todos-terminaram", "terminou-sem-engasgo", "automatico".
 */
import { KEBAB, repetidos, tamanho, textos } from "../comum";
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export const FIGURAS_DE_PROGRAMA = ["musica", "navegador", "jogo", "video", "editor", "mensagens"] as const;

export type ProgramaNoSistema = {
  id: string;
  nome: string;
  figura: (typeof FIGURAS_DE_PROGRAMA)[number];
  /** Quantas fatias de tempo ele precisa para terminar (de 1 a 6). */
  fatias: number;
  /** Quantos pedaços de memória ele ocupa até terminar. */
  memoria: number;
  /** No máximo quantas fatias seguidas sem a vez dele (sem: não tem pressa). */
  ritmo?: number;
};

export type EstacaoSistema = {
  id: string;
  tipo: "sistema";
  titulo: string;
  programas: ProgramaNoSistema[];
  /** Os pedaços de memória do computador (de 4 a 12). */
  memoriaTotal: number;
};

export type EstadoSistema = {
  tipo: "sistema";
  /** O programa de cada fatia já dada, em ordem. */
  fatias: string[];
  automatico: boolean;
};

export function restantes(dados: EstacaoSistema, fatias: readonly string[]): Record<string, number> {
  return Object.fromEntries(dados.programas.map((p) => [p.id, p.fatias - fatias.filter((f) => f === p.id).length]));
}

/** O índice da fatia em que algum programa engasgou (ou null). */
export function fatiaDoEngasgo(dados: EstacaoSistema, fatias: readonly string[]): { fatia: number; programa: string } | null {
  for (const programa of dados.programas) {
    if (!programa.ritmo) continue;
    let semVez = 0;
    let feitas = 0;
    for (let i = 0; i < fatias.length && feitas < programa.fatias; i += 1) {
      if (fatias[i] === programa.id) {
        semVez = 0;
        feitas += 1;
      } else {
        semVez += 1;
        if (semVez > programa.ritmo) return { fatia: i, programa: programa.id };
      }
    }
  }
  return null;
}

/** O gerente automático: primeiro quem está quase engasgando; senão, a vez de cada um, em roda. */
function proximaVez(dados: EstacaoSistema, fatias: readonly string[]): string | null {
  const falta = restantes(dados, fatias);
  const vivos = dados.programas.filter((p) => falta[p.id] > 0);
  if (!vivos.length) return null;
  const semVez = (id: string) => {
    const ultima = fatias.lastIndexOf(id);
    return fatias.length - 1 - ultima;
  };
  const urgente = vivos.filter((p) => p.ritmo !== undefined && semVez(p.id) >= p.ritmo).sort((a, b) => (a.ritmo ?? 0) - (b.ritmo ?? 0))[0];
  if (urgente) return urgente.id;
  const ultimo = fatias[fatias.length - 1];
  const ordem = dados.programas.map((p) => p.id);
  const depois = ultimo === undefined ? 0 : ordem.indexOf(ultimo) + 1;
  for (let k = 0; k < ordem.length; k += 1) {
    const id = ordem[(depois + k) % ordem.length];
    if (falta[id] > 0) return id;
  }
  return null;
}

/** Todas as fatias do gerente automático, a partir das que já foram dadas. */
export function completarAutomatico(dados: EstacaoSistema, fatias: readonly string[]): string[] {
  const todas = [...fatias];
  for (let guarda = 0; guarda < 64; guarda += 1) {
    const vez = proximaVez(dados, todas);
    if (!vez) break;
    todas.push(vez);
  }
  return todas;
}

export const SISTEMA: ModeloSimulacao<EstacaoSistema, EstadoSistema> = {
  inicial: () => ({ tipo: "sistema", fatias: [], automatico: false }),
  comando(dados, estado, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (verbo === "reiniciar") return { tipo: "sistema", fatias: [], automatico: false };
    if (verbo === "vez") {
      if (!dados.programas.some((p) => p.id === resto) || restantes(dados, estado.fatias)[resto] <= 0) return null;
      return { ...estado, fatias: [...estado.fatias, resto] };
    }
    if (verbo === "automatico") {
      const fatias = completarAutomatico(dados, estado.fatias);
      if (fatias.length === estado.fatias.length) return null;
      return { tipo: "sistema", fatias, automatico: true };
    }
    return null;
  },
  marcos(dados, estado) {
    const marcos = [...new Set(estado.fatias)].map((id) => `vez:${id}`);
    const falta = restantes(dados, estado.fatias);
    for (const programa of dados.programas) if (falta[programa.id] <= 0) marcos.push(`terminou:${programa.id}`);
    const engasgo = fatiaDoEngasgo(dados, estado.fatias);
    if (engasgo) marcos.push("engasgou");
    const todos = dados.programas.every((p) => falta[p.id] <= 0);
    if (todos) marcos.push("todos-terminaram");
    if (todos && !engasgo) marcos.push("terminou-sem-engasgo");
    if (estado.automatico) marcos.push("automatico");
    return marcos;
  },
  marcoPossivel(dados, marco) {
    const [verbo, resto] = partesDoComando(marco);
    if (["engasgou", "todos-terminaram", "terminou-sem-engasgo", "automatico"].includes(marco)) return true;
    return (verbo === "vez" || verbo === "terminou") && dados.programas.some((p) => p.id === resto);
  },
  comandoPossivel(dados, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (comando === "automatico" || comando === "reiniciar") return true;
    return verbo === "vez" && dados.programas.some((p) => p.id === resto);
  },
  conferir(dados, onde) {
    const p: string[] = [];
    if (dados.programas.length < 2 || dados.programas.length > 4) p.push(`${onde}: ${dados.programas.length} programas (de 2 a 4)`);
    p.push(...repetidos(dados.programas.map((x) => x.id)).map((id) => `${onde}: programa com id repetido "${id}"`));
    for (const programa of dados.programas) {
      if (!KEBAB.test(programa.id)) p.push(`${onde}: o programa "${programa.id}" não está em kebab-case`);
      tamanho(p, `${onde}: nome do programa "${programa.id}"`, programa.nome, 20);
      if (programa.fatias < 1 || programa.fatias > 6) p.push(`${onde}: "${programa.id}" pede ${programa.fatias} fatias (de 1 a 6)`);
      if (!(FIGURAS_DE_PROGRAMA as readonly string[]).includes(programa.figura)) p.push(`${onde}: figura "${programa.figura}" não existe`);
    }
    const memoria = dados.programas.reduce((soma, x) => soma + x.memoria, 0);
    if (memoria > dados.memoriaTotal) p.push(`${onde}: os programas pedem ${memoria} pedaços de memória, e o computador tem ${dados.memoriaTotal}`);
    if (dados.memoriaTotal < 4 || dados.memoriaTotal > 12) p.push(`${onde}: memoriaTotal ${dados.memoriaTotal} (de 4 a 12)`);
    if (fatiaDoEngasgo(dados, completarAutomatico(dados, []))) p.push(`${onde}: nem o gerente automático consegue sem engasgar (ritmo apertado demais)`);
    return p;
  },
  ler: (valor) => ({ tipo: "sistema", fatias: textos(valor.fatias, 40), automatico: valor.automatico === true }),
  cabe(dados, estado) {
    const falta = restantes(dados, estado.fatias);
    return estado.fatias.every((id) => dados.programas.some((p) => p.id === id)) && Object.values(falta).every((n) => n >= 0);
  },
  resumo: (dados, estado) => `${dados.titulo}: ${estado.fatias.length ? estado.fatias.join(" > ") : "nenhuma fatia dada"}`,
};
