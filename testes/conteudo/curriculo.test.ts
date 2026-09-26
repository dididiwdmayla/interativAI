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
    expect(ILHAS_DA_ROTA.map((ilha) => ilha.id)).toEqual(["origens", "sites", "logica", "paginas-vivas", "rede-servidor", "ia", "oficio"]);
    expect(ILHAS_OPCIONAIS.map((ilha) => ilha.id)).toEqual(["frameworks"]);
    expect(CURRICULO.find((ilha) => ilha.id === "origens")?.sempreAberta).toBe(true);
  });

  it("a ilha IA fica entre Rede e Servidor e Ofício, com a IA ao vivo como motor", () => {
    const ids = CURRICULO.map((ilha) => ilha.id);
    expect(ids.indexOf("ia")).toBe(ids.indexOf("rede-servidor") + 1);
    expect(ids.indexOf("oficio")).toBe(ids.indexOf("ia") + 1);
    const ia = CURRICULO.find((ilha) => ilha.id === "ia");
    expect(ia?.zonas.map((zona) => zona.id)).toEqual([
      "como-funciona",
      "especificacao-e-prompt",
      "ia-ao-vivo",
      "agentes",
      "custo-e-privacidade",
    ]);
    for (const zona of ia?.zonas ?? []) expect(zona.requerMotor).toContain("IA ao vivo");
  });

  it("as unidades antigas mantêm os ids depois das adições do currículo", () => {
    for (const id of [
      "origens-museu-u5",
      "logica-depuracao-u1",
      "rede-servidor-apis-e-json-u1",
      "rede-servidor-front-e-back-u1",
      "oficio-deploy-u2",
      "oficio-ia-com-criterio-u1",
      "frameworks-react-e-next-u2",
    ]) {
      expect(localNoCurriculo(id), id).toBeDefined();
    }
    expect(localNoCurriculo("origens-museu-u6")?.unidade.titulo).toBe("Por baixo do capô");
    expect(localNoCurriculo("logica-algoritmos-essenciais-u4")?.zona.nome).toBe("Algoritmos essenciais");
    expect(localNoCurriculo("rede-servidor-seguranca-u3")?.zona.nome).toBe("Segurança");
  });

  it("status vem do conteúdo registrado, não é guardado à mão", () => {
    expect(statusDaUnidade("sites-elementos-u1")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u2")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u3")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u4")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u5")).toBe("pronta");
    expect(statusDaUnidade("sites-elementos-u6")).toBe("pronta");
    expect(statusDaUnidade("sites-estilos-u2")).toBe("pronta");
    expect(statusDaUnidade("sites-estilos-u3")).toBe("planejada");
    expect(statusDaUnidade("sites-estilos-u3", [...UNIDADES, { ...U1, id: "sites-estilos-u3" }])).toBe("pronta");
  });

  it("as unidades de conteúdo usam os ids do currículo, na ilha e na zona que dizem", () => {
    for (const unidade of UNIDADES) {
      const local = localNoCurriculo(unidade.id);
      expect(local?.ilha.id, unidade.id).toBe("sites");
      expect(local?.zona.nome, unidade.id).toBe(unidade.zona);
    }
    expect(UNIDADES.map((unidade) => localNoCurriculo(unidade.id)?.zona.id)).toEqual([
      "elementos",
      "elementos",
      "elementos",
      "elementos",
      "elementos",
      "elementos",
      "estilos",
      "estilos",
    ]);
  });

  it("liberações da rodada 9: U6, Estilos (E1 a E4) e Layout (L1 a L4) sem requerMotor", () => {
    const liberadas = [
      "sites-elementos-u6",
      "sites-estilos-u1",
      "sites-estilos-u2",
      "sites-estilos-u3",
      "sites-estilos-u4",
      "sites-layout-u1",
      "sites-layout-u2",
      "sites-layout-u3",
      "sites-layout-u4",
    ];
    for (const id of liberadas) {
      const local = localNoCurriculo(id);
      expect(local, id).not.toBeNull();
      expect(local?.zona.requerMotor, id).toBeUndefined();
      expect(local?.unidade.requerMotor, id).toBeUndefined();
    }
  });

  it("E5, Responsivo e Publicar continuam pedindo motor", () => {
    expect(localNoCurriculo("sites-estilos-u5")?.unidade.requerMotor).toContain("o próprio jogo como site-alvo");
    expect(localNoCurriculo("sites-responsivo-u1")?.zona.requerMotor).toContain("modo dispositivo");
    expect(localNoCurriculo("sites-publicar-u1")?.zona.requerMotor).toContain("auditoria");
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
    const responsivo: Unidade = { ...U1, id: "sites-responsivo-u1", zona: "Responsivo", titulo: "Modo dispositivo" };
    const problemas = conferirMotorDoConteudo(CURRICULO, [responsivo]);
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain('a zona "Responsivo" ainda requer motor: modo dispositivo');
    expect(problemas[0]).toContain("relate o que falta");
  });

  it("a E5 com conteúdo falha pelo requerMotor da própria unidade", () => {
    const e5: Unidade = { ...U1, id: "sites-estilos-u5", zona: "Estilos", numero: 5, titulo: "Variáveis e temas" };
    expect(conferirMotorDoConteudo(CURRICULO, [e5]).join("\n")).toContain("ela ainda requer motor: o próprio jogo como site-alvo");
  });
});
