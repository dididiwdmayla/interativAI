/*
 * O movimento dos dispositivos no desenho da cena (só a tela): o portão
 * desliza, o letreiro acende letra por letra, o ventilador gira. Tudo sai do
 * rastro e do instante, sem relógio próprio: voltar a barra de tempo mostra
 * o portão no meio do caminho, igual à primeira vez.
 */
import type { FiltroPasso, MudancaCena, RastroCena, ValorCena } from "./modelo";

/** Quanto o portão leva para abrir ou fechar inteiro. */
export const PORTAO_MS = 1_200;
/** Quanto tempo entre uma letra e a próxima no letreiro. */
export const LETRA_MS = 70;
/** Graus por milissegundo do ventilador, por ponto de velocidade. */
const GRAUS_POR_MS = 0.25;

function mudancasDe(rastro: RastroCena, dispositivo: string, propriedade: string, tempoMs: number, filtro: FiltroPasso | null): MudancaCena[] {
  return rastro.mudancas.filter((m) => {
    if (m.dispositivo !== dispositivo || m.propriedade !== propriedade || m.tempoMs > tempoMs) return false;
    if (!filtro || m.execucao < filtro.execucao) return true;
    if (m.execucao > filtro.execucao) return false;
    return m.passo === null || m.passo <= filtro.passo;
  });
}

/** O valor do começo de uma propriedade (o do rastro). */
function inicialDe(rastro: RastroCena, dispositivo: string, propriedade: string): ValorCena | undefined {
  return rastro.inicial[dispositivo]?.[propriedade];
}

/** Quanto o portão está aberto no instante: 0 fechado, 1 aberto inteiro (no meio, deslizando). */
export function aberturaDoPortao(rastro: RastroCena, dispositivo: string, tempoMs: number, filtro: FiltroPasso | null = null): number {
  let posicao = inicialDe(rastro, dispositivo, "aberto") === true ? 1 : 0;
  let alvo = posicao;
  let desde = 0;
  const andar = (ate: number) => {
    const passo = Math.max(0, ate - desde) / PORTAO_MS;
    posicao = alvo > posicao ? Math.min(alvo, posicao + passo) : Math.max(alvo, posicao - passo);
    desde = ate;
  };
  for (const mudanca of mudancasDe(rastro, dispositivo, "aberto", tempoMs, filtro)) {
    andar(mudanca.tempoMs);
    alvo = mudanca.valor === true ? 1 : 0;
  }
  andar(tempoMs);
  return posicao;
}

/** Quantas letras do texto do letreiro já acenderam no instante (elas acendem uma de cada vez). */
export function letrasAcesas(rastro: RastroCena, dispositivo: string, texto: string, tempoMs: number, filtro: FiltroPasso | null = null): number {
  const mudancas = mudancasDe(rastro, dispositivo, "texto", tempoMs, filtro);
  const ultima = mudancas[mudancas.length - 1];
  if (!ultima) return texto.length;
  return Math.min(texto.length, Math.floor((tempoMs - ultima.tempoMs) / LETRA_MS) + 1);
}

/** O ângulo das pás do ventilador no instante: a soma de quanto ele girou em cada velocidade. */
export function anguloDoVentilador(rastro: RastroCena, dispositivo: string, tempoMs: number, filtro: FiltroPasso | null = null): number {
  let velocidade = Number(inicialDe(rastro, dispositivo, "velocidade") ?? 0);
  let desde = 0;
  let angulo = 0;
  for (const mudanca of mudancasDe(rastro, dispositivo, "velocidade", tempoMs, filtro)) {
    angulo += velocidade * (mudanca.tempoMs - desde) * GRAUS_POR_MS;
    velocidade = Number(mudanca.valor);
    desde = mudanca.tempoMs;
  }
  angulo += velocidade * (tempoMs - desde) * GRAUS_POR_MS;
  return angulo % 360;
}
