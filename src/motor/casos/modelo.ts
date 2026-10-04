/*
 * Os casos de teste do aluno (área "testes" de uma fase composta): ele
 * escreve exemplos (a entrada e a saída esperada) e roda contra a própria
 * função. Cada caso mostra se passou ou falhou e o que veio de fato. É a
 * semente dos testes automatizados do Ofício.
 *
 * Puro (sem React): a tela (useCasos), a simulação dos testes e o validador
 * `casosDoAluno` usam as mesmas funções. Rodar os casos é do executor (a
 * sessão do navegador ou o núcleo síncrono dos testes).
 */
import type { CasoFuncao, ResultadoTesteFuncao, ValorEsperado } from "../executor/tipos";
import { textoDoEsperado, textoPrevia } from "../executor/formatar";
import { lerArgumentos, lerValor, valoresIguais } from "./literal";

/** A configuração da área testes na fase. */
export type DadosCasos = {
  /** A função global do aluno que os casos chamam (a do Snippet). */
  funcao: string;
  /** Os nomes dos parâmetros, para o rótulo da entrada: media(notas). */
  parametros: string[];
  /** Exemplos que já vêm escritos (opcional): o aluno completa com os dele. */
  inicial?: { entrada: string; esperado: string }[];
};

/** Um caso como o aluno escreveu (texto), com um id estável na lista. */
export type CasoDoAluno = { id: number; entrada: string; esperado: string };

/** O resultado de um caso na última vez que os casos rodaram (o que veio, em texto do Console). */
export type ResultadoCaso = { passou: boolean; obtido: string | null; erro: string | null };

export type EstadoCasos = {
  casos: CasoDoAluno[];
  /** Pelo id do caso. Mudar um caso apaga o resultado dele (precisa rodar de novo). */
  resultados: Record<number, ResultadoCaso>;
  /** Os casos já rodaram alguma vez (ao voltar para a fase, rodam de novo em silêncio). */
  rodou: boolean;
};

/** No máximo tantos casos (cabe na tela do celular e no contexto do tutor). */
export const MAXIMO_CASOS = 12;
/** Tamanho máximo de cada campo. */
export const MAXIMO_TEXTO_CASO = 200;

export function estadoInicialCasos(dados: DadosCasos): EstadoCasos {
  return { casos: (dados.inicial ?? []).map((caso, i) => ({ id: i + 1, ...caso })), resultados: {}, rodou: false };
}

const proximoId = (estado: EstadoCasos) => estado.casos.reduce((maior, caso) => Math.max(maior, caso.id), 0) + 1;

export function adicionarCaso(estado: EstadoCasos, entrada: string, esperado: string): EstadoCasos {
  if (estado.casos.length >= MAXIMO_CASOS) return estado;
  const caso = { id: proximoId(estado), entrada: entrada.slice(0, MAXIMO_TEXTO_CASO), esperado: esperado.slice(0, MAXIMO_TEXTO_CASO) };
  return { ...estado, casos: [...estado.casos, caso] };
}

export function editarCaso(estado: EstadoCasos, id: number, mudanca: Partial<Pick<CasoDoAluno, "entrada" | "esperado">>): EstadoCasos {
  const resultados = { ...estado.resultados };
  delete resultados[id];
  return {
    ...estado,
    casos: estado.casos.map((caso) =>
      caso.id === id
        ? { ...caso, ...(mudanca.entrada !== undefined ? { entrada: mudanca.entrada.slice(0, MAXIMO_TEXTO_CASO) } : {}), ...(mudanca.esperado !== undefined ? { esperado: mudanca.esperado.slice(0, MAXIMO_TEXTO_CASO) } : {}) }
        : caso,
    ),
    resultados,
  };
}

export function apagarCaso(estado: EstadoCasos, id: number): EstadoCasos {
  const resultados = { ...estado.resultados };
  delete resultados[id];
  return { ...estado, casos: estado.casos.filter((caso) => caso.id !== id), resultados };
}

/** O caso lido como valores (ou o motivo de não dar para ler). */
export type CasoLido = { ok: true; args: ValorEsperado[]; esperado: ValorEsperado } | { ok: false; motivo: string };

export function lerCaso(caso: Pick<CasoDoAluno, "entrada" | "esperado">): CasoLido {
  const args = lerArgumentos(caso.entrada);
  if (!args.ok) return { ok: false, motivo: `entrada: ${args.motivo}` };
  const esperado = lerValor(caso.esperado);
  if (!esperado.ok) return { ok: false, motivo: `saída esperada: ${esperado.motivo}` };
  return { ok: true, args: args.valor, esperado: esperado.valor };
}

/** Os casos que dá para rodar (lidos), com o id, na ordem da lista. */
export function casosParaRodar(estado: EstadoCasos): { id: number; caso: CasoFuncao }[] {
  return estado.casos.flatMap((caso) => {
    const lido = lerCaso(caso);
    return lido.ok ? [{ id: caso.id, caso: { args: lido.args, esperado: lido.esperado } }] : [];
  });
}

/**
 * Junta o resultado do executor (testarFuncao) com os casos: o que veio,
 * em texto do Console, e o erro, quando a função quebrou. `erroDoCodigo`:
 * o código deu erro antes de chegar na função (todos os casos falham com ele).
 */
export function resultadosDaRodada(
  estado: EstadoCasos,
  dados: DadosCasos,
  rodados: readonly { id: number }[],
  teste: ResultadoTesteFuncao | null,
  erroDoCodigo: string | null,
): EstadoCasos {
  const resultados: Record<number, ResultadoCaso> = {};
  rodados.forEach(({ id }, i) => {
    if (erroDoCodigo) {
      resultados[id] = { passou: false, obtido: null, erro: `o código deu erro antes: ${erroDoCodigo}` };
      return;
    }
    if (!teste?.existe) {
      resultados[id] = { passou: false, obtido: null, erro: `não existe a função ${dados.funcao} (escreva e rode o código)` };
      return;
    }
    const caso = teste.casos[i];
    if (!caso) return;
    resultados[id] = {
      passou: caso.passou,
      obtido: caso.obtido ? textoPrevia(caso.obtido) : null,
      erro: caso.erro ? `${caso.erro.nome ? `${caso.erro.nome}: ` : ""}${caso.erro.mensagem}` : null,
    };
  });
  return { ...estado, resultados, rodou: true };
}

/** Um caso de borda que a fase exige (no validador casosDoAluno): pelos argumentos, pela saída, ou pelos dois. */
export type CasoExigido = { args?: ValorEsperado[]; esperado?: ValorEsperado; rotulo?: string };

export function casaComExigido(lido: { args: ValorEsperado[]; esperado: ValorEsperado }, exigido: CasoExigido): boolean {
  if (exigido.args !== undefined && !valoresIguais(lido.args, exigido.args)) return false;
  if (exigido.esperado !== undefined && !valoresIguais(lido.esperado, exigido.esperado)) return false;
  return true;
}

/** Como o caso exigido aparece nas mensagens: o rótulo, ou a chamada e a saída. */
export function textoDoExigido(dados: DadosCasos | null, exigido: CasoExigido): string {
  if (exigido.rotulo) return exigido.rotulo;
  const chamada = exigido.args ? `${dados?.funcao ?? "f"}(${exigido.args.map(textoDoEsperado).join(", ")})` : null;
  const saida = exigido.esperado !== undefined ? `saída ${textoDoEsperado(exigido.esperado)}` : null;
  return [chamada, saida].filter(Boolean).join(" com ");
}
