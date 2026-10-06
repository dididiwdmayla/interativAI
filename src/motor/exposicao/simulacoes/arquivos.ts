/*
 * Arquivos e pastas (sala 4): o explorador de arquivos como ÁRVORE (a
 * mesma ideia da zona Estruturas de dados): a raiz no topo, as pastas são
 * galhos, os arquivos são folhas. O caminho de um arquivo é a trilha da
 * raiz até ele.
 *
 * Comandos: "abrir:<pasta>" (abre ou fecha), "escolher:<id>",
 * "mover:<arquivo>><pasta>", "ver-arvore" (o desenho da árvore).
 * Marcos: "aberta:<pasta>", "escolhido:<id>", "em:<arquivo>><pasta>" (onde
 * cada arquivo está agora), "viu-arvore".
 */
import { ehObjeto, KEBAB, repetidos, semRepetir, tamanho, textos } from "../comum";
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export type NoArquivo = { id: string; nome: string; tipo: "pasta" | "arquivo"; filhos?: NoArquivo[] };

export type EstacaoArquivos = {
  id: string;
  tipo: "arquivos";
  titulo: string;
  /** A raiz (uma pasta). */
  raiz: NoArquivo;
};

export type EstadoArquivos = {
  tipo: "arquivos";
  abertas: string[];
  escolhido: string | null;
  /** Os arquivos que mudaram de pasta: o id da pasta nova. */
  movidos: Record<string, string>;
  viuArvore: boolean;
};

export function todosOsNos(raiz: NoArquivo): NoArquivo[] {
  return [raiz, ...(raiz.filhos ?? []).flatMap(todosOsNos)];
}

/** A pasta de cada nó, como está agora (com os movidos). */
export function paisDeAgora(dados: EstacaoArquivos, estado: EstadoArquivos): Record<string, string | null> {
  const pais: Record<string, string | null> = { [dados.raiz.id]: null };
  const visitar = (no: NoArquivo) => {
    for (const filho of no.filhos ?? []) {
      pais[filho.id] = no.id;
      visitar(filho);
    }
  };
  visitar(dados.raiz);
  for (const [arquivo, pasta] of Object.entries(estado.movidos)) pais[arquivo] = pasta;
  return pais;
}

/** Os filhos de uma pasta, como estão agora (pastas primeiro, depois arquivos, cada grupo na ordem dos dados). */
export function filhosDeAgora(dados: EstacaoArquivos, estado: EstadoArquivos, pasta: string): NoArquivo[] {
  const pais = paisDeAgora(dados, estado);
  const nos = todosOsNos(dados.raiz).filter((no) => pais[no.id] === pasta);
  return [...nos.filter((no) => no.tipo === "pasta"), ...nos.filter((no) => no.tipo === "arquivo")];
}

/** O caminho da raiz até o nó: ["Meu computador", "Documentos", "bolo.txt"]. */
export function caminhoDe(dados: EstacaoArquivos, estado: EstadoArquivos, id: string): string[] {
  const pais = paisDeAgora(dados, estado);
  const porId = new Map(todosOsNos(dados.raiz).map((no) => [no.id, no]));
  const caminho: string[] = [];
  let atual: string | null | undefined = id;
  for (let guarda = 0; atual && guarda < 20; guarda += 1) {
    caminho.unshift(porId.get(atual)?.nome ?? atual);
    atual = pais[atual];
  }
  return caminho;
}

function no(dados: EstacaoArquivos, id: string): NoArquivo | undefined {
  return todosOsNos(dados.raiz).find((n) => n.id === id);
}

export const ARQUIVOS: ModeloSimulacao<EstacaoArquivos, EstadoArquivos> = {
  inicial: (dados) => ({ tipo: "arquivos", abertas: [dados.raiz.id], escolhido: null, movidos: {}, viuArvore: false }),
  comando(dados, estado, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (verbo === "abrir") {
      if (no(dados, resto)?.tipo !== "pasta" || resto === dados.raiz.id) return null;
      const abertas = estado.abertas.includes(resto) ? estado.abertas.filter((id) => id !== resto) : [...estado.abertas, resto];
      return { ...estado, abertas };
    }
    if (verbo === "escolher") {
      if (!no(dados, resto) || estado.escolhido === resto) return null;
      return { ...estado, escolhido: resto };
    }
    if (verbo === "mover") {
      const [arquivo, pasta] = resto.split(">");
      if (no(dados, arquivo ?? "")?.tipo !== "arquivo" || no(dados, pasta ?? "")?.tipo !== "pasta") return null;
      if (paisDeAgora(dados, estado)[arquivo] === pasta) return null;
      return { ...estado, movidos: { ...estado.movidos, [arquivo]: pasta }, escolhido: arquivo, abertas: semRepetir([...estado.abertas, pasta]) };
    }
    if (verbo === "ver-arvore") return estado.viuArvore ? null : { ...estado, viuArvore: true };
    return null;
  },
  marcos(dados, estado) {
    const pais = paisDeAgora(dados, estado);
    const marcos = estado.abertas.map((id) => `aberta:${id}`);
    if (estado.escolhido) marcos.push(`escolhido:${estado.escolhido}`);
    for (const n of todosOsNos(dados.raiz)) if (n.tipo === "arquivo") marcos.push(`em:${n.id}>${pais[n.id]}`);
    if (estado.viuArvore) marcos.push("viu-arvore");
    return marcos;
  },
  marcoPossivel(dados, marco) {
    const [verbo, resto] = partesDoComando(marco);
    if (marco === "viu-arvore") return true;
    if (verbo === "aberta") return no(dados, resto)?.tipo === "pasta";
    if (verbo === "escolhido") return no(dados, resto) !== undefined;
    if (verbo === "em") {
      const [arquivo, pasta] = resto.split(">");
      return no(dados, arquivo ?? "")?.tipo === "arquivo" && no(dados, pasta ?? "")?.tipo === "pasta";
    }
    return false;
  },
  comandoPossivel(dados, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (comando === "ver-arvore") return true;
    if (verbo === "abrir") return no(dados, resto)?.tipo === "pasta" && resto !== dados.raiz.id;
    if (verbo === "escolher") return no(dados, resto) !== undefined;
    if (verbo === "mover") {
      const [arquivo, pasta] = resto.split(">");
      return no(dados, arquivo ?? "")?.tipo === "arquivo" && no(dados, pasta ?? "")?.tipo === "pasta";
    }
    return false;
  },
  conferir(dados, onde) {
    const p: string[] = [];
    const nos = todosOsNos(dados.raiz);
    if (dados.raiz.tipo !== "pasta") p.push(`${onde}: a raiz precisa ser uma pasta`);
    if (nos.length < 4 || nos.length > 16) p.push(`${onde}: ${nos.length} nós na árvore (de 4 a 16)`);
    p.push(...repetidos(nos.map((n) => n.id)).map((id) => `${onde}: id repetido "${id}"`));
    for (const n of nos) {
      if (!KEBAB.test(n.id)) p.push(`${onde}: "${n.id}" não está em kebab-case`);
      tamanho(p, `${onde}: nome de "${n.id}"`, n.nome, 24);
      if (n.tipo === "arquivo" && n.filhos?.length) p.push(`${onde}: o arquivo "${n.id}" tem filhos (só pasta tem)`);
    }
    return p;
  },
  ler(valor) {
    const movidos: Record<string, string> = {};
    if (ehObjeto(valor.movidos)) for (const [a, b] of Object.entries(valor.movidos).slice(0, 16)) if (typeof b === "string") movidos[a] = b;
    return { tipo: "arquivos", abertas: semRepetir(textos(valor.abertas, 16)), escolhido: typeof valor.escolhido === "string" ? valor.escolhido : null, movidos, viuArvore: valor.viuArvore === true };
  },
  cabe(dados, estado) {
    const nos = new Map(todosOsNos(dados.raiz).map((n) => [n.id, n]));
    return (
      estado.abertas.every((id) => nos.get(id)?.tipo === "pasta") &&
      (estado.escolhido === null || nos.has(estado.escolhido)) &&
      Object.entries(estado.movidos).every(([a, b]) => nos.get(a)?.tipo === "arquivo" && nos.get(b)?.tipo === "pasta")
    );
  },
  resumo: (dados, estado) => `${dados.titulo}: ${estado.escolhido ? caminhoDe(dados, estado, estado.escolhido).join(" / ") : "nada escolhido"}`,
};
