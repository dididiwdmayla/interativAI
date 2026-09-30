/*
 * O plano do palco da memória: transforma uma foto da memória (o rastro do
 * executor) no que a tela desenha. Regra para quem nunca programou:
 * - variável com valor simples: a caixinha mostra o valor;
 * - lista e objeto aparecem DENTRO da caixinha da primeira variável que
 *   aponta para eles (vagões numerados e ficha de chave e valor);
 * - se outra variável (ou um item) aponta para a MESMA lista, ela não ganha
 *   uma cópia: mostra uma seta até onde a lista foi desenhada. É assim que
 *   o jogador vê que `let b = a` não copia a lista.
 * Puro (sem React), testado em testes/conteudo/palco.test.ts.
 */
import type { FotoMemoria, TipoDeclaracao, ValorMemoria } from "./executor/tipos";

export type NoPalco =
  | { t: "primitivo"; valor: Exclude<ValorMemoria, { t: "ref" }> }
  | { t: "lista"; id: number; itens: NoPalco[]; tamanho: number }
  | { t: "ficha"; id: number; classe: string | null; campos: [string, NoPalco][] }
  | { t: "mapa"; id: number; entradas: [NoPalco, NoPalco][] }
  | { t: "conjunto"; id: number; itens: NoPalco[] }
  | { t: "texto"; id: number; texto: string }
  /** Já desenhado em outro lugar: a seta aponta para lá. `dono` é o caminho ("a", "lista[0]"). */
  | { t: "ponteiro"; id: number; dono: string; forma: "lista" | "objeto" }
  /** Fora do que o executor copiou (memória grande demais). */
  | { t: "ausente"; id: number };

export type VariavelPalco = {
  /** Chave estável entre passos (para animar o que mudou). */
  chave: string;
  nome: string;
  declaracao: TipoDeclaracao;
  valor: NoPalco;
  /** Texto do valor, para comparar com o passo anterior. */
  assinatura: string;
};

export type EscopoPalco = { id: string; tipo: "global" | "funcao" | "bloco"; variaveis: VariavelPalco[] };

export type QuadroPalco = { chave: string; nome: string; chamada: number; escopos: EscopoPalco[] };

export type PlanoPalco = { quadros: QuadroPalco[]; setas: number };

const PROFUNDIDADE = 6;

export function planoDoPalco(foto: FotoMemoria | null): PlanoPalco {
  if (!foto) return { quadros: [], setas: 0 };
  const desenhados = new Map<number, string>();
  let setas = 0;

  const resolver = (valor: ValorMemoria, caminho: string, profundidade: number): NoPalco => {
    if (valor.t !== "ref") return { t: "primitivo", valor };
    const dono = desenhados.get(valor.id);
    if (dono !== undefined) {
      setas += 1;
      return { t: "ponteiro", id: valor.id, dono, forma: foto.monte[String(valor.id)]?.t === "array" ? "lista" : "objeto" };
    }
    const objeto = foto.monte[String(valor.id)];
    if (!objeto || profundidade <= 0) return { t: "ausente", id: valor.id };
    desenhados.set(valor.id, caminho);
    switch (objeto.t) {
      case "array":
        return { t: "lista", id: valor.id, tamanho: objeto.tamanho, itens: objeto.itens.map((item, i) => resolver(item, `${caminho}[${i}]`, profundidade - 1)) };
      case "objeto":
        return {
          t: "ficha",
          id: valor.id,
          classe: objeto.classe && objeto.classe !== "Object" ? objeto.classe : null,
          campos: objeto.entradas.map(([chave, v]) => [chave, resolver(v, `${caminho}.${chave}`, profundidade - 1)] as [string, NoPalco]),
        };
      case "map":
        return {
          t: "mapa",
          id: valor.id,
          entradas: objeto.entradas.map(([k, v], i) => [resolver(k, `${caminho} chave ${i}`, profundidade - 1), resolver(v, `${caminho}.get()`, profundidade - 1)] as [NoPalco, NoPalco]),
        };
      case "set":
        return { t: "conjunto", id: valor.id, itens: objeto.itens.map((item, i) => resolver(item, `${caminho} item ${i}`, profundidade - 1)) };
      case "erro":
        return { t: "texto", id: valor.id, texto: `${objeto.nome}: ${objeto.mensagem}` };
      case "data":
        return { t: "texto", id: valor.id, texto: objeto.texto };
    }
  };

  const quadros = foto.quadros.map((quadro) => ({
    chave: `${quadro.nome}#${quadro.chamada}`,
    nome: quadro.nome,
    chamada: quadro.chamada,
    escopos: quadro.escopos.map((escopo) => ({
      id: escopo.id,
      tipo: escopo.tipo,
      variaveis: escopo.variaveis.map((variavel) => {
        const valor = resolver(variavel.valor, variavel.nome, PROFUNDIDADE);
        return {
          chave: `${quadro.chamada}:${escopo.id}:${variavel.nome}`,
          nome: variavel.nome,
          declaracao: variavel.declaracao,
          valor,
          assinatura: assinar(valor),
        };
      }),
    })),
  }));
  return { quadros, setas };
}

/** Texto que muda quando o valor muda (inclusive dentro da lista), para piscar a caixinha. */
export function assinar(no: NoPalco): string {
  switch (no.t) {
    case "primitivo":
      return JSON.stringify(no.valor);
    case "lista":
      return `[${no.itens.map(assinar).join(",")}]#${no.tamanho}`;
    case "ficha":
      return `{${no.campos.map(([k, v]) => `${k}:${assinar(v)}`).join(",")}}`;
    case "mapa":
      return `M{${no.entradas.map(([k, v]) => `${assinar(k)}=>${assinar(v)}`).join(",")}}`;
    case "conjunto":
      return `S{${no.itens.map(assinar).join(",")}}`;
    case "texto":
      return `T:${no.texto}`;
    case "ponteiro":
      return `->${no.id}`;
    case "ausente":
      return "?";
  }
}

/** O que mudou de uma foto para a outra: caixinhas novas e caixinhas com valor diferente. */
export function mudancasDoPalco(atual: PlanoPalco, anterior: PlanoPalco | null): { novas: Set<string>; mudaram: Set<string> } {
  const antes = new Map<string, string>();
  for (const quadro of anterior?.quadros ?? []) for (const escopo of quadro.escopos) for (const v of escopo.variaveis) antes.set(v.chave, v.assinatura);
  const novas = new Set<string>();
  const mudaram = new Set<string>();
  if (!anterior) return { novas, mudaram };
  for (const quadro of atual.quadros) {
    for (const escopo of quadro.escopos) {
      for (const v of escopo.variaveis) {
        const assinatura = antes.get(v.chave);
        if (assinatura === undefined) novas.add(v.chave);
        else if (assinatura !== v.assinatura) mudaram.add(v.chave);
      }
    }
  }
  return { novas, mudaram };
}

export type TipoNoPalco = "texto" | "numero" | "booleano" | "undefined" | "null" | "lista" | "objeto" | "funcao" | "outro";

/** O tipo do valor, para a cor e a plaquinha da caixinha. */
export function tipoDoNo(no: NoPalco): TipoNoPalco {
  if (no.t === "primitivo") {
    switch (no.valor.t) {
      case "string":
        return "texto";
      case "number":
      case "bigint":
        return "numero";
      case "boolean":
        return "booleano";
      case "undefined":
        return "undefined";
      case "null":
        return "null";
      case "funcao":
        return "funcao";
      default:
        return "outro";
    }
  }
  if (no.t === "lista") return "lista";
  if (no.t === "ponteiro") return no.forma;
  if (no.t === "ficha" || no.t === "mapa" || no.t === "conjunto") return "objeto";
  return "outro";
}

export const NOME_DO_TIPO: Record<TipoNoPalco, string> = {
  texto: "texto",
  numero: "número",
  booleano: "booleano",
  undefined: "undefined",
  null: "null",
  lista: "lista",
  objeto: "objeto",
  funcao: "função",
  outro: "valor",
};
