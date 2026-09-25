/*
 * Onde cada coisa fica na tela de uma ilha: as unidades são pontos num
 * caminho sinuoso (estilo Mario World), agrupados em regiões, uma por zona.
 * Deitado ou no desktop o caminho corre na horizontal; em pé, na vertical.
 */
import type { IlhaCurriculo, UnidadeCurriculo, ZonaCurriculo } from "@/curriculo/tipos";
import type { Ponto } from "../geometria";

export type PontoIlha = Ponto & {
  zona: ZonaCurriculo;
  item: UnidadeCurriculo;
  /** Posição no caminho inteiro (a partir de 0). */
  indice: number;
  /** Vertical: de que lado do ponto vai o nome. */
  lado: "esquerda" | "direita" | "baixo";
};

export type RegiaoZona = { zona: ZonaCurriculo; x: number; y: number; largura: number; altura: number };

export type DesenhoIlha = {
  largura: number;
  altura: number;
  vertical: boolean;
  pontos: PontoIlha[];
  regioes: RegiaoZona[];
  /** O chão da ilha (retângulo bem arredondado). */
  terra: { x: number; y: number; largura: number; altura: number; raio: number };
};

const HORIZONTAL = { passo: 165, vaoZona: 95, margem: 170, altura: 600, meio: 340, amplitude: 80 };
const VERTICAL = { passo: 132, vaoZona: 120, margemTopo: 150, margemBase: 120 };

export function desenharIlha(ilha: IlhaCurriculo, vertical: boolean, larguraTela: number): DesenhoIlha {
  const lista = ilha.zonas.flatMap((zona, zonaIndice) => zona.unidades.map((item) => ({ zona, zonaIndice, item })));
  if (!vertical) {
    const { passo, vaoZona, margem, altura, meio, amplitude } = HORIZONTAL;
    const pontos: PontoIlha[] = lista.map(({ zona, zonaIndice, item }, indice) => ({
      zona,
      item,
      indice,
      lado: "baixo",
      x: margem + indice * passo + zonaIndice * vaoZona,
      y: meio + amplitude * Math.sin(indice * 1.1 + 0.3),
    }));
    const largura = (pontos[pontos.length - 1]?.x ?? margem) + margem;
    const regioes = ilha.zonas.map((zona) => {
      const daZona = pontos.filter((ponto) => ponto.zona === zona);
      const x = daZona[0].x - 82;
      return { zona, x, y: 86, largura: daZona[daZona.length - 1].x + 82 - x, altura: altura - 150 };
    });
    return {
      largura,
      altura,
      vertical,
      pontos,
      regioes,
      terra: { x: margem - 130, y: 44, largura: largura - 2 * (margem - 130), altura: altura - 80, raio: 150 },
    };
  }
  const largura = Math.max(320, larguraTela);
  const centro = largura / 2;
  const amplitude = Math.min(78, largura * 0.19);
  const { passo, vaoZona, margemTopo, margemBase } = VERTICAL;
  const pontos: PontoIlha[] = lista.map(({ zona, zonaIndice, item }, indice) => {
    const x = centro + amplitude * Math.sin(indice * 1.1 + 0.3);
    return {
      zona,
      item,
      indice,
      x,
      y: margemTopo + indice * passo + zonaIndice * vaoZona,
      lado: x < centro ? "direita" : "esquerda",
    };
  });
  const altura = (pontos[pontos.length - 1]?.y ?? margemTopo) + margemBase;
  const regioes = ilha.zonas.map((zona) => {
    const daZona = pontos.filter((ponto) => ponto.zona === zona);
    const y = daZona[0].y - 92;
    return { zona, x: 22, y, largura: largura - 44, altura: daZona[daZona.length - 1].y + 62 - y };
  });
  return {
    largura,
    altura,
    vertical,
    pontos,
    regioes,
    terra: { x: 10, y: 40, largura: largura - 20, altura: altura - 70, raio: 90 },
  };
}
