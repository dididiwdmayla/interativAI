/**
 * De onde veio uma seleção.
 * - "arvore" e "teclado": clique ou setas na árvore de elementos;
 * - "inspecao": modo inspecionar (a setinha);
 * - "trilha": a trilha de ancestrais no rodapé da aba Elementos;
 * - "codigo": cursor posto no editor de código;
 * - "sistema": o próprio jogo mudou a seleção (depois de apagar, duplicar,
 *   desfazer). Não gera evento "selecionou".
 */
export type OrigemSelecao = "arvore" | "teclado" | "inspecao" | "trilha" | "codigo" | "sistema";

export type EventoFase =
  | { tipo: "selecionou"; tag: string; caminho: number[]; origem: OrigemSelecao }
  | { tipo: "inspecionou"; tag: string; caminho: number[] }
  | { tipo: "trilha"; tag: string; caminho: number[] }
  | { tipo: "editouTexto"; tag: string; caminho: number[]; texto: string }
  | { tipo: "editouAtributo"; tag: string; caminho: number[]; atributo: string; valor: string }
  /** Criou um atributo que o elemento não tinha ("Adicionar atributo" do menu do nó). */
  | { tipo: "adicionouAtributo"; tag: string; caminho: number[]; atributo: string; valor: string }
  | { tipo: "editouCodigo" }
  | { tipo: "escondeu"; tag: string; caminho: number[] }
  | { tipo: "mostrou"; tag: string; caminho: number[] }
  | { tipo: "apagou"; tag: string; caminho: number[] }
  /** O caminho é o da cópia, que fica logo depois do original. */
  | { tipo: "duplicou"; tag: string; caminho: number[] }
  | { tipo: "desfez" }
  | { tipo: "refez" }
  | { tipo: "respondeuPrevisao"; opcao: number; acertou: boolean }
  /** Trocou o nome da tag (h2 virou h4). `tag` é a nova; `de`, a antiga. O caminho não muda. */
  | { tipo: "renomeouTag"; tag: string; de: string; caminho: number[] }
  /** Clicou num link da prévia (a navegação é segurada; ver src/lib/linksPrevia.ts). */
  | { tipo: "clicouLink"; href: string; destino: DestinoLink; caminho: number[] }
  /** Digitou no editor CSS (ou uma ação editarCss escreveu na folha). */
  | { tipo: "editouCss" }
  /**
   * Mudou o nome ou o valor de uma declaração (ou acrescentou uma) pelo
   * painel Estilos. `seletor` é o da regra ("element.style" no inline).
   */
  | { tipo: "editouPropriedade"; seletor: string; propriedade: string; valor: string }
  /** Ligou ou desligou uma declaração pela checkbox do painel Estilos. */
  | { tipo: "alternouDeclaracao"; seletor: string; propriedade: string; ativa: boolean }
  /** Criou uma regra nova pelo painel Estilos. */
  | { tipo: "adicionouRegra"; seletor: string };

/**
 * Para onde um link levaria:
 * - "ancora": #id de um elemento que existe na página (a prévia rola até ele);
 * - "quebrado": #id que nenhum elemento tem;
 * - "vazio": sem href, href vazio ou só "#";
 * - "externo": outra página ou site (a prévia não navega).
 */
export type DestinoLink = "ancora" | "quebrado" | "vazio" | "externo";

export type TipoEvento = EventoFase["tipo"];

/** Todos os tipos de evento, para conferir dados de conteúdo. */
export const TIPOS_EVENTO: readonly TipoEvento[] = [
  "selecionou",
  "inspecionou",
  "trilha",
  "editouTexto",
  "editouAtributo",
  "adicionouAtributo",
  "editouCodigo",
  "escondeu",
  "mostrou",
  "apagou",
  "duplicou",
  "desfez",
  "refez",
  "respondeuPrevisao",
  "renomeouTag",
  "clicouLink",
  "editouCss",
  "editouPropriedade",
  "alternouDeclaracao",
  "adicionouRegra",
];
