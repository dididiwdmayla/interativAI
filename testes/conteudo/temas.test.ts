/*
 * Temas (src/curriculo/temas.ts e src/lib/temas.ts): todo conceito tem
 * tema, as unidades prontas tiram os temas dos conceitos, as planejadas
 * declaram, a lente acende e conta o percurso inteiro, e as insígnias têm
 * marcos em 25, 50, 75 e 100%.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import { CONCEITOS } from "@/conteudo/conceitos";
import { CURRICULO, localNoCurriculo, trilhaDoId } from "@/curriculo";
import { IDS_TEMAS, TEMAS } from "@/curriculo/temas";
import { progressoDaLente, resolverLente, unidadeNaLente } from "@/lib/lentes";
import { normalizarProgresso, PROGRESSO_PADRAO } from "@/lib/progresso";
import { conferirTemas, marcoAtingido, progressoDoTema, temasDaUnidade, temasDerivados } from "@/lib/temas";

const web = trilhaDoId("web");
const item = (id: string) => {
  const local = localNoCurriculo(id);
  if (!local) throw new Error(id);
  return local.unidade;
};

describe("catálogo de temas", () => {
  it("ids únicos, com nome e descrição", () => {
    expect(new Set(IDS_TEMAS).size).toBe(IDS_TEMAS.length);
    expect(TEMAS.map((tema) => tema.id)).toEqual([...IDS_TEMAS]);
    for (const tema of TEMAS) expect(tema.nome.length * tema.descricao.length).toBeGreaterThan(0);
  });

  it("todo conceito tem pelo menos um tema e a checagem passa", () => {
    for (const conceito of CONCEITOS) expect(conceito.temas.length).toBeGreaterThan(0);
    expect(conferirTemas(CONCEITOS, CURRICULO)).toEqual([]);
  });
});

describe("temas das unidades", () => {
  it("prontas: os temas vêm dos conceitos ensinados e praticados", () => {
    const u4 = UNIDADES.find((unidade) => unidade.id === "sites-elementos-u4");
    if (!u4) throw new Error("U4");
    expect(temasDerivados(u4)).toEqual(["interfaces", "acessibilidade", "ferramentas"]);
    expect(temasDaUnidade(item("sites-elementos-u4"))).toEqual(temasDerivados(u4));
  });

  it("planejadas: valem os temas declarados no currículo", () => {
    expect(temasDaUnidade(item("rede-servidor-seguranca-u1"))).toEqual(["seguranca"]);
    expect(temasDaUnidade(item("oficio-variaveis-de-ambiente-u1"))).toEqual(["servidores", "seguranca", "ferramentas"]);
  });
});

describe("sabotagens da checagem de temas", () => {
  it("conceito sem tema e tema que não existe", () => {
    const problemas = conferirTemas([{ id: "sem-tema", temas: [] }, { id: "tema-errado", temas: ["culinaria"] }], []).join("\n");
    expect(problemas).toContain('o conceito "sem-tema" não tem tema');
    expect(problemas).toContain('o conceito "tema-errado" cita o tema "culinaria", que não existe');
  });

  it("unidade pronta que declara um tema que os conceitos dela não têm; planejada sem tema", () => {
    const quebrado = CURRICULO.map((ilha) =>
      ilha.id !== "sites"
        ? ilha
        : {
            ...ilha,
            zonas: ilha.zonas.map((zona) => ({
              ...zona,
              unidades: zona.unidades.map((unidade) =>
                unidade.id === "sites-elementos-u1"
                  ? { ...unidade, temas: ["seguranca" as const] }
                  : unidade.id === "sites-layout-u1"
                    ? { ...unidade, temas: [] }
                    : unidade,
              ),
            })),
          },
    );
    const problemas = conferirTemas(CONCEITOS, quebrado).join("\n");
    expect(problemas).toContain('a unidade pronta "sites-elementos-u1" declara o tema "seguranca"');
    expect(problemas).toContain('a unidade "sites-layout-u1" do currículo não declara temas');
  });
});

describe("lente e insígnias", () => {
  it("a lente de tema acende planejadas e prontas e conta o percurso inteiro", () => {
    const lente = resolverLente({ tipo: "tema", id: "seguranca" });
    if (!lente) throw new Error("lente");
    expect(lente.nome).toBe("Segurança");
    expect(unidadeNaLente(item("rede-servidor-seguranca-u2"), lente)).toBe(true);
    expect(unidadeNaLente(item("sites-elementos-u1"), lente)).toBe(false);
    const conta = progressoDaLente(lente, web, PROGRESSO_PADRAO);
    expect(conta.concluidas).toBe(0);
    expect(conta.total).toBeGreaterThanOrEqual(5);
    expect(conta).toEqual(progressoDoTema("seguranca", web, PROGRESSO_PADRAO));
  });

  it("lente desconhecida é nenhuma; o progresso guarda a lente e os marcos", () => {
    expect(resolverLente({ tipo: "tema", id: "culinaria" })).toBeNull();
    expect(resolverLente(null)).toBeNull();
    expect(normalizarProgresso({ lente: { tipo: "tema", id: "dados" } }).lente).toEqual({ tipo: "tema", id: "dados" });
    expect(normalizarProgresso({ lente: { tipo: "outra", id: "dados" } }).lente).toBeNull();
    expect(normalizarProgresso({ marcosInsignias: { dados: 50, lixo: "x" } }).marcosInsignias).toEqual({ dados: 50 });
  });

  it("marcos em 25, 50, 75 e 100%", () => {
    const conta = (concluidas: number, total: number) => ({ concluidas, prontas: total, total });
    expect(marcoAtingido(conta(0, 8))).toBe(0);
    expect(marcoAtingido(conta(1, 8))).toBe(0);
    expect(marcoAtingido(conta(2, 8))).toBe(25);
    expect(marcoAtingido(conta(5, 8))).toBe(50);
    expect(marcoAtingido(conta(6, 8))).toBe(75);
    expect(marcoAtingido(conta(8, 8))).toBe(100);
    expect(marcoAtingido(conta(0, 0))).toBe(0);
  });

  it("concluir as unidades de Sites enche a insígnia Interfaces", () => {
    const sites = UNIDADES.filter((unidade) => unidade.id.startsWith("sites-"));
    const progresso = { ...PROGRESSO_PADRAO, fasesConcluidas: sites.flatMap((unidade) => unidade.fases) };
    const interfaces = progressoDoTema("interfaces", web, progresso);
    expect(interfaces.concluidas).toBe(sites.length);
    expect(interfaces.total).toBeGreaterThan(sites.length);
  });
});
