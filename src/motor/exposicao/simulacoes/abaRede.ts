/*
 * A prévia da aba Rede (Network) do F12 (sala 5): recarregar a página com a
 * aba aberta grava cada arquivo que o navegador pediu (o documento, o CSS,
 * o JavaScript, as imagens), com o status, o tamanho e o tempo, e a
 * cascata. É a porta da Ilha Rede e Servidor.
 *
 * Comandos: "gravar" (recarrega com a aba aberta), "escolher:<id>",
 * "ordenar:<chegada|tempo>".
 * Marcos: "gravou", "escolhida:<id>", "ordenou".
 */
import { KEBAB, repetidos, tamanho } from "../comum";
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export const TIPOS_DE_REQUISICAO = ["documento", "estilo", "script", "imagem", "fonte", "dados"] as const;

export type Requisicao = {
  id: string;
  /** O nome do arquivo ("cardapio.css"). Até 28. */
  nome: string;
  tipo: (typeof TIPOS_DE_REQUISICAO)[number];
  /** 200 (deu certo), 404 (não achou), 500 (o servidor falhou)... */
  status: number;
  tamanhoKb: number;
  /** Quando começou e quanto durou, em milissegundos desde o clique. */
  inicioMs: number;
  duracaoMs: number;
};

export type EstacaoAbaRede = {
  id: string;
  tipo: "aba-rede";
  titulo: string;
  /** O endereço da página ("padariadobairro.com.br"). Até 32. */
  pagina: string;
  requisicoes: Requisicao[];
};

export type EstadoAbaRede = { tipo: "aba-rede"; gravado: boolean; escolhida: string | null; ordem: "chegada" | "tempo" };

/** As linhas na ordem da tabela. */
export function linhasDaAba(dados: EstacaoAbaRede, estado: EstadoAbaRede): Requisicao[] {
  const lista = [...dados.requisicoes];
  return estado.ordem === "tempo" ? lista.sort((a, b) => b.duracaoMs - a.duracaoMs) : lista.sort((a, b) => a.inicioMs - b.inicioMs);
}

/** O texto do status, como o F12 mostra. */
export function textoDoStatus(status: number): string {
  return ({ 200: "OK", 304: "Not Modified", 404: "Not Found", 500: "Internal Server Error" } as Record<number, string>)[status] ?? "";
}

export const ABA_REDE: ModeloSimulacao<EstacaoAbaRede, EstadoAbaRede> = {
  inicial: () => ({ tipo: "aba-rede", gravado: false, escolhida: null, ordem: "chegada" }),
  comando(dados, estado, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (verbo === "gravar") return { ...estado, gravado: true, escolhida: null };
    if (verbo === "escolher") {
      if (!estado.gravado || !dados.requisicoes.some((r) => r.id === resto) || estado.escolhida === resto) return null;
      return { ...estado, escolhida: resto };
    }
    if (verbo === "ordenar") {
      if (!estado.gravado || (resto !== "chegada" && resto !== "tempo") || resto === estado.ordem) return null;
      return { ...estado, ordem: resto };
    }
    return null;
  },
  marcos(_dados, estado) {
    const marcos: string[] = [];
    if (estado.gravado) marcos.push("gravou");
    if (estado.escolhida) marcos.push(`escolhida:${estado.escolhida}`);
    if (estado.ordem === "tempo") marcos.push("ordenou");
    return marcos;
  },
  marcoPossivel(dados, marco) {
    const [verbo, resto] = partesDoComando(marco);
    if (marco === "gravou" || marco === "ordenou") return true;
    return verbo === "escolhida" && dados.requisicoes.some((r) => r.id === resto);
  },
  comandoPossivel(dados, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (comando === "gravar") return true;
    if (verbo === "ordenar") return resto === "chegada" || resto === "tempo";
    return verbo === "escolher" && dados.requisicoes.some((r) => r.id === resto);
  },
  conferir(dados, onde) {
    const p: string[] = [];
    tamanho(p, `${onde}: pagina`, dados.pagina, 32);
    if (dados.requisicoes.length < 3 || dados.requisicoes.length > 10) p.push(`${onde}: ${dados.requisicoes.length} requisições (de 3 a 10)`);
    p.push(...repetidos(dados.requisicoes.map((r) => r.id)).map((id) => `${onde}: requisição com id repetido "${id}"`));
    if (dados.requisicoes[0]?.tipo !== "documento") p.push(`${onde}: a primeira requisição é o documento (a página)`);
    for (const r of dados.requisicoes) {
      if (!KEBAB.test(r.id)) p.push(`${onde}: "${r.id}" não está em kebab-case`);
      tamanho(p, `${onde}: nome de "${r.id}"`, r.nome, 28);
      if (!(TIPOS_DE_REQUISICAO as readonly string[]).includes(r.tipo)) p.push(`${onde}: tipo "${r.tipo}" não existe`);
      if (!textoDoStatus(r.status)) p.push(`${onde}: status ${r.status} sem texto (use 200, 304, 404 ou 500)`);
      if (r.inicioMs < 0 || r.duracaoMs <= 0 || r.tamanhoKb < 0) p.push(`${onde}: tempos e tamanho de "${r.id}" fora do lugar`);
    }
    return p;
  },
  ler: (valor) => ({ tipo: "aba-rede", gravado: valor.gravado === true, escolhida: typeof valor.escolhida === "string" ? valor.escolhida : null, ordem: valor.ordem === "tempo" ? "tempo" : "chegada" }),
  cabe: (dados, estado) => estado.escolhida === null || dados.requisicoes.some((r) => r.id === estado.escolhida),
  resumo: (dados, estado) => `${dados.titulo}: ${estado.gravado ? `${dados.requisicoes.length} requisições gravadas${estado.escolhida ? `, ${estado.escolhida} aberta` : ""}` : "nada gravado"}`,
};
