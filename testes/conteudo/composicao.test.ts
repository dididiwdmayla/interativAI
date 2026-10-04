/*
 * Composição de áreas de trabalho (src/motor/composicao.ts): a fase declara
 * as áreas e o motor monta a tela. Aqui: as regras da fábrica, a simulação
 * de uma fase composta (o quadro e o Snippet juntos) e as sabotagens.
 */
import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASES } from "@/conteudo";
import type { Fase } from "@/conteudo/tipos";
import { FASE_DEMO_RESOLVER, CODIGO_MEDIA } from "@/conteudo/laboratorio/bancadaResolver";
import { areasDaFase, faseComposta, quadroDaFase, temArea } from "@/motor/composicao";
import { criarSimulacao } from "@/motor/simulacao";
import { semPagina } from "@/motor/tiposDeFase";

function problemas(fase: Fase): string[] {
  return REGRAS_DE_FASE.flatMap((regra) => (regra.id === "partes-do-desafio" ? [] : regra.checar(fase, { unidades: [], fases: [fase] }).map((p) => `${regra.id}: ${p}`)));
}

describe("composição de áreas: o formato", () => {
  it("a fase composta do /lab passa em todas as regras de fase", () => {
    expect(problemas(FASE_DEMO_RESOLVER)).toEqual([]);
  });

  it("as áreas saem na ordem da tela e o quadro vem do campo plano", () => {
    const embaralhada = { ...FASE_DEMO_RESOLVER, areas: ["palco", "snippet", "plano"] as typeof FASE_DEMO_RESOLVER.areas };
    expect(areasDaFase(embaralhada)).toEqual(["plano", "snippet", "palco"]);
    expect(faseComposta(FASE_DEMO_RESOLVER)).toBe(true);
    expect(temArea(FASE_DEMO_RESOLVER, "plano")).toBe(true);
    expect(quadroDaFase(FASE_DEMO_RESOLVER)?.problema).toBe("Calcular a média das notas");
    expect(semPagina(FASE_DEMO_RESOLVER)).toBe(true);
  });

  it("nenhuma fase publicada declara áreas: o que já existe usa a tela de sempre", () => {
    expect(FASES.filter((fase) => faseComposta(fase)).map((fase) => fase.id)).toEqual([]);
  });
});

describe("composição de áreas: a simulação", () => {
  it("o quadro e o Snippet funcionam juntos, na mesma fase", () => {
    const simulacao = criarSimulacao(FASE_DEMO_RESOLVER);
    simulacao.comecarObjetivo(null);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(false);
    simulacao.executar(FASE_DEMO_RESOLVER.objetivos[0].solucaoDeTeste);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(true);
    // Outra ordem que respeita as dependências também vale (a lista vazia pode vir depois da soma).
    simulacao.executar([{ tipo: "porPasso", passo: "vazia", posicao: 2 }]);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(true);
    simulacao.executar([
      { tipo: "definirSnippet", codigo: CODIGO_MEDIA },
      { tipo: "executarSnippet" },
    ]);
    expect(simulacao.avaliar(FASE_DEMO_RESOLVER.objetivos[1].validador).passou).toBe(true);
    // O plano continua editável depois do código: mexer nele não mexe no Snippet.
    simulacao.executar([{ tipo: "tirarPasso", passo: "devolver" }]);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(false);
    expect(simulacao.programa().snippet).toBe(CODIGO_MEDIA);
  });
});

describe("composição de áreas: sabotagens", () => {
  const texto = (fase: Fase) => problemas(fase).join("\n");

  it("sem a área snippet, área sem o campo e campo sem a área", () => {
    expect(texto({ ...FASE_DEMO_RESOLVER, areas: ["plano", "palco"] })).toContain('fase composta pede a área "snippet"');
    expect(texto({ ...FASE_DEMO_RESOLVER, plano: undefined })).toContain('a área "plano" pede o campo plano');
    expect(texto({ ...FASE_DEMO_RESOLVER, areas: undefined })).toContain('a fase tem plano, mas não declara a área "plano"');
    expect(texto({ ...FASE_DEMO_RESOLVER, programa: {} })).toContain('a área "snippet" pede programa.snippet');
  });

  it("ferramenta de uma área que a fase não declara, e a área sem a ferramenta", () => {
    const semPalco = { ...FASE_DEMO_RESOLVER, areas: ["plano", "snippet"] as typeof FASE_DEMO_RESOLVER.areas };
    const t = texto(semPalco);
    expect(t).toContain('usaFerramentas tem "palco-memoria", mas a fase não declara a área "palco"');
    expect(t).toContain('a linha do tempo mora no palco');
    const semQuadro = { ...FASE_DEMO_RESOLVER, usaFerramentas: FASE_DEMO_RESOLVER.usaFerramentas.filter((id) => id !== "quadro-de-passos") };
    expect(texto(semQuadro)).toContain('a área "plano" pede "quadro-de-passos"');
  });

  it("a área plano não roda o plano", () => {
    const comRodar = { ...FASE_DEMO_RESOLVER, plano: { ...FASE_DEMO_RESOLVER.plano!, rodar: true as const } };
    expect(texto(comRodar)).toContain("a área plano não roda o plano");
  });
});
