/*
 * Depuração, U6: o segundo chamado, um software com defeito. Na fase 1, o
 * aquecimento (o conserto que quebra o resto e o teste de regressão); na
 * fase 2, o contrato da agenda do Salão Girassol. As duas usam a recepção
 * do salão: a cena de um software é a tela dele (o aplicativo no balcão).
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DEPURACAO_U6_F1 } from "./fase-1";
import { FASE_DEPURACAO_U6_F2 } from "./fase-2-contrato";

export const FASES_DEPURACAO_U6: readonly Fase[] = [FASE_DEPURACAO_U6_F1, FASE_DEPURACAO_U6_F2];

export const UNIDADE_DEPURACAO_U6: Unidade = {
  id: "logica-depuracao-u6",
  ilha: "Ilha Lógica",
  zona: "Depuração",
  numero: 6,
  titulo: "Chamado: a agenda do salão",
  meta: {
    enunciado: "O Salão Girassol chama você: a agenda marca duas clientes no mesmo horário. Reproduzir, achar a causa, consertar sem quebrar o resto e entregar o relatório.",
    desafioId: "logica-depuracao-u6-f2",
  },
  fases: FASES_DEPURACAO_U6.map((fase) => fase.id),
};
