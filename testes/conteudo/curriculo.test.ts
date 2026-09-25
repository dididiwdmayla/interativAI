/*
 * O currículo em dados (src/curriculo) e a consistência com o conteúdo.
 * As sabotagens confirmam que as checagens falham com mensagem clara.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO, ILHAS_DA_ROTA, ILHAS_OPCIONAIS, localNoCurriculo, statusDaUnidade } from "@/curriculo";
import { conferirConteudoNoCurriculo, conferirIdsDoCurriculo, conferirMotorDoConteudo } from "@/curriculo/conferir";
import type { IlhaCurriculo } from "@/curriculo/tipos";

const [U1] = UNIDADES;

describe("currículo em dados", () => {
  it("ilhas na ordem do mapa, Origens sempre aberta e Frameworks opcional", () => {
    expect(ILHAS_DA_ROTA.map((ilha) => ilha.id)).toEqual(["origens", "sites", "logica", "paginas-vivas", "rede-servidor", "oficio"]);
    expect(ILHAS_OPCIONAIS.map((ilha) => ilha.id)).toEqual(["frameworks"]);
    expect(CURRICULO.find((ilha) => ilha.id === "origens")?.sempreAberta).toBe(true);
  });

  it("status vem do conteúdo registrado, não é guardado à mão", () => {
    expect(statusDaUnidade("sites-elementos-u1")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u2")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u3")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u4")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u5")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u6")).toBe("planejada");
    expect(statusDaUnidade("sites-elementos-u6", [...UNIDADES, { ...U1, id: "sites-elementos-u6" }])).toBe("pronta");
  });

  it("U1 e U2 usam os ids do conteúdo, na zona Elementos da ilha Sites", () => {
    for (const unidade of UNIDADES) {
      const local = localNoCurriculo(unidade.id);
      expect(local?.ilha.id).toBe("sites");
      expect(local?.zona.id).toBe("elementos");
    }
  });

  it("a U6 (página do zero) requer motor mesmo numa zona pronta", () => {
    const local = localNoCurriculo("sites-elementos-u6");
    expect(local?.zona.requerMotor).toBeUndefined();
    expect(local?.unidade.requerMotor).toContain("head editável");
  });
});

describe("checagens do currículo (sabotagens)", () => {
  it("o conteúdo atual passa", () => {
    expect(conferirIdsDoCurriculo(CURRICULO)).toEqual([]);
    expect(conferirConteudoNoCurriculo(CURRICULO, UNIDADES)).toEqual([]);
    expect(conferirMotorDoConteudo(CURRICULO, UNIDADES)).toEqual([]);
  });

  it("id repetido no currículo falha", () => {
    const [origens, sites, ...resto] = CURRICULO;
    const zonaCopia = { ...sites.zonas[0], id: "elementos-2" };
    const repetido: IlhaCurriculo[] = [origens, { ...sites, zonas: [...sites.zonas, zonaCopia] }, ...resto];
    expect(conferirIdsDoCurriculo(repetido).join("\n")).toContain('unidade com id repetido no currículo: "sites-elementos-u1"');
  });

  it("unidade de conteúdo fora do currículo falha", () => {
    const inventada: Unidade = { ...U1, id: "sites-inventada-u1" };
    expect(conferirConteudoNoCurriculo(CURRICULO, [inventada]).join("\n")).toContain(
      'a unidade de conteúdo "sites-inventada-u1" não está no currículo',
    );
  });

  it("unidade na zona errada falha", () => {
    const zonaErrada: Unidade = { ...U1, zona: "Estilos" };
    expect(conferirConteudoNoCurriculo(CURRICULO, [zonaErrada]).join("\n")).toContain(
      'diz zona "Estilos", mas no currículo ela é da zona "Elementos"',
    );
  });

  it("unidade de conteúdo numa zona com requerMotor falha dizendo o que falta", () => {
    const estilos: Unidade = { ...U1, id: "sites-estilos-u1", zona: "Estilos", titulo: "A aba Estilos" };
    const problemas = conferirMotorDoConteudo(CURRICULO, [estilos]);
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain('a zona "Estilos" ainda requer motor: aba Estilos');
    expect(problemas[0]).toContain("relate o que falta");
  });

  it("a U6 com conteúdo falha pelo requerMotor da própria unidade", () => {
    const u6: Unidade = { ...U1, id: "sites-elementos-u6", numero: 6, titulo: "Página do zero" };
    expect(conferirMotorDoConteudo(CURRICULO, [u6]).join("\n")).toContain("ela ainda requer motor: modo documento inteiro");
  });
});
