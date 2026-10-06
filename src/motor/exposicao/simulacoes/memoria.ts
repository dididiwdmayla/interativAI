/*
 * As caixas da memória (sala 4): cada caixa tem um endereço (o número dela)
 * e guarda um valor. Um programa pequeno roda linha a linha e cada linha
 * guarda um valor numa caixa, que ganha o nome da variável (a mesma ideia
 * do palco da memória da Ilha Lógica, agora com o endereço à mostra).
 *
 * Comandos: "passo" (roda a próxima linha), "escolher:N" (aponta a caixa
 * N), "guardar:N=V" (põe o valor V, da bandeja, na caixa N), "reiniciar".
 * Marcos: "linha:K" (K linhas já rodaram), "fim", "escolhida:N",
 * "caixa:N=V" (o que cada caixa guarda agora).
 */
import { tamanho } from "../comum";
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export type LinhaMemoria = {
  /** O código da linha ("let preco = 12;"). Até 32. */
  texto: string;
  endereco: number;
  valor: number;
  /** O nome da variável que passa a morar na caixa. */
  nome: string;
};

export type EstacaoMemoria = {
  id: string;
  tipo: "memoria";
  titulo: string;
  /** Quantas caixas (de 4 a 12), com endereço de 0 em diante. */
  caixas: number;
  programa: LinhaMemoria[];
  /** Os valores da bandeja (o aluno guarda um deles numa caixa). */
  bandeja: number[];
};

export type EstadoMemoria = {
  tipo: "memoria";
  valores: (number | null)[];
  nomes: (string | null)[];
  /** Quantas linhas do programa já rodaram. */
  linha: number;
  escolhida: number | null;
};

function vazio(dados: EstacaoMemoria): EstadoMemoria {
  return { tipo: "memoria", valores: Array<number | null>(dados.caixas).fill(null), nomes: Array<string | null>(dados.caixas).fill(null), linha: 0, escolhida: null };
}

const endereco = (dados: EstacaoMemoria, texto: string): number | null => {
  const n = Number(texto);
  return /^\d+$/.test(texto) && n < dados.caixas ? n : null;
};

export const MEMORIA: ModeloSimulacao<EstacaoMemoria, EstadoMemoria> = {
  inicial: vazio,
  comando(dados, estado, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (verbo === "reiniciar") return vazio(dados);
    if (verbo === "passo") {
      const linha = dados.programa[estado.linha];
      if (!linha) return null;
      const valores = [...estado.valores];
      const nomes = [...estado.nomes];
      valores[linha.endereco] = linha.valor;
      nomes[linha.endereco] = linha.nome;
      return { ...estado, valores, nomes, linha: estado.linha + 1 };
    }
    if (verbo === "escolher") {
      const n = endereco(dados, resto);
      return n === null ? null : { ...estado, escolhida: n };
    }
    if (verbo === "guardar") {
      const [onde, valor] = resto.split("=");
      const n = endereco(dados, onde ?? "");
      const v = Number(valor);
      if (n === null || !dados.bandeja.includes(v) || estado.valores[n] === v) return null;
      const valores = [...estado.valores];
      valores[n] = v;
      return { ...estado, valores, escolhida: n };
    }
    return null;
  },
  marcos(dados, estado) {
    const marcos: string[] = [];
    for (let k = 1; k <= estado.linha; k += 1) marcos.push(`linha:${k}`);
    if (estado.linha >= dados.programa.length) marcos.push("fim");
    if (estado.escolhida !== null) marcos.push(`escolhida:${estado.escolhida}`);
    estado.valores.forEach((valor, n) => {
      if (valor !== null) marcos.push(`caixa:${n}=${valor}`);
    });
    return marcos;
  },
  marcoPossivel(dados, marco) {
    const [verbo, resto] = partesDoComando(marco);
    if (marco === "fim") return true;
    if (verbo === "linha") return Number(resto) >= 1 && Number(resto) <= dados.programa.length;
    if (verbo === "escolhida") return endereco(dados, resto) !== null;
    if (verbo === "caixa") {
      const [onde, valor] = resto.split("=");
      const v = Number(valor);
      return endereco(dados, onde ?? "") !== null && (dados.bandeja.includes(v) || dados.programa.some((l) => l.valor === v));
    }
    return false;
  },
  comandoPossivel(dados, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (verbo === "passo" || verbo === "reiniciar") return resto === "";
    if (verbo === "escolher") return endereco(dados, resto) !== null;
    if (verbo === "guardar") {
      const [onde, valor] = resto.split("=");
      return endereco(dados, onde ?? "") !== null && dados.bandeja.includes(Number(valor));
    }
    return false;
  },
  conferir(dados, onde) {
    const p: string[] = [];
    if (dados.caixas < 4 || dados.caixas > 12) p.push(`${onde}: ${dados.caixas} caixas (de 4 a 12)`);
    if (dados.programa.length < 1 || dados.programa.length > 5) p.push(`${onde}: ${dados.programa.length} linhas de programa (de 1 a 5)`);
    for (const [i, linha] of dados.programa.entries()) {
      tamanho(p, `${onde}: linha ${i + 1}`, linha.texto, 32);
      if (linha.endereco < 0 || linha.endereco >= dados.caixas) p.push(`${onde}: a linha ${i + 1} guarda na caixa ${linha.endereco}, que não existe`);
      if (!/^[a-z][a-zA-Z0-9]*$/.test(linha.nome)) p.push(`${onde}: o nome "${linha.nome}" não parece nome de variável`);
    }
    if (dados.bandeja.length < 1 || dados.bandeja.length > 6) p.push(`${onde}: ${dados.bandeja.length} valores na bandeja (de 1 a 6)`);
    return p;
  },
  ler(valor) {
    if (!Array.isArray(valor.valores) || !Array.isArray(valor.nomes)) return null;
    const valores = valor.valores.slice(0, 12).map((v) => (typeof v === "number" && Number.isFinite(v) ? v : null));
    const nomes = valor.nomes.slice(0, 12).map((v) => (typeof v === "string" ? v.slice(0, 24) : null));
    const linha = typeof valor.linha === "number" ? Math.max(0, Math.round(valor.linha)) : 0;
    const escolhida = typeof valor.escolhida === "number" ? Math.round(valor.escolhida) : null;
    return { tipo: "memoria", valores, nomes, linha, escolhida };
  },
  cabe: (dados, estado) =>
    estado.valores.length === dados.caixas &&
    estado.nomes.length === dados.caixas &&
    estado.linha <= dados.programa.length &&
    (estado.escolhida === null || (estado.escolhida >= 0 && estado.escolhida < dados.caixas)),
  resumo: (dados, estado) =>
    `${dados.titulo}: ${estado.valores.map((v, n) => (v === null ? null : `[${n}] ${v}`)).filter(Boolean).join(", ") || "caixas vazias"}${estado.linha < dados.programa.length ? ` (linha ${estado.linha + 1} a rodar)` : ""}`,
};

