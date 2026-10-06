/*
 * Onde cada coisa fica na tela de uma ilha: as unidades são pontos num
 * caminho sinuoso (estilo Mario World), agrupados em zonas que dividem o chão
 * da ilha, cada uma com a placa dela. Deitado ou no desktop o caminho corre
 * na horizontal; em pé, na vertical.
 *
 * Também sai daqui o chão (o contorno orgânico da areia e da grama, a
 * espuma, as pedrinhas, o mato da borda e o relevo) e onde os enfeites da
 * ilha podem ficar sem encostar em nada (pontos, nomes, caminho, placas e o
 * lugar do computadorzinho). Puro: testado em testes/conteudo/mapa.test.ts.
 */
import type { IlhaCurriculo, UnidadeCurriculo, ZonaCurriculo } from "@/curriculo/tipos";
import {
  amostrarContorno,
  amostrasDoCaminho,
  type Arredondado,
  caminhoFechado,
  dentroDoArredondado,
  encolher,
  type Ponto,
  sorteioFixo,
} from "../geometria";

export type PontoIlha = Ponto & {
  zona: ZonaCurriculo;
  item: UnidadeCurriculo;
  /** Posição no caminho inteiro (a partir de 0). */
  indice: number;
  /** De que lado do ponto vai o nome (em pé, para o lado do meio; deitado, embaixo). */
  lado: "esquerda" | "direita" | "baixo";
};

export type Caixa = { x: number; y: number; largura: number; altura: number };

export type RegiaoZona = {
  zona: ZonaCurriculo;
  /** A posição da zona na ilha: escolhe o tom e a textura. */
  indice: number;
  /** O pedaço do chão da zona (o desenho recorta pela grama). */
  x: number;
  y: number;
  largura: number;
  altura: number;
  /** A placa: o canto de cima, o lado de onde ela cresce e a largura que cabe. */
  placa: { x: number; y: number; lado: "esquerda" | "direita"; larguraMaxima: number };
};

/** A divisa entre duas zonas (uma cerca viva), com o ponto em que o caminho atravessa. */
export type Fronteira = { de: Ponto; ate: Ponto; travessia: Ponto };

/** Um enfeite da ilha (prédio, engrenagem, antena...): o centro, o tamanho e qual do conjunto da ilha. */
export type Enfeite = Ponto & { escala: number; tipo: number; zonaIndice: number };

export type DesenhoIlha = {
  largura: number;
  altura: number;
  vertical: boolean;
  /** Quantos px da tela vale uma unidade do desenho (deitado, a ilha cabe na altura; em pé, 1). */
  escala: number;
  pontos: PontoIlha[];
  regioes: RegiaoZona[];
  /** O chão da ilha (o retângulo arredondado de base do contorno da areia). */
  terra: Arredondado;
  /** A grama, por dentro da areia (sem as ondulações do contorno: o miolo seguro). */
  grama: Arredondado;
  /** Os contornos orgânicos (caminhos SVG fechados). */
  contorno: { areia: string; grama: string; espuma: string; sombra: string };
  pedrinhas: (Ponto & { raio: number })[];
  matinhos: (Ponto & { escala: number })[];
  relevos: (Ponto & { rx: number; ry: number })[];
  fronteiras: Fronteira[];
  enfeites: Enfeite[];
  /** O que não pode ser coberto por enfeite (pontos, nomes, caminho, placas, o computadorzinho). */
  ocupado: Caixa[];
};

/*
 * Tudo em px da tela: os pontos (52 px), os nomes (144 px de largura), as
 * placas e o computadorzinho têm tamanho fixo, então o desenho também.
 */
/** Deitado: a distância entre pontos (o nome de um não encosta no do outro) e a altura mínima. */
const HORIZONTAL = { passo: 176, alturaMinima: 300, amplitudeMaxima: 170 };
/** Em pé: o espaço entre os pontos, o vão entre zonas e o cabeçalho de cada zona (a placa e o computadorzinho em cima do primeiro ponto). */
const VERTICAL = { passo: 132, vaoZona: 110, cabecalho: 186, margemBase: 120 };
/** A placa de uma zona: até onde ela cresce (duas linhas, com as plaquinhas) e a folga em volta. */
const PLACA = { largura: 230, altura: 80, folga: 12 };
/** A faixa de areia entre o mar e a grama. */
const AREIA = 18;
/** Quanto o contorno ondula (para dentro e para fora). */
const ONDULACAO = 6;
/** O tamanho de um enfeite (a caixa que ele ocupa em volta do centro). */
const ENFEITE = 48;

/** Um número da ilha (para os sorteios fixos não serem iguais em todas as ilhas). */
function sementeDe(texto: string): number {
  let soma = 7;
  for (const letra of texto) soma = (soma * 31 + letra.charCodeAt(0)) % 9973;
  return soma;
}

const encosta = (a: Caixa, b: Caixa) => a.x < b.x + b.largura && b.x < a.x + a.largura && a.y < b.y + b.altura && b.y < a.y + a.altura;

/** O x da borda da grama na altura y (do lado pedido), contando os cantos redondos. */
function bordaNaAltura(grama: Arredondado, y: number, lado: "esquerda" | "direita"): number {
  const r = Math.min(grama.raio, grama.largura / 2, grama.altura / 2);
  const dy = y < grama.y + r ? grama.y + r - y : y > grama.y + grama.altura - r ? y - (grama.y + grama.altura - r) : 0;
  const recuo = dy > 0 ? r - Math.sqrt(Math.max(0, r * r - dy * dy)) : 0;
  return lado === "esquerda" ? grama.x + recuo : grama.x + grama.largura - recuo;
}

/** O y da borda de cima da grama na coluna x (contando os cantos redondos). */
function topoNaColuna(grama: Arredondado, x: number): number {
  const r = Math.min(grama.raio, grama.largura / 2, grama.altura / 2);
  const dx = x < grama.x + r ? grama.x + r - x : x > grama.x + grama.largura - r ? x - (grama.x + grama.largura - r) : 0;
  return grama.y + (dx > 0 ? r - Math.sqrt(Math.max(0, r * r - dx * dx)) : 0);
}

/**
 * A caixa estimada do nome de um ponto (até duas linhas e as estrelas
 * embaixo), em unidades do desenho: o nome tem tamanho fixo na tela.
 */
export function caixaDoNome(ponto: PontoIlha, escala = 1): Caixa {
  const e = (px: number) => px / escala;
  if (ponto.lado === "baixo") return { x: ponto.x - e(80), y: ponto.y + e(28), largura: e(160), altura: e(58) };
  if (ponto.lado === "direita") return { x: ponto.x + e(30), y: ponto.y - e(30), largura: e(158), altura: e(60) };
  return { x: ponto.x - e(188), y: ponto.y - e(30), largura: e(158), altura: e(60) };
}

/** Onde o computadorzinho fica quando está num ponto (em cima dele). */
export function caixaDoMascote(ponto: Ponto, escala = 1): Caixa {
  return { x: ponto.x - 32 / escala, y: ponto.y - 90 / escala, largura: 64 / escala, altura: 64 / escala };
}

/** A caixa estimada da placa de uma zona (com até duas linhas). */
export function caixaDaPlaca(regiao: RegiaoZona, escala = 1): Caixa {
  const { x, y, lado, larguraMaxima } = regiao.placa;
  return { x: lado === "esquerda" ? x : x - larguraMaxima, y, largura: larguraMaxima, altura: PLACA.altura / escala };
}

export function desenharIlha(ilha: IlhaCurriculo, vertical: boolean, larguraTela: number, alturaTela = 0): DesenhoIlha {
  const semente = sementeDe(ilha.id);
  const lista = ilha.zonas.flatMap((zona, zonaIndice) => zona.unidades.map((item) => ({ zona, zonaIndice, item })));
  // O desenho é em px da tela nos dois sentidos (deitado, ele ocupa a altura que a tela tem).
  const escala = 1;
  let largura: number;
  let altura: number;
  let pontos: PontoIlha[];
  let terra: Arredondado;
  let regioes: RegiaoZona[];
  const dosPontos = (zona: ZonaCurriculo) => pontos.filter((ponto) => ponto.zona === zona);
  if (!vertical) {
    // Deitado: a ilha ocupa a altura da tela. A placa de cada zona fica no alto, numa coluna só dela
    // antes do primeiro ponto; os pontos ondulam na faixa de baixo, com o computadorzinho em cima e o nome embaixo.
    altura = Math.max(HORIZONTAL.alturaMinima, alturaTela || 600);
    const raio = Math.min(150, altura * 0.3);
    const gramaY = 10 + AREIA;
    const gramaBase = altura - 10 - AREIA;
    const yMinimo = gramaY + PLACA.folga + PLACA.altura + 26;
    const yMaximo = Math.max(yMinimo, gramaBase - 12 - 86);
    const meio = (yMinimo + yMaximo) / 2;
    const amplitude = Math.min(HORIZONTAL.amplitudeMaxima, (yMaximo - yMinimo) / 2);
    const gramaProvisoria = { x: 10 + AREIA, y: gramaY, largura: 1e6, altura: gramaBase - gramaY, raio: raio - AREIA };
    pontos = [];
    const placas: { x: number; inicio: number }[] = [];
    let x = 0;
    ilha.zonas.forEach((zona, zonaIndice) => {
      // A divisa fica depois do nome da última unidade da zona anterior; a placa, logo depois dela.
      const inicio = zonaIndice === 0 ? 10 : x + 72 + 22;
      const placaX = Math.max(inicio + PLACA.folga, bordaNaAltura(gramaProvisoria, gramaY + PLACA.folga, "esquerda") + 10);
      placas.push({ x: placaX, inicio });
      x = placaX + PLACA.largura + 46;
      zona.unidades.forEach((item, k) => {
        if (k > 0) x += HORIZONTAL.passo;
        const indice = pontos.length;
        pontos.push({ zona, item, indice, lado: "baixo", x, y: meio + amplitude * Math.sin(indice * 1.1 + 0.3) });
      });
    });
    largura = x + 72 + 40;
    terra = { x: 10, y: 10, largura: largura - 20, altura: altura - 20, raio };
    regioes = ilha.zonas.map((zona, indice) => {
      const inicio = placas[indice].inicio;
      const fim = indice === ilha.zonas.length - 1 ? terra.x + terra.largura : placas[indice + 1].inicio;
      return {
        zona,
        indice,
        x: inicio,
        y: terra.y,
        largura: fim - inicio,
        altura: terra.altura,
        placa: { x: placas[indice].x, y: gramaY + PLACA.folga, lado: "esquerda", larguraMaxima: PLACA.largura },
      };
    });
  } else {
    largura = Math.max(320, larguraTela);
    const centro = largura / 2;
    const amplitude = Math.min(78, largura * 0.19);
    const { passo, vaoZona, cabecalho, margemBase } = VERTICAL;
    // O primeiro ponto fica abaixo da placa da primeira zona e do computadorzinho em cima dele.
    const topo = 40 + AREIA + PLACA.folga + PLACA.altura + 96;
    pontos = lista.map(({ zona, zonaIndice, item }, indice) => {
      const x = centro + amplitude * Math.sin(indice * 1.1 + 0.3);
      return { zona, item, indice, x, y: topo + indice * passo + zonaIndice * (vaoZona + cabecalho - passo), lado: x < centro ? "direita" : "esquerda" };
    });
    altura = (pontos[pontos.length - 1]?.y ?? topo) + margemBase;
    terra = { x: 10, y: 40, largura: largura - 20, altura: altura - 70, raio: 90 };
    const gramaV = encolher(terra, AREIA);
    regioes = ilha.zonas.map((zona, indice) => {
      const primeira = dosPontos(zona)[0];
      const proxima = dosPontos(ilha.zonas[indice + 1] ?? zona)[0];
      const inicio = indice === 0 ? terra.y : (primeira?.y ?? 0) - cabecalho;
      const fim = indice === ilha.zonas.length - 1 || !proxima ? terra.y + terra.altura : proxima.y - cabecalho;
      // A placa no alto da zona, do lado oposto ao primeiro ponto (em cima dele fica o computadorzinho).
      const lado: "esquerda" | "direita" = primeira && primeira.x < centro ? "direita" : "esquerda";
      const y = Math.max(inicio, gramaV.y) + PLACA.folga;
      const borda = lado === "esquerda" ? bordaNaAltura(gramaV, y, "esquerda") + 10 : bordaNaAltura(gramaV, y, "direita") - 10;
      return {
        zona,
        indice,
        x: terra.x,
        y: inicio,
        largura: terra.largura,
        altura: fim - inicio,
        placa: {
          x: borda,
          y,
          lado,
          // Até a outra beirada da grama (nos cantos redondos do alto, ela é mais estreita).
          larguraMaxima: Math.min(PLACA.largura + 40, lado === "esquerda" ? bordaNaAltura(gramaV, y, "direita") - 10 - borda : borda - bordaNaAltura(gramaV, y, "esquerda") - 10),
        },
      };
    });
  }
  const grama = encolher(terra, AREIA);
  const divisas = regioes.slice(1).map((regiao) => (vertical ? regiao.y : regiao.x));

  // O contorno orgânico: a mesma ondulação para a areia, a grama, a espuma e a sombra na água.
  const amostras = amostrarContorno(terra, 34);
  const ondas = amostras.map((_, i) => (sorteioFixo(semente + i) * 2 - 1) * ONDULACAO);
  const contornoCom = (deslocamento: number, fator: number, dy = 0) =>
    caminhoFechado(
      amostras.map(({ ponto, normal }, i) => ({
        x: ponto.x + normal.x * (deslocamento + ondas[i] * fator),
        y: ponto.y + normal.y * (deslocamento + ondas[i] * fator) + dy,
      })),
    );
  const contorno = {
    areia: contornoCom(0, 1),
    grama: contornoCom(-AREIA, 0.7),
    espuma: contornoCom(9, 1.2),
    sombra: contornoCom(4, 1, 12),
  };
  // Pedrinhas no meio da faixa de areia (nem todas as amostras: fica natural).
  const pedrinhas = amostrarContorno(terra, 23).flatMap(({ ponto, normal }, i) => {
    if (sorteioFixo(semente + 300 + i) < 0.45) return [];
    const recuo = AREIA / 2 + (sorteioFixo(semente + 500 + i) - 0.5) * 6;
    return [{ x: ponto.x - normal.x * recuo, y: ponto.y - normal.y * recuo, raio: 2.2 + sorteioFixo(semente + 700 + i) * 2.2 }];
  });

  // O que enfeite nenhum pode cobrir.
  const caminho = amostrasDoCaminho(pontos, 14);
  const ocupado: Caixa[] = [
    ...pontos.flatMap((ponto) => [
      { x: ponto.x - 38 / escala, y: ponto.y - 38 / escala, largura: 76 / escala, altura: 76 / escala },
      caixaDoNome(ponto, escala),
      caixaDoMascote(ponto, escala),
    ]),
    ...caminho.map((amostra) => ({ x: amostra.x - 20, y: amostra.y - 20, largura: 40, altura: 40 })),
    ...regioes.map((regiao) => caixaDaPlaca(regiao, escala)),
  ];
  const livre = (caixa: Caixa) => !ocupado.some((outra) => encosta(caixa, outra));

  // O mato da borda da grama: tufos a cada tanto, fora dos nomes e das placas.
  const matinhos = amostrarContorno(grama, 58).flatMap(({ ponto, normal }, i) => {
    const centro = { x: ponto.x - normal.x * 9, y: ponto.y - normal.y * 9 };
    const escala = 0.75 + sorteioFixo(semente + 900 + i) * 0.5;
    return livre({ x: centro.x - 12, y: centro.y - 10, largura: 24, altura: 20 }) ? [{ ...centro, escala }] : [];
  });

  // Relevo: morrinhos suaves em cada zona (por baixo de tudo; a grama recorta).
  const relevos = regioes.flatMap((regiao, z) =>
    [0, 1].map((k) => {
      const s = semente + 1100 + z * 7 + k * 3;
      // Num chão grande, morros maiores.
      const fator = Math.min(2.2, Math.max(1, Math.min(regiao.largura, regiao.altura) / 320));
      return {
        x: regiao.x + regiao.largura * (0.22 + 0.56 * sorteioFixo(s)),
        y: regiao.y + regiao.altura * (0.25 + 0.5 * sorteioFixo(s + 1)),
        rx: (55 + 50 * sorteioFixo(s + 2)) * fator,
        ry: (22 + 18 * sorteioFixo(s + 3)) * fator,
      };
    }),
  );

  // As divisas como cercas vivas, de borda a borda da grama, com a passagem do caminho.
  const fronteiras: Fronteira[] = divisas.map((divisa) => {
    const travessia = caminho.reduce((melhor, amostra) =>
      Math.abs((vertical ? amostra.y : amostra.x) - divisa) < Math.abs((vertical ? melhor.y : melhor.x) - divisa) ? amostra : melhor,
    caminho[0] ?? { x: divisa, y: divisa });
    if (vertical) return { de: { x: bordaNaAltura(grama, divisa, "esquerda") + 8, y: divisa }, ate: { x: bordaNaAltura(grama, divisa, "direita") - 8, y: divisa }, travessia };
    return { de: { x: divisa, y: topoNaColuna(grama, divisa) + 8 }, ate: { x: divisa, y: grama.y + grama.altura - (topoNaColuna(grama, divisa) - grama.y) - 8 }, travessia };
  });

  // Os enfeites: uma grade de lugares dentro da grama, longe de tudo, os mais espalhados primeiro.
  // O centro longe o bastante da beirada para a caixa inteira (até o canto) ficar na grama.
  // Numa ilha alta (o computador), os enfeites crescem um pouco para não sumirem no chão grande.
  const tamanho = vertical ? 1 : Math.min(1.45, Math.max(1, altura / 520));
  const lado = ENFEITE * tamanho;
  const seguro = encolher(terra, AREIA + ONDULACAO + lado * 0.71 + 6);
  const enfeites: Enfeite[] = [];
  regioes.forEach((regiao, z) => {
    const candidatos: Ponto[] = [];
    for (let y = regiao.y + 20; y < regiao.y + regiao.altura - 20; y += 30) {
      for (let x = regiao.x + 20; x < regiao.x + regiao.largura - 20; x += 30) {
        const centro = { x, y };
        const caixa = { x: x - lado / 2, y: y - lado / 2, largura: lado, altura: lado };
        if (dentroDoArredondado(seguro, centro) && livre(caixa)) candidatos.push(centro);
      }
    }
    const quantos = Math.max(2, Math.min(10, Math.round((regiao.largura * regiao.altura) / (13000 * tamanho * tamanho))));
    const escolhidos: Ponto[] = [];
    while (escolhidos.length < quantos && candidatos.length) {
      // O primeiro é sorteado; os seguintes, os mais longe dos que já estão (e de outros enfeites da ilha).
      let melhor = Math.floor(sorteioFixo(semente + 1300 + z) * candidatos.length);
      if (escolhidos.length) {
        let maiorDistancia = -1;
        candidatos.forEach((candidato, i) => {
          const distancia = Math.min(...[...escolhidos, ...enfeites].map((outro) => Math.hypot(outro.x - candidato.x, outro.y - candidato.y)));
          if (distancia > maiorDistancia) {
            maiorDistancia = distancia;
            melhor = i;
          }
        });
        if (maiorDistancia < lado * 1.4) break;
      }
      escolhidos.push(candidatos.splice(melhor, 1)[0]);
    }
    escolhidos.forEach((centro, k) =>
      enfeites.push({ ...centro, zonaIndice: z, escala: tamanho * (0.85 + 0.3 * sorteioFixo(semente + 1500 + enfeites.length)), tipo: Math.floor(sorteioFixo(semente + 1700 + z * 11 + k) * 1000) }),
    );
  });

  return { largura, altura, vertical, escala, pontos, regioes, terra, grama, contorno, pedrinhas, matinhos, relevos, fronteiras, enfeites, ocupado };
}
