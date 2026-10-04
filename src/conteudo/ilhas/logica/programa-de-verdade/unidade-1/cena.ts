/*
 * A cena do contrato da Lógica: um dia inteiro na vitrine da Padaria Pão de
 * Mel, das 6h às 21h (cada hora passa em 2 segundos: o relógio da parede
 * conta). Os aparelhos que a Dona Celeste quer automatizar: a luz da
 * vitrine, o letreiro, o forno com a campainha de aviso, o sensor da porta
 * e o relógio. Os clientes chegam e vão embora ao longo do dia.
 *
 * As linhas do tempo de teste (outros dias, com outros clientes) ficam aqui
 * também: o contrato confere a luz e o contador de clientes em cada uma.
 */
import type { AcontecimentoCena, DadosCena } from "@/motor/cena/modelo";

/** Uma hora do dia na cena, em milissegundos (a cena começa às 6h). */
export const HORA_MS = 2_000;
/** O instante (ms) de uma hora do dia: emHora(7) = 2000 (a abertura). */
export const emHora = (hora: number) => (hora - 6) * HORA_MS;

const cliente = (chegaMs: number, saiMs: number, x: number, lado: "esquerda" | "direita" = "direita"): AcontecimentoCena => ({ tipo: "pessoa", chegaMs, saiMs, x, lado });

/** O dia que a cena mostra: 4 clientes (7h30, 10h30, 13h30 e 16h30). */
export const DIA_DA_CENA: AcontecimentoCena[] = [cliente(3_000, 4_000, 236), cliente(9_000, 10_000, 244, "esquerda"), cliente(15_000, 15_800, 232), cliente(21_000, 22_000, 240, "esquerda")];
/** Um dia calmo de manhã: ninguém até 8h48, dois clientes quase seguidos e um à tarde (3 clientes). */
export const DIA_CALMO: AcontecimentoCena[] = [cliente(5_600, 6_400, 236), cliente(7_000, 7_800, 244, "esquerda"), cliente(17_000, 18_000, 238)];
/** Um dia corrido: cliente logo na abertura, outro em seguida e mais três ao longo do dia (5 clientes). */
export const DIA_CORRIDO: AcontecimentoCena[] = [cliente(2_400, 3_000, 236), cliente(3_600, 4_200, 244, "esquerda"), cliente(8_000, 9_000, 232), cliente(14_000, 14_600, 240, "esquerda"), cliente(24_000, 25_000, 236)];

export const DIAS_DE_TESTE = [DIA_DA_CENA, DIA_CALMO, DIA_CORRIDO];

export const CENA_DIA_NA_PADARIA: DadosCena = {
  id: "padaria-expediente",
  titulo: "Um dia na Padaria Pão de Mel",
  ambiente: "vitrine",
  periodo: "dia",
  duracaoMs: 30_000,
  cenario: [
    { peca: "parede", x: 0, y: 0, largura: 320, altura: 156, variante: "tijolos" },
    // Dentro da vitrine: a parede da loja, os pães, o forno e o balcão.
    { peca: "parede", x: 22, y: 54, largura: 176, altura: 88 },
    { peca: "prateleira", x: 30, y: 62, largura: 76, altura: 26, variante: "paes" },
    { peca: "balcao", x: 28, y: 104, largura: 92, altura: 38, variante: "padaria" },
    { peca: "vitrine", x: 22, y: 54, largura: 176, altura: 88 },
    { peca: "toldo", x: 12, y: 32, largura: 196, altura: 24 },
    { peca: "porta", x: 228, y: 70, largura: 46, altura: 82, variante: "vidro" },
    { peca: "planta", x: 284, y: 112, largura: 24, altura: 42 },
    { peca: "piso", x: 0, y: 152, largura: 320, altura: 48, variante: "calcada" },
  ],
  dispositivos: [
    { id: "letreiro", tipo: "letreiro", x: 54, y: 4, nome: "Letreiro" },
    { id: "luz", tipo: "lampada", x: 110, y: 62, variante: "spot", nome: "Luz da vitrine" },
    { id: "forno", tipo: "forno", x: 126, y: 72, escala: 0.9, nome: "Forno" },
    { id: "campainha", tipo: "campainha", x: 213, y: 72, nome: "Campainha do forno" },
    { id: "sensor", tipo: "sensor", x: 251, y: 62, nome: "Sensor da porta" },
    { id: "relogio", tipo: "relogio", x: 292, y: 30, inicial: { hora: 6 }, nome: "Relógio" },
  ],
  linhaDoTempo: DIA_DA_CENA,
};
