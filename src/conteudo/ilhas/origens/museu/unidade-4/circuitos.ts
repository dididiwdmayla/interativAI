/*
 * Sala 4: os circuitos do gigante e dos portões (o mesmo modelo do
 * circuito lógico da Ilha Lógica: src/motor/circuito/modelo.ts).
 *
 * O meio somador: a soma de dois bits é o OU exclusivo (acende se só uma
 * acender) e o vai um é o E (acende se as duas acenderem): 1 + 1 = 10.
 * A memória com realimentação: liga entra num OU, o OU entra num E junto
 * com o NÃO do desliga, e a saída do E volta para o OU (o selo).
 */
import type { Circuito } from "@/motor/circuito/modelo";
import type { LinhaEsperada } from "@/motor/exposicao/circuitoMuseu";

/** O painel do gigante: as chaves, as duas caixas de válvulas e as lâmpadas, sem cabo nenhum. */
export const PAINEL_DO_GIGANTE: Circuito = {
  pecas: [
    { id: "a", tipo: "entrada", nome: "a", rotulo: "A", x: 30, y: 70, fixa: true },
    { id: "b", tipo: "entrada", nome: "b", rotulo: "B", x: 30, y: 250, fixa: true },
    { id: "so-uma", tipo: "xou", x: 250, y: 60, fixa: true },
    { id: "as-duas", tipo: "e", x: 250, y: 240, fixa: true },
    { id: "soma", tipo: "saida", nome: "soma", rotulo: "soma", forma: "lampada", x: 520, y: 60, fixa: true },
    { id: "vai-um", tipo: "saida", nome: "vaiUm", rotulo: "vai um", forma: "lampada", x: 520, y: 240, fixa: true },
  ],
  fios: [],
};

export const LEGENDAS_DO_GIGANTE = { "so-uma": "ACENDE SE SÓ UMA ACENDER", "as-duas": "ACENDE SE AS DUAS ACENDEREM" };

const combinacoes = [
  [false, false],
  [true, false],
  [false, true],
  [true, true],
] as const;

/** A tabela do meio somador, só da soma, só do vai um, ou das duas. */
export function tabelaDoSomador(saidas: "soma" | "vaiUm" | "as-duas"): LinhaEsperada[] {
  return combinacoes.map(([a, b]) => {
    const soma = a !== b;
    const vaiUm = a && b;
    const saida: Record<string, boolean> = saidas === "soma" ? { soma } : saidas === "vaiUm" ? { vaiUm } : { soma, vaiUm };
    return { entradas: { a, b }, saida };
  });
}

/** A bancada do somador com portões: só as chaves e as lâmpadas. */
export const BANCADA_DO_SOMADOR: Circuito = {
  pecas: [
    { id: "a", tipo: "entrada", nome: "a", rotulo: "A", x: 24, y: 40, fixa: true },
    { id: "b", tipo: "entrada", nome: "b", rotulo: "B", x: 24, y: 260, fixa: true },
    { id: "soma", tipo: "saida", nome: "soma", rotulo: "soma", forma: "lampada", x: 540, y: 40, fixa: true },
    { id: "vai-um", tipo: "saida", nome: "vaiUm", rotulo: "vai um", forma: "lampada", x: 540, y: 260, fixa: true },
  ],
  fios: [],
};

/** O selo: os portões já ligados, faltando só o fio que volta (a realimentação). */
export const BANCADA_DO_SELO: Circuito = {
  pecas: [
    { id: "liga", tipo: "entrada", nome: "liga", rotulo: "liga", x: 24, y: 40, fixa: true },
    { id: "desliga", tipo: "entrada", nome: "desliga", rotulo: "desliga", x: 24, y: 260, fixa: true },
    { id: "ou1", tipo: "ou", x: 210, y: 60, fixa: true },
    { id: "nao1", tipo: "nao", x: 210, y: 250, fixa: true },
    { id: "e1", tipo: "e", x: 380, y: 150, fixa: true },
    { id: "luz", tipo: "saida", nome: "luz", rotulo: "luz", forma: "lampada", x: 540, y: 150, fixa: true },
  ],
  fios: [
    { de: "liga", para: "ou1", porta: 0 },
    { de: "desliga", para: "nao1", porta: 0 },
    { de: "ou1", para: "e1", porta: 0 },
    { de: "nao1", para: "e1", porta: 1 },
    { de: "e1", para: "luz", porta: 0 },
  ],
};

/** O alarme do desafio: o mesmo selo, com outros nomes. */
export const BANCADA_DO_ALARME: Circuito = {
  pecas: [
    { id: "sensor", tipo: "entrada", nome: "sensor", rotulo: "sensor da porta", x: 24, y: 40, fixa: true },
    { id: "botao", tipo: "entrada", nome: "botao", rotulo: "botão de silêncio", x: 24, y: 260, fixa: true },
    { id: "ou1", tipo: "ou", x: 210, y: 60, fixa: true },
    { id: "nao1", tipo: "nao", x: 210, y: 250, fixa: true },
    { id: "e1", tipo: "e", x: 380, y: 150, fixa: true },
    { id: "alarme", tipo: "saida", nome: "alarme", rotulo: "alarme", forma: "alarme", x: 540, y: 150, fixa: true },
  ],
  fios: [
    { de: "sensor", para: "ou1", porta: 0 },
    { de: "botao", para: "nao1", porta: 0 },
    { de: "ou1", para: "e1", porta: 0 },
    { de: "nao1", para: "e1", porta: 1 },
    { de: "e1", para: "alarme", porta: 0 },
  ],
};
