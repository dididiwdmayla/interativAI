/*
 * O modelo do circuito lógico: peças (entradas, portões e saídas), fios, a
 * simulação da corrente, a tabela verdade e o circuito escrito como código.
 * Independente da Ilha Lógica (sem nada de JavaScript do jogador): o mesmo
 * modelo serve para a sala "Por baixo do capô" das Origens (somador e
 * memória com realimentação) e para a futura trilha Automação industrial.
 *
 * A simulação anda em rodadas até ficar estável, começando do estado
 * anterior: um circuito sem voltas fica estável na primeira rodada; um com
 * realimentação (a saída voltando para a entrada, como o selo de uma
 * contatora) guarda o estado, que é o princípio da memória.
 */

export type TipoPortao = "e" | "ou" | "nao" | "xou";
export type TipoPeca = "entrada" | "saida" | TipoPortao;

export type Peca = {
  id: string;
  tipo: TipoPeca;
  /** Posição do canto de cima à esquerda, nas unidades da bancada (ver LARGURA_BANCADA). */
  x: number;
  y: number;
  /** Entradas e saídas: o nome no código (um identificador: temCliente). */
  nome?: string;
  /** Entradas e saídas: o nome na tela ("tem cliente"). */
  rotulo?: string;
  /** Saída: como ela aparece acesa. */
  forma?: "lampada" | "porta" | "alarme";
  /** Entrada: ligada ou desligada. */
  ligada?: boolean;
  /** Veio pronta na fase: não sai da bancada (mas pode mudar de lugar). */
  fixa?: boolean;
};

/** Um fio sai da saída de uma peça e chega numa porta de entrada de outra. */
export type Fio = { de: string; para: string; porta: number };

export type Circuito = { pecas: Peca[]; fios: Fio[] };

export const LARGURA_BANCADA = 640;
export const ALTURA_BANCADA = 380;

/** Quantas portas de entrada cada peça tem. */
export function portasDeEntrada(tipo: TipoPeca): number {
  if (tipo === "entrada") return 0;
  if (tipo === "saida" || tipo === "nao") return 1;
  return 2;
}

export function temSaida(tipo: TipoPeca): boolean {
  return tipo !== "saida";
}

export const NOME_DO_PORTAO: Record<TipoPortao, string> = { e: "E", ou: "OU", nao: "NÃO", xou: "OU exclusivo" };

/** O operador do JavaScript de cada portão (o NÃO é o ! na frente). */
export const OPERADOR_DO_PORTAO: Record<TipoPortao, string> = { e: "&&", ou: "||", nao: "!", xou: "!==" };

function aplicar(tipo: TipoPortao, a: boolean, b: boolean): boolean {
  switch (tipo) {
    case "e":
      return a && b;
    case "ou":
      return a || b;
    case "nao":
      return !a;
    case "xou":
      return a !== b;
  }
}

export type Valores = Record<string, boolean>;

export type Simulacao = {
  /** O valor na saída de cada peça (e, para as saídas, o que chega nelas). */
  valores: Valores;
  /** Cada fio aceso ou apagado (pela chave `fioChave`). */
  fios: Record<string, boolean>;
  /** Não ficou estável (a realimentação fica trocando sozinha). */
  oscilou: boolean;
  /** Portas de entrada sem fio (contam como desligadas). */
  soltas: { peca: string; porta: number }[];
};

export function fioChave(fio: Fio): string {
  return `${fio.de}>${fio.para}:${fio.porta}`;
}

/** Simula a corrente. `anteriores`: o estado de antes (para a realimentação guardar). */
export function simular(circuito: Circuito, anteriores: Valores = {}): Simulacao {
  const porId = new Map(circuito.pecas.map((peca) => [peca.id, peca]));
  const chega = new Map<string, string>();
  for (const fio of circuito.fios) if (porId.has(fio.de) && porId.has(fio.para)) chega.set(`${fio.para}:${fio.porta}`, fio.de);
  const valores: Valores = {};
  for (const peca of circuito.pecas) valores[peca.id] = peca.tipo === "entrada" ? Boolean(peca.ligada) : Boolean(anteriores[peca.id]);
  const entradaDe = (peca: Peca, porta: number) => {
    const origem = chega.get(`${peca.id}:${porta}`);
    return origem !== undefined ? valores[origem] : false;
  };
  let oscilou = true;
  for (let rodada = 0; rodada < 32; rodada += 1) {
    let mudou = false;
    for (const peca of circuito.pecas) {
      if (peca.tipo === "entrada") continue;
      const novo = peca.tipo === "saida" ? entradaDe(peca, 0) : aplicar(peca.tipo, entradaDe(peca, 0), entradaDe(peca, 1));
      if (novo !== valores[peca.id]) {
        valores[peca.id] = novo;
        mudou = true;
      }
    }
    if (!mudou) {
      oscilou = false;
      break;
    }
  }
  const fios: Record<string, boolean> = {};
  for (const fio of circuito.fios) fios[fioChave(fio)] = Boolean(valores[fio.de]);
  const soltas: Simulacao["soltas"] = [];
  for (const peca of circuito.pecas) {
    for (let porta = 0; porta < portasDeEntrada(peca.tipo); porta += 1) if (!chega.has(`${peca.id}:${porta}`)) soltas.push({ peca: peca.id, porta });
  }
  return { valores, fios, oscilou, soltas };
}

export const entradasDo = (circuito: Circuito) => circuito.pecas.filter((peca) => peca.tipo === "entrada");
export const saidasDo = (circuito: Circuito) => circuito.pecas.filter((peca) => peca.tipo === "saida");

/** O nome de uma entrada ou saída no código e na tabela. */
export function nomeDa(peca: Peca): string {
  return peca.nome ?? peca.id;
}

export type LinhaTabela = { entradas: Record<string, boolean>; saidas: Record<string, boolean> };

/** A tabela verdade: todas as combinações das entradas (na ordem das peças), da primeira desligada à última ligada. */
export function tabelaVerdade(circuito: Circuito): LinhaTabela[] {
  const entradas = entradasDo(circuito);
  const saidas = saidasDo(circuito);
  const linhas: LinhaTabela[] = [];
  const total = 2 ** entradas.length;
  for (let n = 0; n < total; n += 1) {
    const combinacao: Record<string, boolean> = {};
    entradas.forEach((peca, i) => {
      combinacao[nomeDa(peca)] = Boolean((n >> (entradas.length - 1 - i)) & 1);
    });
    const comEntradas: Circuito = {
      ...circuito,
      pecas: circuito.pecas.map((peca) => (peca.tipo === "entrada" ? { ...peca, ligada: combinacao[nomeDa(peca)] } : peca)),
    };
    const { valores } = simular(comEntradas);
    const resultado: Record<string, boolean> = {};
    for (const saida of saidas) resultado[nomeDa(saida)] = valores[saida.id];
    linhas.push({ entradas: combinacao, saidas: resultado });
  }
  return linhas;
}

/** A linha da tabela que as entradas de agora formam. */
export function linhaAtual(circuito: Circuito): number {
  const entradas = entradasDo(circuito);
  return entradas.reduce((soma, peca, i) => soma + (peca.ligada ? 2 ** (entradas.length - 1 - i) : 0), 0);
}

/** A expressão do JavaScript que chega numa peça (o circuito como código). */
export function expressaoDa(circuito: Circuito, pecaId: string, porta = 0): string {
  const porId = new Map(circuito.pecas.map((peca) => [peca.id, peca]));
  const chega = new Map<string, string>();
  for (const fio of circuito.fios) chega.set(`${fio.para}:${fio.porta}`, fio.de);
  const montar = (origemId: string | undefined, visitados: string[], dentro: boolean): string => {
    if (origemId === undefined) return "false";
    const peca = porId.get(origemId);
    if (!peca) return "false";
    if (peca.tipo === "entrada") return nomeDa(peca);
    if (peca.tipo === "saida") return "false";
    if (visitados.includes(peca.id)) return "/* volta */ " + (peca.nome ?? "estadoAnterior");
    const agora = [...visitados, peca.id];
    const a = montar(chega.get(`${peca.id}:0`), agora, true);
    if (peca.tipo === "nao") return `!${/^[\w$]+$/.test(a) || a.startsWith("!") ? a : `(${a})`}`;
    const b = montar(chega.get(`${peca.id}:1`), agora, true);
    const texto = `${a} ${OPERADOR_DO_PORTAO[peca.tipo]} ${b}`;
    return dentro ? `(${texto})` : texto;
  };
  const alvo = porId.get(pecaId);
  if (!alvo) return "false";
  if (alvo.tipo === "saida") return montar(chega.get(`${alvo.id}:${porta}`), [], false);
  return montar(alvo.id, [], false);
}

/** O circuito inteiro como código: uma linha por saída. */
export function circuitoComoCodigo(circuito: Circuito): string {
  return saidasDo(circuito)
    .map((saida) => `const ${nomeDa(saida)} = ${expressaoDa(circuito, saida.id)};`)
    .join("\n");
}

/** Quantos portões desse tipo estão ligados em alguma coisa (a saída deles tem fio). */
export function portoesUsados(circuito: Circuito, tipo: TipoPortao): number {
  const comFio = new Set(circuito.fios.map((fio) => fio.de));
  return circuito.pecas.filter((peca) => peca.tipo === tipo && comFio.has(peca.id)).length;
}

/* ------------------------------------------------------------------ */
/* Mudanças (as mesmas para a interface, as ações e a simulação)      */
/* ------------------------------------------------------------------ */

/** Liga um fio. A porta que já tinha fio troca de fio. Não liga uma peça nela mesma nem da saída para a saída. */
export function ligarFio(circuito: Circuito, fio: Fio): Circuito | null {
  const de = circuito.pecas.find((peca) => peca.id === fio.de);
  const para = circuito.pecas.find((peca) => peca.id === fio.para);
  if (!de || !para || !temSaida(de.tipo) || fio.porta < 0 || fio.porta >= portasDeEntrada(para.tipo)) return null;
  if (de.id === para.id) return null;
  const outros = circuito.fios.filter((f) => !(f.para === fio.para && f.porta === fio.porta));
  return { ...circuito, fios: [...outros, fio] };
}

export function apagarFio(circuito: Circuito, para: string, porta: number): Circuito {
  return { ...circuito, fios: circuito.fios.filter((f) => !(f.para === para && f.porta === porta)) };
}

export function alternarEntrada(circuito: Circuito, id: string, ligada?: boolean): Circuito {
  return {
    ...circuito,
    pecas: circuito.pecas.map((peca) => (peca.id === id && peca.tipo === "entrada" ? { ...peca, ligada: ligada ?? !peca.ligada } : peca)),
  };
}

export function moverPeca(circuito: Circuito, id: string, x: number, y: number): Circuito {
  const cx = Math.max(0, Math.min(LARGURA_BANCADA - 60, Math.round(x)));
  const cy = Math.max(0, Math.min(ALTURA_BANCADA - 50, Math.round(y)));
  return { ...circuito, pecas: circuito.pecas.map((peca) => (peca.id === id ? { ...peca, x: cx, y: cy } : peca)) };
}

/** Um id livre para um portão novo: "e1", "e2", "ou1"... */
export function idLivre(circuito: Circuito, tipo: TipoPortao): string {
  let n = 1;
  while (circuito.pecas.some((peca) => peca.id === `${tipo}${n}`)) n += 1;
  return `${tipo}${n}`;
}

/** Um lugar vazio no meio da bancada para a peça nova. */
export function lugarLivre(circuito: Circuito): { x: number; y: number } {
  const candidatos: { x: number; y: number }[] = [];
  for (let y = 40; y <= ALTURA_BANCADA - 80; y += 70) for (let x = 220; x <= 420; x += 100) candidatos.push({ x, y });
  const livre = candidatos.find((lugar) => circuito.pecas.every((peca) => Math.abs(peca.x - lugar.x) > 60 || Math.abs(peca.y - lugar.y) > 50));
  return livre ?? { x: 280, y: 160 };
}

export function adicionarPortao(circuito: Circuito, tipo: TipoPortao, id?: string, lugar?: { x: number; y: number }): Circuito {
  const novoId = id && !circuito.pecas.some((peca) => peca.id === id) ? id : idLivre(circuito, tipo);
  const onde = lugar ?? lugarLivre(circuito);
  return { ...circuito, pecas: [...circuito.pecas, { id: novoId, tipo, x: onde.x, y: onde.y }] };
}

/** Tira a peça (e os fios dela). Peça fixa não sai. */
export function apagarPeca(circuito: Circuito, id: string): Circuito {
  const peca = circuito.pecas.find((p) => p.id === id);
  if (!peca || peca.fixa) return circuito;
  return { pecas: circuito.pecas.filter((p) => p.id !== id), fios: circuito.fios.filter((f) => f.de !== id && f.para !== id) };
}
