/*
 * Profissões (src/curriculo/profissoes.ts e src/lib/profissoes.ts): dados
 * conferidos, progresso ponderado pelos pesos dos temas e a lente.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import { trilhaDoId } from "@/curriculo";
import { type Profissao, PROFISSOES, profissaoDoId } from "@/curriculo/profissoes";
import { resolverLente } from "@/lib/lentes";
import { conferirProfissoes, progressoDaProfissao } from "@/lib/profissoes";
import { PROGRESSO_PADRAO } from "@/lib/progresso";
import { fracao, progressoDoTema } from "@/lib/temas";

const web = trilhaDoId("web");
const sitesFeito = {
  ...PROGRESSO_PADRAO,
  fasesConcluidas: UNIDADES.filter((unidade) => unidade.id.startsWith("sites-")).flatMap((unidade) => unidade.fases),
};

describe("profissões", () => {
  it("as seis, com dados conferidos", () => {
    expect(PROFISSOES.map((profissao) => profissao.id)).toEqual(["front-end", "back-end", "full-stack", "seguranca", "dados", "devops"]);
    expect(conferirProfissoes(PROFISSOES)).toEqual([]);
  });

  it("sabotagem: tema que não existe, tema repetido e peso fora de 1 a 3", () => {
    const quebrada = {
      ...PROFISSOES[0],
      id: "quebrada",
      temas: [
        { tema: "culinaria", peso: 2 },
        { tema: "dados", peso: 1 },
        { tema: "dados", peso: 5 },
      ],
    } as unknown as Profissao;
    const problemas = conferirProfissoes([quebrada]).join("\n");
    expect(problemas).toContain('a profissão "quebrada" usa o tema "culinaria", que não existe');
    expect(problemas).toContain('a profissão "quebrada" repete o tema "dados"');
    expect(problemas).toContain('dá peso 5 ao tema "dados"');
  });

  it("progresso é a média dos temas ponderada pelos pesos", () => {
    const front = profissaoDoId("front-end");
    if (!front) throw new Error("front-end");
    expect(progressoDaProfissao(front, web, PROGRESSO_PADRAO)).toBe(0);
    const esperado =
      front.temas.reduce((soma, { tema, peso }) => soma + peso * fracao(progressoDoTema(tema, web, sitesFeito)), 0) /
      front.temas.reduce((soma, { peso }) => soma + peso, 0);
    const valor = progressoDaProfissao(front, web, sitesFeito);
    expect(valor).toBeCloseTo(esperado, 10);
    expect(valor).toBeGreaterThan(0);
    // Concluir Sites leva mais longe no Front-end do que no Back-end.
    const back = profissaoDoId("back-end");
    if (!back) throw new Error("back-end");
    expect(valor).toBeGreaterThan(progressoDaProfissao(back, web, sitesFeito));
  });

  it("a lente de profissão acende os temas dela", () => {
    const lente = resolverLente({ tipo: "profissao", id: "devops" });
    expect(lente?.nome).toBe("DevOps");
    expect(lente?.temas).toEqual(["ferramentas", "servidores", "seguranca", "desempenho"]);
    expect(resolverLente({ tipo: "profissao", id: "astronauta" })).toBeNull();
  });
});
