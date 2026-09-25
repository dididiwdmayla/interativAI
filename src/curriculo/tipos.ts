/*
 * O currículo inteiro em dados: ilhas, zonas e unidades, na ordem do
 * jogo. É a versão em dados do docs/MAPA-CURRICULAR.md. O mapa das ilhas
 * desenha tudo daqui e as checagens conferem o conteúdo contra ele.
 *
 * Status não é guardado: uma unidade é "pronta" quando existe conteúdo
 * registrado com o mesmo id (src/conteudo/index.ts); senão, "planejada".
 */

/** Ícone da zona no mapa: a aba do DevTools (ou a ferramenta) relacionada. */
export type IconeZona =
  | "museu"
  | "elementos"
  | "estilos"
  | "layout"
  | "responsivo"
  | "publicar"
  | "console"
  | "fontes"
  | "rede"
  | "aplicacao"
  | "terminal"
  | "git"
  | "componentes";

export type UnidadeCurriculo = {
  /**
   * "<ilha>-<zona>-u<numero>". U1 e U2 usam os ids de unidade que já
   * existem no conteúdo. O conteúdo novo usa o id daqui.
   */
  id: string;
  titulo: string;
  /** O X em uma frase. */
  meta: string;
  /**
   * Raro: o que falta no motor só para ESTA unidade, numa zona que já tem
   * motor (ex.: a U6 da zona Elementos). Ausente = segue a zona.
   */
  requerMotor?: string;
};

export type ZonaCurriculo = {
  id: string;
  nome: string;
  icone: IconeZona;
  /** Texto curto do que falta no motor; ausente = motor pronto. */
  requerMotor?: string;
  unidades: UnidadeCurriculo[];
};

export type IlhaCurriculo = {
  /** "origens", "sites", "logica", "paginas-vivas", "rede-servidor", "oficio", "frameworks". */
  id: string;
  nome: string;
  /** Fora da rota principal (Frameworks). */
  opcional?: boolean;
  /** Aberta desde o começo, sem depender de outra (Origens). */
  sempreAberta?: boolean;
  zonas: ZonaCurriculo[];
};

export type StatusUnidade = "pronta" | "planejada";
