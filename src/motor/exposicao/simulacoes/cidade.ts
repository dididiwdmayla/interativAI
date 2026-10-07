/*
 * Onde a programação vive (sala 6): uma cidade com código em todo lugar.
 * Tocar num lugar abre o que tem dentro: um pedacinho do programa (em
 * pseudocódigo com cara de JavaScript) e quem programa aquilo, com a ponte
 * para a tela de Profissões.
 *
 * Comandos: "abrir:<lugar>", "fechar".
 * Marcos: "aberto:<lugar>" (já foi aberto), "todos-abertos".
 */
import { KEBAB, repetidos, semRepetir, tamanho, textos } from "../comum";
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export const FIGURAS_DA_CIDADE = ["semaforo", "caixa-eletronico", "app-banco", "padaria", "carro", "ponto-onibus"] as const;
export type FiguraCidade = (typeof FIGURAS_DA_CIDADE)[number];

export type LugarDaCidade = {
  id: string;
  /** "O semáforo". Até 28. */
  nome: string;
  figura: FiguraCidade;
  /** O pedacinho do programa de dentro (de 2 a 5 linhas, até 40 cada). */
  codigo: string[];
  /** O que o programa faz, numa frase. Até 140. */
  explica: string;
  /** Quem programa isso. Até 60. */
  quem: string;
  /** A profissão da tela de Profissões ligada a este lugar (o id), se houver. */
  profissao?: string;
};

export type EstacaoCidade = { id: string; tipo: "cidade"; titulo: string; lugares: LugarDaCidade[] };

export type EstadoCidade = { tipo: "cidade"; abertos: string[]; aberto: string | null };

export const CIDADE: ModeloSimulacao<EstacaoCidade, EstadoCidade> = {
  inicial: () => ({ tipo: "cidade", abertos: [], aberto: null }),
  comando(dados, estado, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (verbo === "fechar") return estado.aberto ? { ...estado, aberto: null } : null;
    if (verbo === "abrir") {
      if (!dados.lugares.some((l) => l.id === resto) || estado.aberto === resto) return null;
      return { ...estado, abertos: semRepetir([...estado.abertos, resto]), aberto: resto };
    }
    return null;
  },
  marcos(dados, estado) {
    const marcos = estado.abertos.map((id) => `aberto:${id}`);
    if (dados.lugares.every((l) => estado.abertos.includes(l.id))) marcos.push("todos-abertos");
    return marcos;
  },
  marcoPossivel(dados, marco) {
    const [verbo, resto] = partesDoComando(marco);
    return marco === "todos-abertos" || (verbo === "aberto" && dados.lugares.some((l) => l.id === resto));
  },
  comandoPossivel(dados, comando) {
    const [verbo, resto] = partesDoComando(comando);
    return comando === "fechar" || (verbo === "abrir" && dados.lugares.some((l) => l.id === resto));
  },
  conferir(dados, onde) {
    const p: string[] = [];
    if (dados.lugares.length < 2 || dados.lugares.length > 6) p.push(`${onde}: ${dados.lugares.length} lugares (de 2 a 6)`);
    p.push(...repetidos(dados.lugares.map((l) => l.id)).map((id) => `${onde}: lugar com id repetido "${id}"`));
    p.push(...repetidos(dados.lugares.map((l) => l.figura)).map((f) => `${onde}: a figura "${f}" aparece duas vezes (cada uma tem o seu lugar na cidade)`));
    for (const lugar of dados.lugares) {
      const qual = `${onde}: o lugar "${lugar.id}"`;
      if (!KEBAB.test(lugar.id)) p.push(`${qual} não está em kebab-case`);
      tamanho(p, `${qual}: nome`, lugar.nome, 28);
      tamanho(p, `${qual}: explica`, lugar.explica, 140);
      tamanho(p, `${qual}: quem`, lugar.quem, 60);
      if (!(FIGURAS_DA_CIDADE as readonly string[]).includes(lugar.figura)) p.push(`${qual}: figura "${lugar.figura}" não existe`);
      if (lugar.codigo.length < 2 || lugar.codigo.length > 5) p.push(`${qual}: ${lugar.codigo.length} linhas de código (de 2 a 5)`);
      lugar.codigo.forEach((linha, i) => {
        if (linha.length > 40) p.push(`${qual}: a linha ${i + 1} do código tem ${linha.length} caracteres (máximo 40)`);
      });
    }
    return p;
  },
  ler: (valor) => ({ tipo: "cidade", abertos: semRepetir(textos(valor.abertos, 6)), aberto: typeof valor.aberto === "string" ? valor.aberto : null }),
  cabe: (dados, estado) => estado.abertos.every((id) => dados.lugares.some((l) => l.id === id)) && (estado.aberto === null || dados.lugares.some((l) => l.id === estado.aberto)),
  resumo: (dados, estado) => `${dados.titulo}: ${estado.abertos.length} de ${dados.lugares.length} lugares abertos`,
};
