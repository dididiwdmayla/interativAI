/*
 * A área "cena" na composição (src/motor/composicao.ts) e a checagem de uma
 * cena como dado (src/motor/cena/conferir.ts): o campo, a ferramenta, as
 * abas de cada layout e as sabotagens.
 */
import { describe, expect, it } from "vitest";
import type { DadosCena } from "@/motor/cena/modelo";
import { conferirCena } from "@/motor/cena/conferir";
import { areasDaFase, cenaDaFase } from "@/motor/composicao";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASE_DEMO_RESOLVER } from "@/conteudo/laboratorio/bancadaResolver";
import type { Fase, FasePratica } from "@/conteudo/tipos";
import { abasDoLayout } from "@/componentes/composicao/TelaComposta";

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

describe("área cena: o formato e as sabotagens", () => {
  const base: FasePratica = {
    ...FASE_DEMO_RESOLVER,
    areas: ["cena", "snippet", "palco"],
    plano: undefined,
    testes: undefined,
    cena: VITRINE,
    usaFerramentas: ["cena", "snippet", "console", "palco-memoria", "linha-do-tempo"],
    objetivos: FASE_DEMO_RESOLVER.objetivos.filter((o) => o.id === "programar"),
  };
  const problemas = (fase: Fase) =>
    REGRAS_DE_FASE.filter((regra) => regra.id === "composicao").flatMap((regra) => regra.checar(fase, { unidades: [], fases: [fase] }));

  it("a cena vem do campo cena, primeiro na tela", () => {
    expect(areasDaFase({ ...base, areas: ["snippet", "cena"] })).toEqual(["cena", "snippet"]);
    expect(cenaDaFase(base)?.id).toBe("vitrine-teste");
    expect(problemas(base)).toEqual([]);
  });

  it("em pé a cena mora em cima (o palco vira aba); deitado, a cena é a primeira aba", () => {
    expect(abasDoLayout("retrato", ["cena", "snippet", "palco"])).toEqual(["snippet", "palco"]);
    expect(abasDoLayout("paisagem", ["cena", "snippet", "palco"])).toEqual(["cena", "palco"]);
    expect(abasDoLayout("retrato", ["plano", "snippet", "palco"])).toEqual(["plano", "snippet"]);
  });

  it("área sem o campo, campo sem a área, sem a ferramenta e cena quebrada", () => {
    expect(problemas({ ...base, cena: undefined }).join("\n")).toContain('a área "cena" pede o campo cena');
    expect(problemas({ ...base, areas: ["snippet", "palco"] }).join("\n")).toContain('a fase tem cena, mas não declara a área "cena"');
    expect(problemas({ ...base, usaFerramentas: base.usaFerramentas.filter((f) => f !== "cena") }).join("\n")).toContain('a área "cena" pede "cena" em usaFerramentas');
    const quebrada: DadosCena = {
      ...VITRINE,
      id: "Vitrine",
      duracaoMs: 90_000,
      cenario: [{ peca: "foguete" as "parede", x: 0, y: 0 }],
      dispositivos: [
        { id: "esperar", tipo: "lampada", x: 0, y: 0 },
        { id: "luz", tipo: "lampada", x: 0, y: 0, inicial: { ligado: true } },
        { id: "luz", tipo: "geladeira" as "lampada", x: 0, y: 0 },
      ],
      linhaDoTempo: [{ tipo: "pessoa", chegaMs: 5000, saiMs: 4000 }, { tipo: "interruptor", dispositivo: "luz", noMs: 100 }],
    };
    const texto = conferirCena(quebrada).join("\n");
    expect(texto).toContain("kebab-case");
    expect(texto).toContain("duracaoMs 90000");
    expect(texto).toContain('a peça "foguete" não existe');
    expect(texto).toContain('o dispositivo "esperar" usa um nome que o código já tem');
    expect(texto).toContain('começa com "ligado"');
    expect(texto).toContain('dispositivo com id repetido: "luz"');
    expect(texto).toContain('"geladeira", que não existe no catálogo');
    expect(texto).toContain("antes de chegar");
    expect(texto).toContain('"luz" não é um interruptor');
  });
});
