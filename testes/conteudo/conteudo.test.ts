/*
 * Testes de todo o conteúdo: cada regra de src/conteudo/checagens.ts vira
 * um teste por fase. A mensagem de falha diz a fase, a regra e o motivo.
 */
import { describe, it } from "vitest";
import { REGRAS_DE_FASE, REGRAS_GERAIS } from "@/conteudo/checagens";
import { FASES, UNIDADES } from "@/conteudo";
import { ITENS_REVISAO } from "@/conteudo/revisao";
import { faseDoItem } from "@/conteudo/revisao/faseDoItem";
import { semProblemas } from "./ajuda";

const contexto = { unidades: UNIDADES, fases: FASES };

describe("conteúdo: regras gerais", () => {
  for (const regra of REGRAS_GERAIS) {
    it(regra.nome, () => semProblemas(regra.checar(contexto)));
  }
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
