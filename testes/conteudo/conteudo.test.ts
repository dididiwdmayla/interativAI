/*
 * Testes de todo o conteúdo: cada regra de src/conteudo/checagens.ts vira
 * um teste por fase. A mensagem de falha diz a fase, a regra e o motivo.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { REGRAS_DE_FASE, REGRAS_GERAIS } from "@/conteudo/checagens";
import { FASES, UNIDADES } from "@/conteudo";
import { ITENS_REVISAO } from "@/conteudo/revisao";
import { faseDoItem } from "@/conteudo/revisao/faseDoItem";
import { semProblemas } from "./ajuda";
import { cenasRepetidas } from "@/motor/cena/ritmo";
import { carregarPythonNode } from "@/motor/linguagens/python/node";
import { definirPythonSincrono } from "@/motor/linguagens/sincrono";

// O comparador do museu (sala 3) roda Python de verdade: as simulações usam o Pyodide do Node.
beforeAll(async () => {
  definirPythonSincrono(await carregarPythonNode());
}, 60_000);
afterAll(() => definirPythonSincrono(null));

const contexto = { unidades: UNIDADES, fases: FASES };

describe("conteúdo: regras gerais", () => {
  for (const regra of REGRAS_GERAIS) {
    it(regra.nome, () => semProblemas(regra.checar(contexto)));
  }
  // Regra de ritmo (guia, seção 30.6): dentro da unidade, uma cena que repete outra vira aviso;
  // entre unidades, reprova (a regra geral "cena-repetida-entre-unidades").
  it("avisa as cenas que repetem outra na mesma unidade (não falha)", () => {
    const avisos = cenasRepetidas(FASES);
    for (const aviso of avisos) console.warn(`[aviso de cena] ${aviso}`);
    expect(Array.isArray(avisos)).toBe(true);
  });
});

for (const fase of FASES) {
  describe(`fase ${fase.id} (${fase.titulo})`, () => {
    for (const regra of REGRAS_DE_FASE) {
      it(regra.nome, () => semProblemas(regra.checar(fase, contexto)));
    }
  });
}

// Itens da Revisão do dia: as mesmas regras dos objetivos, sobre a fase de um objetivo que cada item vira.
for (const item of ITENS_REVISAO) {
  const fase = faseDoItem(item);
  describe(`item de revisão ${item.id} (${item.conceito})`, () => {
    for (const regra of REGRAS_DE_FASE) {
      it(regra.nome, () => semProblemas(regra.checar(fase, contexto)));
    }
  });
}
