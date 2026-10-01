/*
 * Ordenar passos (src/motor/ordenar/modelo.ts): a validação é pelas
 * dependências (qualquer ordem que as respeite vale), os cartões que sobram
 * ficam fora, o agrupar confere o passo grande de cada subpasso e o plano de
 * código roda na ordem. Mais as demonstrações do /lab e as sabotagens.
 */
import { describe, expect, it } from "vitest";
import {
  codigoDoPlano,
  conferirOrdem,
  type DadosOrdenar,
  estadoInicialOrdenar,
  type EstadoOrdenar,
  ordemDoPlano,
  porPasso,
  tirarPasso,
  umaOrdemValida,
} from "@/motor/ordenar/modelo";

const CAFE: DadosOrdenar = {
  modo: "ordenar",
  problema: "Café",
  cartoes: [
    { id: "ferver", texto: "Ferver a água" },
    { id: "filtro", texto: "Pôr o filtro" },
    { id: "po", texto: "Pôr o pó", depoisDe: ["filtro"] },
    { id: "despejar", texto: "Despejar a água", depoisDe: ["ferver", "po"] },
    { id: "servir", texto: "Servir", depoisDe: ["despejar"] },
    { id: "gelo", texto: "Pôr gelo", sobra: true },
  ],
};

function plano(dados: DadosOrdenar, ids: string[]): EstadoOrdenar {
  let estado = estadoInicialOrdenar(dados);
  for (const id of ids) estado = porPasso(dados, estado, id) as EstadoOrdenar;
  return estado;
}

/** Todas as permutações (para conferir que TODA ordem válida passa e nenhuma inválida). */
function permutacoes<T>(lista: T[]): T[][] {
  if (lista.length <= 1) return [lista];
  return lista.flatMap((item, i) => permutacoes([...lista.slice(0, i), ...lista.slice(i + 1)]).map((resto) => [item, ...resto]));
}

describe("ordenar passos: validação pelas dependências", () => {
  it("qualquer ordem que respeite as dependências vale, e só elas", () => {
    const necessarios = ["ferver", "filtro", "po", "despejar", "servir"];
    let validas = 0;
    for (const ordem of permutacoes(necessarios)) {
      const pos = (id: string) => ordem.indexOf(id);
      const respeita = pos("filtro") < pos("po") && pos("ferver") < pos("despejar") && pos("po") < pos("despejar") && pos("despejar") < pos("servir");
      expect(conferirOrdem(CAFE, plano(CAFE, ordem)).valida, ordem.join(" > ")).toBe(respeita);
      if (respeita) validas += 1;
    }
    // Ferver pode vir em 3 lugares diferentes (antes, entre e depois do filtro e do pó): 3 ordens valem.
    expect(validas).toBe(3);
  });

  it("explica o primeiro problema: sobra, dependência quebrada e falta", () => {
    expect(conferirOrdem(CAFE, plano(CAFE, ["ferver", "filtro", "po", "despejar", "servir", "gelo"])).motivo).toBe('"Pôr gelo" não faz parte do plano');
    expect(conferirOrdem(CAFE, plano(CAFE, ["ferver", "po", "filtro", "despejar", "servir"])).motivo).toBe('"Pôr o pó" veio antes de "Pôr o filtro"');
    expect(conferirOrdem(CAFE, plano(CAFE, ["ferver", "filtro", "po", "despejar"])).motivo).toBe('falta "Servir"');
  });

  it("pôr, mover e tirar mantêm um cartão num lugar só", () => {
    let estado = plano(CAFE, ["ferver", "filtro"]);
    estado = porPasso(CAFE, estado, "filtro", "plano", 0) as EstadoOrdenar;
    expect(ordemDoPlano(CAFE, estado)).toEqual(["filtro", "ferver"]);
    estado = tirarPasso(estado, "ferver");
    expect(ordemDoPlano(CAFE, estado)).toEqual(["filtro"]);
    expect(porPasso(CAFE, estado, "nao-existe")).toBeNull();
    expect(umaOrdemValida(CAFE)).not.toBeNull();
    expect(umaOrdemValida({ ...CAFE, cartoes: [...CAFE.cartoes.slice(0, 5).map((c) => (c.id === "filtro" ? { ...c, depoisDe: ["servir"] } : c))] })).toBeNull();
  });

  it("agrupar: cada subpasso no seu passo grande; dependência entre grupos vale pela ordem deles", () => {
    const festa: DadosOrdenar = {
      modo: "agrupar",
      problema: "Festa",
      grupos: [
        { id: "a", titulo: "A" },
        { id: "b", titulo: "B" },
      ],
      cartoes: [
        { id: "x", texto: "x", grupo: "a" },
        { id: "y", texto: "y", grupo: "b", depoisDe: ["x"] },
        { id: "z", texto: "z", grupo: "b" },
        { id: "w", texto: "w", sobra: true },
      ],
    };
    let estado = estadoInicialOrdenar(festa);
    estado = porPasso(festa, estado, "z", "b") as EstadoOrdenar;
    estado = porPasso(festa, estado, "y", "b", 0) as EstadoOrdenar;
    estado = porPasso(festa, estado, "x", "b") as EstadoOrdenar;
    expect(conferirOrdem(festa, estado).motivo).toBe('"x" está no passo grande errado');
    estado = porPasso(festa, estado, "x", "a") as EstadoOrdenar;
    expect(conferirOrdem(festa, estado).valida).toBe(true);
  });

  it("o plano de código junta os cartões na ordem", () => {
    const dados: DadosOrdenar = { modo: "ordenar", problema: "p", rodar: true, cartoes: [{ id: "a", texto: "let a = 1;" }, { id: "b", texto: "a", codigo: "console.log(a);" }, { id: "c", texto: "c" }] };
    expect(codigoDoPlano(dados, plano(dados, ["a", "b"]))).toBe("let a = 1;\nconsole.log(a);");
  });
});

describe("ordenar passos na fábrica", () => {
  it("as três demonstrações do /lab passam em todas as regras de fase", async () => {
    const { REGRAS_DE_FASE } = await import("@/conteudo/checagens");
    const { FASE_DEMO_ORDENAR, FASE_DEMO_AGRUPAR, FASE_DEMO_ORDENAR_CODIGO } = await import("@/conteudo/laboratorio/bancadaLogica");
    for (const fase of [FASE_DEMO_ORDENAR, FASE_DEMO_AGRUPAR, FASE_DEMO_ORDENAR_CODIGO]) {
      const problemas = REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] }).map((p) => `${regra.id}: ${p}`));
      expect(problemas, fase.id).toEqual([]);
    }
  });

  it("na simulação, a outra ordem válida também passa (não existe ordem decorada)", async () => {
    const { FASE_DEMO_ORDENAR } = await import("@/conteudo/laboratorio/bancadaLogica");
    const { criarSimulacao } = await import("@/motor/simulacao");
    const simulacao = criarSimulacao(FASE_DEMO_ORDENAR);
    simulacao.executar([{ tipo: "tirarPasso", passo: "gelo" }, ...["ferver", "filtro", "po", "despejar", "servir"].map((passo) => ({ tipo: "porPasso" as const, passo }))]);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(true);
    simulacao.executar([{ tipo: "porPasso", passo: "ferver", posicao: 2 }]);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(true);
    simulacao.executar([{ tipo: "porPasso", passo: "servir", posicao: 0 }]);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).detalhe).toBe('"Servir na xícara" veio antes de "Despejar a água quente no pó"');
  });

  it("sabotagem: ciclo, dependência que não existe, validador fora do quadro e rodar sem programa", async () => {
    const { REGRAS_DE_FASE } = await import("@/conteudo/checagens");
    const { FASE_DEMO_ORDENAR, FASE_BANCADA_CONSOLE } = await import("@/conteudo/laboratorio/bancadaLogica");
    const texto = (fase: Parameters<(typeof REGRAS_DE_FASE)[number]["checar"]>[0]) =>
      REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] })).join("\n");
    const ciclo = {
      ...FASE_DEMO_ORDENAR,
      ordenar: { ...FASE_DEMO_ORDENAR.ordenar, cartoes: FASE_DEMO_ORDENAR.ordenar.cartoes.map((c) => (c.id === "filtro" ? { ...c, depoisDe: ["servir"] } : c.id === "po" ? { ...c, depoisDe: ["filtro", "fantasma"] } : c)) },
    };
    const t = texto(ciclo);
    expect(t).toContain("as dependências formam um ciclo");
    expect(t).toContain('depende de "fantasma", que não existe');
    const fora = { ...FASE_BANCADA_CONSOLE, objetivos: [{ ...FASE_BANCADA_CONSOLE.objetivos[1], validador: { tipo: "ordemValida" as const } }] };
    expect(texto(fora)).toContain("só vale numa fase ordenar-passos");
    const semPrograma = { ...FASE_DEMO_ORDENAR, ordenar: { ...FASE_DEMO_ORDENAR.ordenar, rodar: true as const } };
    expect(texto(semPrograma)).toContain("ordenar.rodar pede programa");
  });
});
