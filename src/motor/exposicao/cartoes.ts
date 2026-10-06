/*
 * Duas estações de cartões do museu:
 *
 * - "ligar": cada cartão vai para o alvo certo (a linguagem e o uso dela,
 *   o front e o back, quem programa o quê). Vários cartões podem ir para o
 *   mesmo alvo. Cartão no alvo certo mostra a revelação dele.
 * - "ordem": os itens numa fila, na ordem certa: uma escada (do mais perto
 *   da máquina ao mais perto da gente) ou as etapas de um acontecimento.
 *   Item no lugar certo (em relação aos outros da fila) acende.
 *
 * Puro: a tela, a simulação e os validadores usam as mesmas funções.
 */
import { ehObjeto, embaralharFixo, filaEmOrdem, KEBAB, noLugarCerto, porNaFila, repetidos, semRepetir, tamanho, textos } from "./comum";

/* ------------------------------------------------------------------ ligar */

export type AlvoLigar = { id: string; nome: string; descricao?: string };

export type CartaoLigar = {
  id: string;
  /** O texto do cartão. Até 70. */
  texto: string;
  /** O id do alvo certo. */
  alvo: string;
  /** O que aparece quando o cartão chega no alvo certo. Até 140. */
  revela?: string;
};

export type EstacaoLigar = {
  id: string;
  tipo: "ligar";
  titulo: string;
  /** A pergunta da mesa ("Cada linguagem no seu serviço"). Até 90. */
  pergunta: string;
  alvos: AlvoLigar[];
  cartoes: CartaoLigar[];
};

export type EstadoLigar = { tipo: "ligar"; ligacoes: Record<string, string> };

export function estadoInicialLigar(): EstadoLigar {
  return { tipo: "ligar", ligacoes: {} };
}

/** Põe o cartão no alvo (ou, com null, devolve para a mesa). */
export function ligarCartao(estacao: EstacaoLigar, estado: EstadoLigar, cartao: string, alvo: string | null): EstadoLigar | null {
  if (!estacao.cartoes.some((c) => c.id === cartao)) return null;
  if (alvo !== null && !estacao.alvos.some((a) => a.id === alvo)) return null;
  const ligacoes = { ...estado.ligacoes };
  if (alvo === null) {
    if (!(cartao in ligacoes)) return null;
    delete ligacoes[cartao];
  } else {
    if (ligacoes[cartao] === alvo) return null;
    ligacoes[cartao] = alvo;
  }
  return { tipo: "ligar", ligacoes };
}

export function cartaoCerto(estacao: EstacaoLigar, estado: EstadoLigar, cartao: string): boolean {
  const dados = estacao.cartoes.find((c) => c.id === cartao);
  return dados !== undefined && estado.ligacoes[cartao] === dados.alvo;
}

export function cartoesLigados(estacao: EstacaoLigar, estado: EstadoLigar, cartoes?: readonly string[]): { passou: boolean; detalhe: string } {
  const pedidos = estacao.cartoes.filter((c) => !cartoes || cartoes.includes(c.id));
  const errados = pedidos.filter((c) => estado.ligacoes[c.id] !== c.alvo).map((c) => c.id);
  return errados.length ? { passou: false, detalhe: `fora do lugar certo: ${errados.join(", ")}` } : { passou: true, detalhe: "todos no lugar certo" };
}

/** A ordem dos cartões na mesa: embaralhada, sempre igual. */
export function ordemNaMesa(estacao: EstacaoLigar): string[] {
  return embaralharFixo(
    estacao.cartoes.map((c) => c.id),
    estacao.pergunta.length,
  );
}

export function lerEstadoLigar(valor: Record<string, unknown>): EstadoLigar {
  const ligacoes: Record<string, string> = {};
  if (ehObjeto(valor.ligacoes)) for (const [cartao, alvo] of Object.entries(valor.ligacoes).slice(0, 12)) if (typeof alvo === "string") ligacoes[cartao] = alvo;
  return { tipo: "ligar", ligacoes };
}

export function ligarCabe(estacao: EstacaoLigar, estado: EstadoLigar): boolean {
  return Object.entries(estado.ligacoes).every(([cartao, alvo]) => estacao.cartoes.some((c) => c.id === cartao) && estacao.alvos.some((a) => a.id === alvo));
}

export function conferirLigar(estacao: EstacaoLigar, onde: string): string[] {
  const p: string[] = [];
  tamanho(p, `${onde}: pergunta`, estacao.pergunta, 90);
  if (estacao.alvos.length < 2 || estacao.alvos.length > 8) p.push(`${onde}: ${estacao.alvos.length} alvos (de 2 a 8)`);
  if (estacao.cartoes.length < 2 || estacao.cartoes.length > 10) p.push(`${onde}: ${estacao.cartoes.length} cartões (de 2 a 10)`);
  p.push(...repetidos([...estacao.alvos.map((a) => a.id), ...estacao.cartoes.map((c) => c.id)]).map((id) => `${onde}: id repetido "${id}" (alvos e cartões)`));
  for (const alvo of estacao.alvos) {
    if (!KEBAB.test(alvo.id)) p.push(`${onde}: o alvo "${alvo.id}" não está em kebab-case`);
    tamanho(p, `${onde}: nome do alvo "${alvo.id}"`, alvo.nome, 40);
    if (alvo.descricao !== undefined) tamanho(p, `${onde}: descricao do alvo "${alvo.id}"`, alvo.descricao, 80);
    if (!estacao.cartoes.some((c) => c.alvo === alvo.id)) p.push(`${onde}: nenhum cartão vai para o alvo "${alvo.id}"`);
  }
  for (const cartao of estacao.cartoes) {
    if (!KEBAB.test(cartao.id)) p.push(`${onde}: o cartão "${cartao.id}" não está em kebab-case`);
    tamanho(p, `${onde}: texto do cartão "${cartao.id}"`, cartao.texto, 70);
    if (cartao.revela !== undefined) tamanho(p, `${onde}: revela do cartão "${cartao.id}"`, cartao.revela, 140);
    if (!estacao.alvos.some((a) => a.id === cartao.alvo)) p.push(`${onde}: o cartão "${cartao.id}" vai para "${cartao.alvo}", que não é alvo`);
  }
  return p;
}

/* ------------------------------------------------------------------ ordem */

export type ItemOrdem = {
  id: string;
  /** Até 48. */
  texto: string;
  /** O que aparece quando o item está no lugar certo. Até 140. */
  revela?: string;
};

export type EstacaoOrdem = {
  id: string;
  tipo: "ordem";
  titulo: string;
  /** "escada": de baixo para cima, como degraus; "etapas": de cima para baixo, numeradas. */
  aparencia: "escada" | "etapas";
  /** JÁ NA ORDEM CERTA (o primeiro degrau, ou a primeira etapa); a tela embaralha. De 3 a 8. */
  itens: ItemOrdem[];
  /** As pontas da fila ("Perto da máquina", "Perto da gente"). Até 32 cada. */
  pontas: { inicio: string; fim: string };
};

export type EstadoOrdem = { tipo: "ordem"; fila: string[] };

export function estadoInicialOrdem(): EstadoOrdem {
  return { tipo: "ordem", fila: [] };
}

export function porNaOrdem(estacao: EstacaoOrdem, estado: EstadoOrdem, item: string, posicao?: number): EstadoOrdem | null {
  if (!estacao.itens.some((i) => i.id === item)) return null;
  return { tipo: "ordem", fila: porNaFila(estado.fila, item, posicao) };
}

export function tirarDaOrdem(estacao: EstacaoOrdem, estado: EstadoOrdem, item: string): EstadoOrdem | null {
  if (!estado.fila.includes(item)) return null;
  return { tipo: "ordem", fila: estado.fila.filter((id) => id !== item) };
}

export function itemNoLugar(estacao: EstacaoOrdem, estado: EstadoOrdem, item: string): boolean {
  return noLugarCerto(
    estacao.itens.map((i) => i.id),
    estado.fila,
    item,
  );
}

export function ordemCerta(estacao: EstacaoOrdem, estado: EstadoOrdem, itens?: readonly string[]): { passou: boolean; detalhe: string } {
  const certa = estacao.itens.map((i) => i.id);
  return filaEmOrdem(certa, estado.fila, itens ?? certa);
}

export function ordemNaCaixaDeItens(estacao: EstacaoOrdem): string[] {
  return embaralharFixo(
    estacao.itens.map((i) => i.id),
    estacao.titulo.length,
  );
}

export function lerEstadoOrdem(valor: Record<string, unknown>): EstadoOrdem {
  return { tipo: "ordem", fila: semRepetir(textos(valor.fila, 8)) };
}

export function ordemCabe(estacao: EstacaoOrdem, estado: EstadoOrdem): boolean {
  return estado.fila.every((id) => estacao.itens.some((i) => i.id === id));
}

export function conferirOrdem(estacao: EstacaoOrdem, onde: string): string[] {
  const p: string[] = [];
  if (estacao.itens.length < 3 || estacao.itens.length > 8) p.push(`${onde}: ${estacao.itens.length} itens (de 3 a 8)`);
  p.push(...repetidos(estacao.itens.map((i) => i.id)).map((id) => `${onde}: item com id repetido "${id}"`));
  tamanho(p, `${onde}: pontas.inicio`, estacao.pontas.inicio, 32);
  tamanho(p, `${onde}: pontas.fim`, estacao.pontas.fim, 32);
  for (const item of estacao.itens) {
    if (!KEBAB.test(item.id)) p.push(`${onde}: o item "${item.id}" não está em kebab-case`);
    tamanho(p, `${onde}: texto do item "${item.id}"`, item.texto, 48);
    if (item.revela !== undefined) tamanho(p, `${onde}: revela do item "${item.id}"`, item.revela, 140);
  }
  return p;
}
