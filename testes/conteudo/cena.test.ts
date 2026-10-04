/*
 * Cenas programáveis (src/motor/cena): o relógio simulado, os dispositivos
 * no reino do código, o fim da simulação, a proteção do loop sem esperar() e
 * o rastro com o instante de cada mudança.
 */
import { describe, expect, it } from "vitest";
import { criarNucleoNode } from "@/motor/executor/node";
import { instanteDoPasso } from "@/motor/executor/tipos";
import { explicarErro } from "@/motor/executor/erros";
import { criarSimulacao, momentoDaFoto } from "@/motor/simulacao";
import { REGRAS_DE_FASE, REGRAS_GERAIS } from "@/conteudo/checagens";
import { CODIGO_ACENDER, CODIGO_PISCAR, CODIGO_VITRINE, FASE_DEMO_QUARTO, FASE_DEMO_VITRINE, FASES_BANCADA_CENAS, UNIDADE_BANCADA_CENAS } from "@/conteudo/laboratorio/bancadaCenas";
import { CENA_QUARTO, CENA_VITRINE } from "@/conteudo/laboratorio/cenasDeReferencia";
import { FASE_DEMO_RESOLVER } from "@/conteudo/laboratorio/bancadaResolver";
import type { FasePratica, Validador } from "@/conteudo/tipos";
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

  it("depurador pausado: o Observar lê os dispositivos no instante da pausa, e a simulação volta", () => {
    const nucleo = nucleoCom({ ...VITRINE, dispositivos: [...VITRINE.dispositivos, { id: "forno", tipo: "forno", x: 60, y: 120 }] });
    const r = nucleo.executar("luz.ligar();\nforno.ligar();\nesperar(4000);\nluz.desligar();\nlet fim = 1;", "snippet");
    const ler = (indice: number) =>
      nucleo.avaliarNaFoto(["luz.ligada", "sensor.temGente", "forno.temperatura"], r.passos[indice].memoria, 0, instanteDoPasso(r, indice)).map((x) => ("valor" in x ? x.valor.v : x.erro));
    // Cada pausa mostra o mundo ANTES da linha pausada rodar, como o palco.
    expect(r.passos.map((p) => p.linha).slice(0, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(ler(0)).toEqual([false, false, "25"]);
    expect(ler(1)).toEqual([true, false, "25"]);
    expect(ler(3)).toEqual([true, true, "185"]);
    expect(ler(4)).toEqual([false, true, "185"]);
    // Observar um comando não muda a simulação de verdade.
    nucleo.avaliarNaFoto(["luz.ligar()"], r.passos[4].memoria, 0, instanteDoPasso(r, 4));
    expect(nucleo.rastroDaCena()?.mudancas.map((m) => m.acao)).toEqual(["ligar", "ligar", "desligar"]);
    expect(nucleo.rastroDaCena()?.relogioMs).toBe(10_000);
  });

  it("variosCenarios: o código roda com cada linha do tempo, e a memória fica a da execução de verdade", () => {
    const nucleo = nucleoCom(VITRINE);
    const outra = [{ tipo: "pessoa" as const, chegaMs: 6000, saiMs: 8000 }];
    const r = nucleo.executar("let vezes = 0;\nwhile (true) {\n  if (sensor.temGente) { luz.ligar(); vezes++; }\n  esperar(500);\n}", "snippet", { cenarios: [outra] });
    const variante = r.cenarios?.[JSON.stringify(outra)];
    expect(variante?.mudancas.map((m) => m.tempoMs)).toEqual([6000]);
    expect(r.cena?.mudancas.map((m) => m.tempoMs)).toEqual([3000]);
    expect(nucleo.executar("vezes", "console").resultado).toEqual({ t: "number", v: "8" });
    // As outras linhas do tempo continuam valendo depois (o Console e a memória que volta ao recarregar as trazem junto).
    expect(nucleo.executar("", "console").cenarios?.[JSON.stringify(outra)]?.mudancas).toHaveLength(1);
  });

  it("restaurar (recarregar a página) roda o Snippet com as linhas do tempo de teste de novo", () => {
    const nucleo = nucleoCom(VITRINE);
    const outra = [{ tipo: "pessoa" as const, chegaMs: 6000, saiMs: 8000 }];
    // Como o Worker faz no "repetir": sem gravar, com as linhas do tempo da fase.
    nucleo.executar("while (true) {\n  if (sensor.temGente) luz.ligar();\n  esperar(100);\n}", "snippet", { gravar: false, cenarios: [outra] });
    const agora = nucleo.executar("", "console");
    expect(agora.cena?.mudancas.map((m) => m.tempoMs)).toEqual([3000]);
    expect(agora.cenarios?.[JSON.stringify(outra)]?.mudancas.map((m) => m.tempoMs)).toEqual([6000]);
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
      usaFerramentas: ["cena", "ficha-dispositivo", "velocidade-simulacao", "snippet", "console", "palco-memoria", "linha-do-tempo"],
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

describe("validadores de cena", () => {
  const faseCom = (validador: Validador): FasePratica => ({
    ...FASE_DEMO_RESOLVER,
    areas: ["cena", "snippet", "palco"],
    plano: undefined,
    testes: undefined,
    cena: { ...VITRINE, dispositivos: [...VITRINE.dispositivos, { id: "lampada", tipo: "lampada", x: 40, y: 40 }] },
    usaFerramentas: ["cena", "ficha-dispositivo", "velocidade-simulacao", "snippet", "console", "palco-memoria", "linha-do-tempo"],
    objetivos: [{ ...FASE_DEMO_RESOLVER.objetivos[4], validador }],
  });
  const rodar = (validador: Validador, codigo: string) => {
    const simulacao = criarSimulacao(faseCom(validador));
    const antes = simulacao.avaliar(validador);
    simulacao.executar([
      { tipo: "definirSnippet", codigo },
      { tipo: "executarSnippet" },
    ]);
    return { antes, depois: simulacao.avaliar(validador) };
  };
  const PISCAR = (vezes: number, ms: number) => `for (let i = 0; i < ${vezes}; i++) {\n  lampada.ligar();\n  esperar(${ms});\n  lampada.desligar();\n  esperar(${ms});\n}`;
  const PISCOU_3: Validador = {
    tipo: "sequenciaNaCena",
    dispositivo: "lampada",
    exata: true,
    eventos: [
      { acao: "ligar" },
      { acao: "desligar", aposMs: 500 },
      { acao: "ligar", aposMs: 500 },
      { acao: "desligar", aposMs: 500 },
      { acao: "ligar", aposMs: 500 },
      { acao: "desligar", aposMs: 500 },
    ],
  };
  const LOOP = "while (true) {\n  if (sensor.temGente) {\n    luz.ligar();\n  } else {\n    luz.desligar();\n  }\n  esperar(100);\n}";
  const REAGIU: Validador = { tipo: "reagiu", quando: { dispositivo: "sensor", propriedade: "temGente", valor: true }, entao: { dispositivo: "luz", acao: "ligar" }, prazoMs: 500 };
  const VARIOS: Validador = {
    tipo: "variosCenarios",
    linhasDoTempo: [[{ tipo: "pessoa", chegaMs: 2000, saiMs: 4000 }], [{ tipo: "pessoa", chegaMs: 5500, saiMs: 8000 }], [{ tipo: "pessoa", chegaMs: 1000, saiMs: 2500 }, { tipo: "pessoa", chegaMs: 6000, saiMs: 9000 }]],
    validador: REAGIU,
  };

  it("estadoNaCena: o valor no instante (ou no fim), e nada passa antes de rodar", () => {
    const fim: Validador = { tipo: "estadoNaCena", dispositivo: "lampada", propriedade: "ligada", valor: false };
    const { antes, depois } = rodar(fim, "lampada.ligar();\nesperar(1000);\nlampada.desligar();");
    expect(antes.passou).toBe(false);
    expect(antes.detalhe).toContain("ainda não rodou");
    expect(depois.passou).toBe(true);
    expect(rodar({ tipo: "estadoNaCena", dispositivo: "lampada", propriedade: "ligada", valor: true, noTempo: 500 }, "lampada.ligar();\nesperar(1000);\nlampada.desligar();").depois.passou).toBe(true);
    expect(rodar({ tipo: "estadoNaCena", dispositivo: "lampada", propriedade: "ligada", valor: true, noTempo: 1500 }, "lampada.ligar();\nesperar(1000);\nlampada.desligar();").depois.detalhe).toContain("false");
  });

  it("sequenciaNaCena: pisca 3 vezes no ritmo; 4 vezes, sem esperar ou no ritmo errado não passa", () => {
    expect(rodar(PISCOU_3, PISCAR(3, 500)).depois.passou).toBe(true);
    expect(rodar(PISCOU_3, PISCAR(3, 450)).depois.passou).toBe(true); // dentro da folga de 100 ms
    const quatro = rodar(PISCOU_3, PISCAR(4, 500)).depois;
    expect(quatro.passou).toBe(false);
    expect(quatro.detalhe).toContain("ligar (3,0 s)");
    expect(rodar(PISCOU_3, PISCAR(3, 1000)).depois.passou).toBe(false);
    // Sem esperar, liga e desliga no mesmo instante: o ritmo não bate.
    expect(rodar(PISCOU_3, "for (let i = 0; i < 3; i++) {\n  lampada.ligar();\n  lampada.desligar();\n}").depois.passou).toBe(false);
    // Sem exata, a sequência pode estar no meio de outras.
    expect(rodar({ ...PISCOU_3, exata: false }, PISCAR(4, 500)).depois.passou).toBe(true);
  });

  it("reagiu: o loop de controle acende quando a pessoa chega; ligar no começo ou depois do prazo não vale", () => {
    expect(rodar(REAGIU, LOOP).depois.passou).toBe(true);
    const cedo = rodar(REAGIU, "luz.ligar();").depois;
    expect(cedo.passou).toBe(false);
    expect(cedo.detalhe).toContain("não fez ligar em até 500 ms");
    expect(rodar(REAGIU, LOOP.replace("esperar(100)", "esperar(1000)").replace("while (true)", "esperar(600);\nwhile (true)")).depois.passou).toBe(false);
    // Decorado: esperar até o segundo 3 e acender passa nesta linha do tempo...
    expect(rodar(REAGIU, "esperar(3000);\nluz.ligar();").depois.passou).toBe(true);
  });

  it("variosCenarios: o código decorado cai; o loop de controle passa em todas", () => {
    const decorado = rodar(VARIOS, "esperar(3000);\nluz.ligar();").depois;
    expect(decorado.passou).toBe(false);
    expect(decorado.detalhe).toContain("falhou com alguém chega em 2,0 s");
    const loop = rodar(VARIOS, LOOP).depois;
    expect(loop.passou).toBe(true);
    expect(loop.filhos).toHaveLength(3);
    // Duas chegadas na mesma linha do tempo: as duas precisam da reação (o loop que não apaga não reage à segunda).
    expect(rodar(VARIOS, "while (true) {\n  if (sensor.temGente) luz.ligar();\n  esperar(100);\n}").depois.passou).toBe(false);
  });
});

describe("a bancada das cenas (/lab): as duas cenas de referência", () => {
  const contexto = { unidades: [UNIDADE_BANCADA_CENAS], fases: [...FASES_BANCADA_CENAS] };

  it("as fases e a unidade passam em todas as regras (inclusive as apresentações das três ferramentas)", () => {
    for (const fase of FASES_BANCADA_CENAS) {
      expect(REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, contexto).map((p) => `${regra.id}: ${p}`)), fase.id).toEqual([]);
    }
    const gerais = REGRAS_GERAIS.filter((regra) => ["ids-unicos", "ferramentas-apresentadas", "meta-e-desafio"].includes(regra.id));
    // Snippet, Console e palco já foram apresentados antes (na Lógica); as três da cena, nesta bancada.
    expect(gerais.flatMap((regra) => regra.checar(contexto)).filter((p) => /"(cena|ficha-dispositivo|velocidade-simulacao)"|desafio|repetid/.test(p))).toEqual([]);
  });

  it("as duas cenas são de ambientes diferentes, com dispositivos diferentes", () => {
    expect(CENA_QUARTO.ambiente).not.toBe(CENA_VITRINE.ambiente);
    expect(CENA_QUARTO.periodo).toBe("noite");
    expect(new Set(CENA_VITRINE.dispositivos.map((d) => d.tipo))).toEqual(new Set(["letreiro", "lampada", "sensor"]));
  });

  it("o quarto: a solução pisca no ritmo; com 4 piscadas ou sem esperar não passa", () => {
    const fase = FASE_DEMO_QUARTO;
    const piscar = fase.objetivos.find((o) => o.id === "piscar");
    if (!piscar) throw new Error("piscar");
    const simulacao = criarSimulacao(fase);
    simulacao.executar([{ tipo: "definirSnippet", codigo: CODIGO_PISCAR }, { tipo: "executarSnippet" }]);
    expect(simulacao.avaliar(piscar.validador).passou).toBe(true);
    simulacao.executar([{ tipo: "definirSnippet", codigo: CODIGO_PISCAR.replace("vez <= 3", "vez <= 4") }, { tipo: "executarSnippet" }]);
    expect(simulacao.avaliar(piscar.validador).passou).toBe(false);
  });

  it("a vitrine: o loop que só acende passa no objetivo dele e cai no de apagar; a solução final passa nos dois", () => {
    const fase = FASE_DEMO_VITRINE;
    const loop = fase.objetivos.find((o) => o.id === "loop");
    const apagar = fase.objetivos.find((o) => o.id === "apagar");
    if (!loop || !apagar) throw new Error("objetivos");
    const simulacao = criarSimulacao(fase);
    simulacao.executar([{ tipo: "definirSnippet", codigo: CODIGO_ACENDER }, { tipo: "executarSnippet" }]);
    expect(simulacao.avaliar(loop.validador).passou).toBe(true);
    expect(simulacao.avaliar(apagar.validador).passou).toBe(false);
    simulacao.executar([{ tipo: "definirSnippet", codigo: CODIGO_VITRINE }, { tipo: "executarSnippet" }]);
    expect(simulacao.avaliar(apagar.validador).passou).toBe(true);
    // Decorado no segundo 3: passa na linha do tempo da cena, cai nas de teste.
    simulacao.executar([{ tipo: "definirSnippet", codigo: "esperar(3000);\nluz.ligar();" }, { tipo: "executarSnippet" }]);
    const decorado = simulacao.avaliar(loop.validador);
    expect(decorado.passou).toBe(false);
    expect(decorado.filhos?.[0]?.passou).toBe(true);
  });

  it("a meta de um desafio com cena mostra a cena no meio do que o código fez", () => {
    const simulacao = criarSimulacao(FASE_DEMO_VITRINE);
    simulacao.executar([{ tipo: "definirSnippet", codigo: CODIGO_VITRINE }, { tipo: "executarSnippet" }]);
    const rastro = simulacao.cena();
    if (!rastro) throw new Error("sem rastro");
    expect(momentoDaFoto(rastro)).toBe(5000);
    expect(estadoNoTempo(rastro, momentoDaFoto(rastro)).luz.ligada).toBe(true);
  });
});
