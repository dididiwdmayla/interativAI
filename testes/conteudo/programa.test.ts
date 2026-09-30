/*
 * Fases de programa (Ilha Lógica): validadores de código, ações do Console
 * e do Snippet na simulação (o mesmo executor do jogo, no vm do Node) e a
 * regra "fase-de-programa" da fábrica.
 */
import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASE_BANCADA_CONSOLE } from "@/conteudo/laboratorio/bancadaLogica";
import type { Fase, FasePratica, Validador } from "@/conteudo/tipos";
import { criarSimulacao } from "@/motor/simulacao";
import { validadorTravado } from "@/motor/validadores";

function problemas(fase: Fase): string[] {
  return REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] }).map((p) => `${regra.id}: ${p}`));
}

describe("bancada do Console", () => {
  it("passa em todas as regras de fase (dados e simulação)", () => {
    expect(problemas(FASE_BANCADA_CONSOLE)).toEqual([]);
  });
});

describe("validadores de código na simulação", () => {
  const simular = () => {
    const sim = criarSimulacao(FASE_BANCADA_CONSOLE);
    sim.comecarObjetivo(null);
    return sim;
  };
  const passa = (sim: ReturnType<typeof simular>, v: Validador) => sim.avaliar(v).passou;

  it("respostaDoConsole: a resposta de uma expressão, não o console.log", () => {
    const sim = simular();
    sim.executar([{ tipo: "executarNoConsole", codigo: "console.log(14)" }]);
    expect(passa(sim, { tipo: "respostaDoConsole", valor: 14 })).toBe(false);
    sim.executar([{ tipo: "executarNoConsole", codigo: "7 * 2" }]);
    expect(passa(sim, { tipo: "respostaDoConsole", valor: 14 })).toBe(true);
  });

  it("valorVariavel olha a memória de agora (listas e objetos também)", () => {
    const sim = simular();
    // O preparo já pôs a taxa na memória.
    expect(passa(sim, { tipo: "valorVariavel", nome: "taxa", valor: 2 })).toBe(true);
    expect(passa(sim, { tipo: "valorVariavel", nome: "lista", valor: [1, 2] })).toBe(false);
    sim.executar([{ tipo: "executarNoConsole", codigo: "let lista = [1, 2]; let ficha = { nome: 'Ana' }" }]);
    expect(passa(sim, { tipo: "valorVariavel", nome: "taxa", valor: 2 })).toBe(true);
    expect(passa(sim, { tipo: "valorVariavel", nome: "lista", valor: [1, 2] })).toBe(true);
    expect(passa(sim, { tipo: "valorVariavel", nome: "ficha", valor: { nome: "Ana" } })).toBe(true);
    expect(passa(sim, { tipo: "valorVariavel", nome: "lista", valor: [1] })).toBe(false);
  });

  it("saida (contem e igual numa mesma execução) e semErro", () => {
    const sim = simular();
    expect(passa(sim, { tipo: "semErro" })).toBe(false);
    sim.executar([{ tipo: "executarNoConsole", codigo: "console.log('a'); console.log('b', 2)" }]);
    expect(passa(sim, { tipo: "saida", igual: ["a", "b 2"] })).toBe(true);
    expect(passa(sim, { tipo: "saida", contem: "b 2" })).toBe(true);
    expect(passa(sim, { tipo: "saida", igual: ["a"] })).toBe(false);
    expect(passa(sim, { tipo: "semErro" })).toBe(true);
    sim.executar([{ tipo: "executarNoConsole", codigo: "naoExiste" }]);
    expect(passa(sim, { tipo: "semErro" })).toBe(false);
    expect(passa(sim, { tipo: "erroDoTipo", nome: "ReferenceError" })).toBe(true);
  });

  it("usouSintaxe lê o código rodado desde o começo do objetivo", () => {
    const sim = simular();
    sim.executar([{ tipo: "executarNoConsole", codigo: "const t = `oi`" }]);
    expect(passa(sim, { tipo: "usouSintaxe", sintaxe: "template" })).toBe(true);
    sim.comecarObjetivo(null);
    expect(passa(sim, { tipo: "usouSintaxe", sintaxe: "template" })).toBe(false);
  });

  it("funcaoPassa roda a função do jogador a cada execução (console.log não passa)", () => {
    const sim = simular();
    const v: Validador = { tipo: "funcaoPassa", nome: "dobro", casos: [{ args: [3], esperado: 6 }] };
    const fase: FasePratica = { ...FASE_BANCADA_CONSOLE, objetivos: [{ ...FASE_BANCADA_CONSOLE.objetivos[1], validador: v }] };
    const outra = criarSimulacao(fase);
    outra.comecarObjetivo(null);
    outra.executar([{ tipo: "definirSnippet", codigo: "function dobro(n) { console.log(n * 2) }" }, { tipo: "executarSnippet" }]);
    const falhou = outra.avaliar(v);
    expect(falhou.passou).toBe(false);
    expect(falhou.detalhe).toContain("dobro(3) devolveu undefined, esperado 6");
    outra.executar([{ tipo: "executarNoConsole", codigo: "function dobro(n) { return n * 2 }" }]);
    expect(outra.avaliar(v).passou).toBe(true);
    void sim;
  });

  it("os validadores de momento travam no checklist; os de estado, não", () => {
    for (const tipo of ["saida", "semErro", "erroDoTipo", "usouSintaxe", "respostaDoConsole"] as const) {
      const v = { tipo, contem: "x", nome: "Error", sintaxe: "if", valor: 1 } as unknown as Validador;
      expect(validadorTravado(v), tipo).toBe(true);
    }
    expect(validadorTravado({ tipo: "valorVariavel", nome: "x", valor: 1 })).toBe(false);
    expect(validadorTravado({ tipo: "funcaoPassa", nome: "f", casos: [{ args: [], esperado: 1 }] })).toBe(false);
  });

  it("o preparo roda quieto: a memória começa com ele, sem evento", () => {
    const sim = simular();
    expect(sim.contexto().eventos).toEqual([]);
    expect(sim.programa().ultimaExecucao?.globais).toEqual([{ nome: "taxa", declaracao: "const" }]);
  });
});

describe("regra fase-de-programa (sabotagens)", () => {
  const base = FASE_BANCADA_CONSOLE;
  const texto = (fase: Fase) => problemas(fase).join("\n");

  it("validador de código fora de fase de programa", () => {
    const sem = { ...base, programa: undefined };
    expect(texto(sem)).toContain("só vale numa fase de programa");
  });

  it("fase de programa com página, sem console ou com Snippet sem a ferramenta", () => {
    expect(texto({ ...base, siteAlvo: { ...base.siteAlvo, body: "<p>oi</p>" } })).toContain("SITE_DO_PROGRAMA");
    expect(texto({ ...base, usaFerramentas: ["snippet"] })).toContain('pede "console"');
    expect(texto({ ...base, usaFerramentas: ["console"], apresentar: ["console"] })).toContain('ponha "snippet"');
  });

  it("funcaoPassa sem casos e saida vazia", () => {
    const objetivos = base.objetivos.map((o, i) =>
      i === 3 ? { ...o, validador: { tipo: "funcaoPassa" as const, nome: "dobro", casos: [] } } : i === 4 ? { ...o, validador: { tipo: "saida" as const } } : o,
    );
    const t = texto({ ...base, objetivos });
    expect(t).toContain("funcaoPassa sem casos");
    expect(t).toContain("saida sem contem nem igual");
  });

  it("linha que aponta a árvore numa fase de programa", () => {
    const objetivos = base.objetivos.map((o, i) =>
      i === 0 && o.modo === "guiado" ? { ...o, ajudas: { ...o.ajudas, linha: { alvo: "arvore" as const, seletor: "p", fala: "aqui" } } } : o,
    );
    expect(texto({ ...base, objetivos })).toContain("fase de programa não tem arvore");
  });
});
