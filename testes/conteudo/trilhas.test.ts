/*
 * A camada de trilhas (src/curriculo/trilhas.ts): as trilhas citam ilhas
 * que existem, o núcleo comum está em todas, o mundo e o desbloqueio
 * seguem a trilha escolhida e o progresso das ilhas vale em qualquer uma.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import {
  CURRICULO,
  ILHAS_FUTURAS,
  ilhaDoId,
  ilhasDaTrilha,
  NUCLEO_COMUM,
  TRILHA_PADRAO,
  TRILHAS,
  trilhaDoId,
  trilhasDaIlha,
} from "@/curriculo";
import { conferirTrilhas } from "@/curriculo/conferir";
import type { Trilha } from "@/curriculo/trilhas";
import { estadoDaIlha, ilhaAnterior, ilhaAtual, progressoDeUnidades, unidadesDaTrilha } from "@/lib/mapa";
import { normalizarProgresso, PROGRESSO_PADRAO, type Progresso } from "@/lib/progresso";

const conferir = (trilhas: readonly Trilha[], unidades: readonly Unidade[] = UNIDADES) =>
  conferirTrilhas(trilhas, CURRICULO, ILHAS_FUTURAS, unidades, NUCLEO_COMUM, TRILHA_PADRAO);

const ilha = (id: string) => {
  const achada = ilhaDoId(id);
  if (!achada) throw new Error(id);
  return achada;
};

const comTrilha = (trilha: string, extra: Partial<Progresso> = {}): Progresso => ({ ...PROGRESSO_PADRAO, trilha, ...extra });

describe("trilhas em dados", () => {
  it("passam na checagem do testar:conteudo", () => {
    expect(conferir(TRILHAS)).toEqual([]);
  });

  it("Web é a padrão e ativa, com as ilhas do mapa de hoje; Jogos e Automação em construção", () => {
    expect(TRILHA_PADRAO).toBe("web");
    expect(trilhaDoId("web").ilhas).toEqual(["origens", "sites", "logica", "paginas-vivas", "rede-servidor", "python", "ia", "oficio", "frameworks"]);
    expect(TRILHAS.map((trilha) => [trilha.id, trilha.status])).toEqual([
      ["web", "ativa"],
      ["jogos", "em-construcao"],
      ["automacao", "em-construcao"],
    ]);
    expect(trilhaDoId("automacao").ilhas).toEqual(
      expect.arrayContaining(["comandos-eletricos", "clp-e-ladder", "eletronica", "mecanica"]),
    );
  });

  it("o núcleo comum está em todas; id desconhecido cai na Web", () => {
    for (const id of NUCLEO_COMUM) expect(trilhasDaIlha(id).map((trilha) => trilha.id)).toEqual(["web", "jogos", "automacao"]);
    expect(trilhaDoId("nao-existe").id).toBe("web");
    expect(trilhaDoId(undefined).id).toBe("web");
  });

  it("as ilhas futuras só têm nome e ficam fora do currículo", () => {
    for (const futura of ILHAS_FUTURAS) {
      expect(futura.zonas).toEqual([]);
      expect(CURRICULO.some((item) => item.id === futura.id)).toBe(false);
    }
    expect(ilhasDaTrilha(trilhaDoId("jogos")).map((item) => item.id)).toEqual(trilhaDoId("jogos").ilhas);
  });
});

describe("sabotagens da checagem de trilhas", () => {
  const web = trilhaDoId("web");

  it("trilha que cita ilha inexistente", () => {
    const quebrada = [...TRILHAS.filter((trilha) => trilha.id !== "jogos"), { ...trilhaDoId("jogos"), ilhas: [...trilhaDoId("jogos").ilhas, "ilha-fantasma"] }];
    expect(conferir(quebrada).join("\n")).toContain('a trilha "jogos" cita a ilha "ilha-fantasma", que não existe no currículo');
  });

  it("ilha com conteúdo fora de todas as trilhas", () => {
    const semSites = TRILHAS.map((trilha) => (trilha.id === "web" ? { ...web, ilhas: web.ilhas.filter((id) => id !== "sites") } : trilha));
    expect(conferir(semSites).join("\n")).toContain('a ilha "sites" tem conteúdo, mas não pertence a nenhuma trilha');
  });

  it("trilha sem uma ilha do núcleo e padrão em construção", () => {
    const semLogica = TRILHAS.map((trilha) => (trilha.id === "web" ? { ...web, ilhas: web.ilhas.filter((id) => id !== "logica"), status: "em-construcao" as const } : trilha));
    const problemas = conferir(semLogica).join("\n");
    expect(problemas).toContain('a trilha "web" não passa pela ilha "logica" do núcleo comum');
    expect(problemas).toContain('a trilha padrão "web" precisa estar ativa');
  });
});

describe("o mapa segue a trilha", () => {
  it("progresso guarda a trilha (padrão Web; lixo vira Web)", () => {
    expect(PROGRESSO_PADRAO.trilha).toBe("web");
    expect(normalizarProgresso({ trilha: "automacao" }).trilha).toBe("automacao");
    expect(normalizarProgresso({ trilha: 3 }).trilha).toBe("web");
  });

  it("a ilha anterior depende da trilha", () => {
    const logica = ilha("logica");
    expect(ilhaAnterior(logica, { progresso: comTrilha("web") })?.id).toBe("sites");
    expect(ilhaAnterior(logica, { progresso: comTrilha("jogos") })).toBeNull();
    expect(ilhaAnterior(logica, { progresso: comTrilha("automacao") })?.id).toBe("mecanica");
    expect(ilhaAnterior(ilha("frameworks"), { progresso: comTrilha("web") })?.id).toBe("oficio");
  });

  it("sem trilha escolhida, o computadorzinho fica em Sites; na Automação, na primeira ilha própria", () => {
    expect(ilhaAtual({ progresso: PROGRESSO_PADRAO }).id).toBe("sites");
    expect(ilhaAtual({ progresso: comTrilha("automacao") }).id).toBe("eletronica");
    // A fase aberta é de Sites, que não está na trilha Jogos: vale a primeira da rota dela.
    const sitesU1 = UNIDADES.find((unidade) => unidade.id === "sites-elementos-u1") ?? UNIDADES[0];
    expect(ilhaAtual({ progresso: comTrilha("jogos", { faseAtual: sitesU1.fases[0] }) }).id).toBe("logica");
  });

  it("ilhas futuras ficam em construção; Sites continua aberta pelo endereço, em qualquer trilha", () => {
    const fonte = { progresso: comTrilha("automacao") };
    expect(estadoDaIlha(ilha("clp-e-ladder"), fonte)).toBe("construcao");
    expect(estadoDaIlha(ilha("sites"), fonte)).toBe("disponivel");
  });

  it("o progresso é da ilha: o que foi concluído vale em todas as trilhas", () => {
    const U1 = UNIDADES.find((unidade) => unidade.id === "sites-elementos-u1") ?? UNIDADES[0];
    const feito = { fasesConcluidas: U1.fases };
    const naWeb = progressoDeUnidades(unidadesDaTrilha(trilhaDoId("web")), comTrilha("web", feito));
    const naJogos = progressoDeUnidades(unidadesDaTrilha(trilhaDoId("jogos")), comTrilha("jogos", feito));
    expect(naWeb.concluidas).toBe(1);
    expect(naWeb.total).toBeGreaterThan(naWeb.prontas);
    // A trilha Jogos não passa por Sites: a U1 não conta nela, e as ilhas próprias não têm unidades.
    expect(naJogos.concluidas).toBe(0);
    expect(naJogos.total).toBe(unidadesDaTrilha(trilhaDoId("jogos")).length);
  });
});
