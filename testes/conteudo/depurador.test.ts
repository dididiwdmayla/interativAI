/*
 * O depurador da aba Fontes (src/motor/depurador.ts) sobre o rastro do
 * executor: pausa no ponto de parada e no debugger;, os quatro controles
 * do Chrome, o ponto de parada que escorrega para a linha com código, os
 * painéis Escopo e Pilha de chamadas e as expressões do Observar avaliadas
 * no momento pausado (NucleoExecutor.avaliarNaFoto).
 */
import { describe, expect, it } from "vitest";
import { criarNucleoNode } from "@/motor/executor/node";
import type { ResultadoAvaliacao } from "@/motor/executor/tipos";
import {
  linhaDoPontoDeParada,
  normalizarExpressao,
  pilhaDeChamadas,
  primeiraPausa,
  proximaPausa,
  secoesDoEscopo,
  valorDoNome,
} from "@/motor/depurador";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASE_BANCADA_CONSOLE, FASE_DEMO_DEPURADOR } from "@/conteudo/laboratorio/bancadaLogica";
import { criarSimulacao } from "@/motor/simulacao";

const PROGRAMA = [
  "function dobro(n) {", // 1
  "  const d = n * 2;", // 2
  "  return d;", // 3
  "}", // 4
  "let total = 0;", // 5
  "for (let i = 1; i <= 2; i++) {", // 6
  "  total = total + dobro(i);", // 7
  "}", // 8
  "console.log(total);", // 9
].join("\n");

function rodar(codigo = PROGRAMA) {
  const nucleo = criarNucleoNode({ deterministico: true });
  return { nucleo, resultado: nucleo.executar(codigo, "snippet") };
}

const texto = (r: ResultadoAvaliacao) => ("valor" in r ? ("v" in r.valor ? String(r.valor.v) : r.valor.t) : `erro: ${r.erro}`);

describe("pausas e controles", () => {
  it("pausa no ponto de parada antes da linha rodar, e retomar vai ao próximo", () => {
    const { resultado } = rodar();
    const pausa = primeiraPausa(resultado.passos, [7]);
    expect(pausa?.linha).toBe(7);
    expect(pausa?.motivo).toBe("ponto-de-parada");
    const passo = resultado.passos[pausa!.indice];
    expect(valorDoNome(passo.memoria, passo.memoria.quadros.length - 1, "total")).toEqual({ t: "number", v: "0" });
    expect(valorDoNome(passo.memoria, 0, "i")).toEqual({ t: "number", v: "1" });
    const segunda = proximaPausa(resultado.passos, pausa!.indice, "retomar", [7]);
    expect(segunda?.linha).toBe(7);
    const p2 = resultado.passos[segunda!.indice];
    expect(valorDoNome(p2.memoria, 0, "total")).toEqual({ t: "number", v: "2" });
    expect(proximaPausa(resultado.passos, segunda!.indice, "retomar", [7])).toBeNull();
  });

  it("passar por cima não entra na função; entrar entra; sair volta para quem chamou", () => {
    const { resultado } = rodar();
    const pausa = primeiraPausa(resultado.passos, [7])!;
    const porCima = proximaPausa(resultado.passos, pausa.indice, "passar-por-cima", [7])!;
    expect(porCima.linha).toBe(7);
    expect(resultado.passos[porCima.indice].memoria.quadros.length).toBe(1);
    expect(valorDoNome(resultado.passos[porCima.indice].memoria, 0, "i")).toEqual({ t: "number", v: "2" });
    const dentro = proximaPausa(resultado.passos, pausa.indice, "entrar", [7])!;
    expect(dentro.linha).toBe(2);
    const memoria = resultado.passos[dentro.indice].memoria;
    expect(pilhaDeChamadas(memoria).map((q) => [q.nome, q.linha])).toEqual([
      ["dobro", 2],
      ["(anônima)", 7],
    ]);
    const fora = proximaPausa(resultado.passos, dentro.indice, "sair", [])!;
    expect(resultado.passos[fora.indice].memoria.quadros.length).toBe(1);
  });

  it("andando dentro da função, a última linha para no retorno (com o valor devolvido no Escopo)", () => {
    const { resultado } = rodar();
    const dentro = proximaPausa(resultado.passos, primeiraPausa(resultado.passos, [7])!.indice, "entrar", [])!;
    const linha3 = proximaPausa(resultado.passos, dentro.indice, "passar-por-cima", [])!;
    expect(linha3.linha).toBe(3);
    const retorno = proximaPausa(resultado.passos, linha3.indice, "passar-por-cima", [])!;
    const passo = resultado.passos[retorno.indice];
    expect(passo.tipo).toBe("retorno");
    const secoes = secoesDoEscopo(passo.memoria, passo.memoria.quadros.length - 1, passo.retorno?.valor);
    expect(secoes[0].titulo).toBe("Local");
    expect(secoes[0].variaveis[0]).toEqual({ nome: "Valor devolvido", valor: { t: "number", v: "2" } });
  });

  it("a instrução debugger; pausa como um ponto de parada (e não aparece no código que roda)", () => {
    const { resultado } = rodar("let a = 1;\ndebugger;\na = a + 1;\na");
    expect(resultado.erro).toBeNull();
    expect(resultado.resultado).toEqual({ t: "number", v: "2" });
    expect(resultado.sintaxes).toContain("debugger");
    const pausa = primeiraPausa(resultado.passos, []);
    expect(pausa).toEqual({ indice: 1, motivo: "debugger", linha: 2 });
  });

  it("sem ponto de parada, o programa roda direto", () => {
    expect(primeiraPausa(rodar().resultado.passos, [])).toBeNull();
  });

  it("o ponto de parada numa linha sem código escorrega para a próxima com código", () => {
    expect(linhaDoPontoDeParada(PROGRAMA, 4)).toBe(5);
    expect(linhaDoPontoDeParada(PROGRAMA, 8)).toBe(9);
    expect(linhaDoPontoDeParada(PROGRAMA, 7)).toBe(7);
    expect(linhaDoPontoDeParada("let x = (", 1)).toBe(1);
    expect(normalizarExpressao(" total + 1 ")).toBe("total+1");
  });
});

describe("painéis", () => {
  it("Escopo: Bloco, Local, Script e Global, como no Chrome", () => {
    const { resultado } = rodar("var v = 1;\nconst c = 2;\nfunction f(x) {\n  if (x) {\n    let dentro = x;\n    return dentro;\n  }\n}\nf(3);");
    const pausa = primeiraPausa(resultado.passos, [6])!;
    const memoria = resultado.passos[pausa.indice].memoria;
    const secoes = secoesDoEscopo(memoria, memoria.quadros.length - 1);
    expect(secoes.map((s) => s.titulo)).toEqual(["Bloco", "Local", "Script", "Global"]);
    expect(secoes[0].variaveis.map((v) => v.nome)).toEqual(["dentro"]);
    expect(secoes[1].variaveis.map((v) => v.nome)).toEqual(["x"]);
    expect(secoes[2].variaveis.map((v) => v.nome)).toEqual(["c"]);
    expect(secoes[3].variaveis.map((v) => v.nome)).toEqual(["f", "v"]);
  });

  it("Observar: expressões avaliadas no momento pausado, no quadro escolhido, sem mudar o programa", () => {
    const { nucleo, resultado } = rodar();
    const pausa = primeiraPausa(resultado.passos, [7])!;
    const memoria = resultado.passos[pausa.indice].memoria;
    const r = nucleo.avaliarNaFoto(["total", "total + 10", "i * 100", "naoExiste", "total = 99", "1 +"], memoria, 0);
    expect(r.map(texto)).toEqual(["0", "10", "100", "erro: ReferenceError: naoExiste is not defined", "99", "erro: SyntaxError: não é uma expressão"]);
    // A cópia mudou, o programa não.
    expect(nucleo.executar("total", "console").resultado).toEqual({ t: "number", v: "6" });
  });

  it("Observar: global criada depois do momento pausado ainda não existe; lista é copiada", () => {
    const { nucleo, resultado } = rodar("let lista = [1, 2];\nlista.push(3);\nlet depois = 5;");
    const pausa = primeiraPausa(resultado.passos, [2])!;
    const memoria = resultado.passos[pausa.indice].memoria;
    const r = nucleo.avaliarNaFoto(["lista.length", "depois", "lista.includes(2)"], memoria, 0);
    expect(r.map(texto)).toEqual(["2", "erro: ReferenceError: depois is not defined", "true"]);
  });

  it("Observar dentro da função: os parâmetros e as variáveis do quadro", () => {
    const { nucleo, resultado } = rodar();
    const dentro = proximaPausa(resultado.passos, primeiraPausa(resultado.passos, [7])!.indice, "entrar", [])!;
    const memoria = resultado.passos[dentro.indice].memoria;
    expect(nucleo.avaliarNaFoto(["n", "n * 3", "dobro(5)"], memoria, 1).map(texto)).toEqual(["1", "3", "10"]);
    expect(nucleo.avaliarNaFoto(["n"], memoria, 0).map(texto)).toEqual(["erro: ReferenceError: n is not defined"]);
  });
});

describe("depurador na fábrica (simulação, checagens e progresso)", () => {
  it("a demonstração do /lab passa em todas as regras de fase", async () => {
    const problemas = REGRAS_DE_FASE.flatMap((regra) => regra.checar(FASE_DEMO_DEPURADOR, { unidades: [], fases: [FASE_DEMO_DEPURADOR] }).map((p) => `${regra.id}: ${p}`));
    expect(problemas).toEqual([]);
  });

  it("na simulação, o Snippet pausado segura o executouCodigo até o programa terminar", async () => {
    const simulacao = criarSimulacao(FASE_DEMO_DEPURADOR);
    simulacao.executar([{ tipo: "alternarPontoDeParada", linha: 9 }]);
    // A linha 9 é só o fecha-chave: o ponto escorrega para a 10.
    expect(simulacao.programa().depurador.pontos).toEqual([10]);
    simulacao.executar([{ tipo: "executarSnippet" }]);
    expect(simulacao.programa().pausa?.linha).toBe(10);
    expect(simulacao.contexto().eventos.some((e) => e.tipo === "executouCodigo")).toBe(false);
    expect(simulacao.avaliar({ tipo: "pausouNaLinha", linha: 10 }).passou).toBe(true);
    simulacao.executar([{ tipo: "observar", expressao: "total" }]);
    expect(simulacao.avaliar({ tipo: "observou", expressao: "total", valor: 90 }).passou).toBe(true);
    simulacao.executar([{ tipo: "controlarDepurador", controle: "retomar" }]);
    expect(simulacao.programa().pausa).toBeNull();
    expect(simulacao.avaliar({ tipo: "saida", contem: "90" }).passou).toBe(true);
    expect(() => simulacao.executar([{ tipo: "controlarDepurador", controle: "retomar" }])).toThrow(/não está pausado/);
  });

  it("sabotagem: validador do depurador sem o depurador, ferramenta faltando e linha 0", async () => {
    const texto = (fase: Parameters<(typeof REGRAS_DE_FASE)[number]["checar"]>[0]) =>
      REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] })).join("\n");
    const semDepurador = { ...FASE_BANCADA_CONSOLE, objetivos: [{ ...FASE_BANCADA_CONSOLE.objetivos[1], validador: { tipo: "pausouNaLinha" as const, linha: 2 } }] };
    expect(texto(semDepurador)).toContain("só vale numa fase com o depurador");
    const semObservar = { ...FASE_DEMO_DEPURADOR, usaFerramentas: FASE_DEMO_DEPURADOR.usaFerramentas.filter((id) => id !== "painel-observar") };
    expect(texto(semObservar)).toContain('pede "painel-observar"');
    const linhaZero = { ...FASE_DEMO_DEPURADOR, objetivos: [{ ...FASE_DEMO_DEPURADOR.objetivos[0], validador: { tipo: "pontoDeParada" as const, linha: 0 } }] };
    expect(texto(linhaZero)).toContain("as linhas do Snippet começam em 1");
  });
});
