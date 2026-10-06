/*
 * O desenho do mundo (a tela das ilhas) para o tamanho da tela: onde cada
 * ilha fica e a escala. Puro, testado em testes/conteudo/mapa.test.ts.
 */
import type { Trilha } from "@/curriculo";
import type { IlhaCurriculo } from "@/curriculo/tipos";
import type { Ponto } from "./geometria";

/**
 * Onde cada ilha fica no mundo da trilha Web, na ordem da rota: o x e a linha
 * do zigue-zague (0 em cima, 1 embaixo). Frameworks, a opcional, fica no fim,
 * ligada ao Ofício por uma rota mais clara.
 */
const POSICOES_WEB: Record<string, { x: number; linha: 0 | 1 }> = {
  origens: { x: 180, linha: 1 },
  sites: { x: 430, linha: 0 },
  logica: { x: 680, linha: 1 },
  "paginas-vivas": { x: 930, linha: 0 },
  "rede-servidor": { x: 1180, linha: 1 },
  python: { x: 1430, linha: 0 },
  ia: { x: 1680, linha: 1 },
  oficio: { x: 1930, linha: 0 },
  frameworks: { x: 2180, linha: 1 },
};

/**
 * O Porto da revisão: um ponto fixo no mar, em cima das Origens, no começo da
 * rota (um pouco acima da linha, para a etiqueta não encostar nas Origens com
 * o zigue-zague achatado).
 */
const PORTO = { x: 180, linha: 0 } as const;
const PORTO_ACIMA = 20;

/** Distância entre as ilhas vizinhas da rota (em unidades do desenho). */
const PASSO_X = 250;
/** Quanto a arte sobe acima do centro da ilha (o brilho, os andaimes, o computadorzinho) e onde começa a etiqueta. */
const ARTE_ACIMA = 86;
const ETIQUETA_ABAIXO = 70;
/** A etiqueta (nome e estado) tem tamanho fixo em px, fora da escala. */
const ETIQUETA_PX = 44;
/** A altura do zigue-zague (da linha de cima à de baixo): a padrão, a mais baixa (deitado) e a mais alta (em pé). */
const ZIGUE = { padrao: 250, minimo: 180, maximo: 520 };
const ESCALA_MINIMA = 0.45;
const ESCALA_MAXIMA = 1.15;
/** Abaixo desta escala com o zigue-zague padrão, achata o zigue-zague para as ilhas não ficarem miúdas. */
const ESCALA_PARA_ACHATAR = 0.7;

export type DesenhoMundo = {
  /** Tamanho do desenho em unidades (já com o mar que centraliza). */
  largura: number;
  altura: number;
  escala: number;
  posicao: (ilha: IlhaCurriculo) => Ponto;
  porto: Ponto;
};

/**
 * O desenho do mundo de uma trilha para a tela. As ilhas, com as etiquetas,
 * cabem na altura com a mesma margem em cima e embaixo: em pé sobra altura e
 * o zigue-zague fica fundo; deitado, ele achata para as ilhas não encolherem
 * demais. A largura rola de lado; numa tela mais larga que o mundo, o mar
 * sobra igual dos dois lados.
 */
export function desenhoDoMundo(trilha: Trilha, ilhas: readonly IlhaCurriculo[], larguraTela: number, alturaTela: number): DesenhoMundo {
  const rota = ilhas.filter((ilha) => !ilha.opcional);
  const opcionais = ilhas.filter((ilha) => ilha.opcional);
  const web = trilha.id === "web";
  // Outras trilhas: as ilhas em zigue-zague, na ordem da trilha, e as opcionais no fim.
  const lugar = (ilha: IlhaCurriculo): { x: number; linha: 0 | 1 } => {
    if (web && POSICOES_WEB[ilha.id]) return POSICOES_WEB[ilha.id];
    const indice = ilha.opcional ? rota.length + opcionais.indexOf(ilha) : rota.indexOf(ilha);
    return { x: 180 + indice * PASSO_X, linha: indice % 2 === 0 ? 1 : 0 };
  };
  const ultimoX = Math.max(PORTO.x, ...ilhas.map((ilha) => lugar(ilha).x));
  const largura = ultimoX + 160;
  const altura = alturaTela > 0 ? alturaTela : 800;
  const margem = Math.min(28, Math.max(10, altura * 0.035));
  const disponivel = altura - ETIQUETA_PX - 2 * margem;
  // Uma ilha (230 de largura) e um pouco de mar cabem na largura da tela.
  const escalaMaxima = larguraTela > 0 ? Math.min(ESCALA_MAXIMA, larguraTela / 400) : ESCALA_MAXIMA;
  const fixa = ARTE_ACIMA + ETIQUETA_ABAIXO;
  let escala = disponivel / (fixa + ZIGUE.padrao);
  if (escala < ESCALA_PARA_ACHATAR) escala = Math.max(ESCALA_MINIMA, disponivel / (fixa + ZIGUE.minimo));
  escala = Math.min(escalaMaxima, escala);
  const zigue = Math.min(ZIGUE.maximo, Math.max(ZIGUE.minimo, disponivel / escala - fixa));
  // O desenho cobre a tela; o que sobra vira mar, dividido igual dos dois lados.
  const alturaConteudoPx = (fixa + zigue) * escala + ETIQUETA_PX;
  const alturaPx = Math.max(altura, alturaConteudoPx + 2 * margem);
  const larguraPx = Math.max(larguraTela, largura * escala);
  const dx = (larguraPx / escala - largura) / 2;
  const topo = (alturaPx - alturaConteudoPx) / 2 / escala + ARTE_ACIMA;
  const noMundo = ({ x, linha }: { x: number; linha: 0 | 1 }): Ponto => ({ x: x + dx, y: topo + linha * zigue });
  return {
    largura: larguraPx / escala,
    altura: alturaPx / escala,
    escala,
    posicao: (ilha) => noMundo(lugar(ilha)),
    porto: { x: noMundo(PORTO).x, y: noMundo(PORTO).y - PORTO_ACIMA },
  };
}
