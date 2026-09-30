/*
 * O modelo do circuito lógico (src/motor/circuito/modelo.ts): simulação,
 * realimentação (memória), tabela verdade, "ver como código" batendo com a
 * tabela, e os validadores circuitoTabela e usouPortao.
 */
import { describe, expect, it } from "vitest";
import {
  adicionarPortao,
  alternarEntrada,
  apagarPeca,
  type Circuito,
  circuitoComoCodigo,
  ligarFio,
  linhaAtual,
  portoesUsados,
  simular,
  tabelaVerdade,
} from "@/motor/circuito/modelo";
import { avaliarDetalhado, type ContextoValidacao } from "@/motor/validadores";

const PADARIA: Circuito = {
  pecas: [
    { id: "cliente", tipo: "entrada", nome: "temCliente", rotulo: "tem cliente", x: 20, y: 60, fixa: true },
    { id: "aberta", tipo: "entrada", nome: "lojaAberta", rotulo: "loja aberta", x: 20, y: 200, fixa: true },
    { id: "porta", tipo: "saida", nome: "portaAbre", rotulo: "porta abre", forma: "porta", x: 540, y: 130, fixa: true },
  ],
  fios: [],
};

function montar(tipo: "e" | "ou" | "xou"): Circuito {
  let c = adicionarPortao(PADARIA, tipo, "p1");
  c = ligarFio(c, { de: "cliente", para: "p1", porta: 0 }) as Circuito;
  c = ligarFio(c, { de: "aberta", para: "p1", porta: 1 }) as Circuito;
  return ligarFio(c, { de: "p1", para: "porta", porta: 0 }) as Circuito;
}

/** Roda o código do "ver como código" com cada linha da tabela e compara. */
function codigoBateComTabela(circuito: Circuito) {
  const codigo = circuitoComoCodigo(circuito);
  for (const linha of tabelaVerdade(circuito)) {
    const nomes = Object.keys(linha.entradas);
    const calcular = new Function(...nomes, `${codigo}\nreturn { ${Object.keys(linha.saidas).join(", ")} };`) as (...a: boolean[]) => Record<string, boolean>;
    expect(calcular(...nomes.map((n) => linha.entradas[n])), `${codigo} com ${JSON.stringify(linha.entradas)}`).toEqual(linha.saidas);
  }
}

describe("circuito lógico", () => {
  it("E: a porta só abre com cliente E loja aberta; o código é temCliente && lojaAberta", () => {
    const c = montar("e");
    expect(tabelaVerdade(c).map((l) => l.saidas.portaAbre)).toEqual([false, false, false, true]);
    expect(circuitoComoCodigo(c)).toBe("const portaAbre = temCliente && lojaAberta;");
    codigoBateComTabela(c);
  });

  it("OU e OU exclusivo", () => {
    expect(tabelaVerdade(montar("ou")).map((l) => l.saidas.portaAbre)).toEqual([false, true, true, true]);
    expect(tabelaVerdade(montar("xou")).map((l) => l.saidas.portaAbre)).toEqual([false, true, true, false]);
    codigoBateComTabela(montar("ou"));
    codigoBateComTabela(montar("xou"));
  });

  it("NÃO no meio: temCliente && !lojaAberta, com o código batendo", () => {
    let c = adicionarPortao(PADARIA, "e", "e1");
    c = adicionarPortao(c, "nao", "n1");
    c = ligarFio(c, { de: "aberta", para: "n1", porta: 0 }) as Circuito;
    c = ligarFio(c, { de: "cliente", para: "e1", porta: 0 }) as Circuito;
    c = ligarFio(c, { de: "n1", para: "e1", porta: 1 }) as Circuito;
    c = ligarFio(c, { de: "e1", para: "porta", porta: 0 }) as Circuito;
    expect(circuitoComoCodigo(c)).toBe("const portaAbre = temCliente && !lojaAberta;");
    codigoBateComTabela(c);
  });

  it("a corrente: fios acesos e a saída acesa conforme as chaves; porta sem fio conta como desligada", () => {
    let c = montar("e");
    expect(simular(c).valores.porta).toBe(false);
    c = alternarEntrada(alternarEntrada(c, "cliente"), "aberta");
    const sim = simular(c);
    expect(sim.valores.porta).toBe(true);
    expect(Object.values(sim.fios)).toEqual([true, true, true]);
    expect(linhaAtual(c)).toBe(3);
    expect(simular(PADARIA).soltas).toEqual([{ peca: "porta", porta: 0 }]);
  });

  it("realimentação guarda estado (a memória simples com OU e a saída voltando)", () => {
    // selo: saída = liga OU (saída anterior E NÃO desliga)
    let c: Circuito = {
      pecas: [
        { id: "liga", tipo: "entrada", nome: "liga", rotulo: "liga", x: 0, y: 0 },
        { id: "desliga", tipo: "entrada", nome: "desliga", rotulo: "desliga", x: 0, y: 100 },
        { id: "ou", tipo: "ou", x: 200, y: 0 },
        { id: "e", tipo: "e", x: 100, y: 100 },
        { id: "n", tipo: "nao", x: 50, y: 150 },
        { id: "motor", tipo: "saida", nome: "motor", rotulo: "motor", x: 300, y: 0 },
      ],
      fios: [
        { de: "liga", para: "ou", porta: 0 },
        { de: "e", para: "ou", porta: 1 },
        { de: "ou", para: "e", porta: 0 },
        { de: "desliga", para: "n", porta: 0 },
        { de: "n", para: "e", porta: 1 },
        { de: "ou", para: "motor", porta: 0 },
      ],
    };
    let estado = simular(c).valores;
    expect(estado.motor).toBe(false);
    c = alternarEntrada(c, "liga", true);
    estado = simular(c, estado).valores;
    expect(estado.motor).toBe(true);
    c = alternarEntrada(c, "liga", false);
    estado = simular(c, estado).valores;
    expect(estado.motor).toBe(true);
    c = alternarEntrada(c, "desliga", true);
    estado = simular(c, estado).valores;
    expect(estado.motor).toBe(false);
  });

  it("fio novo na mesma porta troca o antigo; peça fixa não sai; ligação impossível é recusada", () => {
    let c = montar("e");
    c = ligarFio(c, { de: "cliente", para: "p1", porta: 1 }) as Circuito;
    expect(c.fios.filter((f) => f.para === "p1")).toHaveLength(2);
    expect(ligarFio(c, { de: "porta", para: "p1", porta: 0 })).toBeNull();
    expect(ligarFio(c, { de: "p1", para: "p1", porta: 0 })).toBeNull();
    expect(ligarFio(c, { de: "cliente", para: "p1", porta: 2 })).toBeNull();
    expect(apagarPeca(c, "porta").pecas).toHaveLength(4);
    expect(apagarPeca(c, "p1").fios.some((f) => f.de === "p1" || f.para === "p1")).toBe(false);
  });

  it("validadores: circuitoTabela confere a tabela (não o jeito de montar) e usouPortao", () => {
    const contexto = (circuito: Circuito): ContextoValidacao => {
      const doc = document.implementation.createHTMLDocument("x");
      return { documento: doc, inicial: doc, selecao: null, eventos: [], circuito };
    };
    const tabelaE = {
      tipo: "circuitoTabela" as const,
      esperado: [
        { entradas: { temCliente: false, lojaAberta: false }, saida: false },
        { entradas: { temCliente: true, lojaAberta: false }, saida: false },
        { entradas: { temCliente: false, lojaAberta: true }, saida: false },
        { entradas: { temCliente: true, lojaAberta: true }, saida: true },
      ],
    };
    expect(avaliarDetalhado(tabelaE, contexto(montar("e"))).passou).toBe(true);
    const errado = avaliarDetalhado(tabelaE, contexto(montar("ou")));
    expect(errado.passou).toBe(false);
    expect(errado.detalhe).toContain("portaAbre deu true, esperado false");
    // O mesmo E montado com NÃO e OU (De Morgan) também passa: vale a tabela.
    let deMorgan = adicionarPortao(PADARIA, "nao", "n1");
    deMorgan = adicionarPortao(deMorgan, "nao", "n2");
    deMorgan = adicionarPortao(deMorgan, "ou", "o1");
    deMorgan = adicionarPortao(deMorgan, "nao", "n3");
    for (const fio of [
      { de: "cliente", para: "n1", porta: 0 },
      { de: "aberta", para: "n2", porta: 0 },
      { de: "n1", para: "o1", porta: 0 },
      { de: "n2", para: "o1", porta: 1 },
      { de: "o1", para: "n3", porta: 0 },
      { de: "n3", para: "porta", porta: 0 },
    ]) deMorgan = ligarFio(deMorgan, fio) as Circuito;
    expect(avaliarDetalhado(tabelaE, contexto(deMorgan)).passou).toBe(true);
    expect(portoesUsados(deMorgan, "nao")).toBe(3);
    expect(avaliarDetalhado({ tipo: "usouPortao", portao: "e" }, contexto(deMorgan)).passou).toBe(false);
    expect(avaliarDetalhado({ tipo: "usouPortao", portao: "nao", minimo: 3 }, contexto(deMorgan)).passou).toBe(true);
  });
});

describe("demonstração do circuito (/lab)", () => {
  it("passa em todas as regras de fase (dados e simulação)", async () => {
    const { REGRAS_DE_FASE } = await import("@/conteudo/checagens");
    const { FASE_DEMO_CIRCUITO } = await import("@/conteudo/laboratorio/bancadaLogica");
    const problemas = REGRAS_DE_FASE.flatMap((regra) => regra.checar(FASE_DEMO_CIRCUITO, { unidades: [], fases: [FASE_DEMO_CIRCUITO] }).map((p) => `${regra.id}: ${p}`));
    expect(problemas).toEqual([]);
  });

  it("sabotagem: validador de circuito fora da fase, entrada com nome ruim e portão fora da paleta", async () => {
    const { REGRAS_DE_FASE } = await import("@/conteudo/checagens");
    const { FASE_DEMO_CIRCUITO, FASE_BANCADA_CONSOLE } = await import("@/conteudo/laboratorio/bancadaLogica");
    const texto = (fase: Parameters<(typeof REGRAS_DE_FASE)[number]["checar"]>[0]) =>
      REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] })).join("\n");
    const comTabela = { ...FASE_BANCADA_CONSOLE, objetivos: [{ ...FASE_BANCADA_CONSOLE.objetivos[1], validador: { tipo: "usouPortao" as const, portao: "e" as const } }] };
    expect(texto(comTabela)).toContain("só vale numa fase circuito-logico");
    const nomeRuim = {
      ...FASE_DEMO_CIRCUITO,
      circuito: {
        ...FASE_DEMO_CIRCUITO.circuito,
        paleta: ["ou" as const],
        inicial: { ...FASE_DEMO_CIRCUITO.circuito.inicial, pecas: FASE_DEMO_CIRCUITO.circuito.inicial.pecas.map((p) => (p.id === "cliente" ? { ...p, nome: "tem cliente" } : p)) },
      },
    };
    const t = texto(nomeRuim);
    expect(t).toContain("não vira nome de variável");
    expect(t).toContain('o portão "e" não está na paleta');
  });
});
