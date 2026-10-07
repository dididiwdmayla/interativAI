/*
 * O circuito no museu (sala 4): o mesmo modelo do circuito lógico da Ilha
 * Lógica (src/motor/circuito/modelo.ts), numa estação da exposição.
 *
 * - aparência "cabos": o painel do gigante de válvulas. As peças já estão
 *   no painel (as chaves, as caixas de válvulas e as lâmpadas); o aluno só
 *   pluga os cabos, como se programava nos anos 1940.
 * - aparência "portoes": a bancada de sempre, com a paleta de portões
 *   (E, OU, NÃO). Aqui moram o meio somador e a memória com realimentação.
 *
 * A realimentação guarda estado: cada mudança simula a partir do estado de
 * antes (`anteriores`), como a bancada da tela. É o princípio da memória e
 * do selo de uma contatora (a futura trilha Automação).
 */
import {
  adicionarPortao,
  alternarEntrada,
  apagarFio,
  apagarPeca,
  type Circuito,
  entradasDo,
  ligarFio,
  moverPeca,
  nomeDa,
  saidasDo,
  simular,
  tabelaVerdade,
  type TipoPortao,
  type Valores,
} from "../circuito/modelo";
import { ehObjeto, KEBAB, repetidos, tamanho } from "./comum";

export type EstacaoCircuito = {
  id: string;
  tipo: "circuito";
  titulo: string;
  aparencia: "cabos" | "portoes";
  /** O circuito do começo (no painel de cabos: todas as peças, fixas, e nenhum fio). */
  inicial: Circuito;
  /** Os portões que dá para pôr (só nos portões). */
  paleta: TipoPortao[];
  /** (Cabos) O que está escrito em cada caixa de válvulas, pelo id da peça. Até 40. */
  legendas?: Record<string, string>;
};

export type EstadoCircuito = { tipo: "circuito"; circuito: Circuito; anteriores: Valores };

/** Uma mudança no circuito (as mesmas da bancada da Ilha Lógica). */
export type MudancaCircuito =
  | { tipo: "portao"; portao: TipoPortao; id: string }
  | { tipo: "fio"; de: string; para: string; porta?: number }
  | { tipo: "soltar"; para: string; porta: number }
  | { tipo: "chave"; entrada: string; ligada?: boolean }
  | { tipo: "apagar"; id: string }
  | { tipo: "mover"; id: string; x: number; y: number };

export function estadoInicialCircuito(estacao: EstacaoCircuito): EstadoCircuito {
  return { tipo: "circuito", circuito: estacao.inicial, anteriores: simular(estacao.inicial).valores };
}

export function mexerNoCircuito(estacao: EstacaoCircuito, estado: EstadoCircuito, mudanca: MudancaCircuito): EstadoCircuito | null {
  const atual = estado.circuito;
  let novo: Circuito | null;
  switch (mudanca.tipo) {
    case "portao":
      if (estacao.aparencia === "cabos" || !estacao.paleta.includes(mudanca.portao) || atual.pecas.some((p) => p.id === mudanca.id)) return null;
      novo = adicionarPortao(atual, mudanca.portao, mudanca.id);
      break;
    case "fio":
      novo = ligarFio(atual, { de: mudanca.de, para: mudanca.para, porta: mudanca.porta ?? 0 });
      if (novo && atual.fios.some((f) => f.de === mudanca.de && f.para === mudanca.para && f.porta === (mudanca.porta ?? 0))) return null;
      break;
    case "soltar":
      if (!atual.fios.some((f) => f.para === mudanca.para && f.porta === mudanca.porta)) return null;
      novo = apagarFio(atual, mudanca.para, mudanca.porta);
      break;
    case "chave":
      if (!atual.pecas.some((p) => p.id === mudanca.entrada && p.tipo === "entrada")) return null;
      novo = alternarEntrada(atual, mudanca.entrada, mudanca.ligada);
      break;
    case "apagar": {
      const peca = atual.pecas.find((p) => p.id === mudanca.id);
      if (!peca || peca.fixa) return null;
      novo = apagarPeca(atual, mudanca.id);
      break;
    }
    case "mover":
      if (estacao.aparencia === "cabos" || !atual.pecas.some((p) => p.id === mudanca.id)) return null;
      novo = moverPeca(atual, mudanca.id, mudanca.x, mudanca.y);
      break;
  }
  if (!novo) return null;
  return { tipo: "circuito", circuito: novo, anteriores: simular(novo, estado.anteriores).valores };
}

/** A simulação de agora (a partir do estado guardado: a realimentação lembra). */
export function simulacaoDoCircuito(estado: EstadoCircuito) {
  return simular(estado.circuito, estado.anteriores);
}

export type LinhaEsperada = { entradas: Record<string, boolean>; saida: boolean | Record<string, boolean> };

/** O circuito dá a tabela pedida (só as saídas citadas). */
export function circuitoDaTabela(circuito: Circuito, esperado: readonly LinhaEsperada[]): { passou: boolean; detalhe: string } {
  const tabela = tabelaVerdade(circuito);
  const erradas: string[] = [];
  for (const linha of esperado) {
    const achada = tabela.find((t) => Object.entries(linha.entradas).every(([nome, valor]) => t.entradas[nome] === valor));
    const combinacao = Object.entries(linha.entradas)
      .map(([nome, valor]) => `${nome}=${valor ? 1 : 0}`)
      .join(", ");
    if (!achada) {
      erradas.push(`${combinacao}: o circuito não tem essas entradas`);
      continue;
    }
    const nomes = Object.keys(achada.saidas);
    const pedida = typeof linha.saida === "boolean" ? (nomes.length === 1 ? { [nomes[0]]: linha.saida } : null) : linha.saida;
    if (!pedida) {
      erradas.push(`${combinacao}: o circuito tem ${nomes.length} saídas`);
      continue;
    }
    for (const [nome, valor] of Object.entries(pedida)) if (achada.saidas[nome] !== valor) erradas.push(`${combinacao}: ${nome} deu ${achada.saidas[nome] ? 1 : 0}, esperado ${valor ? 1 : 0}`);
  }
  return { passou: erradas.length === 0, detalhe: erradas.length ? erradas.slice(0, 4).join("; ") : "todas as linhas batem" };
}

/** As chaves e as saídas de agora batem com o pedido (ex.: 1 + 1 aceso como "10"). */
export function circuitoAgora(estado: EstadoCircuito, entradas: Record<string, boolean>, saidas: Record<string, boolean>): { passou: boolean; detalhe: string } {
  const { valores } = simulacaoDoCircuito(estado);
  const porNome = new Map(estado.circuito.pecas.map((p) => [nomeDa(p), p]));
  const fora: string[] = [];
  for (const [nome, valor] of Object.entries(entradas)) if (Boolean(porNome.get(nome)?.ligada) !== valor) fora.push(`a chave ${nome} ${valor ? "desligada" : "ligada"}`);
  for (const [nome, valor] of Object.entries(saidas)) {
    const peca = porNome.get(nome);
    if (!peca || Boolean(valores[peca.id]) !== valor) fora.push(`${nome} ${valor ? "apagada" : "acesa"}`);
  }
  return { passou: fora.length === 0, detalhe: fora.length ? fora.join("; ") : "as chaves e as lâmpadas batem" };
}

/**
 * A memória com realimentação: liga e solta `liga` (a saída fica acesa:
 * lembrou), liga e solta `desliga` (apaga e fica apagada). Começa com as
 * chaves todas desligadas e a memória vazia.
 */
export function circuitoLembra(circuito: Circuito, saida: string, liga: string, desliga: string): { passou: boolean; detalhe: string } {
  const pecaSaida = circuito.pecas.find((p) => p.tipo === "saida" && nomeDa(p) === saida);
  const chaveLiga = circuito.pecas.find((p) => p.tipo === "entrada" && nomeDa(p) === liga);
  const chaveDesliga = circuito.pecas.find((p) => p.tipo === "entrada" && nomeDa(p) === desliga);
  if (!pecaSaida || !chaveLiga || !chaveDesliga) return { passou: false, detalhe: "o circuito não tem a saída ou as chaves pedidas" };
  let atual: Circuito = { ...circuito, pecas: circuito.pecas.map((p) => (p.tipo === "entrada" ? { ...p, ligada: false } : p)) };
  let valores = simular(atual).valores;
  const passos: [string, string, boolean, boolean][] = [
    [chaveLiga.id, `apertou ${liga}`, true, true],
    [chaveLiga.id, `soltou ${liga}`, false, true],
    [chaveDesliga.id, `apertou ${desliga}`, true, false],
    [chaveDesliga.id, `soltou ${desliga}`, false, false],
  ];
  for (const [chave, descricao, ligada, esperado] of passos) {
    atual = alternarEntrada(atual, chave, ligada);
    const simulacao = simular(atual, valores);
    if (simulacao.oscilou) return { passou: false, detalhe: `${descricao}: o circuito ficou piscando sozinho` };
    valores = simulacao.valores;
    if (Boolean(valores[pecaSaida.id]) !== esperado) return { passou: false, detalhe: `${descricao}: ${saida} ficou ${valores[pecaSaida.id] ? "acesa" : "apagada"}` };
  }
  return { passou: true, detalhe: "acende, lembra e apaga" };
}

export function lerEstadoCircuito(valor: Record<string, unknown>): EstadoCircuito | null {
  const circuito = valor.circuito;
  if (!ehObjeto(circuito) || !Array.isArray(circuito.pecas) || !Array.isArray(circuito.fios)) return null;
  const pecas = circuito.pecas.filter(ehObjeto).slice(0, 30);
  const fios = circuito.fios.filter(ehObjeto).slice(0, 60);
  const okPecas = pecas.every((p) => typeof p.id === "string" && typeof p.tipo === "string" && typeof p.x === "number" && typeof p.y === "number");
  const okFios = fios.every((f) => typeof f.de === "string" && typeof f.para === "string" && typeof f.porta === "number");
  if (!okPecas || !okFios) return null;
  const anteriores: Valores = {};
  if (ehObjeto(valor.anteriores)) for (const [id, v] of Object.entries(valor.anteriores)) if (typeof v === "boolean") anteriores[id] = v;
  return { tipo: "circuito", circuito: { pecas, fios } as unknown as Circuito, anteriores };
}

const TIPOS_DE_PECA = new Set(["entrada", "saida", "e", "ou", "nao", "xou"]);

export function circuitoCabe(estacao: EstacaoCircuito, estado: EstadoCircuito): boolean {
  const fixas = estacao.inicial.pecas.filter((p) => p.fixa);
  const ids = new Set(estado.circuito.pecas.map((p) => p.id));
  return (
    estado.circuito.pecas.every((p) => TIPOS_DE_PECA.has(p.tipo)) &&
    fixas.every((p) => ids.has(p.id)) &&
    estado.circuito.fios.every((f) => ids.has(f.de) && ids.has(f.para)) &&
    (estacao.aparencia === "portoes" || estado.circuito.pecas.length === estacao.inicial.pecas.length)
  );
}

export function conferirCircuito(estacao: EstacaoCircuito, onde: string): string[] {
  const p: string[] = [];
  const { inicial } = estacao;
  p.push(...repetidos(inicial.pecas.map((x) => x.id)).map((id) => `${onde}: peça com id repetido "${id}"`));
  if (!entradasDo(inicial).length || !saidasDo(inicial).length) p.push(`${onde}: o circuito precisa de pelo menos uma chave (entrada) e uma saída`);
  for (const peca of inicial.pecas) if (!/^[a-z][a-zA-Z0-9]*$/.test(peca.id) && !KEBAB.test(peca.id)) p.push(`${onde}: a peça "${peca.id}" tem id estranho`);
  if (estacao.aparencia === "cabos") {
    if (estacao.paleta.length) p.push(`${onde}: o painel de cabos não tem paleta (as peças já estão no painel)`);
    if (inicial.pecas.some((x) => !x.fixa)) p.push(`${onde}: no painel de cabos, todas as peças são fixas`);
    for (const peca of inicial.pecas.filter((x) => x.tipo !== "entrada" && x.tipo !== "saida")) {
      const legenda = estacao.legendas?.[peca.id];
      if (!legenda) p.push(`${onde}: a caixa de válvulas "${peca.id}" precisa de legenda`);
      else tamanho(p, `${onde}: legenda de "${peca.id}"`, legenda, 40);
    }
  } else if (!estacao.paleta.length) p.push(`${onde}: a bancada de portões precisa de paleta`);
  return p;
}
