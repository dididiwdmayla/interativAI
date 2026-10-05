/*
 * Fases de programa (Ilha Lógica): o que o motor de fases precisa saber do
 * executor (src/motor/executor). O estado de uma fase de programa é a
 * sessão do executor: a memória depois da última execução, os resultados
 * dos testes de função e, nos eventos, o resumo de cada execução.
 */
import type { Fase, SiteAlvo, Validador } from "@/conteudo/tipos";
import type { SintaxeJs } from "./executor/instrumentar";
import type { ErroExecucao, FotoMemoria, MedicaoPassos, OrigemCodigo, ResultadoExecucao, ResultadoTesteFuncao, ValorEsperado, ValorExibido, ValorMemoria } from "./executor/tipos";
import { type ContagemEstrutura, contarEstruturas } from "./estruturas";
import { chamadasDaMedicao, chaveMedicao } from "./desempenho";
import type { RastroCena } from "./cena/modelo";

/**
 * O site-alvo de uma fase de programa: não tem página (a tela é o palco da
 * memória). O formato pede um, e este é vazio.
 */
export const SITE_DO_PROGRAMA: SiteAlvo = {
  url: "console",
  titulo: "Palco da memória",
  head: "",
  body: "",
};

/** O que fica no evento `executouCodigo` (o suficiente para os validadores). */
export type ResumoExecucao = {
  origem: OrigemCodigo;
  codigo: string;
  /** As linhas do console, no texto do Chrome (sem as de console.clear). */
  saidas: string[];
  erro: Pick<ErroExecucao, "tipo" | "nome" | "mensagem" | "linha"> | null;
  sintaxes: SintaxeJs[];
  /** A resposta do Console (a última expressão), só nas entradas do Console que não deram erro. */
  resposta: ValorExibido | null;
  /** Quantos passos o programa deu (o contador do palco e o validador passosNoMaximo). */
  totalPassos: number;
  /** Os passos escondidos dos métodos nativos (eventos antigos, salvos antes deles, não têm). */
  passosEscondidos?: number;
  /** Por lista global: quantos itens entraram e saíram por cada lado (pilha ou fila). */
  estruturas: Record<string, ContagemEstrutura>;
};

/** O que os validadores de código olham além dos eventos. */
export type EstadoPrograma = {
  /** A memória depois da última execução (null: nada rodou ainda). */
  memoria: FotoMemoria | null;
  /** Resultado de cada `funcaoPassa` da fase, pela chave (`chaveFuncaoPassa`). */
  testes: Record<string, ResultadoTesteFuncao>;
  /** (Depurador) Os pontos de parada (linhas do Snippet) e as expressões do painel Observar de agora. */
  depurador?: { pontos: readonly number[]; observacoes: readonly string[] };
  /** (Desempenho) As medições dos `passosNoMaximo` com tamanho, pela chave (`chaveMedicao`). */
  medicoes?: Record<string, MedicaoPassos>;
  /** (Cena programável) A simulação de agora (desde o último Executar, com o que o Console fez depois). */
  cena?: RastroCena | null;
  /** (Cena, variosCenarios) A mesma simulação com outras linhas do tempo, na última vez que o Snippet rodou. */
  cenarios?: Record<string, RastroCena>;
};

export function faseDePrograma(fase: Fase): boolean {
  return fase.programa !== undefined;
}

export function resumirExecucao(resultado: ResultadoExecucao): ResumoExecucao {
  return {
    origem: resultado.origem,
    codigo: resultado.codigo,
    saidas: resultado.saidas.filter((saida) => !saida.limpar).map((saida) => saida.texto),
    erro: resultado.erro ? { tipo: resultado.erro.tipo, nome: resultado.erro.nome, mensagem: resultado.erro.mensagem, linha: resultado.erro.linha } : null,
    sintaxes: resultado.sintaxes,
    resposta: resultado.origem === "console" && !resultado.erro ? resultado.resultado : null,
    totalPassos: resultado.totalPassos,
    passosEscondidos: resultado.passosEscondidos,
    estruturas: contarEstruturas(resultado.passos, resultado.memoriaFinal),
  };
}

/**
 * As medições que os `passosNoMaximo` com tamanho da fase pedem: a função
 * (a do validador, ou a primeira do `programa.desempenho`) e o tamanho, com
 * os argumentos que o gráfico usaria.
 */
export function medicoesDaFase(fase: Fase): { chave: string; funcao: string; tamanho: number; args: ValorEsperado[] }[] {
  const config = fase.programa?.desempenho;
  const raizes: Validador[] =
    fase.tipo === "desafio" ? fase.partes.map((p) => p.validador) : fase.tipo === "projeto-ponte" ? fase.requisitos.map((r) => r.validador) : fase.objetivos.map((o) => o.validador);
  const pedidas = new Map<string, { chave: string; funcao: string; tamanho: number; args: ValorEsperado[] }>();
  for (const v of raizes.flatMap(validadoresDentro)) {
    if (v.tipo !== "passosNoMaximo" || v.tamanho === undefined || !config) continue;
    const funcao = config.funcoes.find((f) => f.nome === (v.funcao ?? config.funcoes[0]?.nome));
    if (!funcao) continue;
    const [chamada] = chamadasDaMedicao(config, funcao, [v.tamanho]);
    // A chave é a do validador: sem `funcao`, a primeira do desempenho ("" na chave).
    const chave = chaveMedicao(v.funcao ?? "", v.tamanho);
    pedidas.set(chave, { chave, funcao: funcao.nome, tamanho: v.tamanho, args: chamada.args });
  }
  return [...pedidas.values()];
}

export function chaveFuncaoPassa(validador: Extract<Validador, { tipo: "funcaoPassa" }>): string {
  return `${validador.nome}:${JSON.stringify(validador.casos)}`;
}

/** Todos os validadores de uma árvore (todos, algum, nao). */
export function validadoresDentro(validador: Validador): Validador[] {
  if (validador.tipo === "todos" || validador.tipo === "algum") return [validador, ...validador.validadores.flatMap(validadoresDentro)];
  if (validador.tipo === "nao") return [validador, ...validadoresDentro(validador.validador)];
  if (validador.tipo === "variosCenarios") return [validador, ...validadoresDentro(validador.validador), ...(validador.porLinha ?? []).flatMap(validadoresDentro)];
  return [validador];
}

/** Os `funcaoPassa` de uma fase (objetivos, partes e requisitos), sem repetir. */
export function testesDeFuncaoDaFase(fase: Fase): Extract<Validador, { tipo: "funcaoPassa" }>[] {
  const raizes: Validador[] =
    fase.tipo === "desafio" ? fase.partes.map((p) => p.validador) : fase.tipo === "projeto-ponte" ? fase.requisitos.map((r) => r.validador) : fase.objetivos.map((o) => o.validador);
  const vistos = new Set<string>();
  const lista: Extract<Validador, { tipo: "funcaoPassa" }>[] = [];
  for (const v of raizes.flatMap(validadoresDentro)) {
    if (v.tipo !== "funcaoPassa") continue;
    const chave = chaveFuncaoPassa(v);
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    lista.push(v);
  }
  return lista;
}

/** Um valor da memória como árvore (para comparar com o esperado de `valorVariavel`). */
export function memoriaParaExibido(valor: ValorMemoria, monte: FotoMemoria["monte"], profundidade = 8, vistos: number[] = []): ValorExibido {
  if (valor.t === "funcao") return { t: "funcao", nome: valor.nome, texto: "", seta: valor.seta };
  if (valor.t !== "ref") return valor;
  const objeto = monte[String(valor.id)];
  if (!objeto || profundidade <= 0 || vistos.includes(valor.id)) return { t: "fundo", resumo: "{…}" };
  const dentro = [...vistos, valor.id];
  const filho = (v: ValorMemoria) => memoriaParaExibido(v, monte, profundidade - 1, dentro);
  switch (objeto.t) {
    case "array":
      return { t: "array", itens: objeto.itens.map(filho), tamanho: objeto.tamanho, ...(objeto.itens.length < objeto.tamanho ? { cortado: true as const } : {}) };
    case "objeto":
      return { t: "objeto", classe: objeto.classe, entradas: objeto.entradas.map(([k, v]) => [k, filho(v)] as [string, ValorExibido]) };
    case "map":
      return { t: "map", entradas: objeto.entradas.map(([k, v]) => [filho(k), filho(v)] as [ValorExibido, ValorExibido]), tamanho: objeto.entradas.length };
    case "set":
      return { t: "set", itens: objeto.itens.map(filho), tamanho: objeto.itens.length };
    case "erro":
      return { t: "erro", nome: objeto.nome, mensagem: objeto.mensagem };
    case "data":
      return { t: "data", texto: objeto.texto };
  }
}

/** A variável global `nome` na memória (null: não existe). */
export function variavelGlobal(memoria: FotoMemoria | null, nome: string): ValorExibido | null {
  const global = memoria?.quadros[0]?.escopos.find((escopo) => escopo.tipo === "global");
  const variavel = global?.variaveis.find((v) => v.nome === nome);
  return variavel && memoria ? memoriaParaExibido(variavel.valor, memoria.monte) : null;
}
