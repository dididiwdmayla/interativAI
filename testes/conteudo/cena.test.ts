/*
 * Cenas programáveis (src/motor/cena): o relógio simulado, os dispositivos
 * no reino do código, o fim da simulação, a proteção do loop sem esperar() e
 * o rastro com o instante de cada mudança.
 */
import { describe, expect, it } from "vitest";
import { criarNucleoNode } from "@/motor/executor/node";
import { explicarErro } from "@/motor/executor/erros";
import { criarSimulacao } from "@/motor/simulacao";
import { FASE_DEMO_RESOLVER } from "@/conteudo/laboratorio/bancadaResolver";
import type { FasePratica } from "@/conteudo/tipos";
import { type DadosCena, estadoNoTempo, pessoasPresentes, temperaturaDoForno, valorNoTempo } from "@/motor/cena/modelo";

const QUARTO: DadosCena = {
  id: "quarto-teste",
  titulo: "Quarto de teste",
  ambiente: "quarto",
  periodo: "noite",
  duracaoMs: 6000,
  cenario: [],
  dispositivos: [
    { id: "lampada", tipo: "lampada", x: 160, y: 20 },
    { id: "ventilador", tipo: "ventilador", x: 60, y: 120 },
    { id: "forno", tipo: "forno", x: 200, y: 120 },
    { id: "letreiro", tipo: "letreiro", x: 100, y: 10 },
  ],
  linhaDoTempo: [],
};

const VITRINE: DadosCena = {
  id: "vitrine-teste",
  titulo: "Vitrine de teste",
  ambiente: "vitrine",
  periodo: "noite",
  duracaoMs: 10_000,
  cenario: [],
  dispositivos: [
    { id: "luz", tipo: "lampada", x: 160, y: 30 },
    { id: "sensor", tipo: "sensor", x: 200, y: 40 },
  ],
  linhaDoTempo: [{ tipo: "pessoa", chegaMs: 3000, saiMs: 7000 }],
};

function nucleoCom(dados: DadosCena) {
  const nucleo = criarNucleoNode({ deterministico: true });
  nucleo.definirCena(dados);
  return nucleo;
}

describe("dispositivos e relógio simulado", () => {
  it("piscar 3 vezes: as mudanças ficam no rastro com o instante", () => {
    const nucleo = nucleoCom(QUARTO);
    const r = nucleo.executar("for (let i = 0; i < 3; i++) {\n  lampada.ligar();\n  esperar(500);\n  lampada.desligar();\n  esperar(500);\n}", "snippet");
    expect(r.erro).toBeNull();
    const mudancas = r.cena?.mudancas.map((m) => [m.acao, m.tempoMs]);
    expect(mudancas).toEqual([
      ["ligar", 0],
      ["desligar", 500],
      ["ligar", 1000],
      ["desligar", 1500],
      ["ligar", 2000],
      ["desligar", 2500],
    ]);
    // Depois do Snippet, o mundo continua até o fim da cena.
    expect(r.cena?.fimCodigoMs).toBe(3000);
    expect(r.cena?.relogioMs).toBe(6000);
    expect(r.cena?.terminouPorTempo).toBe(false);
    // Cada passo tem o instante; a mudança aponta o passo seguinte ao da linha que a fez.
    expect(r.passos.every((p) => typeof p.tempoMs === "number")).toBe(true);
    const primeira = r.cena?.mudancas[0];
    expect(primeira?.passo).toBeGreaterThan(0);
    expect(r.passos[(primeira?.passo ?? 1) - 1]?.linha).toBe(2);
  });

  it("ligar duas vezes não é mudança; o estado no tempo acompanha", () => {
    const nucleo = nucleoCom(QUARTO);
    const r = nucleo.executar("lampada.ligar();\nlampada.ligar();\nesperar(1000);\nlampada.brilho = 40;", "snippet");
    const rastro = r.cena;
    if (!rastro) throw new Error("sem rastro");
    expect(rastro.mudancas.map((m) => m.acao)).toEqual(["ligar", "brilho"]);
    expect(valorNoTempo(rastro, "lampada", "brilho", 500)).toBe(100);
    expect(valorNoTempo(rastro, "lampada", "brilho", 1000)).toBe(40);
    expect(valorNoTempo(rastro, "lampada", "ligada", 0, { antes: true })).toBe(false);
  });

  it("while (true) com esperar termina com o fim da simulação, sem erro", () => {
    const nucleo = nucleoCom(VITRINE);
    const r = nucleo.executar("while (true) {\n  if (sensor.temGente) {\n    luz.ligar();\n  } else {\n    luz.desligar();\n  }\n  esperar(100);\n}", "snippet");
    expect(r.erro).toBeNull();
    expect(r.cena?.terminouPorTempo).toBe(true);
    expect(r.cena?.relogioMs).toBe(10_000);
    expect(r.cena?.mudancas.map((m) => [m.acao, m.tempoMs])).toEqual([
      ["ligar", 3000],
      ["desligar", 7000],
    ]);
  });

  it("um try/catch em volta do esperar não segura o fim da simulação", () => {
    const nucleo = nucleoCom(VITRINE);
    const r = nucleo.executar("let voltas = 0;\nwhile (true) {\n  voltas++;\n  try { esperar(1000); } catch (e) {}\n}", "snippet");
    expect(r.erro).toBeNull();
    expect(r.cena?.terminouPorTempo).toBe(true);
  });

  it("loop sem esperar continua protegido, com a dica da cena", () => {
    const nucleo = nucleoCom(VITRINE);
    const r = nucleo.executar("while (true) {\n  if (sensor.temGente) luz.ligar();\n}", "snippet");
    expect(r.erro?.tipo).toBe("limite-passos");
    expect(r.erro?.naCena).toBe("sem-esperar");
    expect(explicarErro(r.erro ?? { tipo: "limite-passos", nome: "", mensagem: "", linha: null, coluna: null }).dica).toContain("esperar(ms)");
    const curto = nucleo.executar("while (true) {\n  esperar(0);\n}", "snippet");
    expect(curto.erro?.naCena).toBe("esperar-curto");
  });

  it("o Console continua a cena de onde ela está; o Snippet recomeça", () => {
    const nucleo = nucleoCom(VITRINE);
    expect(nucleo.executar("sensor.temGente", "console").resultado).toEqual({ t: "boolean", v: false });
    nucleo.executar("esperar(3500)", "console");
    expect(nucleo.executar("sensor.temGente", "console").resultado).toEqual({ t: "boolean", v: true });
    const r = nucleo.executar("luz.ligar()", "console");
    expect(r.cena?.mudancas.map((m) => m.tempoMs)).toEqual([3500]);
    const novo = nucleo.executar("luz.desligar();", "snippet");
    expect(novo.cena?.mudancas).toEqual([]);
    expect(novo.cena?.relogioMs).toBe(10_000);
  });

  it("propriedades só de leitura e faixas dão erro em PT-BR", () => {
    const nucleo = nucleoCom(QUARTO);
    const r1 = nucleo.executar("lampada.ligada = true;", "snippet");
    expect(r1.erro?.nome).toBe("TypeError");
    expect(r1.erro?.mensagem).toContain("ligar()");
    const r2 = nucleo.executar("ventilador.velocidade = 5;", "snippet");
    expect(r2.erro?.nome).toBe("RangeError");
    const r3 = nucleo.executar('esperar("um segundo");', "snippet");
    expect(r3.erro?.nome).toBe("TypeError");
    const r4 = nucleo.executar('letreiro.mostrar("PADARIA PAO DE MEL ABERTA");\nletreiro.texto', "console");
    expect(r4.resultado).toEqual({ t: "string", v: "PADARIA PAO DE M" });
  });

  it("o Console mostra o objeto como o Chrome: classe e propriedades", () => {
    const nucleo = nucleoCom(QUARTO);
    const r = nucleo.executar("lampada", "console");
    expect(r.resultado).toMatchObject({ t: "objeto", classe: "Lampada", entradas: [["ligada", { t: "boolean", v: false }], ["brilho", { t: "number", v: "100" }]] });
    // Os dispositivos não entram no palco (só o que o aluno declara).
    expect(r.memoriaFinal.quadros[0].escopos[0].variaveis).toEqual([]);
  });

  it("forno: a temperatura sobe ligado e desce desligado", () => {
    expect(temperaturaDoForno(false, [{ tempoMs: 0, ligado: true }], 2000)).toBe(105);
    expect(temperaturaDoForno(false, [{ tempoMs: 0, ligado: true }, { tempoMs: 2000, ligado: false }], 4000)).toBe(75);
    const nucleo = nucleoCom(QUARTO);
    const r = nucleo.executar("forno.ligar();\nwhile (forno.temperatura < 180) {\n  esperar(500);\n}\nforno.desligar();", "snippet");
    expect(r.erro).toBeNull();
    expect(r.cena?.mudancas.map((m) => [m.acao, m.tempoMs])).toEqual([
      ["ligar", 0],
      ["desligar", 4000],
    ]);
  });

  it("testes de função não mexem na simulação", () => {
    const nucleo = nucleoCom(QUARTO);
    nucleo.executar("function acender() { lampada.ligar(); esperar(100); return lampada.ligada; }", "snippet");
    const teste = nucleo.testarFuncao("acender", [{ args: [], esperado: true }]);
    expect(teste.passou).toBe(true);
    expect(nucleo.rastroDaCena()?.mudancas).toEqual([]);
  });

  it("variosCenarios: o código roda com cada linha do tempo, e a memória fica a da execução de verdade", () => {
    const nucleo = nucleoCom(VITRINE);
    const outra = [{ tipo: "pessoa" as const, chegaMs: 6000, saiMs: 8000 }];
    const r = nucleo.executar("let vezes = 0;\nwhile (true) {\n  if (sensor.temGente) { luz.ligar(); vezes++; }\n  esperar(500);\n}", "snippet", { cenarios: [outra] });
    const variante = r.cenarios?.[JSON.stringify(outra)];
    expect(variante?.mudancas.map((m) => m.tempoMs)).toEqual([6000]);
    expect(r.cena?.mudancas.map((m) => m.tempoMs)).toEqual([3000]);
    expect(nucleo.executar("vezes", "console").resultado).toEqual({ t: "number", v: "8" });
  });
});

describe("linha do tempo do cenário", () => {
  it("presença e estado no tempo", () => {
    expect(pessoasPresentes(VITRINE.linhaDoTempo, 2999)).toBe(0);
    expect(pessoasPresentes(VITRINE.linhaDoTempo, 3000)).toBe(1);
    expect(pessoasPresentes(VITRINE.linhaDoTempo, 3000, true)).toBe(0);
    expect(pessoasPresentes(VITRINE.linhaDoTempo, 7000)).toBe(0);
    const nucleo = nucleoCom(VITRINE);
    const rastro = nucleo.executar("", "console").cena;
    if (!rastro) throw new Error("sem rastro");
    expect(estadoNoTempo(rastro, 5000).sensor.temGente).toBe(true);
  });
});

describe("a cena na simulação dos testes (o mesmo motor do jogo)", () => {
  it("o Snippet de uma fase com cena roda com os dispositivos e guarda a simulação", () => {
    const fase: FasePratica = {
      ...FASE_DEMO_RESOLVER,
      areas: ["cena", "snippet", "palco"],
      plano: undefined,
      testes: undefined,
      cena: VITRINE,
      usaFerramentas: ["cena", "snippet", "console", "palco-memoria", "linha-do-tempo"],
    };
    const simulacao = criarSimulacao(fase);
    simulacao.executar([
      { tipo: "definirSnippet", codigo: "while (true) {\n  if (sensor.temGente) luz.ligar();\n  esperar(250);\n}" },
      { tipo: "executarSnippet" },
    ]);
    expect(simulacao.programa().ultimaExecucao?.erro).toBeNull();
    expect(simulacao.cena()?.mudancas.map((m) => [m.acao, m.tempoMs])).toEqual([["ligar", 3000]]);
    expect(simulacao.cena()?.terminouPorTempo).toBe(true);
  });
});
