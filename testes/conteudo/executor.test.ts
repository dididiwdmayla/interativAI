/*
 * Executor de JavaScript da Ilha Lógica (src/motor/executor/): escopos no
 * rastro, loop infinito, erros com a linha certa, saída do console no
 * formato do Chrome, determinismo, modo do Console (declarar de novo) e o
 * teste de funções (validador funcaoPassa).
 */
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { criarNucleoNode } from "@/motor/executor/node";
import { instrumentar, sintaxesUsadas } from "@/motor/executor/instrumentar";
import { explicarErro, textoDoErro } from "@/motor/executor/erros";
import { literalJs, textoDaSaida, textoDoResultado, valorIgual } from "@/motor/executor/formatar";
import { LIMITES, type PassoRastro, type ResultadoExecucao, type ValorMemoria } from "@/motor/executor/tipos";

function rodar(codigo: string, origem: "console" | "snippet" = "snippet") {
  return criarNucleoNode({ deterministico: true }).executar(codigo, origem);
}

/** As variáveis de um passo, por quadro: { "Global": { x: "5" }, "soma": {...} }. */
function variaveis(passo: PassoRastro): Record<string, Record<string, string>> {
  const texto = (v: ValorMemoria) => ("v" in v ? String(v.v) : v.t === "ref" ? `#${v.id}` : v.t === "funcao" ? `ƒ ${v.nome}` : v.t);
  const saida: Record<string, Record<string, string>> = {};
  for (const quadro of passo.memoria.quadros) {
    saida[quadro.nome] = {};
    for (const escopo of quadro.escopos) for (const v of escopo.variaveis) saida[quadro.nome][v.nome] = texto(v.valor);
  }
  return saida;
}

const linhas = (r: ResultadoExecucao) => r.passos.map((p) => p.linha);

describe("instrumentação", () => {
  it("não muda as linhas do código (o erro aponta a linha que o jogador escreveu)", () => {
    const codigo = "let a = 1;\nfunction f(x) {\n  return x * 2;\n}\nfor (let i = 0; i < 2; i++) a += f(i);\nconst g = (y) => y + 1;\na";
    const inst = instrumentar(codigo, { origem: "snippet", prefixo: "t" });
    expect(inst.ok).toBe(true);
    if (inst.ok) expect(inst.codigo.split("\n").length).toBe(codigo.split("\n").length);
  });

  it("erro de sintaxe traz a mensagem do motor de JavaScript e a linha", () => {
    const r = rodar("let total = 5;\nlet x = (2 + ;\n");
    expect(r.erro?.tipo).toBe("sintaxe");
    expect(r.erro?.nome).toBe("SyntaxError");
    expect(r.erro?.mensagem).toBe("Unexpected token ';'");
    expect(r.erro?.linha).toBe(2);
    expect(r.passos).toHaveLength(0);
  });

  it("async, geradores e import() não rodam (e dizem isso)", () => {
    for (const codigo of ["async function f() {}", "function* g() {}", "import('https://exemplo.com/x.js')"]) {
      expect(rodar(codigo).erro?.tipo, codigo).toBe("nao-suportado");
    }
  });

  it("sintaxes usadas vêm da árvore (texto dentro de aspas não conta)", () => {
    const usadas = sintaxesUsadas("// soma\nconst lista = [1, 2];\nfor (const n of lista) { if (n > 1 && n !== 3) console.log(`n: ${n}`) }\nconst dobro = (n) => n * 2;\nlista.push(3);");
    for (const s of ["comentario", "const", "array", "for-of", "if", "e-logico", "igualdade-estrita", "comparacao", "template", "arrow", "console-log", "metodo:push"]) {
      expect(usadas, s).toContain(s);
    }
    expect(sintaxesUsadas("const t = 'for (;;) { if }'")).not.toContain("for");
    expect(sintaxesUsadas("let a = 'http://x'")).not.toContain("comentario");
  });
});

describe("o código instrumentado faz o mesmo que o original", () => {
  // Cada programa roda no executor e, sem ganchos, num contexto vm limpo: a resposta tem que ser a mesma.
  const PROGRAMAS = [
    "function f() {}\nf();\ntry { f() } catch (e) {}\nif (true) {}\n1",
    "let s = 0;\nfora: for (let i = 0; i < 5; i++) {\n  for (let j = 0; j < 5; j++) {\n    if (j > i) continue fora;\n    if (i === 4) break fora;\n    s += i * j;\n  }\n}\ns",
    "function tipo(n) {\n  switch (n % 3) {\n    case 0: return 'zero';\n    case 1: { let t = 'um'; return t; }\n    default: return 'dois';\n  }\n}\n[0, 1, 2, 3].map(tipo).join(',')",
    "class Conta {\n  constructor(dono) { this.dono = dono; this.saldo = 0; }\n  depositar(v) { this.saldo += v; return this; }\n  get resumo() { return `${this.dono}: ${this.saldo}`; }\n}\nnew Conta('Ana').depositar(5).depositar(2).resumo",
    "const soma = ({ a, b = 2 }, ...resto) => a + b + resto.length;\nsoma({ a: 1 }, 9, 9)",
    "function f(a = () => 10) { return a(); }\nf() + f(() => 1)",
    "const o = { x: 1, dobro() { return this.x * 2 }, ['k' + 1]: 5 };\no.dobro() + o.k1",
    "let t = 0;\nfor (const ch of 'abc') t++;\nfor (const k in { a: 1, b: 2 }) t += k.length;\ndo { t *= 2 } while (t < 20);\nt",
    "const n = null;\n(n?.x ?? 7) + 2 ** 3",
    "function fat(n) { return n <= 1 ? 1 : n * fat(n - 1) }\nfat(6)",
    "const l = [5, 1, 4];\nl.sort((a, b) => a - b);\nl.reduce((acc, v) => acc + v, 0) + l[0]",
    "function contador() {\n  let c = 0;\n  return () => ++c;\n}\nconst mais = contador();\nmais(); mais();\nmais()",
    "let x = 1;\nif (x > 2) x = 10;\nelse if (x > 0) x = 20;\nelse x = 30;\nx",
    "function args() { return arguments.length }\nargs(1, 2, 3)",
    "let r = '';\ntry { throw new Error('a') } catch ({ message }) { r = message } finally { r += '!' }\nr",
    "var v = 1;\n{ var v = 2 }\nv",
    "const [p, , q = 3] = [1, 2];\np + q",
    "let i = 0;\nwhile (i < 3) i++;\ni",
    "(function () { return 'iife' })()",
    "const f = function nomeado() { return typeof nomeado };\nf()",
    "let w = 0;\nfor (let i = 0; i < 3; i++) { const d = i * 2; w += d; }\nw",
    "const x = 5, y = x + 1;\nx * y",
    "let a = 1\nlet b = 2\na + b",
  ];
  for (const programa of PROGRAMAS) {
    it(programa.split("\n")[0], () => {
      const esperado = vm.runInNewContext(programa);
      const r = rodar(programa);
      expect(r.erro, programa).toBeNull();
      expect(textoDoResultado(r.resultado)).toBe(textoDoResultado(criarNucleoNode().paraExibido(esperado, 4)));
    });
  }
});

describe("rastro e escopos", () => {
  it("um passo antes de cada comando, com a memória daquele momento", () => {
    const r = rodar("let x = 1;\nx = x + 1;\nconst y = x * 10;");
    expect(linhas(r)).toEqual([1, 2, 3, null]);
    expect(variaveis(r.passos[0]).Global).toEqual({});
    expect(variaveis(r.passos[1]).Global).toEqual({ x: "1" });
    expect(variaveis(r.passos[2]).Global).toEqual({ x: "2" });
    expect(variaveis(r.passos[3]).Global).toEqual({ x: "2", y: "20" });
    expect(r.passos[3].tipo).toBe("fim");
    expect(r.globais).toEqual([
      { nome: "x", declaracao: "let" },
      { nome: "y", declaracao: "const" },
    ]);
  });

  it("função: moldura própria enquanto roda, parâmetros e variáveis de dentro, retorno no rastro", () => {
    const r = rodar("function soma(a, b) {\n  const s = a + b;\n  return s;\n}\nlet total = soma(2, 3);");
    expect(linhas(r)).toEqual([5, 2, 3, 3, null]);
    expect(Object.keys(variaveis(r.passos[1]))).toEqual(["Global", "soma"]);
    expect(variaveis(r.passos[1]).soma).toEqual({ a: "2", b: "3" });
    expect(variaveis(r.passos[2]).soma).toEqual({ a: "2", b: "3", s: "5" });
    expect(r.passos[3].tipo).toBe("retorno");
    expect(r.passos[3].retorno).toEqual({ funcao: "soma", valor: { t: "number", v: "5" } });
    expect(Object.keys(variaveis(r.passos[4]))).toEqual(["Global"]);
    expect(variaveis(r.passos[4]).Global.total).toBe("5");
  });

  it("escopo de bloco: a variável do for existe só dentro dele", () => {
    const r = rodar("let soma = 0;\nfor (let i = 1; i <= 3; i++) {\n  soma = soma + i;\n}\nsoma");
    const dentro = r.passos.filter((p) => p.linha === 3);
    expect(dentro.map((p) => variaveis(p).Global.i)).toEqual(["1", "2", "3"]);
    const escopos = dentro[0].memoria.quadros[0].escopos;
    expect(escopos.map((e) => e.tipo)).toEqual(["global", "bloco"]);
    expect(variaveis(r.passos[r.passos.length - 1]).Global).toEqual({ soma: "6" });
    expect(r.resultado).toEqual({ t: "number", v: "6" });
  });

  it("arrow com expressão também tem moldura e retorno", () => {
    const r = rodar("const dobro = (n) => n * 2;\nconst d = dobro(4);");
    expect(r.passos.some((p) => p.memoria.quadros.some((q) => q.nome === "dobro"))).toBe(true);
    expect(r.passos.find((p) => p.tipo === "retorno")?.retorno?.valor).toEqual({ t: "number", v: "8" });
  });

  it("referências: duas variáveis apontando para a mesma lista têm o mesmo id", () => {
    const r = rodar("let a = [1, 2];\nlet b = a;\nb.push(3);\nlet c = [1, 2, 3];");
    const [va, vb, vc] = r.memoriaFinal.quadros[0].escopos[0].variaveis.map((v) => v.valor);
    expect(va).toEqual(vb);
    expect(vc).not.toEqual(va);
    if (va.t !== "ref") throw new Error("a lista devia ser referência");
    expect(r.memoriaFinal.monte[String(va.id)]).toEqual({ t: "array", tamanho: 3, itens: [1, 2, 3].map((n) => ({ t: "number", v: String(n) })) });
  });

  it("let ainda não criada (zona morta) não aparece no quadro da função", () => {
    const r = rodar("function f() {\n  const a = 1;\n  let b = 2;\n  return a + b;\n}\nf();");
    const passoDaLinha2 = r.passos.find((p) => p.linha === 2);
    expect(passoDaLinha2 && variaveis(passoDaLinha2).f).toEqual({});
  });
});

describe("loop infinito e limites", () => {
  it("while (true) para com mensagem amigável, sem travar", () => {
    const inicio = performance.now();
    const r = rodar("let i = 0;\nwhile (true) {\n  i = i + 1;\n}");
    expect(performance.now() - inicio).toBeLessThan(LIMITES.reservaMs);
    expect(r.erro?.tipo).toBe("limite-passos");
    expect(r.erro?.linha).toBe(3);
    expect(explicarErro(r.erro!).titulo).toBe("Loop que nunca termina?");
    expect(r.rastroCortado).toBe(true);
    expect(r.passos.length).toBe(LIMITES.fotos + 1);
  });

  it("laço vazio e laço de um comando só também param", () => {
    expect(rodar("for (;;) {}").erro?.tipo).toBe("limite-passos");
    expect(rodar("while (true);").erro?.tipo).toBe("limite-passos");
    expect(rodar("let n = 0; do n++; while (n > -1)").erro?.tipo).toBe("limite-passos");
  });

  it("um try/catch dentro do laço não engole a parada", () => {
    const r = rodar("while (true) {\n  try { let x = 1; } catch (e) {}\n}");
    expect(r.erro?.tipo).toBe("limite-passos");
  });

  it("recursão sem fim vira RangeError com explicação", () => {
    const r = rodar("function f(n) {\n  return f(n + 1);\n}\nf(0);");
    expect(r.erro?.nome).toBe("RangeError");
    expect(explicarErro(r.erro!).titulo).toBe("Função que chama ela mesma sem parar");
  });

  it("a sessão continua usável depois da parada", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("let x = 5;", "console");
    nucleo.executar("while (true) {}", "console");
    expect(nucleo.executar("x + 1", "console").resultado).toEqual({ t: "number", v: "6" });
  });
});

describe("erros", () => {
  it("erro dentro de função aponta a linha de dentro", () => {
    const r = rodar("function ler(o) {\n  return o.nome.length;\n}\nler({});");
    expect(r.erro).toMatchObject({ tipo: "execucao", nome: "TypeError", linha: 2 });
    expect(r.erro?.mensagem).toContain("Cannot read properties of undefined");
    expect(explicarErro(r.erro!).titulo).toBe("Ler dentro de algo vazio");
    expect(r.passos[r.passos.length - 1].tipo).toBe("erro");
  });

  it("dicionário: os casos de iniciante (V8, Firefox e Safari)", () => {
    const e = (nome: string, mensagem: string) => explicarErro({ tipo: "execucao", nome, mensagem, linha: 1, coluna: 1 }).titulo;
    expect(e("ReferenceError", "nome is not defined")).toBe("Nome desconhecido");
    expect(e("ReferenceError", "Can't find variable: nome")).toBe("Nome desconhecido");
    expect(e("ReferenceError", "Cannot access 'x' before initialization")).toBe("Usou antes de criar");
    expect(e("TypeError", "Assignment to constant variable.")).toBe("const não troca de valor");
    expect(e("TypeError", "invalid assignment to const 'x'")).toBe("const não troca de valor");
    expect(e("TypeError", "lista.mapa is not a function")).toBe("Isso não é uma função");
    expect(e("TypeError", "x is undefined")).toBe("Ler dentro de algo vazio");
    expect(e("TypeError", "5 is not iterable")).toBe("Não dá para percorrer isso");
    expect(e("RangeError", "too much recursion")).toBe("Função que chama ela mesma sem parar");
    expect(e("SyntaxError", "Unexpected end of input")).toBe("Faltou fechar alguma coisa");
    expect(e("SyntaxError", "Invalid or unexpected token")).toBe("Texto sem fechar ou símbolo estranho");
    expect(e("SyntaxError", "missing ) after argument list")).toBe("Faltou um )");
    expect(e("SyntaxError", "Unexpected identifier 'mundo'")).toBe("Faltou algo entre duas coisas");
    expect(e("SyntaxError", "Unexpected string")).toBe("Faltou algo entre duas coisas");
    expect(e("SyntaxError", "Invalid left-hand side in assignment")).toBe("O = do lado errado");
    expect(e("SyntaxError", "Identifier 'x' has already been declared")).toBe("Criou a mesma variável duas vezes");
    expect(e("SyntaxError", "Missing initializer in const declaration")).toBe("const sem valor");
    expect(e("SyntaxError", "Unexpected token '}'")).toBe("Símbolo no lugar errado");
    expect(e("Error", "minha mensagem")).toBe("Erro lançado pelo programa");
  });

  it("o texto do erro é o do Console (Uncaught ...)", () => {
    const r = rodar("naoExiste + 1");
    expect(textoDoErro(r.erro!)).toBe("Uncaught ReferenceError: naoExiste is not defined");
  });
});

describe("console e respostas no formato do Chrome", () => {
  it("resposta de expressão e undefined depois de declaração", () => {
    const nucleo = criarNucleoNode();
    const resp = (c: string) => textoDoResultado(nucleo.executar(c, "console").resultado);
    expect(resp("2 + 3 * 4")).toBe("14");
    expect(resp("let preco = 5")).toBe("undefined");
    expect(resp("'Pão' + ' de mel'")).toBe("'Pão de mel'");
    expect(resp("\"it's\"")).toBe('"it\'s"');
    expect(resp("[1, 2, 3]")).toBe("(3) [1, 2, 3]");
    expect(resp("['a']")).toBe("['a']");
    expect(resp("{nome: 'Ana', idade: 30}")).toBe("{nome: 'Ana', idade: 30}");
    expect(resp("({a: {b: 1}, l: [1, 2]})")).toBe("{a: {…}, l: Array(2)}");
    expect(resp("({a: 1, b: 2, c: 3, d: 4, e: 5, f: 6})")).toBe("{a: 1, b: 2, c: 3, d: 4, e: 5, …}");
    expect(resp("new Map([['a', 1]])")).toBe("Map(1) {'a' => 1}");
    expect(resp("function soma(a, b) { return a + b }")).toBe("undefined");
    expect(resp("soma")).toBe("ƒ soma(a, b) { return a + b }");
    expect(resp("(x) => x * 2")).toBe("(x) => x * 2");
    expect(resp("-0")).toBe("-0");
    expect(resp("typeof preco")).toBe("'number'");
    expect(resp("null")).toBe("null");
    expect(resp("console.log('oi')")).toBe("undefined");
  });

  it("console.log: texto sem aspas quando vem primeiro, com aspas depois de outro valor", () => {
    const r = rodar("console.log('oi', 'a', 1);\nconsole.log(1, 'a');\nconsole.log([1, 'b'], {x: 'y'});\nconsole.log('%s tem %d anos', 'Ana', 30.7);\nconsole.log();");
    expect(r.saidas.map((s) => s.texto)).toEqual(["oi a 1", "1 'a'", "(2) [1, 'b'] {x: 'y'}", "Ana tem 30 anos", ""]);
    expect(r.saidas.map((s) => s.linha)).toEqual([1, 2, 3, 4, 5]);
  });

  it("warn, error e clear", () => {
    const r = rodar("console.warn('cuidado');\nconsole.error('ops');\nconsole.clear();");
    expect(r.saidas.map((s) => [s.nivel, s.texto])).toEqual([
      ["warn", "cuidado"],
      ["error", "ops"],
      ["info", "O console foi limpo"],
    ]);
    expect(r.saidas[2].limpar).toBe(true);
  });

  it("os passos sabem quantas saídas já tinham aparecido", () => {
    const r = rodar("console.log(1);\nconsole.log(2);");
    expect(r.passos.map((p) => p.saidas)).toEqual([0, 1, 2]);
  });

  it("literal de texto como o Chrome escolhe as aspas", () => {
    expect(literalJs("oi")).toBe("'oi'");
    expect(literalJs("it's")).toBe('"it\'s"');
    expect(literalJs("a\nb")).toBe("'a\\nb'");
    expect(textoDaSaida([{ t: "string", v: "x" }, { t: "string", v: "y" }], true)).toBe("x y");
  });

  it("toString de uma função mostra o código do jogador, não o instrumentado", () => {
    const r = rodar("function f() { return 1 }\nf.toString()", "console");
    expect(r.resultado).toEqual({ t: "string", v: "function f() { return 1 }" });
  });
});

describe("modo do Console (REPL do Chrome)", () => {
  it.each(["let", "const"])("%s do topo dá ReferenceError antes da declaração", (tipo) => {
    for (const codigo of [
      `x; ${tipo} x = 1`, `typeof x; ${tipo} x = 1`,
      `${tipo} x = x + 1`, `x = 2; ${tipo} x = 1`,
      `function ler() { return x } ler(); ${tipo} x = 1`,
    ]) {
      const r = rodar(codigo, "console");
      expect(r.erro, codigo).toMatchObject({ nome: "ReferenceError", mensagem: "Cannot access 'x' before initialization" });
      expect(explicarErro(r.erro!).titulo).toBe("Usou antes de criar");
    }
    const nucleo = criarNucleoNode();
    nucleo.executar(`${tipo} x = 8`, "console");
    expect(nucleo.executar(`x; ${tipo} x = 9`, "console").erro).toBeNull();
    expect(nucleo.executar(`${tipo} x = x + 1; x`, "console").resultado).toEqual({ t: "number", v: "10" });
    expect(nucleo.executar(`${tipo} x = 9; x`, "console").resultado).toEqual({ t: "number", v: "9" });
  });

  it("cada declarador sai da zona morta ao inicializar e nomes locais não são globais", () => {
    expect(rodar("let a = 1, b = a + 2; ({a, b})", "console").erro).toBeNull();
    expect(rodar("function f(x) { return x } f(3); let x = 1", "console").erro).toBeNull();
    expect(rodar("let a = 1 /*, no comentário */, b = a + 2; b", "console").resultado).toEqual({ t: "number", v: "3" });
    expect(rodar("let a; [a] = [2]; a", "console").resultado).toEqual({ t: "number", v: "2" });
    expect(rodar("const f = function x() { return typeof x }; f(); let x = 1", "console").erro).toBeNull();
    expect(rodar("typeof desconhecida", "console").resultado).toEqual({ t: "string", v: "undefined" });
  });
  it("variáveis continuam entre entradas e let, const e class podem ser declaradas de novo", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("let x = 1", "console");
    expect(nucleo.executar("let x = 2; x", "console").resultado).toEqual({ t: "number", v: "2" });
    nucleo.executar("const c = 1", "console");
    expect(nucleo.executar("const c = 3; c", "console").erro).toBeNull();
    expect(nucleo.executar("class A {}", "console").erro).toBeNull();
    expect(nucleo.executar("class A { oi() { return 1 } }\nnew A().oi()", "console").resultado).toEqual({ t: "number", v: "1" });
  });

  it("const continua sem trocar de valor (mesmo erro do navegador)", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("const taxa = 2", "console");
    const r = nucleo.executar("taxa = 3", "console");
    expect(r.erro).toMatchObject({ nome: "TypeError", mensagem: "Assignment to constant variable.", linha: 1 });
    expect(nucleo.executar("taxa++", "console").erro?.nome).toBe("TypeError");
    expect(nucleo.executar("function f() { taxa = 9 }\nf()", "console").erro?.nome).toBe("TypeError");
    expect(nucleo.executar("function g() { let taxa = 1; taxa = 9; return taxa }\ng()", "console").resultado).toEqual({ t: "number", v: "9" });
    expect(nucleo.executar("taxa", "console").resultado).toEqual({ t: "number", v: "2" });
  });

  it("a mesma variável duas vezes na MESMA entrada continua erro", () => {
    expect(rodar("let x = 1;\nlet x = 2;", "console").erro?.mensagem).toBe("Identifier 'x' has already been declared");
  });

  it("let sem valor volta a ser undefined ao declarar de novo", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("let x = 1", "console");
    expect(nucleo.executar("let x;\nx", "console").resultado).toEqual({ t: "undefined" });
  });

  it("o Snippet e o Console dividem a mesma memória (como no Chrome)", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("function dobro(n) {\n  return n * 2;\n}", "snippet");
    expect(nucleo.executar("dobro(21)", "console").resultado).toEqual({ t: "number", v: "42" });
  });
});

describe("determinismo e isolamento", () => {
  it("sem opção de teste, Date mostra agora e o sorteio não reinicia com a mesma semente", () => {
    const antes = Date.now();
    const a = criarNucleoNode();
    const b = criarNucleoNode();
    const r = a.executar("[Date.now(), new Date().getTime()]", "console");
    expect(r.erro).toBeNull();
    if (r.resultado.t !== "array") throw new Error("esperava a lista de instantes");
    for (const valor of r.resultado.itens) {
      if (valor.t !== "number") throw new Error("esperava um instante numérico");
      expect(Number(valor.v)).toBeGreaterThanOrEqual(antes);
      expect(Number(valor.v)).toBeLessThanOrEqual(Date.now());
    }
    expect(a.executar("Math.random()", "console").resultado).not.toEqual(b.executar("Math.random()", "console").resultado);
  });

  it("o preparo fixo é uma opção explícita do hospedeiro de testes", () => {
    const fixo = criarNucleoNode({ deterministico: true });
    expect(fixo.executar("new Date().toISOString()", "console").resultado).toEqual({ t: "string", v: "2026-01-05T15:00:00.000Z" });
  });
  it("o mesmo código dá o mesmo rastro (sorteio com semente, relógio parado)", () => {
    const codigo = "const n = Math.random();\nconst d = new Date().toISOString();\nconst agora = Date.now();\nconsole.log(n, d, agora);";
    const a = rodar(codigo);
    const b = rodar(codigo);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.saidas[0].texto).toContain("2026-01-05T15:00:00.000Z");
  });

  it("o código não vê nada do Node nem do jogo", () => {
    const nucleo = criarNucleoNode();
    for (const nome of ["require", "process", "localStorage", "document", "window", "fetch", "globalThis.progresso"]) {
      const r = nucleo.executar(`typeof ${nome}`, "console");
      expect(r.resultado, nome).toEqual({ t: "string", v: "undefined" });
    }
  });

  it("os ganchos não podem ser trocados pelo código", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("__r = null; __r.p = function () {};", "console");
    expect(nucleo.executar("while (true) {}", "console").erro?.tipo).toBe("limite-passos");
  });
});

describe("teste de funções (funcaoPassa)", () => {
  it("roda a função do jogador com cada caso e compara o retorno", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("function precoFinal(preco, desconto) {\n  return preco - preco * desconto;\n}", "snippet");
    const r = nucleo.testarFuncao("precoFinal", [
      { args: [100, 0.1], esperado: 90 },
      { args: [10, 0.3], esperado: 7 },
      { args: [50, 0], esperado: 50 },
    ]);
    expect(r.passou).toBe(true);
  });

  it("console.log no lugar do return não passa (a confusão principal)", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("function dobro(n) {\n  console.log(n * 2);\n}", "snippet");
    const r = nucleo.testarFuncao("dobro", [{ args: [2], esperado: 4 }]);
    expect(r.passou).toBe(false);
    expect(r.casos[0].obtido).toEqual({ t: "undefined" });
  });

  it("função que não existe, que dá erro ou que trava", () => {
    const nucleo = criarNucleoNode();
    expect(nucleo.testarFuncao("nada", [{ args: [], esperado: 1 }]).existe).toBe(false);
    nucleo.executar("const quebra = (o) => o.x.y;\nfunction trava() { while (true) {} }", "snippet");
    expect(nucleo.testarFuncao("quebra", [{ args: [{}], esperado: 1 }]).casos[0].erro?.nome).toBe("TypeError");
    expect(nucleo.testarFuncao("trava", [{ args: [], esperado: 1 }]).casos[0].erro?.tipo).toBe("limite-passos");
  });

  it("listas e objetos no retorno (arredondamento tolerado)", () => {
    const nucleo = criarNucleoNode();
    nucleo.executar("const pares = (l) => l.filter((n) => n % 2 === 0);\nconst ficha = (n) => ({ nome: n, total: 0.1 + 0.2 });", "snippet");
    expect(nucleo.testarFuncao("pares", [{ args: [[1, 2, 3, 4]], esperado: [2, 4] }]).passou).toBe(true);
    expect(nucleo.testarFuncao("ficha", [{ args: ["Ana"], esperado: { total: 0.3, nome: "Ana" } }]).passou).toBe(true);
    expect(valorIgual({ t: "array", itens: [], tamanho: 0 }, [1])).toBe(false);
  });
});
