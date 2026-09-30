/*
 * S3: "Seu negócio no mapa". Terceira unidade da zona opcional "Ser
 * encontrado".
 *
 * Fase 1 (Salão Trança Fina): o perfil da empresa e os dados iguais em
 * todo lugar. Fase 2 (Restaurante Sabor de Casa): as avaliações. Fase 3
 * (Café Grão Dourado): dados estruturados (JSON-LD). Fase 4 (Guia do bairro
 * Boa Vista): o subtipo de LocalBusiness. Fase 5, desafio (Padaria Pão de
 * Mel, site novo): tudo junto.
 *
 * O passo a passo do perfil e a lista de subtipos moram em
 * src/conteudo/plataformas-marketing.ts (conferido em 30/09/2026).
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_S3_F1 } from "./fase-1-dados-iguais";
import { FASE_S3_F2 } from "./fase-2-avaliacoes";
import { FASE_S3_F3 } from "./fase-3-json-ld";
import { FASE_S3_F4 } from "./fase-4-subtipo";
import { FASE_S3_F5 } from "./fase-5-desafio";

export const FASES_UNIDADE_S3: readonly Fase[] = [FASE_S3_F1, FASE_S3_F2, FASE_S3_F3, FASE_S3_F4, FASE_S3_F5];

export const UNIDADE_S3: Unidade = {
  id: "sites-ser-encontrado-u3",
  ilha: "Ilha Sites",
  zona: "Ser encontrado",
  numero: 3,
  titulo: "Seu negócio no mapa",
  meta: {
    enunciado:
      "No fim desta unidade, você liga o site ao negócio no mapa: dados iguais em todo lugar, avaliações respondidas e dados estruturados com o tipo certo.",
    desafioId: FASE_S3_F5.id,
  },
  fases: FASES_UNIDADE_S3.map((fase) => fase.id),
};
