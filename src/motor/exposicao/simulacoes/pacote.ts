/*
 * Mandar um pacote pelo caminho (sala 5): o mapa do próprio jogo, com as
 * ilhas no oceano, e os cabos que ligam tudo, inclusive os SUBMARINOS (a
 * internet é física: quase todo o tráfego entre continentes passa por
 * cabos no fundo do mar). O aluno leva o pacote de roteador em roteador,
 * da casa até o servidor; um cabo partido obriga a achar outro caminho.
 *
 * Comandos: "pular:<no>" (para um vizinho ligado por cabo inteiro),
 * "voltar", "recomecar".
 * Marcos: "chegou:<no>", "entregue", "atravessou-oceano".
 */
import { KEBAB, repetidos, tamanho, textos } from "../comum";
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export const FIGURAS_DO_MAPA = ["casa", "roteador", "servidor", "estacao-cabo"] as const;

export type NoDoMapa = {
  id: string;
  nome: string;
  figura: (typeof FIGURAS_DO_MAPA)[number];
  /** Posição no mapa, de 0 a 100 nos dois eixos. */
  x: number;
  y: number;
};

export type CaboDoMapa = { de: string; para: string; submarino?: boolean; partido?: boolean };

/** Uma ilha do jogo desenhada no mapa (só cenário): o nome e onde fica. */
export type IlhaDoMapa = { nome: string; x: number; y: number; raio: number };

export type EstacaoPacote = {
  id: string;
  tipo: "pacote";
  titulo: string;
  ilhas: IlhaDoMapa[];
  nos: NoDoMapa[];
  cabos: CaboDoMapa[];
  origem: string;
  destino: string;
};

export type EstadoPacote = { tipo: "pacote"; caminho: string[]; entregue: boolean };

export function caboEntre(dados: EstacaoPacote, a: string, b: string): CaboDoMapa | undefined {
  return dados.cabos.find((c) => (c.de === a && c.para === b) || (c.de === b && c.para === a));
}

/** Os vizinhos de agora (ligados por cabo inteiro, fora do caminho já andado). */
export function vizinhos(dados: EstacaoPacote, estado: EstadoPacote): string[] {
  const aqui = estado.caminho[estado.caminho.length - 1];
  return dados.nos.filter((n) => n.id !== aqui && !estado.caminho.includes(n.id) && caboEntre(dados, aqui, n.id) && !caboEntre(dados, aqui, n.id)?.partido).map((n) => n.id);
}

function existeCaminho(dados: EstacaoPacote): boolean {
  const vistos = new Set([dados.origem]);
  const fila = [dados.origem];
  while (fila.length) {
    const aqui = fila.shift() as string;
    if (aqui === dados.destino) return true;
    for (const cabo of dados.cabos) {
      if (cabo.partido) continue;
      const outro = cabo.de === aqui ? cabo.para : cabo.para === aqui ? cabo.de : null;
      if (outro && !vistos.has(outro)) {
        vistos.add(outro);
        fila.push(outro);
      }
    }
  }
  return false;
}

export const PACOTE: ModeloSimulacao<EstacaoPacote, EstadoPacote> = {
  inicial: (dados) => ({ tipo: "pacote", caminho: [dados.origem], entregue: false }),
  comando(dados, estado, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (verbo === "recomecar") return estado.caminho.length > 1 ? { tipo: "pacote", caminho: [dados.origem], entregue: false } : null;
    if (verbo === "voltar") return estado.caminho.length > 1 && !estado.entregue ? { ...estado, caminho: estado.caminho.slice(0, -1) } : null;
    if (verbo === "pular") {
      if (estado.entregue || !vizinhos(dados, estado).includes(resto)) return null;
      return { tipo: "pacote", caminho: [...estado.caminho, resto], entregue: resto === dados.destino };
    }
    return null;
  },
  marcos(dados, estado) {
    const marcos = estado.caminho.map((id) => `chegou:${id}`);
    if (estado.entregue) marcos.push("entregue");
    if (estado.caminho.some((id, i) => i > 0 && caboEntre(dados, estado.caminho[i - 1], id)?.submarino)) marcos.push("atravessou-oceano");
    return marcos;
  },
  marcoPossivel(dados, marco) {
    const [verbo, resto] = partesDoComando(marco);
    if (marco === "entregue" || marco === "atravessou-oceano") return true;
    return verbo === "chegou" && dados.nos.some((n) => n.id === resto);
  },
  comandoPossivel(dados, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (comando === "voltar" || comando === "recomecar") return true;
    return verbo === "pular" && dados.nos.some((n) => n.id === resto);
  },
  conferir(dados, onde) {
    const p: string[] = [];
    if (dados.nos.length < 3 || dados.nos.length > 12) p.push(`${onde}: ${dados.nos.length} pontos no mapa (de 3 a 12)`);
    p.push(...repetidos(dados.nos.map((n) => n.id)).map((id) => `${onde}: ponto com id repetido "${id}"`));
    for (const n of dados.nos) {
      if (!KEBAB.test(n.id)) p.push(`${onde}: o ponto "${n.id}" não está em kebab-case`);
      tamanho(p, `${onde}: nome de "${n.id}"`, n.nome, 24);
      if (n.x < 0 || n.x > 100 || n.y < 0 || n.y > 100) p.push(`${onde}: "${n.id}" fora do mapa (0 a 100)`);
    }
    const ids = new Set(dados.nos.map((n) => n.id));
    for (const cabo of dados.cabos) if (!ids.has(cabo.de) || !ids.has(cabo.para)) p.push(`${onde}: cabo ${cabo.de}-${cabo.para} liga um ponto que não existe`);
    if (!ids.has(dados.origem) || !ids.has(dados.destino)) p.push(`${onde}: origem ou destino não existe`);
    else if (!existeCaminho(dados)) p.push(`${onde}: não tem caminho inteiro da origem ao destino`);
    for (const ilha of dados.ilhas) tamanho(p, `${onde}: nome de ilha`, ilha.nome, 20);
    return p;
  },
  ler: (valor) => ({ tipo: "pacote", caminho: textos(valor.caminho, 12), entregue: valor.entregue === true }),
  cabe(dados, estado) {
    if (estado.caminho[0] !== dados.origem) return false;
    return estado.caminho.every((id, i) => i === 0 || (caboEntre(dados, estado.caminho[i - 1], id) && !caboEntre(dados, estado.caminho[i - 1], id)?.partido));
  },
  resumo: (dados, estado) => `${dados.titulo}: ${estado.caminho.join(" > ")}${estado.entregue ? " (entregue)" : ""}`,
};
