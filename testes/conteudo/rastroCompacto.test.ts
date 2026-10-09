import { it, expect } from "vitest";
import { serialize } from "node:v8";
import { criarNucleoNode } from "@/motor/executor/node";

it("transporta recursão profunda sem duplicar os quadros externos de cada foto", () => {
  const r = criarNucleoNode({ deterministico: true }).executar("function f(n) { if(n === 0) return 0; return 1 + f(n-1); } console.log(f(80));", "snippet");
  expect(r.erro).toBeNull();
  expect(r.saidas[0].texto).toBe("80");
  // Orçamento do payload, não de tempo: o clone do worker não precisa repetir
  // o mesmo quadro em todas as fotos. Também verifica o transporte completo.
  expect(serialize(r).byteLength).toBeLessThan(120_000);
  expect(structuredClone(r)).toEqual(r);
});

it("compartilhar quadros não altera fotos antigas nem congela valores atuais", () => {
  const r = criarNucleoNode({ deterministico: true }).executar("let x = 0; const a = [0]; function f(n) { x++; a[0]++; if(n) f(n-1); } f(3); console.log(x, a[0]);", "snippet");
  expect(r.erro).toBeNull();
  expect(r.saidas[0].texto).toBe("4 4");
  const valores = r.passos.flatMap(p => p.memoria.quadros[0].escopos.flatMap(e => e.variaveis.filter(v => v.nome === "x").map(v => v.valor)));
  expect(valores).toContainEqual({t:"number",v:"0"});
  expect(valores).toContainEqual({t:"number",v:"4"});
  const listas = r.passos.flatMap(p => Object.values(p.memoria.monte).filter(o => o.t === "array").map(o => o.itens[0]));
  expect(listas).toContainEqual({t:"number",v:"0"});
  expect(listas).toContainEqual({t:"number",v:"4"});
});
