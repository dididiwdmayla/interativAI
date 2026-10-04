/*
 * Estruturas e desempenho (src/motor/estruturas.ts e src/motor/desempenho.ts):
 * como a lista mudou (push, pop, shift, unshift, troca), a forma de uma
 * variável ao longo das execuções (pilha, fila, árvore), a árvore desenhável,
 * as medições do gráfico passos x tamanho e os validadores `formaDaEstrutura`
 * e `passosNoMaximo`. Mais as demonstrações do /lab e as sabotagens.
 */
import { describe, expect, it } from "vitest";
import { chamadasDaMedicao, crescimento, listaDoTamanho, textoDePassos } from "@/motor/desempenho";
import { arvoreDoNo, contarEstruturas, ehArvore, formaPelasContagens, movimentoDaLista, objetosDoQuadroDeCima, somarContagens, temFormaDeArvore } from "@/motor/estruturas";
import { criarNucleoNode } from "@/motor/executor/node";
import { planoDoPalco } from "@/motor/palco";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASE_DEMO_DESEMPENHO, FASE_DEMO_ESTRUTURAS, FASE_DEMO_ORDENAR } from "@/conteudo/laboratorio/bancadaLogica";
import { criarSimulacao } from "@/motor/simulacao";

const PREPARO = 'const pilha = [1, 2];\nconst pasta = { nome: "site", filhos: [{ nome: "a" }, { nome: "b", filhos: [{ nome: "c" }] }] };';

describe("como a lista mudou", () => {
  it("push e pop pelo fim, unshift e shift pelo começo", () => {
    expect(movimentoDaLista(["1", "2"], ["1", "2", "3"])).toMatchObject({ entraramFim: 1, entraramInicio: 0 });
    expect(movimentoDaLista(["1", "2"], ["0", "1", "2"])).toMatchObject({ entraramInicio: 1, entraramFim: 0 });
    expect(movimentoDaLista(["1", "2", "3"], ["1", "2"])).toMatchObject({ sairamFim: 1, sairamInicio: 0 });
    expect(movimentoDaLista(["1", "2", "3"], ["2", "3"])).toMatchObject({ sairamInicio: 1, sairamFim: 0 });
  });

  it("a troca de duas posições e a escrita numa posição", () => {
    expect(movimentoDaLista(["4", "2", "3"], ["2", "4", "3"]).troca).toEqual([0, 1]);
    const escrita = movimentoDaLista(["4", "2", "3"], ["4", "9", "3"]);
    expect(escrita.troca).toBeNull();
    expect(escrita.escritos).toEqual([1]);
  });
});

describe("pilha, fila e árvore nas execuções", () => {
  const rodar = (codigos: string[]) => {
    const nucleo = criarNucleoNode({ deterministico: true });
    nucleo.executar(PREPARO, "console");
    return codigos.map((codigo) => {
      const r = nucleo.executar(codigo, "console");
      return contarEstruturas(r.passos, r.memoriaFinal);
    });
  };

  it("um comando só no Console conta (a memória final fecha a conta)", () => {
    const [push] = rodar(["pilha.push(3)"]);
    expect(push.pilha).toEqual({ entraramInicio: 0, entraramFim: 1, sairamInicio: 0, sairamFim: 0 });
  });

  it("push e pop é pilha; push e shift é fila; só push ainda não diz", () => {
    const pilha = somarContagens(rodar(["pilha.push(3)", "pilha.pop()"]).map((c) => c.pilha ?? somarContagens([])));
    expect(formaPelasContagens(pilha)).toBe("pilha");
    const fila = somarContagens(rodar(["pilha.push(3)", "pilha.shift()"]).map((c) => c.pilha ?? somarContagens([])));
    expect(formaPelasContagens(fila)).toBe("fila");
    const so = somarContagens(rodar(["pilha.push(3)", "pilha.push(4)"]).map((c) => c.pilha ?? somarContagens([])));
    expect(formaPelasContagens(so)).toBeNull();
  });

  it("um laço que empilha e desempilha conta cada volta", () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    const r = nucleo.executar("const p = [];\nfor (let i = 0; i < 3; i++) p.push(i);\nwhile (p.length) p.pop();", "snippet");
    const c = contarEstruturas(r.passos, r.memoriaFinal).p;
    expect(c).toMatchObject({ entraramFim: 3, sairamFim: 3 });
    expect(formaPelasContagens(c)).toBe("pilha");
  });

  it("a troca numa linha só (desestruturação) é uma troca; o lado esquerdo não conta como leitura", () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    const r = nucleo.executar("const c = [4, 2];\n[c[0], c[1]] = [c[1], c[0]];\nconsole.log(c);", "snippet");
    expect(r.erro).toBeNull();
    const itens = (k: number) => {
      const foto = k < r.passos.length ? r.passos[k].memoria : r.memoriaFinal;
      const ref = foto.quadros[0].escopos[0].variaveis.find((v) => v.nome === "c")?.valor;
      const lista = ref?.t === "ref" ? foto.monte[String(ref.id)] : undefined;
      return lista?.t === "array" ? lista.itens.map((item) => JSON.stringify(item)) : [];
    };
    expect(movimentoDaLista(itens(1), itens(2)).troca).toEqual([0, 1]);
    // As leituras da linha 2 (só o lado direito) vão no passo seguinte.
    expect(r.passos[2].leituras?.map((l) => l.indice).sort()).toEqual([0, 1]);
  });

  it("árvore: objeto com filhos objetos; desenhável com rótulos pelo nome", () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    const r = nucleo.executar(PREPARO, "snippet");
    expect(ehArvore(r.memoriaFinal, "pasta")).toBe(true);
    expect(ehArvore(r.memoriaFinal, "pilha")).toBe(false);
    const variavel = planoDoPalco(r.memoriaFinal).quadros[0].escopos[0].variaveis.find((v) => v.nome === "pasta");
    expect(variavel && temFormaDeArvore(variavel.valor)).toBe(true);
    const arvore = variavel ? arvoreDoNo(variavel.valor) : null;
    expect(arvore?.rotulo).toBe("site");
    expect(arvore?.filhos.map((f) => f.rotulo)).toEqual(["a", "b"]);
    expect(arvore?.filhos[1].filhos.map((f) => f.rotulo)).toEqual(["c"]);
  });

  it("o nó visitado: os objetos que a função de agora está olhando", () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    const r = nucleo.executar(`${PREPARO}\nfunction visitar(no) {\n  return no.nome;\n}\nvisitar(pasta.filhos[1]);`, "snippet");
    const dentro = r.passos.find((p) => p.linha === 4 && p.memoria.quadros.length > 1);
    expect(dentro).toBeDefined();
    expect(objetosDoQuadroDeCima(dentro?.memoria ?? null).size).toBe(1);
    expect(objetosDoQuadroDeCima(r.memoriaFinal).size).toBe(0);
  });
});

describe("o gráfico passos x tamanho", () => {
  it("listas de cada tamanho, sempre iguais", () => {
    expect(listaDoTamanho(5)).toEqual([1, 2, 3, 4, 5]);
    expect(listaDoTamanho(5, "decrescente")).toEqual([5, 4, 3, 2, 1]);
    expect(listaDoTamanho(50, "embaralhada")).toEqual(listaDoTamanho(50, "embaralhada"));
    expect([...listaDoTamanho(50, "embaralhada")].sort((a, b) => a - b)).toEqual(listaDoTamanho(50));
  });

  it("$lista e $tamanho viram os argumentos de cada medição", () => {
    const chamadas = chamadasDaMedicao({ funcoes: [], tamanhos: [2, 3] }, { nome: "f", args: ["$lista", "$tamanho", 7] });
    expect(chamadas).toEqual([
      { tamanho: 2, args: [[1, 2], 2, 7] },
      { tamanho: 3, args: [[1, 2, 3], 3, 7] },
    ]);
  });

  it("números para quem não programa e quanto cresceu", () => {
    expect(textoDePassos(1234)).toBe("1.234");
    expect(textoDePassos(25_000)).toBe("25 mil");
    expect(textoDePassos(1_500_000)).toBe("1,5 milhão");
    expect(textoDePassos(2_000_000)).toBe("2 milhões");
    const m = (tamanho: number, passos: number) => ({ funcao: "f", tamanho, passos, passouDoLimite: false, erro: null });
    expect(crescimento([m(10, 30), m(100, 300)])).toBe(10);
    expect(crescimento([m(10, 30)])).toBeNull();
  });
});

describe("estruturas e desempenho na fábrica", () => {
  it("as duas demonstrações do /lab passam em todas as regras de fase", async () => {
    for (const fase of [FASE_DEMO_ESTRUTURAS, FASE_DEMO_DESEMPENHO]) {
      const problemas = REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] }).map((p) => `${regra.id}: ${p}`));
      expect(problemas, fase.id).toEqual([]);
    }
  });

  it("formaDaEstrutura: o lado errado não passa, e a árvore pede um objeto com filhos", async () => {
    const simulacao = criarSimulacao(FASE_DEMO_ESTRUTURAS);
    simulacao.executar([
      { tipo: "executarNoConsole", codigo: 'pilha.push("prato 3")' },
      { tipo: "executarNoConsole", codigo: "pilha.shift()" },
    ]);
    const pilha = simulacao.avaliar({ tipo: "formaDaEstrutura", nome: "pilha", forma: "pilha" });
    expect(pilha.passou).toBe(false);
    expect(simulacao.avaliar({ tipo: "formaDaEstrutura", nome: "pilha", forma: "fila" }).passou).toBe(true);
    expect(simulacao.avaliar({ tipo: "formaDaEstrutura", nome: "pasta", forma: "arvore" }).passou).toBe(true);
    expect(simulacao.avaliar({ tipo: "formaDaEstrutura", nome: "fila", forma: "arvore" }).passou).toBe(false);
    expect(() => simulacao.executar([{ tipo: "verComoArvore", nome: "fila" }])).toThrow(/não é \(ainda\) um objeto/);
  });

  it("passosNoMaximo com tamanho mede a função de agora: o jeito lento não passa, o rápido passa", async () => {
    const simulacao = criarSimulacao(FASE_DEMO_DESEMPENHO);
    const lento = { tipo: "passosNoMaximo" as const, valor: 2000, tamanho: 500, funcao: "temRepetidoLento" };
    expect(simulacao.avaliar(lento).detalhe).toBe("ainda não mediu (nada rodou ou a função não existe)");
    simulacao.executar([{ tipo: "executarSnippet" }]);
    const antes = simulacao.avaliar(lento);
    expect(antes.passou).toBe(false);
    expect(antes.detalhe).toMatch(/mil passos/);
    expect(simulacao.avaliar({ tipo: "passosNoMaximo", valor: 100 }).passou).toBe(true);
    expect(simulacao.avaliar({ tipo: "passosNoMaximo", valor: 5 }).passou).toBe(false);
    // Melhorando o algoritmo (não decorando a resposta), a mesma medida passa.
    const melhor = FASE_DEMO_DESEMPENHO.objetivos[2].solucaoDeTeste ?? [];
    simulacao.executar(melhor);
    expect(simulacao.avaliar(lento).passou).toBe(true);
  });

  it("o Medir: a lenta cresce muito mais que a rápida (curva contra reta)", async () => {
    const nucleo = criarNucleoNode({ deterministico: true });
    nucleo.executar(FASE_DEMO_DESEMPENHO.programa?.snippet?.codigoInicial ?? "", "snippet");
    const config = FASE_DEMO_DESEMPENHO.programa?.desempenho;
    if (!config) throw new Error("a demonstração precisa de programa.desempenho");
    const [lenta, rapida] = config.funcoes.map((f) => nucleo.medirPassos(f.nome, chamadasDaMedicao(config, f)));
    expect(lenta.every((m) => !m.erro && !m.passouDoLimite)).toBe(true);
    expect(crescimento(lenta) ?? 0).toBeGreaterThan(1000);
    expect(crescimento(rapida) ?? 0).toBeLessThan(80);
  });

  it("sabotagem: desempenho sem a ferramenta, três funções, passosNoMaximo sem contador e árvore sem a ferramenta", async () => {
    const texto = (fase: Parameters<(typeof REGRAS_DE_FASE)[number]["checar"]>[0]) =>
      REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] })).join("\n");
    const programa = FASE_DEMO_DESEMPENHO.programa;
    if (!programa?.desempenho) throw new Error("a demonstração precisa de programa.desempenho");
    const semFerramenta = { ...FASE_DEMO_DESEMPENHO, usaFerramentas: FASE_DEMO_DESEMPENHO.usaFerramentas.filter((id) => id !== "grafico-passos" && id !== "contador-passos") };
    const t = texto(semFerramenta);
    expect(t).toContain("programa.desempenho pede a ferramenta grafico-passos");
    expect(t).toContain('pede "contador-passos" em usaFerramentas');
    const tres = { ...FASE_DEMO_DESEMPENHO, programa: { ...programa, desempenho: { ...programa.desempenho, funcoes: [...programa.desempenho.funcoes, { nome: "outra" }], tamanhos: [100, 10] } } };
    expect(texto(tres)).toContain("com 3 funções");
    expect(texto(tres)).toContain("em ordem crescente");
    const semArvore = { ...FASE_DEMO_ESTRUTURAS, usaFerramentas: FASE_DEMO_ESTRUTURAS.usaFerramentas.filter((id) => id !== "arvore-palco") };
    expect(texto(semArvore)).toContain('formaDaEstrutura arvore pede "arvore-palco"');
    const fora = { ...FASE_DEMO_ORDENAR, objetivos: [{ ...FASE_DEMO_ORDENAR.objetivos[0], validador: { tipo: "formaDaEstrutura" as const, nome: "x", forma: "pilha" as const } }] };
    expect(texto(fora)).toContain("só vale numa fase de programa");
  });
});
