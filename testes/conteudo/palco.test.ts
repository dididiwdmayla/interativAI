/*
 * O plano do palco da memória (src/motor/palco.ts), com fotos de verdade do
 * executor: lista desenhada uma vez só e seta para quem aponta para ela,
 * moldura de função enquanto ela roda, o que surge e o que muda.
 */
import { describe, expect, it } from "vitest";
import { criarNucleoNode } from "@/motor/executor/node";
import { mudancasDoPalco, NOME_DO_TIPO, planoDoPalco, tipoDoNo } from "@/motor/palco";

const rodar = (codigo: string) => criarNucleoNode().executar(codigo, "snippet");

describe("plano do palco", () => {
  it("caixinhas com nome, declaração e tipo", () => {
    const r = rodar("let nome = 'Ana';\nconst idade = 30;\nlet ativo = true;\nlet nada = null;\nlet talvez;");
    const [global] = planoDoPalco(r.memoriaFinal).quadros;
    const variaveis = global.escopos[0].variaveis;
    expect(variaveis.map((v) => [v.nome, v.declaracao, NOME_DO_TIPO[tipoDoNo(v.valor)]])).toEqual([
      ["nome", "let", "texto"],
      ["idade", "const", "número"],
      ["ativo", "let", "booleano"],
      ["nada", "let", "null"],
      ["talvez", "let", "undefined"],
    ]);
  });

  it("a mesma lista em duas variáveis: desenhada na primeira, seta na segunda", () => {
    const r = rodar("let a = [1, 2];\nlet b = a;\nlet c = [1, 2];");
    const plano = planoDoPalco(r.memoriaFinal);
    const [a, b, c] = plano.quadros[0].escopos[0].variaveis;
    expect(a.valor.t).toBe("lista");
    expect(b.valor).toMatchObject({ t: "ponteiro", dono: "a" });
    expect(c.valor.t).toBe("lista");
    expect(plano.setas).toBe(1);
  });

  it("lista de objetos: fichas dentro dos vagões; o mesmo objeto repetido vira seta", () => {
    const r = rodar("const pao = { nome: 'Pão', preco: 1 };\nconst cardapio = [pao, { nome: 'Bolo', preco: 8 }];");
    const [pao, cardapio] = planoDoPalco(r.memoriaFinal).quadros[0].escopos[0].variaveis;
    expect(pao.valor.t).toBe("ficha");
    if (cardapio.valor.t !== "lista") throw new Error("cardápio devia ser lista");
    expect(cardapio.valor.itens[0]).toMatchObject({ t: "ponteiro", dono: "pao" });
    expect(cardapio.valor.itens[1]).toMatchObject({ t: "ficha", campos: [["nome", { t: "primitivo" }], ["preco", { t: "primitivo" }]] });
  });

  it("objeto que aponta para ele mesmo não trava o desenho", () => {
    const r = rodar("const o = { nome: 'eu' };\no.eu = o;");
    const [o] = planoDoPalco(r.memoriaFinal).quadros[0].escopos[0].variaveis;
    if (o.valor.t !== "ficha") throw new Error("o devia ser ficha");
    expect(o.valor.campos[1][1]).toMatchObject({ t: "ponteiro", dono: "o" });
  });

  it("moldura da função só enquanto ela roda", () => {
    const r = rodar("function dobro(n) {\n  const d = n * 2;\n  return d;\n}\nconst x = dobro(4);");
    const molduras = r.passos.map((p) => planoDoPalco(p.memoria).quadros.map((q) => q.nome));
    expect(molduras).toEqual([["Global"], ["Global", "dobro"], ["Global", "dobro"], ["Global", "dobro"], ["Global"]]);
  });

  it("o que surge e o que muda, passo a passo (inclusive dentro da lista)", () => {
    const r = rodar("let total = 0;\nconst lista = [1];\ntotal = 5;\nlista.push(2);");
    const planos = r.passos.map((p) => planoDoPalco(p.memoria));
    const chave = (nome: string) => planos[planos.length - 1].quadros[0].escopos[0].variaveis.find((v) => v.nome === nome)?.chave ?? "";
    expect([...mudancasDoPalco(planos[1], planos[0]).novas]).toEqual([chave("total")]);
    expect([...mudancasDoPalco(planos[3], planos[2]).mudaram]).toEqual([chave("total")]);
    expect([...mudancasDoPalco(planos[4], planos[3]).mudaram]).toEqual([chave("lista")]);
    expect(mudancasDoPalco(planos[4], null)).toEqual({ novas: new Set(), mudaram: new Set() });
  });
});
