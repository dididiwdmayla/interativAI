/*
 * Registro dos itens da Revisão do dia: um arquivo por conceito
 * (src/conteudo/revisao/<conceito>.ts), cada um com pelo menos 2 variações.
 * Item novo: crie o arquivo, importe aqui e acrescente na lista.
 *
 * Guia: docs/GUIA-DE-CONTEUDO.md, "Itens de revisão".
 */
import { ITENS_ANINHAMENTO } from "./aninhamento";
import { ITENS_CODIGO_HTML } from "./codigo-html";
import { ITENS_DESFAZER } from "./desfazer";
import { ITENS_DUPLICAR_ELEMENTO } from "./duplicar-elemento";
import { ITENS_EDITAR_TEXTO } from "./editar-texto";
import { ITENS_ELEMENTO } from "./elemento";
import { ITENS_ELEMENTO_FILHO } from "./elemento-filho";
import { ITENS_ELEMENTO_PAI } from "./elemento-pai";
import { ITENS_ELEMENTOS_IRMAOS } from "./elementos-irmaos";
import { ITENS_ESCONDER_ELEMENTO } from "./esconder-elemento";
import { ITENS_LISTA_E_ITENS } from "./lista-e-itens";
import { ITENS_MODO_INSPECIONAR } from "./modo-inspecionar";
import { ITENS_REMOVER_DO_DOCUMENTO } from "./remover-do-documento";
import { ITENS_SELECIONAR_PELA_ARVORE } from "./selecionar-pela-arvore";
import { ITENS_TAG } from "./tag";
import { ITENS_DESCRICAO_NA_BUSCA } from "./descricao-na-busca";
import { ITENS_INDEXACAO } from "./indexacao";
import { ITENS_NOINDEX } from "./noindex";
import { ITENS_RASTREAMENTO } from "./rastreamento";
import { ITENS_TITULO_NA_BUSCA } from "./titulo-na-busca";
import { ITENS_TITULOS_HIERARQUIA } from "./titulos-hierarquia";
import { ITENS_PARAGRAFO } from "./paragrafo";
import { ITENS_ENFASE_FORTE } from "./enfase-forte";
import { ITENS_ENFASE_LEVE } from "./enfase-leve";
import { ITENS_LISTA_NUMERADA } from "./lista-numerada";
import { ITENS_EDITAR_ATRIBUTO } from "./editar-atributo";
import { ITENS_LINK_HREF } from "./link-href";
import { ITENS_LINK_ANCORA } from "./link-ancora";
import { ITENS_LINK_ABA_NOVA } from "./link-aba-nova";
import { ITENS_IMAGEM_ALT } from "./imagem-alt";
import { ITENS_ID_UNICO } from "./id-unico";
import { ITENS_CLASS_REPETIVEL } from "./class-repetivel";
import { ITENS_DIV_GENERICA } from "./div-generica";
import { ITENS_SEMANTICA_HTML } from "./semantica-html";
import { ITENS_SECTION_VS_ARTICLE } from "./section-vs-article";
import { ITENS_SPAN_GENERICO } from "./span-generico";
import { ITENS_ESTRUTURA_DO_DOCUMENTO } from "./estrutura-do-documento";
import { ITENS_HEAD_VS_BODY } from "./head-vs-body";
import { ITENS_TITLE } from "./title";
import { ITENS_META_CHARSET } from "./meta-charset";
import type { IdConceito, ItemRevisao } from "../tipos";

export const ITENS_REVISAO: readonly ItemRevisao[] = [
  // U1 (modelo, com comentários pedagógicos no topo de cada arquivo)
  ...ITENS_ELEMENTO,
  ...ITENS_TAG,
  ...ITENS_SELECIONAR_PELA_ARVORE,
  ...ITENS_MODO_INSPECIONAR,
  ...ITENS_EDITAR_TEXTO,
  ...ITENS_CODIGO_HTML,
  ...ITENS_LISTA_E_ITENS,
  // U2
  ...ITENS_ELEMENTO_PAI,
  ...ITENS_ELEMENTO_FILHO,
  ...ITENS_ANINHAMENTO,
  ...ITENS_ESCONDER_ELEMENTO,
  ...ITENS_REMOVER_DO_DOCUMENTO,
  ...ITENS_DESFAZER,
  ...ITENS_DUPLICAR_ELEMENTO,
  ...ITENS_ELEMENTOS_IRMAOS,
  // S1 (modelo da zona Ser encontrado: mini-sites no modo documento)
  ...ITENS_RASTREAMENTO,
  ...ITENS_INDEXACAO,
  ...ITENS_TITULO_NA_BUSCA,
  ...ITENS_DESCRICAO_NA_BUSCA,
  ...ITENS_NOINDEX,
  // U3 a U6 (zona Elementos)
  ...ITENS_TITULOS_HIERARQUIA,
  ...ITENS_PARAGRAFO,
  ...ITENS_ENFASE_FORTE,
  ...ITENS_ENFASE_LEVE,
  ...ITENS_LISTA_NUMERADA,
  ...ITENS_EDITAR_ATRIBUTO,
  ...ITENS_LINK_HREF,
  ...ITENS_LINK_ANCORA,
  ...ITENS_LINK_ABA_NOVA,
  ...ITENS_IMAGEM_ALT,
  ...ITENS_ID_UNICO,
  ...ITENS_CLASS_REPETIVEL,
  ...ITENS_DIV_GENERICA,
  ...ITENS_SEMANTICA_HTML,
  ...ITENS_SECTION_VS_ARTICLE,
  ...ITENS_SPAN_GENERICO,
  ...ITENS_ESTRUTURA_DO_DOCUMENTO,
  ...ITENS_HEAD_VS_BODY,
  ...ITENS_TITLE,
  ...ITENS_META_CHARSET,
];

/** Os itens de um conceito, na ordem do arquivo. */
export function itensDoConceito(conceito: IdConceito, itens: readonly ItemRevisao[] = ITENS_REVISAO): ItemRevisao[] {
  return itens.filter((item) => item.conceito === conceito);
}

export function itemDoId(id: string, itens: readonly ItemRevisao[] = ITENS_REVISAO): ItemRevisao | undefined {
  return itens.find((item) => item.id === id);
}
