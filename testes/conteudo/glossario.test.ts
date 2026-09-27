/*
 * O glossário vivo (src/lib/glossario.ts): todo conceito entra, a busca
 * ignora acento e maiúscula, e os links levam à fase liberada ou ao ponto
 * da unidade no mapa.
 */
import { describe, expect, it } from "vitest";
import { FASES } from "@/conteudo";
import { CONCEITOS } from "@/conteudo/conceitos";
import { buscarNoGlossario, destinoDaFase, montarGlossario, normalizarBusca } from "@/lib/glossario";
import { PROGRESSO_PADRAO } from "@/lib/progresso";

const glossario = montarGlossario();
const verbete = (id: string) => {
  const achado = glossario.find((entrada) => entrada.conceito.id === id);
  if (!achado) throw new Error(id);
  return achado;
};

describe("glossário", () => {
  it("tem todos os conceitos do catálogo, em ordem alfabética", () => {
    expect(glossario.map((entrada) => entrada.conceito.id).sort()).toEqual(CONCEITOS.map((conceito) => conceito.id).sort());
    const nomes = glossario.map((entrada) => entrada.conceito.nome);
    expect(nomes).toEqual([...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });

  it("todo conceito tem onde aprender, e aprender e praticar não se repetem", () => {
    for (const entrada of glossario) {
      expect(entrada.aprender.length, entrada.conceito.id).toBeGreaterThan(0);
      for (const id of entrada.praticar) expect(entrada.aprender).not.toContain(id);
    }
    expect(verbete("margin-css").aprender).toContain("sites-estilos-u3-f2");
  });

  it("a busca ignora acento e maiúscula, pelo nome e pelo resumo", () => {
    expect(normalizarBusca("  Márgin  ")).toBe("margin");
    expect(buscarNoGlossario(glossario, "MARGIN").map((entrada) => entrada.conceito.id)).toContain("margin-css");
    expect(buscarNoGlossario(glossario, "heranca").map((entrada) => entrada.conceito.id)).toContain("heranca-css");
    // "acentos" só aparece no resumo do meta charset.
    expect(buscarNoGlossario(glossario, "acentos").map((entrada) => entrada.conceito.id)).toContain("meta-charset");
    expect(buscarNoGlossario(glossario, "")).toHaveLength(glossario.length);
    expect(buscarNoGlossario(glossario, "palavra-que-nao-existe")).toEqual([]);
  });

  it("fase liberada abre direto; trancada leva ao ponto da unidade no mapa", () => {
    const primeira = destinoDaFase(FASES[0].id, PROGRESSO_PADRAO);
    expect(primeira).toMatchObject({ liberada: true, href: `/fase/${FASES[0].id}`, aviso: null });
    const trancada = destinoDaFase("sites-estilos-u2-f1", PROGRESSO_PADRAO);
    expect(trancada).toMatchObject({
      liberada: false,
      href: "/ilha/sites#sites-estilos-u2",
      aviso: "Você chega lá na Ilha Sites",
    });
    expect(trancada?.rotulo).toBe("Seletores · Fase 1");
    expect(destinoDaFase("sites-estilos-u2-f1", { ...PROGRESSO_PADRAO, mapaDesbloqueado: true })?.liberada).toBe(true);
    expect(destinoDaFase("nao-existe", PROGRESSO_PADRAO)).toBeNull();
  });
});
