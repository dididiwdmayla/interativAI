/*
 * O template anotado (docs/TEMPLATE-FASE.ts) também passa nas regras de
 * fase: quem copia ele começa de um conteúdo que funciona.
 */
import { describe, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import type { Unidade } from "@/conteudo/tipos";
import { TEMPLATE_DESAFIO, TEMPLATE_PRATICA } from "../../docs/TEMPLATE-FASE";
import { semProblemas } from "./ajuda";

const UNIDADE: Unidade = {
  id: "sites-elementos-u9",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 9,
  titulo: "Template",
  meta: { enunciado: "No fim desta unidade, você...", desafioId: TEMPLATE_DESAFIO.id },
  fases: [TEMPLATE_PRATICA.id, TEMPLATE_DESAFIO.id],
};
const contexto = { unidades: [UNIDADE], fases: [TEMPLATE_PRATICA, TEMPLATE_DESAFIO] };

for (const fase of contexto.fases) {
  describe(`template ${fase.tipo}`, () => {
    for (const regra of REGRAS_DE_FASE) {
      it(regra.nome, () => semProblemas(regra.checar(fase, contexto)));
    }
  });
}
