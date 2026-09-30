/*
 * O currículo em dados (src/curriculo) e a consistência com o conteúdo.
 * As sabotagens confirmam que as checagens falham com mensagem clara.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO, ILHAS_DA_ROTA, ILHAS_FUTURAS, ILHAS_OPCIONAIS, localNoCurriculo, statusDaUnidade, TRILHAS } from "@/curriculo";
import {
  conferirConteudoNoCurriculo,
  conferirIdsDoCurriculo,
  conferirMotorDoConteudo,
  conferirMotoresPlanejados,
} from "@/curriculo/conferir";
import { MOTORES_PLANEJADOS } from "@/curriculo/motores";
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
    // Derivado: o teste não sabe (nem precisa saber) quais zonas estão prontas hoje.
    const registradas = new Set(UNIDADES.map((unidade) => unidade.id));
    for (const item of CURRICULO.flatMap((ilha) => ilha.zonas.flatMap((zona) => zona.unidades))) {
      expect(statusDaUnidade(item.id), item.id).toBe(registradas.has(item.id) ? "pronta" : "planejada");
    }
    const planejada = CURRICULO.flatMap((ilha) => ilha.zonas.flatMap((zona) => zona.unidades)).find((item) => !registradas.has(item.id));
    if (!planejada) throw new Error("o currículo inteiro está pronto?");
    expect(statusDaUnidade(planejada.id, [...UNIDADES, { ...U1, id: planejada.id }])).toBe("pronta");
  });

  it("as unidades de conteúdo usam os ids do currículo, na ilha e na zona que dizem", () => {
    for (const unidade of UNIDADES) {
      const local = localNoCurriculo(unidade.id);
      expect(local, unidade.id).toBeDefined();
      expect(`Ilha ${local?.ilha.nome}`, unidade.id).toBe(unidade.ilha);
      expect(local?.zona.nome, unidade.id).toBe(unidade.zona);
      expect(unidade.id.startsWith(`${local?.ilha.id}-${local?.zona.id}-u`), unidade.id).toBe(true);
    }
  });

  it("toda unidade pronta mora em zona (e é unidade) sem requerMotor", () => {
    for (const unidade of UNIDADES) {
      const local = localNoCurriculo(unidade.id);
      expect(local?.zona.requerMotor, unidade.id).toBeUndefined();
      expect(local?.unidade.requerMotor, unidade.id).toBeUndefined();
    }
  });

  it("toda zona com requerMotor só tem unidades planejadas", () => {
    for (const zona of CURRICULO.flatMap((ilha) => ilha.zonas)) {
      if (!zona.requerMotor) continue;
      for (const item of zona.unidades) expect(statusDaUnidade(item.id), item.id).toBe("planejada");
    }
  });

  it("portões lógicos: o circuito-logico está pronto (Decisões u2 logo depois da u1); a parte B da Lógica segue planejada", () => {
    expect(MOTORES_PLANEJADOS.map((motor) => motor.id)).toEqual(["ordenar-passos", "depurador-fontes", "visualizador-arvore", "projeto-ponte-js"]);
    expect(localNoCurriculo("logica-decisoes-u2")?.indice).toBe(1);
    expect(localNoCurriculo("logica-decisoes-u2")?.unidade.requerMotor).toBeUndefined();
    expect(localNoCurriculo("origens-museu-u6")?.unidade.requerMotor).not.toContain("circuito-logico");
    expect(conferirMotoresPlanejados(MOTORES_PLANEJADOS, CURRICULO, ILHAS_FUTURAS, TRILHAS)).toEqual([]);
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
    const [origens, sites, ...resto] = CURRICULO;
    const trancada = { ...sites, zonas: sites.zonas.map((zona, indice) => (indice === 0 ? { ...zona, requerMotor: "um motor de mentirinha" } : zona)) };
    const problemas = conferirMotorDoConteudo([origens, trancada, ...resto], [U1]);
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain(`a zona "${sites.zonas[0].nome}" ainda requer motor: um motor de mentirinha`);
    expect(problemas[0]).toContain("relate o que falta");
  });

  it("unidade com requerMotor próprio falha pelo motor da unidade", () => {
    const [origens, sites, ...resto] = CURRICULO;
    const zonas = sites.zonas.map((zona, indice) =>
      indice === 0
        ? { ...zona, unidades: zona.unidades.map((item) => (item.id === U1.id ? { ...item, requerMotor: "o motor da unidade" } : item)) }
        : zona,
    );
    expect(conferirMotorDoConteudo([origens, { ...sites, zonas }, ...resto], [U1]).join("\n")).toContain(
      "ela ainda requer motor: o motor da unidade",
    );
  });

  it("motor planejado citando unidade sem requerMotor, trilha ou ilha que não existe falha", () => {
    const quebrado = {
      ...MOTORES_PLANEJADOS[0],
      usadoEm: [{ unidadeId: U1.id, como: "x" }, { unidadeId: "sites-inventada-u9", como: "x" }],
      trilhas: ["culinaria"],
      ilhasFuturas: ["atlantida"],
    };
    const problemas = conferirMotoresPlanejados([quebrado, quebrado], CURRICULO, ILHAS_FUTURAS, TRILHAS).join("\n");
    expect(problemas).toContain('motor planejado com id repetido: "ordenar-passos"');
    expect(problemas).toContain(`a unidade "${U1.id}" usa o motor planejado "ordenar-passos", mas o requerMotor dela (ou da zona) não cita`);
    expect(problemas).toContain('cita a unidade "sites-inventada-u9", que não está no currículo');
    expect(problemas).toContain('cita a trilha "culinaria", que não existe');
    expect(problemas).toContain('cita a ilha futura "atlantida", que não existe');
  });
});
