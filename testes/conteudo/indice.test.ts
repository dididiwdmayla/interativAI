import { describe, expect, it } from "vitest";
import { FASES } from "@/conteudo";
import { CONCEITOS } from "@/conteudo/conceitos";
import { montarIndice } from "@/conteudo/indice";
import type { Fase } from "@/conteudo/tipos";
import { semProblemas } from "./ajuda";

describe("montarIndice()", () => {
  const indice = montarIndice();

  it("todo conceito do catálogo usado por alguma fase aparece no índice", () => {
    const usados = new Set(
      FASES.flatMap((fase) => [
        ...fase.conceitos,
        ...(fase.tipo === "pratica" ? (fase.pratica ?? []) : []),
        ...fase.revisa,
        ...fase.prerequisitos,
      ]),
    );
    const noIndice = new Set(indice.map((entrada) => entrada.conceito.id));
    semProblemas(
      CONCEITOS.filter((conceito) => usados.has(conceito.id) && !noIndice.has(conceito.id)).map(
        (conceito) => `o conceito "${conceito.id}" é usado mas não está no índice`,
      ),
    );
  });

  it("não inventa conceito: tudo no índice é usado por alguma fase", () => {
    semProblemas(
      indice
        .filter((entrada) => [entrada.ensinam, entrada.praticam, entrada.revisam, entrada.pedem].every((lista) => lista.length === 0))
        .map((entrada) => `o conceito "${entrada.conceito.id}" está no índice sem nenhuma fase`),
    );
  });

  it("cada fase aparece no lugar certo (ensina, pratica, revisa, pede)", () => {
    const problemas: string[] = [];
    for (const entrada of indice) {
      const { id } = entrada.conceito;
      const esperado = (filtro: (fase: Fase) => boolean) => FASES.filter(filtro).map((fase) => fase.id);
      const conferir = (nome: string, atual: string[], esperada: string[]) => {
        if (atual.join("|") !== esperada.join("|")) problemas.push(`"${id}" ${nome}: ${atual.join(", ")} (esperado ${esperada.join(", ")})`);
      };
      conferir("ensinam", entrada.ensinam, esperado((fase) => fase.tipo === "pratica" && fase.conceitos.includes(id)));
      conferir(
        "praticam",
        entrada.praticam,
        esperado((fase) =>
          fase.tipo === "desafio" ? fase.conceitos.includes(id) : (fase.pratica ?? []).includes(id),
        ),
      );
      conferir("revisam", entrada.revisam, esperado((fase) => fase.revisa.includes(id)));
      conferir("pedem", entrada.pedem, esperado((fase) => fase.prerequisitos.includes(id)));
    }
    semProblemas(problemas);
  });

  it("fase só de sozinho entra em praticam, não em ensinam (u1-f2)", () => {
    const editar = indice.find((entrada) => entrada.conceito.id === "editar-texto");
    expect(editar?.ensinam).toContain("sites-elementos-u1-f1");
    expect(editar?.ensinam).not.toContain("sites-elementos-u1-f2");
    expect(editar?.praticam).toContain("sites-elementos-u1-f2");
  });

  it("segue a ordem do catálogo", () => {
    const ordem = CONCEITOS.map((conceito) => conceito.id);
    const posicoes = indice.map((entrada) => ordem.indexOf(entrada.conceito.id));
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });
});
