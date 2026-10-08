import type { CSSProperties } from "react";
import { sorteioFixo } from "../geometria";

type Props = {
  /** Tamanho do desenho (as coordenadas das ondas). */
  largura: number;
  altura: number;
  /** Quantos px da tela vale uma unidade do desenho. */
  escala: number;
  /** Ondas paradas, pintadas junto com o mar (sem camada própria): o mundo. */
  parado?: boolean;
};

/**
 * O mar do mapa: as ondinhas, em duas camadas de HTML que balançam devagar
 * por CSS (transform). O fundo é a cor do mar do contêiner.
 *
 * Por que fora do SVG do mapa: as ondas cobrem o mundo inteiro, e um grupo
 * animado DENTRO do SVG fazia o Chrome repintar o desenho todo a cada quadro
 * (mais de 100 vezes por segundo). Num celular mais fraco, os pedaços do mapa
 * que entravam na tela ao rolar não ficavam prontos a tempo e apareciam só com
 * a cor do mar: uma ilha sem arte e sem nome, até sair da tela e voltar. Aqui
 * o deslize é do compositor (a camada não repinta), e com menos movimento as
 * ondas ficam paradas.
 *
 * No mundo (`parado`, rodada 40), as ondas são desenho parado, pintado junto
 * com o mar fundo numa camada só: as duas camadas do deslize eram do tamanho
 * do mundo inteiro e, num celular, disputavam a memória de vídeo com as
 * ilhas e os nomes (que sumiam). A vida do mar fica com os reflexos, a
 * espuma, os peixes e o barquinho.
 */
export function Oceano({ largura, altura, escala, parado = false }: Props) {
  const ondas = Array.from({ length: Math.round((largura * altura) / 16000) }, (_, indice) => ({
    x: sorteioFixo(indice + 1) * largura,
    y: sorteioFixo(indice + 101) * altura,
    escala: 0.7 + sorteioFixo(indice + 201) * 0.8,
    grupo: indice % 2,
  }));
  if (parado) {
    return (
      <svg viewBox={`0 0 ${largura} ${altura}`} width={largura * escala} height={altura * escala} className="pointer-events-none absolute inset-0" aria-hidden="true" data-ondas="paradas">
        {ondas.map((onda, indice) => (
          <path
            key={indice}
            d="M0 0q6-5 12 0t12 0"
            transform={`translate(${onda.x.toFixed(0)} ${onda.y.toFixed(0)}) scale(${onda.escala.toFixed(2)})`}
            fill="none"
            stroke="var(--cor-onda)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        ))}
      </svg>
    );
  }
  return (
    <>
      {[0, 1].map((grupo) => (
        <div
          key={grupo}
          aria-hidden="true"
          data-ondas={grupo}
          className="ondas-do-mar pointer-events-none absolute inset-0"
          style={{ "--deriva": `${(grupo === 0 ? 18 : -18) * escala}px`, "--duracao": `${6 + grupo * 2}s` } as CSSProperties}
        >
          <svg viewBox={`0 0 ${largura} ${altura}`} width="100%" height="100%" className="block">
            {ondas
              .filter((onda) => onda.grupo === grupo)
              .map((onda, indice) => (
                <path
                  key={indice}
                  d="M0 0q6-5 12 0t12 0"
                  transform={`translate(${onda.x.toFixed(0)} ${onda.y.toFixed(0)}) scale(${onda.escala.toFixed(2)})`}
                  fill="none"
                  stroke="var(--cor-onda)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              ))}
          </svg>
        </div>
      ))}
    </>
  );
}
