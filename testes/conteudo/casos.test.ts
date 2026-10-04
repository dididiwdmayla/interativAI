/*
 * Casos de teste do aluno (área testes de uma fase composta,
 * src/motor/casos): o que ele escreve vira valores (sem rodar nada), os
 * casos rodam contra a função do Snippet, o validador casosDoAluno conta os
 * casos e os de borda exigidos, e tudo fica salvo no progresso.
 */
import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASE_DEMO_RESOLVER, CODIGO_MEDIA } from "@/conteudo/laboratorio/bancadaResolver";
import type { Fase } from "@/conteudo/tipos";
import { lerArgumentos, lerValor, valoresIguais } from "@/motor/casos/literal";
import { adicionarCaso, apagarCaso, casaComExigido, editarCaso, estadoInicialCasos, lerCaso, MAXIMO_CASOS } from "@/motor/casos/modelo";
import { criarSimulacao } from "@/motor/simulacao";
import { normalizarProgresso } from "@/lib/progresso";

describe("casos de teste: o que o aluno escreve", () => {
  it("lê a entrada como os argumentos de uma chamada", () => {
    expect(lerArgumentos("[8, 6]")).toEqual({ ok: true, valor: [[8, 6]] });
    expect(lerArgumentos("10, 7")).toEqual({ ok: true, valor: [10, 7] });
    expect(lerArgumentos("")).toEqual({ ok: true, valor: [] });
    expect(lerArgumentos("'Ana', -2.5, true, null, { nome: \"Bia\", 'idade': 9 }")).toEqual({ ok: true, valor: ["Ana", -2.5, true, null, { nome: "Bia", idade: 9 }] });
    expect(lerArgumentos("[[1, 2], []]")).toEqual({ ok: true, valor: [[[1, 2], []]] });
    expect(lerArgumentos("`oi`")).toEqual({ ok: true, valor: ["oi"] });
  });

  it("recusa o que não é valor pronto, dizendo por quê", () => {
    const motivo = (texto: string) => {
      const lido = lerArgumentos(texto);
      return lido.ok ? "" : lido.motivo;
    };
    expect(motivo("Ana")).toContain('texto vai entre aspas ("Ana")');
    expect(motivo("2 + 3")).toContain("escreva o valor pronto");
    expect(motivo("undefined")).toContain("use null");
    expect(motivo("[1,, 2]")).toContain("buraco");
    expect(motivo("[1, 2")).toContain("não deu para ler");
    expect(motivo("media([1])")).toContain("escreva o valor pronto");
    expect(lerValor("")).toEqual({ ok: false, motivo: "escreva o que a função tem que devolver" });
    expect(lerValor("7 8").ok).toBe(false);
  });

  it("compara valores pelo conteúdo, com tolerância nos números", () => {
    expect(valoresIguais([0.1 + 0.2], [0.3])).toBe(true);
    expect(valoresIguais({ a: [1] }, { a: [1] })).toBe(true);
    expect(valoresIguais([[]], [[0]])).toBe(false);
    expect(valoresIguais(null, 0)).toBe(false);
  });

  it("o caso exigido casa pelos argumentos, pela saída ou pelos dois", () => {
    const lido = lerCaso({ entrada: "[]", esperado: "0" });
    if (!lido.ok) throw new Error(lido.motivo);
    expect(casaComExigido(lido, { args: [[]] })).toBe(true);
    expect(casaComExigido(lido, { esperado: 0 })).toBe(true);
    expect(casaComExigido(lido, { args: [[]], esperado: 1 })).toBe(false);
  });

  it("escrever, mudar e apagar: mudar um caso apaga o resultado dele", () => {
    let estado = estadoInicialCasos({ funcao: "media", parametros: ["notas"], inicial: [{ entrada: "[8, 6]", esperado: "7" }] });
    estado = adicionarCaso(estado, "[]", "0");
    expect(estado.casos.map((c) => c.id)).toEqual([1, 2]);
    estado = { ...estado, resultados: { 1: { passou: true, obtido: "7", erro: null }, 2: { passou: true, obtido: "0", erro: null } } };
    estado = editarCaso(estado, 2, { esperado: "1" });
    expect(Object.keys(estado.resultados)).toEqual(["1"]);
    estado = apagarCaso(estado, 1);
    expect(estado.casos.map((c) => c.id)).toEqual([2]);
    for (let i = 0; i < MAXIMO_CASOS + 2; i++) estado = adicionarCaso(estado, "[1]", "1");
    expect(estado.casos.length).toBe(MAXIMO_CASOS);
  });
});

describe("casos de teste: rodar contra a função do aluno", () => {
  function comFuncao(codigo: string) {
    const simulacao = criarSimulacao(FASE_DEMO_RESOLVER);
    simulacao.executar([{ tipo: "definirSnippet", codigo }]);
    simulacao.comecarObjetivo(null);
    return simulacao;
  }
  const validador = { tipo: "casosDoAluno" as const, minimo: 3, incluir: [{ args: [[]], rotulo: "a lista vazia" }], passando: true };

  it("cada caso mostra se passou e o que veio de fato", () => {
    const simulacao = comFuncao("function media(notas) {\n  let soma = 0;\n  for (const n of notas) soma = soma + n;\n  return soma / notas.length;\n}");
    simulacao.executar([
      { tipo: "escreverCaso", entrada: "[8, 6]", esperado: "7" },
      { tipo: "escreverCaso", entrada: "[]", esperado: "0" },
      { tipo: "escreverCaso", entrada: "[10]", esperado: "10" },
      { tipo: "escreverCaso", entrada: "notas", esperado: "1" },
      { tipo: "rodarCasos" },
    ]);
    const estado = simulacao.casos();
    expect(estado?.casos.map((caso) => estado.resultados[caso.id] ?? null)).toEqual([
      { passou: true, obtido: "7", erro: null },
      { passou: false, obtido: "NaN", erro: null },
      { passou: true, obtido: "10", erro: null },
      null,
    ]);
    // A lista vazia falhou: o validador com passando não conta ela.
    expect(simulacao.avaliar(validador).detalhe).toBe("3 caso(s) válido(s), 2 passando; 1 que não dá para ler; falta a lista vazia");
    expect(simulacao.avaliar({ tipo: "evento", evento: "rodouCasos" }).passou).toBe(true);
  });

  it("consertando a função, os mesmos casos passam (e o validador também)", () => {
    const simulacao = comFuncao(CODIGO_MEDIA);
    simulacao.executar([
      { tipo: "escreverCaso", entrada: "[8, 6]", esperado: "7" },
      { tipo: "escreverCaso", entrada: "[]", esperado: "0" },
    ]);
    expect(simulacao.avaliar({ ...validador, passando: false }).detalhe).toBe("2 caso(s) válido(s)");
    simulacao.executar([{ tipo: "escreverCaso", entrada: "[10]", esperado: "10" }]);
    expect(simulacao.avaliar({ ...validador, passando: false }).passou).toBe(true);
    expect(simulacao.avaliar(validador).passou).toBe(false);
    simulacao.executar([{ tipo: "rodarCasos" }]);
    expect(simulacao.avaliar(validador).passou).toBe(true);
    // Mudar um caso (saída errada) e rodar de novo: ele falha e o validador desmarca.
    simulacao.executar([{ tipo: "apagarCaso", indice: 0 }, { tipo: "escreverCaso", entrada: "[8, 6]", esperado: "8" }, { tipo: "rodarCasos" }]);
    expect(simulacao.avaliar(validador).passou).toBe(false);
  });

  it("sem a função, ou com o código quebrado, os casos dizem o motivo", () => {
    const semFuncao = comFuncao("let x = 1;");
    semFuncao.executar([{ tipo: "escreverCaso", entrada: "[1]", esperado: "1" }, { tipo: "rodarCasos" }]);
    expect(Object.values(semFuncao.casos()?.resultados ?? {})[0]?.erro).toBe("não existe a função media (escreva e rode o código)");
    const quebrado = comFuncao("function media(notas) {\n  return notas.length\n");
    quebrado.executar([{ tipo: "escreverCaso", entrada: "[1]", esperado: "1" }, { tipo: "rodarCasos" }]);
    expect(Object.values(quebrado.casos()?.resultados ?? {})[0]?.erro).toContain("o código deu erro antes: SyntaxError");
  });

  it("a demonstração do /lab passa em todas as regras de fase, do plano aos casos", () => {
    const problemas = REGRAS_DE_FASE.flatMap((regra) => (regra.id === "partes-do-desafio" ? [] : regra.checar(FASE_DEMO_RESOLVER, { unidades: [], fases: [FASE_DEMO_RESOLVER] })));
    expect(problemas).toEqual([]);
  });
});

describe("casos de teste: salvamento e sabotagens", () => {
  it("os casos e o resultado da última rodada voltam do progresso (e o lixo não)", () => {
    const bruto = {
      versao: 2,
      fasesConcluidas: [],
      estrelasPorFase: {},
      fasesEmAndamento: {
        "lab-resolver-u1-f1": {
          objetivoAtual: 2,
          htmlAtual: "",
          estrelas: 3,
          introducaoVista: true,
          casos: {
            casos: [{ id: 1, entrada: "[8, 6]", esperado: "7" }, { id: 1, entrada: "duplicado", esperado: "" }, { id: "x" }],
            resultados: { 1: { passou: true, obtido: "7", erro: null }, 9: { passou: true } },
            rodou: true,
          },
        },
      },
    };
    const lido = normalizarProgresso(bruto);
    expect(lido?.fasesEmAndamento["lab-resolver-u1-f1"]?.casos).toEqual({ casos: [{ id: 1, entrada: "[8, 6]", esperado: "7" }], resultados: { 1: { passou: true, obtido: "7", erro: null } }, rodou: true });
  });

  it("sabotagem: casos sem a área, função com nome ruim, exemplo que não dá para ler e borda com argumentos a mais", () => {
    const texto = (fase: Fase) => REGRAS_DE_FASE.flatMap((regra) => (regra.id === "partes-do-desafio" ? [] : regra.checar(fase, { unidades: [], fases: [fase] }))).join("\n");
    const semArea = { ...FASE_DEMO_RESOLVER, areas: ["plano", "snippet", "palco"] as typeof FASE_DEMO_RESOLVER.areas };
    const t1 = texto(semArea);
    expect(t1).toContain('o validador casosDoAluno pede a área "testes"');
    expect(t1).toContain('rodarCasos pede a área "testes"');
    expect(t1).toContain('usaFerramentas tem "casos-de-teste", mas a fase não declara a área "testes"');
    const ruim = { ...FASE_DEMO_RESOLVER, testes: { funcao: "media notas", parametros: ["notas"], inicial: [{ entrada: "notas", esperado: "1" }] } };
    const t2 = texto(ruim);
    expect(t2).toContain('testes.funcao "media notas" não é um nome de função');
    expect(t2).toContain("testes.inicial[0]: entrada:");
    const borda = {
      ...FASE_DEMO_RESOLVER,
      objetivos: FASE_DEMO_RESOLVER.objetivos.map((o) => (o.id === "testar" ? { ...o, validador: { tipo: "casosDoAluno" as const, minimo: 1, incluir: [{ args: [[], 1] }, { esperado: 0 }] } } : o)),
    };
    const t3 = texto(borda);
    expect(t3).toContain("casosDoAluno.incluir com 2 argumento(s); a função tem 1");
    expect(t3).toContain("exige 2 casos de borda, mais que o minimo 1");
  });
});
