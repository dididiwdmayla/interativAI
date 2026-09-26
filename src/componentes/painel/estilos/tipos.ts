import type { RefDeclaracao } from "@/motor/css/editarCss";

/** O que o painel Estilos pede para quem o usa (as funções do núcleo do painel). */
export type AcoesEstilos = {
  /** Edita nome ou valor de uma declaração da folha editável (vazio apaga). */
  editarDeclaracao: (ref: RefDeclaracao, campo: "nome" | "valor", texto: string) => boolean;
  alternarDeclaracao: (ref: RefDeclaracao) => boolean;
  adicionarDeclaracao: (indiceRegra: number, propriedade: string, valor: string) => RefDeclaracao | null;
  /** Cria a regra nova do elemento; devolve o índice dela na folha. */
  adicionarRegra: (seletor: string) => number | null;
  /** Troca o atributo style inteiro de um elemento (element.style). */
  editarInline: (elemento: Element, estilo: string, detalhe: { propriedade: string; valor: string }) => boolean;
  /** Mostra um CSS provisório na prévia enquanto o jogador digita (null volta ao de verdade). */
  previsualizarCss: (css: string | null) => void;
  /** O link "estilo.css:12": abre a folha no editor CSS nessa posição. */
  irParaFonte: (posicao: number) => void;
  /** Acende na prévia as peças de um seletor (lista vazia apaga). */
  realcar: (elementos: readonly Element[]) => void;
  /** "Herdado de ...": seleciona o ancestral. */
  selecionarElemento: (elemento: Element) => void;
};

/** Degrau 3 da ajuda no painel: pisca a regra (e a declaração, se vier). */
export type DestaqueEstilos = { seletorRegra: string; propriedade?: string };

/** O que está sendo editado: uma declaração existente ou a nova, no fim do bloco. */
export type EdicaoEstilos = {
  bloco: string;
  alvo: number | "nova";
  campo: "nome" | "valor";
  /** Declaração nova: o nome já escolhido, enquanto edita o valor. */
  nomeNovo?: string;
};
