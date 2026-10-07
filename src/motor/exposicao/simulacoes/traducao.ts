/*
 * Compilar ou interpretar (sala 3): o mesmo programa pelos dois caminhos.
 * O compilador traduz tudo antes e entrega um executável, que roda direto
 * (e roda de novo sem traduzir); o intérprete traduz uma linha, roda,
 * traduz a próxima (e, rodando de novo, traduz tudo outra vez).
 *
 * Comandos: "compilar", "interpretar", "repetir" (roda de novo pelos dois
 * caminhos; pede os dois já vistos).
 * Marcos: "compilou", "interpretou", "repetiu".
 */
import { semRepetir, tamanho, textos } from "../comum";
import type { ModeloSimulacao } from "./tipos";

export type EstacaoTraducao = {
  id: string;
  tipo: "traducao";
  titulo: string;
  /** O programa (de 2 a 5 linhas curtas). */
  programa: string[];
  /** Quem costuma ir por cada caminho ("C", "Python"). Até 24. */
  exemplos: { compilada: string; interpretada: string };
};

type Vista = "compilar" | "interpretar" | "repetir";

export type EstadoTraducao = {
  tipo: "traducao";
  vistos: Vista[];
  /** O último caminho tocado (a tela anima este). */
  ultimo: Vista | null;
  /** Quantas vezes cada caminho já traduziu uma linha (o placar). */
  traducoes: { compilada: number; interpretada: number };
};

const MARCO: Record<Vista, string> = { compilar: "compilou", interpretar: "interpretou", repetir: "repetiu" };

export const TRADUCAO: ModeloSimulacao<EstacaoTraducao, EstadoTraducao> = {
  inicial: () => ({ tipo: "traducao", vistos: [], ultimo: null, traducoes: { compilada: 0, interpretada: 0 } }),
  comando(dados, estado, comando) {
    const linhas = dados.programa.length;
    const { compilada, interpretada } = estado.traducoes;
    if (comando === "compilar") return { ...estado, vistos: semRepetir([...estado.vistos, "compilar"]), ultimo: "compilar", traducoes: { compilada: compilada + linhas, interpretada } };
    if (comando === "interpretar") return { ...estado, vistos: semRepetir([...estado.vistos, "interpretar"]), ultimo: "interpretar", traducoes: { compilada, interpretada: interpretada + linhas } };
    if (comando === "repetir") {
      if (!estado.vistos.includes("compilar") || !estado.vistos.includes("interpretar")) return null;
      // O executável já existe: só o intérprete traduz de novo.
      return { ...estado, vistos: semRepetir([...estado.vistos, "repetir"]), ultimo: "repetir", traducoes: { compilada, interpretada: interpretada + linhas } };
    }
    return null;
  },
  marcos: (_dados, estado) => estado.vistos.map((v) => MARCO[v]),
  marcoPossivel: (_dados, marco) => Object.values(MARCO).includes(marco),
  comandoPossivel: (_dados, comando) => comando in MARCO,
  conferir(dados, onde) {
    const p: string[] = [];
    if (dados.programa.length < 2 || dados.programa.length > 5) p.push(`${onde}: o programa tem ${dados.programa.length} linhas (de 2 a 5)`);
    dados.programa.forEach((linha, i) => tamanho(p, `${onde}: linha ${i + 1} do programa`, linha, 34));
    tamanho(p, `${onde}: exemplos.compilada`, dados.exemplos.compilada, 24);
    tamanho(p, `${onde}: exemplos.interpretada`, dados.exemplos.interpretada, 24);
    return p;
  },
  ler(valor) {
    const vistos = textos(valor.vistos, 3).filter((v): v is Vista => v in MARCO);
    const ultimo = typeof valor.ultimo === "string" && valor.ultimo in MARCO ? (valor.ultimo as Vista) : null;
    const t = valor.traducoes as { compilada?: unknown; interpretada?: unknown } | undefined;
    const numero = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0);
    return { tipo: "traducao", vistos: semRepetir(vistos), ultimo, traducoes: { compilada: numero(t?.compilada), interpretada: numero(t?.interpretada) } };
  },
  cabe: () => true,
  resumo: (dados, estado) => `${dados.titulo}: ${estado.vistos.length ? estado.vistos.join(", ") : "nada visto"} (traduções: compilado ${estado.traducoes.compilada}, interpretado ${estado.traducoes.interpretada})`,
};
