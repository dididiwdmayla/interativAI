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
import { ITENS_O_QUE_E_CSS } from "./o-que-e-css";
import { ITENS_REGRA_E_DECLARACAO } from "./regra-e-declaracao";
import { ITENS_COR_DO_TEXTO } from "./cor-do-texto";
import { ITENS_COR_DE_FUNDO } from "./cor-de-fundo";
import { ITENS_COR_POR_NOME } from "./cor-por-nome";
import { ITENS_LIGAR_DESLIGAR_DECLARACAO } from "./ligar-desligar-declaracao";
import { ITENS_TAMANHO_DA_LETRA } from "./tamanho-da-letra";
import { ITENS_UNIDADE_REM } from "./unidade-rem";
import { ITENS_FAMILIA_DA_FONTE } from "./familia-da-fonte";
import { ITENS_ALINHAMENTO_DO_TEXTO } from "./alinhamento-do-texto";
import { ITENS_PESO_DA_FONTE } from "./peso-da-fonte";
import { ITENS_COR_HEXADECIMAL } from "./cor-hexadecimal";
import { ITENS_REGRA_NOVA } from "./regra-nova";
import { ITENS_SELETOR_DE_TAG } from "./seletor-de-tag";
import { ITENS_SELETOR_DE_CLASSE } from "./seletor-de-classe";
import { ITENS_SELETOR_DE_ID } from "./seletor-de-id";
import { ITENS_SELETOR_DESCENDENTE } from "./seletor-descendente";
import { ITENS_MODELO_DE_CAIXA } from "./modelo-de-caixa";
import { ITENS_PADDING_CSS } from "./padding-css";
import { ITENS_BORDER_CSS } from "./border-css";
import { ITENS_MARGIN_CSS } from "./margin-css";
import { ITENS_BOX_SIZING } from "./box-sizing";
import { ITENS_CASCATA_CSS } from "./cascata-css";
import { ITENS_ORDEM_DAS_REGRAS } from "./ordem-das-regras";
import { ITENS_ESPECIFICIDADE_CSS } from "./especificidade-css";
import { ITENS_HERANCA_CSS } from "./heranca-css";
import { ITENS_IMPORTANTE_CSS } from "./importante-css";
import { ITENS_VARIAVEL_CSS } from "./variavel-css";
import { ITENS_ESCOPO_DE_VARIAVEL } from "./escopo-de-variavel";
import { ITENS_CONTRASTE_DE_COR } from "./contraste-de-cor";
import { ITENS_SALVAR_COMO_MEU_TEMA } from "./salvar-como-meu-tema";
import { ITENS_DISPLAY_CSS } from "./display-css";
import { ITENS_DISPLAY_BLOCK } from "./display-block";
import { ITENS_DISPLAY_INLINE } from "./display-inline";
import { ITENS_DISPLAY_INLINE_BLOCK } from "./display-inline-block";
import { ITENS_DISPLAY_NONE } from "./display-none";
import { ITENS_FLEXBOX } from "./flexbox";
import { ITENS_FLEX_DIRECTION } from "./flex-direction";
import { ITENS_JUSTIFY_CONTENT } from "./justify-content";
import { ITENS_ALIGN_ITEMS } from "./align-items";
import { ITENS_GAP_CSS } from "./gap-css";
import { ITENS_FLEX_WRAP } from "./flex-wrap";
import { ITENS_CSS_GRID } from "./css-grid";
import { ITENS_GRID_TEMPLATE_COLUMNS } from "./grid-template-columns";
import { ITENS_FR_DO_GRID } from "./fr-do-grid";
import { ITENS_GRID_TEMPLATE_ROWS } from "./grid-template-rows";
import { ITENS_GRID_TEMPLATE_AREAS } from "./grid-template-areas";
import { ITENS_POSITION_CSS } from "./position-css";
import { ITENS_POSITION_RELATIVE } from "./position-relative";
import { ITENS_POSITION_ABSOLUTE } from "./position-absolute";
import { ITENS_POSITION_FIXED } from "./position-fixed";
import { ITENS_POSITION_STICKY } from "./position-sticky";
import { ITENS_Z_INDEX_CSS } from "./z-index-css";
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
  // E1 a E5 (zona Estilos)
  ...ITENS_O_QUE_E_CSS,
  ...ITENS_REGRA_E_DECLARACAO,
  ...ITENS_COR_DO_TEXTO,
  ...ITENS_COR_DE_FUNDO,
  ...ITENS_COR_POR_NOME,
  ...ITENS_LIGAR_DESLIGAR_DECLARACAO,
  ...ITENS_TAMANHO_DA_LETRA,
  ...ITENS_UNIDADE_REM,
  ...ITENS_FAMILIA_DA_FONTE,
  ...ITENS_ALINHAMENTO_DO_TEXTO,
  ...ITENS_PESO_DA_FONTE,
  ...ITENS_COR_HEXADECIMAL,
  ...ITENS_REGRA_NOVA,
  ...ITENS_SELETOR_DE_TAG,
  ...ITENS_SELETOR_DE_CLASSE,
  ...ITENS_SELETOR_DE_ID,
  ...ITENS_SELETOR_DESCENDENTE,
  ...ITENS_MODELO_DE_CAIXA,
  ...ITENS_PADDING_CSS,
  ...ITENS_BORDER_CSS,
  ...ITENS_MARGIN_CSS,
  ...ITENS_BOX_SIZING,
  ...ITENS_CASCATA_CSS,
  ...ITENS_ORDEM_DAS_REGRAS,
  ...ITENS_ESPECIFICIDADE_CSS,
  ...ITENS_HERANCA_CSS,
  ...ITENS_IMPORTANTE_CSS,
  ...ITENS_VARIAVEL_CSS,
  ...ITENS_ESCOPO_DE_VARIAVEL,
  ...ITENS_CONTRASTE_DE_COR,
  ...ITENS_SALVAR_COMO_MEU_TEMA,
  // L1 a L4 (zona Layout)
  ...ITENS_DISPLAY_CSS,
  ...ITENS_DISPLAY_BLOCK,
  ...ITENS_DISPLAY_INLINE,
  ...ITENS_DISPLAY_INLINE_BLOCK,
  ...ITENS_DISPLAY_NONE,
  ...ITENS_FLEXBOX,
  ...ITENS_FLEX_DIRECTION,
  ...ITENS_JUSTIFY_CONTENT,
  ...ITENS_ALIGN_ITEMS,
  ...ITENS_GAP_CSS,
  ...ITENS_FLEX_WRAP,
  ...ITENS_CSS_GRID,
  ...ITENS_GRID_TEMPLATE_COLUMNS,
  ...ITENS_FR_DO_GRID,
  ...ITENS_GRID_TEMPLATE_ROWS,
  ...ITENS_GRID_TEMPLATE_AREAS,
  ...ITENS_POSITION_CSS,
  ...ITENS_POSITION_RELATIVE,
  ...ITENS_POSITION_ABSOLUTE,
  ...ITENS_POSITION_FIXED,
  ...ITENS_POSITION_STICKY,
  ...ITENS_Z_INDEX_CSS,
];

/** Os itens de um conceito, na ordem do arquivo. */
export function itensDoConceito(conceito: IdConceito, itens: readonly ItemRevisao[] = ITENS_REVISAO): ItemRevisao[] {
  return itens.filter((item) => item.conceito === conceito);
}

export function itemDoId(id: string, itens: readonly ItemRevisao[] = ITENS_REVISAO): ItemRevisao | undefined {
  return itens.find((item) => item.id === id);
}
