/*
 * S5: "Anúncio pago por dentro". Quinta e última unidade da zona opcional
 * "Ser encontrado". Tipo de fase simulador-campanha (números fictícios e
 * simplificação declarada: aqui a posição sai de lance vezes qualidade; no
 * Google de verdade entram mais coisas, e o Índice de qualidade é só um
 * diagnóstico, não entra no leilão).
 *
 * Fase 1 (Pizzaria Forno Vivo): o leilão, o custo por clique e a
 * palavra-chave. Fase 2 (Ótica Olhar Novo): o orçamento diário e a palavra.
 * Fase 3 (Doceria Casa de Bolo): a página de destino e o Índice de
 * qualidade. Fase 4, o desafio (Pet Shop Rabo Feliz, site novo): mesma verba,
 * mais clientes.
 *
 * Sem `meta.desafioId`: os validadores do simulador só existem no tipo
 * simulador-campanha, e uma fase de desafio (tipo "desafio") não os aceita.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_S5_F1 } from "./fase-1-leilao";
import { FASE_S5_F2 } from "./fase-2-orcamento";
import { FASE_S5_F3 } from "./fase-3-pagina-de-destino";
import { FASE_S5_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_S5: readonly Fase[] = [FASE_S5_F1, FASE_S5_F2, FASE_S5_F3, FASE_S5_F4];

export const UNIDADE_S5: Unidade = {
  id: "sites-ser-encontrado-u5",
  ilha: "Ilha Sites",
  zona: "Ser encontrado",
  numero: 5,
  titulo: "Anúncio pago por dentro",
  meta: {
    enunciado:
      "No fim desta unidade, você entende o leilão do anúncio pago e vê por que uma página melhor faz a mesma verba trazer mais clientes, e mais baratos.",
  },
  fases: FASES_UNIDADE_S5.map((fase) => fase.id),
};
