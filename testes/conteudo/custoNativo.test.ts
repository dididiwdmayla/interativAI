/*
 * O custo escondido dos métodos nativos (src/motor/executor/custoNativo.ts):
 * cada método soma os passos do trabalho que faz por dentro, à parte dos
 * passos do código do jogador. O gráfico de Desempenho usa o total.
 */
import { describe, expect, it } from "vitest";
import { criarNucleoNode } from "@/motor/executor/node";
import { custoDeOrdenar, metodosQueMaisPesaram } from "@/motor/executor/custoNativo";
import { chamadasDaMedicao } from "@/motor/desempenho";
import { criarSimulacao } from "@/motor/simulacao";
import { FASE_DEMO_CUSTO_BUSCA, FASE_DEMO_CUSTO_SHIFT } from "@/conteudo/laboratorio/bancadaLogica";

/** Roda o código e devolve os passos do código e os escondidos de cada método. */
function rodar(codigo: string) {
  const nucleo = criarNucleoNode({ deterministico: true });
  const r = nucleo.executar(codigo, "snippet");
  expect(r.erro).toBeNull();
  return { passos: r.totalPassos, escondidos: r.passosEscondidos, por: r.escondidosPorMetodo, resultado: r };
}

/** Os escondidos da última linha (as anteriores só preparam a lista, sem custo). */
function escondidosDe(preparo: string, linha: string) {
  return rodar(`${preparo}\n${linha}`).escondidos;
}

const DEZ = "const l = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];";

describe("custo escondido: listas", () => {
  it("shift e unshift movem todos os itens", () => {
    expect(escondidosDe(DEZ, "l.shift();")).toBe(10);
    expect(escondidosDe(DEZ, "l.unshift(0);")).toBe(11);
    expect(escondidosDe(DEZ, "l.unshift(0, -1);")).toBe(12);
    expect(escondidosDe("const l = [];", "l.shift();")).toBe(0);
  });

  it("splice: os movidos depois da posição, mais inseridos e removidos", () => {
    // Remove 2 na posição 3: 5 movidos + 2 removidos.
    expect(escondidosDe(DEZ, "l.splice(3, 2);")).toBe(7);
    // Insere 1 na posição 8 sem remover: 2 movidos + 1 inserido.
    expect(escondidosDe(DEZ, 'l.splice(8, 0, "x");')).toBe(3);
    // Posição negativa conta do fim.
    expect(escondidosDe(DEZ, "l.splice(-1, 1);")).toBe(1);
    expect(escondidosDe(DEZ, "l.splice();")).toBe(0);
  });

  it("indexOf, includes e lastIndexOf: examinados até achar, ou todos", () => {
    expect(escondidosDe(DEZ, "l.indexOf(3);")).toBe(3);
    expect(escondidosDe(DEZ, "l.indexOf(99);")).toBe(10);
    expect(escondidosDe(DEZ, "l.includes(1);")).toBe(1);
    expect(escondidosDe(DEZ, "l.includes(99);")).toBe(10);
    expect(escondidosDe(DEZ, "l.lastIndexOf(10);")).toBe(1);
    expect(escondidosDe(DEZ, "l.lastIndexOf(99);")).toBe(10);
    expect(escondidosDe("const l = [1, NaN];", "l.includes(NaN);")).toBe(2);
  });

  it("slice, concat, join, reverse e fill: copiados ou percorridos", () => {
    expect(escondidosDe(DEZ, "l.slice(2, 5);")).toBe(3);
    expect(escondidosDe(DEZ, "l.slice();")).toBe(10);
    expect(escondidosDe(DEZ, "l.concat([11, 12]);")).toBe(12);
    expect(escondidosDe(DEZ, 'l.join(",");')).toBe(10);
    expect(escondidosDe(DEZ, "l.reverse();")).toBe(10);
    expect(escondidosDe(DEZ, "l.fill(0, 2, 6);")).toBe(4);
    expect(escondidosDe(DEZ, "l.fill(0);")).toBe(10);
  });

  it("espalhar, Array.from e Object.keys, values e entries", () => {
    expect(escondidosDe(DEZ, "const c = [...l];")).toBe(10);
    expect(escondidosDe(DEZ, "Math.max(...l);")).toBe(10);
    expect(escondidosDe('const o = { a: 1, b: 2, c: 3 };', "const d = { ...o };")).toBe(3);
    expect(escondidosDe('const s = new Set([1, 2, 3]);', "const c = [...s];")).toBe(3 + 3); // new Set([...]) no preparo também percorre 3
    expect(escondidosDe(DEZ, "Array.from(l);")).toBe(10);
    expect(escondidosDe(DEZ, "new Set(l);")).toBe(10);
    expect(escondidosDe(DEZ, "new Map(l.map((x) => [x, true]));")).toBe(20);
    expect(escondidosDe(DEZ, "new Set();")).toBe(0);
    expect(escondidosDe('const o = { a: 1, b: 2, c: 3 };', "Object.keys(o);")).toBe(3);
    expect(escondidosDe('const o = { a: 1, b: 2, c: 3 };', "Object.values(o);")).toBe(3);
    expect(escondidosDe('const o = { a: 1, b: 2, c: 3 };', "Object.entries(o);")).toBe(3);
  });

  it("sort sem comparador: n x log2(n); com comparador, só as chamadas dele (sem contar em dobro)", () => {
    expect(custoDeOrdenar(8)).toBe(24);
    expect(custoDeOrdenar(1)).toBe(0);
    expect(escondidosDe("const l = [5, 3, 8, 1, 9, 2, 7, 4];", "l.sort();")).toBe(24);
    const comComparador = rodar("const l = [5, 3, 8, 1, 9, 2, 7, 4];\nl.sort((a, b) => a - b);");
    expect(comComparador.escondidos).toBe(0);
    // Cada chamada do comparador é um passo do código.
    expect(comComparador.passos).toBeGreaterThan(2 + 7);
  });

  it("map, filter, find, some, every, forEach e reduce: um por item visitado", () => {
    expect(escondidosDe(DEZ, "l.map((x) => x * 2);")).toBe(10);
    expect(escondidosDe(DEZ, "l.filter((x) => x > 5);")).toBe(10);
    expect(escondidosDe(DEZ, "l.forEach((x) => x);")).toBe(10);
    expect(escondidosDe(DEZ, "l.reduce((s, x) => s + x, 0);")).toBe(10);
    expect(escondidosDe(DEZ, "l.find((x) => x === 3);")).toBe(3);
    expect(escondidosDe(DEZ, "l.some((x) => x === 4);")).toBe(4);
    expect(escondidosDe(DEZ, "l.every((x) => x < 3);")).toBe(3);
    expect(escondidosDe(DEZ, "l.findIndex((x) => x === 10);")).toBe(10);
  });

  it("push, pop, índice, Map e Set: sem custo escondido", () => {
    expect(escondidosDe(DEZ, "l.push(11); l.pop(); l[3]; l.length;")).toBe(0);
    expect(escondidosDe("const m = new Map(); const s = new Set();", 'm.set("a", 1); m.get("a"); m.has("a"); m.delete("a"); s.add(1); s.has(1); s.delete(1);')).toBe(0);
    expect(escondidosDe('const o = { a: 1 };', 'o.a; o["a"];')).toBe(0);
  });
});

describe("custo escondido: textos", () => {
  const TEXTO = 'const t = "abcdefghij";';
  it("includes e indexOf até achar; split e replaceAll o texto todo; repeat o que sai", () => {
    expect(escondidosDe(TEXTO, 't.includes("c");')).toBe(3);
    expect(escondidosDe(TEXTO, 't.includes("cd");')).toBe(4);
    expect(escondidosDe(TEXTO, 't.includes("z");')).toBe(10);
    expect(escondidosDe(TEXTO, 't.indexOf("j");')).toBe(10);
    expect(escondidosDe(TEXTO, 't.split("");')).toBe(10);
    expect(escondidosDe(TEXTO, 't.replaceAll("a", "b");')).toBe(10);
    expect(escondidosDe('const t = "ab";', "t.repeat(3);")).toBe(6);
  });
});

describe("custo escondido: o que não muda", () => {
  it("um método de uma classe do jogador conta os passos do próprio código", () => {
    const r = rodar("class Fila { constructor() { this.itens = [1, 2, 3]; } shift() { return this.itens.pop(); } }\nconst f = new Fila();\nf.shift();");
    expect(r.escondidos).toBe(0);
  });

  it("o resultado, o this e os erros continuam os do navegador", () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    const ok = nucleo.executar("const l = [3, 1, 2];\nconst x = l.shift();\nconsole.log(x, l.includes(2), [...l].join('-'));", "snippet");
    expect(ok.saidas.map((s) => s.texto)).toEqual(["3 true '1-2'"]);
    const semMetodo = nucleo.executar("const n = 5;\nn.includes(1);", "snippet");
    expect(semMetodo.erro?.mensagem).toBe("n.includes is not a function");
    expect(semMetodo.erro?.nome).toBe("TypeError");
    const nulo = nucleo.executar("let v = null;\nv.shift();", "snippet");
    expect(nulo.erro?.mensagem).toContain("Cannot read properties of null");
    // O erro dentro do callback nasce na linha do callback.
    const dentro = nucleo.executar("const l = [1];\nl.map((x) => {\n  throw new Error('ops');\n});", "snippet");
    expect(dentro.erro?.mensagem).toBe("ops");
    expect(dentro.erro?.linha).toBe(3);
  });

  it("não cria fotos no rastro nem conta para o limite da execução", () => {
    const codigo = "const l = Array.from({ length: 1000 }, (_, i) => i);\nwhile (l.length) l.shift();";
    const r = rodar(codigo);
    // 1 (const) + 1.001 voltas do while + 1.000 shift na mesma linha = passos do código.
    expect(r.passos).toBeLessThan(2100);
    expect(r.escondidos).toBeGreaterThan(500_000);
    expect(r.resultado.passos.length).toBeLessThanOrEqual(1001);
    expect(r.resultado.rastroCortado).toBe(true);
  });

  it("o método que mais pesou vem primeiro", () => {
    expect(metodosQueMaisPesaram({ shift: 500, includes: 10, map: 0 })).toEqual(["shift", "includes"]);
  });
});

describe("medição do gráfico: o total", () => {
  const CODIGO = [
    "function consumirComShift(lista) {",
    "  while (lista.length) lista.shift();",
    "}",
    "function consumirPorIndice(lista) {",
    "  let inicio = 0;",
    "  while (inicio < lista.length) {",
    "    const item = lista[inicio];",
    "    inicio++;",
    "  }",
    "}",
  ].join("\n");
  const lista = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

  it("shift aparece bem mais caro que a versão por índice numa lista grande", () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    nucleo.executar(CODIGO, "snippet");
    const [shift] = nucleo.medirPassos("consumirComShift", [{ tamanho: 1000, args: [lista(1000)] }]);
    const [indice] = nucleo.medirPassos("consumirPorIndice", [{ tamanho: 1000, args: [lista(1000)] }]);
    expect(shift.escondidos).toBe(500_500);
    expect(shift.passos).toBe(1001 + 500_500);
    expect(indice.escondidos).toBe(0);
    expect(shift.passos).toBeGreaterThan(indice.passos * 100);
  });

  it("os escondidos contam para o limite da medição (travaria)", () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    nucleo.executar(CODIGO, "snippet");
    const [grande] = nucleo.medirPassos("consumirComShift", [{ tamanho: 5000, args: [lista(5000)] }]);
    expect(grande.passouDoLimite).toBe(true);
  });
});

describe("demonstrações do /lab: o gráfico mostra a diferença certa", () => {
  const medir = (fase: typeof FASE_DEMO_CUSTO_SHIFT, codigo?: string) => {
    const nucleo = criarNucleoNode({ deterministico: true });
    nucleo.executar(codigo ?? fase.programa?.snippet?.codigoInicial ?? "", "snippet");
    const config = fase.programa!.desempenho!;
    return config.funcoes.map((f) => nucleo.medirPassos(f.nome, chamadasDaMedicao(config, f)));
  };

  it("f10: shift bem mais caro que a versão por índice, e o orçamento separa os dois", () => {
    const [shift, indice] = medir(FASE_DEMO_CUSTO_SHIFT);
    const ultimoShift = shift[shift.length - 1];
    const ultimoIndice = indice[indice.length - 1];
    expect(ultimoShift.tamanho).toBe(1000);
    expect(ultimoShift.passos).toBeGreaterThan(ultimoIndice.passos * 100);
    expect(ultimoIndice.escondidos).toBe(0);
    const orcamento = 10000;
    expect(orcamento).toBeGreaterThanOrEqual(3 * ultimoIndice.passos);
    expect(orcamento).toBeLessThanOrEqual(ultimoShift.passos / 10);
  });

  it("f11: includes bem mais caro que Map.has, e o orçamento separa os dois", () => {
    const [lista, mapa] = medir(FASE_DEMO_CUSTO_BUSCA);
    const ultimaLista = lista[lista.length - 1];
    const ultimoMapa = mapa[mapa.length - 1];
    expect(ultimaLista.passos).toBeGreaterThan(ultimoMapa.passos * 50);
    expect(ultimoMapa.escondidos).toBe(0);
    const orcamento = 20000;
    expect(orcamento).toBeGreaterThanOrEqual(3 * ultimoMapa.passos);
    expect(orcamento).toBeLessThanOrEqual(ultimaLista.passos / 10);
  });

  it("as fases das demonstrações fecham com as soluções de teste", () => {
    for (const fase of [FASE_DEMO_CUSTO_SHIFT, FASE_DEMO_CUSTO_BUSCA]) {
      const sim = criarSimulacao(fase);
      for (const objetivo of fase.objetivos) {
        sim.executar(objetivo.solucaoDeTeste ?? []);
        expect(sim.avaliar(objetivo.validador).passou, `${fase.id} ${objetivo.id}`).toBe(true);
      }
    }
  });

  it("a solução ingênua não passa no último objetivo", () => {
    for (const fase of [FASE_DEMO_CUSTO_SHIFT, FASE_DEMO_CUSTO_BUSCA]) {
      const sim = criarSimulacao(fase);
      sim.executar([{ tipo: "executarSnippet" }]);
      expect(sim.avaliar(fase.objetivos[2].validador).passou, fase.id).toBe(false);
    }
  });
});
