/*
 * O modelo de caixa de um elemento, com as medidas REAIS do iframe
 * (getComputedStyle e getBoundingClientRect). É só para ver (a aba
 * Calculado e o destaque das camadas na prévia): os validadores usam o
 * motor de cascata, que não depende de layout.
 */

export type Lados = { cima: number; direita: number; baixo: number; esquerda: number };

export type Retangulo = { x: number; y: number; largura: number; altura: number };

export type CamadaCaixa = "margin" | "border" | "padding" | "content";

export type ModeloCaixa = {
  margem: Lados;
  borda: Lados;
  preenchimento: Lados;
  /** Largura e altura do conteúdo (sem padding e sem borda). */
  conteudo: { largura: number; altura: number };
  /** Posição de cada caixa (coordenadas da janela do iframe). */
  caixas: Record<CamadaCaixa, Retangulo>;
  /**
   * top, right, bottom e left quando position não é static (o Chrome mostra
   * então a camada "position" por fora); null quando é static.
   */
  deslocamento: Record<keyof Lados, string> | null;
};

/** O que a prévia acende: uma camada (hover numa camada do diagrama) ou todas. */
export type RealceCaixa = { camada: CamadaCaixa | "todas"; modelo: ModeloCaixa };

function numero(texto: string): number {
  const valor = parseFloat(texto);
  return Number.isFinite(valor) ? valor : 0;
}

function lados(estilo: CSSStyleDeclaration, prefixo: string, sufixo = ""): Lados {
  return {
    cima: numero(estilo.getPropertyValue(`${prefixo}-top${sufixo}`)),
    direita: numero(estilo.getPropertyValue(`${prefixo}-right${sufixo}`)),
    baixo: numero(estilo.getPropertyValue(`${prefixo}-bottom${sufixo}`)),
    esquerda: numero(estilo.getPropertyValue(`${prefixo}-left${sufixo}`)),
  };
}

function encolher(caixa: Retangulo, por: Lados): Retangulo {
  return {
    x: caixa.x + por.esquerda,
    y: caixa.y + por.cima,
    largura: Math.max(0, caixa.largura - por.esquerda - por.direita),
    altura: Math.max(0, caixa.altura - por.cima - por.baixo),
  };
}

function crescer(caixa: Retangulo, por: Lados): Retangulo {
  return {
    x: caixa.x - por.esquerda,
    y: caixa.y - por.cima,
    largura: caixa.largura + por.esquerda + por.direita,
    altura: caixa.altura + por.cima + por.baixo,
  };
}

/** Mede o modelo de caixa do elemento na janela dele. Null sem janela (documento solto). */
export function medirModeloCaixa(elemento: Element): ModeloCaixa | null {
  const janela = elemento.ownerDocument.defaultView;
  if (!janela) return null;
  const estilo = janela.getComputedStyle(elemento);
  const margem = lados(estilo, "margin");
  const borda = lados(estilo, "border", "-width");
  const preenchimento = lados(estilo, "padding");
  const retangulo = elemento.getBoundingClientRect();
  const doBorda: Retangulo = { x: retangulo.left, y: retangulo.top, largura: retangulo.width, altura: retangulo.height };
  const doPreenchimento = encolher(doBorda, borda);
  const doConteudo = encolher(doPreenchimento, preenchimento);
  return {
    margem,
    borda,
    preenchimento,
    conteudo: { largura: doConteudo.largura, altura: doConteudo.altura },
    caixas: { margin: crescer(doBorda, margem), border: doBorda, padding: doPreenchimento, content: doConteudo },
    deslocamento:
      estilo.getPropertyValue("position") === "static"
        ? null
        : {
            cima: estilo.getPropertyValue("top"),
            direita: estilo.getPropertyValue("right"),
            baixo: estilo.getPropertyValue("bottom"),
            esquerda: estilo.getPropertyValue("left"),
          },
  };
}

/**
 * Número como o Chrome mostra no diagrama (MetricsSidebarPane):
 * inteiro sem casas, quebrado com 3 casas (`toFixedIfFloating`). Zero é
 * "0"; o traço só aparece para valor vazio ou "auto" (ver `valorDoLado`).
 */
export function formatarMedida(valor: number): string {
  return Number.isInteger(valor) ? String(valor) : valor.toFixed(3);
}

/** Um lado da camada "position" como o Chrome mostra: "auto" vira traço, px some. */
export function valorDoLado(texto: string): string {
  if (texto === "" || texto === "auto") return "\u2012";
  const numero = Number(texto.replace(/px$/, ""));
  return Number.isNaN(numero) ? texto : formatarMedida(numero);
}
